import React, {useState, useEffect} from 'react';
import '../../style/MatrizRisco.css';
import {FiGrid} from "react-icons/fi";
import {
    FaMoneyBillWave,
    FaBalanceScale,
    FaCogs,
    FaChartLine,
    FaShieldAlt,
    FaBullhorn,
    FaGlobeAmericas
} from "react-icons/fa";

const getCellColor = (imp, prob) => {
    const id = `${imp},${prob}`;
    const colors = {
        '5,1': 'yellow', '5,2': 'orange', '5,3': 'pink', '5,4': 'pink', '5,5': 'pink',
        '4,1': 'yellow', '4,2': 'yellow', '4,3': 'orange', '4,4': 'pink', '4,5': 'pink',
        '3,1': 'green', '3,2': 'yellow', '3,3': 'yellow', '3,4': 'orange', '3,5': 'orange',
        '2,1': 'green', '2,2': 'green', '2,3': 'yellow', '2,4': 'yellow', '2,5': 'orange',
        '1,1': 'green', '1,2': 'green', '1,3': 'green', '1,4': 'yellow', '1,5': 'yellow',
    };
    return colors[id] || 'green';
};

function MatrizRiscos() {

    const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [matrizData, setMatrizData] = useState([]);
    const [categoriaCounts, setCategoriaCounts] = useState({
        estrategico: 0,
        operacional: 0,
        integridade: 0,
        imagem: 0,
        legal: 0,
        financeiro: 0,
        ambiente: 0
    });

    useEffect(() => {
        const carregarDadosMatriz = async () => {

            try {

                const response = await fetch('http://localhost:8000/api/riscos/?limit=2000', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                });

                if (response.ok) {
                    const riscos = await response.json();


                    const counts = {};
                    for (let i = 1; i <= 5; i++) {
                        for (let p = 1; p <= 5; p++) {
                            counts[`${i},${p}`] = 0;
                        }
                    }

                    const catCounts = {
                        estrategico: 0, operacional: 0, integridade: 0,
                        imagem: 0, legal: 0, financeiro: 0, ambiente: 0
                    };

                    riscos.forEach(risco => {
                        if (risco.impacto && risco.probabilidade) {
                            const coord = `${risco.impacto},${risco.probabilidade}`;
                            if (counts[coord] !== undefined) {
                                counts[coord]++;
                            }
                        }

                        const nomeCat = (risco.nome_categoria || '').toLowerCase();
                        if (nomeCat.includes('estratégic') || nomeCat.includes('estrategic')) catCounts.estrategico++;
                        else if (nomeCat.includes('opera')) catCounts.operacional++;
                        else if (nomeCat.includes('integri')) catCounts.integridade++;
                        else if (nomeCat.includes('imagem')) catCounts.imagem++;
                        else if (nomeCat.includes('legal') || nomeCat.includes('conformidade')) catCounts.legal++;
                        else if (nomeCat.includes('financeiro') || nomeCat.includes('orçament')) catCounts.financeiro++;
                        else if (nomeCat.includes('ambiente') || nomeCat.includes('extremo')) catCounts.ambiente++;
                    });


                    const novaMatrizData = [];
                    for (let imp = 5; imp >= 1; imp--) {
                        for (let prob = 1; prob <= 5; prob++) {
                            const id = `${imp},${prob}`;
                            const valor = counts[id];
                            novaMatrizData.push({
                                id,
                                val: valor < 10 ? `0${valor}` : valor.toString(),
                                color: getCellColor(imp, prob),
                                opacidade: valor === 0 ? 0.3 : 1
                            });
                        }
                    }

                    setMatrizData(novaMatrizData);
                    setCategoriaCounts(catCounts);
                    if (riscos.length > 0) {
                        const dataDoBanco = riscos[0].data_criacao

                        setUltimaAtualizacao(dataDoBanco ? new Date(dataDoBanco) : new Date());
                    } else {
                        setUltimaAtualizacao(new Date());
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados da matriz:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDadosMatriz();
    }, []);

    const formatarData = (data) => {
        if (!data) return 'Calculando...';
        return data.toLocaleString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).replace(' de ', ' de ').replace(' às ', ' - ');
    };

    const formatarCount = (valor) => valor < 10 ? `0${valor}` : valor;

    if (loading) return <div className="matriz-page-container"><h2 style={{padding: '30px'}}>Carregando Matriz
        Institucional...</h2></div>;

    return (
        <div className="matriz-page-container">
            <div className="matriz-header-title">
                <h1>Matriz de Riscos Institucional</h1>
                <p>Visualização consolidada do panorama de riscos para o Planejamento Estratégico 2026. Acompanhe a
                    distribuição de ameaças e oportunidades com base nos eixos de Impacto e Probabilidade.</p>
            </div>

            <div className="matriz-content-grid">


                <div className="matriz-main-card">
                    <div className="matriz-card-header">
                        <FiGrid className="header-icon"/>
                        <h2>Mapa de Calor Institucional</h2>
                    </div>

                    <div className="heatmap-layout">
                        <div className="y-axis-label">
                            <span>NÍVEL DE IMPACTO</span>
                        </div>

                        <div className="heatmap-core">

                            <div className="heatmap-grid-5x5">
                                {matrizData.map((cell) => (
                                    <div
                                        key={cell.id}
                                        className={`hm-box bg-${cell.color}`}
                                        style={{opacity: cell.opacidade}}
                                    >
                                        <span className="hm-coord">{cell.id}</span>
                                        <span className={`hm-value text-${cell.color}`}>{cell.val}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="x-axis-labels">
                                <span>BAXIXO</span>
                                <span>MÉDIO</span>
                                <span>ALTO</span>
                                <span>MUITO ALTO</span>
                                <span>CRÍTICO</span>
                            </div>
                            <div className="x-axis-title">GRAU DE PROBABILIDADE</div>
                        </div>
                    </div>
                </div>


                <div className="matriz-sidebar">

                    <div className="side-card">
                        <h3 className="side-title">LEGENDA DE SEVERIDADE</h3>
                        <ul className="legend-list">
                            <li><span className="legend-box bg-green border-green"></span> Risco Baixo (Monitoramento)
                            </li>
                            <li><span className="legend-box bg-yellow border-yellow"></span> Risco Médio (Ação
                                Preventiva)
                            </li>
                            <li><span className="legend-box bg-orange border-orange"></span> Risco Alto (Mitigação
                                Imediata)
                            </li>
                            <li><span className="legend-box bg-pink border-pink"></span> Risco Crítico (Contingência)
                            </li>
                        </ul>
                    </div>


                    <div className="side-card">
                        <h3 className="side-title">CATEGORIAS DE RISCO</h3>
                        <div className="category-list">
                            <div className="category-item strategic">
                                <div className="cat-name"><FaChartLine className="cat-icon" /> Estratégico</div>
                                <div className="cat-badge strategic-badge">{formatarCount(categoriaCounts.estrategico)}</div>
                            </div>

                            <div className="category-item">
                                <div className="cat-name"><FaCogs className="cat-icon" /> Operacional</div>
                                <div className="cat-badge">{formatarCount(categoriaCounts.operacional)}</div>
                            </div>

                            <div className="category-item">
                                <div className="cat-name"><FaShieldAlt className="cat-icon" /> Integridade</div>
                                <div className="cat-badge">{formatarCount(categoriaCounts.integridade)}</div>
                            </div>

                            <div className="category-item">
                                <div className="cat-name"><FaBullhorn className="cat-icon" /> Imagem</div>
                                <div className="cat-badge">{formatarCount(categoriaCounts.imagem)}</div>
                            </div>

                            <div className="category-item">
                                <div className="cat-name"><FaBalanceScale className="cat-icon" /> Legal / Conformidade</div>
                                <div className="cat-badge">{formatarCount(categoriaCounts.legal)}</div>
                            </div>

                            <div className="category-item">
                                <div className="cat-name"><FaMoneyBillWave className="cat-icon" /> Financeiro / Orçamentário</div>
                                <div className="cat-badge">{formatarCount(categoriaCounts.financeiro)}</div>
                            </div>

                            <div className="category-item">
                                <div className="cat-name"><FaGlobeAmericas className="cat-icon" /> Ambiente Extremo</div>
                                <div className="cat-badge">{formatarCount(categoriaCounts.ambiente)}</div>
                            </div>
                        </div>
                    </div>


                    <div className="update-card">
                        <span className="update-label">ÚLTIMA ATUALIZAÇÃO</span>
                        <span className="update-date">{formatarData(ultimaAtualizacao)}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MatrizRiscos;