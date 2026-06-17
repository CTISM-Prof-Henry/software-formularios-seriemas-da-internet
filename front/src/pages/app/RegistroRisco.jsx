import React, {useState, useEffect} from 'react';
import '../../style/RegistroRisco.css';
import '../../style/Variaveis.css';
import {useCategorias} from "../../hooks/useCategorias.js";
import {useDesafios} from "../../hooks/useDesafios.js";
import {useUsuarios} from "../../hooks/useUsuarios.js";
import {FaCheck} from "react-icons/fa6";
import {useAuth, getCookie} from "../../hooks/AuthContext.jsx";
import {useParams, useNavigate} from 'react-router-dom';

function RegistrarRisco() {
    const {id: paramId} = useParams();
    const navigate = useNavigate();

    const [riscoId, setRiscoId] = useState(paramId || null);
    const [statusBotao, setStatusBotao] = useState({1: 'idle', 2: 'idle', 3: 'idle', 4: 'idle'});
    const [erroMsg, setErroMsg] = useState('');
    const {usuario} = useAuth();

    const {categorias} = useCategorias();
    const {desafios} = useDesafios();

    const [formData, setFormData] = useState({
        // Etapa 1
        titulo: '', categoria: '', desafio: '', descricao: '', responsavel: '',
        processo_associado: '', causas: '', consequencias: '',
        // Etapa 2
        controles_existentes: '', efetividade_controles: '',
        probabilidade: null, impacto: null,

        //Etapa 3
        resposta_risco: '', tipo_acao: '', acao_tratamento: '',
        justificativa_acao: '', como_implementar: '', responsavel_tratamento: '',
        prazo_implementacao: '', recursos_necessarios: '',
        probabilidade_residual: '', impacto_residual: '', indicadores_monitoramento: '',

        // Etapa 4
        status_tratamento: 'Não Iniciado',
        resultados_alcancados: '',
        data_proxima_avaliacao: '',

        versao: 1
    });

    const {
        termoBuscaResponsavel, sugestoesUsuarios, mostrarSugestoes,
        setMostrarSugestoes, handleBuscaResponsavel, selecionarResponsavel
    } = useUsuarios(formData, setFormData);

    const listaCategorias = Array.isArray(categorias) ? categorias : [];
    const listaDesafios = Array.isArray(desafios) ? desafios : [];

    useEffect(() => {
        if (paramId) {
            const carregarRisco = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/risco/${paramId}/`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const dados = await response.json();

                        setFormData({
                            titulo: dados.titulo || '',
                            categoria: dados.categoria || '',
                            desafio: dados.desafio || '',
                            descricao: dados.descricao || '',
                            responsavel: dados.responsavel || '',
                            processo_associado: dados.processo_associado || '',
                            causas: dados.causas || '',
                            consequencias: dados.consequencias || '',

                            controles_existentes: dados.controles_existentes || '',
                            efetividade_controles: dados.efetividade_controles || '',
                            probabilidade: dados.probabilidade || null,
                            impacto: dados.impacto || null,

                            resposta_risco: dados.resposta_risco || '',
                            tipo_acao: dados.tipo_acao || '',
                            acao_tratamento: dados.acao_tratamento || '',
                            justificativa_acao: dados.justificativa_acao || '',
                            como_implementar: dados.como_implementar || '',
                            responsavel_tratamento: dados.responsavel_tratamento || '',
                            prazo_implementacao: dados.prazo_implementacao || '',

                            probabilidade_residual: dados.probabilidade_residual || '',
                            impacto_residual: dados.impacto_residual || '',
                            recursos_necessarios: dados.recursos_necessarios || '',
                            indicadores_monitoramento: dados.indicadores_monitoramento || '',

                            status_tratamento: dados.status_tratamento || 'Não Iniciado',
                            resultados_alcancados: dados.resultados_alcancados || '',
                            data_proxima_avaliacao: dados.data_proxima_avaliacao || '',

                            versao: dados.versao || 1,
                        });

                        setStatusBotao({1: 'Salvar etapa', 2: 'Salvar etapa', 3: 'Salvar etapa', 4: 'Salvar etapa'});
                    }
                } catch (erro) {
                    console.error("Erro ao carregar risco para edição:", erro);
                }
            };
            carregarRisco();
        }
    }, [paramId]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const tratarPayload = () => {
        const dadosParaEnviar = {...formData};

        if (dadosParaEnviar.unidade_responsavel === "Não informado" || dadosParaEnviar.unidade_responsavel === "") {
            dadosParaEnviar.unidade_responsavel = null;
        } else {

            dadosParaEnviar.unidade_responsavel = parseInt(dadosParaEnviar.unidade_responsavel);
        }

        if (!dadosParaEnviar.responsavel) {
            dadosParaEnviar.responsavel = null;
        }

        return dadosParaEnviar;
    };

    const salvarEtapa = async (numeroEtapa) => {
        setStatusBotao(({...statusBotao, [numeroEtapa]: 'loading'}));
        setErroMsg('');

        let payload = {};
        let metodoHTTP = riscoId ? 'PATCH' : 'POST';
        let url = riscoId
            ? `http://localhost:8000/api/risco/${riscoId}/update/`
            : `http://localhost:8000/api/risco/`;

        if (numeroEtapa === 1) {

            let unidadeId = null;

            if (usuario?.unidade_ativa?.id) {

                unidadeId = usuario.unidade_ativa.id;
            } else if (usuario?.unidade_ativa) {

                unidadeId = usuario.unidade_ativa;

            } else if (usuario?.unidade) {

                unidadeId = usuario.unidade?.id || usuario.unidade;
            }

            payload = {
                titulo: formData.titulo,
                categoria: formData.categoria,
                desafio: formData.desafio,
                descricao: formData.descricao,
                processo_associado: formData.processo_associado,
                causas: formData.causas,
                consequencias: formData.consequencias,
                responsavel: formData.responsavel,
                unidade_responsavel: unidadeId || null,
                status: 'Identificação',
                versao: formData.versao
            };
        } else if (numeroEtapa === 2) {

            const prob = formData.probabilidade ? parseInt(formData.probabilidade, 10) : null;
            const imp = formData.impacto ? parseInt(formData.impacto, 10) : null;
            const pontuacaoCalculada = prob && imp ? prob * imp : null;

            payload = {
                controles_existentes: formData.controles_existentes,
                efetividade_controles: formData.efetividade_controles,
                probabilidade: prob,
                impacto: imp,
                nivel: pontuacaoCalculada,
                status: 'Avaliação',
                versao: formData.versao
            };
        } else if (numeroEtapa === 3) {
            payload = {
                resposta_risco: formData.resposta_risco,
                tipo_acao: formData.tipo_acao,
                acao_tratamento: formData.acao_tratamento,
                justificativa_acao: formData.justificativa_acao,
                como_implementar: formData.como_implementar,
                responsavel_tratamento: formData.responsavel_tratamento,
                prazo_implementacao: formData.prazo_implementacao,

                probabilidade_residual: formData.probabilidade_residual ? parseInt(formData.probabilidade_residual, 10) : null,
                impacto_residual: formData.impacto_residual ? parseInt(formData.impacto_residual, 10) : null,

                recursos_necessarios: formData.recursos_necessarios,
                indicadores_monitoramento: formData.indicadores_monitoramento,
                status: 'Tratamento',
                versao: formData.versao
            };
        } else if (numeroEtapa === 4) {
            payload = {
                status_tratamento: formData.status_tratamento,
                resultados_alcancados: formData.resultados_alcancados,
                data_proxima_avaliacao: formData.data_proxima_avaliacao || null,
                status: formData.status_tratamento === 'Concluído' ? 'Resolvido' : 'Monitoramento',
                versao: formData.versao
            };
        }

        try {
            const csrftoken = getCookie('csrftoken');

            console.log("CONTEÚDO DO PAYLOAD ENVIADO:", JSON.stringify(payload, null, 2));
            const response = await fetch(url, {
                method: metodoHTTP,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                body: JSON.stringify(payload)
            });

            const dados = await response.json();

            if (response.ok) {

                if (numeroEtapa === 1 && !riscoId) {
                    setRiscoId(dados.id || (dados.risco && dados.risco.id));
                }
                setStatusBotao({...statusBotao, [numeroEtapa]: 'salvo'});

            } else {

                console.log("Erro no backend:", dados);

                const mensagemCompleta = dados.detalhes
                    ? Object.entries(dados.detalhes).map(([campo, erro]) => `${campo}: ${erro}`).join(', ')
                    : dados.erro || dados.detail || "Ocorreu um erro ao salvar."
                ;

                setFormData(prev => ({...prev, versao: (dados.versao || prev.versao + 1)}))
                setErroMsg(mensagemCompleta);
                setStatusBotao({...statusBotao, [numeroEtapa]: 'idle'});
            }
        } catch (erro) {
            console.error("Erro de conexão:", erro);
            setStatusBotao({...statusBotao, [numeroEtapa]: 'idle'});
        }
    };

    return (
        <div className="cadastro-container">
            <div className="breadcrumb-reg">
                <span onClick={() => navigate('/painel')} style={{cursor: 'pointer'}}>Painel</span> <span>&gt;</span>
                <strong>{paramId ? 'Editar Risco' : 'Registrar Novo Risco'}</strong>
            </div>

            <div className="page-header">
                <h2>{paramId ? 'Edição de Risco' : 'Identificação de Novo Risco'}</h2>
                <p>Preencha os dados abaixo para submeter um risco ao comitê de governança institucional.</p>
            </div>

            <form className="form-risco" onSubmit={(e) => e.preventDefault()}>


                <div className="form-card">
                    <div className="section-header">
                        <div className="step-badge">1</div>
                        <div>
                            <h3>Identificação e Análise</h3>
                            <p>Defina o evento de risco, o enquadramento estratégico e analise suas causas e
                                consequências.</p>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Título do Risco *</label>
                        <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required/>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Categoria *</label>
                            <select name="categoria" value={formData.categoria} onChange={handleChange} required>
                                <option value="">Selecione a categoria</option>
                                {listaCategorias.map((cat) => (
                                    <option value={cat.id} key={cat.id}>{cat.id} - {cat.nome_categoria}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Desafio Estratégico Associado</label>
                            <select name="desafio" value={formData.desafio} onChange={handleChange}>
                                <option value="">Vincular a um objetivo</option>
                                {listaDesafios.map((desafio) => (
                                    <option value={desafio.id} key={desafio.id}>{desafio.id} - {desafio.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width" style={{position: 'relative'}}>
                        <label>Responsável pelo Risco *</label>
                        <input
                            type="text"
                            placeholder="Digite o nome ou matrícula do responsável..."
                            value={termoBuscaResponsavel}
                            onChange={handleBuscaResponsavel}
                            onBlur={() => setTimeout(() => setMostrarSugestoes(false), 200)}
                            required
                        />
                        {mostrarSugestoes && sugestoesUsuarios.length > 0 && (
                            <ul className="autocomplete-list">
                                {sugestoesUsuarios.map((user) => (
                                    <li key={user.id} onMouseDown={() => selecionarResponsavel(user)}>
                                        <strong>{user.nome || user.first_name || user.username}</strong> <br/>
                                        <small style={{color: 'var(--text-muted)'}}>Matrícula: {user.matricula}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group full-width">
                        <label>Processo Associado</label>
                        <input
                            type="text"
                            name="processo_associado"
                            placeholder="Ex: Contratação de Serviços, Folha de Pagamento..."
                            value={formData.processo_associado}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Descrição do Evento *</label>
                        <textarea name="descricao" placeholder="Descreva o evento de risco de forma clara..." rows="2"
                                  value={formData.descricao} onChange={handleChange} required></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Causas *</label>
                            <textarea name="causas" placeholder="Situações ou fragilidades que geram este risco..."
                                      rows="3" value={formData.causas} onChange={handleChange} required></textarea>
                        </div>
                        <div className="form-group">
                            <label>Consequências Potenciais *</label>
                            <textarea name="consequencias"
                                      placeholder="Impacto sobre a universidade caso o risco ocorra..." rows="3"
                                      value={formData.consequencias} onChange={handleChange} required></textarea>
                        </div>
                    </div>

                    <button type="button" className="btn-save" onClick={() => salvarEtapa(1)}
                            disabled={statusBotao[1] === 'loading'}>
                        {statusBotao[1] === 'loading' ? 'Salvando...' : statusBotao[1] === 'salvo' ? <><FaCheck
                            style={{marginRight: '5px'}}/> Salvo!</> : 'Salvar etapa 1'}
                    </button>
                    {erroMsg && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{erroMsg}</p>}
                </div>


                {/* ETAPA 2 */}
                <div className="form-card">
                    <div className="section-header">
                        <div className="step-badge">2</div>
                        <div>
                            <h3>Avaliação</h3>
                            <p>Análise dos controles existentes e estimativa técnica de probabilidade e impacto.</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Controles Existentes</label>
                            <textarea name="controles_existentes"
                                      placeholder="O que já é feito hoje para prevenir este risco?" rows="2"
                                      value={formData.controles_existentes} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Efetividade dos Controles Atuais</label>
                            <select name="efetividade_controles" value={formData.efetividade_controles}
                                    onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="Satisfatório">Satisfatório (Reduz significativamente)</option>
                                <option value="Parcial">Parcial (Reduz parcialmente)</option>
                                <option value="Insatisfatório">Insatisfatório (Não é eficaz)</option>
                                <option value="Inexistente">Inexistente</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row evaluation-row">
                        <div className="form-group">
                            <label>Probabilidade</label>
                            <div className="radio-group">
                                {[{val: 1, label: 'MUITO BAIXO'}, {val: 2, label: 'BAIXO'}, {
                                    val: 3,
                                    label: 'MÉDIO'
                                }, {val: 4, label: 'ALTO'}, {val: 5, label: 'MUITO ALTO'}].map((item) => (
                                    <label key={`prob-${item.val}`} className="radio-box-label">
                                        <input type="radio" name="probabilidade" value={item.val}
                                               checked={String(formData.probabilidade) === String(item.val)}
                                               onChange={handleChange}/>
                                        <div className="radio-box">
                                            <span className="number">{item.val}</span>
                                            <span className="text">{item.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Impacto</label>
                            <div className="radio-group">
                                {[{val: 1, label: 'MUITO BAIXO'}, {val: 2, label: 'BAIXO'}, {
                                    val: 3,
                                    label: 'MÉDIO'
                                }, {val: 4, label: 'ALTO'}, {val: 5, label: 'MUITO ALTO'}].map((item) => (
                                    <label key={`imp-${item.val}`} className="radio-box-label">
                                        <input type="radio" name="impacto" value={item.val}
                                               checked={String(formData.impacto) === String(item.val)}
                                               onChange={handleChange}/>
                                        <div className="radio-box">
                                            <span className="number">{item.val}</span>
                                            <span className="text">{item.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="calculation-box">
                        <div className="calc-content">
                            <div className="calc-icon">
                                <div className="grid-squares">
                                    <span className="sq red"></span><span className="sq dark"></span><span
                                    className="sq blue"></span><span className="sq light"></span>
                                </div>
                            </div>
                            <div className="calc-text">
                                <span>Cálculo de Criticidade (Inerente)</span>
                                <h4>{formData.probabilidade && formData.impacto ? `Pontuação: ${formData.probabilidade * formData.impacto}` : 'Aguardando Avaliação'}</h4>
                            </div>
                        </div>
                        <div className="calc-badge">AUTOMÁTICO</div>
                    </div>

                    <button type="button" className="btn-save" onClick={() => salvarEtapa(2)}
                            disabled={statusBotao[2] === 'loading' || !riscoId}>
                        {!riscoId ? 'Salve a etapa anterior primeiro' : statusBotao[2] === 'loading' ? 'Salvando...' : statusBotao[2] === 'salvo' ? <>
                            <FaCheck style={{marginRight: '5px'}}/> Salvo!</> : 'Salvar etapa 2'}
                    </button>
                </div>


               
                <div className="form-card">
                    <div className="section-header">
                        <div className="step-badge">3</div>
                        <div>
                            <h3>Tratamento (Plano de Ação 5W2H)</h3>
                            <p>Defina a resposta institucional e o plano de ação para mitigar ou evitar o risco.</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Resposta ao Risco *</label>
                            <select name="resposta_risco" value={formData.resposta_risco} onChange={handleChange}
                                    required>
                                <option value="">Selecione a resposta...</option>
                                <option value="Mitigar">Mitigar</option>
                                <option value="Transferir">Transferir</option>
                                <option value="Aceitar">Aceitar</option>
                                <option value="Evitar">Evitar</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tipo de Ação *</label>
                            <select name="tipo_acao" value={formData.tipo_acao} onChange={handleChange} required>
                                <option value="">Selecione o tipo...</option>
                                <option value="Preventiva">Preventiva (Foco na causa)</option>
                                <option value="Corretiva">Corretiva (Foco na consequência)</option>
                                <option value="Compensatória">Compensatória (Controle alternativo)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Ação de Tratamento*</label>
                        <textarea name="acao_tratamento" placeholder="Descreva a ação principal a ser realizada..."
                                  rows="2" value={formData.acao_tratamento} onChange={handleChange} required></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Justificativa</label>
                            <textarea name="justificativa_acao" placeholder="Por que esta ação é necessária?" rows="2"
                                      value={formData.justificativa_acao} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Como Implementar</label>
                            <textarea name="como_implementar" placeholder="Passo a passo ou método de implementação..."
                                      rows="2" value={formData.como_implementar} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Responsável pelo tratamento *</label>
                            <input type="text" name="responsavel_tratamento" placeholder="Nome ou cargo"
                                   value={formData.responsavel_tratamento} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Prazo para implementação*</label>
                            <input type="date" name="prazo_implementacao" value={formData.prazo_implementacao}
                                   onChange={handleChange} required/>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Recursos Necessários (How Much)</label>
                        <input type="text" name="recursos_necessarios"
                               placeholder="Orçamento, equipe técnica, sistemas..."
                               value={formData.recursos_necessarios} onChange={handleChange}/>
                    </div>

                    <div className="form-row"
                         style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)'}}>
                        <div className="form-group">
                            <label>Probabilidade Residual Esperada</label>
                            <select name="probabilidade_residual" value={formData.probabilidade_residual}
                                    onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="1">1 - Raro</option>
                                <option value="2">2 - Remoto</option>
                                <option value="3">3 - Possível</option>
                                <option value="4">4 - Provável</option>
                                <option value="5">5 - Quase Certo</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Impacto Residual Esperado</label>
                            <select name="impacto_residual" value={formData.impacto_residual} onChange={handleChange}>
                                <option value="">Selecione...</option>
                                <option value="1">1 - Mínimo</option>
                                <option value="2">2 - Baixo</option>
                                <option value="3">3 - Médio</option>
                                <option value="4">4 - Alto</option>
                                <option value="5">5 - Crítico</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Indicadores de Monitoramento</label>
                        <textarea name="indicadores_monitoramento" placeholder="Como mediremos se a ação funcionou?"
                                  rows="2" value={formData.indicadores_monitoramento}
                                  onChange={handleChange}></textarea>
                    </div>

                    <button type="button" className="btn-save" onClick={() => salvarEtapa(3)}
                            disabled={statusBotao[3] === 'loading' || !riscoId}>
                        {!riscoId ? 'Salve as etapas anteriores' : statusBotao[3] === 'loading' ? 'Salvando...' : statusBotao[3] === 'salvo' ? <>
                            <FaCheck style={{marginRight: '5px'}}/> Salvo!</> : 'Salvar etapa 3'}
                    </button>
                </div>

                <div className="form-card">
                    <div className="section-header">
                        <div className="step-badge">4</div>
                        <div>
                            <h3>Monitoramento Contínuo</h3>
                            <p>Acompanhe a execução do plano de ação e os resultados alcançados.</p>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{flex: 1}}>
                            <label>Indicadores de Sucesso (Definidos na Etapa 3)</label>
                            <div style={{padding: '10px 0', color: 'var(--text-dark)'}}>
                                {formData.indicadores_monitoramento || 'Nenhum indicador definido.'}
                            </div>
                        </div>

                        <div className="form-group" style={{flex: 1}}>
                            <label>Status do Tratamento</label>
                            <select name="status_tratamento" value={formData.status_tratamento} onChange={handleChange}>
                                <option value="Não Iniciado">Não Iniciado</option>
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Atrasado">Atrasado</option>
                                <option value="Concluído">Concluído / Resolvido</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Resultados Alcançados Até Agora</label>
                        <textarea
                            name="resultados_alcancados"
                            placeholder="Descreva o que já foi feito ou alcançado... (Aguardando avaliação de resultados)"
                            rows="3"
                            value={formData.resultados_alcancados}
                            onChange={handleChange}
                            style={{
                                borderLeft: '4px solid #10b981'
                            }}
                        ></textarea>
                    </div>

                    <div className="form-row"
                         style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)'}}>
                        <div className="form-group">
                            <label>Próxima Avaliação</label>
                            <input
                                type="date"
                                name="data_proxima_avaliacao"
                                value={formData.data_proxima_avaliacao}
                                onChange={handleChange}
                            />
                        </div>


                        <div className="form-group">
                            <label>Probabilidade Residual Esperada</label>
                            <div>
                                {formData.probabilidade_residual || '-'}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Impacto Residual Esperado</label>
                            <div >
                                {formData.impacto_residual || '-'}
                            </div>
                        </div>
                    </div>

                    <button type="button" className="btn-save" onClick={() => salvarEtapa(4)}
                            disabled={statusBotao[4] === 'loading' || !riscoId}>
                        {!riscoId ? 'Salve as etapas anteriores' : statusBotao[4] === 'loading' ? 'Salvando...' : statusBotao[4] === 'salvo' ? <>
                            <FaCheck style={{marginRight: '5px'}}/> Salvo!</> : 'Salvar etapa 4'}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default RegistrarRisco;