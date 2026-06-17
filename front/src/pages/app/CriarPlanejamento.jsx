import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getCookie} from "../../hooks/AuthContext.jsx";
import '../../style/RegistroRisco.css';
import '../../style/CriarPlanejamento.css';
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function CriarPlanejamento() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [carregandoDados, setCarregandoDados] = useState(true);
    const [erroMsg, setErroMsg] = useState('');

    const [sucessoModalAberto, setSucessoModalAberto] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    const [encerrarModalAberto, setEncerrarModalAberto] = useState(false);
    const [mensagemEncerrar, setMensagemEncerrar] = useState('');

    const [planejamentoId, setPlanejamentoId] = useState(null);

    const [formData, setFormData] = useState({
        ano: new Date().getFullYear(),
        titulo: '',
        descricao: '',
        data_inicio: '',
        data_fim: '',
        status: 'Ativo'
    });

    useEffect(() => {
        const buscarPlanejamentoAtivo = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/obter-planejamento/", {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const dados = await response.json();
                    if (dados && dados.id) {
                        setPlanejamentoId(dados.id);
                        setFormData({
                            ano: dados.ano,
                            titulo: dados.titulo || '',
                            descricao: dados.descricao || '',
                            data_inicio: dados.data_inicio || '',
                            data_fim: dados.data_fim || '',
                            status: dados.status || 'Ativo'
                        });
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar planejamento ativo:", error);
            } finally {
                setCarregandoDados(false);
            }
        };

        buscarPlanejamentoAtivo();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErroMsg('');

        const csrfToken = getCookie('csrftoken');

        const metodoHTTP = planejamentoId ? 'PATCH' : 'POST';
        const url = planejamentoId
            ? `http://localhost:8000/api/planejamento/${planejamentoId}/`
            : `http://localhost:8000/api/planejamento/`;

        try {
            const response = await fetch(url, {
                method: metodoHTTP,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    ano: parseInt(formData.ano, 10)
                })
            });

            if (response.ok) {
                const dados = await response.json();
                setMensagemSucesso(dados.mensagem || (planejamentoId ? "Planejamento atualizado com sucesso!" : "Ciclo criado com sucesso!"));
                setSucessoModalAberto(true);
            } else {
                try {
                    const dadosErro = await response.json();
                    setErroMsg(dadosErro.erro || "Erro na validação dos dados.");
                } catch {
                    setErroMsg("Erro interno no servidor (500). Verifique o terminal do Django.");
                }
            }
        } catch (error) {
            setErroMsg("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };


    const abrirModalEncerrar = () => {
        setMensagemEncerrar("Tem certeza que deseja encerrar este ciclo? Riscos vinculados a este ano não poderão mais ser alterados.");
        setEncerrarModalAberto(true);
    };


    const confirmarEncerramento = async () => {
        setLoading(true);
        const csrfToken = getCookie('csrftoken');

        try {
            const response = await fetch(`http://localhost:8000/api/planejamento/${planejamentoId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ status: 'Encerrado' })
            });

            if (response.ok) {
                setEncerrarModalAberto(false);
                setMensagemSucesso("Ciclo encerrado e histórico congelado com sucesso!");
                setSucessoModalAberto(true);
            } else {
                setEncerrarModalAberto(false);
                setErroMsg("Erro ao tentar encerrar o ciclo.");
            }
        } catch (error) {
            setEncerrarModalAberto(false);
            setErroMsg("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const lidarComFechamentoSucesso = () => {
        setSucessoModalAberto(false);
        navigate('/administrador');
    };

    if (carregandoDados) {
        return <div className="loading-ciclo">Carregando dados do ciclo...</div>;
    }

    return (
        <div className="cadastro-container">
            <div className="page-header">
                <h2>{planejamentoId ? 'Gerenciar Ciclo de Riscos' : 'Abertura de Novo Ciclo de Riscos'}</h2>
                <p>Configure o ano vigente e os prazos limite para a identificação e tratamento de riscos institucionais.</p>
            </div>

            <form className="form-risco" onSubmit={handleSubmit}>
                <div className="form-card">

                    {formData.status === 'Encerrado' && (
                        <div className="aviso-encerrado">
                            <p>Este ciclo encontra-se ENCERRADO. Os dados são apenas para leitura histórica.</p>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group grupo-titulo">
                            <label>Título do Planejamento *</label>
                            <input
                                type="text"
                                name="titulo"
                                placeholder="Ex: Matriz de Riscos da UFSM - Exercício 2026"
                                value={formData.titulo}
                                onChange={handleChange}
                                disabled={formData.status === 'Encerrado'}
                                required
                            />
                        </div>

                        <div className="form-group grupo-ano input-group">
                            <label>Ano do Ciclo *</label>
                            <input
                                type="number"
                                name="ano"
                                min="2000"
                                max="2100"
                                value={formData.ano}
                                onChange={handleChange}
                                disabled={planejamentoId !== null}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Data de Início do Ciclo *</label>
                            <input
                                type="date"
                                name="data_inicio"
                                value={formData.data_inicio}
                                onChange={handleChange}
                                disabled={formData.status === 'Encerrado'}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Data de Encerramento *</label>
                            <input
                                type="date"
                                name="data_fim"
                                value={formData.data_fim}
                                onChange={handleChange}
                                disabled={formData.status === 'Encerrado'}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Diretrizes / Descrição do Planejamento</label>
                        <textarea
                            name="descricao"
                            placeholder="Insira as metas de governança, escopo ou notas de orientação da auditoria para este ano..."
                            rows="4"
                            value={formData.descricao}
                            onChange={handleChange}
                            disabled={formData.status === 'Encerrado'}
                        ></textarea>
                    </div>

                    {erroMsg && <p className="mensagem-erro-planejamento">{erroMsg}</p>}

                    <div className="botoes-acao-planejamento">
                        {formData.status !== 'Encerrado' && (
                            <button type="submit" className="btn-save" disabled={loading}>
                                {loading ? 'Processando...' : planejamentoId ? 'Salvar Alterações' : 'Iniciar Ciclo Institucional'}
                            </button>
                        )}

                        {planejamentoId && formData.status !== 'Encerrado' && (
                            <button
                                type="button"
                                className="btn-encerrar"
                                onClick={abrirModalEncerrar}
                                disabled={loading}
                            >
                                Encerrar Ciclo
                            </button>
                        )}

                        <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>
                            Voltar
                        </button>
                    </div>
                </div>
            </form>


            {sucessoModalAberto && (
                <div className="modal-overlay">
                    <div className="modal-content modal-sucesso-content">
                        <div className="modal-icon-wrapper">
                            <div className="modal-icon-success">
                                <FaCheck/>
                            </div>
                        </div>

                        <div className="modal-body modal-sucesso-body">
                            <h3>Sucesso!</h3>
                            <p>
                                {mensagemSucesso}
                            </p>
                        </div>

                        <div className="modal-footer modal-sucesso-footer">
                            <button
                                className="btn-modal-ok"
                                onClick={lidarComFechamentoSucesso}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {encerrarModalAberto && (
                <div className="modal-overlay">
                    <div className="modal-content modal-sucesso-content">
                        <div className="modal-icon-wrapper">
                            <div className="modal-icon-encerrar">
                                <IoClose/>
                            </div>
                        </div>

                        <div className="modal-body modal-sucesso-body">
                            <h3>Encerrar Ciclo?</h3>
                            <p>
                                {mensagemEncerrar}
                            </p>
                        </div>

                        <div className="modal-footer modal-sucesso-footer" style={{ display: 'flex', gap: '10px' }}>

                            <button
                                className="btn-encerrar"
                                onClick={confirmarEncerramento}
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Encerrando...' : 'Encerrar'}
                            </button>
                            <button
                                className="btn-cancelar"
                                onClick={() => setEncerrarModalAberto(false)}
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CriarPlanejamento;