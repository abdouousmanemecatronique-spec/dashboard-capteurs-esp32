const CHANNEL_ID = "3551785";
const READ_KEY = "FMH3JMVY5COCJ0X5";

let mesures = [];
let simulation = false;

const chart = new Chart(document.getElementById("sensorChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Température (°C)", data: [], borderColor: "#38bdf8", tension: 0.3 },
      { label: "Humidité (%)", data: [], borderColor: "#f59e0b", tension: 0.3 }
    ]
  }
});

function majInterface(feeds, etat) {
  mesures = feeds;
  document.getElementById("status-badge").textContent = etat;

  if (feeds.length === 0) {
    document.getElementById("val-1").textContent = "-- °C";
    document.getElementById("val-2").textContent = "-- %";
    document.getElementById("stats-1").textContent = "Min: -- | Moy: -- | Max: --";
    document.getElementById("stats-2").textContent = "Min: -- | Moy: -- | Max: --";
    document.getElementById("card-1").classList.remove("alert");
    document.getElementById("card-2").classList.remove("alert");
    document.getElementById("table-body").innerHTML = "<tr><td colspan='4'>En attente de mesures...</td></tr>";
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.update();
    return;
  }

  const t = feeds.map(f => parseFloat(f.field1));
  const h = feeds.map(f => parseFloat(f.field2));
  const lastT = t[t.length - 1];
  const lastH = h[h.length - 1];

  document.getElementById("val-1").textContent = lastT.toFixed(1) + " °C";
  document.getElementById("val-2").textContent = lastH.toFixed(1) + " %";
  document.getElementById("stats-1").textContent = "Min: " + Math.min(...t).toFixed(1) + "°C | Max: " + Math.max(...t).toFixed(1) + "°C";
  document.getElementById("stats-2").textContent = "Min: " + Math.min(...h).toFixed(1) + "% | Max: " + Math.max(...h).toFixed(1) + "%";
  document.getElementById("card-1").classList.toggle("alert", lastT > 30);
  document.getElementById("card-2").classList.toggle("alert", lastH > 80);

  chart.data.labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString());
  chart.data.datasets[0].data = t;
  chart.data.datasets[1].data = h;
  chart.update();

  document.getElementById("table-body").innerHTML = feeds.slice().reverse().slice(0, 10).map(f =>
    "<tr><td>" + new Date(f.created_at).toLocaleString() + "</td><td>" + f.field1 + " °C</td><td>" + f.field2 + " %</td><td>OK</td></tr>"
  ).join("");
}

async function actualiser() {
  if (simulation) {
    const fake = Array.from({ length: 12 }, (_, i) => ({
      created_at: new Date(Date.now() - (11 - i) * 15000).toISOString(),
      field1: (24 + Math.random() * 8).toFixed(1),
      field2: (55 + Math.random() * 30).toFixed(1)
    }));
    majInterface(fake, "Mode Simulation");
    return;
  }
  const n = document.getElementById("points-select").value;
  const r = await fetch("https://api.thingspeak.com/channels/" + CHANNEL_ID + "/feeds.json?api_key=" + READ_KEY + "&results=" + n);
  const d = await r.json();
  document.getElementById("channel-info").textContent = "Canal ThingSpeak : " + d.channel.name + " (ID #" + d.channel.id + ")";
  majInterface(d.feeds || [], d.feeds.length ? "ThingSpeak Live" : "Canal connecté (0 mesure)");
}

document.getElementById("btn-simuler").onclick = function () {
  simulation = !simulation;
  this.textContent = simulation ? "Revenir au réel" : "Simuler données";
  actualiser();
};
document.getElementById("btn-refresh").onclick = actualiser;
document.getElementById("points-select").onchange = actualiser;
document.getElementById("btn-export").onclick = function () {
  if (!mesures.length) return;
  const csv = "Date;Temperature;Humidite\n" + mesures.map(f => f.created_at + ";" + f.field1 + ";" + f.field2).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "releves_esp32.csv";
  a.click();
};

actualiser();
setInterval(actualiser, 15000);