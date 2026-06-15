import { useState, useEffect } from "react";


export function useCategorias() {

    const [categorias, setCategorias] = useState(() => {
        const cache = localStorage.getItem('cache_categorias');

        return cache ? JSON.parse(cache) : [];
    });

    useEffect(() => {
        if (categorias.length > 0) return;

        const buscaCategorias = async () => {

            try {
                const fetchConfig = {
                    method: 'GET',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'}
                };

                const response = await fetch('http://localhost:8000/api/categorias/', fetchConfig)

                if (response.ok) {
                    const dados = await response.json()

                    setCategorias(dados)
                    localStorage.setItem('cache_categorias', JSON.stringify(dados))
                }
            } catch (erro) {
                console.log("Erro ao buscar categorias", erro)
            }
        }

        buscaCategorias()
    }, [categorias.length]);

    return { categorias }
}