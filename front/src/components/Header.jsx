import '../style/components/Header.css'
import {useAuth} from "../hooks/AuthContext.jsx"
import {useTheme} from '../hooks/useTheme';
import {useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import {FaChevronDown, FaUserShield, FaSignOutAlt, FaSun, FaMoon} from 'react-icons/fa';

function Header() {

    const {theme, toggleTheme} = useTheme();
    const {usuario, fazerLogout} = useAuth()
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const dropdownRef = useRef(null);

    const iniciais = usuario?.first_name
        ? `${usuario.first_name[0]}${usuario?.last_name?.[0] || ''}`.toUpperCase() : '--';

    useEffect(() => {
        const handleClickFora = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownAberto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFora);
        return () => document.removeEventListener('mousedown', handleClickFora);
    }, []);

    const isAuditor = usuario?.perfil_acesso?.toLowerCase() === 'auditor';

    return (

        <header>
            <div className="logo">
                <h1>Gestor de Risco</h1>
                <p>| Planejamento 2026</p>
            </div>

            <div className="header-user-section" ref={dropdownRef}>
                <button
                    className="user-profile-btn"
                    onClick={() => setDropdownAberto(!dropdownAberto)}
                >
                    <div className="avatar-small">
                        {iniciais}
                    </div>
                    <span className="user-name">
                        {usuario?.first_name ? `${usuario.first_name} ${usuario.last_name || ''}` : 'Usuário'}
                    </span>
                    <FaChevronDown className={`icon-arrow ${dropdownAberto ? 'open' : ''}`}/>
                </button>


                {dropdownAberto && (
                    <div className="user-dropdown">
                        <div className="dropdown-header">
                            <strong>{usuario?.username}</strong>
                            <span>{usuario?.nome_unidade || 'Unidade nao definida'}</span>
                        </div>

                        <ul className="dropdown-menu">

                            {isAuditor && (
                                <li>
                                    <Link to="/adminstrador" onClick={() => setDropdownAberto(false)}>
                                        <FaUserShield/> Administração
                                    </Link>
                                </li>
                            )}


                            <button onClick={toggleTheme} className="btn-theme">
                                {theme === 'light' ? <FaMoon /> : <FaSun />}
                            </button>


                            <li className="logout-item">
                                <button onClick={fazerLogout} className="btn-logout btn-dropdown-item">
                                    <FaSignOutAlt/> Sair do Sistema
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

        </header>

    )
}


export default Header