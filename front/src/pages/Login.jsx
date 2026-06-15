import {useState} from 'react'
import '../style/Login.css'
import '../style/Variaveis.css'
import { Navigate, Link, useNavigate} from 'react-router-dom'
import {useAuth} from "../hooks/AuthContext.jsx";


function Login() {
    const navigate = useNavigate()

    const [matricula, setMatricula] = useState('')
    const [senha, setSenha] = useState('')
    const [mensagemErro, setMensagemErro] = useState('')
    const [loading, setLoading] = useState(false)
    const { usuario, carregando, fazerLogin} = useAuth()

    if (carregando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Verificando sessão...</p>
            </div>
        );
    }

    if (usuario) {
        return <Navigate to="/painel" replace />;
    }

    const buscaUsuario = async (evento) => {
        evento.preventDefault()

        if (loading) return;

        setLoading(true)

        try {
            await fazerLogin(matricula, senha)

            const resposta = await
                fetch("http://localhost:8000/api/login/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        matricula: matricula,
                        senha: senha
                    })
                })

            if (resposta.ok) {

                const dados = await resposta.json();
                console.log("Login com sucesso!");

                setMensagemErro('');

                localStorage.setItem('uid', dados.uid)

                navigate(`/painel`)
            } else {
                setMensagemErro("Matricula ou senha incorretos!");
            }

        } catch (erro) {
            console.log("Erro ao conectar com o servidor: ", erro);
            setMensagemErro(erro);
        } finally {

            setLoading(false)
        }
    }

    return (

        <main>

            <div className="back">

                <section>

                    <div className="title">
                        <h1>Gestor de Risco</h1>
                        <p>Sistema de Gestão de Risco Institucional</p>
                    </div>

                    <form onSubmit={buscaUsuario} className="form">

                            <div className="input-group">
                                <label>Matricula</label>
                                <input type="text" value={matricula} placeholder="20*******" onChange={
                                    (e) => setMatricula(e.target.value)} required/>
                            </div>

                            <div className="input-group">
                                <label>Senha</label>
                                <input type="password" value={senha} placeholder="*******"
                                       onChange={(e) => setSenha(e.target.value)}
                                       required
                                />
                            </div>

                            {mensagemErro && <p className="erro-msg">{mensagemErro}</p>}

                            <div className="post-btn">
                                <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </button>
                            </div>
                        </form>

                    <div className="links">
                        <Link to="/recuperar-senha" className="esqueci-senha">Esqueci minha senha</Link>
                        <Link to="/cadastro" className="criar-conta">Criar conta</Link>
                    </div>

                </section>



            </div>


        </main>
    );
}

export default Login
