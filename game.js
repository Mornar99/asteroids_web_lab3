// Deklaracija varijabli
let canvas, context;
let player, asteroids;
let bestTime = localStorage.getItem("bestTime") || Infinity;
let startTime, currentTime, elapsedTime;
let keys = {};
let updateInterval;
let lastGameEndTime = 0;

// Ako bestTime ne postoji u localStorage ili je null, postavalja se vrijednost na 0
if (bestTime === null) {
  bestTime = 0;
  localStorage.setItem("bestTime", bestTime);
} else {
  // Ako postoji, konvertira se u float
  bestTime = parseFloat(bestTime);
}

// Funkcija za inicijalizaciju igre
function init() {
  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext("2d");

  // Postavljanje veličine canvasa
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Inicijalizacija igrača
  player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    color: "red",
  };

  // Inicijalizacija asteroida
  asteroids = [];

  // Postavljanje početnog vremena na završetak posljednje igre
  startTime = lastGameEndTime;
  startGame();
}

// Funkcija za pokretanje igre
function startGame() {
  startTime = new Date().getTime();
  spawnAsteroids();

  // Pozivanje funkcije update() svakih 16ms
  setInterval(update, 16);

  // Fukcija za povezivanje tipkovnice za kontrolu igrača
  window.addEventListener("keydown", handleKeyPress);
}

// Funkcija za ažuriranje stanja igre
function update() {
  currentTime = new Date().getTime();
  elapsedTime = currentTime - startTime;

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update i iscrtavanje igrača
  updatePlayer();
  drawObject(player);

  // Update i iscrtavanje asteroida
  updateAsteroids();
  drawAsteroids();

  // Detekcija kolizije
  detectCollision();

  // Iscrtavanje vremena
  drawTime(elapsedTime);

  // Ažuriranje najboljeg vremena
  if (elapsedTime > bestTime) {
    bestTime = elapsedTime;
    localStorage.setItem("bestTime", bestTime);
  }
}

// Funkcija za spawn asteroida
function spawnAsteroids() {
  const asteroidCount = 17;

  for (let i = 0; i < asteroidCount; i++) {
    const asteroid = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 30,
      height: 30,
      color: "gray",
      speed: Math.random() * 3 + 2, // Brzina asteroida
    };

    asteroids.push(asteroid);
  }
}

// Funkcija za update igrača
function updatePlayer() {
  // Pomicanje igrača prema pritisnutim tipkama
  if (keys.ArrowUp && player.y > 0) {
    player.y -= 7;
  }
  if (keys.ArrowDown && player.y < canvas.height) {
    player.y += 7;
  }
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= 7;
  }
  if (keys.ArrowRight && player.x < canvas.width) {
    player.x += 7;
  }
}

// Funkcija za update asteroida
function updateAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];

    // Pomicanje asteroida prema dolje
    asteroid.y += asteroid.speed;

    // Vraćanje asteroida na vrh ekrana kad izađe izvan donje granice
    if (asteroid.y > canvas.height) {
      asteroid.y = 0;
      asteroid.x = Math.random() * canvas.width;
    }
  }
}

// Funkcija za iscrtavanje objekta
function drawObject(object) {
  context.fillStyle = object.color;
  context.fillRect(
    object.x - object.width / 2,
    object.y - object.height / 2,
    object.width,
    object.height
  );
}

// Funkcija za iscrtavanje asteroida
function drawAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    drawObject(asteroids[i]);
  }
}

// Funkcija za detekciju kolizije
function detectCollision() {
  for (let i = 0; i < asteroids.length; i++) {
    const asteroid = asteroids[i];

    // Provjera kolizije između igrača i asteroida
    if (
      player.x - player.width / 2 < asteroid.x + asteroid.width / 2 &&
      player.x + player.width / 2 > asteroid.x - asteroid.width / 2 &&
      player.y - player.height / 2 < asteroid.y + asteroid.height / 2 &&
      player.y + player.height / 2 > asteroid.y - asteroid.height / 2
    ) {
      console.log("Collision!");
      endGame();
    }
  }
}

// Funkcija za završetak igre
function endGame() {
  // Zaustavljanje intervala koji poziva funkciju update
  clearInterval(updateInterval);

  // Ažuriranje vremena najbolje igre ako je trenutna igra bolja
  if (elapsedTime > bestTime) {
    bestTime = elapsedTime;
    localStorage.setItem("bestTime", bestTime);
  }

  // Trenutno vrijeme kao vrijeme završetka posljednje igre
  lastGameEndTime = new Date().getTime();

  // Prikaz rezultata
  alert(`Game Over!\nYour time: ${formatTime(elapsedTime)}`);

  init();
}

// Funkcija za iscrtavanje vremena
function drawTime(elapsedTime) {
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText(`Time: ${formatTime(elapsedTime)}`, 10, 30);
  context.fillText(`Best Time: ${formatTime(bestTime)}`, 10, 60);
}

function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
  const millisecondsPart = milliseconds % 1000;

  return `${pad(minutes)}:${pad(seconds)}.${pad(millisecondsPart, 3)}`;
}

function pad(value, length = 2) {
  return value.toString().padStart(length, "0");
}

// Funkcija za obradu tipki na tipkovnici
function handleKeyPress(e) {
  switch (e.key) {
    case "ArrowUp":
      player.y -= 5;
      break;
    case "ArrowDown":
      player.y += 5;
      break;
    case "ArrowLeft":
      player.x -= 5;
      break;
    case "ArrowRight":
      player.x += 5;
      break;
  }
}

// Povezivanje tipkovnice za kontrolu igrača
window.addEventListener("keydown", handleKeyPress);

// Inicijalizacija igre kada se stranica učita
window.onload = init;
