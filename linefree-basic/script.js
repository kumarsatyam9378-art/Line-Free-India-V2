/* =========================================================
   Line-Free India — script.js
   Pure JavaScript (no frameworks). Read top-to-bottom.
   This file holds ALL the logic of the demo.
   ========================================================= */

/* ---------- 1) DATA: the shops we have ---------- */
// In the big project this comes from a database (Firebase).
// Here we just hard-code a small list so the demo works instantly.
const SHOPS = [
  { id: "s1", name: "Glow Beauty Salon", avgTime: 10 }, // avgTime = minutes per customer
  { id: "s2", name: "Royal Barbers", avgTime: 8 },
  { id: "s3", name: "Zen Spa & Wellness", avgTime: 15 },
  { id: "s4", name: "Smile Dental Clinic", avgTime: 12 },
];

/* ---------- 2) STATE: the live queue ----------
   queue[shopId] = array of tokens, e.g.
   [ { token:"A-1", name:"Rahul" }, { token:"A-2", name:"Priya" } ]
   We keep it in memory AND save to localStorage so it
   survives a page refresh (a nice beginner trick).        */
let queues = loadQueues();

function loadQueues() {
  try {
    return JSON.parse(localStorage.getItem("lfi_queues")) || {};
  } catch {
    return {};
  }
}
function saveQueues() {
  localStorage.setItem("lfi_queues", JSON.stringify(queues));
}

/* ---------- 3) HELPERS ---------- */
// Build the next token number like A-1, A-2 ... for a shop.
function nextToken(shopId) {
  const list = queues[shopId] || [];
  const n = list.length + 1;
  // prefix letter from shop id (s1 -> A, s2 -> B ...)
  const letter = String.fromCharCode(64 + parseInt(shopId.slice(1)) || 1);
  return letter + "-" + n;
}

// Estimate wait = (position - 1) * avgTime minutes.
function estimateWait(shopId, position) {
  const shop = SHOPS.find((s) => s.id === shopId);
  return Math.max(0, (position - 1) * (shop ? shop.avgTime : 10));
}

/* ---------- 4) FILL THE DROPDOWNS ---------- */
const shopSelect = document.getElementById("shopSelect");
const shopSelect2 = document.getElementById("shopSelect2");

SHOPS.forEach((s) => {
  shopSelect.add(new Option(s.name, s.id));
  shopSelect2.add(new Option(s.name, s.id));
});

/* ---------- 5) CUSTOMER: take a token ---------- */
document.getElementById("getTokenBtn").addEventListener("click", () => {
  const shopId = shopSelect.value;
  const name = document.getElementById("custName").value.trim();

  if (!name) {
    alert("Please enter your name first 😊");
    return;
  }

  if (!queues[shopId]) queues[shopId] = []; // create list if empty
  const token = nextToken(shopId);
  queues[shopId].push({ token, name });
  saveQueues();
  renderAll();

  // Show the customer their ticket
  const position = queues[shopId].length;
  const wait = estimateWait(shopId, position);
  document.getElementById("myTicket").classList.remove("hidden");
  document.getElementById("myTicket").innerHTML = `
    <div class="tnum">${token}</div>
    <div class="tmeta">Hi ${name}! You are #${position} in line.</div>
    <div class="tmeta">Estimated wait: ~${wait} min</div>
  `;
});

/* ---------- 6) SHOP: call next customer ---------- */
document.getElementById("callNextBtn").addEventListener("click", () => {
  const shopId = shopSelect2.value;
  const list = queues[shopId] || [];

  if (list.length === 0) {
    document.getElementById("nowServing").textContent = "Queue is empty 🎉";
    return;
  }
  const next = list[0]; // first person in line
  document.getElementById("nowServing").textContent =
    `Now serving: ${next.token} — ${next.name}`;
});

/* ---------- 7) SHOP: mark current as done (remove from queue) ---------- */
document.getElementById("doneBtn").addEventListener("click", () => {
  const shopId = shopSelect2.value;
  if (queues[shopId] && queues[shopId].length > 0) {
    const served = queues[shopId].shift(); // remove first
    saveQueues();
    renderAll();
    logServed(served);
  }
});

function logServed(person) {
  const box = document.getElementById("servedBox");
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<span>✅ ${person.name}</span><span>${person.token}</span>`;
  box.prepend(row);
}

/* ---------- 8) RENDER the live queue list ---------- */
function renderQueue() {
  const shopId = shopSelect.value; // follow the customer's selected shop
  const list = queues[shopId] || [];
  const ol = document.getElementById("queueList");

  if (list.length === 0) {
    ol.innerHTML = `<div class="empty">No one in queue yet. Be the first! 🚀</div>`;
    return;
  }
  ol.innerHTML = list
    .map(
      (p, i) => `
      <li>
        <span class="pos">${i + 1}</span>
        <span class="who">${p.name}</span>
        <span class="tk">${p.token}</span>
      </li>`
    )
    .join("");
}

/* ---------- 9) DRAW EVERYTHING ---------- */
function renderAll() {
  renderQueue();
}
renderAll();

/* ---------- 10) DARK / LIGHT MODE TOGGLE ---------- */
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* ---------- 11) KEEP BOTH PANELS IN SYNC ----------
   If the customer changes shop, refresh the queue view. */
shopSelect.addEventListener("change", renderQueue);
