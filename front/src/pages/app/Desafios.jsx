import { Link, NavLink } from 'react-router-dom'
import {useAuth} from "../../hooks/useAuth.js";
import '../../style/Desafios.css'


function Desafios() {

    const { usuario, fazerLogout } = useAuth();

    return (

        <div className="painel">

            <div className="title">
                <h2>Desafios Estratégiocs 2026</h2>
                <label>Selecione um desafios para ver os riscos associados</label>
            </div>

            <div className="desafios">

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

                <div className="desafio-row">

                    <div className="grupo">
                        <span className="numero">1</span>
                        <div className="title">
                            <h3>Internacionalizacao</h3>
                            <label>3 riscos identificados - Progresso 40%</label>
                        </div>
                    </div>

                    <Link to="#">Ver riscos</Link>
                </div>

            </div>
        </div>



    );
}


export default Desafios