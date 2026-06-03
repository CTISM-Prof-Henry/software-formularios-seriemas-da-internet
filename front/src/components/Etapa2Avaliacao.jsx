import {useState} from 'react';
import '../style/Etapa2.css'

export function Etapa2Avaliacao({onAvancar, onVoltar, salvarDados}) {
    const [probabilidade, setProbabilidade] = useState(3);
    const [impacto, setImpacto] = useState(2);


    const opcoesProb = [
        {valor: 1, label: 'Raro', tema: 'verde'},
        {valor: 2, label: 'Improvável', tema: 'verde'},
        {valor: 3, label: 'Possível', tema: 'laranja'},
        {valor: 4, label: 'Provável', tema: 'laranja'},
        {valor: 5, label: 'Quase certo', tema: 'vermelho'}
    ];

    const opcoesImp = [
        {valor: 1, label: 'Mínimo', tema: 'verde'},
        {valor: 2, label: 'Pequeno', tema: 'verde'},
        {valor: 3, label: 'Moderado', tema: 'laranja'},
        {valor: 4, label: 'Grande', tema: 'laranja'},
        {valor: 5, label: 'Crítico', tema: 'vermelho'}
    ];


    const calcularClassificacao = (pontuacao) => {
        if (!pontuacao) return null;
        if (pontuacao <= 5) return {nivel: 'Baixo', tema: 'verde'};
        if (pontuacao <= 12) return {nivel: 'Médio', tema: 'laranja'};
        return {nivel: 'Alto', tema: 'vermelho'};
    };

    const pontuacao = (probabilidade && impacto) ? (probabilidade * impacto) : null;
    const classificacao = calcularClassificacao(pontuacao);

    function validarEAvancar() {
        salvarDados({probabilidade, impacto, pontuacao, nivel: classificacao.nivel});
        onAvancar();
    }

    return (
        <section className="form-panel avaliacao-panel" >
            <div className="header-etapa">
                <h2>Avaliação do risco</h2>
                <p>Atribua valores de 1 a 5 para probabilidade e impacto. O nível de risco será calculado
                    automaticamente.</p>
            </div>

            <div className="matriz-grid">

                <div className="matriz-coluna">
                    <label>Probabilidade de ocorrência (1 - 5)*</label>
                    <div className="botoes-escala">
                        {opcoesProb.map((op) => (
                            <button
                                key={`prob-${op.valor}`}
                                type="button"
                                className={`btn-escala tema-${op.tema} ${probabilidade === op.valor ? 'ativo-prob' : ''}`}
                                onClick={() => setProbabilidade(op.valor)}
                            >
                                <span className="btn-valor">{op.valor}</span>
                                <span className="btn-label">{op.label}</span>
                            </button>
                        ))}
                    </div>
                </div>


                <div className="matriz-coluna">
                    <label>Impacto (1 - 5)*</label>
                    <div className="botoes-escala">
                        {opcoesImp.map((op) => (
                            <button
                                key={`imp-${op.valor}`}
                                type="button"
                                className={`btn-escala tema-${op.tema} ${impacto === op.valor ? 'ativo-imp' : ''}`}
                                onClick={() => setImpacto(op.valor)}
                            >
                                <span className="btn-valor">{op.valor}</span>
                                <span className="btn-label">{op.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            <div className="resultado-sessao">
                <div className="resultado-titulo">Probabilidade x Impacto</div>

                <div className="resultado-dados">
                    <div className={`resultado-numero tema-texto-${classificacao ? classificacao.tema : 'cinza'}`}>
                        {pontuacao || '-'}
                    </div>

                    <div className="resultado-detalhe">
                        <span className="detalhe-label">Classificação</span>
                        <div className={`badge-classificacao tema-${classificacao ? classificacao.tema : 'cinza'}`}>
                            {classificacao ? classificacao.nivel : '-'}
                        </div>
                    </div>

                    <div className="resultado-detalhe">
                        <span className="detalhe-label">Fórmula</span>
                        <span className="detalhe-valor">
                            {probabilidade && impacto ? `P:${probabilidade} x I:${impacto} = ${pontuacao}` : '-'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="form-actions actions-footer">
                <button type="button" className="btn-voltar" onClick={onVoltar}>
                    &larr; Voltar
                </button>
                <button
                    type="button"
                    className="btn-proximo"
                    onClick={validarEAvancar}
                    disabled={!probabilidade || !impacto}
                >
                    Próximo: Tratamento &rarr;
                </button>
            </div>
        </section>
    );
}