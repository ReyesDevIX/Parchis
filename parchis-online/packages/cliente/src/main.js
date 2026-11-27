/**
 * ============================================================================
 * Lógica Funcional - Parchís Online
 * Ruta esperada: src/main.js
 * ============================================================================
 */

const mockPlayers = [
    { name: 'AnaParchis', colorClass: 'bg-emerald-500', colorName: 'Verde' },
    { name: 'David_99', colorClass: 'bg-amber-500', colorName: 'Amarillo' },
    { name: 'ElenaGamer', colorClass: 'bg-blue-500', colorName: 'Azul' }
];
let mockIndex = 0;

function showScreen(screenId) {
    const homeScreen = document.getElementById('screen-home');
    const lobbyScreen = document.getElementById('screen-lobby');

    if (screenId === 'screen-home') {
        homeScreen.classList.remove('hidden');
        lobbyScreen.classList.add('hidden');
    } else {
        homeScreen.classList.add('hidden');
        lobbyScreen.classList.remove('hidden');
    }
}

function createNewRoom() {
    const playerNameInput = document.getElementById('player-name').value.trim();
    const playerName = playerNameInput || 'Jugador 1';
    
    const randomCode = 'PAR-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('display-room-code').textContent = randomCode;

    document.getElementById('players-list').innerHTML = '';
    mockIndex = 0;

    renderPlayer(playerName, 'bg-rose-500', 'Rojo', true);

    showScreen('screen-lobby');
}

function joinRoomWithCode() {
    const codeInput = document.getElementById('room-code-input');
    const errorMsg = document.getElementById('join-error-msg');
    const playerName = document.getElementById('player-name').value.trim() || 'Invitado';

    if (!codeInput.value.trim()) {
        errorMsg.classList.remove('hidden');
        codeInput.focus();
        return;
    }

    errorMsg.classList.add('hidden');
    document.getElementById('display-room-code').textContent = codeInput.value.trim().toUpperCase();
    document.getElementById('players-list').innerHTML = '';
    mockIndex = 0;

    renderPlayer(playerName, 'bg-emerald-500', 'Verde', false);

    showScreen('screen-lobby');
}

function copyRoomCode() {
    const code = document.getElementById('display-room-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btnText = document.getElementById('copy-btn-text');
        btnText.textContent = '¡Copiado!';
        setTimeout(() => {
            btnText.textContent = 'Copiar';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
        alert('Código copiado: ' + code);
    });
}

function simulateJoinPlayer() {
    if (mockIndex < mockPlayers.length) {
        const p = mockPlayers[mockIndex];
        renderPlayer(p.name, p.colorClass, p.colorName, false);
        mockIndex++;
    }
}

function renderPlayer(name, bgClass, colorLabel, isHost) {
    const list = document.getElementById('players-list');
    const emptyState = document.getElementById('players-empty-state');
    const startBtn = document.getElementById('btn-start-game');

    if (emptyState) emptyState.classList.add('hidden');

    const li = document.createElement('li');
    li.className = "flex items-center justify-between p-3.5 rounded-2xl glass-panel transition-all";
    
    const badgeHtml = isHost 
        ? '<span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50">Anfitrión</span>'
        : '<span class="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">Listo</span>';

    const initials = name.substring(0, 2).toUpperCase();

    li.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="relative">
                <div class="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center font-black text-white text-sm">
                    ${initials}
                </div>
                <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${bgClass} shadow-md border-2 border-white/20" title="Color: ${colorLabel}"></span>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <span class="font-extrabold text-white text-sm">${name}</span>
                    ${badgeHtml}
                </div>
                <span class="text-[11px] text-white/60 font-semibold">Fichas color: ${colorLabel}</span>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl glass-panel-dark flex items-center justify-center text-emerald-400 text-xs">
                <i class="fa-solid fa-check"></i>
            </div>
        </div>
    `;

    list.appendChild(li);

    const count = list.children.length;
    document.getElementById('connected-count').textContent = count;

    if (count >= 2) {
        startBtn.disabled = false;
        startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        startBtn.classList.add('hover:bg-white/20', 'active:scale-95', 'text-emerald-400', 'border-emerald-400/50');
    }
}

function sendChatMessage(e) {
    e.preventDefault(); 
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    const chatContainer = document.getElementById('chat-messages');
    
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const msgDiv = document.createElement('div');
    msgDiv.className = "flex flex-col gap-1";
    msgDiv.innerHTML = `
        <div class="flex items-center gap-1.5 text-[11px]">
            <span class="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></span>
            <span class="font-extrabold text-white/90">Tú</span>
        </div>
        <div class="glass-btn p-3 rounded-2xl rounded-tl-sm text-white self-start max-w-[88%] font-semibold border border-white/20">
            ${escapeHtml(text)}
            <time datetime="${timeStr}">${timeStr}</time>
        </div>
    `;

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    input.value = '';
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
}

/**
 * --- CAMBIO DE FONDO DINÁMICO (6 Colores) ---
 */
function changeTheme(color) {
    const body = document.body;
    
    body.classList.remove(
        'theme-default', 
        'theme-red', 
        'theme-blue', 
        'theme-yellow', 
        'theme-green', 
        'theme-violet', 
        'theme-orange'
    );
    
    body.classList.add(`theme-${color}`);
}

// Los atributos de evento del HTML acceden a estas funciones desde window.
Object.assign(window, {
  showScreen,
  createNewRoom,
  joinRoomWithCode,
  copyRoomCode,
  simulateJoinPlayer,
  changeTheme,
  sendChatMessage,
});

const modeToggle = document.querySelector('.mode-toggle');
const themeKey = 'parchis-color-mode';

function applyMode(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  modeToggle.setAttribute('aria-pressed', String(dark));
  modeToggle.title = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
}

let darkMode = false;
try {
  darkMode = localStorage.getItem(themeKey) === 'dark';
} catch {
  // El navegador puede bloquear el almacenamiento local.
}
applyMode(darkMode);
modeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  applyMode(dark);
  try {
    localStorage.setItem(themeKey, dark ? 'dark' : 'light');
  } catch {
    // La elección sigue activa durante esta sesión.
  }
});

const board = document.querySelector('.board');
const cover = board.closest('.cover');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function resetTilt() {
  board.style.removeProperty('--tilt-x');
  board.style.removeProperty('--tilt-y');
}

cover.addEventListener('mousemove', (event) => {
  if (reducedMotion.matches) return;
  const bounds = cover.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  board.classList.add('is-interactive');
  board.style.setProperty('--tilt-x', -y * 14 + 'deg');
  board.style.setProperty('--tilt-y', x * 18 + 'deg');
});
cover.addEventListener('mouseleave', resetTilt);
reducedMotion.addEventListener('change', resetTilt);


const splash = document.querySelector('.splash');
if (reducedMotion.matches) {
  splash.remove();
} else {
  const introEvents = new AbortController();
  const options = { signal: introEvents.signal };

  function dismissIntro() {
    introEvents.abort();
    splash.remove();
  }

  splash.addEventListener('click', dismissIntro, options);
  document.addEventListener('keydown', (event) => {
    event.preventDefault();
    dismissIntro();
  }, { ...options, capture: true });
  splash.addEventListener('animationend', (event) => {
    if (event.animationName === 'splash-exit') dismissIntro();
  }, options);
  reducedMotion.addEventListener('change', dismissIntro, options);
  // El CSS puede haber terminado antes de que se cargue el módulo.
  if (getComputedStyle(splash).visibility === 'hidden') dismissIntro();
}
