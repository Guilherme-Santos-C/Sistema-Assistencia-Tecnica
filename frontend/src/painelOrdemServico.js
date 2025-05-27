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

if (!await tokens.logado()) {
    window.location.replace("http://localhost:3030")
}

// Modal - Editar OS
const modal_editar_os = document.querySelector(".fundo-modal-editar-os")
// Modal - excluir OS
const modal_excluir_os = document.querySelector(".fundo-modal-excluir")

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
    nome_usuario = localStorage.getItem("nome")
} else if (localStorage.getItem("nome") == null && sessionStorage.getItem("nome") != null) {
    nome_usuario = sessionStorage.getItem("nome")
}
document.querySelector("#nome_usuario").innerText = nome_usuario.split(" ")[0]


// Modal - Logout Lógica
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
let id_os_editar;

// Inputs do modal editar Os
const input_editar_os_orcamento = document.querySelector("#input-editar-os-orcamento")
const input_editar_os_diagnostico = document.querySelector("#input-editar-os-diagnostico")
const input_editar_os_status = document.querySelector("#input-editar-os-status")
const input_editar_os_observacoes = document.querySelector("#input-editar-os-observacoes")

// Para colocar o load na tabela
const elementos_tabela = document.querySelectorAll(".tabela")
const icone_load_tabela = document.querySelector("#icone_load_tabela")

let atualiza_tabela = async () => {
    icone_load_tabela.style.display = "block"
    elementos_tabela.forEach((e) => {
        e.style.display = "none"
    })
    let resposta_api = await fetch("http://localhost:3030/api/ordens", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    });

    if (!resposta_api.ok) return;

    let OSs = await resposta_api.json();

    // Substituir cliente e equipamento por strings legíveis
    OSs = await Promise.all(OSs.map(async (os) => {
        let [clienteResp, equipamentoResp] = await Promise.all([
            fetch(`http://localhost:3030/api/clientes/procurar?id=${os.cliente}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                }
            }),
            fetch(`http://localhost:3030/api/equipamentos/procurar?id=${os.equipamento}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                }
            })
        ]);

        const cliente = await clienteResp.json();
        const equipamento = await equipamentoResp.json();

        return {
            ...os,
            cliente_cpf_string: cliente.cpf,
            equipamento_nome_string: equipamento.modelo,
            createdAt: new Date(os.createdAt)
        };
    }));

    // Ordenar por data de criação
    OSs.sort((a, b) => b.createdAt - a.createdAt);

    const tabela = document.querySelector(".container-corpo-tabela");
    tabela.innerHTML = "";

    OSs.forEach((os, i) => {
        const div_linha = document.createElement("div");
        div_linha.classList.add("linha-tabela");
        div_linha.innerHTML = `
            <div class="campo_corpo_id">
                <div><p>${i + 1}</p></div>
            </div>
            <div class="campo_corpo_nome">
                <p>${os.cliente_cpf_string}</p>
            </div>
            <div class="campo_corpo_cpf">
                <p>${os.equipamento_nome_string}</p>
            </div>
            <div class="campo_corpo_telefone">
                <p>${os.status}</p>
            </div>
            <div class="campo_corpo_modificar">
                <button class="visualizar_os_button" id="${os._id}">Visualizar</button>
                <button class="editar_os_modal_button" id="${os._id}"><img src="../images/editar_simbolo.svg" alt="icone de lápis"></button>
                <button class="excluir_os_button" id="${os._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
            </div>
        `;
        tabela.append(div_linha);
    });

    // Eventos de edição e exclusão
    document.querySelectorAll(".editar_os_modal_button").forEach((btn) => {
        btn.onclick = async () => {
            modal_editar_os.style.display = "flex";
            const resposta_json = await fetch(`http://localhost:3030/api/ordens/procurar?id=${btn.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                }
            });
            if (resposta_json.ok) {
                const os = await resposta_json.json();
                input_editar_os_orcamento.value = os.orcamento
                input_editar_os_diagnostico.value = os.diagnostico
                input_editar_os_status.value = os.status
                input_editar_os_observacoes.value = os.observacoes
                id_os_editar = os._id
            }
            else {
                return mostrarAlerta(os);
            }
        };
    });

    document.querySelectorAll(".excluir_os_button").forEach((btn) => {
        btn.onclick = async () => {
            modal_excluir_os.style.display = "flex";
            const resposta_json = await fetch(`http://localhost:3030/api/ordens/procurar?id=${btn.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                }
            });
            if (resposta_json.ok) {
                const os = await resposta_json.json();
                id_os_editar = os._id
            } else {
                return mostrarAlerta(cliente_json.mensagem);
            }
        };
    });
    icone_load_tabela.style.display = "none"
    elementos_tabela.forEach((e) => {
        e.style.display = "flex"
    })
    elementos_tabela[0].style.display = "grid"
};


const procurar_cliente_input = document.querySelector("#pesquisa_input")

procurar_cliente_input.addEventListener("keyup", e => {
    let timer;
    clearTimeout(timer); // limpa o último timer
    timer = setTimeout(async () => {
        // Aqui vai o que você quer fazer depois do delay
        let resposta_api = await fetch(`http://localhost:3030/api/ordens?busca=${procurar_cliente_input.value}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
            }
        })
        if (!resposta_api.ok) return;

        let OSs = await resposta_api.json();

        // Substituir cliente e equipamento por strings legíveis
        OSs = await Promise.all(OSs.map(async (os) => {
            let [clienteResp, equipamentoResp] = await Promise.all([
                fetch(`http://localhost:3030/api/clientes/procurar?id=${os.cliente}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                }),
                fetch(`http://localhost:3030/api/equipamentos/procurar?id=${os.equipamento}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                })
            ]);

            const cliente = await clienteResp.json();
            const equipamento = await equipamentoResp.json();

            return {
                ...os,
                cliente_cpf_string: cliente.cpf,
                equipamento_nome_string: equipamento.modelo,
                createdAt: new Date(os.createdAt)
            };
        }));

        // Ordenar por data de criação
        OSs.sort((a, b) => b.createdAt - a.createdAt);

        const tabela = document.querySelector(".container-corpo-tabela");
        tabela.innerHTML = "";

        OSs.forEach((os, i) => {
            const div_linha = document.createElement("div");
            div_linha.classList.add("linha-tabela");
            div_linha.innerHTML = `
            <div class="campo_corpo_id">
                <div><p>${i + 1}</p></div>
            </div>
            <div class="campo_corpo_nome">
                <p>${os.cliente_cpf_string}</p>
            </div>
            <div class="campo_corpo_cpf">
                <p>${os.equipamento_nome_string}</p>
            </div>
            <div class="campo_corpo_telefone">
                <p>${os.status}</p>
            </div>
            <div class="campo_corpo_modificar">
                <button class="ordem_servico_button">Visualizar</button>
                <button class="editar_os_modal_button" id="${os._id}"><img src="../images/editar_simbolo.svg" alt="icone de lápis"></button>
                <button class="excluir_os_button" id="${os._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
            </div>
        `;
            tabela.append(div_linha);
        });

        // Eventos de edição e exclusão
        document.querySelectorAll(".editar_os_modal_button").forEach((btn) => {
            btn.onclick = async () => {
                modal_editar_os.style.display = "flex";
                const resposta_json = await fetch(`http://localhost:3030/api/ordens/procurar?id=${btn.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                });
                if (resposta_json.ok) {
                    const os = await resposta_json.json();
                    input_editar_os_orcamento.value = os.orcamento
                    input_editar_os_diagnostico.value = os.diagnostico
                    input_editar_os_status.value = os.status
                    input_editar_os_observacoes.value = os.observacoes
                    id_os_editar = os._id
                }
                else {
                    return mostrarAlerta(os);
                }
            };
        });

        document.querySelectorAll(".excluir_os_button").forEach((btn) => {
            btn.onclick = async () => {
                moda_excluir_cliente.style.display = "flex";
                const resposta = await fetch(`http://localhost:3030/api/clientes/procurar?id=${btn.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                });
                const cliente_json = await resposta.json();
                if (resposta.ok) {
                    id_cliente_editar = cliente_json._id;
                } else {
                    return mostrarAlerta(cliente_json.mensagem);
                }
            };
        });

    }, 600); // 500ms de delay
})

atualiza_tabela()

// Fecha o modal de editar ordens
const button_voltar_modal_editar = document.querySelector("#fechar_editar_os_button")
button_voltar_modal_editar.addEventListener("click", () => {
    modal_editar_os.style.display = "none"
    id_os_editar = undefined
})

// Funcionamento dos botões do modal de excluir as ordens
const button_voltar_modal_excluir = document.querySelector(".modal-excluir-button-nao")
button_voltar_modal_excluir.addEventListener("click", () => {
    modal_excluir_os.style.display = "none"
    id_os_editar = undefined
})
const button_excluir_cliente_modal_confirma = document.querySelector(".modal-excluir-button-confirma")
button_excluir_cliente_modal_confirma.addEventListener("click", async () => {
    const resposta_api_json = await fetch(`http://localhost:3030/api/ordens?id=${id_os_editar}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        }
    })
    if (resposta_api_json.ok) {
        atualiza_tabela()
        const resposta_api = await resposta_api_json.json()
        modal_excluir_os.style.display = "none"
        id_os_editar = undefined
        return mostrarAlerta(resposta_api.mensagem)
    } else {
        const resposta_api = await resposta_api_json.json()
        id_os_editar = undefined
        modal_excluir_os.style.display = "none"
        return mostrarAlerta(resposta_api.mensagem)
    }
} )

const button_salva_edicao_modal = document.querySelector("#editar-os-button")
button_salva_edicao_modal.addEventListener("click", async () => {
    const icone_loading = document.querySelector("#icone_loading_editar_os")
    const conteudo_modal_editar_os = document.querySelector(".modal-editar-os-content")
    conteudo_modal_editar_os.style.display = "none"
    icone_loading.style.display = "block"
    const resposta_api = await fetch(`http://localhost:3030/api/ordens?id=${id_os_editar}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            orcamento: input_editar_os_orcamento.value.trim(),
            diagnostico: input_editar_os_diagnostico.value.trim(),
            status: input_editar_os_status.value.trim(),
            observacoes: input_editar_os_observacoes.value.trim()
        })
    })
    if (resposta_api.ok) {
        const resposta_json = await resposta_api.json()
        atualiza_tabela()
        conteudo_modal_editar_os.style.display = "block"
        icone_loading.style.display = "none"
        return mostrarAlerta(resposta_json.mensagem)
    } else {
        const resposta_json = await resposta_api.json()
        conteudo_modal_editar_os.style.display = "block"
        icone_loading.style.display = "none"
        return mostrarAlerta(resposta_json.mensagem)
    }
})

