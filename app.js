/* ========= STATE ========= */
let state = {
  team: null,
  zone: null,
  result: null,
  notStraight: false,
  players: null,
  jumper: null,
  ball: null,
  setup: null
};

/* ========= TEAM ========= */
function startMatch() {
  const v = document.getElementById("teamInput").value.trim();
  if (!v) {
    alert("Enter team name");
    return;
  }
  state.team = v;
  document.getElementById("teamDisplay").innerText = "Team: " + v;
}

/* ========= GENERIC SELECT ========= */
function selectGroup(btn, group, key, value) {
  // clear group
  document.querySelectorAll("." + group).forEach(b => {
    b.classList.remove("selected");
  });

  // select this
  btn.classList.add("selected");
  state[key] = value;

  // rules
  if (key === "result") {
    state.notStraight = false;
    document.querySelectorAll(".ns-btn").forEach(b => b.classList.remove("selected"));
    if (value === false) {
      clearSetup();
    }
  }
}

/* ========= NOT STRAIGHT ========= */
function toggleNotStraight(btn) {
  state.notStraight = !state.notStraight;
  state.result = false;

  btn.classList.toggle("selected");

  // force Lost selected
  document.querySelectorAll(".result-btn").forEach(b => {
    if (b.dataset.value === "lost") {
      b.classList.add("selected");
    } else {
      b.classList.remove("selected");
    }
  });

  clearSetup();
}

/* ========= CLEAR SETUP ========= */
function clearSetup() {
  state.setup = null;
  document.querySelectorAll(".setup-btn").forEach(b => b.classList.remove("selected"));
}

/* ========= SAVE ========= */
function saveLineout() {
  if (!state.team || !state.zone || state.result === null) {
    alert("Team, zone and result required");
    return;
  }

  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  data.push({
    ...state,
    time: Date.now()
  });
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Lineout saved");
}

/* ========= REPORT ========= */
function generateReport() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) {
    alert("No data recorded");
    return;
  }

  const zones = {};

  data.forEach(l => {
    if (!zones[l.zone]) {
      zones[l.zone] = {
        total: 0,
        setups: {},
        jumpers: {},
        players: {},
        balls: {}
      };
    }

    const z = zones[l.zone];
    z.total++;

    if (l.setup) z.setups[l.setup] = (z.setups[l.setup] || 0) + 1;
    if (l.jumper) z.jumpers[l.jumper] = (z.jumpers[l.jumper] || 0) + 1;
    if (l.players) z.players[l.players] = (z.players[l.players] || 0) + 1;
    if (l.ball) z.balls[l.ball] = (z.balls[l.ball] || 0) + 1;
  });

  let report = `LINEOUTLAB MATCH REPORT\n\nTeam: ${state.team}\n\n`;

  for (let z in zones) {
    const o = zones[z];
    report += `${z}\nTotal: ${o.total}\n`;

    report += "Set-up moves:\n";
    report += Object.keys(o.setups).length
      ? Object.entries(o.setups).map(([k,v]) => `  ${k}: ${v}`).join("\n")
      : "  None";
    report += "\nJumpers:\n";
    report += Object.keys(o.jumpers).length
      ? Object.entries(o.jumpers).map(([k,v]) => `  #${k}: ${v}`).join("\n")
      : "  None";
    report += "\nPlayers in lineout:\n";
    report += Object.keys(o.players).length
      ? Object.entries(o.players).map(([k,v]) => `  ${k}-man: ${v}`).join("\n")
      : "  None";
    report += "\nBall position:\n";
    report += Object.keys(o.balls).length
      ? Object.entries(o.balls).map(([k,v]) => `  ${k}: ${v}`).join("\n")
      : "  None";

    report += "\n\n";
  }

  alert(report);
}