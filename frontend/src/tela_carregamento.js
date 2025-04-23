const exibir = () => {
    const icone = document.querySelector("#icone_loading")
    console.log(icone)
    document.body.style.display = "none"
    icone.style.display = "block"
}

const fechar = () => {
    const icone = document.querySelector("#icone_loading")
    document.body.style.display = "flex"
    icone.style.display = "none"
}

export default {exibir, fechar};