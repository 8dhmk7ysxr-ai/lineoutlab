/* =========================
   GLOBAL STATE
   ========================= */
let teamName = null;
let zone = null;
let jumper = null;
let ball = null;
let setup = null;
let won = true;

/* =========================
   UI HELPERS
   ========================= */
function setSelected(button, groupClass) {
  document.querySelectorAll("." + groupClass)
    .forEach(b => b.classList.remove("selected"));
  button.classList.add("selected");
}
function startMatch() {
  const input = document.getElementById("teamInput");
  const name = input.value.trim();

  if (name === "") {
    alert("Please enter a team name before starting the match.");
    return;
  }

  teamName = name;
  localStorage.setItem("currentTeam", teamName);

  document.getElementById("teamDisplay").innerText = "Team: " + teamName;
  document.getElementById("teamDisplay").style.display = "block";
  input.style.display = "none";
  input.nextElementSibling.style.display = "none"; // hides Start Match button
}
/* =========================
   SETTERS (CALLED BY BUTTONS)
   ========================= */
function setZone(value) {
  zone = value;
  validate();
}

function setJumper(value) {
  jumper = value;
  validate();
}

function setBall(value) {
  ball = value;
  validate();
}

function setSetup(value) {
  setup = value;
  validate();
}

/* =========================
   RESULT SWITCH
   ========================= */
function toggleResult() {
  won = !won;
  const label = document.getElementById("resultLabel");
  if (label) {
    label.innerText = won ? "Won" : "Lost";
  }
}

/* =========================
   VALIDATION
   ========================= */
function validate() {
  const saveBtn = document.getElementById("saveBtn");
  if (!saveBtn) return;

  const ready =
    zone !== null &&
    jumper !== null &&
    ball !== null &&
    setup !== null;

  saveBtn.disabled = !ready;
}

/* =========================
   SAVE LINEOUT
   ========================= */
function saveLineout() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");

  data.push({
    zone,
    jumper,
    ball,
    setup,
    won,
    timestamp: Date.now()
  });

  localStorage.setItem("lineouts", JSON.stringify(data));

  resetForm();
  alert("Lineout saved");
}

/* =========================
   UNDO LAST LINEOUT
   ========================= */
function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (data.length === 0) {
    alert("Nothing to undo");
    return;
  }

  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Last lineout removed");
}

/* =========================
   RESET FORM AFTER SAVE
   ========================= */
function resetForm() {
  zone = null;
  jumper = null;
  ball = null;
  setup = null;
  won = true;

  document.querySelectorAll("button.selected")
    .forEach(b => b.classList.remove("selected"));

  const label = document.getElementById("resultLabel");
  if (label) label.innerText = "Won";

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.disabled = true;
}

/* =========================
   STATS LOGIC (FOR LATER USE)
   ========================= */
function getStats(key) {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  const stats = {};

  data.forEach(l => {
    const k = l[key];
    if (!stats[k]) stats[k] = { win: 0, total: 0 };
    stats[k].total++;
    if (l.won) stats[k].win++;
  });

  return stats;
}

/* =========================
   BEST OPTION PER ZONE
   ========================= */
function bestOptionForZone(targetZone) {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]")
    .filter(l => l.zone === targetZone);

  const map = {};

  data.forEach(l => {
    const key = `${l.jumper}-${l.ball}-${l.setup}`;
    if (!map[key]) map[key] = { win: 0, total: 0 };
    map[key].total++;
    if (l.won) map[key].win++;
  });

  let best = null;
  let bestRate = 0;

  for (let key in map) {
    if (map[key].total >= 3) {
      const rate = map[key].win / map[key].total;
      if (rate > bestRate) {
        bestRate = rate;
        best = {
          combo: key,
          success: Math.round(rate * 100),
          attempts: map[key].total
        };
      }
    }
  }

  return best;
}