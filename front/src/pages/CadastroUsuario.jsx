import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'


function CadastroUsuario() {

    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        matricula: "",
        setor: "",
        perfil_acesso: ""
      });

    const [ sugestoesUnidades, setSugestoesUnidades ] = useState([])
    const [ mostrarDropDown, setMostrarDropDown ] = useState(false)
    const [ unidade, setUnidade ] = useState()

    async function handleSearchUnidade(e) {
        const valorDigitado = e.target.value;

        setForm({ ...form, setor: valorDigitado });

        if (valorDigitado.length >= 2) {
            try {

                const response = await fetch(`http://localhost:8000/api/unidades/?search=${valorDigitado}`);
                if (response.ok) {
                    const data = await response.json();
                    setSugestoesUnidades(data);
                    setMostrarDropDown(true);
                    console.log(data);
                }
            } catch (error) {
                console.error("Erro ao buscar unidades:", error);
            }
        } else {

            setSugestoesUnidades([]);
            setMostrarDropDown(false);
        }
    }

      function handleChange(e) {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
      }

      function selecionarUnidade(unidade) {
            setForm({ ...form, setor: unidade.nome_unidade });
            setUnidade(unidade.id)
            setMostrarDropDown(false);
            setSugestoesUnidades([]);
      }

      async function handleSubmit(evento) {
              evento.preventDefault();

              const dadosParaEnviar = {
                ...form,
                  setor: unidade,
                  username: form.matricula
              };

              try {
                  const response = await fetch("http://localhost:8000/api/usuario/", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                    body: JSON.stringify(dadosParaEnviar)
                  });

                  console.log("Dados enviados:", dadosParaEnviar)

                  if (response.ok) {

                      const data = await response.json();
                      console.log(data);

                      console.log("Usuário cadastrado!");
                      navigate('/')
                  } else {

                      const errorData = await response.json().catch(() => null) || await response.text();
                      console.error("Erro retornado pelo backend:", errorData);
                  }

              } catch (erro) {
                  console.log("Erro ao conectar com o servidor: ", erro);
              }

          }


      return (

          <main>

            <div className="back">

                <section className="section-cadastro">

                    <div className="title">
                        <h1>Criar conta</h1>
                        <p>Preencha os dados para solicitar acesso</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                            <div className="input-group double-input">

                                <div>
                                    <label>Nome</label>
                                    <input type="text" name="first_name" placeholder="" onChange={handleChange} value={form.first_name} required/>
                                </div>

                                <div>
                                    <label>Sobrenome</label>
                                    <input type="text" name="last_name" placeholder="" onChange={handleChange} value={form.last_name} required/>
                                </div>

                            </div>

                            <div className="input-group">
                                <label>E-mail institucional</label>
                                <input type="email" name="email" placeholder="email@ufsm.acad.br" onChange={handleChange} value={form.email} required/>
                            </div>

                            <div className="input-group">
                                <label>Senha</label>
                                <input type="password" name="password" placeholder="*******" onChange={handleChange} value={form.password} required/>
                            </div>

                            <div className="input-group">
                                <label>Matricula</label>
                                <input type="text" name="matricula" placeholder="*******" onChange={handleChange} value={form.matricula} required/>
                            </div>

                            <div className="input-group">
                                <label>Setor / Unidade</label>
                                <input
                                    type="text"
                                    name={"unidade"}
                                    list="lista-unidades"
                                    placeholder="Digite o nome ou a sigla (ex: CT, Politécnico)"
                                    onChange={handleSearchUnidade}
                                    value={form.setor}
                                    required
                                    autoComplete="off"
                                    onBlur={() => setTimeout(() => setMostrarDropDown(false), 200)}
                                    onFocus={() => sugestoesUnidades.length > 0 && setMostrarDropDown(true)}
                                />

                                {mostrarDropDown && sugestoesUnidades.length > 0 && (
                                    <ul className="select-customizado">
                                        {sugestoesUnidades.map((unidade) => (
                                            <li
                                                key={unidade.id}
                                                onClick={() => selecionarUnidade(unidade)}
                                            >
                                                {unidade.nome_unidade} ({unidade.sigla_centro})
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                            <div className="input-group">
                                <label>Perfil de acesso</label>
                                <select name="perfil_acesso" className="select" onChange={handleChange} value={form.perfil_acesso} required>

                                    <option value="" disabled>Selecione um perfil</option>
                                    <option value="Gestor de Risco">Gestor de Risco</option>
                                    <option value="Colaborador">Colaborador</option>
                                    <option value="Auditor">Auditor</option>

                                </select>
                            </div>

                            <div className="post-btn">
                                <button type="submit">Solicitar acesso</button>
                            </div>
                        </form>

                    <div className="links">
                        <Link to="/" className="criar-conta">Voltar</Link>
                    </div>

                </section>
            </div>

        </main>

      );
}

export default CadastroUsuario