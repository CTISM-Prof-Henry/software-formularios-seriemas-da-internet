import { useState, useEffect } from "react";


export function TodosRiscos() {
    const [riscos, setRiscos] = useState([])

    useEffect(() => {

        const buscaRiscos = async () => {

            try {
                const response = await fetch('http://localhost:8000/api/riscos/')
                const dados = await response.json()

                setRiscos(dados)
            } catch (erro) {
                console.log("Erro ao buscar riscos", erro)
            }
        }

        buscaRiscos()
    }, []);

    return { riscos }
}