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

// tabela
const tabela_conteudos = document.querySelectorAll(".tabela")
const icone_load_tabela = document.querySelector("#icone_load_tabela")

let atualiza_tabela = async () => {
    tabela_conteudos.forEach(e => {
        e.style.display = "none"
    });
    icone_load_tabela.style.display = "block"
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
        const button_excluir_cliente_modal = document.querySelectorAll(".excluir_usuarios_button")
        button_excluir_cliente_modal.forEach((e) => {
            e.onclick = async () => {
                tabela_conteudos.forEach(e => {
                    e.style.display = "none"
                });
                icone_load_tabela.style.display = "block"
                let resposta_api = await fetch(`http://localhost:3030/api/usuarios?id=${e.id}`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
                if (resposta_api.ok) {
                    let usuario_json = await resposta_api.json()
                    atualiza_tabela()
                    return mostrarAlerta(usuario_json.mensagem)
                } else {
                    let usuario_json = await resposta_api.json()
                    return mostrarAlerta(usuario_json.mensagem)
                }
            }
        })
        tabela_conteudos[0].style.display = "grid"
        tabela_conteudos[1].style.display = "block"
        tabela_conteudos[2].style.display = "flex"
        icone_load_tabela.style.display = "none"
    } else {
        resposta_api = await resposta_api.json()
        console.log(resposta_api)
    }
}

atualiza_tabela()

