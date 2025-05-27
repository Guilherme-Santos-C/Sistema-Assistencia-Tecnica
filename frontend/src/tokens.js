const tokenController = {
    salvarSession (token, nome, cpf) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("nome", nome);
        sessionStorage.setItem("cpf", cpf);
    },
    salvarLocal (token, nome, cpf) {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("nome", nome);
        localStorage.setItem("cpf", cpf);
    },
    fecharSessão () {
        localStorage.clear();
        sessionStorage.clear();
    },
    async logado () {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        if(token == null) return false
        const resposta_api = await fetch("http://localhost:3030/api/verificaTokenUser", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        })
        if(resposta_api.ok) return true
        return false
    }
}

export default tokenController