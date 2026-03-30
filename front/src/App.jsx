import { useState } from 'react'
import { useEffect } from 'react'
import './style/App.css'

function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/usuarios')
        .then(response => response.json())
        .then(data => {
          setUsuarios(data);
        })

      .catch(error => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  return (

      <body>
        <h1 className="title">Gestor de Risco</h1>

        <div className="container-login">

            <form action="post" >
                <h1>Login</h1>
                <label className="login-label">Entre com suas credenciais</label>

                <div>
                    <label>Matricula</label>
                    <input type="email" id="email" placeholder="seu@email.com" required/>
                </div>

                <div>
                    <label>Senha</label>
                    <input type="password" id="senha" placeholder="*******" required/>
                </div>

                <div className="login-btn">
                    <button type="submit">Entrar</button>
                </div>

                <a href="">Não tenho uma conta</a>

            </form>

        </div>
      </body>
  );
}

export default App
