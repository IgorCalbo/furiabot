const conteudoChatbot = document.querySelector(".chatbot-content")
const inputMensagem = document.querySelector(".input-mensagem")
const botaoMandarMensagem = document.querySelector("#mandar-mensagem")

// Setup API
const API_KEY = "AIzaSyCxjVTx83wQIfYQyJ4iOBCkUyVWOHLL49Q"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

const dadosUsuario = {
    mensagem: null
}

// Cria o elemento mensagem com classes dinamicas e as retorna
const criaElementoMensagem = (conteudo, ...classes) => {
    const div = document.createElement("div")
    div.classList.add("mensagem", ...classes)
    div.innerHTML = conteudo
    return div
}

// Gera a resposta do bot usando API do Gemini
const geradorRespostaBot = async (mensagemRecebidaDiv) => {
    const elementoMensagem = mensagemRecebidaDiv.querySelector(".mensagem-texto")

    const buscaOpcoes = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: dadosUsuario.mensagem }]
            }]
        })
    }

    try {
        // busca resposta do bot pela api
        const resposta = await fetch(API_URL, buscaOpcoes)
        const dados = await resposta.json()
        if (!resposta.ok) throw new Error(dados.error.message)

        // extrai e mostra resposta do bot em texto
        const textoRespostaAPI = dados.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1    ").trim()
        elementoMensagem.innerText = textoRespostaAPI
    } catch (error) {
        console.log(error)
        elementoMensagem.innerText = error.message
        elementoMensagem.style.color = '#ff0000'
    } finally {
        mensagemRecebidaDiv.classList.remove("pensando")
        conteudoChatbot.scrollTo({ top: conteudoChatbot.scrollHeight, behavior: "smooth" })
    }
}

// Lida com mensagens enviadas pelo usuario
const handleMensagemEnviada = (e) => {
    e.preventDefault()
    dadosUsuario.mensagem = inputMensagem.value.trim()
    inputMensagem.value = ""

    // Cria e exibe a mensagem do usuario
    const conteudoMensagem = `<div class="mensagem-texto"></div>`
    const mensagemEnviadaDiv = criaElementoMensagem(conteudoMensagem, "usuario-mensagem")
    mensagemEnviadaDiv.querySelector(".mensagem-texto").textContent = dadosUsuario.mensagem
    conteudoChatbot.appendChild(mensagemEnviadaDiv)
    conteudoChatbot.scrollTo({ top: conteudoChatbot.scrollHeight, behavior: "smooth" })

    // Simulando resposta do bot com o indicador de pensamento
    setTimeout(() => {
        const conteudoMensagem = `<img class="chatbot-avatar" src="furia-logo.png" alt="Logo Furia" width="50">
                <div class="mensagem-texto">
                    <div class="indicador-pensando">
                        <div class="ponto"></div>
                        <div class="ponto"></div>
                        <div class="ponto"></div>
                    </div>
                </div>`
        const mensagemRecebidaDiv = criaElementoMensagem(conteudoMensagem, "chatbot-mensagem", "pensando")
        conteudoChatbot.appendChild(mensagemRecebidaDiv)
        conteudoChatbot.scrollTo({ top: conteudoChatbot.scrollHeight, behavior: "smooth" })
        geradorRespostaBot(mensagemRecebidaDiv)
    }, 600)
}

// Mandar mensagem pelo enter
inputMensagem.addEventListener("keydown", (e) => {
    const mensagemUsuario = e.target.value.trim();
    if (e.key === "Enter" && mensagemUsuario) {
        handleMensagemEnviada(e)
    }
})

botaoMandarMensagem.addEventListener("click", (e) => handleMensagemEnviada(e))