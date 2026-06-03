import {useRef} from 'react';
import {useDesafios} from "../hooks/useDesafios.js";
import '../style/RegistroRisco.css'

export function Etapa1Identificacao({onAvancar, salvarDados}) {
    const formRef = useRef(null);
    const { desafios } = useDesafios()

    // function validarEAvancar() {
    //     if (formRef.current.checkValidity()) {
    //
    //         const dadosDestaEtapa = {
    //             desafio_id: formRef.current.desafio.value,
    //             descricao: formRef.current.descricao.value,
    //             categoria: formRef.current.categoria.value,
    //             responsavel: formRef.current.responsavel.value,
    //             causas: formRef.current.causas.value,
    //             irregularidades: formRef.current.irregularidades.value
    //         };
    //
    //         onAvancar();
    //
    //     } else {
    //         formRef.current.reportValidity();
    //     }
    // }

    return (
        <section className="form-panel">
            <h2>Identificação do risco</h2>
            <form className="formulario-risco" ref={formRef}>

                <div className="form-group full-width">
                    <label>Desafio estratégico vinculado *</label>
                    <select name="desafio" required defaultValue="">
                        <option value="" disabled>Selecione o desafio</option>

                        {desafios.map((desafio) => (
                            <option value={desafio.id}
                                    key={desafio.id}>Desafio {desafio.numero} - {desafio.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>Descrição do risco *</label>
                    <textarea
                              name="descricao"
                              rows="2"
                              placeholder="Descreva o evento de risco e seu possível efeito sobre o objetivo do planejamento..."
                              required>

                    </textarea>
                </div>

                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Categoria do risco *</label>
                        <select name="categoria"  defaultValue="">
                            <option value="" disabled>Selecione...</option>
                            <option value="Categoria 2">Categoria 2</option>
                        </select>
                    </div>
                    <div className="form-group half-width">
                        <label>Responsável pelo risco *</label>
                        <input name="responsavel" type="text" placeholder="Ana Silva" required/>
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Causas identificadas</label>
                    <textarea
                              name="causas"
                              rows="2"
                              placeholder="Descreva as causas ou fontes que originam esse risco...">

                    </textarea>
                </div>

                <div className="form-group full-width">
                    <label>Irregularidades ou pontos de atenção levantados</label>
                    <textarea
                              name="irregularidades"
                              rows="2"
                              placeholder="Registre irregularidades identificadas durante o levantamento...">

                    </textarea>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-proximo" onClick={onAvancar}>
                        Próximo: Avaliação <span>&rarr;</span>
                    </button>
                </div>
            </form>
        </section>
    );
}