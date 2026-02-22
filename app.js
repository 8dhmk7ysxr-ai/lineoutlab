let teamName = null;
let zone = null;
let players = null;
let jumper = null;
let ball = null;
let setup = null;
let won = true;
let notStraight = false;

/* HARD VISUAL SELECT (NO CSS DEPENDENCY) */
function selectBtn(btn, group) {
  document.querySelectorAll("." + group).forEach(b => {
    b.style.backgroundColor = "#e6e6e6";
    b.style.color = "#000";
    b.style.border = "2px solid #ccc";
  });

  btn.style.backgroundColor = "#0a7d3b";
  btn.style.color = "#fff";
  btn.style.border = "3px solid #055c2a";
}

/* TEAM */
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

/* FIELD */
function setZone(v){ zone = v; }

/* RESULT */
function setResult(value, btn) {
  won = value;
  notStraight = false;
  selectBtn(btn, "result-btn");
  if (!won) clearSetup();
}

function toggleNotStraight(btn) {
  notStraight = !notStraight;
  won = false;
  clearSetup();

  document.querySelectorAll(".ns-btn").forEach(b => {
    b.style.backgroundColor = "#e6e6e6";
    b.style.color = "#000";
  });

  if (notStraight) {
    btn.style.backgroundColor = "#c0392b";
    btn.style.color = "#fff";
  }

  document.querySelectorAll(".result-btn").forEach(b => {
    b.style.backgroundColor = "#e6e6e6";
    b.style.color = "#000";
  });
  document.querySelectorAll(".result-btn")[1].style.backgroundColor = "#c0392b";
  document.querySelectorAll(".result-btn")[1].style.color = "#fff";
}

/* SETTERS */
function setPlayers(v){ players = v; }
function setJumper(v){ jumper = v; }
function setBall(v){ ball = v; }
function setSetup(v){ if (won) setup = v; }

/* CLEAR SETUP */
function clearSetup() {
  setup = null;
  document.querySelectorAll(".setup-btn").forEach(b => {
    b.style.backgroundColor = "#e6e6e6";
    b.style.color = "#000";
  });
}

/* SAVE (MINIMUM REQUIRED ONLY) */
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

/* UNDO */
function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return;
  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
}

/* REPORT PER FIELD ZONE */
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

/* LOAD TEAM */
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