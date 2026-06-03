import { useState, useEffect } from "react";


export function useDesafios() {
    const [desafios, setDesafios] = useState([])

    useEffect(() => {

        const buscaDesafios = async () => {

            try {
                const response = await fetch('http://localhost:8000/api/desafios/')
                const dados = await response.json()

                setDesafios(dados)
            } catch (erro) {
                console.log("Erro ao buscar desafios", erro)
            }
        }

        buscaDesafios()
    }, []);

    return { desafios }
}