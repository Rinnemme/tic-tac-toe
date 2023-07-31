const gameBoard = document.getElementById('board')

const Player = (name, mark) => {
    return {name, mark}
}

const board = (() => {
    const boardObjects = []
    for (let i=1; i<=9; i++) {
        const newSpace = document.createElement("div")
        newSpace.classList.add('space')
        newSpace.setAttribute("id",`space-${i}`)
        gameBoard.appendChild(newSpace)
        const newSpaceObject = {
            name: `space-${i}`,
            value: ""
        }
        boardObjects.push(newSpaceObject)

    }
    const winConditions = [[1,2,3],[4,5,6],[7,8,9],[1,5,9],[3,5,7],[1,4,7],[2,5,8],[3,6,9]]
    const checkCondition = ([a,b,c]) => {
        if (boardObjects[a].value === player.mark && boardObjects[b].value === player.mark && boardObjects[c].value === player.mark) {
            declareWinner(player)
        }
    }
    const checkWin = () => {
        winConditions.forEach(condition => 
            checkCondition(condition))
    }
    return{boardObjects, checkWin}
})()



// 1. Click occurs
// 2. textContent of clicked cell becomes player's mark
// 4. corresponding object in gameBoard array is marked with player's mark
// 3. Game checks for wins
//      8 win conditions checked by === operator checking array values,
//      i.e. function that takes [(1, 2, 3)] -> 
//      if (board[1].value === player.mark &&& board[1].value === player.mark &&& board[1].value === player.mark) display X winner
//      