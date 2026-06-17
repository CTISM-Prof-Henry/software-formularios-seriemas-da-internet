import React, {useState, useEffect} from 'react';
import '../../style/Desafios.css';
import {TbWorld} from "react-icons/tb";
import {
    MdSchool,
    MdPeople,
    MdScience,
    MdEnergySavingsLeaf,
    MdArrowRightAlt,
    MdBusinessCenter,
    MdTrendingUp
} from "react-icons/md";
import {useAuth} from "../../hooks/AuthContext.jsx";
import {useNavigate} from 'react-router-dom';

function Desafios() {
    const {usuario} = useAuth();
    const isAuditor = usuario?.perfil_acesso?.toLowerCase() === 'auditor';
    const navigate = useNavigate();


    const [desafios, setDesafios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDesafios = async () => {
            try {

                const response = await fetch('http://localhost:8000/api/desafios/', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                });

                if (response.ok) {
                    const data = await response.json();
                    setDesafios(data);
                }
            } catch (error) {
                console.error("Erro ao buscar desafios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDesafios();
    }, []);


    const irParaRiscos = (nomeDesafio) => {
        navigate(`/todos-riscos?q=${encodeURIComponent(nomeDesafio)}`);
    };


    const getVisualDoDesafio = (nome) => {
        const nomeLower = nome.toLowerCase();

        if (nomeLower.includes('internacionalização')) {
            return {
                icon: <TbWorld/>,
                iconBoxClass: 'gray-light',
                badgeClass: 'badge-blue',
                badgeText: 'ALTA PRIORIDADE'
            };
        }
        if (nomeLower.includes('educação') || nomeLower.includes('acadêmica')) {
            return {
                icon: <MdSchool/>,
                iconBoxClass: 'gray-light',
                badgeClass: 'badge-blue-light',
                badgeText: 'ESTRATÉGICO'
            };
        }
        if (nomeLower.includes('inclusão')) {
            return {icon: <MdPeople/>, iconBoxClass: 'red-light', badgeClass: 'badge-red', badgeText: 'ALERTA CRÍTICO'};
        }
        if (nomeLower.includes('inovação') || nomeLower.includes('tecnologia')) {
            return {
                icon: <MdScience/>,
                iconBoxClass: 'gray-light',
                badgeClass: 'badge-blue-light',
                badgeText: 'INOVAÇÃO'
            };
        }
        if (nomeLower.includes('ambiental') || nomeLower.includes('sustentável')) {
            return {
                icon: <MdEnergySavingsLeaf/>,
                iconBoxClass: 'gray-light',
                badgeClass: 'badge-blue-light',
                badgeText: 'AMBIENTAL'
            };
        }
        if (nomeLower.includes('modernização') || nomeLower.includes('organizacional')) {
            return {
                icon: <MdBusinessCenter/>,
                iconBoxClass: 'gray-light',
                badgeClass: 'badge-blue-light',
                badgeText: 'OPERACIONAL'
            };
        }
        if (nomeLower.includes('desenvolvimento') || nomeLower.includes('regional')) {
            return {
                icon: <MdTrendingUp/>,
                iconBoxClass: 'gray-light',
                badgeClass: 'badge-blue-light',
                badgeText: 'INSTITUCIONAL'
            };
        }

        return {icon: <TbWorld/>, iconBoxClass: 'gray-light', badgeClass: 'badge-blue-light', badgeText: 'ESTRATÉGICO'};
    };

    return (
        <div className="desafios-page">
            <div className="desafios-header">
                <div className="header-info">
                    <div className="header-title">
                        <h1>Desafios Estratégicos</h1>
                        <p>
                            Monitoramento do progresso institucional e mitigação de riscos críticos associados aos
                            objetivos
                            do Ciclo 2026.
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <h3 style={{padding: '20px'}}>Carregando desafios...</h3>
            ) : (
                <div className="desafios-grid">

                    {desafios.map((desafio) => {
                        const visual = getVisualDoDesafio(desafio.nome);

                        return (
                            <div className="desafio-card" key={desafio.id}>
                                <div className="card-top">
                                    <div className={`icon-box ${visual.iconBoxClass}`}>
                                        {visual.icon}
                                    </div>
                                    <span className={`badge ${visual.badgeClass}`}>
                                        {visual.badgeText}
                                    </span>
                                </div>

                                <h3>{desafio.numero} - {desafio.nome}</h3>

                                <p>{desafio.descricao ? desafio.descricao : 'Descrição não definida'}</p>

                                <button
                                    className="btn-card-outline"
                                    onClick={() => irParaRiscos(desafio.nome)}
                                >
                                    Ver riscos associados
                                    <MdArrowRightAlt/>
                                </button>
                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
}

export default Desafios;