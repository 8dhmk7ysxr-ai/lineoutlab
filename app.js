let teamName = null;
let zone = null;
let players = null;
let jumper = null;
let ball = null;
let setup = null;
let won = true;
let notStraight = false;

/* UI helper */
function selectBtn(btn, group) {
  document.querySelectorAll("." + group).forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

/* Team */
function startMatch() {
  const v = teamInput.value.trim();
  if (!v) return alert("Enter team name");
  teamName = v;
  teamDisplay.innerText = "Team: " + v;
  teamDisplay.style.display = "block";
  teamInput.style.display = "none";
  teamInput.nextElementSibling.style.display = "none";
}

/* Result */
function setResult(value) {
  won = value;
  notStraight = false;

  document.querySelectorAll(".result-btn").forEach(b => b.classList.remove("selected"));
  event.target.classList.add("selected");

  if (!won) setup = null;
}

function toggleNotStraight() {
  notStraight = !notStraight;
  won = false;
  setup = null;
  document.querySelector(".ns-btn").classList.toggle("selected");
}

/* Setters */
function setZone(v){ zone = v; }
function setPlayers(v){ players = v; }
function setJumper(v){ jumper = v; }
function setBall(v){ ball = v; }
function setSetup(v){ setup = v; }

/* Save */
function saveLineout() {
  if (!teamName || !zone) {
    alert("Team name and field zone required");
    return;
  }

  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");

  data.push({
    team: teamName,
    zone,
    players,
    jumper,
    ball,
    setup: won ? setup : null,
    won,
    notStraight,
    time: Date.now()
  });

  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Saved");
}

/* Undo */
function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return;
  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
}

/* Load team */
window.onload = () => {
  const t = localStorage.getItem("currentTeam");
  if (t) {
    teamName = t;
    teamDisplay.innerText = "Team: " + t;
    teamDisplay.style.display = "block";
  }
};