const mascara_telefone = (input) => {
  input.addEventListener("input", () => {
    let value = input.value.replace(/\D/g, "");

    if (value.length === 0) {
      input.value = "";
      return;
    }

    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      value = value.replace(/^(\d*)/, "($1");
    }

    input.value = value;
  });
}

  export default mascara_telefone;