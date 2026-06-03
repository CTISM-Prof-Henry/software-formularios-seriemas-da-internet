import { Link, NavLink } from 'react-router-dom'
import {useAuth} from "../../hooks/useAuth.js";
import '../../style/Desafios.css'
import {useDesafios} from "../../hooks/useDesafios.js";


function Desafios() {
    
    const { desafios, carregando } = useDesafios();

    if (carregando) {
        return <div className="loading">Carregando desafios estratégicos...</div>;
    }

    return (

        <div className="painel">

            <div className="title">
                <h2>Desafios Estratégicos 2026</h2>
                <p>Selecione um desafios para ver os riscos associados</p>
            </div>

            <div className="desafios">

                {desafios.map((desafio, index) => (

                    <div className="desafio-row" key={index}>

                        <div className="grupo">
                            <span className="numero">{desafio.numero}</span>
                            <div className="title">
                                <h3>{desafio.nome}</h3>
                                <label>3 riscos identificados - Progresso 40%</label>
                            </div>
                        </div>

                        <Link to={`todos-riscos?search=${desafio.id}`}>Ver riscos</Link>
                    </div>

                ))}

            </div>
        </div>



    );
}


export default Desafios