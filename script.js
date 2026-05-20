/* ============================================================
   BIRTHDAY WISHES — MAIN SCRIPT (UPDATED)
   ============================================================ */

// ─── State ────────────────────────────────────────────────
let personName = '';
let personDOB  = '';
let personAge  = 0;

// ─── Wishes data (Quotes Fixed) ─────────────────────────
const wishesData = [
  { icon:'🌟', title:'Unlimited Joy',     text:'May every single day of this new year bring you more happiness than the last.' },
  { icon:'💫', title:'Dream Big',         text:'Chase every dream that lights a fire in your heart. The world is yours.' },
  { icon:'🏆', title:'Unstoppable You',   text: 'You have already conquered so much - this year you will conquer even more.' },
  { icon:'💖', title:'Boundless Love',    text:'Surrounded by people who love you deeply, may you always feel truly cherished.' },
  { icon:'🌈', title:'New Adventures',    text:'May this year open doors you never even knew existed.' },
  { icon:'✨', title:'Inner Peace',       text:'May you find calm in chaos, strength in struggle, and light in every shadow.' },
  { icon:'🎯', title:'Every Goal Met',    text: 'Set the targets high - because this year you will smash every single one.' },
  { icon:'🌸', title:'Good Health',       text:'Wishing you vibrant energy, glowing health, and a radiant smile always.' },
  { icon:'🔥', title:'Be Legendary',      text: 'You were not born ordinary. Blaze so bright the whole sky notices.' },
];

// ─── Default note ────────────────────────────────────────
function getDefaultNote(name) {
  return `Dearest ${name},\n\nOn this beautiful day, I want you to know how incredibly special you are to me. Your presence makes the world brighter, your laughter is the best music I know, and your kindness inspires everyone around you.\n\nKeep being the extraordinary person you are. Today and every day, you deserve nothing but the absolute best.\n\nWith all my love,`;
}

// ─── Background Music ─────────────────────────────────────
function startBgMusic() {
  const music = document.getElementById('bgMusic');
  if (!music) return;
  music.volume = 0.35;
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — try on first user interaction
      const tryPlay = () => {
        music.play().catch(() => {});
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('touchstart', tryPlay);
      };
      document.addEventListener('click', tryPlay, { once: true });
      document.addEventListener('touchstart', tryPlay, { once: true });
    });
  }
}

// ─── Start (Let's Celebrate Button Click) ────────────────
function startWishing() {
  const nameInput = document.getElementById('inputName');
  const dobInput  = document.getElementById('inputDOB');

  const name = nameInput.value.trim();
  const dob  = dobInput.value;

  if (!name) { 
    showToast('Please enter their name 🌸'); 
    nameInput.focus(); 
    return; 
  }
  if (!dob) { 
    showToast('Please enter their date of birth 🎂'); 
    dobInput.focus(); 
    return; 
  }

  personName = name;
  personDOB  = dob;
  personAge  = calculateAge(dob);

  sessionStorage.setItem('bdayName', name);
  sessionStorage.setItem('bdayDOB',  dob);

  launchMainPage();
}

function launchMainPage() {
  const onboarding = document.getElementById('onboarding');
  const main = document.getElementById('mainPage');

  onboarding.classList.remove('active');
  onboarding.style.display = 'none';

  main.classList.add('active');
  main.style.display = 'block';

  populatePage();
  initScrollObserver();
  spawnFloatingEmojis();
  launchEntryConfetti();
  initHamburger();
  startBgMusic();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Calculate age ────────────────────────────────────────
function calculateAge(dob) {
  const today = new Date();
  const birth  = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return Math.max(age, 0);
}

function formatDate(dob) {
  const d = new Date(dob + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Populate dynamic content ────────────────────────────
function populatePage() {
  document.getElementById('navName').textContent = personName;
  const hbND = document.getElementById('hbNameDisplay');
  if (hbND) hbND.textContent = personName;

  document.getElementById('ageBadge').textContent  = `🎂 Turning ${personAge} Today!`;
  document.getElementById('heroName').textContent   = personName;
  document.getElementById('heroTagline').textContent = `Wishing the most magical birthday to someone truly extraordinary.`;
  document.getElementById('heroDate').textContent   = `📅 Born: ${formatDate(personDOB)}`;
  startNextBdayCountdown(personDOB);

  document.querySelectorAll('.dynamic-name').forEach(el => el.textContent = personName);

  const saved = localStorage.getItem('bdayNote_' + personName);
  document.getElementById('noteText').textContent = saved || getDefaultNote(personName);
  document.getElementById('noteSig').textContent  = `— With Love 💖`;

  renderWishes();

  const url = `${window.location.origin}/?name=${encodeURIComponent(personName)}&dob=${encodeURIComponent(personDOB)}`;
  document.getElementById('shareUrl').textContent = url;

  document.title = `🎂 Happy Birthday, ${personName}!`;
  setTimeout(initAllFeatures, 300);
}

// ─── Render wish cards ────────────────────────────────────
function renderWishes() {
  const grid = document.getElementById('wishesGrid');
  if (!grid) return;
  
  grid.innerHTML = wishesData.map((w, i) => `
    <div class="wish-card" style="transition-delay:${i * 60}ms">
      <span class="wish-icon">${w.icon}</span>
      <div class="wish-title">${w.title}</div>
      <p class="wish-text">${w.text.replace(/you/g, personName || 'you')}</p>
    </div>
  `).join('');
}

// ─── Save custom note ─────────────────────────────────────
function saveNote() {
  const val = document.getElementById('customNote').value.trim();
  if (!val) { showToast('Please write something first ✏️'); return; }
  localStorage.setItem('bdayNote_' + personName, val);
  document.getElementById('noteText').textContent = val;
  showToast('Note saved! 💾');
}

// ─── Scroll observer ─────────────────────────────────────
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gif-card, .wish-card').forEach(el => observer.observe(el));
}

// ─── Floating emojis ─────────────────────────────────────
function spawnFloatingEmojis() {
  const container = document.getElementById('floatingEmojis');
  if (!container) return;
  
  container.innerHTML = '';
  const emojis = ['🎉','🎊','✨','🌟','💖','🎂','🎁','🌸','💫','🥂','🎈','💕'];
  for (let i = 0; i < 18; i++) {
    const el = document.createElement('span');
    el.className = 'floating-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDelay = `${Math.random() * 5}s`;
    el.style.animationDuration = `${5 + Math.random() * 5}s`;
    el.style.fontSize = `${1 + Math.random() * 1}rem`;
    container.appendChild(el);
  }
}

// ─── Navigation ───────────────────────────────────────────
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['home', 'gallery', 'note', 'wishes'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
});

function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.onclick = () => mobileMenu.classList.toggle('open');
  }
}

function closeMobileMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
}

// ─── Share Logic ──────────────────────────────────────────
function copyLink() {
  const url = document.getElementById('shareUrl').textContent;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied! 📋');
  }).catch(() => {
    showToast('Failed to copy. Copy manually.');
  });
}

function shareWA() {
  const url = document.getElementById('shareUrl').textContent;
  const msg = `🎂 Happy Birthday, ${personName}! 🎉\n\nI made a special birthday page for you. Check it out here:\n${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

function shareTelegram() {
  const url = document.getElementById('shareUrl').textContent;
  const msg = `🎂 Happy Birthday, ${personName}! 🎉`;
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── Toast Logic ──────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── DOM Ready ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get('name');
  const urlDOB  = params.get('dob');

  if (urlName && urlDOB) {
    personName = urlName;
    personDOB  = urlDOB;
    personAge  = calculateAge(urlDOB);
    launchMainPage();
    return;
  }

  const sName = sessionStorage.getItem('bdayName');
  const sDOB  = sessionStorage.getItem('bdayDOB');
  if (sName && sDOB) {
    personName = sName;
    personDOB  = sDOB;
    personAge  = calculateAge(sDOB);
    launchMainPage();
    return;
  }

  document.getElementById('onboarding').classList.add('active');

  document.getElementById('inputName')?.addEventListener('keydown', e => { 
    if (e.key === 'Enter') document.getElementById('inputDOB').focus(); 
  });
  document.getElementById('inputDOB')?.addEventListener('keydown', e => { 
    if (e.key === 'Enter') startWishing(); 
  });
});

// ─── Confetti ────────────────────────────────────────────
function launchEntryConfetti() {
  if (typeof launchConfetti === 'function') {
    setTimeout(launchConfetti, 500);
    setTimeout(launchConfetti, 1500);
  }
}

// ─── CELEBRATE BUTTON — Fun fireworks burst ───────────────
function triggerCelebrate() {
  // Trigger confetti
  if (typeof launchConfetti === 'function') launchConfetti();

  // Animate the button
  const btn = document.getElementById('celebrateBtn');
  if (btn) {
    btn.classList.add('celebrate-pop');
    setTimeout(() => btn.classList.remove('celebrate-pop'), 600);
  }

  // Spawn emoji burst from center
  spawnEmojiBurst();
}

function spawnEmojiBurst() {
  const burst = ['🎆','🎇','✨','🎊','🎉','💥','🌟','🎈'];
  const container = document.body;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('span');
    el.className = 'burst-emoji';
    el.textContent = burst[Math.floor(Math.random() * burst.length)];
    el.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${1.2 + Math.random() * 1.6}rem;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: none;
    `;
    container.appendChild(el);

    const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const dist  = 80 + Math.random() * 160;
    const dx    = Math.cos(angle) * dist;
    const dy    = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${0.6 + Math.random() * 0.4}s ease-out, opacity 0.5s ease-in`;
      el.style.transform  = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.5)`;
      el.style.opacity    = '0';
    });

    setTimeout(() => el.remove(), 1200);
  }
}

// ─── GALLERY PHOTO SHOW ───────────────────────────────────
let galleryPhotos = []; // filled from device uploads (base64 URLs)

let galleryRunning = false;

function openGalleryShow() {
  if (galleryPhotos.length === 0) {
    showToast('Please upload 4 photos first 📸');
    document.getElementById('onboarding')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (galleryRunning) return;
  galleryRunning = true;

  const overlay = document.getElementById('galleryOverlay');
  const img     = document.getElementById('galleryShowImg');
  const counter = document.getElementById('galleryCounter');

  overlay.style.display = 'flex';
  // Fade overlay in
  requestAnimationFrame(() => {
    overlay.classList.add('active');
  });

  function showPhoto(i) {
    if (i >= galleryPhotos.length) {
      // All done — fade out and return
      overlay.classList.remove('active');
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.classList.remove('fade-out');
        galleryRunning = false;
        img.classList.remove('photo-popup');
        img.src = '';
      }, 700);
      return;
    }

    counter.textContent = `${i + 1} / ${galleryPhotos.length}`;

    // Reset animation
    img.classList.remove('photo-popup');
    img.style.opacity = '0';
    img.src = galleryPhotos[i];

    img.onload = function () {
      // Trigger popup animation
      requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.classList.add('photo-popup');
      });

      // Show for 2.4 seconds then move to next
      setTimeout(() => {
        img.classList.remove('photo-popup');
        img.classList.add('photo-exit');
        setTimeout(() => {
          img.classList.remove('photo-exit');
          showPhoto(i + 1);
        }, 400);
      }, 2400);
    };

    img.onerror = function () {
      // If image not found, skip to next
      setTimeout(() => showPhoto(i + 1), 300);
    };
  }

  showPhoto(0);
}

// ─── HANDLE PHOTO UPLOADS ────────────────────────────────
function handlePhotoUploads(input) {
  const files = Array.from(input.files).slice(0, 4);
  if (files.length === 0) return;

  galleryPhotos = [];
  const previews = document.querySelectorAll('.upload-preview-img');
  previews.forEach(p => { p.src = ''; p.style.display = 'none'; });

  let loaded = 0;
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      galleryPhotos[i] = e.target.result;
      if (previews[i]) {
        previews[i].src = e.target.result;
        previews[i].style.display = 'block';
      }
      loaded++;
      const label = document.getElementById('uploadLabel');
      if (label) label.textContent = `${loaded} photo${loaded > 1 ? 's' : ''} selected ✅`;
    };
    reader.readAsDataURL(file);
  });
}

// ─── NEXT BIRTHDAY COUNTDOWN ─────────────────────────────
function startNextBdayCountdown(dobStr) {
  const strip = document.createElement('div');
  strip.className = 'next-bday-strip';
  strip.innerHTML = '<span class="nbs-label">🎂 Next birthday in</span> <span class="nbs-val" id="nbsVal">…</span>';

  // Insert after heroDate
  const heroDate = document.getElementById('heroDate');
  if (heroDate && heroDate.parentNode) {
    heroDate.parentNode.insertBefore(strip, heroDate.nextSibling);
  }

  function update() {
    const now  = new Date();
    const dob  = new Date(dobStr);
    let next   = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (next <= now) next.setFullYear(now.getFullYear() + 1);

    const diff = next - now;
    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const el = document.getElementById('nbsVal');
    if (!el) return;
    if (days === 0 && hrs === 0 && mins === 0)
      el.textContent = '🎉 TODAY!';
    else if (days === 0)
      el.textContent = `${hrs}h ${mins}m ${secs}s`;
    else
      el.textContent = `${days}d ${hrs}h ${mins}m`;
  }
  update();
  setInterval(update, 1000);
}

// ─── SPARKLE CURSOR TRAIL ────────────────────────────────
(function () {
  const COLORS = ['#FFD700','#FF4D8D','#00E5FF','#E040FB','#39FF14','#FF8C00'];
  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 40) return; // throttle
    last = now;
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    const size = 6 + Math.random() * 8;
    dot.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX}px; top:${e.clientY}px;
      background:${COLORS[Math.floor(Math.random()*COLORS.length)]};
      box-shadow: 0 0 ${size*2}px ${COLORS[Math.floor(Math.random()*COLORS.length)]};
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  });
})();

// ════════════════════════════════════════════════════════
//  FEATURE 2 — BLOW OUT THE CANDLES
// ════════════════════════════════════════════════════════
let candlesOut = 0;
let totalCandles = 0;
let micStream = null;

function initCandles(age) {
  const row = document.getElementById('candlesRow');
  if (!row) return;
  const count = Math.min(Math.max(age || 5, 1), 10);
  totalCandles = count; candlesOut = 0;
  row.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const colors = ['#FF4D8D','#FFD700','#00E5FF','#c084fc','#39FF14','#FF8C00'];
    const col = colors[i % colors.length];
    row.innerHTML += `
      <div class="candle" onclick="blowCandle(${i})">
        <div class="candle-smoke" id="smoke${i}">💨</div>
        <div class="candle-flame" id="flame${i}">🔥</div>
        <div class="candle-stick" style="background:linear-gradient(180deg,${col}aa,${col})"></div>
      </div>`;
  }
  document.getElementById('candleMsg').textContent = '';
}

function blowCandle(i) {
  const flame = document.getElementById('flame' + i);
  const smoke = document.getElementById('smoke' + i);
  if (!flame || flame.classList.contains('out')) return;
  flame.classList.add('out');
  smoke.classList.add('show');
  candlesOut++;
  if (candlesOut === totalCandles) {
    setTimeout(() => {
      const msg = document.getElementById('candleMsg');
      if (msg) msg.textContent = `🎉 Wish Made! Happy Birthday ${personName}! 🎂`;
    }, 500);
  }
}

function startMicBlow() {
  const hint = document.getElementById('micHint');
  if (!navigator.mediaDevices) { if(hint) hint.textContent = 'Mic not supported on this browser.'; return; }
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    micStream = stream;
    if (hint) hint.textContent = '🎤 Listening… blow into your mic!';
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let blown = 0;
    function check() {
      if (candlesOut === totalCandles) { stream.getTracks().forEach(t=>t.stop()); return; }
      analyser.getByteFrequencyData(data);
      const vol = data.reduce((a,b)=>a+b,0)/data.length;
      if (vol > 30) {
        blown++;
        if (blown > 3) {
          // blow out one random unblown candle
          for (let i = 0; i < totalCandles; i++) {
            const f = document.getElementById('flame'+i);
            if (f && !f.classList.contains('out')) { blowCandle(i); break; }
          }
          blown = 0;
        }
      }
      requestAnimationFrame(check);
    }
    check();
  }).catch(() => { if(hint) hint.textContent = 'Mic access denied. Click candles instead!'; });
}

// ════════════════════════════════════════════════════════
//  FEATURE 4 — AGE IN FUN STATS
// ════════════════════════════════════════════════════════
function startFunStats(dobStr) {
  function fmt(n) { return Math.floor(n).toLocaleString(); }
  function update() {
    const now  = Date.now();
    const born = new Date(dobStr).getTime();
    const ms   = now - born;
    const secs = ms / 1000;
    const mins = secs / 60;
    const hrs  = mins / 60;
    const days = hrs  / 24;

    const hb = document.getElementById('statHeartbeats');
    const br = document.getElementById('statBreaths');
    const ho = document.getElementById('statHours');
    const da = document.getElementById('statDays');
    const sl = document.getElementById('statSleep');
    const la = document.getElementById('statLaughs');

    if (hb) hb.textContent = fmt(secs * 1.2);      // ~72 bpm avg
    if (br) br.textContent = fmt(secs * 0.267);     // ~16 breaths/min
    if (ho) ho.textContent = fmt(hrs);
    if (da) da.textContent = fmt(days);
    if (sl) sl.textContent = fmt(hrs * 0.33);       // ~8hrs/day sleep
    if (la) la.textContent = fmt(days * 15);        // ~15 laughs/day
  }
  update();
  setInterval(update, 1000);
}

// ════════════════════════════════════════════════════════
//  FEATURE 6 — MYSTERY GIFT BOX
// ════════════════════════════════════════════════════════
let giftOpened = false;
const giftMessages = [
  'You are someone special and a reason to smile every single day. 💛',
  'The world is brighter, louder, and more beautiful because you are in it. 🌟',
  "Your laugh is the best song. Your heart is the best gift. 💖",
  "Today the universe wrapped all its magic into one person — YOU. ✨",
  "Keep being unapologetically, wonderfully you. The world needs exactly that. 🦋",
  "Every candle you blow out leaves a wish in the air. May all yours come true. 🕯️",
];

function openGift() {
  if (giftOpened) return;
  giftOpened = true;
  // Trigger 3D lid opening (threescenes.js handles the rest)
  if (typeof openGift3D === 'function') {
    openGift3D();
  } else {
    // Fallback to original CSS approach
    const lid  = document.getElementById('giftLid');
    const burst = document.getElementById('giftBurst');
    const msg  = document.getElementById('giftMessage');
    if (!lid) return;
    lid.classList.add('open');
    setTimeout(() => {
      if (burst) { burst.textContent = '🎉✨🎊💫🌟'; burst.classList.add('show'); }
    }, 400);
    setTimeout(() => {
      const m = giftMessages[Math.floor(Math.random() * giftMessages.length)];
      if (msg) { msg.textContent = m; msg.classList.add('show'); }
    }, 800);
  }
}

// ════════════════════════════════════════════════════════
//  FEATURE 8 — BIRTHDAY FORTUNE TELLER
// ════════════════════════════════════════════════════════
let fortuneRevealed = false;
const fortunes = [
  { emoji:'🌟', title:'A year of breakthroughs', text:'The stars align for something big. A dream you have been chasing is finally within reach this year.' },
  { emoji:'💰', title:'Abundance incoming', text:'Unexpected opportunities will knock. Say yes more than no — the universe is routing resources your way.' },
  { emoji:'❤️', title:'Love will surprise you', text:'The heart you least expect will matter the most. Stay open, stay soft, stay you.' },
  { emoji:'🚀', title:'Your boldest chapter yet', text:'A leap of faith you take this year will define the next decade. Jump anyway.' },
  { emoji:'🌺', title:'Bloom where you are', text:'Growth is not always loud. Quiet, steady progress will take you further than you imagine.' },
  { emoji:'🎯', title:'Focus brings magic', text:'One goal. Full heart. Zero distractions. That formula will unlock something extraordinary for you.' },
  { emoji:'🦋', title:'Transformation awaits', text:'You will shed what no longer serves you and emerge lighter, freer, and more yourself than ever.' },
];

function revealFortune() {
  const smoke = document.getElementById('crystalSmoke');
  const text  = document.getElementById('crystalText');
  const result= document.getElementById('fortuneResult');
  if (!smoke) return;

  if (fortuneRevealed) {
    // Re-roll
    fortuneRevealed = false;
    if (result) result.classList.remove('show');
    if (text)  text.textContent = '✨';
  }

  smoke.classList.add('swirling');
  if (text) text.textContent = '🔮';

  setTimeout(() => {
    smoke.classList.remove('swirling');
    const f = fortunes[Math.floor(Math.random() * fortunes.length)];
    if (text) text.textContent = f.emoji;
    if (result) {
      result.innerHTML = `<span class="fortune-emoji">${f.emoji}</span><strong>${f.title}</strong><br><span class="fortune-text">${f.text}</span><br><br><small style="color:var(--text-muted);font-size:0.75rem">Tap again for a new fortune ✨</small>`;
      result.classList.add('show');
    }
    fortuneRevealed = true;
  }, 1200);
}

// ════════════════════════════════════════════════════════
//  FEATURE 10 — ZODIAC & STAR MAP
// ════════════════════════════════════════════════════════
const ZODIACS = [
  { name:'Capricorn', symbol:'♑', dates:'Dec 22 – Jan 19', traits:['Ambitious','Disciplined','Practical'], stars:[[150,60],[120,90],[180,90],[100,130],[200,130],[150,170]] },
  { name:'Aquarius',  symbol:'♒', dates:'Jan 20 – Feb 18', traits:['Visionary','Rebel','Humanitarian'], stars:[[80,80],[130,60],[180,80],[150,120],[100,140],[160,160]] },
  { name:'Pisces',    symbol:'♓', dates:'Feb 19 – Mar 20', traits:['Dreamy','Empathetic','Artistic'], stars:[[100,70],[160,80],[120,120],[180,130],[90,160],[150,170]] },
  { name:'Aries',     symbol:'♈', dates:'Mar 21 – Apr 19', traits:['Bold','Energetic','Leader'], stars:[[150,50],[110,100],[190,100],[130,150],[170,150],[150,200]] },
  { name:'Taurus',    symbol:'♉', dates:'Apr 20 – May 20', traits:['Loyal','Patient','Sensual'], stars:[[150,60],[100,110],[200,110],[120,160],[180,160],[150,200]] },
  { name:'Gemini',    symbol:'♊', dates:'May 21 – Jun 20', traits:['Witty','Curious','Adaptable'], stars:[[100,60],[200,60],[100,110],[200,110],[120,160],[180,160]] },
  { name:'Cancer',    symbol:'♋', dates:'Jun 21 – Jul 22', traits:['Nurturing','Intuitive','Loyal'], stars:[[150,50],[90,100],[210,100],[120,150],[180,150],[150,200]] },
  { name:'Leo',       symbol:'♌', dates:'Jul 23 – Aug 22', traits:['Charismatic','Brave','Creative'], stars:[[150,40],[80,90],[220,90],[100,150],[200,150],[150,210]] },
  { name:'Virgo',     symbol:'♍', dates:'Aug 23 – Sep 22', traits:['Precise','Reliable','Intelligent'], stars:[[150,50],[100,100],[200,100],[130,155],[170,155],[150,200]] },
  { name:'Libra',     symbol:'♎', dates:'Sep 23 – Oct 22', traits:['Balanced','Charming','Fair'], stars:[[80,100],[220,100],[150,60],[130,140],[170,140],[150,200]] },
  { name:'Scorpio',   symbol:'♏', dates:'Oct 23 – Nov 21', traits:['Intense','Passionate','Magnetic'], stars:[[150,50],[90,110],[210,110],[110,160],[190,160],[150,210]] },
  { name:'Sagittarius',symbol:'♐',dates:'Nov 22 – Dec 21', traits:['Adventurous','Optimistic','Free'], stars:[[150,40],[90,100],[210,100],[120,160],[180,160],[150,220]] },
];

function getZodiac(dobStr) {
  const d = new Date(dobStr);
  const m = d.getMonth() + 1, day = d.getDate();
  if ((m===12&&day>=22)||(m===1&&day<=19))  return ZODIACS[0];
  if ((m===1&&day>=20)||(m===2&&day<=18))   return ZODIACS[1];
  if ((m===2&&day>=19)||(m===3&&day<=20))   return ZODIACS[2];
  if ((m===3&&day>=21)||(m===4&&day<=19))   return ZODIACS[3];
  if ((m===4&&day>=20)||(m===5&&day<=20))   return ZODIACS[4];
  if ((m===5&&day>=21)||(m===6&&day<=20))   return ZODIACS[5];
  if ((m===6&&day>=21)||(m===7&&day<=22))   return ZODIACS[6];
  if ((m===7&&day>=23)||(m===8&&day<=22))   return ZODIACS[7];
  if ((m===8&&day>=23)||(m===9&&day<=22))   return ZODIACS[8];
  if ((m===9&&day>=23)||(m===10&&day<=22))  return ZODIACS[9];
  if ((m===10&&day>=23)||(m===11&&day<=21)) return ZODIACS[10];
  return ZODIACS[11];
}

function initZodiac(dobStr) {
  const z = getZodiac(dobStr);
  const sym  = document.getElementById('zodiacSymbol');
  const name = document.getElementById('zodiacName');
  const dates= document.getElementById('zodiacDates');
  const traits=document.getElementById('zodiacTraits');
  if (sym)   sym.textContent   = z.symbol;
  if (name)  name.textContent  = z.name;
  if (dates) dates.textContent = z.dates;
  if (traits) {
    traits.innerHTML = z.traits.map(t => `<span class="zodiac-trait">${t}</span>`).join('');
  }
  drawStarMap(z);
}

function drawStarMap(z) {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);

  // Background
  const bg = ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,W/2);
  bg.addColorStop(0,'#1a0040'); bg.addColorStop(1,'#050010');
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

  // Tiny random bg stars
  for (let i=0; i<80; i++) {
    ctx.beginPath();
    ctx.arc(Math.random()*W, Math.random()*H, Math.random()*1.5, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${0.2+Math.random()*0.5})`;
    ctx.fill();
  }

  // Constellation lines
  ctx.strokeStyle = 'rgba(255,215,0,0.3)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4,6]);
  ctx.beginPath();
  z.stars.forEach((s,i) => { i===0 ? ctx.moveTo(s[0],s[1]) : ctx.lineTo(s[0],s[1]); });
  ctx.stroke();
  ctx.setLineDash([]);

  // Bright constellation stars
  z.stars.forEach(s => {
    const grd = ctx.createRadialGradient(s[0],s[1],0,s[0],s[1],10);
    grd.addColorStop(0,'rgba(255,215,0,1)');
    grd.addColorStop(0.5,'rgba(255,215,0,0.4)');
    grd.addColorStop(1,'rgba(255,215,0,0)');
    ctx.beginPath();
    ctx.arc(s[0],s[1],10,0,Math.PI*2);
    ctx.fillStyle = grd; ctx.fill();
    ctx.beginPath();
    ctx.arc(s[0],s[1],3,0,Math.PI*2);
    ctx.fillStyle = '#FFE866'; ctx.fill();
  });
}

// ════════════════════════════════════════════════════════
//  INIT ALL FEATURES (called from startWishing via setTimeout)
// ════════════════════════════════════════════════════════
function initAllFeatures() {
  const age = personDOB ? (new Date().getFullYear() - new Date(personDOB).getFullYear()) : 5;
  // Set candle count for 3D cake before init
  window._cakeCandleCount = Math.min(Math.max(age || 5, 1), 10);
  totalCandles = window._cakeCandleCount;
  candlesOut = 0;
  // Init 3D cake (replaces old initCandles)
  setTimeout(() => {
    if (typeof initCake3D === 'function') initCake3D();
  }, 100);
  // Init 3D gift box
  setTimeout(() => {
    if (typeof initGift3D === 'function') initGift3D();
  }, 150);
  startFunStats(personDOB);
  initZodiac(personDOB);
}
