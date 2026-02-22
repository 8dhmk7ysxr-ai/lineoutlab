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
  if (!data.length) {
    alert("No data recorded");
    return;
  }

  const zones = {};

  data.forEach(l => {
    const z = l.zone || "Unknown";
    if (!zones[z]) {
      zones[z] = {
        total: 0,
        setups: {},
        jumpers: {},
        players: {},
        balls: {}
      };
    }

    zones[z].total++;

    // Set-up move
    if (l.setup) {
      zones[z].setups[l.setup] =
        (zones[z].setups[l.setup] || 0) + 1;
    }

    // Jumper
    if (l.jumper) {
      zones[z].jumpers[l.jumper] =
        (zones[z].jumpers[l.jumper] || 0) + 1;
    }

    // Players in lineout
    if (l.players) {
      zones[z].players[l.players] =
        (zones[z].players[l.players] || 0) + 1;
    }

    // Ball position
    if (l.ball) {
      zones[z].balls[l.ball] =
        (zones[z].balls[l.ball] || 0) + 1;
    }
  });

  let report =
`LINEOUTLAB – MATCH REPORT

Team: ${state.team}

PER FIELD ZONE BREAKDOWN
`;

  for (let z in zones) {
    const zone = zones[z];

    report += `
${z}
  Total lineouts: ${zone.total}

  Set-up moves:
`;

    if (Object.keys(zone.setups).length) {
      for (let s in zone.setups) {
        report += `    ${s}: ${zone.setups[s]}\n`;
      }
    } else {
      report += `    None recorded\n`;
    }

    report += `
  Jumpers:
`;

    if (Object.keys(zone.jumpers).length) {
      for (let j in zone.jumpers) {
        report += `    #${j}: ${zone.jumpers[j]}\n`;
      }
    } else {
      report += `    None recorded\n`;
    }

    report += `
  Players in lineout:
`;

    if (Object.keys(zone.players).length) {
      for (let p in zone.players) {
        report += `    ${p}-man: ${zone.players[p]}\n`;
      }
    } else {
      report += `    None recorded\n`;
    }

    report += `
  Ball position:
`;

    if (Object.keys(zone.balls).length) {
      for (let b in zone.balls) {
        report += `    ${b}: ${zone.balls[b]}\n`;
      }
    } else {
      report += `    None recorded\n`;
    }

    report += `\n`;
  }

  report += `END OF REPORT`;

  alert(report);
}