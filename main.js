'use strict'

const searchInput = document.getElementById("search-input")
const btnSearch = document.getElementById("btn-search")
const cardContainer = document.getElementById("card-container")

async function buscarPersonagem() {
    const termoBusca = searchInput.value.trim()

    if (!termoBusca)
        return false

    try {
        const api = await fetch('https://hp-api.onrender.com/api/characters')
        const dados = await api.json()

        const personagem = dados.find(function(p) {
            return p.name.toLowerCase()
                .includes(termoBusca.toLowerCase())
        })

        if (!personagem) {

        }

        renderizarCard(personagem)
    } catch (error) {
        
    }
}

function renderizarCard (info) {
    const card = document.createElement('div')
    card.classList.add('character-card')

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
            valor: info.house
        },
        {
            label: 'Specie',
            valor: info.species
        },
        {
            label: 'Status',
            valor: info.alive ? 'Alive' : 'Dead'
        },
        {
            label: 'Gender',
            valor: info.gender
        },
        {
            label: 'Patronus',
            valor: info.patronus
        },
        {
            label: 'Date Of Birth',
            valor: info.dateOfBirth
        },
    ]

    campos.forEach(function(campo) {

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
    const wandEl = info.wand
    wandValor.textContent = `${wandEl.wood || '?'} / ${wandEl.core || '?'} / ${`${wandEl.length}"` || '?'}`

    wandSection.append(wandLabel, wandValor)

    const ancestrySection = document.createElement('div')
    ancestrySection.classList.add('info-item')

    const ancestryLabel = document.createElement('span')
    ancestryLabel.classList.add('label')
    ancestryLabel.textContent = 'Ancestry'

    const ancestryValor = document.createElement('p')
    ancestryValor.textContent = info.ancestry || 'Unknown'

    ancestrySection.append(ancestryLabel, ancestryValor)
    extraInfo.append(wandSection, ancestrySection)
}