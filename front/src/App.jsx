import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import Login from './pages/Login.jsx';
import Painel from './pages/app/Painel.jsx';
import RotaProtegida from "./Routes/RotaProtegida.jsx";
import CadastroUsuario from "./pages/CadastroUsuario.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import Desafios from "./pages/app/Desafios.jsx";
import Layout from "./components/Layout.jsx";
import RegistroRisco from "./pages/app/RegistroRisco.jsx";
import {AuthProvider} from "./hooks/AuthContext.jsx";
import AdminstradorAcessos from "./pages/app/AdminstradorAcessos.jsx";
import InventarioRiscos from "./pages/app/InventarioRiscos.jsx";
import DetalhesRisco from "./pages/app/DetalhesRisco.jsx";
import MatrizRiscos from "./pages/app/MatrizRiscos.jsx"
import Exportar from "./pages/app/Exportar.jsx";
import AdminRoute from "./Routes/AdminRoute.jsx";

function App() {

    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [carregandoSessao, setCarregandoSessao] = useState(true);

    useEffect(() => {
        const restaurarSessao = async () => {
            const uidSalvo = sessionStorage.getItem('uid');

            if (uidSalvo) {
                try {
                    const response = await fetch(`http://localhost:8000/api/usuario/perfil/${uidSalvo}/`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {'Content-Type': 'application/json'}
                    });

                    if (response.ok) {
                        const dadosUsuario = await response.json();
                        setUsuarioLogado(dadosUsuario);
                    } else {
                        sessionStorage.removeItem('uid');
                    }
                } catch (error) {
                    console.error('Erro ao verificar sessão:', error);
                }
            }

            setCarregandoSessao(false);
        };

        restaurarSessao();
    }, []);


    if (carregandoSessao) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <h2>Verificando sessão...</h2>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={usuarioLogado ? <Navigate to="/painel" replace/> : <Login/>}
                    />

                    <Route path="/cadastro" element={<CadastroUsuario/>}/>
                    <Route path="/recuperar-senha" element={<RecuperarSenha/>}/>
                    <Route path="/redefinir-senha/:uid/:token" element={<RedefinirSenha/>}/>

                    <Route element={<RotaProtegida/>}>
                        <Route element={<Layout/>}>
                            <Route path="/painel" element={<Painel/>}/>
                            <Route path="/desafios" element={<Desafios/>}/>
                            <Route path="/todos-riscos" element={<InventarioRiscos/>}/>
                            <Route path="/registrar-risco" element={<RegistroRisco/>}/>
                            <Route path="/editar-risco/:id" element={<RegistroRisco/>}/>
                            <Route path="/detalhes-risco/:id" element={<DetalhesRisco/>}/>
                            <Route path="/matriz-riscos" element={<MatrizRiscos/>}/>
                            <Route path="/exportar" element={<Exportar/>}/>

                            <Route element={<AdminRoute/>}>
                                <Route path="/administrador" element={<AdminstradorAcessos/>}/>
                            </Route>
                        </Route>
                    </Route>


                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;