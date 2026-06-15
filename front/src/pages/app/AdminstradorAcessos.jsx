import React, {useState} from 'react';
import '../../style/Administrador.css';
import {useAdmin} from "../../hooks/useAdmin.js";
import {HiUsers} from "react-icons/hi2";
import {GoShieldCheck} from "react-icons/go";
import {IoIosArrowForward, IoIosArrowBack} from "react-icons/io";
import {CiSearch} from "react-icons/ci";

function AdministradorAcessos() {
    const [termoBusca, setTermoBusca] = useState('');
    const [limiteExibicao, setLimiteExibicao] = useState(5);

    const {countUsuarios, usuarios, loading, erro} = useAdmin(limiteExibicao, termoBusca);
    const totalAdmins = usuarios.filter(u => u.perfil_acesso?.toLowerCase() === 'auditor' || u.perfil_acesso?.toLowerCase() === 'admin').length;

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
                        style={{padding: '8px',
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
                <div className="tabela-responsive">
                    <table>
                        <thead>
                        <tr>
                            <th>USUÁRIO</th>
                            <th>DEPARTAMENTO</th>
                            <th>CARGO</th>
                            <th>STATUS</th>
                            <th className="text-right">AÇÕES</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Carregando usuários...
                                </td>
                            </tr>
                        ) : usuarios.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Nenhum usuário
                                    encontrado.
                                </td>
                            </tr>
                        ) : (
                            usuarios.map((user) => (
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
                                            <span className="status-dot dot-active"></span>
                                            <span className="text-active">{user.is_active ? 'Ativo' : 'Inativo'}</span>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <button className="btn-editar">
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

                <div className="tabela-footer">
                    <span>Exibindo {usuarios.length} de {countUsuarios} usuários</span>
                    <div className="paginacao">
                        <button className="btn-page"><IoIosArrowBack/></button>
                        <button className="btn-page"><IoIosArrowForward/></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdministradorAcessos;