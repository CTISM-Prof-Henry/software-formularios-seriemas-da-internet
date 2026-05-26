import { Link, NavLink,  } from 'react-router-dom'
import '../../style/Painel.css'
import '../../style/Main.css'
import {useAuth} from "../../hooks/useAuth.js";

function Painel() {

    const { usuario, fazerLogout } = useAuth()


    return (

        <div className="painel">

            <div className="title">
                <h2>Painel de Controle</h2>
                <p>Visão geral do planejamento de riscos - ano 2026</p>
            </div>

            <div className="riscos-estatisticas">

                <div className="block">
                    <h5>Total de riscos</h5>
                    <p>24</p>
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

                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>

                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>

                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>

                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>
                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>

                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>

                    <div className="desafio-card">
                        <h4>Desafio 1</h4>
                        <p>Internacionalização</p>
                        <label>3 riscos - 1 crítico</label>
                    </div>

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