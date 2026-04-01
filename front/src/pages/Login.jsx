import { useState } from 'react'
import { useEffect } from 'react'
import '../style/Login.css'
import { useNavigate, Link } from 'react-router-dom'


function Login() {
    const [matricula, setMatricula] = useState('')
    const [senha, setSenha] =  useState('')
    const [mensagemErro, setMensagemErro] = useState('')

    const navigate  = useNavigate()

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
                navigate('/app')
            } else  {
                setMensagemErro("Matricula ou senha incorretos!");
            }

        } catch (erro) {
            console.log("Erro ao conectar com o servidor: ", erro);
            setMensagemErro("Nao foi possivel conectar ao Banco!");
        }
    }

  return (

      <main>
        <h1 className="title">Gestor de Risco</h1>

        <div className="container-login">

            <form onSubmit={buscaUsuario}>
                <h1>Login</h1>
                <label className="login-label">Entre com suas credenciais</label>

                <div>
                    <label>Matricula</label>
                    <input type="text" value={matricula} placeholder="20*******"
                           onChange={(e) => setMatricula(e.target.value)} required/>
                </div>

                <div>
                    <label>Senha</label>
                    <input type="password" value={senha} placeholder="*******"
                           onChange={(e) => setSenha(e.target.value)} required/>
                </div>

                {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}

                <div className="login-btn">
                    <button type="submit">Entrar</button>
                </div>

            </form>

            <Link to="cadastro/">Não tenho uma conta</Link>

        </div>
      </main>
  );
}

export default Login
