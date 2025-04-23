const mostrarAlerta = (mensagem) => {
    const tem_alerta = document.querySelector(".span_alerta")
    if(!tem_alerta){
        const alerta = document.createElement("span");
        alerta.textContent = mensagem;
        alerta.classList.add("span_alerta");
        document.body.prepend(alerta);
        setTimeout(() => alerta.remove(), 4000);
        return mensagem    
    }
};

export default mostrarAlerta;
 