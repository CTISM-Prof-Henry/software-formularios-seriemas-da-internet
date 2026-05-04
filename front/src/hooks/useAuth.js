import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export function useAuth () {
    const navigate = useNavigate();
    const uid = localStorage.getItem('uid');
    const [usuario, setUsuario] = useState('');

    useEffect(() => {

        if (!uid) {
            return
        }

        const buscaUsuario = async () => {

            try {
                const resposta = await fetch(`http://127.0.0.1:8000/api/usuario/${uid}`)
                const dados = await resposta.json()

                setUsuario(dados)
            } catch (erro) {
                console.error("Erro ao busca usuario:", erro)
            }
        }

        buscaUsuario()
    }, [uid]);

    const fazerLogout = (event) => {
        event.preventDefault()

        localStorage.removeItem('uid')

        navigate('/')
    }

    return { usuario, fazerLogout }
}