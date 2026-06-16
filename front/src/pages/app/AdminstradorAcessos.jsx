import React, {useState} from 'react';
import '../../style/Administrador.css';
import {useAdmin} from "../../hooks/useAdmin.js";
import {HiUsers} from "react-icons/hi2";
import {GoShieldCheck} from "react-icons/go";
import {CiSearch} from "react-icons/ci";
import {MdClose} from "react-icons/md";
import {useAuth, getCookie} from "../../hooks/AuthContext.jsx";



function AdministradorAcessos() {
    const [termoBusca, setTermoBusca] = useState('');
    const [limiteExibicao, setLimiteExibicao] = useState(5);
    const {countUsuarios, usuarios, loading, erro} = useAdmin(limiteExibicao, termoBusca);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const {usuario} = useAuth()

    React.useEffect(() => {
        if (usuarios) setListaUsuarios(usuarios);
    }, [usuarios]);

    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [novoPerfil, setNovoPerfil] = useState('');
    const [isSalvando, setIsSalvando] = useState('ocisoso');

    const totalAdmins = listaUsuarios.filter(u => u.perfil_acesso?.toLowerCase() === 'auditor' ||
        u.perfil_acesso?.toLowerCase() === 'admin').length;


    const abrirModal = (user) => {
        setUsuarioEditando(user);
        setNovoPerfil(user.perfil_acesso || 'Gestor');
        setIsSalvando('ocioso');
    };

    const fecharModal = () => {
        setUsuarioEditando(null);
        setNovoPerfil('');
        setIsSalvando('ocioso');
    };

    const salvarNovaPermissao = async () => {
        if (!usuarioEditando) return;
        setIsSalvando('Salvando...');

        const csrfToken = getCookie('csrftoken')

        try {

            const res = await fetch(`http://localhost:8000/api/usuario/${usuarioEditando.id}/permissao/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({perfil_acesso: novoPerfil})
            });

            if (res.ok) {
                setListaUsuarios(prev => prev.map(u =>
                    u.id === usuarioEditando.id ? {...u, perfil_acesso: novoPerfil} : u
                ));

                setIsSalvando('Salvo!')

                setTimeout(() => {
                    fecharModal();
                }, 1500);
            } else {
                alert("Erro ao atualizar permissão no servidor.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro de conexão.");
        }
    };

    const formatarData = (dataIso) => {
        if (!dataIso) return "Nunca acessou";

        const data = new Date(dataIso);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(', ', ' às ');
    };

    return (
        <div className="gestao-container">

            <div className="gestao-header">
                <div className="header-info">
                    <h2>Gestão de Usuários</h2>
                    <p>Administre acessos e permissões dos colaboradores da instituição.</p>
                </div>
            </div>

            <div className="kpi-row">

                <div className="kpi-card-adm">
                    <div className="kpi-icon-box bg-gray">
                        <HiUsers/>
                    </div>

                    <div className="kpi-info">
                        <span>TOTAL DE USUÁRIOS</span>
                        <h3>{loading ? '...' : countUsuarios}</h3>
                    </div>
                </div>


                <div className="kpi-card-adm">
                    <div className="kpi-icon-box bg-blue">
                        <GoShieldCheck/>
                    </div>

                    <div className="kpi-info">
                        <span>ADMINISTRADORES NA TELA</span>
                        <h3>{totalAdmins}</h3>
                    </div>
                </div>
            </div>


            <div className="header-search"
                 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div className="search-input-container">

                    <CiSearch className="search-icon"/>

                    <input
                        type="text"
                        placeholder="Buscar por nome ou departamento..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </div>

                <div className="limit-filter">

                    <label style={{marginRight: '10px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>Exibir:</label>
                    <select
                        style={{
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--white)',
                            color: 'var(--text-dark)'
                        }}
                        value={limiteExibicao}
                        onChange={(e) => setLimiteExibicao(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>


            <div className="tabela-card" style={{marginTop: '20px'}}>

                <div className="tabela-card" style={{marginTop: '20px'}}>
                    <div className="tabela-responsive">
                        <table>
                            <thead>
                            <tr>
                                <th>USUÁRIO</th>
                                <th>DEPARTAMENTO</th>
                                <th>CARGO</th>
                                <th>STATUS</th>
                                <th>ULTIMO LOGIN</th>
                                <th className="text-right">AÇÕES</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Carregando
                                        usuários...
                                    </td>
                                </tr>
                            ) : listaUsuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Nenhum usuário
                                        encontrado.
                                    </td>
                                </tr>
                            ) : (
                                listaUsuarios.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff`}
                                                    alt={`Avatar`}
                                                    className="avatar-img"
                                                />
                                                <div className="user-details">
                                                    <strong>{user.first_name} {user.last_name}</strong>
                                                    <span>{user.email || 'Sem email'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-dark">{user.nome_unidade || 'Não definido'}</span>
                                        </td>
                                        <td>
                                            <span className={`badge-cargo`}>{user.perfil_acesso || 'Gestor'}</span>
                                        </td>
                                        <td>
                                            <div className="status-cell">
                                                <span
                                                className={`status-dot ${user.is_active ? 'dot-active' : 'dot-inactive'}`}></span>
                                                <span
                                                    className={user.is_active ? 'text-active' : 'text-inactive'}>{user.is_active ? 'Ativo' : 'Inativo'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span>{formatarData(user.last_login)}</span>
                                        </td>
                                        <td className="text-right">

                                            <button
                                                className={`btn-editar ${usuario?.id === user.id ? 'disabled' : ''}`}
                                                onClick={() => abrirModal(user)}
                                                disabled={usuario?.id === user.id}
                                            >
                                                <GoShieldCheck style={{marginRight: '5px'}}/>
                                                EDITAR PERMISSÕES
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {usuarioEditando && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Editar Permissões de Acesso</h3>
                                <button className="btn-close" onClick={fecharModal}><MdClose/></button>
                            </div>

                            <div className="modal-body">
                                <p className="modal-subtitle">
                                    Alterar nível de acesso
                                    para <strong>{usuarioEditando.first_name} {usuarioEditando.last_name}</strong>.
                                </p>

                                <div className="form-group-modal">
                                    <label>Perfil de Acesso no Sistema</label>
                                    <select
                                        value={novoPerfil}
                                        onChange={(e) => setNovoPerfil(e.target.value)}
                                    >
                                        <option value="Admin">Administrador (Acesso Total)</option>
                                        <option value="Auditor">Auditor (Apenas Leitura e Recomendações)</option>
                                        <option value="Gestor">Gestor de Riscos (Operacional)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-cancelar" onClick={fecharModal} disabled={isSalvando === 'Salvando...'}>
                                    Cancelar
                                </button>
                                <button className="btn-salvar" onClick={salvarNovaPermissao} disabled={isSalvando === 'Salvando...'}>
                                    {isSalvando === 'ocioso' ? 'Confirmar Alteração' : isSalvando}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdministradorAcessos;