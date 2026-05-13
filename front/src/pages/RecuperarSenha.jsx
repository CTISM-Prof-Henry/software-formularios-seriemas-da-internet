import { useState } from 'react'
import { Link } from 'react-router-dom'

function RecuperarSenha() {

    const[email, setEmail] = useState('')
    const[erro, setErro] = useState('')
    const[sucesso, setSucesso] = useState(false)


    const recuperar = async (evento) => {
        evento.preventDefault()

        try {

            const resposta = await
                fetch("http://127.0.0.1:8000/api/recuperar-senha/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( {
                        email: email
                    })
                })

            if (resposta.ok) {

                setErro('')
                setSucesso(true)

            } else {

                setErro("Não existe um usuario com esse email!");
                console.log("Não existe um usuario com esse email!")
            }
        } catch (erro) {

            console.log("Nao foi possivel conectar com o servidor!", erro);
        }
    }

    return (

        <main>

            <div className="back">

                <section>

                    <div className="title">
                        <h1>Recuperar senha</h1>
                        {!sucesso && <p>Informe seu e-mail para receber o link de redefinição</p>}
                    </div>

                    {sucesso ? (
                        <p>Se o email existir, você receberá um link em breve.</p>
                    ) : (
                        <form onSubmit={recuperar} className="form">

                            <div className="input-group">
                                <label>E-mail institucional</label>
                                <input type="text" value={email} placeholder="exemplo@acad.ufsm.br" onChange={
                                    (e) => setEmail(e.target.value)} required/>
                            </div>

                            {erro && <p style={{color: 'red'}}>{erro}</p>}

                            <div className="post-btn">
                                <button type="submit">Enviar link</button>
                            </div>
                        </form>
                    )}



                    <div className="links">
                        <Link to="/" className="voltar">Voltar ao login</Link>
                    </div>

                </section>

            </div>

        </main>

    );
}


export default RecuperarSenha
