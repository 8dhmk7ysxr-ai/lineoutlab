alert("app.js loaded");
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

function undoLast() {
  const data = JSON.parse(localStorage.getItem("lineouts") || "[]");
  if (data.length === 0) return alert("Nothing to undo");
  data.pop();
  localStorage.setItem("lineouts", JSON.stringify(data));
  alert("Last lineout undone");
}