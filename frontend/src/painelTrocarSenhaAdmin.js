import tokens from "./tokens.js"
import mostrarAlerta from "./mostrarAlerta.js"

// if (!await tokens.logado()) {
//     window.location.replace("http://localhost:3030")
// }

// Redirecionamento dos botões da barra lateral
const buttons_bar = document.querySelectorAll(".buttons-left-bar")
buttons_bar[0].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelAdmin.html"
})
buttons_bar[1].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelTrocarSenhaAdmin.html"
})

// Modal - Logout
const logout_button = document.querySelector("#icone-logout")
const modal = document.querySelector(".fundo-modal-logout")
logout_button.addEventListener("click", () => {
    modal.style.display = "flex"
})
const button_fechar_modal = document.querySelector(".modal-logout-button-nao")
button_fechar_modal.addEventListener("click", () => { modal.style.display = "none" })
const button_sair_modal = document.querySelector(".modal-logout-button-sair")
button_sair_modal.addEventListener("click", () => {
    tokens.fecharSessão()
    window.location.replace("http://localhost:3030")
})

const container_conteudos = document.querySelector(".down-side-content")
const conteudos = document.querySelectorAll(".content")
const button_alterar_senha = document.querySelector("#button-troca-senha")
const icone_load = document.querySelector("#icone_load")

// inputs
const nova_senha_input = document.querySelector("#senha_nova_admin")
const confirma_nova_senha_input = document.querySelector("#confirma_senha_nova_admin")

button_alterar_senha.addEventListener("click", async () => {
    if (nova_senha_input.value == "") return mostrarAlerta("Preencha a senha")
    if (confirma_nova_senha_input.value == "") return mostrarAlerta("Preencha a confirmação da senha")
    if (confirma_nova_senha_input.value != nova_senha_input.value) return mostrarAlerta("As senhas precisam ser iguais")
    conteudos.forEach(e => {
        e.style.display = "none"
    })
    container_conteudos.classList.add("center")
    icone_load.style.display = "block"
    let resposta_api = await fetch(`http://localhost:3030/api/admin`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            password: nova_senha_input.value.trim()
        })
    })
    if (resposta_api.ok) {
        resposta_api = await resposta_api.json()
        icone_load.style.display = "none"
        container_conteudos.classList.remove("center")
        conteudos[0].style.display = "flex"
        conteudos[1].style.display = "block"
        return mostrarAlerta(resposta_api.mensagem)
    }
})