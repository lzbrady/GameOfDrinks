import fire from './fire';

export function createGame(playerName) {
    playerName = "Player 1";
    let gameRef = fire
        .database()
        .ref('games')
        .push();
    gameRef.set({playerName: true})
}