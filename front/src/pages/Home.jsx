import {useEffect, useState} from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../style/Home.css'

function Home() {

    const uid = localStorage.getItem('uid')
    const [usuario, setUsuario] = useState('')

    useEffect(() => {

        const buscaUsuario = async () => {

            try {
                const resposta = await fetch(`http://127.0.0.1:8000/api/usuario/${uid}`)
                const dados = await resposta.json()

                setUsuario(dados)
            } catch (erro) {
                console.error("Erro ao busca usuario:", erro)
            }
        }

        buscaUsuario()
    }, [])


    return (

        <main>

            <header>
                <div className="logo">
                    <h1>Gestor de Risco</h1>
                    <p>| Planejamento 2026</p>
                </div>

                <div className="user">
                    <p>{usuario.first_name + " " + usuario.last_name}</p>
                </div>
            </header>


            <aside>


                <div className="menu">
                    <p>NAVEGAÇÃO</p>

                    <NavLink
                        to="/painel"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Painel
                    </NavLink>

                    <NavLink
                        to="/desafios"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Desafios estratégicos
                    </NavLink>

                    <NavLink
                        to="/riscos"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Todos os riscos
                    </NavLink>

                    <NavLink
                        to="/registrar-risco"
                        className={({ isActive }) => isActive ? 'menu-ativo' : 'menu-hover'}
                    >
                        Registrar riscos
                    </NavLink>
                </div>



            </aside>


        </main>


    );
}


export default Home