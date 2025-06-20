import tokens from "./tokens.js"

if (! await tokens.logado()) {
    window.location.replace("http://localhost:3030")
}

// Modal - Logout
const logout_button = document.querySelector("#icone-logout")
const modal = document.querySelector(".fundo-modal-logout") 
logout_button.addEventListener("click", () => { 
    modal.style.display = "flex"
})
const button_fechar_modal = document.querySelector(".modal-logout-button-nao")
button_fechar_modal.addEventListener("click", () => { modal.style.display = "none"})
const button_sair_modal = document.querySelector(".modal-logout-button-sair")
button_sair_modal.addEventListener("click", () => { 
    tokens.fecharSessão()
    window.location.replace("http://localhost:3030")
})

let nome_usuario
if (localStorage.getItem("nome") != null && sessionStorage.getItem("nome") == null) {
    nome_usuario = localStorage.getItem("nome")
} else if (localStorage.getItem("nome") == null && sessionStorage.getItem("nome") != null) {
    nome_usuario = sessionStorage.getItem("nome")
}
document.querySelector("#nome_usuario").innerText = nome_usuario.split(" ")[0]

// Redirecionamento dos botões da barra lateral
const buttons_bar = document.querySelectorAll(".buttons-left-bar")
buttons_bar[0].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelUsuario.html"
})
buttons_bar[1].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelOrdemServico.html"
})
buttons_bar[2].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelRelatorio.html"
})

// Redirecionamento dos botões do meio
const buttons_meio = document.querySelectorAll(".buttons-main-div")
buttons_meio[0].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelUsuario.html"
})
buttons_meio[1].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelOrdemServico.html"
})
buttons_meio[2].addEventListener("click", () => {
    window.location.href = "http://localhost:3030/html/painelRelatorio.html"
})