import { useState } from 'react'
import { useEffect } from 'react'
import './style/App.css'

function App() {
  const [mensagemDoDjango,
    setMensagemDoDjango] = useState('Carregando os Dados');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/polls/api/teste/')
        .then(response => response.json())
        .then(data => {
          setMensagemDoDjango(data.mensagem);
        })

      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        setMensagemDoDjango("Falha na conexao com o Django.");
      });
  }, []);

  return (
    <div className={"container"}>
      <h1>Tela inicial </h1>

      <div className={"container_text"}>
        <h2>Resposta do Backend:</h2>
        <p>
          {mensagemDoDjango}
        </p>
      </div>
    </div>
  );
}

export default App
