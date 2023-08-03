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
    const message = document.getElementById('display-message')
    let playerTwoIsBot = false
    let gameOver = false
    let playerOne = {}
    let playerTwo = {}
    let currentPlayer = {}

    const start = () => {
        const playerOneName = document.getElementById("player1-name").value === "" ? "Player 1" : document.getElementById("player1-name").value
        const playerTwoName = document.getElementById("player2-name").value === "" ? "Player 2" : document.getElementById("player2-name").value
        const playerOneMark = document.getElementById("player1-mark").value
        const playerTwoMark = (playerOneMark === "x") ? "o" : "x"
        playerOne = player(playerOneName, playerOneMark)
        playerTwo = player(playerTwoName, playerTwoMark)
        const firstTurnDecider = Math.floor(Math.random()*2)
        currentPlayer = (firstTurnDecider === 0) ? playerOne : playerTwo
        document.getElementById("board").style.display = "grid"
        document.getElementById("starting-ui").style.display = "none"
        message.textContent = `${currentPlayer.name} is up first!`
        if (playerTwoIsBot) {bot.getMarkValues()}
        if (playerTwoIsBot && currentPlayer === playerTwo) {bot.takeTurn()}
    }
    document.getElementById("start-button").addEventListener("click", function() {start()})
    
    document.getElementById("bot-button").addEventListener("click", function() {
        const playerTwoInput = document.getElementById("player2-name")
        const playerTwoLabel = document.getElementById("player2-label")
        if (!playerTwoIsBot) {
            playerTwoIsBot=true 
            message.textContent = `Player two will be a bot`
            playerTwoLabel.textContent = "Bot's name"
            playerTwoInput.value = "The bot"
            playerTwoInput.setAttribute('readonly', true)
        } else {
            playerTwoIsBot=false 
            message.textContent = `Player two will no longer be a bot`
            playerTwoLabel.textContent = "Player 2's Name"
            playerTwoInput.value = ""
            playerTwoInput.removeAttribute('readonly')
        }
       
       
    })

    const winConditions = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
    
    const checkWinCondition = ([a,b,c]) => {
        if (board.spaces[a].mark === currentPlayer.mark && board.spaces[b].mark === currentPlayer.mark && board.spaces[c].mark === currentPlayer.mark) {
            message.style.backgroundColor = "rgb(0, 0, 0)"
            message.style.color = "rgb(255, 255, 255)"
            message.textContent = `${currentPlayer.name} wins!`
            document.getElementById("restart-button").style.visibility="visible"
            gameOver = true
            return
        }
    }

    const checkWin = () => {
        winConditions.forEach(condition => 
            checkWinCondition(condition))
    }

    const checkStalemate = () => {
        let fullSpaces = 0
        board.spaces.forEach(space => {
            if (space.mark !== "") {
                fullSpaces += 1
            }
        })
        if (fullSpaces === 9) {
            message.style.backgroundColor = "rgb(0, 0, 0)"
            message.style.color = "rgb(255, 255, 255)"
            message.textContent = `Looks like it's a stalemate!`
            document.getElementById("restart-button").style.visibility="visible"
            gameOver = true
        }
    }

    const placeMark = (element) => {
        if (gameOver) {return}
        if (element.textContent !== "") {
            message.textContent = `You can't take a space that's already taken, ${currentPlayer.name}!`
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
        message.textContent = `It's ${currentPlayer.name}'s turn`
        if (playerTwoIsBot && currentPlayer === playerTwo) {bot.takeTurn()}
    }

    const getValues = () => {
        return {playerOne, playerTwo, currentPlayer}
    }

    return {placeMark, getValues, winConditions}
})()

const bot = (() => {
    let botWinConditions = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]]
    const markWinnable = (() => {
        botWinConditions.forEach(condition => {condition.winnable=true})
    })()
    let turnFinished = false
    let botMark
    let playerMark

    const getMarkValues = () => {
        botMark = game.getValues().playerTwo.mark
        playerMark = game.getValues().playerOne.mark
    }

    const filterWinConditions = () => {
        botWinConditions.forEach(condition => {
            condition.forEach(option => {
                if (board.spaces[option].mark === playerMark) {condition.winnable=false}
            })
        })
        botWinConditions = botWinConditions.filter(condition => condition.winnable)
    }

    const checkForWinningMove = () => {
        botWinConditions.forEach(condition => {
            let counter = 0
            condition.forEach(option => {
                if (board.spaces[option].mark === botMark) {
                    counter += 1
                }
            })
            if (counter === 2) {
                condition.forEach(option => {
                    if (board.spaces[option].mark === "") {
                        if (turnFinished) {return}
                        game.placeMark(document.getElementById(`${board.spaces[option].name}`))
                        turnFinished = true
                    }
                })
            }
        })
    }

    const blockPlayerWin = () => {
        game.winConditions.forEach(condition => {
            let counter = 0
            condition.forEach(option => {
                if (board.spaces[option].mark === playerMark) {
                    counter += 1
                }
            })
            if (counter === 2) {
                condition.forEach(option => {
                    if (board.spaces[option].mark === "") {
                        if (turnFinished) {return}
                        game.placeMark(document.getElementById(`${board.spaces[option].name}`))
                        turnFinished = true
                    }
                })
            }
        })
    }

    const placeSecondInARow = () => {
        const oneMarkConditions = []
            botWinConditions.forEach(condition => {
                let counter = 0
                condition.forEach(option => {
                    if (board.spaces[option].mark === botMark) {
                    counter += 1
                    }
                })
                if (counter === 1) {
                    oneMarkConditions.push(condition)
                }
            })
            if (oneMarkConditions.length >= 1) {
                const pickCondition = Math.floor(Math.random()*oneMarkConditions.length)
                oneMarkConditions[pickCondition].forEach(option => {
                    if (board.spaces[option].mark === "") {
                        if (turnFinished) {return}
                        game.placeMark(document.getElementById(`space-${option+1}`))
                        turnFinished=true
                    }
                })
            }
    }

    const placeMarkInEmptyWinCondition = () => {
        if (botWinConditions.length > 0) {
            const pickCondition = Math.floor(Math.random()*botWinConditions.length)
            botWinConditions[pickCondition].forEach(option => {
                if (board.spaces[option].mark === "") {
                    if (turnFinished) {return}
                    game.placeMark(document.getElementById(`${board.spaces[option].name}`))
                    turnFinished=true
                }
            })
        } else return
    }

    const fillBoard = () => {
        board.spaces.forEach(object => {
            if (turnFinished) {return}
            if (object.mark === "") {
                game.placeMark(document.getElementById(`${object.name}`))
                turnFinished = true
            }
        })
    }

    const takeTurn = () => {
        turnFinished = false
        const botMark = game.getValues().playerTwo.mark
        const playerMark = game.getValues().playerOne.mark
        filterWinConditions(playerMark)
        checkForWinningMove(botMark)       
        if (!turnFinished) {blockPlayerWin(playerMark)}
        if (!turnFinished) {placeSecondInARow(botMark)}
        if (!turnFinished) {placeMarkInEmptyWinCondition()}
        if (!turnFinished) {fillBoard()}
    }
    return {takeTurn, getMarkValues}
})()