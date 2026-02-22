let state = {
  team: null,
  zone: null,
  result: null,
  players: null,
  jumper: null,
  ball: null,
  setup: null,
  notStraight: false
};

/* Team */
function startMatch() {
  const v = teamInput.value.trim();
  if (!v) return alert("Enter team name");
  state.team = v;
  teamDisplay.innerText = "Team: " + v;
}

/* Generic picker – iOS safe */
function pick(btn, key, value) {
  // Remove selection from siblings
  btn.parentElement.querySelectorAll("button")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
  state[key] = value;

  // If WON selected
  if (key === "result" && value === true) {
    state.notStraight = false;
  }

  // If LOST selected
  if (key === "result" && value === false) {
    state.setup = null;
  }
}

/* Not straight */
function toggleNS(btn) {
  state.notStraight = !state.notStraight;
  state.result = false;
  state.setup = null;

  btn.classList.toggle("selected");

  // Force Lost selected
  btn.parentElement.querySelectorAll("button").forEach(b => {
    if (b.innerText === "Lost") b.classList.add("selected");
    if (b.innerText === "Won") b.classList.remove("selected");
  });
}

/* Save */
function saveLineout() {
  if (!state.team || !state.zone || state.result === null) {
    alert("Team, zone and result required");
    return;
  }

  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  data.push({
    ...state,
    setup: state.result ? state.setup : null,
    time: Date.now()
  });

  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Lineout saved");
}

/* Report per field zone */
function generateReport() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("No data recorded");

  const zones = {};

  data.forEach(l => {
    zones[l.zone] = zones[l.zone] || { t:0, w:0, ns:0 };
    zones[l.zone].t++;
    if (l.result) zones[l.zone].w++;
    if (l.notStraight) zones[l.zone].ns++;
  });

  let r = `LINEOUTLAB MATCH REPORT\n\nTeam: ${state.team}\n\n`;

  for (let z in zones) {
    const o = zones[z];
    r += `${z}\n  Won: ${o.w}/${o.t}\n  Success: ${Math.round(o.w/o.t*100)}%\n  Not straight: ${o.ns}\n\n`;
  }

  alert(r);
}