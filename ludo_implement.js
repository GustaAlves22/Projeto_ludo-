/** @typedef {Object} Piece
 *  @property {number} position
 */

/** @typedef {Object} Player
 *  @property {string} name
 *  @property {Piece[]} pieces
 *  @property {number} consecutiveRolls
 */

/** @type {Player[]} */
let players = [
  { name: "Jogador 1", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0 },
  { name: "Jogador 2", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0 },
  { name: "Jogador 3", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0 },
  { name: "Jogador 4", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0 }
];

let currentPlayerIndex = 0;
const outputDiv = document.getElementById("output");

function printToScreen(message) {
  outputDiv.innerHTML += message + "<br>";
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function movePiece(player, pieceIndex) {
  const dice = rollDice();
  printToScreen(`${player.name} rolou ${dice}.`);
  
  let piece = player.pieces[pieceIndex];
  let validMove = false;

  for (let i = 0; i < player.pieces.length; i++) {
    piece = player.pieces[i];
    if (piece.position < 20) {
      pieceIndex = i;
      validMove = true;
      break;
    }
  }

  if (!validMove) {
    printToScreen(`${player.name} não pode mover nenhuma peça, pois todas já estão na posição 20.`);
    player.consecutiveRolls = 0;
    switchPlayer();
    return;
  }

  if (piece.position === 0 && dice === 6) {
    piece.position = 1;
    printToScreen(`${player.name} rolou ${dice} e a peça ${pieceIndex + 1} saiu da base para a posição: ${piece.position}`);
  } else if (piece.position > 0) {
    piece.position += dice;
    if (piece.position > 20) {
      piece.position = 20;
    }
    
    const occupiedPlayer = players.find(otherPlayer => 
      otherPlayer !== player && 
      otherPlayer.pieces.some(otherPiece => otherPiece.position === piece.position && otherPiece.position !== 20)
    );
    
    if (occupiedPlayer) {
      const otherPiece = occupiedPlayer.pieces.find(p => p.position === piece.position);
      printToScreen(`${player.name} rolou ${dice} e capturou a peça de ${occupiedPlayer.name}. A peça retorna para a base.`);
      otherPiece.position = 0;
    }

    printToScreen(`${player.name} rolou ${dice} e a peça ${pieceIndex + 1} está na posição: ${piece.position}`);
  }

  if (player.pieces.every(piece => piece.position === 20)) {
    printToScreen(`${player.name} venceu! Todas as suas peças chegaram à posição 20!`);
    resetGame();
    return;
  }

  if (dice === 6) {
    player.consecutiveRolls++;
    if (player.consecutiveRolls < 3) {
      printToScreen(`${player.name} rolou 6 e pode jogar novamente! (${player.consecutiveRolls}/3)`);
      return;
    } else {
      printToScreen(`${player.name} rolou 6 três vezes consecutivas e perdeu a vez!`);
    }
  }
  
  player.consecutiveRolls = 0;
  switchPlayer();
}

function switchPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}

function playTurn() {
  const player = players[currentPlayerIndex];
  movePiece(player, Math.floor(Math.random() * 4));
}

function resetGame() {
  players.forEach(player => {
    player.pieces.forEach(piece => piece.position = 0);
    player.consecutiveRolls = 0;
  });
  currentPlayerIndex = 0;
  printToScreen("Jogo reiniciado!");
}

document.getElementById("playTurnBtn").addEventListener("click", playTurn);
