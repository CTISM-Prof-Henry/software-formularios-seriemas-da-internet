import {useState, useEffect} from 'react'

export function useAdmin(limite = 5, termoBusca) {

    const [countUsuarios, setCountUsuarios] = useState(0)
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState(null)

    
    useEffect(() => {
        const fetchDados = async () => {
            try {
                setLoading(true);
                setErro(null);

                const fetchConfig = {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                };


                const params = new URLSearchParams({
                    limite: limite || 5
                });

                if (termoBusca) {
                    params.append('q', termoBusca);
                }


                const res = await fetch(`http://localhost:8000/api/usuarios/?${params.toString()}`,
                    fetchConfig);

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const dados = await res.json();


                if (dados.results !== undefined) {
                    setUsuarios(dados.results);
                    setCountUsuarios(dados.count);
                } else {

                    setUsuarios(dados);
                    setCountUsuarios(dados.length);
                }

            } catch (err) {
                setErro(err.message);
                console.error("Erro inesperado no useAdmin:", err);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(() => {
            fetchDados();
        }, 300);

        return () => clearTimeout(delay);
    }, [limite, termoBusca]);

    return { countUsuarios, usuarios, loading, erro };

}