const X_VECTOR = `
<svg class="mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path class="mark-x" fill-rule="evenodd" clip-rule="evenodd"
d="M1.82843 24.1716C0.266336 25.7337 0.266336 28.2663 1.82843 29.8284C3.39053 31.3905 5.92319 31.3905 7.48529 29.8284L15.8284 21.4853L24.4558 30.1127C26.0179 31.6748 28.5506 31.6748 30.1127 30.1127C31.6748 28.5506 31.6748 26.0179 30.1127 24.4558L21.4853 15.8284L30.1127 7.201C31.6748 5.6389 31.6748 3.10624 30.1127 1.54415C28.5506 -0.0179507 26.0179 -0.0179501 24.4558 1.54415L15.8284 10.1716L7.48529 1.82843C5.92319 0.266332 3.39053 0.266332 1.82843 1.82843C0.266336 3.39053 0.266337 5.92319 1.82843 7.48528L10.1716 15.8284L1.82843 24.1716Z"
fill="url(#color_x)" />
</svg>
`

const X_VECTOR_GLOW = `
<svg class="mark glow" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path class="mark-x" fill-rule="evenodd" clip-rule="evenodd"
d="M1.82843 24.1716C0.266336 25.7337 0.266336 28.2663 1.82843 29.8284C3.39053 31.3905 5.92319 31.3905 7.48529 29.8284L15.8284 21.4853L24.4558 30.1127C26.0179 31.6748 28.5506 31.6748 30.1127 30.1127C31.6748 28.5506 31.6748 26.0179 30.1127 24.4558L21.4853 15.8284L30.1127 7.201C31.6748 5.6389 31.6748 3.10624 30.1127 1.54415C28.5506 -0.0179507 26.0179 -0.0179501 24.4558 1.54415L15.8284 10.1716L7.48529 1.82843C5.92319 0.266332 3.39053 0.266332 1.82843 1.82843C0.266336 3.39053 0.266337 5.92319 1.82843 7.48528L10.1716 15.8284L1.82843 24.1716Z"
fill="url(#color_x)" />
</svg>
`

const O_VECTOR = `
<svg class="mark" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle class="mark-o" cx="15.5" cy="15.5" r="11.5" stroke="url(#color_o)" stroke-width="8" />
</svg>
`

const O_VECTOR_GLOW = `
<svg class="mark glow" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle class="mark-o" cx="15.5" cy="15.5" r="11.5" stroke="url(#color_o)" stroke-width="8" />
</svg>
`

const COLOR_THEMES = [
    {
        title: 'Strawberry',
        O: ['02AAB0', '00CDAC'],
        X: ['EB3349', 'F45C43'],
        lightTheme: true,
    },
    {
        title: 'Lollipop',
        O: ['FF9A8B', 'FF6A88', 'FF99AC'],
        X: ['8BC6EC', '8EC5FC'],
        lightTheme: true,
    },
    {
        title: 'Milky Way',
        O: ['AC32E4', '7918F2', '4801FF'],
        X: ['fbd72b', 'f9484a'],
        lightTheme: false,
    },
    {
        title: 'The Starry Night',
        O: ['FDEB71', 'F8D800'],
        X: ['72EDF2', '5151E5'],
        lightTheme: false,
    },
    {
        title: 'Nature',
        O: ['4facfe', '00f2fe'],
        X: ['6a11cb', '2575fc'],
        lightTheme: false,
    },
    {
        title: 'Snow Country',
        O: ['e6e9f0', 'eef1f5'],
        X: ['accbee', 'e7f0fd'],
        lightTheme: false,
    },
    {
        title: 'Neon',
        O: ['b000ff', 'fd00ff'],
        X: ['04C4D9', '05F2F2'],
        lightTheme: false,
    },
]

const X_CLASS = 'x'
const CIRCLE_CLASS = 'o'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector(
    '[data-winning-message-text]'
)
const scoreLabel = document.querySelector('#score')

let score = [0, 0]
let isEndGame = false
let currentWinCombination
let circleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
    isEndGame = false
    currentWinCombination = undefined
    circleTurn = false
    cellElements.forEach((e) => (e.innerHTML = null))

    cellElements.forEach((cell) => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

function handleClick(e) {
    if (isEndGame) return
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWin(currentClass)) {
        endGame(false)
    } else if (isDraw()) {
        endGame(true)
    } else {
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw) {
    isEndGame = true

    if (draw) {
        allGlow()
    } else {
        showWinningCombination()
        !circleTurn ? score[0]++ : score[1]++
        console.log(score)
    }
    scoreLabel.innerHTML = `${score[0]} - ${score[1]}`
}

function isDraw() {
    return [...cellElements].every((cell) => {
        return (
            cell.classList.contains(X_CLASS) ||
            cell.classList.contains(CIRCLE_CLASS)
        )
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
    cell.innerHTML = currentClass == 'o' ? O_VECTOR : X_VECTOR
}

function swapTurns() {
    circleTurn = !circleTurn
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some((combination) => {
        const result = combination.every((index) => {
            return cellElements[index].classList.contains(currentClass)
        })

        if (result) {
            currentWinCombination = combination
            console.log(currentWinCombination)
        }

        return result
    })
}

function showWinningCombination() {
    cellElements.forEach((element, index) => {
        if (currentWinCombination.includes(index)) {
            element.innerHTML +=
                element.classList[1] == 'x' ? X_VECTOR_GLOW : O_VECTOR_GLOW
        }
    })
}

function allGlow() {
    cellElements.forEach((element) => {
        if (element.classList.length > 1)
            element.innerHTML +=
                element.classList[1] == 'x' ? X_VECTOR_GLOW : O_VECTOR_GLOW
    })
}

function SetTheme(theme) {
    document.querySelector('.themes>p').innerHTML = theme.title
    document.querySelector('body').className = theme.lightTheme
        ? 'light'
        : 'dark'

    xStops = ''
    theme.X.forEach((color, index) => {
        xStops += `<stop offset="${index}" stop-color="#${color}" />`
    })
    document.querySelector('linearGradient#color_x').innerHTML = xStops

    oStops = ''
    theme.O.forEach((color, index) => {
        oStops += `<stop offset="${index}" stop-color="#${color}" />`
    })
    document.querySelector('linearGradient#color_o').innerHTML = oStops
}

let currentTheme = 0

function NextTheme() {
    currentTheme++
    if (currentTheme >= COLOR_THEMES.length) currentTheme = 0
    SetTheme(COLOR_THEMES[currentTheme])
}

document
    .querySelector('svg#bg')
    .setAttribute(
        'viewBox',
        `0 0 ${window.innerWidth / 10} ${window.innerHeight / 10}`
    )
