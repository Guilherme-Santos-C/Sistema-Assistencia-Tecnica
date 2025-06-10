import tokens from "./tokens.js"
import mostrarAlerta from "./mostrarAlerta.js"
import mascara_cpf from "./mascara_cpf.js"
import mascara_telefone from "./mascara_tel.js"

const div_senha_input = document.querySelector(".container_input_pesquisa")
const input_cliente = document.querySelector("#pesquisa_input")
input_cliente.addEventListener("focus", () => {
    div_senha_input.classList.add("focus")
})
input_cliente.addEventListener("blur", () => {
    div_senha_input.classList.remove("focus")
})

if (! await tokens.logado()) {
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

let nome_usuario
if (localStorage.getItem("nome") != null && sessionStorage.getItem("nome") == null) {
    nome_usuario = localStorage.getItem("nome")
} else if (localStorage.getItem("nome") == null && sessionStorage.getItem("nome") != null) {
    nome_usuario = sessionStorage.getItem("nome")
}
document.querySelector("#nome_usuario").innerText = nome_usuario.split(" ")[0]

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

// Modal - Criar Cliente
const criar_cliente_modal_button = document.querySelector("#button-adicionar-cliente-modal")
const modal_criar_cliente = document.querySelector(".fundo-modal-criar-cliente")
criar_cliente_modal_button.addEventListener("click", () => {
    modal_criar_cliente.style.display = "flex"
})
const fechar_criar_clientes_button = document.querySelector("#fechar_cadastrar_clientes_button")
fechar_criar_clientes_button.addEventListener("click", () => { modal_criar_cliente.style.display = "none" })

const input_nome_cadastrar_cliente = document.querySelector("#input-cadastrar-cliente-nome")
const input_cpf_cadastrar_cliente = document.querySelector("#input-cadastrar-cliente-cpf")
const input_endereco_cadastrar_cliente = document.querySelector("#input-cadastrar-cliente-endereco")
const input_telefone_cadastrar_cliente = document.querySelector("#input-cadastrar-cliente-telefone")
mascara_cpf(input_cpf_cadastrar_cliente)
mascara_telefone(input_telefone_cadastrar_cliente)

// Modal - editar clientes
const moda_editar_cliente = document.querySelector(".fundo-modal-editar-cliente")
const moda_editar_cliente_content = document.querySelector(".modal-editar-cliente-content")
const h2_editar_cliente = document.querySelector("#h2_editar")

// Modal - cadastrar OS
const modal_cadastrar_os = document.querySelector(".fundo-modal-criar-os")

// Modal - excluir clientes
const moda_excluir_cliente = document.querySelector(".fundo-modal-excluir")


const criar_cliente = async () => {
    if (!input_endereco_cadastrar_cliente.value && !input_telefone_cadastrar_cliente.value && !input_cpf_cadastrar_cliente.value && !input_nome_cadastrar_cliente.value) {
        return mostrarAlerta("Preencha os campos!")
    }
    if (!input_nome_cadastrar_cliente.value) return mostrarAlerta("Preencha o nome!")
    if (!input_cpf_cadastrar_cliente.value) return mostrarAlerta("Preencha o cpf!")
    if (!input_telefone_cadastrar_cliente.value) return mostrarAlerta("Preencha o telefone!")
    if (!input_endereco_cadastrar_cliente.value) return mostrarAlerta("Preencha o endereço!")

    const modal_conteudo = document.querySelector(".modal-criar-cliente-content")
    const icone_loading = document.querySelector("#icone_loading")
    const modal_header = document.querySelector(".modal-editar-cliente-header")
    modal_header.style.display = "none"
    modal_conteudo.style.display = "none"
    icone_loading.style.display = "block"

    const resposta_api = await fetch("http://localhost:3030/api/clientes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            nome: input_nome_cadastrar_cliente.value.trim(),
            cpf: input_cpf_cadastrar_cliente.value.trim(),
            endereco: input_endereco_cadastrar_cliente.value.trim(),
            telefone: input_telefone_cadastrar_cliente.value.trim()
        })
    })

    if (resposta_api.ok) {
        const resposta_json = await resposta_api.json()
        input_nome_cadastrar_cliente.value = ""
        input_cpf_cadastrar_cliente.value = ""
        input_endereco_cadastrar_cliente.value = ""
        input_telefone_cadastrar_cliente.value = ""
        modal_conteudo.style.display = "flex"
        modal_header.style.display = "flex"
        icone_loading.style.display = "none"
        mostrarAlerta(resposta_json.mensagem)
        atualiza_tabela()
    } else {
        const resposta_json = await resposta_api.json()
        input_nome_cadastrar_cliente.value = ""
        input_cpf_cadastrar_cliente.value = ""
        input_endereco_cadastrar_cliente.value = ""
        input_telefone_cadastrar_cliente.value = ""
        modal_conteudo.style.display = "flex"
        icone_loading.style.display = "none"
        mostrarAlerta(resposta_json.mensagem)
    }
}

const criar_cliente_button = document.querySelector("#criar-cliente-button")
criar_cliente_button.addEventListener("click", criar_cliente)

// Inputs do modal editar clientes
const input_editar_cliente_nome = document.querySelector("#input-editar-cliente-nome")
const input_editar_cliente_cpf = document.querySelector("#input-editar-cliente-cpf")
const input_editar_cliente_endereco = document.querySelector("#input-editar-cliente-endereco")
const input_editar_cliente_telefone = document.querySelector("#input-editar-cliente-telefone")
mascara_cpf(input_editar_cliente_cpf)
mascara_telefone(input_editar_cliente_telefone)

// Inputs do modal cadastrar os
const input_cadastrar_os_marca = document.querySelector("#input-editar-os-marca")
const input_cadastrar_os_modelo = document.querySelector("#input-editar-os-modelo")
const input_cadastrar_os_cor = document.querySelector("#input-editar-os-cor")
const input_cadastrar_os_observacoesEquipamento = document.querySelector("#input-editar-os-observacoes-equipamento")
const input_cadastrar_os_orcamento = document.querySelector("#input-editar-os-orcamento")
const input_cadastrar_os_diagnostico = document.querySelector("#input-editar-os-diagnostico")
const input_cadastrar_os_observacoes = document.querySelector("#input-editar-os-observacoes")

// Variavel para ser acessada na requisição de editar o cliente quando abre o modal o valor dela é o id do cliente quando fecha volta a undefined
let id_cliente_editar;

let atualiza_tabela = async () => {
    let resposta_api = await fetch("http://localhost:3030/api/clientes", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    })
    if (resposta_api.ok) {
        resposta_api = await resposta_api.json()
        const clientes = resposta_api.resposta_db
        console.log(clientes)
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
                    <button class="ordem_servico_button_modal" id="${cliente._id}">Ordens de serviço</button>
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
        const button_ordem_modal = document.querySelectorAll(".ordem_servico_button_modal")
        button_ordem_modal.forEach((e) => {
            e.addEventListener("click", async () => {
                modal_cadastrar_os.style.display = "flex"
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
            })
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
        console.log(clientes)
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
                    <button class="ordem_servico_button_modal" id="${cliente._id}">Ordens de serviço</button>
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
        const button_ordem_modal = document.querySelectorAll(".ordem_servico_button_modal")
        button_ordem_modal.forEach((e) => {
            e.addEventListener("click", async () => {
                modal_cadastrar_os.style.display = "flex"
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
            })
        })
    }
    }, 600); // 500ms de delay
})

atualiza_tabela()

// Fecha o modal de editar os clientes
const button_voltar_modal_editar = document.querySelector("#fechar_editar_clientes_button")
button_voltar_modal_editar.addEventListener("click", () => {
    moda_editar_cliente.style.display = "none"
    id_cliente_editar = undefined
})

// Fecha o modal de editar os clientes
const button_voltar_modal_excluir = document.querySelector(".modal-excluir-button-nao")
button_voltar_modal_excluir.addEventListener("click", () => {
    moda_excluir_cliente.style.display = "none"
    id_cliente_editar = undefined
})

//Fecha o modal de cadastro das os 
const button_voltar_cadastro_os_modal = document.querySelector("#button_voltar_modal_os")
button_voltar_cadastro_os_modal.addEventListener("click", () => {
    modal_cadastrar_os.style.display = "none"
    id_cliente_editar = undefined
})

const button_salva_edicao_modal = document.querySelector("#editar-cliente-button")
button_salva_edicao_modal.addEventListener("click", async () => {
    moda_editar_cliente_content.style.display = "none"
    h2_editar_cliente.style.display = "none"
    button_voltar_modal_editar.style.display = "none"
    document.querySelector("#icone_loading_editar").style.display = "block"
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
    if (resposta_api.ok) {
        const resposta_json = await resposta_api.json()
        atualiza_tabela()
        moda_editar_cliente_content.style.display = "flex"
        h2_editar_cliente.style.display = "flex"
        button_voltar_modal_editar.style.display = "flex"
        document.querySelector("#icone_loading_editar").style.display = "none"
        return mostrarAlerta(resposta_json.mensagem)
    } else {
        const resposta_json = await resposta_api.json()
        moda_editar_cliente_content.style.display = "flex"
        h2_editar_cliente.style.display = "flex"
        button_voltar_modal_editar.style.display = "flex"
        document.querySelector("#icone_loading_editar").style.display = "none"
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
    const resposta_api_os = await fetch(`http://localhost:3030/api/ordens?id_cliente=${id_cliente_editar}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    })
    if (resposta_api.ok && resposta_api_os.ok) {
        const resposta_json = await resposta_api.json()
        atualiza_tabela()
        moda_excluir_cliente.style.display = "none"
        id_cliente_editar = undefined
        return mostrarAlerta(resposta_json.mensagem)
    } else {
        const resposta_json = await resposta_api.json()
        id_cliente_editar = undefined
        moda_excluir_cliente.style.display = "none"
        return mostrarAlerta(resposta_json.mensagem)
    }
})

function abrirPdfParaImpressao(pdfBase64) {
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    const printWindow = window.open(blobUrl);
    if (!printWindow) {
        alert('Bloqueador de popups impediu a abertura da janela de impressão.');
        return;
    }
    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
}


const cadastrar_os_button = document.querySelector("#cadastrar_os_button")
cadastrar_os_button.addEventListener("click", async () => {
    if (!input_cadastrar_os_marca.value) return mostrarAlerta("Preencha a marca do equipamento")
    if (!input_cadastrar_os_modelo.value) return mostrarAlerta("Preencha o modelo do equipamento")
    if (!input_cadastrar_os_cor.value) return mostrarAlerta("Preencha a cor do equipamento")
    const icone_loading = document.querySelector("#icone_loading_os")
    const modal_criar_os_conteudo = document.querySelector(".modal-criar-os-content")
    modal_criar_os_conteudo.style.display = "none"
    icone_loading.style.display = "block"
    let numeroOs = await fetch("http://localhost:3030/api/ordens/numero", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    })
    numeroOs = await numeroOs.json()
    numeroOs = numeroOs.numero
    let equipamento = await fetch("http://localhost:3030/api/equipamentos", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            marca: input_cadastrar_os_marca.value.trim(),
            modelo: input_cadastrar_os_modelo.value.trim(),
            cor: input_cadastrar_os_cor.value.trim(),
            observacoes: input_cadastrar_os_observacoes.value.trim()
        })
    })
    if (equipamento.ok) {
        equipamento = await equipamento.json()
        let os = await fetch("http://localhost:3030/api/ordens", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                equipamento_id: equipamento._id,
                cliente_id: id_cliente_editar,
                numero: numeroOs,
                status: "Aguardando diagnóstico",
                orcamento: input_cadastrar_os_orcamento.value.trim().replace(",", "."),
                diagnostico: input_cadastrar_os_diagnostico.value.trim(),
                observacoes: input_cadastrar_os_observacoes.value.trim(),
                nome_usuario,
                cpf_usuario: localStorage.getItem("cpf") || sessionStorage.getItem("cpf"),
                nome_equipamento: input_cadastrar_os_modelo.value.trim(),
                marca_equipamento: input_cadastrar_os_marca.value
            })
        })
        if (os.ok) {
            os = await os.json()
            modal_criar_os_conteudo.style.display = "flex"
            icone_loading.style.display = "none"
            mostrarAlerta(os.mensagem)
            abrirPdfParaImpressao(os.pdf)
            input_cadastrar_os_marca.value = ""
            input_cadastrar_os_modelo.value = ""
            input_cadastrar_os_cor.value = ""
            input_cadastrar_os_observacoesEquipamento.value = ""
            input_cadastrar_os_orcamento.value = ""
            input_cadastrar_os_diagnostico.value = ""
            input_cadastrar_os_observacoes.value = ""
        } else {
            os = await os.json()
            modal_criar_os_conteudo.style.display = "flex"
            icone_loading.style.display = "none"
            mostrarAlerta(os.mensagem)
        }
    } else {
        equipamento = await equipamento.json()
        return mostrarAlerta(equipamento.mensagem)
    }
})