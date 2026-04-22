import { useState } from 'react'
import { Link } from 'react-router-dom'

function RecuperarSenha() {

    const [email, setEmail] = useState('')
    const [erro, setErro] = useState('')
    const [enviado, setEnviado] = useState(false)

    const recuperar = async (evento) => {
        evento.preventDefault()

        try {
            const resposta = await fetch("http://127.0.0.1:8000/api/recuperar-senha/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            })

            if (resposta.ok) {
                setErro('')
                setEnviado(true)
            } else {
                setErro("Não existe um usuário com esse email!")
            }

        } catch (erro) {
            console.log("Não foi possível conectar com o servidor!", erro)
        }
    }

    return (
        <main>
            <div className="back">
                <section>

                    {!enviado ? (
                        <>
                            <div className="title">
                                <h1>Recuperar senha</h1>
                                <p>Informe seu e-mail para receber o link de redefinição</p>
                            </div>

                            <form onSubmit={recuperar} className="form">

                                <div className="input-group">
                                    <label>E-mail institucional</label>
                                    <input
                                        type="email"
                                        value={email}
                                        placeholder="exemplo@acad.ufsm.br"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {erro && <p style={{ color: 'red' }}>{erro}</p>}

                                <div className="post-btn">
                                    <button type="submit">Enviar link</button>
                                </div>

                            </form>
                        </>
                    ) : (
                        <>
                            <div className="title">
                                <h1>Verifique seu e-mail</h1>
                                <p>
                                    Um e-mail de recuperação foi enviado ao endereço provido.
                                </p>
                            </div>

                            <div className="links">
                                <Link to="/">Voltar ao login</Link>
                            </div>
                        </>
                    )}

                </section>
            </div>
        </main>
    )
}

export default RecuperarSenha
