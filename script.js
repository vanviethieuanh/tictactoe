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
  [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const scoreLabel = document.querySelector('#score')

let score = [0,0]
let isEndGame = false
let currentWinCombination
let circleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
  isEndGame = false
  currentWinCombination = undefined
  circleTurn = false
  cellElements.forEach(e => e.innerHTML = null)
  
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  winningMessageElement.classList.remove('show')
}

function handleClick(e) {
  if(isEndGame)
    return
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
    console.log(score);
  }
  scoreLabel.innerHTML = `${score[0]} - ${score[1]}`
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.innerHTML = `
        <img src="${currentClass}.svg" class="mark">
      `
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
  return WINNING_COMBINATIONS.some(combination => {
    const result = combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })

    if(result){
      currentWinCombination = combination
      console.log(currentWinCombination);
    }

    return result
  })
}

function showWinningCombination(){
  cellElements.forEach((element, index) =>{
    if(currentWinCombination.includes(index)){
      element.innerHTML += `
      <img src="${element.classList[1]}.svg" class="mark glow">
    `
    }
  })
}

function allGlow(){
  cellElements.forEach(element => {
    if (element.classList.length > 1)
      element.innerHTML += `
    <img src="${element.classList[1]}.svg" class="mark glow">
  `
  })
}