// Socket connection
const socket = io();

// ==========================================
// AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Unlock audio on first user click
document.addEventListener('click', initAudio, { once: false });

function playSound(type) {
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const now = audioCtx.currentTime;

    if (type === 'select') {
      // Crisp metallic sword draw / coin clink
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.09);
      
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.14);
    } 
    else if (type === 'move') {
      // Heavy leather boot step on stone flagstone
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.12);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(240, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.12);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.12);
    } 
    else if (type === 'attack') {
      // Sharp steel sword slash & blade clash
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.22);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.22);
    } 
    else if (type === 'hit') {
      // Heavy oak shield bash / iron armor impact
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.18);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 0.18);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.18);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.18);
    } 
    else if (type === 'death') {
      // Stone crumble & armor shatter explosion
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.55);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(30, now + 0.55);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.55);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.55);
    } 
    else if (type === 'turn') {
      // Royal heraldic brass trumpet fanfare chord (C5, E5, G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);

        gain.gain.setValueAtTime(0.08, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + 0.35);
      });
    }
    else if (type === 'dodge') {
      // Swift cloaked evasion whoosh
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.22);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.22);
      filter.Q.setValueAtTime(6, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.22);
    }
    else if (type === 'crit') {
      // Resonant blade cleave + roaring crowd burst
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      playSound('hit');
    }
    else if (type === 'error') {
      // Dull low wooden thud
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.warn("Audio playback not supported: ", e);
  }
}

// Game State variables
let myTeam = null;           // 'blue' or 'red'

// Cinematic camera variables
let cameraTargetPosition = new THREE.Vector3();
let cameraTargetLookAt = new THREE.Vector3();
let cameraDefaultPosition = new THREE.Vector3();
let controlsDefaultTarget = new THREE.Vector3(0, 0, 0);
let isCinematicActive = false;
let cinematicTimer = 0;
let cameraShakeIntensity = 0;

// Floating Combat UI variables
let floatingUIList = [];
let myUsername = '';         // Confirmed username
let opponentUsername = '';   // Opponent's username
let currentRoomCode = null;
let activeTeam = 'blue';
let currentTurn = 1;
let unitsData = [];          // State of units from server
let selectedUnitId = null;

// Three.js Scene Variables
let scene, camera, renderer, controls;
let tileMeshes = []; // 12x12 array of grid cubes
const unitMeshes = {}; // Key: unitId, Value: THREE.Group
let highlightPlanes = []; // Holds range indicator meshes (green/red)
let hoverHighlightMesh; // Wireframe outline for hover
const debrisList = []; // Particle effects list
let projectiles = []; // Menzilli mermi ve büyü efektleri listesi

// Medieval Castle Arena Environment lists
let torchLights = [];
let spectatorList = [];
let emberParticles = null;

// Raycasting & Mouse Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Clock for delta time calculations
const clock = new THREE.Clock();

// ==========================================
// DOM ELEMENTS & LOBBY LOGIC
// ==========================================
const lobbyScreen = document.getElementById('lobby-screen');
const waitingScreen = document.getElementById('waiting-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const errorToast = document.getElementById('error-toast');
const errorToastText = document.getElementById('error-toast-text');

const roomInput = document.getElementById('room-code-input');
const joinBtn = document.getElementById('join-btn');
const createBtn = document.getElementById('create-btn');
const displayRoomCode = document.getElementById('display-room-code');
const lobbyStatus = document.getElementById('lobby-status');

// Username step elements
const usernameInput = document.getElementById('username-input');
const usernameConfirmBtn = document.getElementById('username-confirm-btn');
const usernameStep = document.getElementById('username-step');
const roomStep = document.getElementById('room-step');
const badgeUsername = document.getElementById('badge-username');

// AI step elements
const aiModeBtn = document.getElementById('ai-mode-btn');
const aiDifficultyStep = document.getElementById('ai-difficulty-step');
const aiEasyBtn = document.getElementById('ai-easy-btn');
const aiMediumBtn = document.getElementById('ai-medium-btn');
const aiHardBtn = document.getElementById('ai-hard-btn');
const aiBackBtn = document.getElementById('ai-back-btn');

// HUD elements
const hudRoomCode = document.getElementById('hud-room-code');
const hudTurnCount = document.getElementById('hud-turn-count');
const hudTeamColor = document.getElementById('hud-team-color');
const turnBanner = document.getElementById('turn-banner');
const turnTextSpan = document.getElementById('turn-text-span');
const endTurnBtn = document.getElementById('end-turn-btn');

// Diagnostic details
const unitDiagnostic = document.getElementById('unit-diagnostic');
const diagName = document.getElementById('diag-name');
const diagType = document.getElementById('diag-type');
const diagTeam = document.getElementById('diag-team');
const diagHpText = document.getElementById('diag-hp-text');
const diagHpFill = document.getElementById('diag-hp-fill');
const diagAtk = document.getElementById('diag-atk');
const diagRange = document.getElementById('diag-range');
const diagMov = document.getElementById('diag-mov');
const diagAp = document.getElementById('diag-ap');

const combatLog = document.getElementById('combat-log');
const returnLobbyBtn = document.getElementById('return-lobby-btn');
const diagCloseBtn = document.getElementById('diag-close-btn');
const logMobileToggleBtn = document.getElementById('log-mobile-toggle-btn');
const camResetBtn = document.getElementById('cam-reset-btn');

// Waiting screen countdown and cancel elements
const cancelRoomBtn = document.getElementById('cancel-room-btn');
const waitingCountdown = document.getElementById('waiting-countdown');
const waitingTimerProgress = document.getElementById('waiting-timer-progress');
let waitingTimerInterval = null;

function startWaitingTimer(expiresAt, durationSeconds = 60) {
  stopWaitingTimer();

  function update() {
    const now = Date.now();
    const remainingMs = Math.max(0, expiresAt - now);
    const remainingSec = Math.ceil(remainingMs / 1000);
    const pct = Math.max(0, Math.min(100, (remainingMs / (durationSeconds * 1000)) * 100));

    if (waitingCountdown) {
      waitingCountdown.textContent = `${remainingSec}s`;
      if (remainingSec <= 15) {
        waitingCountdown.classList.add('warning');
      } else {
        waitingCountdown.classList.remove('warning');
      }
    }

    if (waitingTimerProgress) {
      waitingTimerProgress.style.width = `${pct}%`;
      if (remainingSec <= 15) {
        waitingTimerProgress.classList.add('warning');
      } else {
        waitingTimerProgress.classList.remove('warning');
      }
    }

    if (remainingMs <= 0) {
      stopWaitingTimer();
    }
  }

  update();
  waitingTimerInterval = setInterval(update, 500);
}

function stopWaitingTimer() {
  if (waitingTimerInterval) {
    clearInterval(waitingTimerInterval);
    waitingTimerInterval = null;
  }
  if (waitingCountdown) {
    waitingCountdown.textContent = '60s';
    waitingCountdown.classList.remove('warning');
  }
  if (waitingTimerProgress) {
    waitingTimerProgress.style.width = '100%';
    waitingTimerProgress.classList.remove('warning');
  }
}

// Cancel Room Button Click Handler
if (cancelRoomBtn) {
  cancelRoomBtn.addEventListener('click', () => {
    if (currentRoomCode) {
      socket.emit('cancelRoom', { roomCode: currentRoomCode });
    }
    stopWaitingTimer();
    waitingScreen.classList.remove('active');
    lobbyScreen.classList.add('active');
    lobbyStatus.textContent = 'Oda oluşturma iptal edildi.';
    currentRoomCode = null;
    playSound('select');
  });
}

// Diagnostic Close Button
if (diagCloseBtn) {
  diagCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deselectUnit();
    playSound('select');
  });
}

// Guide Modal elements
const guideModal = document.getElementById('guide-modal');
const guideOpenBtnLobby = document.getElementById('guide-open-btn-lobby');
const guideOpenBtnGame = document.getElementById('guide-open-btn-game');
const guideCloseBtn = document.getElementById('guide-close-btn');

function openGuide() {
  if (guideModal) guideModal.classList.remove('hidden');
  playSound('select');
}
function closeGuide() {
  if (guideModal) guideModal.classList.add('hidden');
  playSound('select');
}

if (guideOpenBtnLobby) guideOpenBtnLobby.addEventListener('click', openGuide);
if (guideOpenBtnGame) guideOpenBtnGame.addEventListener('click', openGuide);
if (guideCloseBtn) guideCloseBtn.addEventListener('click', closeGuide);

if (guideModal) {
  guideModal.addEventListener('click', (e) => {
    if (e.target === guideModal) closeGuide();
  });
}

// ==========================================
// USERNAME STEP LOGIC
// ==========================================
function confirmUsername() {
  const raw = usernameInput.value.trim();
  if (raw.length < 2) {
    showError('Komutan adı en az 2 karakter olmalıdır.');
    return;
  }
  myUsername = raw.toUpperCase();
  // Update badge
  badgeUsername.textContent = myUsername;
  // Animate step transition
  usernameStep.classList.add('hidden');
  roomStep.classList.remove('hidden');
  lobbyStatus.textContent = `Hoş geldin, ${myUsername}! Oda oluştur veya katıl.`;
  playSound('turn');
}

// Allow Enter key on username input
usernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') confirmUsername();
});

usernameConfirmBtn.addEventListener('click', confirmUsername);

// Lobby Button Events
createBtn.addEventListener('click', () => {
  if (!myUsername) { showError('Önce kullanıcı adı belirleyin.'); return; }
  socket.emit('createRoom', { username: myUsername });
  lobbyStatus.textContent = 'Taktik oda oluşturuluyor...';
});

joinBtn.addEventListener('click', () => {
  if (!myUsername) { showError('Önce kullanıcı adı belirleyin.'); return; }
  const code = roomInput.value.trim().toUpperCase();
  if (code.length !== 4) {
    showError('Oda kodu tam olarak 4 harfli olmalıdır.');
    return;
  }
  socket.emit('joinRoom', { code, username: myUsername });
  lobbyStatus.textContent = `Odaya (${code}) bağlanılıyor...`;
});

// AI Mode Button click
aiModeBtn.addEventListener('click', () => {
  roomStep.classList.add('hidden');
  aiDifficultyStep.classList.remove('hidden');
  lobbyStatus.textContent = 'Yapay zeka zorluk seviyesini seçin.';
  playSound('select');
});

// AI Back Button click
aiBackBtn.addEventListener('click', () => {
  aiDifficultyStep.classList.add('hidden');
  roomStep.classList.remove('hidden');
  lobbyStatus.textContent = `Komutan ${myUsername}, oda seçin.`;
  playSound('select');
});

// Start AI Room events
function startAIGame(difficulty) {
  if (!myUsername) { showError('Önce kullanıcı adı belirleyin.'); return; }
  socket.emit('createRoom', { 
    username: myUsername, 
    vsAI: true, 
    difficulty: difficulty 
  });
  lobbyStatus.textContent = `Bot rakip hazırlanıyor (${difficulty.toUpperCase()})...`;
}

aiEasyBtn.addEventListener('click', () => startAIGame('easy'));
aiMediumBtn.addEventListener('click', () => startAIGame('medium'));
aiHardBtn.addEventListener('click', () => startAIGame('hard'));

endTurnBtn.addEventListener('click', () => {
  if (myTeam === activeTeam) {
    socket.emit('endTurn', { roomCode: currentRoomCode });
  }
});

// Log Toggle Panel Minimizer
const logToggleBtn = document.getElementById('log-toggle-btn');
const combatLogPanel = document.getElementById('combat-log-panel');

function toggleCombatLog() {
  if (!combatLogPanel) return;
  combatLogPanel.classList.toggle('minimized');
  const isMin = combatLogPanel.classList.contains('minimized');
  if (logToggleBtn) {
    logToggleBtn.textContent = isMin ? '◀' : '▶';
  }
  playSound('select');
}

if (logToggleBtn) logToggleBtn.addEventListener('click', toggleCombatLog);
if (logMobileToggleBtn) logMobileToggleBtn.addEventListener('click', toggleCombatLog);

// On mobile phones, default combat log to minimized so it doesn't obstruct view
if (window.innerWidth <= 768 && combatLogPanel) {
  combatLogPanel.classList.add('minimized');
  if (logToggleBtn) logToggleBtn.textContent = '◀';
}

// Camera Reset Button
if (camResetBtn) {
  camResetBtn.addEventListener('click', () => {
    resetCameraView();
    playSound('select');
  });
}

// Prevent double-tap zoom on iOS / touch devices
document.addEventListener('dblclick', (e) => {
  e.preventDefault();
}, { passive: false });

returnLobbyBtn.addEventListener('click', () => {
  window.location.reload();
});

// Toast notifications
function showError(message) {
  errorToastText.textContent = message;
  errorToast.classList.add('show');
  playSound('error');
  setTimeout(() => {
    errorToast.classList.remove('show');
  }, 4000);
}

// Log entries
function addLog(text, type = 'system') {
  const entry = document.createElement('div');
  entry.classList.add('log-entry');
  if (type === 'blue') entry.classList.add('blue-team');
  else if (type === 'red') entry.classList.add('red-team');
  else if (type === 'damage') entry.classList.add('damage-msg');
  else if (type === 'kill') entry.classList.add('kill-msg');
  else entry.classList.add('system-msg');

  entry.textContent = `[Tactical] ${text}`;
  combatLog.appendChild(entry);
  combatLog.scrollTop = combatLog.scrollHeight;
}

// ==========================================
// SOCKET EVENT HANDLERS
// ==========================================
socket.on('roomCreated', ({ code, timeoutDuration, expiresAt }) => {
  currentRoomCode = code;
  lobbyScreen.classList.remove('active');
  waitingScreen.classList.add('active');
  displayRoomCode.textContent = code;

  // Start 1-minute countdown timer
  const exp = expiresAt || (Date.now() + (timeoutDuration || 60) * 1000);
  startWaitingTimer(exp, timeoutDuration || 60);
});

socket.on('roomTimeout', ({ message }) => {
  stopWaitingTimer();
  currentRoomCode = null;
  waitingScreen.classList.remove('active');
  lobbyScreen.classList.add('active');
  showError(message || '1 dakika boyunca bağlantı olmadığı için oda kapatıldı.');
  lobbyStatus.textContent = 'Oda zaman aşımına uğradı. Yeni maç oluşturun veya katılın.';
});

socket.on('roomCancelled', ({ message }) => {
  stopWaitingTimer();
  currentRoomCode = null;
  waitingScreen.classList.remove('active');
  lobbyScreen.classList.add('active');
  lobbyStatus.textContent = message || 'Oda oluşturma iptal edildi.';
});

socket.on('errorMsg', ({ message }) => {
  showError(message);
  lobbyStatus.textContent = 'Lobi bağlantısı başarısız.';
});

socket.on('gameStart', ({ team, players, gameState, roomCode }) => {
  stopWaitingTimer();
  myTeam = team;
  currentRoomCode = roomCode;
  activeTeam = gameState.activeTeam;
  currentTurn = gameState.turn;
  unitsData = gameState.units;

  // Transition UI
  waitingScreen.classList.remove('active');
  lobbyScreen.classList.remove('active');
  gameScreen.classList.add('active');

  // Store opponent username
  const myPlayerData = players.find(p => p.team === team);
  const oppPlayerData = players.find(p => p.team !== team);
  if (myPlayerData) myUsername = myPlayerData.username || myUsername;
  if (oppPlayerData) opponentUsername = oppPlayerData.username || 'RAKİP';

  // Update HUD values
  hudRoomCode.textContent = currentRoomCode;
  hudTurnCount.textContent = currentTurn;
  const teamText = myTeam === 'blue' ? 'MAVİ' : 'KIRMIZI';
  // Show username in HUD instead of just team color
  hudTeamColor.textContent = myUsername;
  if (myTeam === 'blue') {
    hudTeamColor.className = 'value neon-text-blue';
  } else {
    hudTeamColor.className = 'value neon-text-red';
  }

  addLog(`⚔️ Borazanlar çalıyor! Ortaçağ arenasına hoş geldiniz.`, 'system');
  addLog(`${myUsername} — ${teamText} sancağına atandınız.`, myTeam);
  addLog(`Rakip Şövalye: ${opponentUsername}`, 'system');

  // Initialize the 3D battlefield
  initThreeJS();
  syncUnits(unitsData);
  updateTurnUI();
});

socket.on('unitMoved', ({ unitId, oldX, oldZ, newX, newZ, apRemaining, gameState }) => {
  unitsData = gameState.units;
  const unit = unitsData.find(u => u.id === unitId);
  const mesh = unitMeshes[unitId];

  if (mesh && unit) {
    // Play move SFX
    playSound('move');

    // Add movement log
    addLog(`${unit.name}, taş döşemede (${newX}, ${newZ}) karesine ilerledi.`, unit.team);

    // Update diagnostic if selected
    if (selectedUnitId === unitId) {
      updateDiagnosticPanel(unit);
    }

    // Trigger visual lerp animation
    mesh.userData.moveAnim = {
      startX: oldX,
      startZ: oldZ,
      targetX: newX,
      targetZ: newZ,
      time: 0.5,
      elapsed: 0
    };
    mesh.userData.gridX = newX;
    mesh.userData.gridZ = newZ;
  }

  // Clear selections & indicators
  clearHighlights();
});

socket.on('unitAttacked', ({ attackerId, targetId, damage, targetHp, targetDead, isCrit, isDodge, gameState }) => {
  unitsData = gameState.units;
  const attacker = gameState.units.find(u => u.id === attackerId) || unitsData.find(u => u.id === attackerId);
  const target = unitMeshes[targetId];
  const attackerMesh = unitMeshes[attackerId];
  
  if (attackerMesh && target) {
    const targetX = target.userData.gridX;
    const targetZ = target.userData.gridZ;
    const attackerX = attackerMesh.userData.gridX;
    const attackerZ = attackerMesh.userData.gridZ;
    const targetName = target.userData.name;
    const attackerName = attackerMesh.userData.name;

    // 🎥 Dynamic Action Camera Zoom-In & Focus
    const attPos = attackerMesh.position;
    const tgtPos = target.position;
    const midPoint = new THREE.Vector3().addVectors(attPos, tgtPos).multiplyScalar(0.5);
    cameraTargetPosition.copy(midPoint).add(new THREE.Vector3(0, 3.2, myTeam === 'blue' ? -3.5 : 3.5));
    cameraTargetLookAt.copy(midPoint);
    cinematicTimer = targetDead ? 1.4 : 0.85;
    isCinematicActive = true;

    // Hasar verme, parlama ve ölüm işlemlerini yapacak olan fonksiyon
    const triggerHitProcess = () => {
      if (isDodge) {
        // 💨 SAVUŞTURMA (Dodge) Animasyonu & Sesi
        playSound('dodge');
        
        const lungeDir = new THREE.Vector3(targetX - attackerX, 0, targetZ - attackerZ).normalize();
        const dodgeDir = new THREE.Vector3(-lungeDir.z, 0, lungeDir.x).multiplyScalar(0.4);
        
        target.userData.dodgeAnim = {
          dir: dodgeDir,
          time: 0.35,
          elapsed: 0
        };

        // Spawn floating Dodge Text over target unit
        spawnFloatingDamageText(target.position, "SAVUŞTURULDU", false, true);

        addLog(`SAVUŞTURULDU! ${targetName} kılıç darbesinden ustalıkla sıyrıldı.`, 'system');
        return;
      }

      // 🛡️ Darbe Flashing & Recoil
      target.userData.hitFlashTime = 0.35;
      
      if (isCrit) {
        // 🔥 KRİTİK VURUŞ (Critical Hit)
        playSound('crit');
        cameraShakeIntensity = 0.55; 
        
        spawnDebris(targetX, targetZ, 'gold');
        // Spawn floating Crit Text over target unit
        spawnFloatingDamageText(target.position, `KRİTİK -${damage}`, true, false);
        
        addLog(`⚔️ KRİTİK DARBE! ${attackerName}, ${targetName} birliğine ${damage} ağır hasar vurdu!`, 'kill');
      } else {
        // Normal Darbe
        playSound('hit');
        spawnDebris(targetX, targetZ, target.userData.team);
        // Spawn floating Normal Damage Text over target unit
        spawnFloatingDamageText(target.position, `-${damage}`, false, false);

        addLog(`${attackerName}, ${targetName} birliğine ${damage} hasar verdi!`, 'damage');
      }

      // Spawn floating Health Bar over target unit
      spawnFloatingHealthBar(target.position, Math.max(0, targetHp), target.userData.maxHp || 90, target.userData.team);

      // 💀 Ölüm durumunu yönet
      if (targetDead) {
        setTimeout(() => {
          addLog(`💀 ${targetName} savaş meydanında yere serildi!`, 'kill');
          playSound('death');
          
          // Özel ölüm efekti
          spawnDeathEffect(target.userData.type, targetX, targetZ, target.userData.team);

          // Scene'den kaldır
          scene.remove(target);
          target.traverse(child => {
            if (child.isMesh) {
              child.geometry.dispose();
              child.material.dispose();
            }
          });
          delete unitMeshes[targetId];

          // Seçili birim öldüyse kaldır
          if (selectedUnitId === targetId) {
            selectedUnitId = null;
            unitDiagnostic.classList.add('hidden');
          }
        }, 150);
      }
    };

    // Saldırganın türü menzilli ise
    const isRanged = ['Archer', 'Mage', 'Catapult'].includes(attackerMesh.userData.type);

    if (isRanged) {
      playSound('attack');
      spawnProjectile(attackerMesh.userData.type, attackerMesh.userData.team, attackerX, attackerZ, targetX, targetZ, triggerHitProcess);
    } else {
      playSound('attack');
      attackerMesh.userData.lungeTime = 0.4;
      attackerMesh.userData.lungeDirection = new THREE.Vector3(
        targetX - attackerX,
        0,
        targetZ - attackerZ
      ).normalize();

      setTimeout(triggerHitProcess, 200);
    }
  }

  // Arayüzü temizle
  clearHighlights();

  // Diagnostics paneli hasardan sonra güncelle (biraz gecikmeli)
  setTimeout(() => {
    if (selectedUnitId === attackerId) {
      const attUnit = unitsData.find(u => u.id === attackerId);
      if (attUnit) updateDiagnosticPanel(attUnit);
    }
    if (selectedUnitId === targetId && !targetDead) {
      const tgtUnit = unitsData.find(u => u.id === targetId);
      if (tgtUnit) updateDiagnosticPanel(tgtUnit);
    }
    if (selectedUnitId && selectedUnitId !== attackerId && selectedUnitId !== targetId) {
      const selUnit = unitsData.find(u => u.id === selectedUnitId);
      if (selUnit) updateDiagnosticPanel(selUnit);
    }
  }, 500);
});

socket.on('turnEnded', ({ activeTeam: nextTeam, turn, gameState }) => {
  activeTeam = nextTeam;
  currentTurn = turn;
  unitsData = gameState.units;

  // Replenish state references
  syncUnits(unitsData);
  hudTurnCount.textContent = currentTurn;
  updateTurnUI();

  // Play turn transition sound
  playSound('turn');

  // Clear visual highlights
  clearHighlights();

  const activeTeamText = activeTeam === 'blue' ? 'MAVİ' : 'KIRMIZI';
  addLog(`Hamle tamamlandı. Sıra ${activeTeamText} sancağında!`, 'system');
});

socket.on('gameOver', ({ winner }) => {
  gameState = { winner };
  gameOverScreen.classList.add('active');
  const title = document.getElementById('game-over-title');
  const desc = document.getElementById('game-over-desc');

  if (winner === myTeam) {
    title.textContent = "ZAFER KAZANILDI";
    title.className = "medieval-title gold-text-title";
    desc.textContent = "Tüm düşman birlikleri dize getirildi. Meydan sizin!";
  } else {
    title.textContent = "BOZGUN";
    title.className = "medieval-title neon-text-red";
    desc.textContent = "Birlikleriniz kale meydanını savunamadı.";
  }
});

socket.on('opponentDisconnected', ({ message }) => {
  addLog(message, 'system');
  showError('Rakip bağlantısı kesildi. 5 saniye içinde lobiye dönülüyor.');
  setTimeout(() => {
    window.location.reload();
  }, 5000);
});

// ==========================================
// CAMERA PRESETS & DYNAMIC SCALING
// ==========================================
function getCameraPreset() {
  const aspect = window.innerWidth / window.innerHeight;
  let distMult = 1.0;
  // If portrait (aspect < 1.0, e.g. phones 9/16, 9/19.5), scale distance proportionally
  if (aspect < 1.0) {
    distMult = Math.min(2.1, Math.max(1.15, 1.28 / aspect));
  }
  const y = 11 * distMult;
  const z = (myTeam === 'blue' ? -13 : 13) * distMult;
  return { x: 0, y, z };
}

function resetCameraView() {
  if (!camera || !controls) return;
  const preset = getCameraPreset();
  cameraDefaultPosition.set(preset.x, preset.y, preset.z);
  controlsDefaultTarget.set(0, 0, 0);
  camera.position.copy(cameraDefaultPosition);
  controls.target.copy(controlsDefaultTarget);
  controls.update();
}

// ==========================================
// THREE.JS ENGINE SETUP (MEDIEVAL CASTLE ARENA)
// ==========================================
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  
  // Create Scene with warm dark midnight sky
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c0a08);
  scene.fog = new THREE.FogExp2(0x0c0a08, 0.022);

  // Setup Camera with dynamic aspect framing
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
  const initialCam = getCameraPreset();
  camera.position.set(initialCam.x, initialCam.y, initialCam.z);

  // Setup Renderer with mobile GPU 60fps DPR capping
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Controls (Orbit)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 32;
  controls.maxPolarAngle = Math.PI / 2.12;
  controls.minPolarAngle = Math.PI / 12;
  controls.target.set(0, 0, 0);
  controls.update();

  // Natural Moon & Ambient Lighting
  const ambient = new THREE.AmbientLight(0xffecd6, 0.62);
  scene.add(ambient);

  const moonLight = new THREE.DirectionalLight(0xdfe8f5, 0.85);
  moonLight.position.set(8, 16, 6);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 1024;
  moonLight.shadow.mapSize.height = 1024;
  moonLight.shadow.camera.near = 0.5;
  moonLight.shadow.camera.far = 35;
  const d = 10;
  moonLight.shadow.camera.left = -d;
  moonLight.shadow.camera.right = d;
  moonLight.shadow.camera.top = d;
  moonLight.shadow.camera.bottom = -d;
  scene.add(moonLight);

  // Secondary soft warm torch bounce
  const bounceLight = new THREE.DirectionalLight(0xff9944, 0.35);
  bounceLight.position.set(-6, 8, -6);
  scene.add(bounceLight);

  // Build Medieval Castle Arena, Grandstands, Crowds & Torches
  buildMedievalArenaEnvironment();

  // Build Floating Amber Sparks & Embers
  buildEmberParticles();

  // Create 12x12 Medieval Stone Flagstone Grid
  buildVoxelGrid();

  // Event Listeners (Mouse + Touch Pointer events with Tap vs Drag disambiguation)
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(onWindowResize, 100);
    setTimeout(onWindowResize, 350);
  });

  renderer.domElement.addEventListener('mousemove', onMouseMove, { passive: true });
  renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true });
  renderer.domElement.addEventListener('pointerup', onPointerUp, { passive: true });

  // Save default position after setting up
  setTimeout(() => {
    const preset = getCameraPreset();
    cameraDefaultPosition.set(preset.x, preset.y, preset.z);
    controlsDefaultTarget.copy(controls.target);
  }, 100);

  // Start Animation Loop
  animate();
}

function buildEmberParticles() {
  const count = 160;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 22;
    positions[i + 1] = Math.random() * 8;
    positions[i + 2] = (Math.random() - 0.5) * 22;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.16,
    color: 0xffaa22,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  emberParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(emberParticles);
}

function buildMedievalArenaEnvironment() {
  torchLights = [];
  spectatorList = [];

  const stoneDarkMat = new THREE.MeshStandardMaterial({ color: 0x272421, roughness: 0.95 });
  const stoneMidMat = new THREE.MeshStandardMaterial({ color: 0x38342f, roughness: 0.9 });
  const stoneLightMat = new THREE.MeshStandardMaterial({ color: 0x4a453f, roughness: 0.85 });
  const woodStandMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.9 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.4, metalness: 0.8 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.7 });

  // 1. CORNER BATTLE TOWERS (4 Large Castle Watchtowers)
  const towerPositions = [
    [-8.6, -8.6],
    [8.6, -8.6],
    [-8.6, 8.6],
    [8.6, 8.6]
  ];

  towerPositions.forEach(([tx, tz]) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(tx, 0, tz);

    // Tower main body
    const towerBody = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.5, 2.8), stoneDarkMat);
    towerBody.position.set(0, 1.8, 0);
    towerBody.castShadow = true;
    towerBody.receiveShadow = true;
    towerGroup.add(towerBody);

    // Tower cornices
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.3, 3.1), stoneLightMat);
    cornice.position.set(0, 4.15, 0);
    towerGroup.add(cornice);

    // Crenellations / Merlons (battlements on top)
    const merlonCoords = [
      [-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3],
      [0, -1.3], [0, 1.3], [-1.3, 0], [1.3, 0]
    ];
    merlonCoords.forEach(([mx, mz]) => {
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.5), stoneMidMat);
      merlon.position.set(mx, 4.5, mz);
      merlon.castShadow = true;
      towerGroup.add(merlon);
    });

    // Flagpole & Banner
    const flagpole = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 0.08), woodStandMat);
    flagpole.position.set(0, 5.2, 0);
    towerGroup.add(flagpole);

    const bannerColor = (tx > 0) ? 0x991b1b : 0x1e40af; // Red team vs Blue team corners
    const bannerMat = new THREE.MeshStandardMaterial({ color: bannerColor, roughness: 0.7, side: THREE.DoubleSide });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.6), bannerMat);
    banner.position.set(0, 5.5, 0.32);
    towerGroup.add(banner);

    scene.add(towerGroup);
  });

  // 2. FORTRESS WALLS (North, South, East, West connecting walls)
  [[-8.6, 0], [8.6, 0]].forEach(([dummy, ry], idx) => {
    const wallZ = (idx === 0) ? -8.6 : 8.6;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(14.4, 2.8, 1.2), stoneDarkMat);
    wall.position.set(0, 1.0, wallZ);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    const parapet = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.4, 1.4), stoneMidMat);
    parapet.position.set(0, 2.5, wallZ);
    scene.add(parapet);
  });

  // 3. ROYAL FACTION BANNERS DRAPED OVER WALLS
  const blueTapestry = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.06), new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 }));
  blueTapestry.position.set(0, 1.2, -7.95);
  scene.add(blueTapestry);
  const blueGoldCrest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.08), goldTrimMat);
  blueGoldCrest.position.set(0, 1.3, -7.94);
  scene.add(blueGoldCrest);

  const redTapestry = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.06), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.7 }));
  redTapestry.position.set(0, 1.2, 7.95);
  scene.add(redTapestry);
  const redGoldCrest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.08), goldTrimMat);
  redGoldCrest.position.set(0, 1.3, 7.94);
  scene.add(redGoldCrest);

  // 4. ARENA GRANDSTANDS & SPECTATOR BLEACHERS (East and West sides)
  const standSides = [-8.4, 8.4];
  standSides.forEach(sx => {
    const isEast = sx > 0;
    const standGroup = new THREE.Group();
    standGroup.position.set(sx, 0, 0);

    // 3 Tiers of wooden bleachers
    for (let tier = 0; tier < 3; tier++) {
      const tierHeight = 0.55 * (tier + 1);
      const tierOffset = (tier * 0.75) * (isEast ? 1 : -1);

      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.7, tierHeight, 12.0), woodStandMat);
      bench.position.set(tierOffset, tierHeight * 0.5, 0);
      bench.castShadow = true;
      bench.receiveShadow = true;
      standGroup.add(bench);

      // Populate each tier with living medieval spectators
      const tunicColors = [0x5c3d2e, 0x8b5a2b, 0x2e4057, 0x3d5a40, 0x7c3f00, 0x4a5568, 0x6b21a8, 0x1e3a8a, 0x991b1b, 0x92400e];
      const countOnTier = 7;
      for (let s = 0; s < countOnTier; s++) {
        const specZ = -4.8 + s * 1.6 + (Math.random() - 0.5) * 0.3;
        const specX = tierOffset + (isEast ? -0.1 : 0.1);
        const specY = tierHeight;

        const specGroup = new THREE.Group();
        specGroup.position.set(specX, specY, specZ);
        if (isEast) specGroup.rotation.y = -Math.PI / 2;
        else specGroup.rotation.y = Math.PI / 2;

        const tunicColor = tunicColors[Math.floor(Math.random() * tunicColors.length)];
        const specTunicMat = new THREE.MeshStandardMaterial({ color: tunicColor, roughness: 0.8 });
        const specSkinMat = new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.8 });

        // Body / Tunic
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.18), specTunicMat);
        body.position.set(0, 0.17, 0);
        body.castShadow = true;
        specGroup.add(body);

        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), specSkinMat);
        head.position.set(0, 0.42, 0);
        specGroup.add(head);

        // Hat / Cap (Peasant hood, merchant beret, guard kettle hat)
        const hatType = Math.floor(Math.random() * 3);
        if (hatType === 0) {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.22), specTunicMat);
          cap.position.set(0, 0.52, 0);
          specGroup.add(cap);
        } else if (hatType === 1) {
          const kettle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.24), ironMat);
          kettle.position.set(0, 0.52, 0);
          specGroup.add(kettle);
        }

        // Arm (right arm that waves during cheer)
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), specTunicMat);
        arm.position.set(0.16, 0.22, 0.04);
        specGroup.add(arm);

        standGroup.add(specGroup);

        spectatorList.push({
          group: specGroup,
          arm: arm,
          head: head,
          baseY: specY,
          speed: 0.003 + Math.random() * 0.004,
          offset: Math.random() * Math.PI * 2
        });
      }
    }

    scene.add(standGroup);
  });

  // 5. EIGHT ARENA FLAMING TORCHES ON STONE PILLARS
  const torchCoords = [
    [-6.3, -6.3], [6.3, -6.3], [-6.3, 6.3], [6.3, 6.3], // 4 Corners
    [0, -6.4], [0, 6.4], [-6.4, 0], [6.4, 0]             // 4 Center Sconces
  ];

  torchCoords.forEach(([px, pz], idx) => {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(px, 0, pz);

    // Stone plinth pillar
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.8, 0.55), stoneMidMat);
    pillar.position.set(0, 0.9, 0);
    pillar.castShadow = true;
    pillarGroup.add(pillar);

    // Iron torch bracket
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.2), ironMat);
    bracket.position.set(0, 1.9, 0);
    pillarGroup.add(bracket);

    // Glowing flame voxels
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xff7700,
      emissive: 0xff4400,
      emissiveIntensity: 2.2,
      roughness: 0.3
    });
    const flame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.22), flameMat);
    flame.position.set(0, 2.15, 0);
    flame.name = "torchFlame";
    pillarGroup.add(flame);

    // Inner bright yellow flame core
    const flameCore = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.12), new THREE.MeshStandardMaterial({
      color: 0xffea75,
      emissive: 0xffd700,
      emissiveIntensity: 3.0
    }));
    flameCore.position.set(0, 2.18, 0);
    pillarGroup.add(flameCore);

    // Dynamic flickering PointLight
    const torchLight = new THREE.PointLight(0xff8c1a, 1.4, 9.5);
    torchLight.position.set(0, 2.3, 0);
    torchLight.userData = {
      baseIntensity: 1.35 + (idx % 2) * 0.15,
      idx: idx
    };
    pillarGroup.add(torchLight);
    torchLights.push(torchLight);

    scene.add(pillarGroup);
  });
}

// Generate the 12x12 authentic Medieval Stone Arena Ground
function buildVoxelGrid() {
  const stoneTileGeo = new THREE.BoxGeometry(0.96, 0.44, 0.96);
  
  // Varied medieval flagstone palette
  const stoneColors = [
    0x35322e, 0x2b2825, 0x3d3a36, 0x2f2d2a, 0x433f3a, 0x282522
  ];

  for (let x = 0; x < 12; x++) {
    for (let z = 0; z < 12; z++) {
      // Alternating flagstone pattern with procedural stone color noise
      const colorIndex = (x * 3 + z * 7 + (x + z) % 3) % stoneColors.length;
      let baseTileColor = stoneColors[colorIndex];
      
      // Center 4 tiles have special inlaid arena ring tint
      const isCenter = (x >= 5 && x <= 6 && z >= 5 && z <= 6);
      if (isCenter) {
        baseTileColor = 0x4c4235; // slightly warmer gilded granite
      }

      const tileMat = new THREE.MeshStandardMaterial({
        color: baseTileColor,
        roughness: 0.92,
        metalness: 0.15
      });

      const tileMesh = new THREE.Mesh(stoneTileGeo, tileMat);
      // Subtle organic stone height variation
      const heightJitter = ((x * 13 + z * 17) % 7) * 0.006;
      tileMesh.position.set(x - 5.5, -0.22 - heightJitter, z - 5.5);
      tileMesh.receiveShadow = true;
      tileMesh.userData = { gridX: x, gridZ: z };
      
      scene.add(tileMesh);
      tileMeshes.push(tileMesh);
    }
  }

  // Dark stone mortar divider grid
  const gridHelper = new THREE.GridHelper(12, 12, 0xd4af37, 0x1f1c18);
  gridHelper.position.set(0, 0.002, 0);
  scene.add(gridHelper);

  // Center Arena Royal Crest Ring Inlay (Ring in flagstones)
  const ringGeo = new THREE.RingGeometry(1.4, 1.55, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
  const centerRing = new THREE.Mesh(ringGeo, ringMat);
  centerRing.rotation.x = -Math.PI / 2;
  centerRing.position.set(0, 0.005, 0);
  scene.add(centerRing);

  // Outer Chiseled Stone Rampart Curb (Thick Fortress Rim)
  const borderGeo = new THREE.BoxGeometry(12.5, 0.48, 12.5);
  const borderMat = new THREE.MeshStandardMaterial({
    color: 0x221f1c,
    roughness: 0.95,
    metalness: 0.2
  });
  const borderMesh = new THREE.Mesh(borderGeo, borderMat);
  borderMesh.position.set(0, -0.25, 0);
  borderMesh.receiveShadow = true;
  scene.add(borderMesh);

  // Iron-studded Corner Brackets & Golden Rim
  const frameGeo = new THREE.BoxGeometry(12.55, 0.5, 12.55);
  const edges = new THREE.EdgesGeometry(frameGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 });
  const frameWireframe = new THREE.LineSegments(edges, lineMat);
  frameWireframe.position.set(0, -0.25, 0);
  scene.add(frameWireframe);

  // Hover Highlight mesh: warm torchlit golden rune outline
  const hoverGeo = new THREE.BoxGeometry(1.02, 0.48, 1.02);
  const hoverEdges = new THREE.EdgesGeometry(hoverGeo);
  const hoverLineMat = new THREE.LineBasicMaterial({ color: 0xffb700, linewidth: 2.5 });
  hoverHighlightMesh = new THREE.LineSegments(hoverEdges, hoverLineMat);
  hoverHighlightMesh.position.set(0, -100, 0);
  scene.add(hoverHighlightMesh);
}

// ==========================================
// VOXEL MODELS & UNIT SYNCING
// ==========================================
function syncUnits(units) {
  // 1. Remove meshes of units that aren't on the board anymore (dead)
  for (const id in unitMeshes) {
    const stillAlive = units.some(u => u.id === id);
    if (!stillAlive) {
      // Clean up scene mesh
      const mesh = unitMeshes[id];
      scene.remove(mesh);
      mesh.traverse(child => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      delete unitMeshes[id];
    }
  }

  // 2. Add or update existing meshes
  units.forEach(unit => {
    let mesh = unitMeshes[unit.id];

    if (!mesh) {
      // Build a cute hierarchical voxel group representing this unit
      mesh = createVoxelUnit(unit.type, unit.team);
      mesh.userData = {
        unitId: unit.id,
        team: unit.team,
        type: unit.type,
        name: unit.name,
        gridX: unit.x,
        gridZ: unit.z,
        maxHp: unit.maxHp || unit.hp
      };
      // Center unit position (set to y = 0 to place on grid)
      mesh.position.set(unit.x - 5.5, 0.0, unit.z - 5.5);

      // Save references to original materials to restore after hits/flashes
      mesh.traverse(child => {
        if (child.isMesh && child.material) {
          child.userData.originalEmissive = child.material.emissive?.getHex() || 0x000000;
        }
      });

      // Align units to look at each other
      if (unit.team === 'blue') {
        mesh.rotation.y = 0; // facing forward (towards Red)
      } else {
        mesh.rotation.y = Math.PI; // facing backward (towards Blue)
      }

      scene.add(mesh);
      unitMeshes[unit.id] = mesh;
    } else {
      // Sync coordinates if not currently in a movement animation
      if (!mesh.userData.moveAnim) {
        mesh.position.set(unit.x - 5.5, 0.0, unit.z - 5.5);
        mesh.userData.gridX = unit.x;
        mesh.userData.gridZ = unit.z;
      }
    }
  });
}

// Procedural modeling of Authentic Medieval Voxel units
function createVoxelUnit(type, team) {
  const group = new THREE.Group();
  
  const tunicColor = team === 'blue' ? 0x1e3a8a : 0x991b1b;
  const tunicAccent = team === 'blue' ? 0x3b82f6 : 0xef4444;
  const helmetColor = 0x8a9ba8;
  const skinColor = 0xffd1a4;
  const shieldColor = 0x6b4423;
  const steelColor = 0xc8d6e5;
  const darkSteelColor = 0x475569;
  const goldColor = 0xd4af37;
  const woodColor = 0x5c3d2e;
  const horseColor = 0x6e473b;
  const horseManeColor = 0x1c1917;

  // Setup Standard Medieval Materials
  const tunicMat = new THREE.MeshStandardMaterial({ color: tunicColor, roughness: 0.65 });
  const tunicAccentMat = new THREE.MeshStandardMaterial({ color: tunicAccent, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
  const steelMat = new THREE.MeshStandardMaterial({ color: steelColor, roughness: 0.2, metalness: 0.88 });
  const darkSteelMat = new THREE.MeshStandardMaterial({ color: darkSteelColor, roughness: 0.25, metalness: 0.85 });
  const goldMat = new THREE.MeshStandardMaterial({ color: goldColor, roughness: 0.2, metalness: 0.92 });
  const woodMat = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.85 });
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.8 });

  if (type === 'Infantry') {
    // Man-at-Arms (Chainmail coif, nasal helmet, heater shield, broadsword)
    // Legs
    [-0.14, 0.14].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), leatherMat);
      leg.position.set(lx, 0.11, 0);
      leg.castShadow = true;
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });

    // Torso (Chainmail hauberk with heraldic surcoat)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.28), tunicMat);
    torso.position.set(0, 0.44, 0);
    torso.castShadow = true;
    group.add(torso);

    const surcoatCross = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.29), goldMat);
    surcoatCross.position.set(0, 0.44, 0);
    group.add(surcoatCross);

    // Head (Chainmail coif)
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), skinMat);
    head.position.set(0, 0.8, 0);
    head.castShadow = true;
    group.add(head);

    // Nasal Helmet
    const helmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.3, metalness: 0.75 });
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.32), helmetMat);
    helmet.position.set(0, 0.94, 0);
    helmet.castShadow = true;
    group.add(helmet);

    const nasalGuard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.06), steelMat);
    nasalGuard.position.set(0, 0.84, 0.15);
    group.add(nasalGuard);

    // Heater Shield (left arm)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.28, 0.44, 0.08);
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.28), tunicMat);
    shieldPlate.castShadow = true;
    shieldGroup.add(shieldPlate);
    
    const shieldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.44, 0.04), steelMat);
    shieldTrim.position.set(-0.01, 0, 0.12);
    shieldGroup.add(shieldTrim);

    const shieldBoss = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.1), goldMat);
    shieldBoss.position.set(-0.01, 0, 0);
    shieldGroup.add(shieldBoss);
    group.add(shieldGroup);

    // Forged Steel Broadsword (right arm)
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0.28, 0.44, 0.08);
    swordGroup.rotation.x = -Math.PI / 4;

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.08), steelMat);
    blade.position.set(0, 0.25, 0);
    blade.castShadow = true;
    swordGroup.add(blade);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.06), goldMat);
    guard.position.set(0, 0.05, 0);
    swordGroup.add(guard);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.04), leatherMat);
    handle.position.set(0, -0.01, 0);
    swordGroup.add(handle);

    const pommel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), goldMat);
    pommel.position.set(0, -0.07, 0);
    swordGroup.add(pommel);

    group.add(swordGroup);

  } else if (type === 'Archer') {
    // Longbowman (Hooded mantle, yew longbow, quiver with arrows)
    [-0.12, 0.12].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), leatherMat);
      leg.position.set(lx, 0.1, 0);
      leg.castShadow = true;
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });

    // Torso (Leather brigandine & green tunic)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.4, 0.24), tunicMat);
    torso.position.set(0, 0.4, 0);
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), skinMat);
    head.position.set(0, 0.73, 0);
    head.castShadow = true;
    group.add(head);

    // Hooded Cowl / Forest Archer Cap
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x2e4a2b, roughness: 0.85 });
    const hatBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.3), hatMat);
    hatBase.position.set(0, 0.86, 0);
    group.add(hatBase);
    
    const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.24), hatMat);
    hatTop.position.set(0, 0.94, -0.04);
    group.add(hatTop);

    // Pheasant feather on hat
    const feather = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.06), goldMat);
    feather.position.set(0.08, 1.02, -0.06);
    feather.rotation.z = -Math.PI / 6;
    group.add(feather);

    // Back Quiver packed with arrows
    const quiver = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.1), leatherMat);
    quiver.position.set(-0.1, 0.46, -0.16);
    quiver.rotation.z = Math.PI / 8;
    group.add(quiver);

    const fletch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), new THREE.MeshStandardMaterial({ color: 0xf5f5f5 }));
    fletch.position.set(-0.14, 0.68, -0.16);
    group.add(fletch);

    // English Yew Longbow (held out left hand)
    const bowGroup = new THREE.Group();
    bowGroup.position.set(-0.25, 0.42, 0.22);
    
    const bowMiddle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.06), woodMat);
    bowGroup.add(bowMiddle);
    
    const bowTop = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.05), woodMat);
    bowTop.position.set(0, 0.15, -0.05);
    bowTop.rotation.x = Math.PI / 10;
    bowGroup.add(bowTop);

    const bowBottom = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.05), woodMat);
    bowBottom.position.set(0, -0.15, -0.05);
    bowBottom.rotation.x = -Math.PI / 10;
    bowGroup.add(bowBottom);

    const stringMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    const string = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.54, 0.01), stringMat);
    string.position.set(0, 0, -0.11);
    bowGroup.add(string);

    group.add(bowGroup);

    // Arrow (nocked on right hand)
    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(0.18, 0.42, 0.1);
    arrowGroup.rotation.y = -Math.PI / 5;

    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.34), woodMat);
    shaft.position.set(0, 0, 0.08);
    arrowGroup.add(shaft);

    const arrowhead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.06), steelMat);
    arrowhead.position.set(0, 0, 0.26);
    arrowGroup.add(arrowhead);

    group.add(arrowGroup);

  } else if (type === 'Cavalry') {
    // Armored Knight on Warhorse with heraldic caparison
    const horseGroup = new THREE.Group();
    const horseMat = new THREE.MeshStandardMaterial({ color: horseColor, roughness: 0.7 });
    const horseManeMat = new THREE.MeshStandardMaterial({ color: horseManeColor, roughness: 0.85 });

    // Horse body
    const hBody = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.36, 0.84), horseMat);
    hBody.position.set(0, 0.3, 0);
    hBody.castShadow = true;
    horseGroup.add(hBody);

    // Barded Cloth Caparison (heraldic horse armor blanket)
    const caparison = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.86), tunicMat);
    caparison.position.set(0, 0.26, 0);
    horseGroup.add(caparison);

    // Horse neck & head
    const hNeck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.34, 0.22), horseMat);
    hNeck.position.set(0, 0.54, 0.3);
    hNeck.rotation.x = -Math.PI / 6;
    hNeck.castShadow = true;
    horseGroup.add(hNeck);

    const hHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.34), horseMat);
    hHead.position.set(0, 0.68, 0.4);
    hHead.castShadow = true;
    hHead.name = "horseHead";
    horseGroup.add(hHead);

    // Steel Champron (horse face armor plate)
    const champron = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.06), steelMat);
    champron.position.set(0, 0.7, 0.56);
    horseGroup.add(champron);

    // Mane
    const hMane = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.14), horseManeMat);
    hMane.position.set(0, 0.56, 0.16);
    horseGroup.add(hMane);

    // 4 Horse Legs
    const legCoords = [
      [-0.16, -0.1], [0.16, -0.1], [-0.16, 0.2], [0.16, 0.2]
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.09), horseMat);
      leg.position.set(lx, 0.11, lz);
      leg.castShadow = true;
      horseGroup.add(leg);

      const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.11), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
      hoof.position.set(lx, 0.02, lz);
      horseGroup.add(hoof);
    });

    group.add(horseGroup);

    // Armored Knight Rider
    const riderGroup = new THREE.Group();
    riderGroup.position.set(0, 0.48, -0.04);

    const rTorso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.22), steelMat);
    rTorso.position.set(0, 0.17, 0);
    rTorso.castShadow = true;
    riderGroup.add(rTorso);

    const rHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), skinMat);
    rHead.position.set(0, 0.45, 0);
    rHead.castShadow = true;
    riderGroup.add(rHead);

    const rHelmet = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), steelMat);
    rHelmet.position.set(0, 0.56, 0);
    riderGroup.add(rHelmet);

    // Long Jousting Lance with pennon banner
    const lanceGroup = new THREE.Group();
    lanceGroup.position.set(0.24, 0.17, 0.12);
    lanceGroup.rotation.x = -Math.PI / 10;

    const lShaft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 1.1), woodMat);
    lShaft.position.set(0, 0, 0.2);
    lShaft.castShadow = true;
    lanceGroup.add(lShaft);

    const lTip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.2), steelMat);
    lTip.position.set(0, 0, 0.78);
    lanceGroup.add(lTip);

    const pennon = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.22), tunicMat);
    pennon.position.set(0, -0.08, 0.65);
    lanceGroup.add(pennon);

    riderGroup.add(lanceGroup);
    group.add(riderGroup);

  } else if (type === 'HeavyGuard') {
    // Fortress Tower Guardian (Heavy Gothic plate armor, tower shield, spiked warhammer)
    [-0.16, 0.16].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.18), darkSteelMat);
      leg.position.set(lx, 0.12, 0);
      leg.castShadow = true; 
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.46, 0.32), darkSteelMat);
    torso.position.set(0, 0.48, 0);
    torso.castShadow = true;
    group.add(torso);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.33), tunicMat);
    stripe.position.set(0, 0.48, 0);
    group.add(stripe);

    // Heavy Pauldrons (Shoulder Armor)
    [[-0.36, 0.66], [0.36, 0.66]].forEach(([ox, oy]) => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.32), steelMat);
      pad.position.set(ox, oy, 0);
      pad.castShadow = true;
      group.add(pad);
    });

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.3), skinMat);
    head.position.set(0, 0.83, 0);
    head.castShadow = true;
    group.add(head);

    // Full Bascinet Helmet
    const kask = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.36), darkSteelMat);
    kask.position.set(0, 0.97, 0);
    kask.castShadow = true;
    group.add(kask);

    const visorSlit = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.08), goldMat);
    visorSlit.position.set(0, 0.94, 0.17);
    group.add(visorSlit);

    // Heavy Oak & Steel Tower Shield
    const kKalkan = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.64, 0.38), woodMat);
    kKalkan.position.set(-0.38, 0.5, 0.1);
    kKalkan.castShadow = true;
    group.add(kKalkan);

    const kTrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.68, 0.04), steelMat);
    kTrim.position.set(-0.39, 0.5, 0.3);
    group.add(kTrim);

    const kBoss = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.16), goldMat);
    kBoss.position.set(-0.37, 0.5, 0.1);
    group.add(kBoss);

    // Heavy Spiked Warhammer (right hand)
    const hammerHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.48), woodMat);
    hammerHandle.position.set(0.36, 0.5, 0.12);
    group.add(hammerHandle);

    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.16), darkSteelMat);
    hammerHead.position.set(0.36, 0.5, 0.38);
    group.add(hammerHead);

    const hammerSpike = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.1), steelMat);
    hammerSpike.position.set(0.36, 0.5, 0.48);
    group.add(hammerSpike);

  } else if (type === 'Knight') {
    // Champion Knight (Gleaming plate armor, greathelm with golden plumage, double-handed Claymore)
    [-0.14, 0.14].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 0.14), steelMat);
      leg.position.set(lx, 0.11, 0);
      leg.castShadow = true;
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.46, 0.28), steelMat);
    torso.position.set(0, 0.45, 0);
    torso.castShadow = true;
    group.add(torso);

    const tabard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.29), tunicMat);
    tabard.position.set(0, 0.34, 0);
    group.add(tabard);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), skinMat);
    head.position.set(0, 0.8, 0);
    head.castShadow = true;
    group.add(head);

    // Ornate Greathelm
    const helmetBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.34), steelMat);
    helmetBase.position.set(0, 0.94, 0);
    helmetBase.castShadow = true;
    group.add(helmetBase);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.08), goldMat);
    visor.position.set(0, 0.88, 0.2);
    group.add(visor);

    // Billowing Royal Crest Plume
    const plumeTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.08), goldMat);
    plumeTop.position.set(0, 1.12, 0);
    group.add(plumeTop);

    const plumeMid = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.14), tunicMat);
    plumeMid.position.set(0, 1.06, -0.05);
    group.add(plumeMid);

    // Two-Handed Steel Claymore
    const longBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.68, 0.1), steelMat);
    longBlade.position.set(0.3, 0.68, 0.12);
    longBlade.rotation.z = 0.18;
    group.add(longBlade);

    const longGuard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.08), goldMat);
    longGuard.position.set(0.3, 0.36, 0.12);
    group.add(longGuard);

    const longHandle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.05), leatherMat);
    longHandle.position.set(0.3, 0.26, 0.12);
    group.add(longHandle);

    const pommel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), goldMat);
    pommel.position.set(0.3, 0.16, 0.12);
    group.add(pommel);

  } else if (type === 'Catapult') {
    // Siege Onager (Heavy timber frame, iron brackets, stone boulder, spoke wheels)
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.54), woodMat);
    base.position.set(0, 0.04, 0);
    base.castShadow = true;
    group.add(base);

    const suppL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.08), woodMat);
    suppL.position.set(-0.24, 0.24, 0);
    suppL.castShadow = true;
    group.add(suppL);

    const suppR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.08), woodMat);
    suppR.position.set(0.24, 0.24, 0);
    suppR.castShadow = true;
    group.add(suppR);

    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.07, 0.08), woodMat);
    crossBeam.position.set(0, 0.39, 0);
    group.add(crossBeam);

    // Tension Throwing Arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.06), woodMat);
    arm.position.set(0, 0.56, 0.08);
    arm.rotation.x = -Math.PI / 5;
    arm.castShadow = true;
    group.add(arm);

    // Sling Bucket
    const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.18), leatherMat);
    bucket.position.set(0, 0.94, 0.3);
    group.add(bucket);

    // Heavy Stone Boulder
    const stone = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.95 }));
    stone.position.set(0, 1.02, 0.3);
    group.add(stone);

    // Iron-rimmed Wheels
    [[-0.37, -0.18], [-0.37, 0.18], [0.37, -0.18], [0.37, 0.18]].forEach(([wx, wz], idx) => {
      const wheel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.2), woodMat);
      wheel.position.set(wx, 0.1, wz);
      wheel.name = "wheel_" + idx;
      group.add(wheel);

      const axle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), darkSteelMat);
      axle.position.set(wx, 0.1, wz);
      group.add(axle);
    });

    // Faction Banner Plaque
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.05, 0.56), tunicMat);
    band.position.set(0, 0.08, 0);
    group.add(band);

  } else if (type === 'Captain') {
    // Noble Lord Commander (Gilded armor, velvet mantle with fur trim, gold royal crown helm, ornate gilded sword)
    const capeMat = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0x1e3a8a : 0x7f1d1d, roughness: 0.75 });
    const furTrimMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.95 });

    [-0.13, 0.13].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), steelMat);
      leg.position.set(lx, 0.11, 0);
      leg.castShadow = true;
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });

    // Velvet Mantle with Fur Collar (Cape)
    const cape = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.06), capeMat);
    cape.position.set(0, 0.46, -0.18);
    cape.castShadow = true;
    group.add(cape);

    const furCollar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.12, 0.14), furTrimMat);
    furCollar.position.set(0, 0.68, -0.1);
    group.add(furCollar);

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.28), goldMat);
    torso.position.set(0, 0.44, 0);
    torso.castShadow = true;
    group.add(torso);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.29), leatherMat);
    belt.position.set(0, 0.28, 0);
    group.add(belt);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), skinMat);
    head.position.set(0, 0.8, 0);
    head.castShadow = true;
    group.add(head);

    // Royal Gilded Crown Helmet
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.32), goldMat);
    helmet.position.set(0, 0.94, 0);
    group.add(helmet);

    const crownPoint = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), goldMat);
    crownPoint.position.set(0, 1.04, 0.14);
    group.add(crownPoint);

    // Twin Royal Feathers
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), furTrimMat);
    p1.position.set(0, 1.1, 0);
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.1), tunicMat);
    p2.position.set(0, 1.1, -0.06);
    group.add(p2);

    // Gilded Royal Sword
    const capBlade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.46, 0.08), steelMat);
    capBlade.position.set(0.3, 0.7, 0.1);
    group.add(capBlade);

    const capGuard = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.06), goldMat);
    capGuard.position.set(0.3, 0.48, 0.1);
    group.add(capGuard);

    const capHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.04), leatherMat);
    capHandle.position.set(0.3, 0.41, 0.1);
    group.add(capHandle);

    // Lion Crest Heater Shield
    const capShield = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.26), tunicMat);
    capShield.position.set(-0.28, 0.44, 0.08);
    group.add(capShield);

    const capShieldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.26), goldMat);
    capShieldTrim.position.set(-0.28, 0.62, 0.08);
    group.add(capShieldTrim);

    const capLion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.14), goldMat);
    capLion.position.set(-0.28, 0.44, 0.08);
    group.add(capLion);

  } else if (type === 'Mage') {
    // Court Archmage (Mystical runic robes, hooded cowl, spellbook, fire ember staff)
    const robeMat = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0x172554 : 0x450a0a, roughness: 0.75 });
    const robeAccent = new THREE.MeshStandardMaterial({ color: goldColor, roughness: 0.3, metalness: 0.8 });
    const crystalMat = new THREE.MeshStandardMaterial({
      color: team === 'blue' ? 0x60a5fa : 0xf97316,
      emissive: team === 'blue' ? 0x3b82f6 : 0xea580c,
      emissiveIntensity: 1.2,
      roughness: 0.2
    });

    const robe = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.3), robeMat);
    robe.position.set(0, 0.15, 0);
    robe.castShadow = true;
    group.add(robe);

    const robeTorso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.28), robeMat);
    robeTorso.position.set(0, 0.46, 0);
    robeTorso.castShadow = true;
    group.add(robeTorso);

    // Gold Runic Sash
    const sash = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.08, 0.29), robeAccent);
    sash.position.set(0, 0.46, 0);
    group.add(sash);

    // Leather Spellbook on belt
    const grimoire = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.14), leatherMat);
    grimoire.position.set(-0.21, 0.36, 0.04);
    group.add(grimoire);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), skinMat);
    head.position.set(0, 0.78, 0);
    head.castShadow = true;
    group.add(head);

    // Wizard Hat (Brim, Cone, Tip)
    const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 0.4), robeMat);
    hatBrim.position.set(0, 0.9, 0);
    group.add(hatBrim);

    const hatMid = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.24), robeMat);
    hatMid.position.set(0, 1.02, 0);
    group.add(hatMid);

    const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.12), robeMat);
    hatTop.position.set(0, 1.2, 0);
    group.add(hatTop);

    const hatTip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.05), robeAccent);
    hatTip.position.set(0, 1.34, 0);
    group.add(hatTip);

    // Carved Runic Wooden Staff
    const staffShaft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.92, 0.04), woodMat);
    staffShaft.position.set(0.28, 0.46, 0.08);
    group.add(staffShaft);

    // Glowing Fiery/Mystic Crystal Orb
    const orb = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), crystalMat);
    orb.position.set(0.28, 0.96, 0.08); 
    orb.name = "mageOrb";
    group.add(orb);

    const staffLight = new THREE.PointLight(team === 'blue' ? 0x60a5fa : 0xf97316, 1.2, 3.5);
    staffLight.position.set(0.28, 0.96, 0.08);
    staffLight.name = "staffLight";
    group.add(staffLight);
  }

  // Set unit standing on the grid
  group.position.y = 0.0;

  return group;
}

// Spawn exploding medieval voxel particles (stone chips, sparks, wood splinters)
function spawnDebris(gridX, gridZ, team) {
  let isGold = team === 'gold';
  const count = isGold ? 32 + Math.floor(Math.random() * 12) : 16 + Math.floor(Math.random() * 8);

  // Materials palette: Stone grey, forged iron, splinter wood, or gold sparks
  const debrisColors = isGold 
    ? [0xffd700, 0xffaa00, 0xfff0aa] 
    : (team === 'blue' ? [0x3b82f6, 0xb0bec5, 0x5c3d2e] : [0xef4444, 0xb0bec5, 0x5c3d2e]);

  for (let i = 0; i < count; i++) {
    const color = debrisColors[Math.floor(Math.random() * debrisColors.length)];
    const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: isGold ? 0xffaa00 : 0x000000,
      emissiveIntensity: isGold ? 1.5 : 0.0,
      roughness: isGold ? 0.2 : 0.85,
      metalness: isGold ? 0.9 : 0.3
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;

    mesh.position.set(
      gridX - 5.5 + (Math.random() - 0.5) * 0.5,
      0.4 + Math.random() * 0.8,
      gridZ - 5.5 + (Math.random() - 0.5) * 0.5
    );

    scene.add(mesh);

    debrisList.push({
      mesh,
      vx: (Math.random() - 0.5) * (isGold ? 7.0 : 4.5),
      vy: Math.random() * (isGold ? 7.0 : 4.5) + (isGold ? 4.5 : 3.0),
      vz: (Math.random() - 0.5) * (isGold ? 7.0 : 4.5),
      life: (isGold ? 1.2 : 0.9) + Math.random() * 0.4
    });
  }
}

// Spawn projectile based on attacker type (Mage / Archer / Catapult)
function spawnProjectile(attackerType, team, startX, startZ, targetX, targetZ, onHit) {
  const group = new THREE.Group();
  let material, geometry;
  let arc = 0;
  let duration = 0.55; 

  const color = team === 'blue' ? 0x60a5fa : 0xf97316;

  if (attackerType === 'Archer') {
    // Arrow projectile
    geometry = new THREE.BoxGeometry(0.04, 0.04, 0.28);
    material = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.85 });
    const arrow = new THREE.Mesh(geometry, material);
    arrow.castShadow = true;
    group.add(arrow);
    
    // Arrow tip
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.08), new THREE.MeshStandardMaterial({ color: 0xc8d6e5, metalness: 0.85 }));
    tip.position.z = 0.16;
    group.add(tip);

    arc = 0.8; 
    duration = 0.5;
  } else if (attackerType === 'Mage') {
    // Magic fiery plasma / arcane sphere
    geometry = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    material = new THREE.MeshStandardMaterial({ 
      color: color, 
      emissive: color, 
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.9
    });
    const plasma = new THREE.Mesh(geometry, material);
    group.add(plasma);

    // Glowing core pointlight
    const projLight = new THREE.PointLight(color, 1.3, 3.5);
    projLight.name = "projLight";
    group.add(projLight);

    arc = 0.3; 
    duration = 0.65;
  } else if (attackerType === 'Catapult') {
    // Catapult stone boulder projectile
    geometry = new THREE.BoxGeometry(0.28, 0.28, 0.28);
    material = new THREE.MeshStandardMaterial({ color: 0x4a4744, roughness: 0.95 });
    const boulder = new THREE.Mesh(geometry, material);
    boulder.castShadow = true;
    group.add(boulder);

    arc = 2.2; 
    duration = 1.0;
  }

  // Setup start position (world coordinates)
  group.position.set(startX - 5.5, 0.45, startZ - 5.5);
  
  // Point projectile towards target
  const dx = targetX - startX;
  const dz = targetZ - startZ;
  group.rotation.y = Math.atan2(dx, dz);

  scene.add(group);

  projectiles.push({
    mesh: group,
    startX: startX - 5.5,
    startY: 0.45,
    startZ: startZ - 5.5,
    targetX: targetX - 5.5,
    targetY: 0.2, 
    targetZ: targetZ - 5.5,
    elapsed: 0,
    duration,
    arc,
    onHit
  });
}

// Spawn unit-specific death visual effect
function spawnDeathEffect(unitType, gridX, gridZ, team) {
  const color = team === 'blue' ? 0x60a5fa : 0xf97316;
  
  if (unitType === 'Mage') {
    // Arcane ring particle explosion
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const geo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      const mat = new THREE.MeshStandardMaterial({
        color: team === 'blue' ? 0x3b82f6 : 0xea580c,
        emissive: team === 'blue' ? 0x1d4ed8 : 0xc2410c,
        emissiveIntensity: 1.5,
        transparent: true
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(gridX - 5.5, 0.3, gridZ - 5.5);
      scene.add(mesh);

      const angle = (i / particleCount) * Math.PI * 2.0;
      const speed = 2.0 + Math.random() * 2.5;
      debrisList.push({
        mesh,
        vx: Math.cos(angle) * speed,
        vy: 2.0 + Math.random() * 3.5, 
        vz: Math.sin(angle) * speed,
        life: 1.2 + Math.random() * 0.4
      });
    }
    // Fade away PointLight
    const deathLight = new THREE.PointLight(team === 'blue' ? 0x3b82f6 : 0xf97316, 2.0, 5.0);
    deathLight.position.set(gridX - 5.5, 0.4, gridZ - 5.5);
    scene.add(deathLight);
    
      const fade = () => {
        deathLight.intensity -= 0.15;
        if (deathLight.intensity > 0) {
          requestAnimationFrame(fade);
        } else {
          scene.remove(deathLight);
        }
      };
      requestAnimationFrame(fade);
    } else if (unitType === 'Catapult') {
    // Splintered wood and dark smoke particles
    const particleCount = 24;
    for (let i = 0; i < particleCount; i++) {
      const isWood = Math.random() > 0.4;
      const geo = new THREE.BoxGeometry(
        isWood ? 0.06 + Math.random() * 0.18 : 0.08, 
        0.08, 
        0.08
      );
      const pColor = isWood ? 0x4a2e10 : 0x333333;
      const mat = new THREE.MeshStandardMaterial({
        color: pColor,
        roughness: 0.95
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(gridX - 5.5, 0.2 + Math.random() * 0.3, gridZ - 5.5);
      scene.add(mesh);

      debrisList.push({
        mesh,
        vx: (Math.random() - 0.5) * 4.0,
        vy: Math.random() * 3.0 + 1.5,
        vz: (Math.random() - 0.5) * 4.0,
        life: 0.8 + Math.random() * 0.5
      });
    }
  } else if (unitType === 'HeavyGuard') {
    // Metal armor splinters & sparks
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const isSpark = Math.random() > 0.6;
      const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const mat = new THREE.MeshStandardMaterial({
        color: isSpark ? 0xffaa00 : 0x738a9c,
        emissive: isSpark ? 0xffaa00 : 0x000000,
        emissiveIntensity: isSpark ? 1.0 : 0.0,
        metalness: isSpark ? 0.0 : 0.9,
        roughness: 0.3
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(gridX - 5.5, 0.3, gridZ - 5.5);
      scene.add(mesh);

      debrisList.push({
        mesh,
        vx: (Math.random() - 0.5) * 5.0,
        vy: Math.random() * 4.5 + 2.5,
        vz: (Math.random() - 0.5) * 5.0,
        life: 0.7 + Math.random() * 0.4
      });
    }
  } else if (unitType === 'Knight') {
    // Holy yellow sparks explosion
    const particleCount = 26;
    for (let i = 0; i < particleCount; i++) {
      const geo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffbb00,
        emissiveIntensity: 1.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(gridX - 5.5, 0.25, gridZ - 5.5);
      scene.add(mesh);

      debrisList.push({
        mesh,
        vx: (Math.random() - 0.5) * 3.5,
        vy: Math.random() * 5.0 + 3.0, 
        vz: (Math.random() - 0.5) * 3.5,
        life: 1.0 + Math.random() * 0.3
      });
    }
  } else if (unitType === 'Cavalry') {
    // Horseshoe and horse pelt fragments
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const isHorse = Math.random() > 0.5;
      const geo = new THREE.BoxGeometry(0.11, 0.11, 0.11);
      const mat = new THREE.MeshStandardMaterial({
        color: isHorse ? 0x7c533c : color,
        roughness: 0.6
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(gridX - 5.5, 0.35, gridZ - 5.5);
      scene.add(mesh);

      debrisList.push({
        mesh,
        vx: (Math.random() - 0.5) * 5.5,
        vy: Math.random() * 3.5 + 2.0,
        vz: (Math.random() - 0.5) * 5.5,
        life: 0.9 + Math.random() * 0.3
      });
    }
  } else {
    // Normal voxel explosion
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(gridX - 5.5, 0.3, gridZ - 5.5);
      scene.add(mesh);

      debrisList.push({
        mesh,
        vx: (Math.random() - 0.5) * 4.5,
        vy: Math.random() * 4.0 + 2.0,
        vz: (Math.random() - 0.5) * 4.5,
        life: 0.8 + Math.random() * 0.3
      });
    }
  }
}

// ==========================================
// INTERACTION & RAYCASTING
// ==========================================
function onWindowResize() {
  if (!camera || !renderer) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Dynamically update camera base position for orientation changes
  const preset = getCameraPreset();
  cameraDefaultPosition.set(preset.x, preset.y, preset.z);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Raycast against grid tiles
  const intersects = raycaster.intersectObjects(tileMeshes);

  if (intersects.length > 0) {
    const hoveredTile = intersects[0].object;
    // Align hover wireframe highlight to this tile
    hoverHighlightMesh.position.set(
      hoveredTile.position.x,
      hoveredTile.position.y + 0.25,
      hoveredTile.position.z
    );
  } else {
    // Hide highlight offscreen
    hoverHighlightMesh.position.set(0, -100, 0);
  }
}

// Touch & Mouse Disambiguation (Tap vs Drag/Pinch)
let pointerStartX = 0;
let pointerStartY = 0;
let pointerStartTime = 0;
let isPointerActive = false;

function onPointerDown(event) {
  isPointerActive = true;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  pointerStartTime = performance.now();
}

function onPointerUp(event) {
  if (!isPointerActive) return;
  isPointerActive = false;

  const dx = event.clientX - pointerStartX;
  const dy = event.clientY - pointerStartY;
  const dist = Math.hypot(dx, dy);
  const duration = performance.now() - pointerStartTime;

  // Threshold: if dragged more than 14px or held > 400ms, it was a camera rotation / pinch gesture
  if (dist < 14 && duration < 400) {
    processInteraction(event.clientX, event.clientY);
  }
}

function processInteraction(clientX, clientY) {
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // 1. Raycast against range highlights first
  const highlightIntersects = raycaster.intersectObjects(highlightPlanes);
  if (highlightIntersects.length > 0) {
    const hitPlane = highlightIntersects[0].object;
    handleHighlightClick(hitPlane.userData);
    return;
  }

  // 2. Raycast against units
  const unitGroups = Object.values(unitMeshes);
  const intersectableMeshes = [];
  unitGroups.forEach(g => {
    g.traverse(child => {
      if (child.isMesh) intersectableMeshes.push(child);
    });
  });

  const unitIntersects = raycaster.intersectObjects(intersectableMeshes);
  if (unitIntersects.length > 0) {
    const unitId = getUnitIdFromIntersection(unitIntersects[0]);
    if (unitId) {
      handleUnitClick(unitId);
      return;
    }
  }

  // 3. Raycast against ground tiles
  const tileIntersects = raycaster.intersectObjects(tileMeshes);
  if (tileIntersects.length > 0) {
    // Clicked empty ground: deselect unit
    deselectUnit();
  }
}

// Climbs parent chain to find unitId stored in group userData
function getUnitIdFromIntersection(intersect) {
  let obj = intersect.object;
  while (obj) {
    if (obj.userData && obj.userData.unitId) {
      return obj.userData.unitId;
    }
    obj = obj.parent;
  }
  return null;
}

function handleUnitClick(unitId) {
  const clickedUnit = unitsData.find(u => u.id === unitId);
  if (!clickedUnit) return;

  // Scenario A: Clicked on a friendly unit
  if (clickedUnit.team === myTeam) {
    selectedUnitId = unitId;
    updateDiagnosticPanel(clickedUnit);
    playSound('select');
    
    // Draw action indicators (if it is our turn)
    if (myTeam === activeTeam) {
      drawRangeIndicators(clickedUnit);
    } else {
      clearHighlights();
    }
  } 
  // Scenario B: Clicked on an enemy unit while we have an active unit selected
  else if (selectedUnitId) {
    const activeUnit = unitsData.find(u => u.id === selectedUnitId);
    if (activeUnit && activeUnit.team === myTeam && myTeam === activeTeam) {
      // Check if enemy unit is in range
      const dist = Math.abs(activeUnit.x - clickedUnit.x) + Math.abs(activeUnit.z - clickedUnit.z);
      if (dist <= activeUnit.range && activeUnit.ap > 0) {
        // Trigger Server Attack Event
        socket.emit('attackUnit', {
          roomCode: currentRoomCode,
          attackerId: selectedUnitId,
          targetId: unitId
        });
      } else {
        deselectUnit();
      }
    } else {
      deselectUnit();
    }
  } else {
    // Just display diagnostic for enemy unit
    selectedUnitId = unitId;
    updateDiagnosticPanel(clickedUnit);
    clearHighlights();
  }
}

function handleHighlightClick(userData) {
  if (!selectedUnitId || myTeam !== activeTeam) return;

  if (userData.type === 'move') {
    socket.emit('moveUnit', {
      roomCode: currentRoomCode,
      unitId: selectedUnitId,
      targetX: userData.x,
      targetZ: userData.z
    });
  } else if (userData.type === 'attack') {
    socket.emit('attackUnit', {
      roomCode: currentRoomCode,
      attackerId: selectedUnitId,
      targetId: userData.targetUnitId
    });
  }
}

function deselectUnit() {
  selectedUnitId = null;
  unitDiagnostic.classList.add('hidden');
  clearHighlights();
}

// Draw movement/attack range indicators
function drawRangeIndicators(unit) {
  clearHighlights();

  const px = unit.x;
  const pz = unit.z;

  // Overlay Plane Geometry
  const planeGeo = new THREE.PlaneGeometry(0.9, 0.9);

  // 1. Draw green movement indicators (AP must be > 0)
  if (unit.ap > 0) {
    for (let x = 0; x < 12; x++) {
      for (let z = 0; z < 12; z++) {
        // Manhattan distance check
        const dist = Math.abs(px - x) + Math.abs(pz - z);
        if (dist > 0 && dist <= unit.mov) {
          // Check collision: Is tile empty?
          const occupied = unitsData.some(u => u.x === x && u.z === z);
          if (!occupied) {
            const greenMat = new THREE.MeshBasicMaterial({
              color: 0x00ff66,
              transparent: true,
              opacity: 0.35,
              side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(planeGeo, greenMat);
            plane.rotation.x = -Math.PI / 2;
            plane.position.set(x - 5.5, 0.015, z - 5.5);
            plane.userData = { type: 'move', x, z };
            scene.add(plane);
            highlightPlanes.push(plane);
          }
        }
      }
    }
  }

  // 2. Draw red attack indicators (AP must be > 0)
  if (unit.ap > 0) {
    unitsData.forEach(other => {
      // Must be an enemy
      if (other.team !== myTeam) {
        const dist = Math.abs(px - other.x) + Math.abs(pz - other.z);
        if (dist <= unit.range) {
          const redMat = new THREE.MeshBasicMaterial({
            color: 0xff0055,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide
          });
          const plane = new THREE.Mesh(planeGeo, redMat);
          plane.rotation.x = -Math.PI / 2;
          plane.position.set(other.x - 5.5, 0.018, other.z - 5.5);
          plane.userData = { type: 'attack', targetUnitId: other.id, x: other.x, z: other.z };
          scene.add(plane);
          highlightPlanes.push(plane);
        }
      }
    });
  }
}

function clearHighlights() {
  highlightPlanes.forEach(p => {
    scene.remove(p);
    p.geometry.dispose();
    p.material.dispose();
  });
  highlightPlanes = [];
}

// ==========================================
// UI / HUD UPDATING
// ==========================================
function updateTurnUI() {
  if (activeTeam === myTeam) {
    turnBanner.className = 'turn-announcer my-turn';
    turnTextSpan.textContent = 'SENİN TURUN';
    endTurnBtn.removeAttribute('disabled');
  } else {
    turnBanner.className = 'turn-announcer enemy-turn';
    turnTextSpan.textContent = 'DÜŞMAN TURU';
    endTurnBtn.setAttribute('disabled', 'true');
  }

  // If a unit is currently selected, redraw ranges for turn replenishment
  if (selectedUnitId) {
    const selectedUnit = unitsData.find(u => u.id === selectedUnitId);
    if (selectedUnit) {
      updateDiagnosticPanel(selectedUnit);
      if (myTeam === activeTeam && selectedUnit.team === myTeam) {
        drawRangeIndicators(selectedUnit);
      }
    }
  }
}

function updateDiagnosticPanel(unit) {
  diagName.textContent = unit.name;
  diagName.className = unit.team === 'blue' ? 'neon-text-blue' : 'neon-text-red';
  
  const typeTranslations = {
    'Infantry':  'Piyade',
    'Archer':    'Okçu',
    'Cavalry':   'Süvari',
    'HeavyGuard':'Ağır Muhafız',
    'Knight':    'Şövalye',
    'Catapult':  'Mancınık',
    'Captain':   'Kaptan',
    'Mage':      'Büyücü'
  };
  diagType.textContent = typeTranslations[unit.type] || unit.type;
  
  const teamTranslations = {
    'blue': 'Mavi',
    'red': 'Kırmızı'
  };
  diagTeam.textContent = teamTranslations[unit.team]?.toUpperCase() || unit.team;
  diagTeam.className = unit.team === 'blue' ? 'stat-value neon-text-blue' : 'stat-value neon-text-red';

  diagHpText.textContent = `${unit.hp}/${unit.maxHp}`;
  const hpPct = Math.max(0, (unit.hp / unit.maxHp) * 100);
  diagHpFill.style.width = `${hpPct}%`;

  diagAtk.textContent = unit.atk;
  diagRange.textContent = unit.range;
  diagMov.textContent = unit.mov;
  diagAp.textContent = `${unit.ap}/${unit.maxAp}`;

  const apBox = diagAp.parentElement;
  if (unit.ap > 0) {
    apBox.style.borderColor = 'rgba(57, 255, 20, 0.4)';
    diagAp.style.color = '#39ff14';
  } else {
    apBox.style.borderColor = 'rgba(255, 0, 60, 0.4)';
    diagAp.style.color = '#ff003c';
  }

  unitDiagnostic.classList.remove('hidden');
}

function animate() {
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  const time = Date.now();

  // ── 1. UPDATE PROJECTILES (Arrow, Magic Ball, Boulder) ─────────────────
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.elapsed += dt;
    const progress = Math.min(1.0, proj.elapsed / proj.duration);

    // Parabolic trajectory calculation
    const curX = proj.startX + (proj.targetX - proj.startX) * progress;
    const curZ = proj.startZ + (proj.targetZ - proj.startZ) * progress;
    
    // Y height calculation based on arc
    const arcHeight = Math.sin(progress * Math.PI) * proj.arc;
    const curY = proj.startY + (proj.targetY - proj.startY) * progress + arcHeight;

    proj.mesh.position.set(curX, curY, curZ);

    // Roll rotation along axis
    proj.mesh.rotation.x += dt * 8.0;
    proj.mesh.rotation.z += dt * 3.0;

    // Flicker projectile light if any
    const light = proj.mesh.getObjectByName("projLight");
    if (light) {
      light.intensity = 1.0 + Math.sin(time * 0.035) * 0.4;
    }

    // Check hit point
    if (progress >= 1.0) {
      scene.remove(proj.mesh);
      proj.mesh.traverse(child => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      
      // Execute impact process (hasar & particle explosion)
      proj.onHit();
      projectiles.splice(i, 1);
    }
  }

  // ── 2. UPDATE UNIT ANIMATIONS (Movement, Lunge, Damage Flashing, Idle) ──
  for (const id in unitMeshes) {
    const mesh = unitMeshes[id];

    // --- CASE A: Yürüyüş Animasyonu (Movement) ---
    if (mesh.userData.moveAnim) {
      const anim = mesh.userData.moveAnim;
      anim.elapsed += dt;
      const progress = Math.min(1.0, anim.elapsed / anim.time);
      
      // 3 steps bounce/jumping during grid traversal
      const bob = Math.abs(Math.sin(progress * Math.PI * 3.5)) * 0.32;
      const roll = Math.sin(progress * Math.PI * 6.0) * 0.12;

      // Position update
      const curX = anim.startX + (anim.targetX - anim.startX) * progress;
      const curZ = anim.startZ + (anim.targetZ - anim.startZ) * progress;

      mesh.position.x = curX - 5.5;
      mesh.position.z = curZ - 5.5;
      mesh.position.y = bob;

      // Align yaw direction to movement path
      const dx = anim.targetX - anim.startX;
      const dz = anim.targetZ - anim.startZ;
      mesh.rotation.y = Math.atan2(dx, dz);
      mesh.rotation.z = roll;

      // Realistically swing left/right legs
      const legL = mesh.getObjectByName("legL");
      const legR = mesh.getObjectByName("legR");
      if (legL && legR) {
        const swing = Math.sin(progress * Math.PI * 7.5) * 0.55;
        legL.rotation.x = swing;
        legR.rotation.x = -swing;
      }

      // Rotate Catapult wheels during movement
      if (mesh.userData.type === 'Catapult') {
        for (let w = 0; w < 4; w++) {
          const wheel = mesh.getObjectByName("wheel_" + w);
          if (wheel) wheel.rotation.x += dt * 9.0;
        }
      }

      if (progress >= 1.0) {
        mesh.position.y = 0;
        mesh.rotation.z = 0;
        mesh.rotation.y = (mesh.userData.team === 'blue') ? 0 : Math.PI;
        
        // Reset leg rotations
        if (legL && legR) {
          legL.rotation.x = 0;
          legR.rotation.x = 0;
        }
        mesh.userData.moveAnim = null;
      }
    }

    // --- CASE B: Saldırı Animasyonu (Lunge) ---
    else if (mesh.userData.lungeTime > 0) {
      mesh.userData.lungeTime -= dt;
      const progress = (0.4 - mesh.userData.lungeTime) / 0.4;
      const strikeDist = Math.sin(progress * Math.PI) * 0.75;
      const dir = mesh.userData.lungeDirection;

      const lungeJump = Math.sin(progress * Math.PI) * 0.38;
      mesh.position.x = (mesh.userData.gridX - 5.5) + dir.x * strikeDist;
      mesh.position.z = (mesh.userData.gridZ - 5.5) + dir.z * strikeDist;
      mesh.position.y = lungeJump;

      // Angle forward tilt based on attack vector
      const tilt = 0.55;
      mesh.rotation.x = dir.z * Math.sin(progress * Math.PI) * tilt;
      mesh.rotation.z = -dir.x * Math.sin(progress * Math.PI) * tilt;

      // Weapon flash at climax strike point
      if (progress > 0.4 && progress < 0.6) {
        mesh.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.emissive?.setHex(0xffffff);
          }
        });
      } else {
        mesh.traverse(child => {
          if (child.isMesh && child.material) {
            const orig = child.userData.originalEmissive || 0x000000;
            child.material.emissive?.setHex(orig);
          }
        });
      }

      if (mesh.userData.lungeTime <= 0) {
        mesh.position.x = mesh.userData.gridX - 5.5;
        mesh.position.z = mesh.userData.gridZ - 5.5;
        mesh.position.y = 0;
        mesh.rotation.x = 0;
        mesh.rotation.z = 0;
        mesh.rotation.y = (mesh.userData.team === 'blue') ? 0 : Math.PI;
      }
    }

    // --- CASE C: Hasar Titreme ve Geri Savrulma (Hit Flashing) ---
    else if (mesh.userData.hitFlashTime > 0) {
      mesh.userData.hitFlashTime -= dt;
      const flashColor = Math.sin(time * 0.05) > 0 ? 0xff0055 : 0xffffff;
      
      mesh.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.emissive?.setHex(flashColor);
        }
      });

      // Recoil bounce and random jitter shake
      const bounceHeight = Math.sin((mesh.userData.hitFlashTime / 0.35) * Math.PI) * 0.45;
      const shakeX = (Math.random() - 0.5) * 0.16;
      const shakeZ = (Math.random() - 0.5) * 0.16;

      mesh.position.y = bounceHeight;
      mesh.position.x = (mesh.userData.gridX - 5.5) + shakeX;
      mesh.position.z = (mesh.userData.gridZ - 5.5) + shakeZ;

      if (mesh.userData.hitFlashTime <= 0) {
        mesh.position.y = 0;
        mesh.position.x = mesh.userData.gridX - 5.5;
        mesh.position.z = mesh.userData.gridZ - 5.5;
        mesh.traverse(child => {
          if (child.isMesh && child.material) {
            const orig = child.userData.originalEmissive || 0x000000;
            child.material.emissive?.setHex(orig);
          }
        });
      }
    }

    // --- CASE E: Savuşturma Kaçınma Animasyonu (Dodge) ---
    else if (mesh.userData.dodgeAnim) {
      const anim = mesh.userData.dodgeAnim;
      anim.elapsed += dt;
      const progress = Math.min(1.0, anim.elapsed / anim.time);
      
      const slideOffset = Math.sin(progress * Math.PI) * 0.8;
      mesh.position.x = (mesh.userData.gridX - 5.5) + anim.dir.x * slideOffset;
      mesh.position.z = (mesh.userData.gridZ - 5.5) + anim.dir.z * slideOffset;

      if (progress >= 1.0) {
        mesh.position.x = mesh.userData.gridX - 5.5;
        mesh.position.z = mesh.userData.gridZ - 5.5;
        mesh.userData.dodgeAnim = null;
      }
    }

    // --- CASE D: Bekleme Durumu (Idle Breathing & Unit Features) ---
    else {
      // Gentle breathing scale and height bobbing
      const breathing = Math.sin(time * 0.0028 + (mesh.position.x * 1.5)) * 0.026;
      mesh.position.y = breathing;

      // Mage: staff light pulsing and orb rotating
      if (mesh.userData.type === 'Mage') {
        const orb = mesh.getObjectByName("mageOrb");
        const orbGlow = mesh.getObjectByName("mageOrbGlow");
        const staffLight = mesh.getObjectByName("staffLight");
        
        if (orb) {
          orb.rotation.y += dt * 1.5;
          orb.rotation.x += dt * 0.8;
          orb.position.y = 0.92 + Math.sin(time * 0.003) * 0.04; // floating orb
        }
        if (orbGlow) {
          const scale = 1.0 + Math.sin(time * 0.006) * 0.16;
          orbGlow.scale.setScalar(scale);
        }
        if (staffLight) {
          staffLight.intensity = 1.2 + Math.sin(time * 0.01) * 0.5;
        }
      }

      // Cavalry: Horse head nodding
      if (mesh.userData.type === 'Cavalry') {
        const horseHead = mesh.getObjectByName("horseHead");
        if (horseHead) {
          horseHead.rotation.x = -Math.PI / 6 + Math.sin(time * 0.002) * 0.04;
        }
      }

      // Archer: Idle weapon swing
      if (mesh.userData.type === 'Archer') {
        mesh.rotation.y = ((mesh.userData.team === 'blue') ? 0 : Math.PI) + Math.sin(time * 0.0015) * 0.035;
      }
    }
  }

  // ── 3. UPDATE EXPLODING VOXEL PARTICLES (Debris) ──────────────────────
  for (let i = debrisList.length - 1; i >= 0; i--) {
    const p = debrisList[i];
    p.life -= dt;
    
    p.mesh.position.x += p.vx * dt;
    p.mesh.position.y += p.vy * dt;
    p.mesh.position.z += p.vz * dt;

    p.vy -= 9.8 * dt; // gravity

    p.mesh.rotation.x += p.vx * dt * 2.0;
    p.mesh.rotation.y += p.vy * dt * 2.0;

    const scale = Math.max(0, p.life);
    p.mesh.scale.setScalar(scale);

    if (p.life <= 0 || p.mesh.position.y < -3.0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      debrisList.splice(i, 1);
    }
  }

  // ── 4. CINEMATIC CAMERA SYSTEM ────────────────────────────────────────
  if (isCinematicActive && camera && controls) {
    cinematicTimer -= dt;
    camera.position.lerp(cameraTargetPosition, dt * 6.0);
    controls.target.lerp(cameraTargetLookAt, dt * 6.0);

    if (cinematicTimer <= 0) {
      isCinematicActive = false;
    }
  } else if (camera && controls && cameraDefaultPosition.lengthSq() > 0) {
    camera.position.lerp(cameraDefaultPosition, dt * 3.5);
    controls.target.lerp(controlsDefaultTarget, dt * 3.5);
  }

  // Camera shake calculation (crit hit)
  if (cameraShakeIntensity > 0 && camera) {
    cameraShakeIntensity -= dt * 2.5;
    const shake = Math.max(0, cameraShakeIntensity);
    camera.position.x += (Math.random() - 0.5) * shake * 0.45;
    camera.position.y += (Math.random() - 0.5) * shake * 0.45;
  }

  // ── 5. UPDATE FLOATING COMBAT UI ──────────────────────────────────────
  for (let i = floatingUIList.length - 1; i >= 0; i--) {
    const ui = floatingUIList[i];
    ui.life -= dt;

    if (ui.life <= 0) {
      ui.element.remove();
      floatingUIList.splice(i, 1);
      continue;
    }

    const pos2D = toScreenPosition(ui.pos3D);
    if (ui.type === 'damage') {
      ui.pos3D.y += dt * 0.45; // float upwards in world space
    }

    ui.element.style.left = `${pos2D.x}px`;
    ui.element.style.top = `${pos2D.y}px`;
  }

  // ── 6. UPDATE MEDIEVAL TORCHES, CROWD & EMBERS ────────────────────────
  // Dynamic torch flickering
  for (let i = 0; i < torchLights.length; i++) {
    const tl = torchLights[i];
    const base = tl.userData.baseIntensity || 1.35;
    const flicker = Math.sin(time * 0.012 + i * 1.5) * 0.25 + Math.sin(time * 0.027 + i * 3.1) * 0.12;
    tl.intensity = Math.max(0.6, base + flicker);
  }

  // Living spectator crowd idle animations
  for (let i = 0; i < spectatorList.length; i++) {
    const sp = spectatorList[i];
    const bounce = Math.sin(time * sp.speed + sp.offset) * 0.05;
    sp.group.position.y = sp.baseY + Math.max(0, bounce);

    if (sp.arm) {
      // Occasional enthusiastic arm wave
      const wave = Math.sin(time * sp.speed * 2.2 + sp.offset) * 0.45;
      sp.arm.rotation.x = wave;
    }
  }

  // Floating amber sparks & smoke embers drifting upwards
  if (emberParticles && emberParticles.geometry) {
    const positions = emberParticles.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += dt * 1.6; // Rise upwards
      // Random slight wind sway
      positions[i - 1] += Math.sin(time * 0.001 + i) * dt * 0.2;
      positions[i + 1] += Math.cos(time * 0.001 + i) * dt * 0.2;

      // Cycle back down when rising above courtyard walls
      if (positions[i] > 11.0) {
        positions[i] = 0.5 + Math.random() * 1.5;
        positions[i - 1] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
      }
    }
    emberParticles.geometry.attributes.position.needsUpdate = true;
  }

  // ── 7. RENDER CALLS ───────────────────────────────────────────────────
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// ── FLOATING COMBAT TEXT & HEALTH BARS PROJECTOR ─────────────────────────
function toScreenPosition(objPosition) {
  if (!camera || !renderer) return { x: 0, y: 0 };
  const vector = objPosition.clone();
  const widthHalf = 0.5 * renderer.domElement.clientWidth;
  const heightHalf = 0.5 * renderer.domElement.clientHeight;

  vector.project(camera);

  return {
    x: (vector.x * widthHalf) + widthHalf,
    y: -(vector.y * heightHalf) + heightHalf
  };
}

function spawnFloatingDamageText(position3D, text, isCrit, isDodge) {
  const uiContainer = document.getElementById('ui-container');
  if (!uiContainer) return;

  const div = document.createElement('div');
  div.className = 'floating-damage';
  if (isCrit) div.classList.add('crit');
  if (isDodge) div.classList.add('dodge');
  div.textContent = text;

  uiContainer.appendChild(div);

  // Offset initial height a bit above unit torso
  const pos3D = position3D.clone().add(new THREE.Vector3(0, 0.45, 0));

  const uiItem = {
    element: div,
    pos3D: pos3D,
    life: 1.2,
    type: 'damage'
  };

  floatingUIList.push(uiItem);

  const pos2D = toScreenPosition(uiItem.pos3D);
  div.style.left = `${pos2D.x}px`;
  div.style.top = `${pos2D.y}px`;
}

function spawnFloatingHealthBar(position3D, currentHp, maxHp, team) {
  const uiContainer = document.getElementById('ui-container');
  if (!uiContainer) return;

  const barDiv = document.createElement('div');
  barDiv.className = 'temp-health-bar';

  const pct = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  barDiv.innerHTML = `
    <div class="temp-health-text">HP: ${currentHp}/${maxHp}</div>
    <div class="temp-health-bar-track">
      <div class="temp-health-bar-fill ${team === 'blue' ? 'blue-team' : ''}" style="width: ${pct}%;"></div>
    </div>
  `;

  uiContainer.appendChild(barDiv);

  const pos3D = position3D.clone().add(new THREE.Vector3(0, 0.45, 0));

  const uiItem = {
    element: barDiv,
    pos3D: pos3D,
    life: 1.5,
    type: 'hp'
  };

  floatingUIList.push(uiItem);

  const pos2D = toScreenPosition(uiItem.pos3D);
  barDiv.style.left = `${pos2D.x}px`;
  barDiv.style.top = `${pos2D.y}px`;
}
