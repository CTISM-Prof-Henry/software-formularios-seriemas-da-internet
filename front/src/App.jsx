import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from  './pages/Home.jsx'
import RotaProtegida from "./pages/RotaProtegida.jsx";
import CadastroUsuario from "./pages/CadastroUsuario.jsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/app" element={
            <RotaProtegida>
                <Home />
            </RotaProtegida>
        } />

          <Route path="/cadastro" element={<CadastroUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
