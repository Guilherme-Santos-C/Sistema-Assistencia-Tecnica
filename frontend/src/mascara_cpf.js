const mascara_cpf = (cpfInput) => {
    cpfInput.addEventListener("input", () => {
        let value = cpfInput.value.replace(/\D/g, "");

        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        cpfInput.value = value;
    });
}

export default mascara_cpf;