let state = {
  team: null,
  zone: null,
  result: null,
  players: null,
  notStraight: false
};

function startMatch() {
  const v = teamInput.value.trim();
  if (!v) return alert("Enter team name");
  state.team = v;
  teamDisplay.innerText = "Team: " + v;
}

function pick(btn, key, value) {
  btn.parentElement.querySelectorAll("button")
    .forEach(b => b.classList.remove("selected"));

  btn.classList.add("selected");
  state[key] = value;

  if (key === "result" && value === true) {
    state.notStraight = false;
  }
}

function toggleNS(btn) {
  state.notStraight = !state.notStraight;
  state.result = false;

  btn.classList.toggle("selected");

  btn.parentElement.querySelectorAll("button")
    .forEach(b => {
      if (b.innerText === "Lost") b.classList.add("selected");
      if (b.innerText === "Won") b.classList.remove("selected");
    });
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
    zones[l.zone] = zones[l.zone] || { t:0, w:0 };
    zones[l.zone].t++;
    if (l.result) zones[l.zone].w++;
  });

  let r = "MATCH REPORT\n\n";
  for (let z in zones) {
    const o = zones[z];
    r += `${z}: ${o.w}/${o.t} (${Math.round(o.w/o.t*100)}%)\n`;
  }
  alert(r);
}