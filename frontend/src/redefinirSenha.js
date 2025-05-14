import mostrarAlerta from "./mostrarAlerta.js"
import tela_carregamento from "./tela_carregamento.js"
import mascara_cpf from "./mascara_cpf.js"
import tokens from "./tokens.js"

if(tokens.logado()){
    window.location.href = "http://localhost:3030/html/painelCentral.html";
}

const img_senha = document.querySelector("#senha_visivel_img")
const input_senha = document.querySelector("#input-senha")
const input_senha_confirma = document.querySelector("#input-confirma-senha")
const input_cpf = document.querySelector("#input-cpf")
const input_senha_admin = document.querySelector("#input-senha-admin")
const button_redefinir = document.querySelector("#redefinir")
const inputs = document.querySelectorAll("input")
mascara_cpf(input_cpf)

img_senha.addEventListener("click", () => {
    if(input_senha.type == "password"){
        input_senha.type = "text"
        img_senha.src = "../images/senhaInvisivel.svg"
    } else {
        input_senha.type = "password"   
        img_senha.src = "../images/senhaVisivel.svg"
    }
})

const div_senha_input = document.querySelector("#div_senha_input");

input_senha.addEventListener("focus", () => {
    div_senha_input.classList.add("focus")
})
input_senha.addEventListener("blur", () => {
    div_senha_input.classList.remove("focus")
})

const redefinir_senha = async () => {
    const input_cpf_value = input_cpf.value
    const input_senha_value = input_senha.value
    const input_senha_admin_value = input_senha_admin.value
    if (!input_cpf_value && !input_senha_value && !input_senha_admin_value) {
        return mostrarAlerta("Preencha as informações!")
    } else if (!input_cpf_value) {
        return mostrarAlerta("Preencha o cpf!")
    } else if (!input_senha_value) {
        return mostrarAlerta("Preencha a senha!")
    } else if (!input_senha_admin_value) {
        return mostrarAlerta("Preencha a senha do admin!")
        }
    if(input_senha_value != input_senha_confirma.value){
        return mostrarAlerta("As senhas não coencidem")
    }
    tela_carregamento.exibir()
    let resposta = await fetch(`http://localhost:3030/api/usuarios/procurar?cpf=${input_cpf_value}&admin=${input_senha_admin_value}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (resposta.ok) {
        const User = await resposta.json()
        let resposta_api = await fetch(`http://localhost:3030/api/usuarios?id=${User._id}&admin=${input_senha_admin_value}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password: input_senha_value, password_admin: input_senha_admin_value})
        })
        resposta_api = await resposta_api.json()
        tela_carregamento.fechar()
        inputs.forEach(e => e.value = "")
        mostrarAlerta(resposta_api.mensagem)
    } else {
        resposta = await resposta.json()
        tela_carregamento.fechar()
        mostrarAlerta(resposta.mensagem)
    }
}

button_redefinir.addEventListener("click", redefinir_senha)