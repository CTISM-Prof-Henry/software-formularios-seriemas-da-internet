import { useState } from 'react';

export function useUsuarios(formData, setFormData) {

    const [termoBuscaResponsavel, setTermoBuscaResponsavel] = useState('');
    const [sugestoesUsuarios, setSugestoesUsuarios] = useState([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

    const handleBuscaResponsavel = async (e) => {
        const valor = e.target.value;
        setTermoBuscaResponsavel(valor);

        if (valor === '') {
            setFormData({ ...formData, responsavel: '' });
        }

        if (valor.length >= 2) {
            try {
                const fetchConfig = {
                    method: 'GET',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                };

                const response = await fetch(`http://localhost:8000/api/usuarios/buscar/?q=${valor}`,
                    fetchConfig);
                if (response.ok) {
                    const dados = await response.json();
                    setSugestoesUsuarios(dados);
                    setMostrarSugestoes(true);
                }
            } catch (erro) {
                console.error("Erro ao buscar usuários:", erro);
            }
        } else {
            setSugestoesUsuarios([]);
            setMostrarSugestoes(false);
        }
    };

    const selecionarResponsavel = (usuario) => {

        setFormData({ ...formData, responsavel: usuario.id });

        setTermoBuscaResponsavel(`${usuario.first_name} ${usuario.last_name} - Matrícula: ${usuario.matricula}`);
        setMostrarSugestoes(false);
    };

    

    return {
        termoBuscaResponsavel,
        sugestoesUsuarios,
        mostrarSugestoes,
        setMostrarSugestoes,
        handleBuscaResponsavel,
        selecionarResponsavel
    };
}