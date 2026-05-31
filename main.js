'use strict'

//Chamar IDs dos elementos HTML
const searchInput = document.getElementById("search-input")
const btnSearch = document.getElementById("btn-search")
const cardContainer = document.getElementById("card-container")
const btnRandom = document.getElementById("btn-random")
const overlay = document.getElementById('overlay')
const autocompleteList = document.getElementById('autocomplete-list')

//Variável para armazenar os personagens buscados da API
let allCharacters = []

//Função para buscar os personagens da API
async function buscarApi() {
    if (allCharacters.length)
        return allCharacters

    const api = await fetch('https://hp-api.onrender.com/api/characters')
    allCharacters = await api.json()
    return allCharacters
}

//Função para buscar o personagem digitado no input
async function buscarPersonagem() {
    const termoBusca = searchInput.value.trim()

    if (!termoBusca)
        return false

    try {
        const dados = await buscarApi()

        const personagem = dados.find(function (p) {
            return p.name.toUpperCase()
                .includes(termoBusca.toUpperCase())
        })

        if (!personagem) {
            renderizarErro(`Personagem não encontrado: “${termoBusca}”`)
            return
        }

        renderizarCard(personagem)
    } catch (error) {
        renderizarErro('Erro ao buscar o personagem. Tente novamente mais tarde.')
    }
}

//Função para renderizar uma mensagem de erro
function renderizarErro(message) {
    //Remove o card existente, se houver
    if (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild)
    }

    const errorCard = document.createElement('div')
    errorCard.classList.add('character-card', 'error-card')

    const errorTitle = document.createElement('h2')
    errorTitle.textContent = 'Ops!'

    const errorMessage = document.createElement('p')
    errorMessage.textContent = message
    errorMessage.classList.add('error-message')

    errorCard.append(errorTitle, errorMessage)
    cardContainer.appendChild(errorCard)

    overlay.classList.add('active')
}

//Função para renderizar o card do personagem
function renderizarCard(info) {
    if (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild)
    }

    const card = document.createElement('div')
    card.classList.add('character-card')

    const casa = info.house?.toLowerCase()

    if (casa) {
        card.classList.add(casa)
    } else {
        card.classList.add('default-house')
    }

    const imagem = document.createElement('img')
    imagem.src = info.image || 'Unknown'
    imagem.alt = info.name
    imagem.classList.add('character-image')

    if (casa) {
        imagem.classList.add(casa)
    } else {
        imagem.classList.add('default-house')
    }

    const nome = document.createElement('h2')
    nome.textContent = info.name

    const cardInfo = document.createElement('div')
    cardInfo.classList.add('card-info')

    const campos = [
        {
            label: 'House',
            valor: info.house?.toUpperCase()
        },
        {
            label: 'Specie',
            valor: info.species?.toUpperCase()
        },
        {
            label: 'Status',
            valor: info.alive ? 'ALIVE' : 'DEAD'
        },
        {
            label: 'Gender',
            valor: info.gender?.toUpperCase()
        },
        {
            label: 'Patronus',
            valor: info.patronus?.toUpperCase()
        },
        {
            label: 'Date Of Birth',
            valor: info.dateOfBirth?.toUpperCase()
        },
    ]
    campos.forEach(function (campo) {

        const item = document.createElement('div')
        item.classList.add('info-item')

        const labelEl = document.createElement('span')
        labelEl.classList.add('label')
        labelEl.textContent = campo.label

        if (casa) {
            labelEl.classList.add(casa)
        } else {
            labelEl.classList.add('default-house')
        }

        const valorEl = document.createElement('p')
        valorEl.textContent = campo.valor || 'Unknown'

        item.appendChild(labelEl)
        item.appendChild(valorEl)
        cardInfo.appendChild(item)

    })

    const extraInfo = document.createElement('div')
    extraInfo.classList.add('extra-info')

    const wandSection = document.createElement('div')
    wandSection.classList.add('wand-section')

    const wandLabel = document.createElement('span')
    wandLabel.classList.add('label')
    wandLabel.textContent = 'Wand'

    const wandValor = document.createElement('p')
    const wandEl = info.wand || 'Unknown'
    wandValor.textContent = `${wandEl.wood?.toUpperCase() || '?'} / ${wandEl.core?.toUpperCase() || '?'} / ${`${wandEl.length}"` || '?'}`

    wandSection.append(wandLabel, wandValor)

    const ancestrySection = document.createElement('div')
    ancestrySection.classList.add('info-item')

    const ancestryLabel = document.createElement('span')
    ancestryLabel.classList.add('label')
    ancestryLabel.textContent = 'Ancestry'

    const ancestryValor = document.createElement('p')
    ancestryValor.textContent = info.ancestry.toUpperCase() || 'Unknown'

    ancestrySection.append(ancestryLabel, ancestryValor)
    extraInfo.append(wandSection, ancestrySection)

    if (casa) {
        wandLabel.classList.add(casa)
        ancestryLabel.classList.add(casa)
    } else {
        wandLabel.classList.add('default-house')
        ancestryLabel.classList.add('default-house')
    }

    card.append(imagem, nome, cardInfo, extraInfo)
    cardContainer.appendChild(card)

    overlay.classList.add('active')
}

btnSearch.addEventListener('click', buscarPersonagem)

// Escuta o clique no fundo desfocado (overlay)
overlay.addEventListener('click', function () {
    // Procura se existe um card com a classe '.character-card'
    const cardExistente = cardContainer.querySelector('.character-card')

    if (cardExistente)
        cardExistente.remove()

    // Remove a classe 'active' do overlay
    // Isso faz o fundo desfocado desaparecer
    overlay.classList.remove('active')
})

//Botão para sortear um personagem aleatório
btnRandom.addEventListener('click', async function () {
    const api = await buscarApi()

    //Filtra os personagens que possuem imagem para evitar mostrar um card sem foto
    const personagensFiltrados = api.filter(personagem => personagem.image)
    const indiceAleatorio = Math.floor(Math.random() * personagensFiltrados.length)

    const personagemAleatorio = personagensFiltrados[indiceAleatorio]

    renderizarCard(personagemAleatorio)
})

//Busca o personagem ao pressionar Enter no input de busca
searchInput.addEventListener('keydown', function (enter) {
    if (enter.key === 'Enter') {
        //Previne o comportamento padrão do Enter, que é enviar um formulário ou adicionar uma nova linha
        enter.preventDefault()
        buscarPersonagem()
        //Fecha o teclado virtual em dispositivos móveis e limpa o input de busca
        searchInput.blur()
        searchInput.value = ""
        autocompleteList.replaceChildren()
    }
})

//Função para mostrar sugestões de personagens enquanto o usuário digita no input
searchInput.addEventListener('input', async function () {
    autocompleteList.replaceChildren()

    const termo = searchInput.value.trim().toLowerCase()

    if (!termo) return

    const personagens = await buscarApi()

    //Filtra os personagens cujos nomes começam com o termo digitado, limitando a 5 resultados
    const resultados = personagens.filter(personagem =>
        personagem.name.toLowerCase().startsWith(termo)
    ).slice(0, 5)

    resultados.forEach(function (personagem) {
        const item = document.createElement('div')
        item.classList.add('autocomplete-item')
        item.textContent = personagem.name

        item.addEventListener('click', function () {
            searchInput.value = ""
            autocompleteList.replaceChildren()
            renderizarCard(personagem)
        })

        //Adiciona o item de sugestão à lista de autocomplete
        autocompleteList.appendChild(item)
    })
})