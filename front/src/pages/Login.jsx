import {useState} from 'react'
import '../style/Login.css'
import {useNavigate, Link} from 'react-router-dom'


function Login() {

    const [matricula, setMatricula] = useState('')
    const [senha, setSenha] = useState('')
    const [mensagemErro, setMensagemErro] = useState('')

    const navigate = useNavigate()

    const buscaUsuario = async (evento) => {
        evento.preventDefault()

        try {

            const resposta = await
                fetch("http://127.0.0.1:8000/api/login/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        matricula: matricula,
                        senha: senha
                    })
                })

            if (resposta.ok) {

                const dados = await resposta.json();
                console.log("Login com sucesso!");

                setMensagemErro('');

                localStorage.setItem('tokenAcesso', dados.tokenAcesso)
                localStorage.setItem('uid', dados.uid)

                navigate(`/painel`)
            } else {
                setMensagemErro("Matricula ou senha incorretos!");
            }

        } catch (erro) {
            console.log("Erro ao conectar com o servidor: ", erro);
            setMensagemErro("Nao foi possivel conectar ao Banco!");
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
                                <input type="password" value={senha} placeholder="*******" onChange={(e) => setSenha(e.target.value)} required/>
                            </div>

                            {mensagemErro && <p style={{color: 'red'}}>{mensagemErro}</p>}

                            <div className="post-btn">
                                <button type="submit">Entrar</button>
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
