const startGameBtn = document.getElementById('start-game-btn');

const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSORS = "SCISSORS";
const DEFAULT_USER_CHOISE = ROCK;
const RESULT_DRAW = "DRAW";
const RESULT_PLAYER_WINS = "PLAYER_WINS";
const RESULT_COMPUTER_WINS = "COMPUTER_WINS";

let gameIsRunning = false;

const getPlayerChoice = () => {
    let selection = prompt(`${ROCK}, ${PAPER} or ${SCISSORS}?`, "");
    if (selection) {
        selection = selection.toUpperCase();
    }
    if (selection !== ROCK && selection !== PAPER && selection !== SCISSORS) {
        alert(`Invalid choice! We chose ${DEFAULT_USER_CHOISE} for you`);
        return;
    }
    return selection;
}

const getComputerChoice = () => {
    const randomValue = Math.random();
    if (randomValue < 0.34) {
        return ROCK;
    } else if (randomValue < 0.67) {
        return PAPER;
    } else {
        return SCISSORS;
    }
}

const getWinner = (cChoice, pChoice = DEFAULT_USER_CHOISE) =>
    cChoice === pChoice
        ? RESULT_DRAW
        : cChoice === ROCK && pChoice === PAPER ||
            cChoice === PAPER && pChoice === SCISSORS ||
            cChoice === SCISSORS && pChoice === ROCK
            ? RESULT_PLAYER_WINS
            : RESULT_COMPUTER_WINS;
// if (cChoice == pChoice) {
//     return RESULT_DRAW;
// } else if (cChoice === ROCK && pChoice === PAPER || cChoice === PAPER && pChoice === SCISSORS || cChoice === SCISSORS && pChoice === ROCK) {
//     return RESULT_PLAYER_WINS;
// } else {
//     return RESULT_COMPUTER_WINS;
// }

startGameBtn.addEventListener('click', () => {
    if (gameIsRunning) {
        return;
    }
    gameIsRunning = true;
    console.log('Game is starting...');
    const playerChoice = getPlayerChoice();
    const computerChoice = getComputerChoice();
    let winner;
    if (playerChoice) {
        winner = getWinner(computerChoice, playerChoice);
    } else {
        winner = getWinner(computerChoice);
    }
    let message = `You picked up ${playerChoice || DEFAULT_USER_CHOISE}, computer picked up ${computerChoice}, therefore you `;
    if (winner === RESULT_DRAW) {
        message += "had a draw";
    } else if (winner === RESULT_PLAYER_WINS) {
        message += "won.";
    } else {
        message += "lost.";
    }
    alert(message);
});