import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../../style/DetalhesRisco.css';
import {FiFileText, FiTarget, FiActivity, FiShield, FiAlertOctagon} from "react-icons/fi";
import {MdEdit} from 'react-icons/md';
import {CiClock2, CiFlag1} from "react-icons/ci";
import {TfiReload} from "react-icons/tfi";
import {getCookie, useAuth} from "../../hooks/AuthContext.jsx";

function DetalhesRisco() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {usuario} = useAuth()

    const [risco, setRisco] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusRecomendacao, setStatusRecomendacao] = useState('Nao salvo')
    const [erro, setErro] = useState(null);


    const [nomeCategoria, setNomeCategoria] = useState('Carregando...');
    const [desafio , setDesafio] = useState('Carregando...')
    const [nomeResponsavel, setNomeResponsavel] = useState('Carregando...');
    const [iniciaisResponsavel, setIniciaisResponsavel] = useState('--');
    const [nomeUnidade, setNomeUnidade] = useState('Carregando...');

    const [recomendacoes, setRecomendacoes] = useState([]);
    const [novoTexto, setNovoTexto] = useState('');

    const isAuditor = usuario?.perfil_acesso?.toLowerCase() === 'auditor';

    const [historico, setHistorico] = useState([]);

    const buscarRecomendacoes = async () => {
        if (!id) return;
        try {
            const res = await fetch(`http://localhost:8000/api/risco/${id}/listar-recomendacoes/`, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            });
            if (res.ok) {
                const dados = await res.json();
                setRecomendacoes(dados);
            }
        } catch (erro) {
            console.error("Erro ao buscar recomendações:", erro);
        }
    };

    const salvarRecomendacao = async () => {
        if (!novoTexto.trim()) return;

        try {
            const res = await fetch(`http://localhost:8000/api/risco/${id}/fazer-recomendacao/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({texto: novoTexto})
            });
            if (res.ok) {
                const novaRec = await res.json();
                setNovoTexto('');
                setStatusRecomendacao('Recomendação enviada!');
                setRecomendacoes(prev => [novaRec, ...prev]);
            }
        } catch (erro) {
            console.error("Erro na requisição da recomendação:", erro);
        }
    };

    useEffect(() => {
        const fetchConfig = {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        };

        const fetchHistorico = async () => {
            if (!id) return;
            try {
                const res = await fetch(`http://localhost:8000/api/riscos/${id}/historico/`, fetchConfig);
                if (res.ok) {
                    const dados = await res.json();
                    setHistorico(dados);
                }
            } catch (erro) {
                console.error("Erro ao puxar histórico", erro);
            }
        };

        fetchHistorico();
    }, [id]);

    useEffect(() => {
        const fetchDetalhesRisco = async () => {
            try {
                const fetchConfig = {
                    method: 'GET',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                };

                const response = await fetch(`http://localhost:8000/api/risco/${id}/`, fetchConfig);

                if (!response.ok) {
                    throw new Error('Não foi possível carregar os detalhes do risco.');
                }

                const dados = await response.json();
                setRisco(dados);

                if (typeof dados.categoria === 'number') {
                    fetch(`http://localhost:8000/api/categoria/${dados.categoria}/`, fetchConfig)
                        .then(res => res.json())
                        .then(cat => setNomeCategoria(
                            cat.nome_categoria || cat.descricao_categoria || 'Categoria sem nome'
                        ))
                        .catch(() => setNomeCategoria('Erro ao carregar'));
                } else {
                    setNomeCategoria(dados.categoria_nome || dados.categoria || 'Não vinculado');
                }

                if (typeof dados.desafio === 'number') {
                    fetch(`http://localhost:8000/api/desafio/${dados.desafio}/`, fetchConfig)
                        .then(res => res.json())
                        .then(des => setDesafio(
                            des.nome || 'Categoria sem nome'
                        ))
                        .catch(() => setDesafio('Erro ao carregar'));
                } else {
                    setDesafio(dados.desafio ||  'Não vinculado');
                }

                const idResponsavel = dados.responsavel;

                if (idResponsavel && typeof idResponsavel === 'number') {
                    fetch(`http://localhost:8000/api/usuario/id/${idResponsavel}/`, fetchConfig)
                        .then(res => {
                            if (!res.ok) throw new Error('Usuário não encontrado');
                            return res.json();
                        })
                        .then(user => {
                            const nome = user.first_name || user.username || 'Usuário';
                            setNomeResponsavel(nome);
                            setIniciaisResponsavel(String(nome).substring(0, 2).toUpperCase());
                            setNomeUnidade(user.nome_unidade || 'Sem unidade vinculada');
                        })
                        .catch(() => {
                            setNomeResponsavel('Erro ao carregar responsável');
                            setIniciaisResponsavel('--');
                            setNomeUnidade('Erro ao carregar unidade');
                        });
                } else {
                    setNomeResponsavel('Não atribuído');
                    setIniciaisResponsavel('--');
                    setNomeUnidade('Sem unidade vinculada');
                }

            } catch (error) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetalhesRisco();
            buscarRecomendacoes()
        }
    }, [id]);

    if (loading) return <div className="detalhes-container"><h2 className="state-message">Carregando detalhes...</h2>
    </div>;
    if (erro) return <div className="detalhes-container"><h2 className="state-message error">Erro: {erro}</h2></div>;
    if (!risco) return <div className="detalhes-container"><h2 className="state-message">Risco não encontrado.</h2>
    </div>;

    const verificarPosicaoHeatmap = (linhaProb, colunaImp) => {
        return Number(risco.probabilidade) === linhaProb && Number(risco.impacto) === colunaImp;
    };

    const probabilidades = [5, 4, 3, 2, 1];
    const impactos = [1, 2, 3, 4, 5];

    const obterCorHeatmap = (prob, imp) => {
        const matrizCores = {
            5: ['c-light-red', 'c-light-red', 'c-dark-red', 'c-dark-red', 'c-dark-red'],
            4: ['c-yellow', 'c-light-red', 'c-light-red', 'c-dark-red', 'c-dark-red'],
            3: ['c-yellow', 'c-yellow', 'c-light-red', 'c-light-red', 'c-dark-red'],
            2: ['c-green', 'c-yellow', 'c-yellow', 'c-light-red', 'c-light-red'],
            1: ['c-green', 'c-green', 'c-yellow', 'c-yellow', 'c-light-red']
        };
        return matrizCores[prob][imp - 1];
    };

    return (
        <div className="detalhes-container">
            <div className="breadcrumb">
                <div>
                    <span style={{cursor: 'pointer'}} onClick={() => navigate('/todos-riscos')}>Todos os riscos</span>
                    <span>&gt;</span>
                    <strong>Detalhes do Risco</strong>
                </div>
            </div>

            <div className="header-card">
                <div className="header-content">
                    <div className="header-title-area">
                        <div className="badges-row">
                            <span className="badge badge-dark">
                                {risco.id_estrutural || risco.codigo}
                            </span>
                            <span className={`badge ${risco.nivel >= 15 ? 'badge-critical' : 'badge-warning'}`}>
                                <span className="dot"></span> {risco.status || 'Não avaliado'}
                            </span>
                            <span className={`badge badge-outline`}>
                                Tratamento: {risco.status_tratamento || 'Não Iniciado'}
                            </span>
                        </div>
                        <h1>{risco.titulo}</h1>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn btn-outline"
                            onClick={() => navigate(`/editar-risco/${risco.id}`)}
                        >
                            <MdEdit/> Editar Risco
                        </button>
                    </div>
                </div>
            </div>

            <div className="main-grid">
                <div className="left-column">

                    <div className="card">
                        <div className="card-header">
                            <FiFileText/>
                            <h2>Caracterização e Análise (Etapa 1)</h2>
                        </div>
                        <div className="card-body">

                            <div className="meta-row">
                                <div className="meta-box">
                                    <label>PROPRIETÁRIO DO RISCO</label>
                                    <div className="meta-content box-transparent">
                                        <div className="avatar">{iniciaisResponsavel}</div>
                                        <div className="owner-info">
                                            <strong>{nomeResponsavel || 'Não atribuído'}</strong>
                                            <span>{nomeUnidade || 'Unidade não definida'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="meta-box">
                                    <label>CATEGORIA</label>
                                    <div className="meta-content box-blue">
                                        <FiTarget/>
                                        <span>{nomeCategoria || 'Não vinculado'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>PROCESSO ASSOCIADO</label>
                                <p className="text-large"><strong>{risco.processo_associado || 'Não mapeado.'}</strong>
                                </p>
                            </div>


                            <div className="form-group highlight-desafio box-blue">
                                <label><FiAlertOctagon className="icon-inline "/> DESAFIO DO RISCO</label>
                                <p>{desafio || 'Nenhum desafio ou dor principal foi documentado para este risco.'}</p>
                            </div>

                            <div className="form-group">
                                <label>DESCRIÇÃO DO EVENTO</label>
                                <p>{risco.descricao || 'Nenhuma descrição fornecida.'}</p>
                            </div>

                            <div className="meta-row">
                                <div className="form-group">
                                    <label>CAUSAS (Origem)</label>
                                    <p className="highlight-box red-light">{risco.causas || 'Não detalhadas.'}</p>
                                </div>
                                <div className="form-group">
                                    <label>CONSEQUÊNCIAS (Impacto Geral)</label>
                                    <p className="highlight-box orange-light">{risco.consequencias || 'Não detalhadas.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-header flex-between">
                            <div className="title-with-icon">
                                <FiShield/>
                                <h2>Plano de Tratamento 5W2H (Etapa 3)</h2>
                            </div>
                            <span className="active-count">{risco.tipo_acao || 'Ação'}</span>
                        </div>
                        <div className="card-body">
                            <div className="meta-row">
                                <div className="form-group">
                                    <label>AÇÃO PRINCIPAL (What)</label>
                                    <p className="text-large">
                                        <strong>{risco.acao_tratamento || 'Nenhuma ação definida.'}</strong></p>
                                </div>
                                <div className="form-group">
                                    <label>RESPOSTA</label>
                                    <span className="status-text blue">{risco.resposta_risco || 'Em análise'}</span>
                                </div>
                            </div>

                            <div className="meta-row">
                                <div className="form-group">
                                    <label>JUSTIFICATIVA (Why)</label>
                                    <p className="text-muted">{risco.justificativa_acao || '-'}</p>
                                </div>
                                <div className="form-group">
                                    <label>COMO IMPLEMENTAR (How)</label>
                                    <p className="text-muted">{risco.como_implementar || '-'}</p>
                                </div>
                            </div>

                            <div className="info-grid-3 border-top-light pt-15">
                                <div className="form-group">
                                    <label>RESPONSÁVEL (Who)</label>
                                    <p><strong>{risco.responsavel_tratamento || '-'}</strong></p>
                                </div>
                                <div className="form-group">
                                    <label>PRAZO (When)</label>
                                    <p><strong>{risco.prazo_implementacao || '-'}</strong></p>
                                </div>
                                <div className="form-group">
                                    <label>RECURSOS (How Much)</label>
                                    <p><strong>{risco.recursos_necessarios || '-'}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-header">
                            <FiActivity/>
                            <h2>Monitoramento Contínuo (Etapa 4)</h2>
                        </div>
                        <div className="card-body">
                            <div className="meta-row">
                                <div className="form-group">
                                    <label>INDICADORES DE SUCESSO</label>
                                    <p>{risco.indicadores_monitoramento || 'Nenhum indicador definido.'}</p>
                                </div>
                                <div className="form-group">
                                    <label>RESULTADOS ALCANÇADOS ATÉ AGORA</label>
                                    <p className="highlight-box green-light">{risco.resultados_alcancados || 'Aguardando avaliação de resultados.'}</p>
                                </div>
                            </div>
                            <div className="info-grid-3 border-top-light pt-15">
                                <div className="form-group">
                                    <label>PRÓXIMA AVALIAÇÃO</label>
                                    <p><strong>{risco.data_proxima_avaliacao || 'Não agendada'}</strong></p>
                                </div>
                                <div className="form-group">
                                    <label>PROBABILIDADE RESIDUAL ESPERADA</label>
                                    <p>
                                        <strong>{risco.probabilidade_residual ? `${risco.probabilidade_residual} / 5` : '-'}</strong>
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label>IMPACTO RESIDUAL ESPERADO</label>
                                    <p><strong>{risco.impacto_residual ? `${risco.impacto_residual} / 5` : '-'}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="historico-recomendacoes">
                        <h3>Recomendações de Auditoria Vinculadas</h3>

                        {recomendacoes.length === 0 ? (
                            <p className="recomendacao-vazia">
                                Nenhuma recomendação registrada para este risco até o momento.
                            </p>
                        ) : (
                            <div className="lista-recomendacoes">
                                {recomendacoes.map((rec) => (
                                    <div key={rec.id} className="item-recomendacao">
                                        <div className="item-recomendacao-header">
                                            <strong>Auditor: {rec.auditor || 'Não Identificado'}</strong>
                                            <span>{new Date(rec.data_criacao).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <p className="item-recomendacao-texto">
                                            {rec.texto}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <div className="right-column">

                    <div className="card">
                        <div className="card-header">
                            <h2>Avaliação Inicial (Etapa 2)</h2>
                        </div>
                        <div className="card-body">

                            <div className="form-group border-bottom-light pb-15 mb-20">
                                <label>CONTROLES EXISTENTES HOJE</label>
                                <p className="text-large">{risco.controles_existentes || 'Nenhum controle mapeado.'}</p>
                                <span className="badge badge-outline mt-5 d-inline-block">
                                    Efetividade: {risco.efetividade_controles || 'Não avaliada'}
                                </span>
                            </div>

                            <div className="text-center mb-20">
                                <span className="axis-label-top">PROBABILIDADE</span>
                                <div className="heatmap-container">
                                    <span className="axis-label-left">IMPACTO</span>

                                    <div className="heatmap-grid">
                                        {probabilidades.map((prob) =>
                                            impactos.map((imp) => (
                                                <div
                                                    key={`hm-cell-${prob}-${imp}`}
                                                    className={`hm-cell ${obterCorHeatmap(prob, imp)}`}
                                                >
                                                    {verificarPosicaoHeatmap(prob, imp) && (
                                                        <div className="hm-dot"></div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="impact-stats">
                                <div className="stat-row">
                                    <span>Probabilidade:</span>
                                    <strong>{risco.probabilidade ? `${risco.probabilidade}/5` : 'Não definida'}</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Impacto:</span>
                                    <strong>{risco.impacto ? `${risco.impacto}/5` : 'Não definido'}</strong>
                                </div>
                                <hr className="divider"/>
                                <div className="stat-final">
                                    <span>Risco Inerente:</span>
                                    <strong className="score-red">{risco.nivel > 0 ? `${risco.nivel}/25` : '-'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card">
                        <div className="card-header">
                            <div className="title-with-icon">
                                <CiClock2/>
                                <h2>Histórico</h2>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="timeline">
                                {historico.map((versao) => (
                                    <div className="tl-item" key={versao.id_versao}>
                                        <div className="tl-icon gray-icon">
                                            {versao.acao === 'Criado' ? (
                                                <CiFlag1/>
                                            ) : (
                                                <TfiReload/>
                                            )}
                                        </div>
                                        <div className="tl-content">
                                            <span className="tl-date">{versao.data}</span>
                                            <strong>Risco {versao.acao}</strong>
                                            <p>
                                                Modificado por: <b>{versao.usuario}</b> <br/>
                                                Status: <i>{versao.status_na_epoca}</i> |
                                                Nível: {versao.nivel_na_epoca ? versao.nivel_na_epoca : 'Não Avaliado'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div>
                        {isAuditor && (
                            <div className="card-auditoria">
                                <h3>Área do Auditor (Nova Recomendação)</h3>
                                <textarea
                                    value={novoTexto}
                                    onChange={(e) => setNovoTexto(e.target.value)}
                                    placeholder="Insira aqui a recomendação técnica..."
                                />
                                <button onClick={salvarRecomendacao} className="btn-confirm">
                                    {statusRecomendacao === 'Nao salvo' ? 'Enviar Recomendação' : statusRecomendacao}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetalhesRisco;