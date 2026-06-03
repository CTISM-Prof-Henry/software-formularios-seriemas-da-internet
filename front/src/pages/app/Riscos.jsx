import {Link, NavLink,} from 'react-router-dom'
import '../../style/Painel.css'
import '../../style/Main.css'
import '../../style/Riscos.css'
import {TodosRiscos} from "../../hooks/useRiscos.js";


function Riscos() {

    const {riscos} = TodosRiscos()

    const getCorCategoria = (categoria) => {
        if (categoria === 'Financeiro') return 'badge-azul';
        if (categoria === 'Legal') return 'badge-roxo';
        if (categoria === 'Imagem') return 'badge-vermelho';
        if (categoria === 'Operacional') return 'badge-verde';
        return 'badge-cinza';
    };

    const getCorNivel = (nivel) => {
        if (nivel.includes('Alto')) return 'badge-vermelho';
        if (nivel.includes('Médio')) return 'badge-laranja';
        if (nivel.includes('Baixo')) return 'badge-verde';
        return 'badge-cinza';
    };

    const getCorEtapa = (etapa) => {
        if (etapa === 'Tratamento') return 'badge-roxo';
        if (etapa === 'Avaliação') return 'badge-laranja';
        if (etapa === 'Identificação') return 'badge-azul';
        return 'badge-cinza';
    };

    return (
        <div className="painel">

            <div className="title">
                <h2>Todos os riscos</h2>
                <p>{riscos.length} riscos registrados no ciclo 2026</p>
            </div>

            <div className="tabela-container">

                <div className="filtros-topo">
                    <span>Todas as categorias</span>
                    <span>Todos os níveis</span>
                    <span>Todos os desafios</span>
                </div>


                <table className="tabela-riscos">
                    <thead>
                    <tr>
                        <th>CÓDIGO</th>
                        <th>RISCO</th>
                        <th>CATEGORIA</th>
                        <th>P</th>
                        <th>I</th>
                        <th>NÍVEL</th>
                        <th>ETAPA</th>
                        <th>AÇÃO</th>
                    </tr>
                    </thead>
                    <tbody>
                    {riscos.map((risco, index) => (
                        <tr key={index}>
                            <td className="codigo">{risco.codigo}</td>
                            <td className="descricao">{risco.descricao}</td>

                            <td>
                                <span className={`badge ${getCorCategoria(risco.categoria)}`}>
                                  {risco.categoria}
                                </span>
                            </td>

                            <td>{risco.p}</td>
                            <td>{risco.i}</td>

                            <td>
                                <span className={`badge ${getCorNivel(risco.nivel)}`}>
                                  {risco.nivel}
                                </span>
                            </td>

                            <td>
                                <span className={`badge ${getCorEtapa(risco.etapa)}`}>
                                  {risco.etapa}
                                </span>
                            </td>

                            <td>
                                <button className="btn-ver">Ver</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="rodape-tabela">
                    <p>Exibindo {riscos.length} riscos</p>
                </div>
            </div>


        </div>

    );

}

export default Riscos