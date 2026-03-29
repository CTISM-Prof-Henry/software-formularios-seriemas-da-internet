import { useState } from 'react'
import { useEffect } from 'react'
import './style/App.css'

function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/polls/api/listar_usuarios/')
        .then(response => response.json())
        .then(data => {
          setUsuarios(data);
        })

      .catch(error => {
        console.error("Erro ao buscar dados:", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Enquetes do Sistema 📊</h1>

      {usuarios.length === 0 ? (
        <p>Nenhuma pergunta encontrada no banco de dados.</p>
      ) : (
        <ul>
          {usuarios.map(usuario => (
            <li key={usuario.userId} style={{ marginBottom: '10px' }}>
              <strong>{usuario.nome}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App
