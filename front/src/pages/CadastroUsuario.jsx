import { useState } from 'react'
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

      function handleChange(e) {
        setForm({
          ...form,
          [e.target.name]: e.target.value
        });
      }


      async function handleSubmit(evento) {
              evento.preventDefault();

              const dadosParaEnviar = {
                ...form,
                username: form.matricula
              };

              try {
                  const response = await fetch("http://localhost:8000/api/cadastro/", {
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

                      const isJson = response.headers.get("content-type")?.includes("application/json");
                      const errorData = isJson ? await response.json() : await response.text();

                      console.error("Erro ao cadastrar", errorData);
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
                                <input type="text" name="setor" placeholder="Politecnico" onChange={handleChange} value={form.setor} required/>
                            </div>

                            <div className="input-group">
                                <label>Perfil de acesso</label>
                                <select type="text" name="perfil_acesso" placeholder="*******" className="select" onChange={handleChange} value={form.perfil} required>

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