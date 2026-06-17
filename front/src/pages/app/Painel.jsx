import {Link} from 'react-router-dom'
import '../../style/Painel.css'
import '../../style/InventarioRiscos.css'
import {useRiscos} from "../../hooks/useRiscos.js";
import {usePainel} from "../../hooks/usePainel.js"
import {useState} from "react"
import {useAuth} from "../../hooks/AuthContext.jsx";



function Painel() {

    const painel = usePainel()
    const [limiteExibicao, setLimiteExibicao] = useState(5);
    const {usuario} = useAuth()
    const [filtroStatus, setFiltroStatus] = useState(() => sessionStorage.getItem('ir_status') || '');
    const [filtroCentro, setFiltroCentro] = useState(() => sessionStorage.getItem('ir_centro') || '');
    const {riscos, kpis, ultimaAtualizacao, loading} = useRiscos(
        limiteExibicao,
        '',
        '',
        filtroStatus,
        '-id',
        1,
        filtroCentro
    );

    const listaRiscos = Array.isArray(riscos) ? riscos : [];

    const riscosCriticos = listaRiscos.filter(r => r.nivel >= 12 && r.nivel < 20 || r.nivel >= 20).length;
    const riscosEmTratamento = listaRiscos.filter(r => r.status === 'Tratamento' ||
        r.status === 'Identificação' || r.status === 'Avaliação').length;
    const riscosConcluidos = listaRiscos.filter(r => r.status === 'Concluído' || r.status === 'Resolvido').length;



     const formatarData = (data) => {
        if (!data) return 'Calculando...';

        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(' de ', ' ');
    };

    return (

        <div className="painel-dashboard">

            <div className="dashboard-header">
                <div className="header-titles">
                    <h2>Painel Executivo de Riscos</h2>
                    <p>Resumo gerencial dos riscos corporativos do ciclo de planejamento 2026.</p>
                </div>

                <div className="header-actions">
                    <p className="btn-light">
                        Atualizado: {formatarData(ultimaAtualizacao)}
                    </p>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card border-dark">
                    <h5>TOTAL DE RISCOS</h5>

                    <h2>{kpis.total_absoluto === 0 ? '--' : kpis.total_absoluto}</h2>
                </div>

                <div className="kpi-card border-red">
                    <h5>RISCOS CRÍTICOS</h5>

                    <h2 className="text-red">{riscosCriticos === 0 ? '--' : riscosCriticos}</h2>
                </div>

                <div className="kpi-card border-blue">
                    <h5>EM PROGRESSO</h5>

                    <h2>{riscosEmTratamento === 0 ? '--' : riscosEmTratamento}</h2>
                </div>

                <div className="kpi-card border-gray">
                    <h5>RISCOS RESOLVIDOS</h5>

                    <h2>{riscosConcluidos === 0 ? '--' : riscosConcluidos}</h2>
                </div>
            </div>

            <div className="card table-card">
                <div className="card-header">
                    <h3>Riscos sob Monitoramento</h3>

                    <div className="limit-filter">
                        <label>Exibir:</label>
                        <select
                            value={limiteExibicao}
                            onChange={(e) => setLimiteExibicao(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15 (Máx)</option>
                        </select>
                    </div>

                </div>

                <div className="table-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th>CÓD.</th>
                            <th>RISCO</th>
                            <th>IMPACTO</th>
                            <th>PROBABILIDADE</th>
                            <th>RESPONSÁVEL</th>
                            <th>STATUS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {listaRiscos.length > 0 ? (
                            listaRiscos.map((risco, index) => (
                                <tr
                                    key={risco.id || index}
                                    className={risco.status === 'Resolvido' ? 'linha-resolvido' : ''}
                                >

                                    <td><strong>{risco.codigo || `R-${risco.id || 'N/D'}`}</strong></td>

                                    <td>
                                        <strong>{risco.titulo || 'título pendente...'}</strong>
                                        <span className="sub-text">
                                            {risco.nome_categoria ? `${risco.nome_categoria}` : 'Categoria não definida'}
                                        </span>
                                    </td>

                                    <td>
                                        <span className={`badge-impacto ${painel.getImpactoClass(risco.impacto)}`}>
                                            {painel.getImpactoLabel(risco.impacto)}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={`badge-probabilidade ${painel.getImpactoClass(risco.probabilidade)}`}>
                                            {painel.getProbabilidadeLabel(risco.probabilidade)}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="user">
                                            <div
                                                className={`avatar-pk ${painel.getAvatarColor(risco.nome_responsavel || risco.responsavel)}`}>
                                                {painel.getIniciais(risco.nome_responsavel || 'N/D')}
                                            </div>
                                            {risco.nome_responsavel || 'Responsável não definido'}
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`badge-status ${painel.getStatusClass(risco.status)}`}>
                                            {risco.status ? risco.status.toUpperCase() : 'IDENTIFICAÇÃO'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>
                                    Nenhum risco sob monitoramento no momento.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <span>Mostrando {listaRiscos.length} de {kpis.total_absoluto} riscos registrados</span>
                    <div className="pagination">
                        <button>&lt;</button>
                        <button>&gt;</button>
                    </div>
                </div>
            </div>

            <div className="add-btn">
                <Link to="/registrar-risco">+</Link>
            </div>
        </div>


    );
}


export default Painel