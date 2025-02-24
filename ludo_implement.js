/** Esta seção define um tipo de objeto 'Piece' que representa 
 * uma peça no jogo com uma propriedade de posição. */

/** @typedef {Object} Piece
 *  @property {number} position
 */

/** Aqui é definido o tipo 'Player', que representa um jogador com nome, peças, número de jogadas 
 * consecutivas e se já rolou um 6. */
/** @typedef {Object} Player
 *  @property {string} name
 *  @property {Piece[]} pieces
 *  @property {number} consecutiveRolls
 *  @property {boolean} hasRolledSix
 */

/** Lista de jogadores, cada um começando com quatro peças na posição inicial (0) e sem ter rolado um 6. */
/** @type {Player[]} */
let players = [
  { name: "Jogador 1", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0, hasRolledSix: false },
  { name: "Jogador 2", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0, hasRolledSix: false },
  { name: "Jogador 3", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0, hasRolledSix: false },
  { name: "Jogador 4", pieces: [{ position: 0 }, { position: 0 }, { position: 0 }, { position: 0 }], consecutiveRolls: 0, hasRolledSix: false }
];

let currentPlayerIndex = 0;
const outputDiv = document.getElementById("output");

/** Função que exibe mensagens na tela e mantém a rolagem para a última mensagem. */
function printToScreen(message) {
  outputDiv.innerHTML += message + "<br>";
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

/** Simula o lançamento de um dado, retornando um número aleatório entre 1 e 6. */
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

/** Gerencia o movimento das peças conforme as regras do jogo, incluindo capturas e saída da base com um 6. */
function movePiece(player, pieceIndex) {
  const dice = rollDice();
  printToScreen(`${player.name} rolou ${dice}.`);

  /** Se o jogador rolar um 6, ele pode sair da base ou continuar movendo suas peças, dependendo da regra aplicada. */
  if (dice === 6) {
    player.hasRolledSix = true;
  }

  const hasPieceOutside = player.pieces.some(piece => piece.position > 0 && piece.position < 20);
  const hasPieceInBase = player.pieces.some(piece => piece.position === 0);

  if (dice === 6 && hasPieceInBase && (!hasPieceOutside || confirm(`${player.name} rolou 6! Deseja tirar uma peça da base? (OK para tirar, Cancelar para mover uma peça já em jogo)`))) {
    pieceIndex = player.pieces.findIndex(piece => piece.position === 0);
  } else {
    pieceIndex = player.pieces.findIndex(piece => piece.position > 0 && piece.position < 20);
  }

  let piece = player.pieces[pieceIndex];
  if (!piece || piece.position >= 20) {
    printToScreen(`${player.name} não pode mover nenhuma peça válida.`);
    player.consecutiveRolls = 0;
    switchPlayer();
    return;
  }

  if (piece.position === 0) {
    if (dice === 6 || player.hasRolledSix) {
      piece.position = 1;
      printToScreen(`${player.name} rolou ${dice} e a peça ${pieceIndex + 1} saiu da base para a posição: ${piece.position}`);
    } else {
      printToScreen(`${player.name} precisa rolar um 6 primeiro para tirar uma peça da base.`);
    }
  } else {
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

/** Passa o turno para o próximo jogador na lista. */
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
    player.hasRolledSix = false;
  });
  currentPlayerIndex = 0;
  printToScreen("Jogo reiniciado!");
}

document.getElementById("playTurnBtn").addEventListener("click", playTurn);
