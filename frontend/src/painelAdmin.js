import tokens from "./tokens.js"
import mostrarAlerta from "./mostrarAlerta.js"

const div_senha_input = document.querySelector(".container_input_pesquisa")
const input_cliente = document.querySelector("#pesquisa_input")
input_cliente.addEventListener("focus", () => {
    div_senha_input.classList.add("focus")
})
input_cliente.addEventListener("blur", () => {
    div_senha_input.classList.remove("focus")
})

if (!await tokens.logado()) {
    window.location.replace("http://localhost:3030")
}

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

// Variavel para ser acessada na requisição de editar o cliente quando abre o modal o valor dela é o id do cliente quando fecha volta a undefined
let id_cliente_editar;

let atualiza_tabela = async () => {
    let resposta_api = await fetch("http://localhost:3030/api/usuarios", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    })
    if (resposta_api.ok) {
        resposta_api = await resposta_api.json()
        const usuarios = resposta_api.resposta_db
        const tabela = document.querySelector(".container-corpo-tabela")
        tabela.innerHTML = ""
        usuarios.forEach((usuarios, i) => {
            const div_linha = document.createElement("div")
            div_linha.classList.add("linha-tabela")
            div_linha.innerHTML = `
                <div class="campo_corpo_id">
                    <div>
                        <p>${i + 1}</p>
                    </div>
                </div>
                <div class="campo_corpo_nome">
                    <p>${usuarios.nome}</p>
                </div>
                <div class="campo_corpo_cpf">
                    <p>${usuarios.cpf}</p>
                </div>
                <div class="campo_corpo_modificar">
                    <button class="excluir_usuarios_button" id="${usuarios._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
                </div>
            `
            tabela.append(div_linha)
        });
        const button_excluir_cliente_modal = document.querySelectorAll(".excluir_cliente_button")
        button_excluir_cliente_modal.forEach((e) => {
            e.onclick = async () => {
                let resposta_api = await fetch(`http://localhost:3030/api/usuarios?id=${e._id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
                if (resposta_api.ok) {
                    let usuario_json = await resposta_api.json()
                    return mostrarAlerta(usuario_json.mensagem)
                } else {
                    let usuario_json = await resposta_api.json()
                    return mostrarAlerta(usuario_json.mensagem)
                }
            }
        })
    }
}

atualiza_tabela()

