$(document).ready(function () {
  const totalPairs = 8; // Nombre total de paires à trouver
  let clickedCards = [];
  let matches = 0;
  let score = 0;
  let playerName = "";
  let playScores = []; // Tableau pour stocker les scores des joueurs

  function updateScoreBoard() {
    // Vérifier si le joueur est déjà dans le tableau des scores
    let playerIndex = playScores.findIndex(
      (player) => player.name === playerName
    );
    if (playerIndex !== -1) {
      // Mettre à jour le score si le joueur existe déjà
      playScores[playerIndex].score = score;
    } else {
      // Ajouter un nouveau joueur si ce n'est pas le cas
      playScores.push({ name: playerName, score: score });
    }

    // Trier le tableau par score décroissant
    playScores.sort((a, b) => b.score - a.score);

    // Construire le tableau des scores en HTML
    let scoreBoardHtml = "<ul>";
    playScores.forEach((player, index) => {
      scoreBoardHtml += `<li>${player.name} - ${player.score}</li>`;
    });
    scoreBoardHtml += "</ul>";
    $("#scoreboard").html(scoreBoardHtml);
  }
  // Initialisation du jeu
  function initializeGame() {
    let availableCards = [];
    for (let i = 1; i <= 200; i++) {
      availableCards.push(i);
    }

    let selectedCards = chooseRandomCards(availableCards, totalPairs);
    let cardValues = [];
    selectedCards.forEach((card) => {
      cardValues.push(card, card); // Ajouter chaque carte deux fois pour former les paires
    });
    cardValues = shuffleArray(cardValues); // Mélanger les paires de cartes

    $(".card").each(function (index) {
      $(this).data("card-value", cardValues[index]);
      $(this).html('<img src="./img/dessus.png" alt="Dos de la carte"/>');
      $(this).removeClass("flipped invisible");
      $(this).off("click").on("click", handleCardClick);
    });

    // Réinitialiser les variables de jeu
    clickedCards = [];
    matches = 0;
    score = 0;
    $("#score").text(score);
    updateScoreBoard();
  }

  $("#start").on("click", function () {
    playerName = prompt("Entrez votre nom pour commencer le jeu :");
    if (playerName) {
      initializeGame();
      $(this).text("Recommencer");
    }
  });

  // Sélection aléatoire des cartes
  function chooseRandomCards(cards, numPairs) {
    let selectedCards = [];
    for (let i = 0; i < numPairs; i++) {
      let index = Math.floor(Math.random() * cards.length);
      selectedCards.push(cards[index]);
      cards.splice(index, 1); // Enlever la carte choisie pour éviter les doublons
    }
    return selectedCards.map((card) => `Pokemon${card}`);
  }

  // Gestion des clics sur les cartes
  function handleCardClick() {
    if (!$(this).hasClass("flipped") && clickedCards.length < 2) {
      $(this).transition(
        { perspective: "1000px", rotateY: "180deg" },
        300,
        function () {
          const cardValue = $(this).data("card-value");
          $(this).html(
            `<img src="./img/${cardValue}.png" alt="${cardValue}"/>`
          );
          $(this).transition({ rotateY: "0deg" }, 300);
        }
      );
      $(this).addClass("flipped");
      clickedCards.push($(this));

      if (clickedCards.length === 2) {
        if (
          clickedCards[0].data("card-value") ===
          clickedCards[1].data("card-value")
        ) {
          matches++;
          // Marquer les cartes comme invisibles
          setTimeout(function () {
            // Ajouter un délai de 1 secondes avant de rendre les cartes invisibles
            clickedCards.forEach((card) => card.addClass("invisible"));
            clickedCards = [];
          }, 1000);
          if (matches === totalPairs) {
            alert("Félicitations! Vous avez gagné!");
            updateScoreBoard();
          }
        } else {
          score++; // Incrémenter le score
          $("#score").text(parseInt(score)); // Incrémenter le score
          setTimeout(resetCards, 700);
        }
      }
    }
  }

  // Réinitialisation des cartes si elles ne correspondent pas
  function resetCards() {
    clickedCards.forEach((card) => {
      card.transition(
        { perspective: "1000px", rotateY: "180deg" },
        300,
        function () {
          $(this).html('<img src="./img/dessus.png" alt="Dos de la carte"/>');
          $(this).transition({ rotateY: "0deg" }, 300);
        }
      );
      card.removeClass("flipped");
    });
    clickedCards = [];
  }

  // Fonction pour mélanger un tableau
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
    }
    return array;
  }
});
