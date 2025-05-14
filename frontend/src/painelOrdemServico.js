import tokens from "./tokens.js"
import mostrarAlerta from "./mostrarAlerta.js"
import mascara_cpf from "./mascara_cpf.js"
import mascara_telefone from "./mascara_tel.js"

// const div_senha_input = document.querySelector(".container_input_pesquisa")
// const input_cliente = document.querySelector("#pesquisa_input")
// input_cliente.addEventListener("focus", () => {
//     div_senha_input.classList.add("focus")
// })
// input_cliente.addEventListener("blur", () => {
//     div_senha_input.classList.remove("focus")
// })

if (!tokens.logado()) {
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
    window.location.href = "http://localhost:3030/html/painelUsuario.html"
})

let nome_usuario
if (localStorage.getItem("nome") != null && sessionStorage.getItem("nome") == null) {
    nome_usuario = localStorage.getItem("nome").split(" ")[0]
} else if (localStorage.getItem("nome") == null && sessionStorage.getItem("nome") != null) {
    nome_usuario = sessionStorage.getItem("nome").split(" ")[0]
}
document.querySelector("#nome_usuario").innerText = nome_usuario


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

// // Modal - Criar Cliente
// const criar_cliente_modal_button = document.querySelector("#button-adicionar-cliente-modal")
// const modal_criar_cliente = document.querySelector(".fundo-modal-criar-cliente")
// criar_cliente_modal_button.addEventListener("click", () => {
//     modal_criar_cliente.style.display = "flex"
// })
// const fechar_criar_clientes_button = document.querySelector("#fechar_cadastrar_clientes_button")
// fechar_criar_clientes_button.addEventListener("click", () => { modal_criar_cliente.style.display = "none" })

// Inputs do modal
const input_editar_cliente_nome = document.querySelector("#input-editar-cliente-nome")
const input_editar_cliente_cpf = document.querySelector("#input-editar-cliente-cpf")
const input_editar_cliente_endereco = document.querySelector("#input-editar-cliente-endereco")
const input_editar_cliente_telefone = document.querySelector("#input-editar-cliente-telefone")
// mascara_cpf(input_editar_cliente_cpf)
// mascara_telefone(input_editar_cliente_telefone)

// Variavel para ser acessada na requisição de editar o cliente quando abre o modal o valor dela é o id do cliente quando fecha volta a undefined
let id_cliente_editar;

let atualiza_tabela = async () => {
    let resposta_api = await fetch("http://localhost:3030/api/ordens", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    })
    if (resposta_api.ok) {
        resposta_api = await resposta_api.json()
        const OSs = resposta_api
        const tabela = document.querySelector(".container-corpo-tabela")
        tabela.innerHTML = ""
        OSs.forEach(async (os, i) => {
            let cliente = await fetch(`http://localhost:3030/api/clientes/procurar?id=${os.cliente}`, {
            method: "GET",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
            }
            })
            cliente = await cliente.json()
            let equipamento = await fetch(`http://localhost:3030/api/equipamentos/procurar?id=${os.equipamento}`, {
            method: "GET",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
            }
            })
            equipamento = await equipamento.json()
            const div_linha = document.createElement("div")
            div_linha.classList.add("linha-tabela")
            div_linha.innerHTML = `
                <div class="campo_corpo_id">
                    <div>
                        <p>${i + 1}</p>
                    </div>
                </div>
                <div class="campo_corpo_nome">
                    <p>${cliente.cpf}</p>
                </div>
                <div class="campo_corpo_cpf">
                    <p>${equipamento.modelo}</p>
                </div>
                <div class="campo_corpo_telefone">
                    <p>${os.status}</p>
                </div>
                <div class="campo_corpo_modificar">
                    <button class="ordem_servico_button">Ordens de serviço</button>
                    <button class="editar_cliente_modal_button" id="${os._id}"><img src="../images/editar_simbolo.svg" alt="icone de lápis"></button>
                    <button class="excluir_cliente_button" id="${os._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
                </div>
            `
            tabela.append(div_linha)
        });
        const button_editar_cliente_modal = document.querySelectorAll(".editar_cliente_modal_button")
        button_editar_cliente_modal.forEach((e) => {
            e.onclick = async () => {
                moda_editar_cliente.style.display = "flex"
                let resposta_api = await fetch(`http://localhost:3030/api/clientes/procurar?id=${e.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
                if (resposta_api.ok) {
                    let cliente_json = await resposta_api.json()
                    console.log(cliente_json)
                    input_editar_cliente_nome.value = cliente_json.nome
                    input_editar_cliente_cpf.value = cliente_json.cpf
                    input_editar_cliente_endereco.value = cliente_json.endereco
                    input_editar_cliente_telefone.value = cliente_json.telefone
                    id_cliente_editar = cliente_json._id
                } else {
                    let cliente_json = await resposta_api.json()
                    return mostrarAlerta(cliente_json.mensagem)
                }
            }
        })
        const button_excluir_cliente_modal = document.querySelectorAll(".excluir_cliente_button")
        button_excluir_cliente_modal.forEach((e) => {
            e.onclick = async () => {
                moda_excluir_cliente.style.display = "flex"
                let resposta_api = await fetch(`http://localhost:3030/api/clientes/procurar?id=${e.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
                if (resposta_api.ok) {
                    let cliente_json = await resposta_api.json()
                    id_cliente_editar = cliente_json._id
                } else {
                    let cliente_json = await resposta_api.json()
                    return mostrarAlerta(cliente_json.mensagem)
                }
            }
        })
    }
}

const procurar_cliente_input = document.querySelector("#pesquisa_input")

procurar_cliente_input.addEventListener("input", () => {
    let value = procurar_cliente_input.value;

    // Se o primeiro caractere for número
    if (/^\d/.test(value)) {
        value = value.replace(/\D/g, ""); // Remove tudo que não é número

        if (value.length > 11) value = value.slice(0, 11);

        // Aplica a máscara de CPF
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        procurar_cliente_input.value = value;
    } else {
        // Se começou com letra, deixa digitar normal
        procurar_cliente_input.value = value;
    }
});

procurar_cliente_input.addEventListener("keyup", e => {
    let timer;
    clearTimeout(timer); // limpa o último timer
    timer = setTimeout(async () => {
        // Aqui vai o que você quer fazer depois do delay
        console.log(e.target.value)
        let resposta_api = await fetch(`http://localhost:3030/api/clientes?busca=${e.target.value}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
            }
        })
        if (resposta_api.ok) {
            resposta_api = await resposta_api.json()
            const clientes = resposta_api.resposta_db
            const tabela = document.querySelector(".container-corpo-tabela")
            tabela.innerHTML = ""
            clientes.forEach((cliente, i) => {
                const div_linha = document.createElement("div")
                div_linha.classList.add("linha-tabela")
                div_linha.innerHTML = `
                <div class="campo_corpo_id">
                    <div>
                        <p>${i + 1}</p>
                    </div>
                </div>
                <div class="campo_corpo_nome">
                    <p>${cliente.nome}</p>
                </div>
                <div class="campo_corpo_cpf">
                    <p>${cliente.cpf}</p>
                </div>
                <div class="campo_corpo_telefone">
                    <p>${cliente.telefone}</p>
                </div>
                <div class="campo_corpo_modificar">
                    <button class="ordem_servico_button">Ordens de serviço</button>
                    <button class="editar_cliente_modal_button" id="${cliente._id}"><img src="../images/editar_simbolo.svg" alt="icone de lápis"></button>
                    <button class="excluir_cliente_button" id="${cliente._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
                </div>
            `
                tabela.append(div_linha)
            });
            const button_editar_cliente_modal = document.querySelectorAll(".editar_cliente_modal_button")
            button_editar_cliente_modal.forEach((e) => {
            e.onclick = async () => {
                moda_editar_cliente.style.display = "flex"
                let resposta_api = await fetch(`http://localhost:3030/api/clientes/procurar?id=${e.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
                if (resposta_api.ok) {
                    let cliente_json = await resposta_api.json()
                    console.log(cliente_json)
                    input_editar_cliente_nome.value = cliente_json.nome
                    input_editar_cliente_cpf.value = cliente_json.cpf
                    input_editar_cliente_endereco.value = cliente_json.endereco
                    input_editar_cliente_telefone.value = cliente_json.telefone
                    id_cliente_editar = cliente_json._id
                } else {
                    let cliente_json = await resposta_api.json()
                    return mostrarAlerta(cliente_json.mensagem)
                }
            }
        })
        const button_excluir_cliente_modal = document.querySelectorAll(".excluir_cliente_button")
        button_excluir_cliente_modal.forEach((e) => {
            e.onclick = async () => {
                moda_excluir_cliente.style.display = "flex"
                let resposta_api = await fetch(`http://localhost:3030/api/clientes/procurar?id=${e.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
                if (resposta_api.ok) {
                    let cliente_json = await resposta_api.json()
                    id_cliente_editar = cliente_json._id
                } else {
                    let cliente_json = await resposta_api.json()
                    return mostrarAlerta(cliente_json.mensagem)
                }
            }
        })
        }
    }, 600); // 500ms de delay
})

atualiza_tabela()

// // Fecha o modal de editar os clientes
// const button_voltar_modal_editar = document.querySelector("#fechar_editar_clientes_button")
// button_voltar_modal_editar.addEventListener("click", () => {
//     moda_editar_cliente.style.display = "none"
//     id_cliente_editar = undefined
// })

// Fecha o modal de editar os clientes
const button_voltar_modal_excluir = document.querySelector(".modal-excluir-button-nao")
button_voltar_modal_excluir.addEventListener("click", () => {
    moda_excluir_cliente.style.display = "none"
    id_cliente_editar = undefined
})

const button_salva_edicao_modal = document.querySelector("#editar-cliente-button")
button_salva_edicao_modal.addEventListener("click", async () => {
    const resposta_api = await fetch(`http://localhost:3030/api/clientes?id=${id_cliente_editar}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            nome: input_editar_cliente_nome.value.trim(),
            cpf: input_editar_cliente_cpf.value.trim(),
            endereco: input_editar_cliente_endereco.value.trim(),
            telefone: input_editar_cliente_telefone.value.trim()
        })
    }) 
    if(resposta_api.ok){
        const resposta_json = await resposta_api.json()
        atualiza_tabela()
        return mostrarAlerta(resposta_json.mensagem)
    }else{
        const resposta_json = await resposta_api.json()
        return mostrarAlerta(resposta_json.mensagem)
    }
})

const button_excloi_cliente_modal = document.querySelector(".modal-excluir-button-sair")
button_excloi_cliente_modal.addEventListener("click", async () => {
    const resposta_api = await fetch(`http://localhost:3030/api/clientes?id=${id_cliente_editar}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    }) 
    if(resposta_api.ok){
        const resposta_json = await resposta_api.json()
        atualiza_tabela()
        moda_excluir_cliente.style.display = "none"
        id_cliente_editar = undefined
        return mostrarAlerta(resposta_json.mensagem)
    }else{
        const resposta_json = await resposta_api.json()
        id_cliente_editar = undefined
        moda_excluir_cliente.style.display = "none"
        return mostrarAlerta(resposta_json.mensagem)
    }
})

