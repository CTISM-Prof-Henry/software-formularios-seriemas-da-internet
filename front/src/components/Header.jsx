import '../style/components/Header.css'
import { useAuth } from "../hooks/AuthContext.jsx"
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaUserShield, FaSignOutAlt, FaSun, FaMoon, FaBuilding, FaCheck } from 'react-icons/fa';

function Header() {

    const { theme, toggleTheme } = useTheme();
    const { usuario, fazerLogout } = useAuth()
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const dropdownRef = useRef(null);
    const [centro, setCentro] = useState()
    const [cicloAtual, setCicloAtual] = useState(null);

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


    useEffect(() => {
        const buscarCiclo = async () => {
            try {

                const response = await fetch("http://localhost:8000/api/obter-planejamento/", {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const dados = await response.json();
                    setCicloAtual(dados);
                }
            } catch (error) {
                console.error("Erro ao buscar o ciclo ativo:", error);
            }
        };

        buscarCiclo();
    }, []);


    const handleEntrarNoCentro = async (centroId) => {
        try {
            const response = await fetch("http://localhost:8000/api/usuario/entrar-centro/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ centro_id: centroId })
            });

            const dados = await response.json();
            if (response.ok) {
                setCentro(dados.body)
                window.location.reload();
            } else {
                console.log(dados.erro);
                alert(dados.erro);
            }
        } catch (error) {
            console.error("Erro ao mudar de centro:", error);
        }
    };

    return (
        <header>
            <div className="logo">
                <h1>Gestor de Risco</h1>
                <p>| {cicloAtual ? `Planejamento ${cicloAtual.ano}` : 'Sem Ciclo Ativo'}</p>
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
                            <span>{usuario?.nome_unidade || 'Unidade não definida'}</span>
                        </div>

                        <ul className="dropdown-menu">

                            {isAuditor && (
                                <li>
                                    <Link to="/administrador" onClick={() => setDropdownAberto(false)} className="btn-dropdown-item">
                                        <FaUserShield/> Administração
                                    </Link>
                                </li>
                            )}

                            <div className="dropdown-divider"></div>
                            <li style={{ padding: '4px 16px', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>
                                MEUS CENTROS:
                            </li>

                            {usuario?.centros_permitidos && usuario.centros_permitidos.length > 0 ? (
                                usuario.centros_permitidos.map((centro) => {
                                    const centroId = centro.id || centro;
                                    const centroNome = centro.nome || centro.sigla || `Centro ${centroId}`;

                                    const isActive = usuario?.centro_ativo === centroId || usuario?.centro_ativo?.id === centroId;

                                    return (
                                        <li key={centroId}>
                                            <button
                                                onClick={() => {
                                                    if(!isActive) handleEntrarNoCentro(centroId);
                                                }}
                                                className="btn-dropdown-item"
                                            >
                                                <span><FaBuilding style={{ marginRight: '8px' }}/> {centroNome}</span>
                                                {isActive && <FaCheck style={{ color: '#10b981' }} />}
                                            </button>
                                        </li>
                                    )
                                })
                            ) : (
                                <li style={{ padding: '8px 16px', fontSize: '13px', color: '#ccc' }}>
                                    Nenhum centro vinculado
                                </li>
                            )}
                            

                            <button onClick={toggleTheme} className="btn-theme ">
                                {theme === 'light' ? <><FaMoon/></> : <><FaSun/></>}
                            </button>


                            <li className="logout-item">
                                <button onClick={fazerLogout} className="btn-logout btn-dropdown-item">
                                    <FaSignOutAlt /> Sair do Sistema
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