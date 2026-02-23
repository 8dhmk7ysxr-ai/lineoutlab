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

function startMatch() {
  const v = teamInput.value.trim();
  if (!v) return alert("Enter team name");
  state.team = v;
  teamDisplay.innerText = "Team: " + v;
}

function selectOne(btn, key, value) {
  // clear siblings
  btn.parentElement.querySelectorAll("button")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
  state[key] = value;

  // rules
  if (key === "result" && value === false) {
    state.setup = null;
  }
  if (key === "result" && value === true) {
    state.notStraight = false;
    document.querySelectorAll(".ns-btn")
      .forEach(b => b.classList.remove("selected"));
  }
}

function toggleNotStraight(btn) {
  state.notStraight = !state.notStraight;
  state.result = false;

  btn.classList.toggle("selected");

  document.querySelectorAll(".result-btn")
    .forEach(b => b.classList.remove("selected"));
}

function saveLineout() {
  if (!state.team || !state.zone || state.result === null) {
    alert("Team, zone and result required");
    return;
  }

  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  data.push({ ...state, time: Date.now() });
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Saved");
}

function generateReport() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("No data");

  const zones = {};
  data.forEach(l => {
    if (!zones[l.zone]) {
      zones[l.zone] = { t:0, setups:{}, jumpers:{}, players:{}, balls:{} };
    }
    const z = zones[l.zone];
    z.t++;
    if (l.setup) z.setups[l.setup] = (z.setups[l.setup] || 0) + 1;
    if (l.jumper) z.jumpers[l.jumper] = (z.jumpers[l.jumper] || 0) + 1;
    if (l.players) z.players[l.players] = (z.players[l.players] || 0) + 1;
    if (l.ball) z.balls[l.ball] = (z.balls[l.ball] || 0) + 1;
  });

  let r = `LINEOUTLAB MATCH REPORT\n\nTeam: ${state.team}\n\n`;
  for (let z in zones) {
    const o = zones[z];
    r += `${z}\nTotal: ${o.t}\n`;
    r += `Setups: ${JSON.stringify(o.setups)}\n`;
    r += `Jumpers: ${JSON.stringify(o.jumpers)}\n`;
    r += `Players: ${JSON.stringify(o.players)}\n`;
    r += `Ball: ${JSON.stringify(o.balls)}\n\n`;
  }
  alert(r);
}

function exportToExcel() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (!data.length) return alert("No data");

  let csv = ["Team,Zone,Result,NotStraight,Players,Jumper,Ball,Setup,Time"];
  data.forEach(l => {
    csv.push([
      l.team,
      l.zone,
      l.result ? "Won" : "Lost",
      l.notStraight ? "Yes" : "No",
      l.players || "",
      l.jumper || "",
      l.ball || "",
      l.setup || "",
      new Date(l.time).toLocaleString()
    ].join(","));
  });

  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "LineoutLab.csv";
  a.click();
}