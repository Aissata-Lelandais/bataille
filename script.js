const suits = ["HEARTS", "SPADES", "DIAMONDS", "CLUBS"];

let playerOne = {};  // Joueur 1
let playerTwo = {}; // Joueur 2
let cards1 = []; //Cartes actuelles du joueur 1
let cards2 = []; //Cartes actuelles du joueur 2
let cards = [];
let pot = {};

const getAllCards = () => {
  $.ajax({url: "http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2", method: "GET"}).done(function (data) {
    drawCards(data.deck_id);
  });
};

const drawCards = deck_id => {
  $.ajax({
    url: "http://deckofcardsapi.com/api/deck/" + deck_id + "/draw/?count=52",
    method: "GET"
  }).done(function (data) {
    hands(data);
  });
};

const hands = deck => {
  var p1Hand = [];
  var p2Hand = [];

  for (let i = 0; i < 52; i++) {
    cards = deck.cards;
    let card = cards[i];
    card.score =addScore(card);
    if (i % 2 === 0) {
      p1Hand.push(card);
    } else {
      p2Hand.push(card);
    }
  }
  playerOne.cards = p1Hand;
  playerTwo.cards = p2Hand;
  showPlayersCards(p1Hand, p2Hand);
  checkForWinner(playerOne, playerTwo, 1, playRound);
};

const addScore = (card) => {
    for (let i=0; i < 4; i++){
        if(suits[i] === card.suit) {
            return i + 4;
        }
    }
}

//DÉFINIR LA FONCTION DU GAGNANT POUR COLLECTER LES CARTES
let collectCards = (card1, card2, player) => {
    
    pot.cards = card1.concat(card2)
    shuffleDeck()

    for (let i=0; i < pot.cards.length; i++){
        player.cards.push(pot.cards[i])
    } 
}

let showPlayersCards = (player1, player2) => {
    player1.forEach((p, i) => {
        let img = document.createElement('img');
        img.src = p.image;
        img.style.position = "absolute";
        img.style.left = 30 + i * 2 + "px";
        document.getElementById('player1Cards').appendChild(img);
    });

    player2.forEach((p, i) => {
        let img = document.createElement('img');
        img.src = p.image;
        img.style.position = "absolute";
        img.style.left = 460 + i * 2 + "px";
        document.getElementById('player2Cards').appendChild(img);
    });
}

// DÉFINIR LA FONCTION POUR MÉLANGER (RANDOMISER) LE JEU DE CARTES.
shuffleDeck = () => {
    for(let i = cards.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = cards[i]
        cards[i] = cards[j]
        cards[j] = temp
    }
} 

//DÉFINIR LA FONCTION POUR VÉRIFIER UN GAGNANT
const checkForWinner = (player1, player2, winTotal, runRound) => {
  if (player2.cards.length < winTotal) {
    document.getElementById('score').innerHTML = "Jeu terminé! Le joueur 1 à gagné ! Cliquez sur NOUVELLE PARTIE ! pour jouer à nouveau.";
    resetGame();
  } else if (player1.cards.length < winTotal) {
    document.getElementById('score').innerHTML = "Jeu terminé! Le joueur 2 à gagné ! Cliquez sur NOUVELLE PARTIE ! pour jouer à nouveau.";
    resetGame();
  } else {
    runRound(player1, player2);
  }
};

//DÉFINIR LA FONCTION POUR COMPARER LES CARTES
const compareCard = (card1, player1, card2, player2, position) => {
  if (card1[position].score > card2[position].score) {
    collectCards(card1, card2, player1);

    checkForWinner(player1, player2, 1, playRound);
  } else if (card1[position].score < card2[position].score) {
    collectCards(card1, card2, player2);


    checkForWinner(player1, player2, 1, playRound);
  } else {
    checkForWinner(player1, player2, 5, war);
  }
};

//DÉFINIR LA FONCTION POUR JOUER UN ROUND.
const playRound = (player1, player2) => {
  cards1 = player1.cards.splice(0, 1);

  cards2 = player2.cards.splice(0, 1);

  compareCard(cards1, player1, cards2, player2, 0);
};

//DÉFINIR LA FONCTION POUR LA BATAILLE
const war = (player1, player2) => {
  cards1 = cards1.concat(player1.cards.splice(0, 4));

  cards2 = cards2.concat(player2.cards.splice(0, 4));

  let position = cards1.length - 1;

  compareCard(cards1, player1, cards2, player2, position);
};

//DÉFINIR LA FONCTION POUR RÉINITIALISER LE JEU
const resetGame = () => {
  //deck = []
  playerOne.cards = [];
  playerTwo.cards = [];
};

$(document).ready(function () {

  $("#fight").on("click", function (event) {
    getAllCards();
    $("#fight").hide();
    $("#container").hide();
    $("#regles").hide();
    $("#retour").show();
    $("#nouveau").show();
    $("#player1Cards").show();
    $("#player2Cards").show();
    $("#score").show();
  });

  $("#retour").on("click", function (event) {
    $("#fight").show();
    $("#container").show();
    $("#regles").show();
    $("#retour").hide();
    $("#nouveau").hide();
    $("#player1Cards").hide();
    $("#player2Cards").hide();
    $("#score").hide();
  });

  $("#nouveau").on("click", function (event) {
    getAllCards();
  });

});