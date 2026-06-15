import { useState, useEffect } from "react";


export function useDesafios() {
    const [desafios, setDesafios] = useState(() => {
        const cache = localStorage.getItem('cache-desafios');

        return cache ? JSON.parse(cache) : [];
    });

    useEffect(() => {

        const buscaDesafios = async () => {

            try {

                const fetchConfig = {
                    method: 'GET',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                };

                const response = await fetch('http://localhost:8000/api/desafios/', fetchConfig)

                if (response.ok) {
                    const dados = await response.json()

                    if (JSON.stringify(dados) !== JSON.stringify(desafios)) {
                        setDesafios(dados);
                        localStorage.setItem('cache-desafios', JSON.stringify(dados));
                    }
                }
            } catch (erro) {
                console.log("Erro ao buscar desafios", erro)
            }
        }

        buscaDesafios()
    }, []);

    return { desafios }
}