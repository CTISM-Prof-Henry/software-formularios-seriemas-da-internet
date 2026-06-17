import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const fetchConfig = {
        method: 'GET',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    };

    useEffect(() => {
        const uid = localStorage.getItem('uid');

        if (!uid) {
            setCarregando(false);
            return;
        }

        const restaurarSessao = async () => {
            try {


                const resposta = await fetch(`http://localhost:8000/api/usuario/perfil/${uid}`,
                    fetchConfig);
                if (resposta.ok) {
                    const dados = await resposta.json();
                    setUsuario(dados);
                }
            } catch (erro) {
                console.error("Erro ao restaurar usuario:", erro);
            } finally {
                setCarregando(false);
            }
        };

        restaurarSessao();
    }, []);


    const fazerLogin = async (matricula, senha) => {
        try {
            const resposta = await fetch("http://localhost:8000/api/login/", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matricula, senha })
            });

            if (!resposta.ok) {
                const erroData = await resposta.json();
                throw new Error(erroData.erro || "Matrícula ou senha incorretos!");
            }

            const dados = await resposta.json();

            localStorage.setItem('uid', dados.uid);
            console.log('uid', dados.uid);


            const resUsuario = await fetch(`http://localhost:8000/api/usuario/perfil/${dados.uid}`,
                fetchConfig);
            const dadosUsuarioCompleto = await resUsuario.json();

            setUsuario(dadosUsuarioCompleto);

        } catch (error) {
            throw error;
        }
    };


    const fazerLogout = async (event) => {
        if (event) event.preventDefault();
        const csrfToken = getCookie('csrftoken')

        try {

            const response = await fetch("http://localhost:8000/api/logout/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                credentials: 'include'
            })

            if (response.ok) {
                localStorage.clear()
                sessionStorage.clear();
                setUsuario(null)
                navigate("/")
            } else {
                console.log("Erro ao fazer logout no servidor")
            }

        } catch (erro) {
            console.log("Erro conexão", erro)
        }
    }

    return (

        <AuthContext.Provider value={{ usuario, setUsuario, fazerLogin, fazerLogout, carregando }}>
            {children}
        </AuthContext.Provider>
    );
}

export function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {

        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const useAuth = () => useContext(AuthContext);