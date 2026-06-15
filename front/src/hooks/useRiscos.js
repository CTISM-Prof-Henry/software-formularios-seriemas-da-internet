import {useState, useEffect} from "react";


export function useRiscos(limite = 25, termoBusca = '', categoria = '', status = '',
                          ordenacao = '-id', pagina = 1, filtroCentro = '') {

    const [riscos, setRiscos] = useState([]);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
    const [loading, setLoading] = useState(false);
    const [kpis, setKpis] = useState({
        count: 0,
        criticos: 0,
        medios: 0,
        em_tratamento: 0,
        concluidos: 0,
        total_absoluto: 0
    });

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        const buscarDados = async () => {
            try {

                const params = new URLSearchParams();
                if (termoBusca) params.append('q', termoBusca);
                if (categoria) params.append('categoria', categoria);
                if (status) params.append('status', status);
                if(filtroCentro) params.append('centro', filtroCentro)


                const urlRiscos = `http://localhost:8000/api/riscos/?page=${pagina}&limit=${limite}&ordering=${ordenacao}&${params.toString()}`;
                const urlCount = `http://localhost:8000/api/riscos/?count=True&${params.toString()}`;

                const [resRiscos, resCount] = await Promise.all([
                    fetch(urlRiscos, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {'Content-Type': 'application/json'}
                    }),
                    fetch(urlCount, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {'Content-Type': 'application/json'}
                    })
                ]);

                const dadosRiscos = await resRiscos.json();
                const dadosKpis = await resCount.json();

                if (isMounted) {
                    const listaDeRiscos = dadosRiscos.results ? dadosRiscos.results : dadosRiscos;

                    setRiscos(listaDeRiscos);
                    setKpis(dadosKpis);
                    setUltimaAtualizacao(new Date());
                    setLoading(false);
                }
            } catch (erro) {
                console.error("Erro ao buscar dados:", erro);
                if (isMounted) setLoading(false);
            }
        };

        const delay = setTimeout(buscarDados, 300);
        return () => {
            isMounted = false;
            clearTimeout(delay);
        };

    }, [limite, termoBusca, categoria, status, ordenacao, pagina, filtroCentro]);

    return {riscos, kpis, ultimaAtualizacao, loading};
}