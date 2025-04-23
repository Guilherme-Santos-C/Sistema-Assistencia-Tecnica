import mostrarAlerta from "./mostrarAlerta.js"
import tokens from "./tokens.js"

if(!tokens.logado()){
    window.location.href = "http://localhost:5500/frontend/"
}

console.log(tokens.logado())

const logout_button = document.querySelector("#icone-logout")
logout_button.addEventListener("click", () => {
    tokens.fecharSessão()
})

document.querySelector("#nome_usuario").innerText = localStorage.getItem("nome") || sessionStorage.getItem("nome").split(" ")[0] 