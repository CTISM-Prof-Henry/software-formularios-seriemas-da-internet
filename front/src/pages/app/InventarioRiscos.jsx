import React, {useState, useEffect} from 'react';
import '../../style/InventarioRiscos.css';
import {useRiscos} from '../../hooks/useRiscos';
import {CiSearch} from "react-icons/ci";
import {GoCheckCircleFill} from "react-icons/go";
import {useNavigate, useSearchParams} from 'react-router-dom'
import {useAuth} from "../../hooks/AuthContext.jsx";

function InventarioRiscos() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const queryDaUrl = searchParams.get('q');
    const valorInicialBusca = queryDaUrl || sessionStorage.getItem('ir_termo') || '';

    const [pagina, setPagina] = useState(() => parseInt(sessionStorage.getItem('ir_pagina')) || 1);
    const [termoBusca, setTermoBusca] = useState(valorInicialBusca);
    const [inputBusca, setInputBusca] = useState(valorInicialBusca);

    const [filtroCategoria, setFiltroCategoria] = useState(() => sessionStorage.getItem('ir_categoria') || '');
    const [filtroCentro, setFiltroCentro] = useState(() => sessionStorage.getItem('ir_centro') || '');
    const [filtroStatus, setFiltroStatus] = useState(() => sessionStorage.getItem('ir_status') || '');

    const [ordenacao, setOrdenacao] = useState(() => sessionStorage.getItem('ir_ordenacao') || '-id');
    const { usuario } = useAuth();

    useEffect(() => {
        if (queryDaUrl) {
            setInputBusca(queryDaUrl);
            setTermoBusca(queryDaUrl);

            searchParams.delete('q');
            setSearchParams(searchParams, { replace: true });
        }
    }, [queryDaUrl, searchParams, setSearchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTermoBusca(inputBusca)
        }, 500)

        return () => clearTimeout(timer)
    }, [inputBusca])

    useEffect(() => {
        setPagina(1);
    }, [termoBusca, filtroCategoria, filtroStatus, ordenacao, filtroCentro]);

    const itens_pagina = 20
    const {
        riscos,
        kpis,
    } = useRiscos(20, termoBusca, filtroCategoria, filtroStatus, ordenacao, filtroCentro);
    const percentualConcluido = kpis.count > 0 ? Math.round((kpis.concluidos / kpis.count) * 100) : 0;

    const totalRiscos = kpis?.count || 0;
    const totalPaginas = Math.ceil(totalRiscos / itens_pagina);
    const mostrandoDe = totalRiscos === 0 ? 0 : ((pagina - 1) * itens_pagina) + 1;
    const mostrandoAte = Math.min(pagina * itens_pagina, totalRiscos);

    useEffect(() => {
        sessionStorage.setItem('ir_termo', termoBusca);
        sessionStorage.setItem('ir_categoria', filtroCategoria);
        sessionStorage.setItem('ir_status', filtroStatus);
        sessionStorage.setItem('ir_ordenacao', ordenacao);
    }, [termoBusca, filtroCategoria, filtroStatus, ordenacao]);


    const formatarCategoria = (nomeCategoria) => {
        if (!nomeCategoria) return {texto: 'NÃO DEFINIDA', classe: 'cat-gray'};
        const lower = nomeCategoria.toLowerCase();

        if (lower.includes('financeiro')) return {texto: 'FINANCEIRO', classe: 'cat-financeiro'};
        if (lower.includes('legal')) return {texto: 'LEGAL', classe: 'cat-legal'};
        if (lower.includes('estratégic') || lower.includes('estrategic')) return {
            texto: 'ESTRATÉGICO',
            classe: 'cat-estrategico'
        };
        if (lower.includes('opera')) return {texto: 'OPERACIONAL', classe: 'cat-operacional'};
        if (lower.includes('integrida')) return {texto: 'RISCO DE INTEGRIDADE', classe: 'cat-integridade'}

        return {texto: nomeCategoria.toUpperCase(), classe: 'cat-gray'};
    };

    const formatarNivel = (impacto, prob) => {
        if (!impacto || !prob) return {pontuacao: '-', texto: 'Não Avaliado', classe: 'nivel-baixo'};

        const pontuacao = impacto * prob;

        if (pontuacao <= 6) return {pontuacao, texto: 'Baixo', classe: 'nivel-baixo'};
        if (pontuacao <= 14) return {pontuacao, texto: 'Médio', classe: 'nivel-medio'};
        return {pontuacao, texto: 'Crítico', classe: 'nivel-critico'};
    };

    const formatarStatus = (status) => {
        if (!status) return {texto: 'Pendente', classe: 'status-gray'};
        const lower = status.toLowerCase();

        if (lower.includes('trata')) return {texto: status, classe: 'status-red'};
        if (lower.includes('monito')) return {texto: status, classe: 'status-blue'};
        if (lower.includes('conclu')) return {texto: status, classe: 'status-green'};

        return {texto: status, classe: 'status-gray'};
    };


    return (
        <div className="inventario-container">

            <div className="breadcrumb">Riscos / <strong>Inventário Geral</strong></div>

            <div className="inventario-header">
                <div>
                    <h2>Inventário de Riscos</h2>
                    <p>Consulte e gerencie todos os riscos identificados para o ciclo 2026.</p>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-bot-card border-red">
                    <span className="kpi-title">RISCOS CRÍTICOS</span>
                    <div className="kpi-data">
                        <h2>{kpis.criticos}</h2>
                    </div>
                </div>

                <div className="kpi-bot-card border-orange">
                    <span className="kpi-title">RISCOS MÉDIOS</span>
                    <div className="kpi-data">
                        <h2 className="color-orange">{kpis.medios}</h2>
                    </div>
                </div>

                <div className="kpi-bot-card border-blue">
                    <span className="kpi-title">EM TRATAMENTO</span>
                    <div className="kpi-data">
                        <h2 className="color-blue">{kpis.em_tratamento}</h2>
                    </div>
                </div>

                <div className="kpi-bot-card border-green">
                    <span className="kpi-title">CONCLUÍDOS</span>
                    <div className="kpi-data">
                        <h2 className="color-green">{kpis.concluidos}</h2>
                        <span className={`trend ${percentualConcluido >= 50 ? 'trend-green' : 'trend-red'}`}>
                            {percentualConcluido >= 50 ? (
                                <>
                                    <GoCheckCircleFill/>
                                    <span className='badge-probabilidade'>Bom progresso</span>
                                </>
                            ) : (
                                <span>Abaixo da meta</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className="filtros-bar">
                <div className="search-box">
                    <CiSearch/>
                    <input
                        type="text"
                        placeholder="Buscar por descrição ou ID..."
                        value={inputBusca}
                        onChange={(e) => setInputBusca(e.target.value)}
                    />
                </div>

                <div className="filtros-actions">

                    <select
                        className="btn-filter"
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        style={{cursor: 'pointer', outline: 'none'}}
                    >
                        <option value="">Todas as Categorias</option>
                        <option value="Operacional">Operacional</option>
                        <option value="Financeiro">Financeiro</option>
                        <option value="Estratégico">Estratégico</option>
                        <option value="Legal">Legal</option>
                    </select>

                    <select
                        className="btn-filter"
                        value={filtroCentro}
                        onChange={(e) => setFiltroCentro(e.target.value)}
                        style={{cursor: 'pointer', outline: 'none'}}
                    >
                        <option value="">Todas as minhas Unidades</option>
                        
                        {usuario?.unidade && (
                            <option value={usuario.unidade}>Minha Unidade Principal</option>
                        )}

                        {/* (Opcional) Se você tiver a lista de nomes dos centros permitidos no context, pode iterar aqui: */}
                        {/* usuario?.lista_centros_permitidos_detalhada?.map(centro => (
                             <option value={centro.id} key={centro.id}>{centro.nome}</option>
                        )) */}
                </select>

                    <select
                        className="btn-filter"
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        style={{cursor: 'pointer', outline: 'none'}}
                    >
                        <option value="">Todos os Status</option>
                        <option value="Identificação">Identificação</option>
                        <option value="Análise">Análise</option>
                        <option value="Tratamento">Em Tratamento</option>
                        <option value="Monitorado">Monitorado</option>
                        <option value="Concluído">Concluído</option>
                    </select>

                    <select
                        className="btn-filter"
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value)}
                        style={{cursor: 'pointer', outline: 'none'}}
                    >
                        <option value="-id">Mais Recentes</option>
                        <option value="id">Mais Antigos</option>
                        <option value="impacto">Menor Impacto</option>
                        <option value="-impacto">Maior Impacto</option>
                    </select>

                </div>
            </div>


            <div className="tabela-wrapper">
                <div className="tabela-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th>ID_ESTRUTURADO</th>
                            <th style={{width: '25%'}}>TITULO DO RISCO</th>
                            <th>CATEGORIA</th>
                            <th>IMPACTO</th>
                            <th>PROB.</th>
                            <th>NÍVEL</th>
                            <th>STATUS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {riscos.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>
                                    Nenhum risco encontrado.
                                </td>
                            </tr>
                        ) : (
                            riscos.map((risco) => {

                                const cat = formatarCategoria(risco.nome_categoria);
                                const nivel = formatarNivel(risco.impacto, risco.probabilidade);
                                const stat = formatarStatus(risco.status);

                                return (
                                    <tr key={risco.id} onClick={() => navigate(`/detalhes-risco/${risco.id}`)}>
                                        <td className="td-id">{risco.id_estrutural || risco.codigo}</td>
                                        <td className="td-desc">{risco.titulo}</td>
                                        <td>
                                            <span className={`badge-categoria ${cat.classe}`}>{cat.texto}</span>
                                        </td>
                                        <td className="td-number">{risco.impacto || '-'}</td>
                                        <td className="td-number">{risco.probabilidade || '-'}</td>
                                        <td align="center">
                                            <div className={`badge-nivel ${nivel.classe}`}>
                                                <span style={{fontSize: 15}}>{nivel.pontuacao} </span>
                                                <span> - {nivel.texto}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-container">
                                                <span className={`dot ${stat.classe}`}></span>
                                                <span className="status-text">{stat.texto}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>


                <div className="tabela-footer">
                    <span className="footer-info">
                        Mostrando {mostrandoDe} a {mostrandoAte} de {totalRiscos} riscos
                    </span>

                    <div className="paginacao-controls">
                        <button
                            className="btn-pagina"
                            onClick={() => setPagina(p => Math.max(1, p - 1))}
                            disabled={pagina === 1}
                        >
                            Anterior
                        </button>

                        <span className="pagina-atual">
                            Página {pagina} de {totalPaginas || 1}
                        </span>

                        <button
                            className="btn-pagina"
                            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                            disabled={pagina >= totalPaginas || totalPaginas === 0}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default InventarioRiscos;