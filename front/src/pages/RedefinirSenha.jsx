import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function RedefinirSenha() {
    const [senha, setSenha] = useState('')
    const { uid, token } = useParams()
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
    const [erro, setErro] = useState('')
    const navigate = useNavigate()


    const redefinir = async (evento) => {
        evento.preventDefault()

        if (senha !== confirmacaoSenha) { //se as senhas nao coincidem, exibe uma mensagem de erro
            setErro('As senhas não coincidem')
            return
        }   //chama a api para redefinir a senha, passa uid, token e nova senha
        try {
            const resposta = await fetch('/api/confirmar-reset-senha/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, token, nova_senha: senha })
            })
            const dados = await resposta.json()
            if (resposta.ok) {
                navigate('/login')
            } else {
                setErro(dados.erro)
            }
        } catch (error) {
            setErro('Erro ao redefinir senha')
        }
  
    }

    return (

        <main>

            <div className="back">

                <section>

                    <div className="title">
                        <h1>Nova senha</h1>
                        <p>Insira a nova senha</p>
                    </div>

                    <form className="form" onSubmit={redefinir}>

                            <div className="input-group">
                                <label>Nova senha</label>
                                <input type="text" value={senha} placeholder="********" onChange={
                                    (e) => setSenha(e.target.value)} required/>
                            </div>

                            <div className="input-group">
                                <label>Confirmação de senha</label>
                                <input type="text" value={confirmacaoSenha} placeholder="*********" onChange={
                                    (e) => setConfirmacaoSenha(e.target.value)} required/>
                            </div>

                            <div className="post-btn">
                                <button type="submit" >Confirmar</button>
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