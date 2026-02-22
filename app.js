let zone = null;
let jumper = null;
let ball = null;
let setup = null;
let won = true;

function setZone(z){ zone = z; check(); }
function setJumper(j){ jumper = j; check(); }
function setBall(b){ ball = b; check(); }
function setSetup(s){ setup = s; check(); }

function toggleResult(){
  won = !won;
  document.getElementById("resultLabel").innerText = won ? "Won" : "Lost";
}

function check(){
  document.getElementById("saveBtn").disabled =
    !(zone && jumper && ball && setup);
}

function saveLineout(){
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  data.push({ zone, jumper, ball, setup, won });
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Lineout saved");
}
function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (data.length === 0) return alert("Nothing to undo");
  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Last lineout undone");
}
function bestOptionForZone(zone) {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]")
    .filter(l => l.zone === zone);

  const map = {};
  data.forEach(l => {
    const key = `${l.jumper}-${l.ball}-${l.setup}`;
    if (!map[key]) map[key] = { win: 0, total: 0 };
    map[key].total++;
    if (l.won) map[key].win++;
  });

  let best = null;
  let bestRate = 0;

  for (let k in map) {
    if (map[k].total >= 3) {
      const rate = map[k].win / map[k].total;
      if (rate > bestRate) {
        bestRate = rate;
        best = { key: k, rate, total: map[k].total };
      }
    }
  }
  return best;
}
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