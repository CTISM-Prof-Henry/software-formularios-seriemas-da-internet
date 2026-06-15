import csv
from io import BytesIO
from datetime import timedelta
from django.utils import timezone
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Count, F

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER

from risco.models import Risco, RecomendacaoAuditoria
from risco.serializer import RiscoSerializer, RecomendacaoAuditoriaSerializer
from usuario.authentications import CsrfExemptSessionAuthentication, IsAuditorPermission


@api_view(['GET'])
def get_riscos(request):

    try:
        riscos = Risco.objects.all()

        serializer = RiscoSerializer(riscos, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    summary="Listar ou Contar Riscos",
    description="Retorna a lista de riscos ordenados do mais recente para o mais antigo. Pode ser filtrada por limite ou retornar apenas a contagem total.",
    parameters=[
        OpenApiParameter(
            name='limit',
            description='Limita a quantidade de riscos retornados na tabela (máximo travado em 15 no backend).',
            required=False,
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name='count',
            description='Se passado como "True", ignora a lista e retorna apenas o total numérico de riscos registrados no banco.',
            required=False,
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
        ),
    ]
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def listar_riscos(request):

    usuario = request.user

    if not usuario.centro_ativo:
        return Response({"erro": "Nenhum centro ativo selecionado!"}, status=status.HTTP_404_NOT_FOUND)

    centros_ids = list(usuario.centros_permitidos.values_list('id', flat=True))

    if usuario.unidade_id and usuario.unidade_id not in centros_ids:
        centros_ids.append(usuario.unidade_id)

    riscos = Risco.objects.select_related('categoria', 'responsavel', 'desafio') \
        .filter(unidade_responsavel__in=centros_ids)


    centro_filtro = request.query_params.get('centro', None)

    if centro_filtro:
        riscos = riscos.filter(unidade_responsavel_id=centro_filtro)

    query = request.GET.get('q', '')
    categoria = request.GET.get('categoria', '')
    desafio = request.GET.get('desafio', '')
    status_filtro = request.GET.get('status', '')
    ordenacao = request.GET.get('ordering', '-id')
    limit = request.GET.get('limit')

    riscos = riscos.order_by(ordenacao)

    if query:
        riscos = riscos.filter(
            Q(titulo__icontains=query) |
            Q(id_estrutural__icontains=query) |
            Q(codigo__icontains=query) |
            Q(desafio__nome__icontains=query)
        )

    if categoria:
        riscos = riscos.filter(categoria__nome_categoria__icontains=categoria)

    if desafio:
        riscos = riscos.filter(desafio__nome__icontains=desafio)

    if status_filtro:
        riscos = riscos.filter(status__icontains=status_filtro)

    if request.GET.get('count'):

        riscos_calculados = riscos.annotate(
            score=F('impacto') * F('probabilidade')
        )

        kpis = riscos_calculados.aggregate(
            count=Count('id'),
            criticos=Count('id', filter=Q(score__gt=14) | Q(nivel__icontains='crítico')),
            medios=Count('id', filter=Q(score__gt=6, score__lte=14) ),
            em_tratamento=Count('id', filter=Q(status__icontains='trata')),
            concluidos=Count('id', filter=Q(status__icontains='conclu'))
        )

        kpis['total_absoluto'] = riscos.count()

        return Response(kpis, status=status.HTTP_200_OK)

    if limit:
        try:
            riscos = riscos[:int(limit)]

        except ValueError:
            pass

    if not riscos.exists():
        return Response([], status=status.HTTP_200_OK)


    serializer = RiscoSerializer(riscos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def get_risco_by_id(request, pk):

    try:
        risco = Risco.objects.get(pk=pk)

        serializer = RiscoSerializer(risco)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Risco.DoesNotExist:
        return Response({"error": "Risco não encontrado"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@csrf_exempt
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def create_risco(request):
    user = request.user

    centro_user = user.centro_ativo

    if not centro_user:
        return Response(
            {"erro": "Usuário não possui um centro ativo selecionado."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        serializer = RiscoSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(centro=centro_user)

            return Response({
                "message": "Risco criado com sucesso!",
                "risco": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "erro": "Dados inválidos",
            "detalhes": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@csrf_exempt
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_risco_etapa(request, pk):
    try:

        risco = Risco.objects.get(pk=pk)

    except Risco.DoesNotExist:

        return Response({
            "erro": "Risco não encontrado no banco de dados."
        }, status=status.HTTP_404_NOT_FOUND)

    try:

        serializer = RiscoSerializer(risco, data=request.data, partial=True)

        if serializer.is_valid():

            serializer.save()

            return Response({
                "message": "Etapa atualizada com sucesso!",
                "risco": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "erro": "Dados inválidos",
            "detalhes": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:

        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def historico_risco(request, id):
    try:
        risco = Risco.objects.get(pk=id)
        versoes = risco.history.all().order_by('-history_date')

        dados_historico = []
        for versao in versoes:

            acao = "Criado" if versao.history_type == '+' else "Atualizado"

            dados_historico.append({
                "id_versao": versao.history_id,
                "data": versao.history_date.strftime("%d/%m/%Y %H:%M"),
                "usuario": versao.history_user.first_name if versao.history_user else "Sistema",
                "acao": acao,
                "status_na_epoca": versao.status,
                "nivel_na_epoca": versao.nivel
            })

        return Response(dados_historico, status=200)
    except Risco.DoesNotExist:
        return Response({"erro": "Risco não encontrado"}, status=404)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def criar_recomendacao(request, pk):

    if request.user.perfil_acesso.lower() != 'auditor':
        return Response({"erro": "Acesso negado. Apenas auditores podem criar recomendações."}, status=403)

    try:
        risco = Risco.objects.get(pk=pk)
        texto = request.data.get('texto')

        recomendacao = RecomendacaoAuditoria.objects.create(
            risco=risco,
            auditor=request.user,
            texto=texto
        )

        return Response({"message": "Recomendação enviada!"}, status=201)

    except Risco.DoesNotExist:
        return Response({"erro": "Risco não encontrado"}, status=404)




@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated, IsAuditorPermission])
def fazer_recomendacao(request, pk):
    try:

        risco = Risco.objects.get(id=pk)
    except Risco.DoesNotExist:
        return Response(
            {"erro": f"O risco com ID {pk} não foi encontrado."},
            status=status.HTTP_404_NOT_FOUND
        )

    try:

        texto_recomendacao = request.data.get('texto', '').strip()

        if not texto_recomendacao:
            return Response(
                {"erro": "O campo 'texto' é obrigatório e não pode estar em branco."},
                status=status.HTTP_400_BAD_REQUEST
            )


        recomendacao = RecomendacaoAuditoria.objects.create(
            risco=risco,
            auditor=request.user,
            texto=texto_recomendacao
        )

        return Response({
            "mensagem": "Recomendação registrada com sucesso!",
            "id": recomendacao.id,
            "auditor_nome": request.user.first_name or request.user.username,
            "texto": recomendacao.texto,
            "data_criacao": recomendacao.data_criacao
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"erro": str(e)}, status=500)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_recomendacoes(request, pk):

    try:

        recomendacoes = (RecomendacaoAuditoria.objects.filter(risco_id=pk).order_by('-data_criacao')
                         .select_related('auditor'))

        serializer = RecomendacaoAuditoriaSerializer(recomendacoes, many=True)



        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"erro": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exportar_riscos_csv(request):

    periodo = request.GET.get('periodo', '30')
    categoria_filtro = request.GET.get('categoria', 'todas')
    impactos = request.GET.get('impactos', '')
    colunas_req = request.GET.get('colunas', '')

    colunas_selecionadas = colunas_req.split(',') if colunas_req else []
    lista_impactos = impactos.split(',') if impactos else []


    riscos = Risco.objects.all()


    if periodo.isdigit() and int(periodo) < 365:

        data_limite = timezone.now() - timedelta(days=int(periodo))
        riscos = riscos.filter(data_criacao__gte=data_limite)

    elif periodo == '365':

        ano_atual = timezone.now().year
        riscos = riscos.filter(data_criacao__year=ano_atual)


    if categoria_filtro != 'todas':

        riscos = riscos.filter(categoria__nome__icontains=categoria_filtro)


    # if lista_impactos:
    #
    #     riscos = riscos.filter(status__in=[imp.capitalize() for imp in
    #                                        lista_impactos])


    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="exportacao_riscos.csv"'
    response.write(u'\ufeff'.encode('utf8'))
    writer = csv.writer(response, delimiter=';')


    mapa_colunas = {
        'id': 'ID do Risco',
        'descricao': 'Descrição',
        'categoria': 'Categoria',
        'criticidade': 'Criticidade',
        'status': 'Status Atual',
        'responsavel': 'Responsável',
        'dataCriacao': 'Data de Criação',
        'planoAcao': 'Plano de Ação'
    }


    cabecalho = [mapa_colunas[col] for col in colunas_selecionadas if col in mapa_colunas]
    writer.writerow(cabecalho)


    for risco in riscos:
        linha = []
        if 'id' in colunas_selecionadas: linha.append(risco.id_estrutural or risco.id)
        if 'descricao' in colunas_selecionadas: linha.append(risco.descricao or '')
        if 'categoria' in colunas_selecionadas: linha.append(
            str(risco.categoria) if risco.categoria else 'Não vinculada')


        # if 'criticidade' in colunas_selecionadas: linha.append(str(risco.nivel) or '-')
        if 'status' in colunas_selecionadas: linha.append(risco.status or 'Sem Status')

        if 'responsavel' in colunas_selecionadas:
            nome_resp = risco.responsavel.first_name if risco.responsavel else 'Não atribuído'
            linha.append(nome_resp)

        if 'dataCriacao' in colunas_selecionadas:

            data_formatada = risco.data_criacao.strftime('%d/%m/%Y') if getattr(risco, 'data_criacao', None) else '-'
            linha.append(data_formatada)

        if 'planoAcao' in colunas_selecionadas: linha.append(risco.acao_tratamento or 'Sem plano')

        writer.writerow(linha)

    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exportar_riscos_pdf(request):

    periodo = request.GET.get('periodo', '30')
    categoria_filtro = request.GET.get('categoria', 'todas')
    impactos = request.GET.get('impactos', '')
    colunas_req = request.GET.get('colunas', '')

    colunas_selecionadas = colunas_req.split(',') if colunas_req else []
    lista_impactos = impactos.split(',') if impactos else []

    riscos = Risco.objects.all()


    if periodo.isdigit() and int(periodo) < 365:
        data_limite = timezone.now() - timedelta(days=int(periodo))
        riscos = riscos.filter(data_criacao__gte=data_limite)

    if categoria_filtro != 'todas':
        riscos = riscos.filter(categoria__nome_categoria__icontains=categoria_filtro)

    if lista_impactos:
        query_nivel = Q()
        impactos_limpos = [imp.strip().lower() for imp in lista_impactos]

        if 'critico' in impactos_limpos:
            query_nivel |= Q(nivel__gte=20)
        if 'alto' in impactos_limpos:
            query_nivel |= Q(nivel__gte=12, nivel__lt=20)
        if 'medio' in impactos_limpos:
            query_nivel |= Q(nivel__gte=4, nivel__lt=12)
        if 'baixo' in impactos_limpos:
            query_nivel |= Q(nivel__lt=4)

        if query_nivel:
            riscos = riscos.filter(query_nivel)


    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="Relatorio_Riscos_Corporativo.pdf"'
    buffer = BytesIO()


    doc = SimpleDocTemplate(buffer, pagesize=landscape(A4), rightMargin=40, leftMargin=40, topMargin=110,
                            bottomMargin=50)
    elementos = []
    estilos = getSampleStyleSheet()


    estilo_titulo = ParagraphStyle(
        'Titulo',
        parent=estilos['Title'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#0f172a'),
        alignment=TA_LEFT,
        spaceAfter=4
    )

    estilo_subtitulo = ParagraphStyle(
        'Sub', parent=estilos['Normal'],
        fontName='Helvetica', fontSize=14,
        textColor=colors.HexColor('#2563eb'),
        alignment=TA_LEFT,
        spaceAfter=15
    )

    estilo_seccao = ParagraphStyle(
        'Seccao', parent=estilos['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_LEFT,
        spaceAfter=10,
        textTransform='uppercase'
    )

    estilo_celula = ParagraphStyle(
        'Celula',
        parent=estilos['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#334155'),
        leading=12
    )

    estilo_id = ParagraphStyle(
        'ID',
        parent=estilos['Normal'],
        fontName='Courier-Bold',
        fontSize=9,
        textColor=colors.HexColor('#64748b')
    )


    def desenhar_layout_fixo(canvas, documento):
        canvas.saveState()

        # --- MARCA DE ÁGUA DIAGONAL ---
        canvas.setFont("Helvetica-Bold", 70)
        canvas.setFillColor(colors.Color(0.9, 0.9, 0.9, alpha=0.25))
        canvas.translate(250, 150)
        canvas.rotate(35)
        canvas.drawCentredString(0, 0, "CONFIDENCIAL")
        canvas.restoreState()

        canvas.saveState()
        # --- CABEÇALHO (Esquerda )
        canvas.setFont("Helvetica-Bold", 11)
        canvas.setFillColor(colors.HexColor('#0f172a'))
        canvas.drawString(40, doc.pagesize[1] - 40, "GESTOR DE RISCO")

        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor('#64748b'))
        canvas.drawString(40, doc.pagesize[1] - 52, "Sistema Institucional de Resiliência")

        # --- CABEÇALHO (Direita) ---
        hoje = timezone.now().strftime("%d/%m/%Y")
        usuario = request.user.get_full_name() or request.user.username
        doc_id = f"SEC-{timezone.now().strftime('%Y-%H%M')}"

        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(colors.HexColor('#0f172a'))
        canvas.drawRightString(doc.pagesize[0] - 100, doc.pagesize[1] - 40, "Data de Exportação: ")
        canvas.drawRightString(doc.pagesize[0] - 100, doc.pagesize[1] - 52, "Gerado por: ")
        canvas.drawRightString(doc.pagesize[0] - 100, doc.pagesize[1] - 64, "Documento: ")

        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor('#64748b'))
        canvas.drawRightString(doc.pagesize[0] - 40, doc.pagesize[1] - 40, hoje)
        canvas.drawRightString(doc.pagesize[0] - 40, doc.pagesize[1] - 52, usuario)
        canvas.drawRightString(doc.pagesize[0] - 40, doc.pagesize[1] - 64, doc_id)

        # --- RODAPÉ ---
        canvas.setStrokeColor(colors.HexColor('#cbd5e1'))
        canvas.line(40, 45, doc.pagesize[0] - 40, 45)

        canvas.drawString(40, 30, "🔒 USO INTERNO RESTRITO")
        canvas.drawRightString(doc.pagesize[0] - 40, 30, f"Página {documento.page}")

        canvas.restoreState()


    elementos.append(Paragraph("Relatório Consolidado de Riscos", estilo_titulo))
    elementos.append(Paragraph("Ciclo Atual", estilo_subtitulo))

    # Linha azul escura por baixo do título
    elementos.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0f172a'), spaceAfter=20))

    elementos.append(Paragraph("DETALHAMENTO PRIORITÁRIO", estilo_seccao))

    # Tabela
    mapa_colunas = {
        'id': 'ID', 'descricao': 'DESCRIÇÃO DO RISCO', 'categoria': 'CATEGORIA',
        'criticidade': 'NÍVEL (I/P)', 'status': 'STATUS DO TRATAMENTO',
        'responsavel': 'RESPONSÁVEL', 'dataCriacao': 'DATA', 'planoAcao': 'PLANO DE AÇÃO'
    }

    cabecalho = [mapa_colunas[col] for col in colunas_selecionadas if col in mapa_colunas]
    if not cabecalho:
        cabecalho = list(mapa_colunas.values())
        colunas_selecionadas = list(mapa_colunas.keys())

    # Cabeçalho
    dados_tabela = [[Paragraph(f"<b>{col}</b>", estilo_celula) for col in cabecalho]]


    def formatar_nivel(nivel):
        n = str(nivel).upper()
        if 'CRÍTICO' in n or 'CRITICO' in n:
            return f'<font color="#dc2626"><b>▲ {nivel}</b></font>'
        elif 'ALTO' in n:
            return f'<font color="#ea580c"><b>! {nivel}</b></font>'
        elif 'MÉDIO' in n or 'MEDIO' in n:
            return f'<font color="#f59e0b"><b>■ {nivel}</b></font>'
        elif 'BAIXO' in n:
            return f'<font color="#2563eb"><b>▼ {nivel}</b></font>'
        return str(nivel)

    # 8. Preenchimento de Dados
    if not riscos.exists():
        print(riscos)
        linha_vazia = [Paragraph('Nenhum registo encontrado com os filtros atuais.', estilo_celula)] + [''] * (
                    len(cabecalho) - 1)
        dados_tabela.append(linha_vazia)

    else:
        for risco in riscos:
            linha = []

            if 'id' in colunas_selecionadas:
                linha.append(Paragraph(str(risco.id_estrutural or risco.id), estilo_id))

            if 'descricao' in colunas_selecionadas:
                linha.append(Paragraph(risco.descricao or 'Sem descrição', estilo_celula))

            if 'categoria' in colunas_selecionadas:
                cat = str(risco.categoria).upper() if risco.categoria else 'N/A'
                linha.append(Paragraph(f'<font color="#1e40af"><b>{cat}</b></font>', estilo_celula))

            if 'criticidade' in colunas_selecionadas:
                linha.append(Paragraph(formatar_nivel(risco.nivel or '-'), estilo_celula))

            if 'status' in colunas_selecionadas:
                linha.append(Paragraph(risco.status or '-', estilo_celula))

            if 'responsavel' in colunas_selecionadas:
                linha.append(Paragraph(risco.responsavel.first_name if risco.responsavel else 'N/A', estilo_celula))

            if 'dataCriacao' in colunas_selecionadas:
                linha.append(
                    Paragraph(
                        risco.data_criacao.strftime('%d/%m/%Y') if getattr(risco, 'data_criacao', None) else '-',
                              estilo_celula
                    )
                )

            if 'planoAcao' in colunas_selecionadas:
                linha.append(Paragraph(risco.acao_tratamento or '-', estilo_celula))

            dados_tabela.append(linha)

    # Estilização da Tabela
    tabela = Table(dados_tabela, repeatRows=1)
    tabela.setStyle(TableStyle([
        # Cabeçalho
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#475569')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, 0), 10),

        # Linha inferior do Cabeçalho mais forte
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, colors.HexColor('#cbd5e1')),

        # Margens internas e alinhamento das células de dados
        ('TOPPADDING', (0, 1), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 12),

        # Linha horizontal suave a separar as linhas de registo
        ('LINEBELOW', (0, 1), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
    ]))

    elementos.append(tabela)

    # Contador de registos no final
    if riscos.exists():
        elementos.append(Spacer(1, 15))
        elementos.append(Paragraph(
            f"<font color='#64748b' size='8'>Mostrando {riscos.count()} registos de riscos consolidados.</font>",
            ParagraphStyle('R', alignment=TA_RIGHT))
        )

    # Geração Final
    doc.build(elementos, onFirstPage=desenhar_layout_fixo, onLaterPages=desenhar_layout_fixo)

    response.write(buffer.getvalue())
    buffer.close()

    return response


