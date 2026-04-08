import { useState } from 'react'
import { Link } from 'react-router-dom'

function RedefinirSenha() {
    const [senha, setSenha] = useState('')


    return (

        <main>

            <div className="back">

                <section>

                    <div className="title">
                        <h1>Nova senha</h1>
                        <p>Insira a nova senha</p>
                    </div>

                    <form className="form">

                            <div className="input-group">
                                <label>Nova senha</label>
                                <input type="text" value={senha} placeholder="********" onChange={
                                    (e) => setSenha(e.target.value)} required/>
                            </div>

                            <div className="input-group">
                                <label>Confirmação de senha</label>
                                <input type="text" value={senha} placeholder="*********" onChange={
                                    (e) => setSenha(e.target.value)} required/>
                            </div>

                            <div className="post-btn">
                                <button type="submit">Confirmar</button>
                            </div>
                        </form>

                    <div className="links">
                        <Link to="/" className="voltar">Voltar ao login</Link>
                    </div>

                </section>

            </div>

        </main>

    );
}


export default RedefinirSenha