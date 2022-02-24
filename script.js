/* ----------
Variables Globales evolution du jeu
---------- */
// Scores joueur 1 : Mario
var scoreTotal1;
var scoreTemp1;
// Scores joueur 2 : Luigi
var scoreTotal2;
var scoreTemp2;
// Informations
var endGame = false;
var diceOne = false;
var currentPlayer;
var winScore = 100;

/* ----------
Boutons + actions
---------- */
var newGame = document.getElementById('new-game');
var rollDice = document.getElementById('roll-dice');
var holdScore = document.getElementById('hold-score');

// Si clique sur le bouton "Nouvelle partie"
newGame.addEventListener('click', chooseUser);

// Si clique sur le bouton "Lancer Dé"
rollDice.addEventListener('click', debounce(function(e) {
  drawDice(e);
}, 1000));

// si clique sur le bouton "Garder points"
holdScore.addEventListener('click', updateScore);

/* ----------
fonction : resetAll()
description : Remise à zéro des points totaux et temporaires    
              Pour les 2 joueurs
---------- */
function resetAll() {
  document.getElementById('score-total1').innerHTML = "0";
  document.getElementById('score-tmp1').innerHTML = "0";
  document.getElementById('score-total2').innerHTML = "0";
  document.getElementById('score-tmp2').innerHTML = "0";
  scoreTotal1 = 0;
  scoreTotal2 = 0;
  scoreTemp1 = 0;
  scoreTemp2 = 0;
}

/* ----------
fonction : resetTmp()
description : Remise à zéro des points temporaires
              Pour les 2 joueurs
---------- */
function resetTmp() {
  document.getElementById('score-tmp1').innerHTML = "0";
  document.getElementById('score-tmp2').innerHTML = "0";
  scoreTemp1 = 0;
  scoreTemp2 = 0;
}


/* ----------
fonction : checkWinner()
description : Verfie s'il y a un gagnant
---------- */
function checkWinner() {
  let end = false;
  // Joueur 1
  if ( scoreTotal1 >= winScore ) {
    end = true;
    alert('Mario remporte la partie !'); 
  }
  // Joueur 2
  if ( scoreTotal2 >= winScore ) {
    end = true;
    alert('Luigi remporte la partie !'); 
  }
  // desactive les bouttons et reset les score temporaires (laisse les scores finaux)
  if (end) {
    document.getElementById('current-j1').disabled = true;
    document.getElementById('current-j2').disabled = true;
    document.getElementById('roll-dice').disabled = true;
    document.getElementById('hold-score').disabled = true;
    resetTmp();
  }
  return(end);
}

/* ----------
fonction : updateScore()
description : Mets à jour les points après qu'un joueur décide de garder ses points
---------- */
function updateScore() {
  let tot1 = document.getElementById('score-total1');
  let tot2 = document.getElementById('score-total2');
  let end;
  // update Joueur 1 / joueur 2
  if (currentPlayer == '1') {
    scoreTotal1 = scoreTotal1 + scoreTemp1;
    tot1.innerText = scoreTotal1.toString();
  }
  else {
    scoreTotal2 = scoreTotal2 + scoreTemp2;
    tot2.innerText = scoreTotal2.toString();
  }

  endGame = checkWinner();
  if (endGame) {
    endGame = false;
  }
  else {
    resetTmp();
    drawDice0();
    changePlayer();
  }
}

/* ----------
fonction : changePlayer()
description : Indique quel joueur commence la partie
---------- */
function changePlayer()
{
  if (currentPlayer == '1') {
    currentPlayer = '2';
    alert('Au tour de Luigi !'); 
    document.getElementById('current-j1').disabled = true;
    document.getElementById('current-j2').disabled = false;

  }
  else {
    currentPlayer = '1';
    alert('Au tour de Mario !'); 
    document.getElementById('current-j1').disabled = false;
    document.getElementById('current-j2').disabled = true;
  }
}

/* ----------
fonction : dice()
description : Retourne un nombre entre 1 et 6
---------- */
function dice() {
  return( Math.floor(Math.random() * 6) + 1);
}

/* ----------
fonction : chooseUser()
description : Indique le joueur qui commmence la partie
---------- */
function chooseUser() {
  let joueur = Math.floor(Math.random() * 2) + 1;
  switch(joueur) {
    case 1 :  
      alert('Mario commence la partie'); 
      currentPlayer = '1';
      document.getElementById('current-j1').disabled = false;
      document.getElementById('current-j2').disabled = true;
      break; 
    case 2 :  
      alert('Luigi commence la partie'); 
      currentPlayer = '2';
      document.getElementById('current-j1').disabled = true;
      document.getElementById('current-j2').disabled = false;
      break;
  }
  document.getElementById('roll-dice').disabled = false;
  document.getElementById('hold-score').disabled = false;
  drawDice0();
  resetAll();

}

/* ----------
fonction : cumulScore(num)
description : Cumule les scores temporaires en fonction du resultat du dé
---------- */
function cumulScore(num) {
    // cumule les score et affiche 
    let tmp1 = document.getElementById('score-tmp1');
    let tmp2 = document.getElementById('score-tmp2');
   if (currentPlayer == '1') {
      scoreTemp1 = scoreTemp1 + num;
      scoreTemp2 = 0;
      tmp1.innerHTML = scoreTemp1.toString();
      tmp2.innerHTML = "0";
    }
    else {
      scoreTemp1 = 0;
      scoreTemp2 = scoreTemp2 + num;
      tmp1.innerHTML = "0";
      tmp2.innerHTML = scoreTemp2.toString();
    }
}

/* ----------
fonction : drawDice0()
description : Affiche le dé vide
---------- */
function drawDice0() {
  // affiche le dé
  const canvas = document.getElementById('canvasD');
  let sizeCanvas = canvas.getAttribute('width');
  sizeCanvas === '0' || sizeCanvas === null ? sizeCanvas = 150 : sizeCanvas;
  canvas.setAttribute('height', sizeCanvas);
  canvas.setAttribute('width', sizeCanvas);
  
  let ctx;
  if (canvas.getContext) {
    ctx = canvas.getContext('2d') ;
    const img = new Image();
    img.src="images/dice0.png";
    img.addEventListener('load', () => {
      const newWidth = img.width * sizeCanvas / img.height;
      ctx.drawImage(img, 0, 0, newWidth, sizeCanvas);
      ctx.globalCompositeOperation='destination-in';
      ctx.beginPath();
      ctx.arc(sizeCanvas/2, sizeCanvas/2, sizeCanvas/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation='source-over';  
    });
  }
}

/* ----------
fonction : drawDice()
description : Affiche le resultat du dé lancé
              Modifie le score temporaire
              Gère le cas où le dé fait 1
---------- */
function drawDice() {
  // lance le dé
  let num = dice();

  // affiche le dé
  const canvas = document.getElementById('canvasD');
  let sizeCanvas = canvas.getAttribute('width');
  sizeCanvas === '0' || sizeCanvas === null ? sizeCanvas = 150 : sizeCanvas;
  canvas.setAttribute('height', sizeCanvas);
  canvas.setAttribute('width', sizeCanvas);

  let ctx;
  if (canvas.getContext) {
    ctx = canvas.getContext('2d') ;
    const img = new Image();
    switch(num) {
      case 1 :  
        diceOne = true;
        img.src="images/dice1.png";
        break; 
      case 2 :  
        img.src="images/dice2.png";
        break;
      case 3 :  
        img.src="images/dice3.png";
        break; 
      case 4 :  
        img.src="images/dice4.png";
        break;
      case 5 :  
        img.src="images/dice5.png";
        break; 
      case 6 :  
        img.src="images/dice6.png";
        break;       
      } 
    img.addEventListener('load', () => {
      const newWidth = img.width * sizeCanvas / img.height;
      ctx.drawImage(img, 0, 0, newWidth, sizeCanvas);
      ctx.globalCompositeOperation='destination-in';
      ctx.beginPath();
      ctx.arc(sizeCanvas/2, sizeCanvas/2, sizeCanvas/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation='source-over';
    });
  }

  if (diceOne) {
    alert('Le dé est sur la face 1, vous perdez tous vos points');
    resetTmp();
    changePlayer();
    diceOne  = false; //reset value
  }
  else {
    cumulScore(num);
  }
}

/* ----------
fonction : debounce(callback, delay)
description : tempo
---------- */
function debounce(callback, delay){
  var timer;
  return function(){
      var args = arguments;
      var context = this;
      clearTimeout(timer);
      timer = setTimeout(function(){
          callback.apply(context, args);
      }, delay);
  };
}
