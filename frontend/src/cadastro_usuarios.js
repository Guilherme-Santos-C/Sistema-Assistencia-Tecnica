import mostrarAlerta from "./mostrarAlerta.js"
import tela_carregamento from "./tela_carregamento.js"
import mascara_cpf from "./mascara_cpf.js"
import tokens from "./tokens.js"

if(tokens.logado()){
    window.location.href = "http://localhost:3030/html/painelCentral.html";
}

const input_email = document.querySelector("#email")
const input_senha = document.querySelector("#senha")
const input_confirma_senha = document.querySelector("#confirma_senha")
const input_nome = document.querySelector("#nome")
const input_cpf = document.querySelector("#cpf")
const input_senha_admin = document.querySelector("#senha_admin")
const button_cadastrar = document.querySelector("#button_cadastrar")
const img_senha = document.querySelector("#senha_visivel_img")
mascara_cpf(input_cpf)

const cadastrar_usuario = async () => {
    const inputs = document.querySelectorAll("input")
    if([...inputs].every(input => input.value.trim() === ""))return mostrarAlerta("Preencha os campos!")
    if(!input_email.value) return mostrarAlerta("Preencha o email!")
    if(!input_senha.value) return mostrarAlerta("Preencha o senha!")
    if(!input_confirma_senha.value) return mostrarAlerta("Confirme sua senha!")
    if(!input_nome.value) return mostrarAlerta("Preencha o nome!")
    if(!input_cpf.value) return mostrarAlerta("Preencha o cpf!")
    if(!input_senha_admin.value) return mostrarAlerta("Preencha a senha do admin!")    
    if(input_senha.value != input_confirma_senha.value){
        return mostrarAlerta("As senhas não coencidem")
    }
        tela_carregamento.exibir()
    let resposta = await fetch("http://localhost:3030/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: input_nome.value.trim(),
            email: input_email.value.trim(),
            password: input_senha.value.trim(),
            cpf: input_cpf.value.trim(),
            password_admin: input_senha_admin.value.trim()
        })
    });
    if(resposta.ok){
        resposta = await resposta.json()
        tela_carregamento.fechar()
        inputs.forEach((e) => {
            e.value = ""
        })
        mostrarAlerta(resposta.mensagem)
    }else{
        resposta = await resposta.json()
            tela_carregamento.fechar()
        mostrarAlerta(resposta.mensagem)
    }
}

button_cadastrar.addEventListener("click", cadastrar_usuario)

img_senha.addEventListener("click", () => {
    if(input_senha.type == "password"){
        input_senha.type = "text"
        img_senha.src = "../images/senhaInvisivel.svg"
    } else {
        input_senha.type = "password"   
        img_senha.src = "../images/senhaVisivel.svg"
    }
})


