import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function toastEvent() {

  // Esses valores estão nulos, preciso implementar essa funcionalidade após a criação dos valores.
  const tagSenha = document.querySelector("#senha");

  const tagLogin = document.querySelector("#login");

  const tagsElements = [tagLogin, tagSenha]
  
  tagsElements.forEach((element) => {
    console.log(element.value)
    element.value === "" || element.value.length === 0 ?
    toast.error(`Verifique o ${element.value}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })

    :

    toast.success("Funcionou!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })

  })
}

export function Login() {
  // Toast de evento
  // const toastEvent = () => {
  //   toast.success('Cadastrado com sucesso!', {
  //     position: 'bottom-right',
  //     autoClose: 3000,
  //     hideProgressBar: true,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //   })
  // }

  return (
    <main className="telaLogin">
      <form className="form">
        <h1 className="titleLogin">Moview</h1>

        <button type="button" id="btnRegister">
          Criar conta
        </button>

        <div className="camposLoginSenha">
          <input type="text" name="login" id="login" autoComplete="off" />
          <label htmlFor="login" id="placeholderLogin">Login</label>
          <input type="password" name="senha" id="senha" autoComplete="new-password" />
          <label htmlFor="senha" id="placeholderSenha">Senha</label>
        </div>

        <div className="entrarOuMudarSenha">
          <button type="button" className="btnEntrar" title="Entrar" onClick={() => toastEvent()}>Entrar</button>
          <button type="button" className="btnEsqueciSenha" title="Esqueceu a senha?">Esqueceu a senha?</button>
          <ToastContainer />
        </div>
      </form>
    </main>
  )
}