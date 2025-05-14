const exibir = () => {
    const icone = document.querySelector("#icone_loading")
    const main = document.querySelector("main")
    main.style.display = "none"
    icone.style.display = "block"
}

const fechar = () => {
    const icone = document.querySelector("#icone_loading")
    const main = document.querySelector("main")
    main.style.display = "flex"
    icone.style.display = "none"
}

export default {exibir, fechar};