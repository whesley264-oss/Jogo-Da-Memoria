const emojis = [
  "😀","🐶","🍕","🚗","🌟","🎲",
  "🎸","🎮","🏀","🦄","🍩","🥑",
  "🍔","👾","🚀","🏝️","🧸","🦕",
  "🎯","🎤","🎹","🛸","🎨","🥨"
];
let cards = [];
let firstCard = null, secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let playerScores = [0, 0];
let turn = 0; // 0 = player 1, 1 = player 2

function shuffle(array) {
  for (let i = array.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = "";
  matches = 0;
  moves = 0;
  playerScores = [0, 0];
  turn = Math.random() < 0.5 ? 0 : 1; // Randomiza jogador inicial
  document.getElementById('final-score').style.display = 'none';
  updateScores();
  updateMoves();
  updateTurnIndicator();
  firstCard = secondCard = null;
  lockBoard = false;
  cards = shuffle([...emojis, ...emojis]).map((emoji, i) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.index = i;
    div.dataset.emoji = emoji;
    div.onclick = handleCardClick;
    board.appendChild(div);
    return div;
  });
}

function handleCardClick(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (card.classList.contains('revealed') || card.classList.contains('matched')) return;
  card.classList.add('revealed');
  card.textContent = card.dataset.emoji;
  if (!firstCard) {
    firstCard = card;
  } else if (!secondCard && card !== firstCard) {
    secondCard = card;
    moves++;
    updateMoves();
    lockBoard = true;
    setTimeout(() => {
      checkMatch();
    }, 700);
  }
}

function checkMatch() {
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    playerScores[turn]++;
    matches++;
    updateScores();
    if (matches === emojis.length) {
      showFinalScore();
    } else {
      // Continua o mesmo jogador
      resetTurn(false);
    }
  } else {
    firstCard.classList.remove('revealed');
    firstCard.textContent = "";
    secondCard.classList.remove('revealed');
    secondCard.textContent = "";
    // Passa a vez
    resetTurn(true);
  }
  lockBoard = false;
}

function resetTurn(passTurn) {
  firstCard = null;
  secondCard = null;
  if (passTurn) {
    turn = turn === 0 ? 1 : 0;
    updateTurnIndicator();
  }
}

function updateScores() {
  document.querySelector('#player1 b').textContent = playerScores[0];
  document.querySelector('#player2 b').textContent = playerScores[1];
  document.getElementById('player1').classList.toggle('active', turn === 0);
  document.getElementById('player2').classList.toggle('active', turn === 1);
}

function updateMoves() {
  document.getElementById('moves').textContent = `Movimentos totais: ${moves} | Pares encontrados: ${matches}`;
}

function updateTurnIndicator() {
  document.getElementById('turn-indicator').textContent = `Turno: Jogador ${turn + 1}`;
}

function showFinalScore() {
  document.getElementById('moves').textContent += " | Fim de Jogo! 🎉";
  document.getElementById('final-score').style.display = '';
  let winner;
  if (playerScores[0] > playerScores[1]) winner = "Jogador 1 venceu! 🏆";
  else if (playerScores[1] > playerScores[0]) winner = "Jogador 2 venceu! 🏆";
  else winner = "Empate!";
  document.getElementById('final-score').innerHTML =
    `${winner}<br>Pontuação final:<br>Jogador 1: ${playerScores[0]}<br>Jogador 2: ${playerScores[1]}`;
}

document.getElementById('restart').onclick = createBoard;

createBoard();