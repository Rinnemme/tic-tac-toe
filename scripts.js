const player = (name, mark) => {
    return {name,mark}
}

const game = (() => {
    const gameMessage = document.getElementById('display-message')
    let playerTwoIsBot = false
    let playerOne
    let playerTwo
    let currentPlayer

    const start = () => {
        const playerOneName = document.getElementById("player1-name").value
        const playerOneMark = document.getElementById("player1-mark").value
        const playerTwoName = playerTwoIsBot ? "The bot" : document.getElementById("player2-name").value
        const playerTwoMark = (playerOneMark === "x") ? "o" : "x"
        playerOne = player(playerOneName, playerOneMark)
        playerTwo = player(playerTwoName, playerTwoMark)
        const decider = Math.floor(Math.random()*2)
        currentPlayer = (decider === 0) ? playerOne : playerTwo
        document.getElementById("board").style.display = "grid"
        document.getElementById("starting-ui").style.display = "none"
        gameMessage.textContent = `${currentPlayer.name}'s up first!`
    }
    document.getElementById("start-button").addEventListener("click", function() {start()})

    const placeMark = (element) => {
        if (gameMessage.textContent === `${currentPlayer.name} wins!`) {return}
        if (element.textContent !== "") {
            gameMessage.textContent = `You can't take a space that's already taken, ${currentPlayer.name}!`
            return
        } 
        element.textContent = `${currentPlayer.mark}`
        board.spaces.forEach(object => {
            if (object.name === element.id) {
                object.mark = currentPlayer.mark
            }
        })
        checkWin()
        if (gameMessage.textContent === `${currentPlayer.name} wins!`) {return}
        checkStalemate()
        if (gameMessage.textContent === `Looks like it's a stalemate!`) {return}
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne
        gameMessage.textContent = `It's ${currentPlayer.name}'s turn`
    }

    const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
    const checkCondition = ([a,b,c]) => {
        if (board.spaces[a].mark === currentPlayer.mark && board.spaces[b].mark === currentPlayer.mark && board.spaces[c].mark === currentPlayer.mark) {
            gameMessage.textContent = `${currentPlayer.name} wins!`
            console.log(`${currentPlayer.name} wins`)
            return
        }
    }
    const checkWin = () => {
        winConditions.forEach(condition => 
            checkCondition(condition))
    }

    const checkStalemate = () => {
        let fullSpaces = 0
        board.spaces.forEach(space => {
            if (space.mark !== "") {
                fullSpaces += 1
            }
        })
        if (fullSpaces === 9) {
            gameMessage.textContent = `Looks like it's a stalemate!`
        }
    }

    return {placeMark}
})()

const board = (() => {
    const spaces = []
    for (let i=1; i<=9; i++) {
        const newSpace = document.createElement("div")
        newSpace.classList.add('space')
        newSpace.setAttribute("id", `space-${i}`)
        newSpace.addEventListener("click", function() {game.placeMark(this)})
        document.getElementById('board').appendChild(newSpace)
        const newSpaceObject = {
            name: `space-${i}`,
            mark: ""
        }
        spaces.push(newSpaceObject)
    }
    return{spaces}
})()