let blackjackGame = {
    'you': {
        'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0
    },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const you = blackjackGame['you'];
const dealer = blackjackGame['dealer'];

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {

    if (blackjackGame['isStand'] === false) {

        let card = randomCard();
        showCard(card, you);
        updateScore(card, you);
        showScore(you);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }

}

function blackjackDeal() {

    if (blackjackGame['turnsOver'] === true) {

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');

        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        you['score'] = 0;
        dealer['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#your-blackjack-result').style.color = '#fff';
        document.querySelector('#dealer-blackjack-result').style.color = '#fff';

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = true;
    }

}

function updateScore(card, activePlayer) {

    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
    // If adding 11 keeps me below 21, add 11, otherwise add 1

}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = "red";
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (dealer['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, dealer);
        updateScore(card, dealer);
        showScore(dealer);
        await sleep(1000);
    }

    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

// compute winner and return who won
// updates the wins/draws/losses

function computeWinner() {
    let winner;

    if (you['score'] <= 21) {
        // condition: higer score that dealer or when deal busts 

        if (you['score'] > dealer['score'] || (dealer['score'] > 21)) {
            blackjackGame['wins']++;
            winner = you;

        } else if (you['score'] < dealer['score']) {
            blackjackGame['losses']++;
            winner = dealer;
        }
        else if (you['score'] === dealer['score']) {
            blackjackGame['draws']++;
        }
        // condtion: when user busts but dealer doesn't
    } else if (you['score'] > 21 && dealer['score'] <= 21) {
        blackjackGame['losses']++;
        winner = dealer;

        //condition: whey you and the dealer busts
    } else if (you['score'] > 21 && dealer['score'] > 21) {
        blackjackGame['draws']++;
    }

    console.log(blackjackGame);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner === you) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = "You won";
            messageColor = "green";
            winSound.play();
        }
        else if (winner === dealer) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = "You lost";
            messageColor = "red";
            lossSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = "You drew";
            messageColor = "black";
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}