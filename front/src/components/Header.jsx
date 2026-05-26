import '../style/Header.css'
import { useAuth } from "../hooks/useAuth.js";


function Header () {

    const {usuario, fazerLogout} = useAuth()

    const iniciais = usuario?.first_name
        ? `${usuario.first_name[0]}${usuario?.last_name?.[0] || ''}`.toUpperCase() : '--';

    return (

        <header>
            <div className="logo">
                <h1>Gestor de Risco</h1>
                <p>| Planejamento 2026</p>
            </div>

            <div className="user">
                <p>{usuario.first_name + " " + usuario.last_name}</p>
                <p>{iniciais}</p>
                <button onClick={fazerLogout}>Sair</button>
            </div>

        </header>

    )
}


export default Header