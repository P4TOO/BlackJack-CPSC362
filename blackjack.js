
var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;   //A, 2 -> 11 + 2 + 10

var hidden;
var deck;

var canHit = true;      //allows player (you) to draw while yourSum <= 21

window.onload = function(){
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck(){
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++){
        for (let j = 0; j < values.length; j++){
            deck.push(values[j] + "-" + types[i]);  //A-C -> K-C, A-D -> K-D
        }
    }
    console.log(deck);
}

function shuffleDeck(){
    for (let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 -> (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame(){
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log(dealerAceCount);

    //<img src="./cards/4-C.png"
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
    console.log(dealerAceCount);


    for (let i = 0; i < 2; i++){
        //<img src="./cards/4-C.png"
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "/cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);  
    }
    console.log(yourAceCount);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function stay(){
    while (dealerSum < 17){
        //<img src="./cards/4-C.png"
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerAceCount);

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    //Win conditions
    if (yourSum > 21){
        message = "You lose!";
    }
    else if (dealerSum > 21){
        message = "You win!";
    }
    //Both of you and dealers <= 21
    else if (yourSum == dealerSum){
        message = "You lose!";
    }
    else if (yourSum < dealerSum){
        message = "You lose!";
    }
    else if (yourSum > dealerSum){
        message = "You win!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

function hit(){
    if(!canHit){
        return;
    }

    //<img src="./cards/4-C.png"
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);   
    
    if (reduceAce(yourSum, yourAceCount) > 21){ //A, 3, K -> 11 + 10 + 10
        canHit = false;
    }

    console.log(yourSum);
}

function getValue(card){
    let data = card.split("-"); //"4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)){  //A J Q K
        if (value == "A"){
            return 11;
        }
        return 10;
    }

    return parseInt(value);
}

function checkAce(card){
    if (card[0] == "A"){
        return 1;
    }

    return 0;
}

function reduceAce(playerSum, playerAceCount){
    while (playerSum > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount -= 1;
    }

    return playerSum;
}