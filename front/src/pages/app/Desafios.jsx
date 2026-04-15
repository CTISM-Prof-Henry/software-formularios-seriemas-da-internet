import photoUser from "../../assets/do-utilizador.png";
import { Link, NavLink } from 'react-router-dom'
import Painel from "./Painel.jsx";
import {useAuth} from "../../hooks/useAuth.js";


function Desafios() {

    const { usuario, fazerLogout } = useAuth()

    return (
        <main>

            <header>
                <div className="logo">
                    <h1>Gestor de Risco</h1>
                    <p>| Planejamento 2026</p>
                </div>

                <div className="user">
                    <p>{usuario.first_name + " " + usuario.last_name}</p>
                    <img src={photoUser} alt="profile image" />
                    <button onClick={fazerLogout}>Sair</button>
                </div>

            </header>


            <aside>


                <div className="menu">
                    <p>NAVEGAÇÃO</p>

                    <NavLink
                        to="/painel"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Painel
                    </NavLink>

                    <NavLink
                        to="/desafios"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Desafios estratégicos
                    </NavLink>

                    <NavLink
                        to="/riscos"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Todos os riscos
                    </NavLink>

                    <NavLink
                        to="/registrar-risco"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Registrar riscos
                    </NavLink>
                </div>



            </aside>


        </main>
    );
}


export default Desafios