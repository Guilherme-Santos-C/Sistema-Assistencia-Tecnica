const tokenController = {
    salvarSession (token, nome) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("nome", nome);
    },
    salvarLocal (token, nome) {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("nome", nome);
    },
    fecharSessão () {
        localStorage.clear();
        sessionStorage.clear();
    },
    logado () {
        if(!!localStorage.getItem("token")) return true
        if(!!sessionStorage.getItem("token")) return true
        return false
    }
}

export default tokenController