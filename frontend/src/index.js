import mostrarAlerta from "./mostrarAlerta.js"
import tela_carregamento from "./tela_carregamento.js"
import tokens from "./tokens.js"

if(tokens.logado()){
    window.location.href = "http://localhost:5500/frontend/html/painelCentral.html";
}

const input_email = document.querySelector("#input-login-email")
const input_senha = document.querySelector("#input-login-senha")
const lembrar_min_checkbox = document.querySelector("#checkbox")
const button_entrar = document.querySelector("#button_entrar")
const img_senha = document.querySelector("#senha_visivel_img")

const logar = async () => {
    const input_email_value = input_email.value
    const input_senha_value = input_senha.value
    if (!input_email_value && !input_senha_value) {
        return mostrarAlerta("Não é possivel logar sem suas informações. Preencha o email e a senha!")
    } else if (!input_email.value) {
        return mostrarAlerta("Não é possivel logar sem suas informações. Preencha o email!")
    } else if (!input_senha.value) {
        return mostrarAlerta("Não é possivel logar sem suas informações. Preencha a senha!")
    }
    tela_carregamento.exibir()
    let resposta = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: input_email_value,
            password: input_senha_value
        })
    });
    if (resposta.ok) {
        resposta = await resposta.json()
        console.log(resposta)
        tela_carregamento.fechar()
        if(lembrar_min_checkbox.checked){
            tokens.salvarLocal(resposta.token, resposta.nome)
        }else{
            console.log("session")
            tokens.salvarSession(resposta.token, resposta.nome)
        }
        window.location.href = "http://localhost:5500/frontend/html/painelCentral.html";
    } else {
        resposta = await resposta.json()
        tela_carregamento.fechar()
        console.log(resposta)
        mostrarAlerta(resposta.mensagem)
    }
}

button_entrar.addEventListener("click", logar)

img_senha.addEventListener("click", () => {
    if(input_senha.type == "password"){
        input_senha.type = "text"
        img_senha.src = "./images/senhaInvisivel.svg"
    } else {
        input_senha.type = "password"   
        img_senha.src = "./images/senhaVisivel.svg"
    }
})

const div_senha_input = document.querySelector("#div_senha_input")
input_senha.addEventListener("focus", () => {
    div_senha_input.classList.add("focus")
})
input_senha.addEventListener("blur", () => {
    div_senha_input.classList.remove("focus")
})

