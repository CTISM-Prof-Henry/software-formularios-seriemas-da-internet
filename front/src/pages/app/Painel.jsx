import { Link, NavLink,  } from 'react-router-dom'
import '../../style/Painel.css'
import '../../style/Main.css'
import {useAuth} from "../../hooks/useAuth.js";
import {TodosRiscos} from "../../hooks/useRiscos.js";
import {useDesafios} from "../../hooks/useDesafios.js";

function Painel() {

    const { usuario, fazerLogout } = useAuth()
    const { riscos } = TodosRiscos()
    const { desafios } = useDesafios()


    return (

        <div className="painel">

            <div className="title">
                <h2>Painel de Controle</h2>
                <p>Visão geral do planejamento de riscos - ano 2026</p>
            </div>

            <div className="riscos-estatisticas">

                <div className="block">
                    <h5>Total de riscos</h5>
                    <p>{riscos.length}</p>
                </div>

                <div className="block">
                    <h5>Risco críticos</h5>
                    <p>6</p>
                </div>

                <div className="block">
                    <h5>Em tratamento</h5>
                    <p>11</p>
                </div>

                <div className="block">
                    <h5>Concluídos</h5>
                    <p>7</p>
                </div>

            </div>

            <div className="Desafios">

                <h3>Desafios estratégicos</h3>

                <div className="cards">

                    {desafios.map((desafio) => (
                        <div className="desafio-card" key={desafio.id}>
                            <h4>Desafio {desafio.id}</h4>
                            <p>{desafio.nome}</p>
                            <label>3 riscos - 1 crítico</label>
                        </div>
                    ))}

                </div>

            </div>

            <div className="botoes-acoes">
                <NavLink to="/re" className="novo">+ Registrar novo Risco</NavLink>
                <NavLink >Ver todos os Riscos </NavLink>
                <NavLink>Matriz de Risco </NavLink>
            </div>

    </div>



);
}


export default Painel