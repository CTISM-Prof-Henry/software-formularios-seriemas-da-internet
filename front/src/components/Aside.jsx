import { Link, NavLink,  } from 'react-router-dom'
import '../style/Aside.css'

function Aside() {


    return (
        <aside>

            <p>NAVEGAÇÃO</p>

            <NavLink to="/painel" className="nav-option">
                Painel
            </NavLink>

            <NavLink to="/desafios" className="nav-option">
                Desafios estratégicos
            </NavLink>

            <NavLink to="/riscos" className="nav-option">
                Todos os riscos
            </NavLink>

            <NavLink to="/registrar-risco" className="nav-option" >
                Registrar riscos
            </NavLink>

        </aside>

    )
}

export default Aside