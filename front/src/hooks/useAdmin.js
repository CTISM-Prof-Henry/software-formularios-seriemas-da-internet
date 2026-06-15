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

                const resCount = await fetch('http://localhost:8000/api/usuarios/?count-users=True');
                if (resCount.ok) {
                    const dadosCount = await resCount.json();
                    setCountUsuarios(dadosCount.count);
                }

                const valorLimite = limite || 5
                let url = `http://localhost:8000/api/usuarios/?limit=${valorLimite}`;
                if (termoBusca) {
                    url = `http://localhost:8000/api/usuarios/?q=${termoBusca}`;
                }

                const resLista = await fetch(url);
                if (!resLista.ok) throw new Error(`HTTP ${resLista.status}`);

                const dadosLista = await resLista.json();
                setUsuarios(dadosLista);

            } catch (err) {
                setErro(err.message);
                console.error("Erro inesperado:", err);
            } finally {
                setLoading(false);
            }
        };


        const delay = setTimeout(() => {
            fetchDados();
        }, 300);

        return () => clearTimeout(delay);
    }, [limite, termoBusca]);


    return { countUsuarios, usuarios, loading, erro}
}