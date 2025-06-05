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
// Modal - visualizar OS
const modal_visualizar_os = document.querySelector(".fundo-modal-visualizar-os")

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
let os_editar;
let cliente_editar;
let equipamento_editar;

// Inputs do modal editar Os
const input_editar_os_orcamento = document.querySelector("#input-editar-os-orcamento")
const input_editar_os_diagnostico = document.querySelector("#input-editar-os-diagnostico")
const input_editar_os_status = document.querySelector("#input-editar-os-status")
const input_editar_os_observacoes = document.querySelector("#input-editar-os-observacoes")

// textos do modal visualizar Os
const text_visualizar_os_equipamento_marca = document.querySelector("#text-marca-equipamento")
const text_visualizar_os_equipamento_modelo = document.querySelector("#text-modelo-equipamento")
const text_visualizar_os_equipamento_cor = document.querySelector("#text-cor-equipamento")
const text_visualizar_os_equipamento_obs = document.querySelector("#text-observacoes-equipamento")
const text_visualizar_os_orcamento = document.querySelector("#text-orcamento-os")
const text_visualizar_os_diagnostico = document.querySelector("#text-diagnostico-os")
const text_visualizar_os_obs = document.querySelector("#text-observacoes-os")
const text_visualizar_os_cpf = document.querySelector("#text-cpf-os")
const text_visualizar_os_status = document.querySelector("#text-status-os")

// Para colocar o load na tabela
const elementos_tabela = document.querySelectorAll(".tabela")
const icone_load_tabela = document.querySelector("#icone_load_tabela")

// load do visualizar os
const icone_load_visualizar_os = document.querySelector("#icone_loading_visualizar_os")

// conteudo do modal visuzalizar os
const content_modal_visualizar_os = document.querySelector(".modal-visualizar-os-content")

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
                <div><p>${os.numero}</p></div>
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
                ${os.status == "Entregue" || os.status == "Consertado e entregue" ? "" :  `<button class="editar_os_modal_button" id="${os._id}"><img src="../images/editar_simbolo.svg" alt="icone de lápis"></button>`} 
                <button class="excluir_os_button" id="${os._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
            </div>
        `;
        tabela.append(div_linha);
    });

    // Eventos dos botões - abaixo

    document.querySelectorAll(".editar_os_modal_button").forEach((btn) => {
        btn.onclick = async () => {
            modal_editar_os.style.display = "flex";
            const icone_loading = document.querySelector("#icone_loading_editar_os")
            const conteudo_modal_editar_os = document.querySelector(".modal-editar-os-content")
            conteudo_modal_editar_os.style.display = "none"
            icone_loading.style.display = "block"
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
                conteudo_modal_editar_os.style.display = "flex"
                icone_loading.style.display = "none"
                os_editar = os
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
                os_editar = os
            } else {
                return mostrarAlerta(cliente_json.mensagem);
            }
        };
    });

    document.querySelectorAll(".visualizar_os_button").forEach((btn) => {
        btn.onclick = async () => {
            modal_visualizar_os.style.display = "flex";
            content_modal_visualizar_os.style.display = "none"
            icone_load_visualizar_os.style.display = "block"
            const resposta_json_os = await fetch(`http://localhost:3030/api/ordens/procurar?id=${btn.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                }
            });
            if (resposta_json_os.ok) {
                const os = await resposta_json_os.json();
                os_editar = os
                const resposta_json_cliente = await fetch(`http://localhost:3030/api/clientes/procurar?id=${os.cliente}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                    }
                });
                if (resposta_json_cliente.ok) {
                    const cliente = await resposta_json_cliente.json();
                    cliente_editar = cliente
                    const resposta_json_equipamento = await fetch(`http://localhost:3030/api/equipamentos/procurar?id=${os.equipamento}`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
                        }
                    });
                    if (resposta_json_equipamento.ok) {
                        const equipamento = await resposta_json_equipamento.json()
                        os_editar = os
                        equipamento_editar = equipamento
                        text_visualizar_os_cpf.innerText = cliente.cpf
                        text_visualizar_os_diagnostico.innerText = os.diagnostico == "" ? "Nenhum" : os.diagnostico
                        text_visualizar_os_equipamento_cor.innerText = equipamento.cor
                        text_visualizar_os_equipamento_marca.innerText = equipamento.marca
                        text_visualizar_os_equipamento_modelo.innerText = equipamento.modelo
                        text_visualizar_os_equipamento_obs.innerText = equipamento.observacoes == "" ? "Nenhuma" : equipamento.observacoes
                        text_visualizar_os_obs.innerText = os.observacoes == "" ? "Nenhuma" : os.observacoes
                        text_visualizar_os_orcamento.innerText = os.orcamento == null ? "Sem orçamento" : os.orcamento + " R$"
                        text_visualizar_os_status.innerText = os.status
                        content_modal_visualizar_os.style.display = "flex"
                        icone_load_visualizar_os.style.display = "none"
                        return "";
                    }
                }
            }
            return mostrarAlerta("Erro interno");
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
                ${os.status == "Entregue" || os.status == "Consertado e entregue" ? null :  `<button class="editar_os_modal_button" id="${os._id}"><img src="../images/editar_simbolo.svg" alt="icone de lápis"></button>`} 
                <button class="excluir_os_button" id="${os._id}"><img src="../images/icone_lixeira.svg" alt="icone de lixeira"></button>
            </div>
        `;
            tabela.append(div_linha);
        });

        // Eventos dos botões - abaixo
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
                    os_editar = os
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
                    cliente_editar = cliente_json._id;
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
    os_editar = undefined
})

// Fecha o modal de visualizar ordens
const button_voltar_modal_visualizar = document.querySelector("#fechar_visualizar_os_button")
button_voltar_modal_visualizar.addEventListener("click", () => {
    modal_visualizar_os.style.display = "none"
    os_editar = undefined
    cliente_editar = undefined
})

// Funcionamento dos botões do modal de excluir as ordens
const button_voltar_modal_excluir = document.querySelector(".modal-excluir-button-nao")
button_voltar_modal_excluir.addEventListener("click", () => {
    modal_excluir_os.style.display = "none"
    os_editar = undefined
    cliente_editar = undefined
})
const button_excluir_cliente_modal_confirma = document.querySelector(".modal-excluir-button-confirma")
button_excluir_cliente_modal_confirma.addEventListener("click", async () => {
    const resposta_api_json = await fetch(`http://localhost:3030/api/ordens?id=${os_editar._id}`, {
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
        os_editar = undefined
        return mostrarAlerta(resposta_api.mensagem)
    } else {
        const resposta_api = await resposta_api_json.json()
        os_editar = undefined
        modal_excluir_os.style.display = "none"
        return mostrarAlerta(resposta_api.mensagem)
    }
})

const button_salva_edicao_modal = document.querySelector("#editar-os-button")
button_salva_edicao_modal.addEventListener("click", async () => {
    const icone_loading = document.querySelector("#icone_loading_editar_os")
    const conteudo_modal_editar_os = document.querySelector(".modal-editar-os-content")
    conteudo_modal_editar_os.style.display = "none"
    icone_loading.style.display = "block"
    const resposta_api = await fetch(`http://localhost:3030/api/ordens?id=${os_editar._id}`, {
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


// gerar protocolo de saida
const button_gerar_protocolo_saida = document.getElementById("gerar_protocolo_saida")
button_gerar_protocolo_saida.addEventListener("click", async () => {
    content_modal_visualizar_os.style.display = "none"
    icone_load_visualizar_os.style.display = "block"
    let resposta_api_editar = await fetch(`http://localhost:3030/api/ordens?id=${os_editar._id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            orcamento: os_editar.orcamento,
            diagnostico: os_editar.diagnostico,
            status: os_editar.status == "Pronto" ? "Consertado e entregue" : "Entregue",
            observacoes: os_editar.observacoes
        })
    })
    if (resposta_api_editar.ok) {
        let resposta_api_pdf = await fetch("http://localhost:3030/api/protocoloDeSaida", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                nome_usuario,
                cpf_usuario: localStorage.getItem("cpf") || sessionStorage.getItem("cpf"),
                nome_equipamento: equipamento_editar.modelo,
                marca_equipamento: equipamento_editar.marca,
                numero: os_editar.numero,
                nome_cliente: cliente_editar.nome,
                cpf_cliente: cliente_editar.cpf,
                status: os_editar.status
            })
        })
        resposta_api_pdf = await resposta_api_pdf.json()
        abrirPdfParaImpressao(resposta_api_pdf.pdf)
        atualiza_tabela()
        icone_load_visualizar_os.style.display = "none"
        content_modal_visualizar_os.style.display = "flex"
    } else {
        resposta_api_editar = await resposta_api_editar.json()
        return mostrarAlerta(resposta_api_editar.mensagem)
    }
})