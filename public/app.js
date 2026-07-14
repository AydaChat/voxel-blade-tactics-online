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
      // Short high-pitched beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.12);
    } 
    else if (type === 'move') {
      // Cyber movement hover beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.12);
    } 
    else if (type === 'attack') {
      // Slash/laser sweep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.22);
    } 
    else if (type === 'hit') {
      // Noise impact metallic crash
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.15);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      noise.start(now);
      noise.stop(now + 0.15);
    } 
    else if (type === 'death') {
      // Deep explosion noise rumble
      const bufferSize = audioCtx.sampleRate * 0.45;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.45);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      noise.start(now);
      noise.stop(now + 0.45);
    } 
    else if (type === 'turn') {
      // Two-tone chord sweep for turn change
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(392, now); // G4
      osc1.frequency.exponentialRampToValueAtTime(784, now + 0.2);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(494, now); // B4
      osc2.frequency.exponentialRampToValueAtTime(988, now + 0.2);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    }
    else if (type === 'dodge') {
      // Wind whoosh sound using white noise and bandpass filter
      const bufferSize = audioCtx.sampleRate * 0.22;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.22);
      filter.Q.setValueAtTime(8, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.22);
    }
    else if (type === 'crit') {
      // High-pitched chime + metal slam impact
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(3200, now + 0.15);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(988, now); // B5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.32);
      osc2.stop(now + 0.32);

      playSound('hit');
    }
    else if (type === 'error') {
      // Low buzz tone
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(120, now);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(124, now);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    }
  } catch (e) {
    console.warn("Audio playback not supported or blocked: ", e);
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
if (logToggleBtn && combatLogPanel) {
  logToggleBtn.addEventListener('click', () => {
    combatLogPanel.classList.toggle('minimized');
    if (combatLogPanel.classList.contains('minimized')) {
      logToggleBtn.textContent = '◀';
    } else {
      logToggleBtn.textContent = '▶';
    }
    playSound('select');
  });
}

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
socket.on('roomCreated', ({ code }) => {
  currentRoomCode = code;
  lobbyScreen.classList.remove('active');
  waitingScreen.classList.add('active');
  displayRoomCode.textContent = code;
});

socket.on('errorMsg', ({ message }) => {
  showError(message);
  lobbyStatus.textContent = 'Lobi bağlantısı başarısız.';
});

socket.on('gameStart', ({ team, players, gameState, roomCode }) => {
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

  addLog(`Taktik bağlantı kuruldu. Sektöre hoş geldiniz.`, 'system');
  addLog(`${myUsername} — ${teamText} takıma atandınız.`, myTeam);
  addLog(`Rakibiniz: ${opponentUsername}`, 'system');

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
    addLog(`${unit.name}, (${newX}, ${newZ}) konumuna hareket etti.`, unit.team);

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
    cinematicTimer = targetDead ? 1.4 : 0.85; // Odakta kalma süresi
    isCinematicActive = true;

    // Hasar verme, parlama ve ölüm işlemlerini yapacak olan fonksiyon
    const triggerHitProcess = () => {
      if (isDodge) {
        // 💨 SAVUŞTURMA (Dodge) Animasyonu & Sesi
        playSound('dodge');
        
        // Target slips to side (dodge dodge animation)
        const lungeDir = new THREE.Vector3(targetX - attackerX, 0, targetZ - attackerZ).normalize();
        const dodgeDir = new THREE.Vector3(-lungeDir.z, 0, lungeDir.x).multiplyScalar(0.4);
        
        target.userData.dodgeAnim = {
          dir: dodgeDir,
          time: 0.35,
          elapsed: 0
        };

        // Spawn floating Dodge Text over target unit
        spawnFloatingDamageText(target.position, "SAVUŞTURULDU", false, true);

        addLog(`SAVUŞTURULDU! ${targetName} çevik bir hareketle saldırıdan sıyrıldı.`, 'system');
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
        
        addLog(`KRİTİK DARBE! ${attackerName}, ${targetName} birliğine ${damage} kritik hasar verdi!`, 'kill');
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
          addLog(`${targetName} etkisiz hale getirildi!`, 'kill');
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
  addLog(`Tur döngüsü tamamlandı. Kontrol ${activeTeamText} komutasına geçti.`, 'system');
});

socket.on('gameOver', ({ winner }) => {
  gameState = { winner };
  gameOverScreen.classList.add('active');
  const title = document.getElementById('game-over-title');
  const desc = document.getElementById('game-over-desc');

  if (winner === myTeam) {
    title.textContent = "ZAFER KAZANILDI";
    title.className = "glitch-title neon-text-blue";
    title.setAttribute('data-text', "ZAFER KAZANILDI");
    desc.textContent = "Tüm düşman voxel birlikleri başarıyla imha edildi.";
  } else {
    title.textContent = "BOZGUN";
    title.className = "glitch-title neon-text-red";
    title.setAttribute('data-text', "BOZGUN");
    desc.textContent = "Savaş birlikleriniz taktiksel konumu korumayı başaramadı.";
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
// THREE.JS ENGINE SETUP
// ==========================================
function initThreeJS() {
  const container = document.getElementById('canvas-container');
  
  // Create Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05050c);
  // Add volumetric foggy look
  scene.fog = new THREE.FogExp2(0x05050c, 0.035);

  // Setup Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  
  // Dynamic camera positioning depending on the assigned player team
  if (myTeam === 'blue') {
    camera.position.set(0, 11, -13);
  } else {
    camera.position.set(0, 11, 13);
  }

  // Setup Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
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
  controls.maxDistance = 25;
  // Prevent looking under grid
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minPolarAngle = Math.PI / 12;
  // Center camera target on the 12x12 board center
  controls.target.set(0, 0, 0);
  controls.update();

  // Lights Setup
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);

  const sunLight = new THREE.DirectionalLight(0xffffff, 0.85);
  sunLight.position.set(6, 14, 4);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 25;
  const d = 8;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  // Cyberpunk ambient lights (contrasting glowing nodes)
  const neonBlueLight = new THREE.PointLight(0x00f0ff, 0.7, 18);
  neonBlueLight.position.set(-7, 3, -7);
  scene.add(neonBlueLight);

  const neonMagentaLight = new THREE.PointLight(0xff0055, 0.7, 18);
  neonMagentaLight.position.set(7, 3, 7);
  scene.add(neonMagentaLight);

  // Build Star Particles
  buildStars();

  // Create Grid board
  buildVoxelGrid();

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('click', onClick);

  // Save default position after setting up
  setTimeout(() => {
    cameraDefaultPosition.copy(camera.position);
    controlsDefaultTarget.copy(controls.target);
  }, 100);

  // Start Animation Loop
  animate();
}

function buildStars() {
  const particleGeo = new THREE.BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = Math.random() * 20 - 5;
    positions[i + 2] = (Math.random() - 0.5) * 50;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });

  const starParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(starParticles);
}

// Generate the 12x12 voxel ground
function buildVoxelGrid() {
  const borderGeometry = new THREE.BoxGeometry(0.96, 0.45, 0.96);
  
  for (let x = 0; x < 12; x++) {
    for (let z = 0; z < 12; z++) {
      // Chessboard dark cyberpunk coloring
      const isEven = (x + z) % 2 === 0;
      const tileColor = isEven ? 0x121220 : 0x0c0c18;
      
      const tileMat = new THREE.MeshStandardMaterial({
        color: tileColor,
        roughness: 0.8,
        metalness: 0.2
      });

      const tileMesh = new THREE.Mesh(borderGeometry, tileMat);
      // Map 0-11 space to centered -5.5 to +5.5 space
      tileMesh.position.set(x - 5.5, -0.225, z - 5.5);
      tileMesh.receiveShadow = true;
      tileMesh.userData = { gridX: x, gridZ: z };
      
      scene.add(tileMesh);
      tileMeshes.push(tileMesh);
    }
  }

  // Draw cyber digital lines separating tiles
  const gridHelper = new THREE.GridHelper(12, 12, 0x00f0ff, 0x22223c);
  gridHelper.position.set(0, 0, 0);
  scene.add(gridHelper);

  // Add outer boundary glowing border
  const borderGeo = new THREE.BoxGeometry(12.3, 0.5, 12.3);
  const borderMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c16,
    roughness: 0.5,
    metalness: 0.5
  });
  const borderMesh = new THREE.Mesh(borderGeo, borderMat);
  borderMesh.position.set(0, -0.26, 0);
  scene.add(borderMesh);

  // Outer framing glowing wireframe
  const frameGeo = new THREE.BoxGeometry(12.4, 0.52, 12.4);
  const edges = new THREE.EdgesGeometry(frameGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xff0055, linewidth: 2 });
  const frameWireframe = new THREE.LineSegments(edges, lineMat);
  frameWireframe.position.set(0, -0.26, 0);
  scene.add(frameWireframe);

  // Hover Highlight wireframe mesh
  const hoverGeo = new THREE.BoxGeometry(1.02, 0.5, 1.02);
  const hoverEdges = new THREE.EdgesGeometry(hoverGeo);
  const hoverLineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 });
  hoverHighlightMesh = new THREE.LineSegments(hoverEdges, hoverLineMat);
  hoverHighlightMesh.position.set(0, -100, 0); // Hide initially
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
      // Center unit position
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

// Procedural modeling of Voxel units
function createVoxelUnit(type, team) {
  const group = new THREE.Group();
  
  const tunicColor = team === 'blue' ? 0x0055ff : 0xff0044;
  const helmetColor = 0x738a9c;
  const skinColor = 0xffd1a4;
  const shieldColor = 0x8b5a2b;
  const steelColor = 0xccd9e8;
  const goldColor = 0xffc400;
  const bowColor = 0xa66f3c;
  const horseColor = 0x7c533c;
  const horseManeColor = 0x1e1e1e;

  // Setup Standard Materials
  const tunicMat = new THREE.MeshStandardMaterial({ color: tunicColor, roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
  const steelMat = new THREE.MeshStandardMaterial({ color: steelColor, roughness: 0.25, metalness: 0.85 });
  const goldMat = new THREE.MeshStandardMaterial({ color: goldColor, roughness: 0.2, metalness: 0.9 });
  const woodMat = new THREE.MeshStandardMaterial({ color: bowColor, roughness: 0.8 });

  if (type === 'Infantry') {
    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), tunicMat);
    legL.position.set(-0.14, 0.11, 0);
    legL.castShadow = true;
    legL.name = "legL";
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), tunicMat);
    legR.position.set(0.14, 0.11, 0);
    legR.castShadow = true;
    legR.name = "legR";
    group.add(legR);

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.28), tunicMat);
    torso.position.set(0, 0.44, 0);
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), skinMat);
    head.position.set(0, 0.8, 0);
    head.castShadow = true;
    group.add(head);

    // Helmet
    const helmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.3, metalness: 0.7 });
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.32), helmetMat);
    helmet.position.set(0, 0.94, 0);
    helmet.castShadow = true;
    group.add(helmet);

    // Plume
    const plumeMat = new THREE.MeshStandardMaterial({ 
      color: team === 'blue' ? 0x00f0ff : 0xff0055, 
      emissive: team === 'blue' ? 0x00a0aa : 0xaa0033,
      emissiveIntensity: 0.4
    });
    const plume = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.2), plumeMat);
    plume.position.set(0, 1.05, -0.05);
    group.add(plume);

    // Shield (on left arm)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.28, 0.44, 0.08);
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.38, 0.26), new THREE.MeshStandardMaterial({ color: shieldColor, roughness: 0.9 }));
    shieldPlate.castShadow = true;
    shieldGroup.add(shieldPlate);
    
    // Shield trim
    const shieldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.05), steelMat);
    shieldTrim.position.set(-0.01, 0, 0);
    shieldGroup.add(shieldTrim);
    group.add(shieldGroup);

    // Sword (on right arm)
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0.28, 0.44, 0.08);
    swordGroup.rotation.x = -Math.PI / 4; // hold tilted forward

    // Blade
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.08), steelMat);
    blade.position.set(0, 0.24, 0);
    blade.castShadow = true;
    swordGroup.add(blade);
    // Guard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.06), goldMat);
    guard.position.set(0, 0.05, 0);
    swordGroup.add(guard);
    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.04), woodMat);
    handle.position.set(0, -0.01, 0);
    swordGroup.add(handle);

    group.add(swordGroup);

  } else if (type === 'Archer') {
    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), tunicMat);
    legL.position.set(-0.12, 0.1, 0);
    legL.castShadow = true;
    legL.name = "legL";
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), tunicMat);
    legR.position.set(0.12, 0.1, 0);
    legR.castShadow = true;
    legR.name = "legR";
    group.add(legR);

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.4, 0.24), tunicMat);
    torso.position.set(0, 0.4, 0);
    torso.castShadow = true;
    group.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), skinMat);
    head.position.set(0, 0.73, 0);
    head.castShadow = true;
    group.add(head);

    // Archer cowl / hat
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x3b6633, roughness: 0.8 }); // Forest green
    const hatBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.3), hatMat);
    hatBase.position.set(0, 0.86, 0);
    group.add(hatBase);
    
    const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.22), hatMat);
    hatTop.position.set(0, 0.94, -0.04);
    group.add(hatTop);

    // Red feather
    const feather = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.06), new THREE.MeshStandardMaterial({ color: 0xff3300 }));
    feather.position.set(0.08, 1.0, -0.06);
    feather.rotation.z = -Math.PI / 6;
    group.add(feather);

    // Bow (held out left hand)
    const bowGroup = new THREE.Group();
    bowGroup.position.set(-0.25, 0.42, 0.22);
    
    const bowMiddle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.06), woodMat);
    bowGroup.add(bowMiddle);
    
    const bowTop = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), woodMat);
    bowTop.position.set(0, 0.13, -0.04);
    bowTop.rotation.x = Math.PI / 12;
    bowGroup.add(bowTop);

    const bowBottom = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.06), woodMat);
    bowBottom.position.set(0, -0.13, -0.04);
    bowBottom.rotation.x = -Math.PI / 12;
    bowGroup.add(bowBottom);

    // Bow string
    const stringMat = new THREE.MeshBasicMaterial({ color: 0xdddddd });
    const string = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.5, 0.01), stringMat);
    string.position.set(0, 0, -0.1);
    bowGroup.add(string);

    group.add(bowGroup);

    // Arrow (nocked on right hand)
    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(0.18, 0.42, 0.1);
    arrowGroup.rotation.y = -Math.PI / 5;

    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.32), woodMat);
    shaft.position.set(0, 0, 0.08);
    arrowGroup.add(shaft);

    const arrowhead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.06), steelMat);
    arrowhead.position.set(0, 0, 0.24);
    arrowGroup.add(arrowhead);

    const fletching = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    fletching.position.set(0, 0, -0.08);
    arrowGroup.add(fletching);

    group.add(arrowGroup);

  } else if (type === 'Cavalry') {
    // Horse structure
    const horseGroup = new THREE.Group();
    horseGroup.position.set(0, 0, 0);

    const horseMat = new THREE.MeshStandardMaterial({ color: horseColor, roughness: 0.6 });
    const horseManeMat = new THREE.MeshStandardMaterial({ color: horseManeColor, roughness: 0.8 });
    const horseHoofMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    // Horse body
    const hBody = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.34, 0.82), horseMat);
    hBody.position.set(0, 0.3, 0);
    hBody.castShadow = true;
    horseGroup.add(hBody);

    // Horse neck & head
    const hNeck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 0.22), horseMat);
    hNeck.position.set(0, 0.54, 0.3);
    hNeck.rotation.x = -Math.PI / 6;
    hNeck.castShadow = true;
    horseGroup.add(hNeck);

    const hHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.34), horseMat);
    hHead.position.set(0, 0.68, 0.4);
    hHead.castShadow = true;
    hHead.name = "horseHead";
    horseGroup.add(hHead);

    // Mane
    const hMane = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.14), horseManeMat);
    hMane.position.set(0, 0.56, 0.16);
    horseGroup.add(hMane);

    // Horse legs
    const legCoords = [
      [-0.16, -0.1], // Back Left
      [0.16, -0.1],  // Back Right
      [-0.16, 0.2],  // Front Left
      [0.16, 0.2]   // Front Right
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.09), horseMat);
      leg.position.set(lx, 0.11, lz);
      leg.castShadow = true;
      horseGroup.add(leg);

      const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.11), horseHoofMat);
      hoof.position.set(lx, 0.02, lz);
      horseGroup.add(hoof);
    });

    group.add(horseGroup);

    // Cavalry Rider
    const riderGroup = new THREE.Group();
    riderGroup.position.set(0, 0.48, -0.04);

    // Rider torso
    const rTorso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.22), tunicMat);
    rTorso.position.set(0, 0.17, 0);
    rTorso.castShadow = true;
    riderGroup.add(rTorso);

    // Rider head
    const rHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), skinMat);
    rHead.position.set(0, 0.45, 0);
    rHead.castShadow = true;
    riderGroup.add(rHead);

    // Rider helmet
    const rHelmetMat = new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.3, metalness: 0.7 });
    const rHelmet = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.26), rHelmetMat);
    rHelmet.position.set(0, 0.56, 0);
    rHelmet.castShadow = true;
    riderGroup.add(rHelmet);

    // Lance (right hand)
    const lanceGroup = new THREE.Group();
    lanceGroup.position.set(0.24, 0.17, 0.12);
    lanceGroup.rotation.x = -Math.PI / 10; // angled forward

    // Wood shaft
    const lShaft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 1.0), woodMat);
    lShaft.position.set(0, 0, 0.15);
    lShaft.castShadow = true;
    lanceGroup.add(lShaft);

    // Lance tip
    const lTip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.18), steelMat);
    lTip.position.set(0, 0, 0.7);
    lanceGroup.add(lTip);

    // Lance Guard
    const lGuard = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.08), goldMat);
    lGuard.position.set(0, 0, -0.12);
    lanceGroup.add(lGuard);

    riderGroup.add(lanceGroup);

    group.add(riderGroup);
  } else if (type === 'HeavyGuard') {
    // Ağır Muhafız — geniş gövde, omuz zırhı, kule kalkan
    const helmetMat2 = new THREE.MeshStandardMaterial({ color: 0x5a6a78, roughness: 0.2, metalness: 0.9 });
    // Bacaklar (kalın)
    [-0.16, 0.16].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.18), steelMat);
      leg.position.set(lx, 0.12, 0); leg.castShadow = true; 
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });
    // Gövde (çok geniş)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.46, 0.32), steelMat);
    torso.position.set(0, 0.48, 0); torso.castShadow = true; group.add(torso);
    // Takım renk çizgisi
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.08, 0.33), tunicMat);
    stripe.position.set(0, 0.48, 0); group.add(stripe);
    // Omuz zırhları
    [[-0.36, 0.66], [0.36, 0.66]].forEach(([ox, oy]) => {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.32), helmetMat2);
      pad.position.set(ox, oy, 0); pad.castShadow = true; group.add(pad);
    });
    // Baş
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.3), new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.8 }));
    head.position.set(0, 0.83, 0); head.castShadow = true; group.add(head);
    // Kask (tam kafes miğfer)
    const kask = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.36), helmetMat2);
    kask.position.set(0, 0.97, 0); kask.castShadow = true; group.add(kask);
    // Kule kalkan
    const kKalkan = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.36), new THREE.MeshStandardMaterial({ color: shieldColor, roughness: 0.8 }));
    kKalkan.position.set(-0.38, 0.5, 0.1); kKalkan.castShadow = true; group.add(kKalkan);
    const kTrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.64, 0.04), steelMat);
    kTrim.position.set(-0.39, 0.5, 0.3); group.add(kTrim);
    const kIcon = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.14), tunicMat);
    kIcon.position.set(-0.37, 0.5, 0.1); group.add(kIcon);
    // Çekiç (sağ el)
    const hammerHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.46), woodMat);
    hammerHandle.position.set(0.36, 0.5, 0.12); group.add(hammerHandle);
    const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.22, 0.16), steelMat);
    hammerHead.position.set(0.36, 0.5, 0.36); group.add(hammerHead);

  } else if (type === 'Knight') {
    // Şövalye — parlak plaka zırh, tüylü miğfer, iki elli kılıç
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xccd9e8, roughness: 0.15, metalness: 0.95 });
    const plumeMat2 = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0xffd700 : 0xff6600, emissive: 0x332200, emissiveIntensity: 0.3 });
    // Bacaklar
    [-0.14, 0.14].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 0.14), plateMat);
      leg.position.set(lx, 0.11, 0); leg.castShadow = true;
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });
    // Gövde (daha büyük)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.46, 0.28), plateMat);
    torso.position.set(0, 0.45, 0); torso.castShadow = true; group.add(torso);
    const tunicOver = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.29), tunicMat);
    tunicOver.position.set(0, 0.34, 0); group.add(tunicOver);
    // Baş
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.8 }));
    head.position.set(0, 0.8, 0); head.castShadow = true; group.add(head);
    // Miğfer (yüz siperli)
    const helmetBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.24, 0.34), plateMat);
    helmetBase.position.set(0, 0.93, 0); helmetBase.castShadow = true; group.add(helmetBase);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.08), plateMat);
    visor.position.set(0, 0.88, 0.2); group.add(visor);
    // Tüy/Sorguç
    const plumeTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), plumeMat2);
    plumeTop.position.set(0, 1.1, 0); group.add(plumeTop);
    const plumeMid = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.12), plumeMat2);
    plumeMid.position.set(0, 1.04, -0.04); group.add(plumeMid);
    // Uzun kılıç (iki elle)
    const longBlade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.1), steelMat);
    longBlade.position.set(0.3, 0.65, 0.12); longBlade.rotation.z = 0.18; group.add(longBlade);
    const longGuard = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.08), goldMat);
    longGuard.position.set(0.3, 0.36, 0.12); group.add(longGuard);
    const longHandle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.05), woodMat);
    longHandle.position.set(0.3, 0.28, 0.12); group.add(longHandle);

  } else if (type === 'Catapult') {
    // Mancınık — tahta kuşatma makinesi (insansız)
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x4a2e10, roughness: 0.9 });
    const steelBolt = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.6 });
    // Platform
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.52), darkWood);
    base.position.set(0, 0.035, 0); base.castShadow = true; group.add(base);
    // Sol destek
    const suppL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.07), darkWood);
    suppL.position.set(-0.24, 0.22, 0); suppL.castShadow = true; group.add(suppL);
    // Sağ destek
    const suppR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.34, 0.07), darkWood);
    suppR.position.set(0.24, 0.22, 0); suppR.castShadow = true; group.add(suppR);
    // Üst çapraz kiriş
    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.07), darkWood);
    crossBeam.position.set(0, 0.37, 0); group.add(crossBeam);
    // Fırlatma kolu (çapraz)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.06), darkWood);
    arm.position.set(0, 0.55, 0.08);
    arm.rotation.x = -Math.PI / 5;
    arm.castShadow = true; group.add(arm);
    // Kova (arm ucunda)
    const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.16), darkWood);
    bucket.position.set(0, 0.92, 0.3); group.add(bucket);
    // Taş mermi
    const stone = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.95 }));
    stone.position.set(0, 1.0, 0.3); group.add(stone);
    // Tekerlekler
    [[-0.36, -0.18], [-0.36, 0.18], [0.36, -0.18], [0.36, 0.18]].forEach(([wx, wz], idx) => {
      const wheel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.18), darkWood);
      wheel.position.set(wx, 0.09, wz); 
      wheel.name = "wheel_" + idx;
      group.add(wheel);
      const axle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), steelBolt);
      axle.position.set(wx, 0.09, wz); group.add(axle);
    });
    // Takım rengi şerit
    const bandMat = new THREE.MeshStandardMaterial({ color: tunicColor, emissive: tunicColor, emissiveIntensity: 0.25 });
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.54), bandMat);
    band.position.set(0, 0.07, 0); group.add(band);

  } else if (type === 'Captain') {
    // Kaptan — pelerin, sorguçlu miğfer, kılıç
    const helmetMat3 = new THREE.MeshStandardMaterial({ color: helmetColor, roughness: 0.3, metalness: 0.7 });
    const capeMat = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0x003399 : 0x880011, roughness: 0.7 });
    // Bacaklar
    [-0.13, 0.13].forEach((lx, idx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), tunicMat);
      leg.position.set(lx, 0.11, 0); leg.castShadow = true;
      leg.name = idx === 0 ? "legL" : "legR";
      group.add(leg);
    });
    // Pelerin (arkada)
    const cape = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.06), capeMat);
    cape.position.set(0, 0.45, -0.18); cape.castShadow = true; group.add(cape);
    const capeLow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.07), capeMat);
    capeLow.position.set(0, 0.2, -0.16); group.add(capeLow);
    // Gövde
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.28), tunicMat);
    torso.position.set(0, 0.44, 0); torso.castShadow = true; group.add(torso);
    // Altın kemer
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.29), goldMat);
    belt.position.set(0, 0.28, 0); group.add(belt);
    // Baş
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.8 }));
    head.position.set(0, 0.8, 0); head.castShadow = true; group.add(head);
    // Miğfer
    const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.32), helmetMat3);
    helmet.position.set(0, 0.93, 0); group.add(helmet);
    // Büyük tüy sorgucu
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    p1.position.set(0, 1.08, 0); group.add(p1);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.1), new THREE.MeshStandardMaterial({ color: tunicColor, emissive: tunicColor, emissiveIntensity: 0.3 }));
    p2.position.set(0, 1.08, -0.06); group.add(p2);
    // Kılıç (yüksek tutulmuş)
    const capBlade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.08), steelMat);
    capBlade.position.set(0.3, 0.68, 0.1); group.add(capBlade);
    const capGuard = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.06), goldMat);
    capGuard.position.set(0.3, 0.47, 0.1); group.add(capGuard);
    const capHandle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.04), woodMat);
    capHandle.position.set(0.3, 0.4, 0.1); group.add(capHandle);
    // Kalkan
    const capShield = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.24), new THREE.MeshStandardMaterial({ color: shieldColor, roughness: 0.8 }));
    capShield.position.set(-0.28, 0.44, 0.08); group.add(capShield);
    const capShieldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.24), goldMat);
    capShieldTrim.position.set(-0.28, 0.61, 0.08); group.add(capShieldTrim);

  } else if (type === 'Mage') {
    // Büyücü — uzun robe, sivri şapka, parlak asa
    const robeMat = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0x1a0055 : 0x550011, roughness: 0.7 });
    const robeAccent = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0x6600ff : 0xff3300, emissive: team === 'blue' ? 0x330088 : 0x660000, emissiveIntensity: 0.5 });
    const crystalMat = new THREE.MeshStandardMaterial({ color: team === 'blue' ? 0x00f0ff : 0xff3300, emissive: team === 'blue' ? 0x00a0cc : 0xcc1100, emissiveIntensity: 0.9, transparent: true, opacity: 0.85 });
    // Etek (geniş)
    const robe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.28, 0.28), robeMat);
    robe.position.set(0, 0.14, 0); robe.castShadow = true; group.add(robe);
    // Üst robe
    const robeTorso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.26), robeMat);
    robeTorso.position.set(0, 0.44, 0); robeTorso.castShadow = true; group.add(robeTorso);
    // Yıldız motifi
    const star = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.1, 0.27), robeAccent);
    star.position.set(0, 0.44, 0); group.add(star);
    // Baş
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), new THREE.MeshStandardMaterial({ color: 0xffd1a4, roughness: 0.8 }));
    head.position.set(0, 0.78, 0); head.castShadow = true; group.add(head);
    // Sivri şapka (üç parça)
    const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.38), robeMat);
    hatBrim.position.set(0, 0.9, 0); group.add(hatBrim);
    const hatMid = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.22), robeMat);
    hatMid.position.set(0, 1.02, 0); group.add(hatMid);
    const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), robeMat);
    hatTop.position.set(0, 1.19, 0); group.add(hatTop);
    const hatTip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.04), robeAccent);
    hatTip.position.set(0, 1.33, 0); group.add(hatTip);
    // Asa gövdesi
    const staffShaft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.88, 0.04), woodMat);
    staffShaft.position.set(0.28, 0.44, 0.08); group.add(staffShaft);
    // Kristal küre (asa ucu)
    const orb = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), crystalMat);
    orb.position.set(0.28, 0.92, 0.08); 
    orb.name = "mageOrb";
    group.add(orb);
    const orbGlow = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), new THREE.MeshStandardMaterial({
      color: team === 'blue' ? 0x00f0ff : 0xff3300,
      emissive: team === 'blue' ? 0x00a0cc : 0xcc1100,
      emissiveIntensity: 0.6,
      transparent: true, opacity: 0.3
    }));
    orbGlow.position.set(0.28, 0.92, 0.08); 
    orbGlow.name = "mageOrbGlow";
    group.add(orbGlow);

    // Mistik PointLight parıltısı
    const staffLight = new THREE.PointLight(team === 'blue' ? 0x00f0ff : 0xff3300, 1.0, 3.5);
    staffLight.position.set(0.28, 0.92, 0.08);
    staffLight.name = "staffLight";
    group.add(staffLight);
  }

  // Set unit standing on the grid (y = 0 so they align perfectly on ground)
  group.position.y = 0.0;

  return group;
}

// Spawn exploding voxel particles
function spawnDebris(gridX, gridZ, team) {
  let color = team === 'blue' ? 0x00f0ff : 0xff0055;
  if (team === 'gold') color = 0xffd700; // Gold spark color for critical hits

  const count = team === 'gold' ? 32 + Math.floor(Math.random() * 12) : 15 + Math.floor(Math.random() * 8);

  for (let i = 0; i < count; i++) {
    const geo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: team === 'gold' ? 1.5 : 0.4,
      roughness: 0.5,
      metalness: team === 'gold' ? 0.9 : 0.1
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;

    // Spawn cluster at unit visual heights
    mesh.position.set(
      gridX - 5.5 + (Math.random() - 0.5) * 0.5,
      0.4 + Math.random() * 0.8,
      gridZ - 5.5 + (Math.random() - 0.5) * 0.5
    );

    scene.add(mesh);

    debrisList.push({
      mesh,
      vx: (Math.random() - 0.5) * (team === 'gold' ? 7.0 : 4.5),
      vy: Math.random() * (team === 'gold' ? 7.0 : 4.5) + (team === 'gold' ? 4.5 : 3.0), // Burst up higher if gold
      vz: (Math.random() - 0.5) * (team === 'gold' ? 7.0 : 4.5),
      life: (team === 'gold' ? 1.2 : 0.9) + Math.random() * 0.4
    });
  }
}

// Spawn projectile based on attacker type (Mage / Archer / Catapult)
function spawnProjectile(attackerType, team, startX, startZ, targetX, targetZ, onHit) {
  const group = new THREE.Group();
  let material, geometry;
  let arc = 0;
  let duration = 0.55; 

  const color = team === 'blue' ? 0x00f0ff : 0xff0055;

  if (attackerType === 'Archer') {
    // Arrow projectile
    geometry = new THREE.BoxGeometry(0.04, 0.04, 0.28);
    material = new THREE.MeshStandardMaterial({ color: 0xa66f3c, roughness: 0.8 });
    const arrow = new THREE.Mesh(geometry, material);
    arrow.castShadow = true;
    group.add(arrow);
    
    // Arrow tip
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.08), new THREE.MeshStandardMaterial({ color: 0xccd9e8, metalness: 0.8 }));
    tip.position.z = 0.16;
    group.add(tip);

    arc = 0.8; 
    duration = 0.5;
  } else if (attackerType === 'Mage') {
    // Magic plasma sphere
    geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    material = new THREE.MeshStandardMaterial({ 
      color: color, 
      emissive: color, 
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.85
    });
    const plasma = new THREE.Mesh(geometry, material);
    group.add(plasma);

    // Glowing core pointlight
    const projLight = new THREE.PointLight(color, 1.2, 3.0);
    projLight.name = "projLight";
    group.add(projLight);

    arc = 0.25; 
    duration = 0.65;
  } else if (attackerType === 'Catapult') {
    // Catapult boulder projectile
    geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    material = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
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
  const color = team === 'blue' ? 0x00f0ff : 0xff0055;
  
  if (unitType === 'Mage') {
    // Magic ring particle explosion
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      const geo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      const mat = new THREE.MeshStandardMaterial({
        color: team === 'blue' ? 0x8800ff : 0xff0055,
        emissive: team === 'blue' ? 0x5500aa : 0xaa0033,
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
    const deathLight = new THREE.PointLight(team === 'blue' ? 0x8800ff : 0xff0055, 2.0, 5.0);
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
    fade();

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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
  // Collect all child meshes of unit groups
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

  // ── 6. RENDER CALLS ───────────────────────────────────────────────────
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
