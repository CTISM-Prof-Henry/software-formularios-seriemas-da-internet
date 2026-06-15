

export function usePainel() {


     const getIniciais = (nomeBruto) => {
        if (!nomeBruto) return 'NI';
        const nome = String(nomeBruto).trim();
        if (!isNaN(nome)) return 'ID';
        const partes = nome.split(' ');
        if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    };


     const getAvatarColor = (nomeBruto) => {
        if (!nomeBruto) return 'gray';
        const nome = String(nomeBruto);
        const cores = ['blue', 'purple', 'cyan'];
        const index = nome.charCodeAt(0) % cores.length;
        return cores[index];
    };


     const getStatusClass = (status) => {
        if (!status) return '';

        const st = String(status).toLowerCase();

        if (st.includes('identi')) return 'identificado';
        if (st.includes('tratamen')) return 'tratamento';
        if (st.includes('avalia')) return 'avaliado';
        return '';
    };


     const getImpactoLabel = (valor) => {
        if (!valor) return 'NÃO AVALIADO';
        const mapa = {1: 'MÍNIMO', 2: 'BAIXO', 3: 'MÉDIO', 4: 'ALTO', 5: 'CRÍTICO'};
        return mapa[valor] || 'NÃO AVALIADO';
    };

     const getImpactoClass = (valor) => {
        if (!valor) return '';
        if (valor === 5) return 'muito-alto';
        if (valor === 4) return 'alto';
        if (valor === 3) return 'medio';
        if (valor === 2) return 'baixo';
        if (valor < 2) return 'minimo'
        return '';
    };


     const getProbabilidadeLabel = (valor) => {
        if (!valor) return '-';
        const mapa = {1: 'Mínimo', 2: 'Baixo', 3: 'Possível', 4: 'Provável', 5: 'Quase Certo'};
        return mapa[valor] || '-';
    };


     const getNomeResponsavel = (responsavel) => {
        if (!responsavel) return 'Sem responsável';
        if (typeof responsavel === 'object') return responsavel.first_name || responsavel.nome || 'Usuário';
        return responsavel;
    };

    return {
        getProbabilidadeLabel,
        getAvatarColor,
        getImpactoClass,
        getStatusClass,
        getNomeResponsavel,
        getImpactoLabel,
        getIniciais
    }
}
