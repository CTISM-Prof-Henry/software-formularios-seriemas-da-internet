import {Link, NavLink,} from 'react-router-dom'
import '../../style/Painel.css'
import '../../style/Main.css'
import '../../style/RegistroRisco.css'
import { useState, useRef } from 'react'
import {Etapa1Identificacao} from "../../components/Etapa1Identificacao.jsx";
import {Etapa2Avaliacao} from "../../components/Etapa2Avaliacao.jsx";


function RegistroRisco() {

    const [etapaAtual, setEtapaAtual] = useState(0);

    const [formIdentificacao , setFormIdentificacao] = useState( {
        descricao: "",
        causa: "",
        irregularidades: "",
        risco: "",
        desafio: ""
    })

    const [formAvaliacao , setFormAvaliacao] = useState( {
        probabilidade: "",
        impacto: "",
        nivel_risco: "",
        contexto: "",
        risco: ""
    })

    const [formTratamento, setFormTratamento] = useState( {
        resposta: "",
        acao: "",
        responsavel: "",
        prazo: "",
        prob_residual: "",
        impacto_residual: "",
        indicadores: ""
    })

    function avancar() {
        if (etapaAtual < 2) setEtapaAtual(etapaAtual + 1);
    }

    function voltar() {
        if (etapaAtual > 0) setEtapaAtual(etapaAtual - 1);
    }

    return (

        <div className="painel">
            <div className="header-titulo">
                <h1>Registrar novo risco</h1>
                <p>Preencha as etapas do formulário para registrar e avaliar o risco</p>
            </div>

            <div className="stepper-container" >
                <div className={`step ${etapaAtual === 0 ? 'active' : ''}`}>
                    <span className="step-number">Etapa 1</span>
                    <span className="step-title">Identificação e análise</span>
                </div>
                <div className={`step ${etapaAtual === 1 ? 'active' : ''}`}>
                    <span className="step-number">Etapa 2</span>
                    <span className="step-title">Avaliação</span>
                </div>
                <div className={`step ${etapaAtual === 2 ? 'active' : ''}`}>
                    <span className="step-number">Etapa 3</span>
                    <span className="step-title">Tratamento</span>
                </div>
            </div>


            <div className="slider-viewport">
                <div className="slider-track" style={{ transform: `translateX(-${etapaAtual * 33}%)` }}>

                    <Etapa1Identificacao
                        onAvancar={avancar}
                    />

                    <Etapa2Avaliacao />
                </div>
            </div>
        </div>

    );

}

export default RegistroRisco