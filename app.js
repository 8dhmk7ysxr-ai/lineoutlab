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
  document.querySelectorAll("." + group)
    .forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
}

/* Team */
function startMatch() {
  const name = teamInput.value.trim();
  if (!name) return alert("Enter team name");
  teamName = name;
  localStorage.setItem("currentTeam", name);
  teamDisplay.innerText = "Team: " + name;
  teamDisplay.style.display = "block";
  teamInput.style.display = "none";
  teamInput.nextElementSibling.style.display = "none";
}

/* Result */
function setResult(value, btn) {
  won = value;
  notStraight = false;

  document.querySelectorAll(".result-btn")
    .forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  document.querySelectorAll(".ns-btn")
    .forEach(b => b.classList.remove("selected"));

  if (!won) clearSetup();
}

/* Not straight */
function toggleNotStraight(btn) {
  notStraight = !notStraight;
  won = false;
  clearSetup();

  btn.classList.toggle("selected");

  document.querySelectorAll(".result-btn")
    .forEach(b => b.classList.remove("selected"));
  document.querySelectorAll(".result-btn")[1].classList.add("selected");
}

/* Clear setup */
function clearSetup() {
  setup = null;
  document.querySelectorAll(".setup-btn")
    .forEach(b => b.classList.remove("selected"));
}

/* Setters */
function setZone(v){ zone = v; }
function setPlayers(v){ players = v; }
function setJumper(v){ jumper = v; }
function setBall(v){ ball = v; }
function setSetup(v){ if (won) setup = v; }

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
  alert("Lineout saved");
}

/* Undo */
function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return;
  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
}

/* Match report per zone */
function generateReport() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("No data yet");

  const zones = {};
  data.forEach(l => {
    if (!zones[l.zone]) zones[l.zone] = { t:0, w:0, ns:0 };
    zones[l.zone].t++;
    if (l.won) zones[l.zone].w++;
    if (l.notStraight) zones[l.zone].ns++;
  });

  let report = `LINEOUTLAB MATCH REPORT\n\nTeam: ${teamName}\n\nFIELD ZONES\n`;

  for (let z in zones) {
    const o = zones[z];
    report += `
${z}
  Lineouts: ${o.t}
  Won: ${o.w}
  Lost: ${o.t - o.w}
  Success: ${Math.round((o.w/o.t)*100)}%
  Not straight: ${o.ns}
`;
  }

  alert(report);
}

/* Load team */
window.onload = () => {
  const t = localStorage.getItem("currentTeam");
  if (t) {
    teamName = t;
    teamDisplay.innerText = "Team: " + t;
    teamDisplay.style.display = "block";
    teamInput.style.display = "none";
    teamInput.nextElementSibling.style.display = "none";
  }
};