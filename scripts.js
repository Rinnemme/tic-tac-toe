const gameBoard = document.getElementById('board')

const player = (name, mark) => {
    return {name,mark}
}

const makePlayer = player

const game = (() => {
    const winConditions = [[1,2,3],[4,5,6],[7,8,9],[1,5,9],[3,5,7],[1,4,7],[2,5,8],[3,6,9]]
    const checkCondition = ([a,b,c]) => {
        if (board.spaces[a].value === player.mark && board.spaces[b].value === player.mark && board.spaces[c].value === player.mark) {
            declareWinner(player)
        }
    }
    const checkWin = () => {
        winConditions.forEach(condition => 
            checkCondition(condition))
    }
    let playerTwoIsBot = false
    let playerOne = {}
    let playerTwo = {}
    let currentPlayer = {}
    const start = () => {
        const playerOneName = document.getElementById("player1-name").value
        const playerOneMark = document.getElementById("player1-mark").value
        const playerTwoName = playerTwoIsBot ? "The bot" : document.getElementById("player2-name").value
        const playerTwoMark = (playerOneMark === "x") ? "o" : "x"
        game.playerOne = player(playerOneName, playerOneMark)
        game.playerTwo = player(playerTwoName, playerTwoMark)
        game.currentPlayer = (Math.floor(Math.random()*2)===0) ? playerOne : playerTwo
        document.getElementById("board").style.display = "grid"
        document.getElementById("starting-ui").style.display = "none"
    }
    document.getElementById("start-button").addEventListener("click",function() {start()})
    return {checkWin, playerOne, playerTwo, currentPlayer}
})()

const board = (() => {
    const spaces = []
    for (let i=1; i<=9; i++) {
        const newSpace = document.createElement("div")
        newSpace.classList.add('space')
        newSpace.setAttribute("id",`space-${i}`)
        gameBoard.appendChild(newSpace)
        const newSpaceObject = {
            name: `space-${i}`,
            value: ""
        }
        spaces.push(newSpaceObject)

    }
    return{spaces}
})()



// 1. Click occurs
// 2. textContent of clicked cell becomes player's mark
// 4. corresponding object in gameBoard array is marked with player's mark
// 3. Game checks for wins
//      8 win conditions checked by === operator checking array values,
//      i.e. function that takes [(1, 2, 3)] -> 
//      if (board[1].value === player.mark &&& board[1].value === player.mark &&& board[1].value === player.mark) display X winner
//      