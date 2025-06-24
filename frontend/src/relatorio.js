import tokens from "./tokens.js"
import mostrarAlerta from "./mostrarAlerta.js"

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
button_fechar_modal.addEventListener("click", () => { modal.style.display = "none" })
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

const button_gera_relatorio_trimestral = document.querySelector("#gera_relatorio_trimestral")
const button_gera_relatorio_semestral = document.querySelector("#gera_relatorio_semestral")
const button_abrir_modal_personalizado = document.querySelector("#gera_relatorio_personalizado")

const icone_load = document.querySelector("#icone_loading_relatorio")

// conteudo da página
const left_content = document.querySelector(".left-side-content")
const rigth_content = document.querySelector(".right-side-content")

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

const gerar_realtorio = async (dataInicial, dataFinal, tipo) => {
    left_content.style.display = "none"
    rigth_content.style.display = "none"
    icone_load.style.display = "block"
    const resposta_api_json = await fetch("http://localhost:3030/api/relatorio", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            dataInicial: dataInicial,
            dataFinal: dataFinal,
            tipo: tipo
        })
    })
    if (resposta_api_json.ok) {
        const resposta_api = await resposta_api_json.json()
        abrirPdfParaImpressao(resposta_api.pdf)
        left_content.style.display = "flex"
        rigth_content.style.display = "flex"
        icone_load.style.display = "none"
        return mostrarAlerta("Relatório gerado com sucesso")
    }
    else {
        const resposta_api = await resposta_api_json.json()
        return mostrarAlerta("Erro ao gerar relatório")
    }
}

button_gera_relatorio_trimestral.addEventListener("click", () => {
    const data_atual = new Date()
    const data_final = new Date()
    data_final.setMonth(data_atual.getMonth() - 3)
    gerar_realtorio(data_final, data_atual, "Trimestral")
})

button_gera_relatorio_semestral.addEventListener("click", () => {
    const data_atual = new Date()
    const data_final = new Date()
    data_final.setMonth(data_atual.getMonth() - 6)
    gerar_realtorio(data_final, data_atual, "Semestral")
})

const modal_relatorio_personalizado = document.querySelector(".fundo-modal-relatorio-personalizado")
const modal_relatorio_personalizado_conteudo = document.querySelector(".modal-relatorio-personalizado-content")

// Abrir e fechar modal do relatorio personalizado
document.querySelector("#gera_relatorio_personalizado").addEventListener("click", () => {
    modal_relatorio_personalizado.style.display = "flex"
})  
document.querySelector("#fechar_modal_relatorio_personalizado").addEventListener("click", () => {
    modal_relatorio_personalizado.style.display = "none"
})

// icone load modal 
const icone_load_modal = document.querySelector("#icone_loading_relatorio_modal")

// Inputs do modal 
const input_final = document.querySelector("#dataInicio")
const input_inicio = document.querySelector("#dataFinal")

const button_gera_relatorio_personalizado = document.querySelector("#button-gera-relatorio-personalizado")
button_gera_relatorio_personalizado.addEventListener("click", async () => {
    if (input_inicio.value == "" || input_final.value == "") return mostrarAlerta("Preencha as data para gerar o relatório");
    const data_inicial = new Date(input_inicio.value)
    const data_final = new Date(input_final.value)
    data_inicial.setDate(data_inicial.getDate() +1)
    data_final.setDate(data_final.getDate() +1)
    if(data_final > data_inicial) return mostrarAlerta("Incoerência nas datas");
    icone_load_modal.style.display = "block"
    modal_relatorio_personalizado_conteudo.style.display = "none"
    const resposta_api_json = await fetch("http://localhost:3030/api/relatorio", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
            dataInicial: data_final,
            dataFinal: data_inicial,
            tipo: "Personalizado"
        })
    })
    if (resposta_api_json.ok) {
        const resposta_api = await resposta_api_json.json()
        abrirPdfParaImpressao(resposta_api.pdf)
        icone_load_modal.style.display = "none"
        modal_relatorio_personalizado_conteudo.style.display = "grid"
        return mostrarAlerta("Relatório gerado com sucesso")
    }
    else {
        const resposta_api = await resposta_api_json.json()
        icone_load_modal.style.display = "none"
        modal_relatorio_personalizado_conteudo.style.display = "grid"
        return mostrarAlerta("Erro ao gerar relatório")
    }
})