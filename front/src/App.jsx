import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Painel from './pages/app/Painel.jsx'
import RotaProtegida from "./pages/RotaProtegida.jsx";
import CadastroUsuario from "./pages/CadastroUsuario.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import Desafios from "./pages/app/Desafios.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenha />} />

          <Route element={<RotaProtegida />}>
              <Route path="/painel" element={<Painel />} />
              <Route path="/desafios" element={<Desafios />} />
          </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
