const player = (name, mark) => {
    return {name,mark}
}

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

const game = (() => {
    const gameMessage = document.getElementById('display-message')
    let playerTwoIsBot = false
    let gameOver = false
    let playerOne = {}
    let playerTwo = {}
    let currentPlayer = {}

    const start = () => {
        const playerOneName = document.getElementById("player1-name").value
        const playerOneMark = document.getElementById("player1-mark").value
        const playerTwoName = document.getElementById("player2-name").value
        const playerTwoMark = (playerOneMark === "x") ? "o" : "x"
        playerOne = player(playerOneName, playerOneMark)
        playerTwo = player(playerTwoName, playerTwoMark)
        const firstTurnDecider = Math.floor(Math.random()*2)
        currentPlayer = (firstTurnDecider === 0) ? playerOne : playerTwo
        document.getElementById("board").style.display = "grid"
        document.getElementById("starting-ui").style.display = "none"
        gameMessage.textContent = `${currentPlayer.name}'s up first!`
        if (playerTwoIsBot && currentPlayer === playerTwo) {bot.takeTurn()}
    }
    document.getElementById("start-button").addEventListener("click", function() {start()})
    
    document.getElementById("bot-button").addEventListener("click", function() {
        if (!playerTwoIsBot) {
            playerTwoIsBot=true 
            gameMessage.textContent = `Player two will be a bot`
            document.getElementById("player2-name").value = "The bot"
            document.getElementById("player2-label").textContent = "Bot's name"
        } else {
            playerTwoIsBot=false 
            gameMessage.textContent = `Player two will no longer be a bot`
            document.getElementById("player2-name").value = ""
            document.getElementById("player2-label").textContent = "Player 2's Name"
        }
       
       
    })

    const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
    const checkCondition = ([a,b,c]) => {
        if (board.spaces[a].mark === currentPlayer.mark && board.spaces[b].mark === currentPlayer.mark && board.spaces[c].mark === currentPlayer.mark) {
            gameMessage.textContent = `${currentPlayer.name} wins!`
            gameOver = true
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
            gameOver = true
        }
    }

    const placeMark = (element) => {
        if (gameOver) {return}
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
        checkStalemate()
        if (gameOver) {return}
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne
        gameMessage.textContent = `It's ${currentPlayer.name}'s turn`
        if (playerTwoIsBot && currentPlayer === playerTwo) {bot.takeTurn()}
    }

    const getValues = () => {
        return {playerOne, playerTwo, currentPlayer}
    }

    return {placeMark, getValues, winConditions}
})()

const bot = (() => {
    const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
    const markWinnable = (() => {
        winConditions.forEach(condition => {condition.winnable=true})
    })()

    const takeTurn = () => {
        let turnFinished = false
        winConditions.forEach(condition => {
            condition.forEach(option => {
                if (board.spaces[option].mark === game.getValues().playerOne.mark) {condition.winnable=false}
            })
        })
        winConditions.filter(condition => condition.winnable)
        // Add 'win if 2 of me in a row' before blocking
        game.winConditions.forEach(condition => {
            let counter = 0
            condition.forEach(option => {
                if (board.spaces[option].mark === game.getValues().playerOne.mark) {
                    counter += 1
                }
            })
            if (counter === 2) {
                condition.forEach(option => {
                    if (board.spaces[option].mark === "") {
                        if (turnFinished) {return}
                        game.placeMark(document.getElementById(`space-${option+1}`))
                        turnFinished = true
                    }
                })
            }
        })
        // Add 'place in a row where there's one of me before random placement on an open wincondition logic
        if (turnFinished) {return}
        const pickCondition = Math.floor(Math.random()*winConditions.length)
        winConditions[pickCondition].forEach(option => {
            if (board.spaces[option].mark === "") {
                if (turnFinished) {return}
                game.placeMark(document.getElementById(`space-${option+1}`))
                turnFinished=true
            }
        })
        if (!turnFinished) {
            board.spaces.forEach(object => {
                if (turnFinished) {return}
                if (object.mark === "") {
                game.placeMark(document.getElementById(`${object.name}`))
                }
                turnFinished = true
            })
        }
    }

    return {markWinnable, takeTurn}
})()