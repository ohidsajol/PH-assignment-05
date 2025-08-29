// ====== DATA ======
const SERVICES = [
  {
    icon_path: "./assets/ambulance.png",
    name: "National Emergency Number",
    en: "National Emergency",
    number: "999",
    category: "All",
  },
  {
    icon_path: "👮",
    name: "Police Helpline Number",
    en: "Police",
    number: "999",
    category: "Police",
  },
  {
    icon_path: "🔥",
    name: "Fire Service Number",
    en: "Fire Service",
    number: "999",
    category: "Fire",
  },
  {
    icon_path: "🚑",
    name: "Ambulance Service",
    en: "Ambulance",
    number: "1994-999999",
    category: "Health",
  },
  {
    icon_path: "👩‍👧",
    name: "Women & Child Helpline",
    en: "Women & Child Helpline",
    number: "109",
    category: "Govt.",
  },
  {
    icon_path: "🚫",
    name: "Anti-Corruption Helpline",
    en: "Anti-Corruption",
    number: "106",
    category: "Govt.",
  },
  {
    icon_path: "⚡",
    name: "Electricity Helpline",
    en: "Electricity Outage",
    number: "16216",
    category: "Electricity",
  },
  {
    icon_path: "🏥",
    name: "BRAC Helpline",
    en: "Brac",
    number: "16445",
    category: "NGO",
  },
  {
    icon_path: "🚆",
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
      <div class="icon-circle" aria-hidden="true">${service.icon_path}</div>
      <button class="heart-btn" title="Like">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-1-.6-1-1.4S6 15.8 4.1 13.8C2.2 11.9 2 9 3.5 7.3 5 5.6 7.9 5.5 9.7 7.3L12 9.5l2.3-2.2c1.8-1.8 4.7-1.7 6.2 0C22 9 21.8 11.9 19.9 13.8 18 15.8 13 19.6 13 19.6s-1 .8-1 1.4z"/></svg>
      </button>
    </div>
    <div class="title">${service.name}</div>
    <div class="subtitle">${service.en}</div>
    <div class="hotline">${service.number}</div>
    <span class="badge">${service.category}</span>
    <div class="actions">
      <button class="btn copy" data-action="copy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
      </button>
      <button class="btn call" data-action="call">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 11 19a19.5 19.5 0 0 1-8-8.05A2 2 0 0 1 5 8h3a2 2 0 0 1 2 1.72 12.44 12.44 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45 12.44 12.44 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
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
