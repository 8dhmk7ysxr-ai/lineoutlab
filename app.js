/* GLOBAL STATE */
let teamName = null;
let zone = null;
let players = null;
let jumper = null;
let ball = null;
let setup = null;
let won = true;
let notStraight = false;

/* UI HELPER */
function setSelected(button, group) {
  document.querySelectorAll("." + group).forEach(b => b.classList.remove("selected"));
  button.classList.add("selected");
}

/* TEAM */
function startMatch() {
  const input = document.getElementById("teamInput");
  if (!input.value.trim()) {
    alert("Enter a team name first");
    return;
  }
  teamName = input.value.trim();
  localStorage.setItem("currentTeam", teamName);

  document.getElementById("teamDisplay").innerText = "Team: " + teamName;
  document.getElementById("teamDisplay").style.display = "block";
  input.style.display = "none";
  input.nextElementSibling.style.display = "none";

  validate();
}

/* SETTERS */
function setZone(v){ zone = v; validate(); }
function setPlayers(v){ players = v; validate(); }
function setJumper(v){ jumper = v; validate(); }
function setBall(v){ ball = v; validate(); }
function setSetup(v){ setup = v; validate(); }

/* RESULT */
function toggleResult() {
  won = !won;
  document.getElementById("resultLabel").innerText = won ? "Won" : "Lost";

  if (won) {
    notStraight = false;
  } else {
    setup = null;
    document.querySelectorAll(".setup-btn").forEach(b => b.classList.remove("selected"));
  }
  validate();
}

/* NOT STRAIGHT */
function toggleNotStraight(value) {
  notStraight = value;

  if (notStraight) {
    won = false;
    setup = null;
    document.getElementById("resultLabel").innerText = "Lost";
    document.querySelectorAll(".setup-btn").forEach(b => b.classList.remove("selected"));
  }

  validate();
}

/* VALIDATION */
function validate() {
  const baseReady =
    teamName && zone && players && jumper && ball;

  const ready =
    won ? baseReady && setup : baseReady;

  document.getElementById("saveBtn").disabled = !ready;
}

/* SAVE */
function saveLineout() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");

  data.push({
    team: teamName,
    zone,
    players,
    jumper,
    ball,
    setup,
    won,
    notStraight,
    timestamp: Date.now()
  });

  localStorage.setItem("lineouts", JSON.stringify(data));
  resetForm();
  alert("Lineout saved");
}

/* RESET */
function resetForm() {
  zone = players = jumper = ball = setup = null;
  won = true;
  notStraight = false;

  document.querySelectorAll(".selected").forEach(b => b.classList.remove("selected"));
  document.getElementById("resultLabel").innerText = "Won";

  validate();
}

/* UNDO */
function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("Nothing to undo");
  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Last lineout removed");
}

/* EXPORT */
function exportMatch() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("No data to export");

  const blob = new Blob(
    [JSON.stringify({ team: teamName, lineouts: data }, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${teamName}-lineoutlab.json`;
  a.click();
}

/* REPORT */
function generateReport() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("No data available");

  const wins = data.filter(l => l.won).length;
  const rate = Math.round((wins / data.length) * 100);

  alert(
`LINEOUTLAB MATCH REPORT

Team: ${teamName}
Total lineouts: ${data.length}
Won: ${wins}
Success: ${rate}%

Not straight throws: ${data.filter(l => l.notStraight).length}

End of report`
  );
}

/* LOAD TEAM */
window.onload = () => {
  const saved = localStorage.getItem("currentTeam");
  if (saved) {
    teamName = saved;
    document.getElementById("teamDisplay").innerText = "Team: " + teamName;
    document.getElementById("teamDisplay").style.display = "block";
    document.getElementById("teamInput").style.display = "none";
    document.querySelector("#teamSection button").style.display = "none";
  }
};