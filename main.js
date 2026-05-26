'use strict'

const searchInput = document.getElementById("search-input")
const btnSearch = document.getElementById("btn-search")
const cardContainer = document.getElementById("card-container")
const btnRandom = document.getElementById("btn-random")
const overlay = document.getElementById('overlay')
const autocompleteList = document.getElementById('autocomplete-list')

let allCharacters = []

async function buscarApi() {
    if (allCharacters.length)
        return allCharacters

    const api = await fetch('https://hp-api.onrender.com/api/characters')
    allCharacters = await api.json()
    return allCharacters
}

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

        }

        renderizarCard(personagem)
    } catch (error) {

    }
}

function renderizarCard(info) {
    if (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild)
    }

    const card = document.createElement('div')
    card.classList.add('character-card')

    const coresCasas = {
        GRYFFINDOR: '',
        SLYTHERIN: '#',
        RAVENCLAW: '#',
        HUFFLEPUFF: '#'
    }

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

    card.append(imagem, nome, cardInfo, extraInfo)
    cardContainer.appendChild(card)

    overlay.classList.add('active')
}

btnSearch.addEventListener('click', buscarPersonagem)

// Escuta o clique no fundo desfocado (overlay)
overlay.addEventListener('click', () => {
    // Procura se existe um card com a classe '.character-card'
    const cardExistente = cardContainer.querySelector('.character-card')

    if (cardExistente)
        cardExistente.remove()

    // Remove a classe 'active' do overlay
    // Isso faz o fundo desfocado desaparecer
    overlay.classList.remove('active')
})

btnRandom.addEventListener('click', async () => {
    const api = await buscarApi()

    const personagensFiltrados = api.filter(personagem => personagem.image)
    const indiceAleatorio = Math.floor(Math.random() * personagensFiltrados.length)

    const personagemAleatorio = personagensFiltrados[indiceAleatorio]

    renderizarCard(personagemAleatorio)
})

searchInput.addEventListener('keydown', function (enter) {
    if (enter.key === 'Enter')
        buscarPersonagem()
})

searchInput.addEventListener('input', async () => {
    autocompleteList.replaceChildren()

    const termo = searchInput.value.trim().toLowerCase()

    if (!termo) return

    const personagens = await buscarApi()

    const resultados = personagens.filter(personagem =>
        personagem.name.toLowerCase().startsWith(termo)
    ).slice(0, 5)

    resultados.forEach(personagem => {
        const item = document.createElement('div')
        item.classList.add('autocomplete-item')
        item.textContent = personagem.name

        item.addEventListener('click', () => {
            searchInput.value = ""
            autocompleteList.replaceChildren()
            renderizarCard(personagem)
        })

        autocompleteList.appendChild(item)
    })
})