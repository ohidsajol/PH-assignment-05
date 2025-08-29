// ====== DATA ======
const SERVICES = [
  {
    icon_path: "./assets/emergency.png",
    name: "National Emergency Number",
    en: "National Emergency",
    number: "999",
    category: "All",
  },
  {
    icon_path: "./assets/police.png",
    name: "Police Helpline Number",
    en: "Police",
    number: "999",
    category: "Police",
  },
  {
    icon_path: "./assets/fire-service.png",
    name: "Fire Service Number",
    en: "Fire Service",
    number: "999",
    category: "Fire",
  },
  {
    icon_path: "./assets/ambulance.png",
    name: "Ambulance Service",
    en: "Ambulance",
    number: "1994-999999",
    category: "Health",
  },
  {
    icon_path: "./assets/emergency.png",
    name: "Women & Child Helpline",
    en: "Women & Child Helpline",
    number: "109",
    category: "Help",
  },
  {
    icon_path: "./assets/emergency.png",
    name: "Anti-Corruption Helpline",
    en: "Anti-Corruption",
    number: "106",
    category: "Govt.",
  },
  {
    icon_path: "./assets/emergency.png",
    name: "Electricity Helpline",
    en: "Electricity Outage",
    number: "16216",
    category: "Electricity",
  },
  {
    icon_path: "./assets/emergency.png",
    name: "BRAC Helpline",
    en: "Brac",
    number: "16445",
    category: "NGO",
  },
  {
    icon_path: "./assets/emergency.png",
    name: "Bangladesh Railway Helpline",
    en: "Bangladesh Railway",
    number: "163",
    category: "Travel",
  },
];

// ====== STATE ======
let coins = 100;
let likes = 0;
let copies = 0;

// ====== HELPERS ======
const el = (sel, root = document) => root.querySelector(sel);
const els = (sel, root = document) => [...root.querySelectorAll(sel)];

function updateStats() {
  el("#coins").textContent = coins;
  el("#likes").textContent = likes;
  el("#copies").textContent = copies;
}

// Copy text to clipboard with fallback
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    alert("Copied: " + text);
    copies++;
    updateStats();
  } catch (err) {
    alert("Copy failed. Please copy manually.");
    console.error(err);
  }
}

// Create one card node
function createCard(service) {
  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("data-name", service.name);
  card.setAttribute("data-number", service.number);

  card.innerHTML = `
    <div class="top">
      <div class="icon-image ${
        service.en === "Police" ? "police" : ""
      }" aria-hidden="true">
        <img src="${service.icon_path}" >
      </div>
      <button class="heart-btn" title="Like">
        <img src="./assets/heart-regular-full.svg" >
      </button>
    </div>
    <div class="title">${service.name}</div>
    <div class="subtitle">${service.en}</div>
    <div class="hotline">${service.number}</div>
    <div class="category" >
      <span class="badge">${service.category}</span>
    </div>
    <div class="actions">
      <button class="btn copy" data-action="copy">
        <img src="./assets/copy-regular-full.svg" >
        Copy
      </button>
      <button class="btn call" data-action="call">
        <img src="./assets/phone-solid-full.svg" >
        Call
      </button>
    </div>
  `;
  return card;
}

// Render cards
const cardsRoot = el("#cards");
SERVICES.forEach((s) => cardsRoot.appendChild(createCard(s)));

// History helpers
const historyList = el("#historyList");
const emptyState = el("#emptyState");
function addHistory({ name, number, time }) {
  if (emptyState) emptyState.remove();
  const item = document.createElement("div");
  item.className = "log";
  item.innerHTML = `
    <div class="left">
      <div class="name">${name}</div>
      <div class="meta">Number: ${number}</div>
    </div>
    <div class="time">${time}</div>
  `;
  historyList.prepend(item);
}

// Event delegation for copy/call on cards
cardsRoot.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = e.target.closest(".card");
  if (!card) return;
  const action = btn.dataset.action;
  const name = card.dataset.name;
  const number = card.dataset.number;

  if (action === "copy") {
    await copyText(number);
  }
  if (action === "call") {
    if (coins < 20) {
      alert("Not enough coins. Each call costs 20 coins.");
      return;
    }
    coins -= 20;
    updateStats();
    alert(`Calling ${name} at ${number} ...`);
    const time = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
    addHistory({ name, number, time });
  }
});

// Heart clicks
cardsRoot.addEventListener("click", (e) => {
  const heart = e.target.closest(".heart-btn");
  if (!heart) return;
  likes++;
  updateStats();
  heart.classList.remove("heart-pop");
  void heart.offsetWidth; // restart animation
  heart.classList.add("heart-pop");
});

// Clear history
el("#clearHistoryBtn").addEventListener("click", () => {
  historyList.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "empty";
  empty.id = "emptyState";
  empty.textContent = "No calls yet.";
  historyList.appendChild(empty);
});

// Initialize
updateStats();
