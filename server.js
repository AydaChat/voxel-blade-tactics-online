const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store active game rooms
// Key: roomCode (4-letter uppercase string)
const rooms = {};

// Helper to generate a random 4-letter uppercase code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code;
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms[code]);
  return code;
}

// Initial units configuration (12x12 grid)
// Team Blue starts at z = 0, Team Red starts at z = 11
function createInitialUnits() {
  const ap = 1, maxAp = 1;
  const units = [];

  // ── MAVI TAKIM ──────────────────────────────────────────────────────────
  // Arka Sıra (z=0): Elit birimler
  const blueBack = [
    { id:'blue_b0',  type:'Cavalry',   name:'Mavi Süvari Sol',      x:0,  z:0, hp:80,  maxHp:80,  atk:25, range:1, mov:4 },
    { id:'blue_b1',  type:'HeavyGuard',name:'Mavi Ağır Muhafız 1',  x:1,  z:0, hp:130, maxHp:130, atk:35, range:1, mov:2 },
    { id:'blue_b2',  type:'Archer',    name:'Mavi Okçu 1',          x:2,  z:0, hp:60,  maxHp:60,  atk:18, range:4, mov:3 },
    { id:'blue_b3',  type:'Knight',    name:'Mavi Şövalye 1',       x:3,  z:0, hp:90,  maxHp:90,  atk:40, range:1, mov:3 },
    { id:'blue_b4',  type:'Catapult',  name:'Mavi Mancınık Sol',    x:4,  z:0, hp:45,  maxHp:45,  atk:55, range:6, mov:1 },
    { id:'blue_b5',  type:'Captain',   name:'Mavi Kaptan 1',        x:5,  z:0, hp:105, maxHp:105, atk:30, range:2, mov:3 },
    { id:'blue_b6',  type:'Mage',      name:'Mavi Büyücü',          x:6,  z:0, hp:50,  maxHp:50,  atk:42, range:5, mov:2 },
    { id:'blue_b7',  type:'Captain',   name:'Mavi Kaptan 2',        x:7,  z:0, hp:105, maxHp:105, atk:30, range:2, mov:3 },
    { id:'blue_b8',  type:'Catapult',  name:'Mavi Mancınık Sağ',   x:8,  z:0, hp:45,  maxHp:45,  atk:55, range:6, mov:1 },
    { id:'blue_b9',  type:'Knight',    name:'Mavi Şövalye 2',       x:9,  z:0, hp:90,  maxHp:90,  atk:40, range:1, mov:3 },
    { id:'blue_b10', type:'Archer',    name:'Mavi Okçu 2',          x:10, z:0, hp:60,  maxHp:60,  atk:18, range:4, mov:3 },
    { id:'blue_b11', type:'Cavalry',   name:'Mavi Süvari Sağ',      x:11, z:0, hp:80,  maxHp:80,  atk:25, range:1, mov:4 },
  ];
  // Ön Sıra (z=1): Piyade sırası
  const blueFront = [
    { id:'blue_f0',  type:'Infantry',  name:'Mavi Piyade 1',   x:0,  z:1, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'blue_f1',  type:'Infantry',  name:'Mavi Piyade 2',   x:1,  z:1, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'blue_f2',  type:'Infantry',  name:'Mavi Piyade 3',   x:2,  z:1, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'blue_f3',  type:'Infantry',  name:'Mavi Piyade 4',   x:3,  z:1, hp:80, maxHp:80, atk:25, range:1, mov:3 },
    { id:'blue_f4',  type:'Infantry',  name:'Mavi Piyade 5',   x:4,  z:1, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'blue_f5',  type:'Infantry',  name:'Mavi Piyade 6',   x:5,  z:1, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'blue_f6',  type:'Infantry',  name:'Mavi Piyade 7',   x:6,  z:1, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'blue_f7',  type:'Infantry',  name:'Mavi Piyade 8',   x:7,  z:1, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'blue_f8',  type:'Infantry',  name:'Mavi Piyade 9',   x:8,  z:1, hp:80, maxHp:80, atk:25, range:1, mov:3 },
    { id:'blue_f9',  type:'Infantry',  name:'Mavi Piyade 10',  x:9,  z:1, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'blue_f10', type:'Infantry',  name:'Mavi Piyade 11',  x:10, z:1, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'blue_f11', type:'Infantry',  name:'Mavi Piyade 12',  x:11, z:1, hp:85, maxHp:85, atk:22, range:1, mov:3 },
  ];

  // ── KIRMIZI TAKIM ────────────────────────────────────────────────────────
  // Arka Sıra (z=11)
  const redBack = [
    { id:'red_b0',  type:'Cavalry',   name:'Kırmızı Süvari Sol',      x:0,  z:11, hp:80,  maxHp:80,  atk:25, range:1, mov:4 },
    { id:'red_b1',  type:'HeavyGuard',name:'Kırmızı Ağır Muhafız 1',  x:1,  z:11, hp:130, maxHp:130, atk:35, range:1, mov:2 },
    { id:'red_b2',  type:'Archer',    name:'Kırmızı Okçu 1',          x:2,  z:11, hp:60,  maxHp:60,  atk:18, range:4, mov:3 },
    { id:'red_b3',  type:'Knight',    name:'Kırmızı Şövalye 1',       x:3,  z:11, hp:90,  maxHp:90,  atk:40, range:1, mov:3 },
    { id:'red_b4',  type:'Catapult',  name:'Kırmızı Mancınık Sol',    x:4,  z:11, hp:45,  maxHp:45,  atk:55, range:6, mov:1 },
    { id:'red_b5',  type:'Captain',   name:'Kırmızı Kaptan 1',        x:5,  z:11, hp:105, maxHp:105, atk:30, range:2, mov:3 },
    { id:'red_b6',  type:'Mage',      name:'Kırmızı Büyücü',          x:6,  z:11, hp:50,  maxHp:50,  atk:42, range:5, mov:2 },
    { id:'red_b7',  type:'Captain',   name:'Kırmızı Kaptan 2',        x:7,  z:11, hp:105, maxHp:105, atk:30, range:2, mov:3 },
    { id:'red_b8',  type:'Catapult',  name:'Kırmızı Mancınık Sağ',   x:8,  z:11, hp:45,  maxHp:45,  atk:55, range:6, mov:1 },
    { id:'red_b9',  type:'Knight',    name:'Kırmızı Şövalye 2',       x:9,  z:11, hp:90,  maxHp:90,  atk:40, range:1, mov:3 },
    { id:'red_b10', type:'Archer',    name:'Kırmızı Okçu 2',          x:10, z:11, hp:60,  maxHp:60,  atk:18, range:4, mov:3 },
    { id:'red_b11', type:'Cavalry',   name:'Kırmızı Süvari Sağ',      x:11, z:11, hp:80,  maxHp:80,  atk:25, range:1, mov:4 },
  ];
  // Ön Sıra (z=10)
  const redFront = [
    { id:'red_f0',  type:'Infantry',  name:'Kırmızı Piyade 1',   x:0,  z:10, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'red_f1',  type:'Infantry',  name:'Kırmızı Piyade 2',   x:1,  z:10, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'red_f2',  type:'Infantry',  name:'Kırmızı Piyade 3',   x:2,  z:10, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'red_f3',  type:'Infantry',  name:'Kırmızı Piyade 4',   x:3,  z:10, hp:80, maxHp:80, atk:25, range:1, mov:3 },
    { id:'red_f4',  type:'Infantry',  name:'Kırmızı Piyade 5',   x:4,  z:10, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'red_f5',  type:'Infantry',  name:'Kırmızı Piyade 6',   x:5,  z:10, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'red_f6',  type:'Infantry',  name:'Kırmızı Piyade 7',   x:6,  z:10, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'red_f7',  type:'Infantry',  name:'Kırmızı Piyade 8',   x:7,  z:10, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'red_f8',  type:'Infantry',  name:'Kırmızı Piyade 9',   x:8,  z:10, hp:80, maxHp:80, atk:25, range:1, mov:3 },
    { id:'red_f9',  type:'Infantry',  name:'Kırmızı Piyade 10',  x:9,  z:10, hp:85, maxHp:85, atk:22, range:1, mov:3 },
    { id:'red_f10', type:'Infantry',  name:'Kırmızı Piyade 11',  x:10, z:10, hp:90, maxHp:90, atk:20, range:1, mov:3 },
    { id:'red_f11', type:'Infantry',  name:'Kırmızı Piyade 12',  x:11, z:10, hp:85, maxHp:85, atk:22, range:1, mov:3 },
  ];

  [...blueBack, ...blueFront].forEach(u => units.push({ ...u, team:'blue', ap, maxAp }));
  [...redBack,  ...redFront ].forEach(u => units.push({ ...u, team:'red',  ap, maxAp }));
  return units;
}

// ── Saldırı Sonucu Hesaplayıcı (Crit & Dodge) ─────────────────────────────
function calculateAttackResults(attacker, target) {
  // %8 savuşturma şansı
  const isDodge = Math.random() < 0.08;
  if (isDodge) {
    return { damage: 0, isCrit: false, isDodge: true };
  }
  
  // %12 kritik vuruş şansı
  const isCrit = Math.random() < 0.12;
  const variance = 0.85 + Math.random() * 0.3;
  let damage = Math.max(1, Math.round(attacker.atk * variance));
  if (isCrit) {
    damage = Math.round(damage * 2.0);
  }
  
  return { damage, isCrit, isDodge: false };
}

// ── Tur geçiş yardımcısı ─────────────────────────────────────────────────
// Hamle veya saldırı sonrası otomatik olarak çağrılır.
function doEndTurn(room, io, roomCode) {
  const { gameState } = room;
  if (gameState.winner) return;

  const nextTeam = gameState.activeTeam === 'blue' ? 'red' : 'blue';
  gameState.activeTeam = nextTeam;

  if (nextTeam === 'blue') {
    gameState.turn += 1;
  }

  // Gelen takımın tüm birliklerinin EP'sini yenile
  gameState.units.forEach(u => {
    if (u.team === nextTeam) u.ap = u.maxAp;
  });

  io.to(roomCode).emit('turnEnded', {
    activeTeam: nextTeam,
    turn: gameState.turn,
    gameState
  });

  // Eğer odada AI botu varsa ve sıra botun (kırmızı) ise bot hamlesini tetikle
  if (room.vsAI && nextTeam === 'red' && !gameState.winner) {
    // Düşünme hissi için gecikmeli tetikle
    setTimeout(() => {
      triggerAILogic(room, io);
    }, 1100);
  }
}

// ── Yapay Zeka Karar Motoru (AI Decision Engine) ──────────────────────────
function triggerAILogic(room, io) {
  const { gameState } = room;
  if (gameState.winner || gameState.activeTeam !== 'red') return;

  // Botun eyleme geçirebileceği kırmızı birimler
  const redUnits = gameState.units.filter(u => u.team === 'red');
  const blueUnits = gameState.units.filter(u => u.team === 'blue');

  if (redUnits.length === 0 || blueUnits.length === 0) {
    doEndTurn(room, io, room.code);
    return;
  }

  const diff = room.difficulty || 'medium';
  let decision = null;

  if (diff === 'easy') {
    decision = calculateEasyDecision(room, redUnits, blueUnits);
  } else if (diff === 'medium') {
    decision = calculateMediumDecision(room, redUnits, blueUnits);
  } else {
    decision = calculateHardDecision(room, redUnits, blueUnits);
  }

  if (!decision || decision.type === 'skip') {
    doEndTurn(room, io, room.code);
    return;
  }

  const { unit, target } = decision;

  if (decision.type === 'move') {
    const oldX = unit.x;
    const oldZ = unit.z;
    unit.x = target.x;
    unit.z = target.z;
    unit.ap = 0; 

    io.to(room.code).emit('unitMoved', {
      unitId: unit.id,
      oldX,
      oldZ,
      newX: target.x,
      newZ: target.z,
      apRemaining: 0,
      gameState
    });

    setTimeout(() => {
      doEndTurn(room, io, room.code);
    }, 650);

  } else if (decision.type === 'attack') {
    unit.ap = 0; 

    // Hasar, kritik vuruş ve savuşturma durumunu hesapla
    const { damage, isCrit, isDodge } = calculateAttackResults(unit, target);
    target.hp -= damage;

    const targetDead = target.hp <= 0;
    if (targetDead) {
      gameState.units = gameState.units.filter(u => u.id !== target.id);
    }

    const blueRemaining = gameState.units.some(u => u.team === 'blue');
    if (!blueRemaining) {
      gameState.winner = 'red';
    }

    io.to(room.code).emit('unitAttacked', {
      attackerId: unit.id,
      targetId: target.id,
      damage,
      targetHp: target.hp,
      targetDead,
      isCrit,
      isDodge,
      gameState
    });

    if (gameState.winner) {
      io.to(room.code).emit('gameOver', { winner: 'red' });
    } else {
      const delay = targetDead ? 950 : 650;
      setTimeout(() => {
        doEndTurn(room, io, room.code);
      }, delay);
    }
  }
}

// Kolay Mod Karar Algoritması
function calculateEasyDecision(room, redUnits, blueUnits) {
  if (Math.random() < 0.3) return { type: 'skip' };

  const unit = redUnits[Math.floor(Math.random() * redUnits.length)];
  const inRangeTargets = blueUnits.filter(b => {
    const dist = Math.abs(unit.x - b.x) + Math.abs(unit.z - b.z);
    return dist <= unit.range;
  });

  if (inRangeTargets.length > 0) {
    const target = inRangeTargets[Math.floor(Math.random() * inRangeTargets.length)];
    return { type: 'attack', unit, target };
  }

  const moves = getValidMoves(room, unit);
  if (moves.length > 0) {
    const target = moves[Math.floor(Math.random() * moves.length)];
    return { type: 'move', unit, target };
  }

  return { type: 'skip' };
}

// Orta Mod Karar Algoritması
function calculateMediumDecision(room, redUnits, blueUnits) {
  for (const unit of redUnits) {
    const targets = blueUnits.filter(b => {
      const dist = Math.abs(unit.x - b.x) + Math.abs(unit.z - b.z);
      return dist <= unit.range;
    });

    if (targets.length > 0) {
      targets.sort((a, b) => a.hp - b.hp);
      const target = Math.random() < 0.6 ? targets[0] : targets[Math.floor(Math.random() * targets.length)];
      return { type: 'attack', unit, target };
    }
  }

  const meleeUnits = redUnits.filter(u => ['Cavalry', 'Knight', 'Infantry', 'HeavyGuard', 'Captain'].includes(u.type));
  const candidateUnits = meleeUnits.length > 0 ? meleeUnits : redUnits;
  const unit = candidateUnits[Math.floor(Math.random() * candidateUnits.length)];

  const moves = getValidMoves(room, unit);
  if (moves.length > 0) {
    let closestBlue = null;
    let minDist = Infinity;
    blueUnits.forEach(b => {
      const dist = Math.abs(unit.x - b.x) + Math.abs(unit.z - b.z);
      if (dist < minDist) {
        minDist = dist;
        closestBlue = b;
      }
    });

    if (closestBlue) {
      let bestMove = moves[0];
      let bestDist = Infinity;
      moves.forEach(m => {
        const dist = Math.abs(m.x - closestBlue.x) + Math.abs(m.z - closestBlue.z);
        if (dist < bestDist) {
          bestDist = dist;
          bestMove = m;
        }
      });
      return { type: 'move', unit, target: bestMove };
    }
  }

  return { type: 'skip' };
}

// Zor Mod Karar Algoritması (Heuristic Taktik)
function calculateHardDecision(room, redUnits, blueUnits) {
  for (const unit of redUnits) {
    const targets = blueUnits.filter(b => {
      const dist = Math.abs(unit.x - b.x) + Math.abs(unit.z - b.z);
      return dist <= unit.range && b.hp <= Math.round(unit.atk * 0.85);
    });

    if (targets.length > 0) {
      targets.sort((a, b) => {
        const priority = { 'Mage': 3, 'Catapult': 3, 'Archer': 2, 'Captain': 2, 'Knight': 2, 'Infantry': 1 };
        return (priority[b.type] || 0) - (priority[a.type] || 0);
      });
      return { type: 'attack', unit, target: targets[0] };
    }
  }

  let bestAttack = null;
  let bestScore = -Infinity;

  for (const unit of redUnits) {
    const targets = blueUnits.filter(b => {
      const dist = Math.abs(unit.x - b.x) + Math.abs(unit.z - b.z);
      return dist <= unit.range;
    });

    for (const tgt of targets) {
      const dmgPct = Math.min(1.0, unit.atk / tgt.maxHp);
      let threatBonus = 0;
      if (['Mage', 'Catapult'].includes(tgt.type)) threatBonus = 50;
      else if (['Knight', 'Captain', 'Archer'].includes(tgt.type)) threatBonus = 30;

      const score = (dmgPct * 100) + threatBonus;
      if (score > bestScore) {
        bestScore = score;
        bestAttack = { type: 'attack', unit, target: tgt };
      }
    }
  }

  if (bestAttack) return bestAttack;

  redUnits.sort((a, b) => {
    const prio = { 'Cavalry': 5, 'Knight': 4, 'Captain': 3, 'Infantry': 2, 'HeavyGuard': 1 };
    return (prio[b.type] || 0) - (prio[a.type] || 0);
  });

  for (const unit of redUnits) {
    const moves = getValidMoves(room, unit);
    if (moves.length === 0) continue;

    let closestBlue = null;
    let minDist = Infinity;
    blueUnits.forEach(b => {
      const dist = Math.abs(unit.x - b.x) + Math.abs(unit.z - b.z);
      if (dist < minDist) {
        minDist = dist;
        closestBlue = b;
      }
    });

    if (!closestBlue) continue;

    const isRanged = ['Catapult', 'Mage', 'Archer'].includes(unit.type);

    if (isRanged) {
      let bestMove = null;
      let bestWeight = -Infinity;

      moves.forEach(m => {
        const dist = Math.abs(m.x - closestBlue.x) + Math.abs(m.z - closestBlue.z);
        let weight = 0;
        if (dist === unit.range) weight += 100;
        else if (dist > unit.range) weight += (50 - (dist - unit.range) * 10);
        else weight += (dist * 15);

        const threat = blueUnits.some(b => {
          if (['Infantry', 'Knight', 'Cavalry'].includes(b.type)) {
            return (Math.abs(m.x - b.x) + Math.abs(m.z - b.z)) <= b.mov;
          }
          return false;
        });
        if (!threat) weight += 30;

        if (weight > bestWeight) {
          bestWeight = weight;
          bestMove = m;
        }
      });

      if (bestMove) return { type: 'move', unit, target: bestMove };

    } else {
      let bestMove = moves[0];
      let bestDist = Infinity;

      moves.forEach(m => {
        const dist = Math.abs(m.x - closestBlue.x) + Math.abs(m.z - closestBlue.z);
        if (dist < bestDist) {
          bestDist = dist;
          bestMove = m;
        }
      });

      return { type: 'move', unit, target: bestMove };
    }
  }

  return { type: 'skip' };
}

// Birlikler için hareket karesi hesaplama
function getValidMoves(room, unit) {
  const valid = [];
  for (let x = 0; x < 12; x++) {
    for (let z = 0; z < 12; z++) {
      const dist = Math.abs(unit.x - x) + Math.abs(unit.z - z);
      if (dist > 0 && dist <= unit.mov) {
        if (!room.gameState.units.some(u => u.x === x && u.z === z)) {
          valid.push({ x, z });
        }
      }
    }
  }
  return valid;
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Create room event
  socket.on('createRoom', ({ username, vsAI, difficulty } = {}) => {
    const code = generateRoomCode();
    const playerName = (username || 'Oyuncu-1').substring(0, 16).toUpperCase();
    rooms[code] = {
      code,
      players: [{ id: socket.id, team: 'blue', name: playerName, username: playerName }],
      gameState: {
        units: createInitialUnits(),
        activeTeam: 'blue',
        winner: null,
        turn: 1
      },
      vsAI: !!vsAI,
      difficulty: difficulty || 'medium',
      createdAt: Date.now(),
      timeoutId: null
    };

    socket.join(code);

    if (vsAI) {
      const botName = `YAPAY ZEKA (${(difficulty || 'medium').toUpperCase()})`;
      rooms[code].players.push({
        id: 'AI_BOT',
        team: 'red',
        name: botName,
        username: botName
      });
      console.log(`Oda oluşturuldu (VS AI): ${code} - Oyuncu: ${playerName} - Zorluk: ${difficulty}`);

      socket.emit('gameStart', {
        team: 'blue',
        players: rooms[code].players,
        gameState: rooms[code].gameState,
        roomCode: code
      });
    } else {
      // 1-minute (60 seconds) room timeout if no opponent joins
      const ROOM_TIMEOUT_MS = 60000;
      const timeoutId = setTimeout(() => {
        const waitingRoom = rooms[code];
        if (waitingRoom && waitingRoom.players.length < 2) {
          console.log(`Oda zaman aşımına uğradı (1 dk doldu): ${code}`);
          io.to(code).emit('roomTimeout', {
            message: '1 dakika boyunca rakip bağlanmadığı için oda zaman aşımına uğradı ve kapatıldı.'
          });
          delete rooms[code];
        }
      }, ROOM_TIMEOUT_MS);

      rooms[code].timeoutId = timeoutId;
      const expiresAt = Date.now() + ROOM_TIMEOUT_MS;

      socket.emit('roomCreated', { 
        code, 
        timeoutDuration: 60,
        expiresAt 
      });
      console.log(`Oda oluşturuldu: ${code} - Oyuncu: ${playerName} (60s zaman aşımı devrede)`);
    }
  });

  // Cancel room event (Host cancels match creation)
  socket.on('cancelRoom', ({ roomCode } = {}) => {
    if (!roomCode) return;
    const cleanCode = roomCode.toUpperCase();
    const room = rooms[cleanCode];

    if (room && room.players.length === 1 && room.players[0].id === socket.id) {
      if (room.timeoutId) {
        clearTimeout(room.timeoutId);
        room.timeoutId = null;
      }
      delete rooms[cleanCode];
      socket.leave(cleanCode);
      console.log(`Oda sahibi tarafından iptal edildi: ${cleanCode}`);
      socket.emit('roomCancelled', { message: 'Oda oluşturma iptal edildi.' });
    }
  });

  // Join room event
  socket.on('joinRoom', ({ code, username } = {}) => {
    if (!code) {
      return socket.emit('errorMsg', { message: 'Geçersiz oda kodu.' });
    }
    const cleanCode = code.toUpperCase();
    const room = rooms[cleanCode];

    if (!room) {
      return socket.emit('errorMsg', { message: 'Oda bulunamadı.' });
    }

    if (room.players.length >= 2) {
      return socket.emit('errorMsg', { message: 'Oda dolu.' });
    }

    // Opponent connected in time -> clear waiting timeout
    if (room.timeoutId) {
      clearTimeout(room.timeoutId);
      room.timeoutId = null;
      console.log(`Oda zaman aşımı sayacı durduruldu: ${cleanCode}`);
    }

    // Add Player 2 as 'red'
    const playerName = (username || 'Oyuncu-2').substring(0, 16).toUpperCase();
    room.players.push({ id: socket.id, team: 'red', name: playerName, username: playerName });
    socket.join(cleanCode);

    console.log(`${playerName} odaya katıldı: ${cleanCode}`);

    // Notify each player that game has started
    const player1 = room.players[0];
    const player2 = room.players[1];

    io.to(player1.id).emit('gameStart', {
      team: 'blue',
      players: room.players,
      gameState: room.gameState,
      roomCode: cleanCode
    });

    io.to(player2.id).emit('gameStart', {
      team: 'red',
      players: room.players,
      gameState: room.gameState,
      roomCode: cleanCode
    });
  });

  // Move unit event
  socket.on('moveUnit', ({ roomCode, unitId, targetX, targetZ }) => {
    const room = rooms[roomCode];
    if (!room) return socket.emit('errorMsg', { message: 'Oda bulunamadı.' });

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return socket.emit('errorMsg', { message: 'Oyuncu bu odada değil.' });

    const { gameState } = room;
    if (gameState.winner) return socket.emit('errorMsg', { message: 'Oyun çoktan bitti.' });
    if (gameState.activeTeam !== player.team) return socket.emit('errorMsg', { message: 'Sizin sıranız değil.' });

    const unit = gameState.units.find(u => u.id === unitId);
    if (!unit) return socket.emit('errorMsg', { message: 'Birlik bulunamadı.' });
    if (unit.team !== player.team) return socket.emit('errorMsg', { message: 'Bu birliğin sahibi siz değilsiniz.' });
    if (unit.ap <= 0) return socket.emit('errorMsg', { message: 'Birliğin Eylem Puanı (AP) kalmadı.' });

    // Boundary check
    if (targetX < 0 || targetX >= 12 || targetZ < 0 || targetZ >= 12) {
      return socket.emit('errorMsg', { message: 'Grid sınırlarının dışında.' });
    }

    // Collision check: Target cell must be empty
    const occupied = gameState.units.some(u => u.x === targetX && u.z === targetZ);
    if (occupied) return socket.emit('errorMsg', { message: 'Hedef kare dolu.' });

    // Distance check (Manhattan distance)
    const dist = Math.abs(unit.x - targetX) + Math.abs(unit.z - targetZ);
    if (dist > unit.mov) {
      return socket.emit('errorMsg', { message: 'Hedef kare hareket menzilinin dışında.' });
    }

    // Move logic
    const oldX = unit.x;
    const oldZ = unit.z;
    unit.x = targetX;
    unit.z = targetZ;
    unit.ap -= 1;

    // Hareket sonucunu odadaki herkese yayınla
    io.to(roomCode).emit('unitMoved', {
      unitId,
      oldX,
      oldZ,
      newX: targetX,
      newZ: targetZ,
      apRemaining: unit.ap,
      gameState
    });

    // Animasyonun görünmesi için kısa bekleme, sonra tur otomatik geçer
    setTimeout(() => doEndTurn(room, io, roomCode), 650);
  });

  // Attack unit event
  socket.on('attackUnit', ({ roomCode, attackerId, targetId }) => {
    const room = rooms[roomCode];
    if (!room) return socket.emit('errorMsg', { message: 'Oda bulunamadı.' });

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return socket.emit('errorMsg', { message: 'Oyuncu bu odada değil.' });

    const { gameState } = room;
    if (gameState.winner) return socket.emit('errorMsg', { message: 'Oyun çoktan bitti.' });
    if (gameState.activeTeam !== player.team) return socket.emit('errorMsg', { message: 'Sizin sıranız değil.' });

    const attacker = gameState.units.find(u => u.id === attackerId);
    if (!attacker) return socket.emit('errorMsg', { message: 'Saldıran birlik bulunamadı.' });
    if (attacker.team !== player.team) return socket.emit('errorMsg', { message: 'Bu birliğin sahibi siz değilsiniz.' });
    if (attacker.ap <= 0) return socket.emit('errorMsg', { message: 'Saldıran birliğin Eylem Puanı (AP) kalmadı.' });

    const target = gameState.units.find(u => u.id === targetId);
    if (!target) return socket.emit('errorMsg', { message: 'Hedef birlik bulunamadı.' });
    if (target.team === player.team) return socket.emit('errorMsg', { message: 'Dost birliklere saldırılamaz.' });

    // Distance check (Manhattan distance)
    const dist = Math.abs(attacker.x - target.x) + Math.abs(attacker.z - target.z);
    if (dist > attacker.range) {
      return socket.emit('errorMsg', { message: 'Hedef saldırı menzilinin dışında.' });
    }

    // Attack logic
    attacker.ap -= 1;

    // Hasar, kritik vuruş ve savuşturma durumunu hesapla
    const { damage, isCrit, isDodge } = calculateAttackResults(attacker, target);
    target.hp -= damage;

    const targetDead = target.hp <= 0;
    if (targetDead) {
      // Remove dead unit
      gameState.units = gameState.units.filter(u => u.id !== targetId);
    }

    // Check game over condition
    const redRemaining = gameState.units.some(u => u.team === 'red');
    const blueRemaining = gameState.units.some(u => u.team === 'blue');

    if (!redRemaining || !blueRemaining) {
      gameState.winner = !blueRemaining ? 'red' : 'blue';
    }

    // Saldırı sonucunu odadaki herkese yayınla
    io.to(roomCode).emit('unitAttacked', {
      attackerId,
      targetId,
      damage,
      targetHp: target.hp,
      targetDead,
      isCrit,
      isDodge,
      gameState
    });

    if (gameState.winner) {
      io.to(roomCode).emit('gameOver', { winner: gameState.winner });
    } else {
      // Ölüm animasyonu için biraz daha uzun bekleme, sonra tur otomatik geçer
      const delay = targetDead ? 950 : 650;
      setTimeout(() => doEndTurn(room, io, roomCode), delay);
    }
  });

  // Turu Atla (pas geç) — hiç hamle yapmadan turu rakibe devret
  socket.on('endTurn', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return socket.emit('errorMsg', { message: 'Oda bulunamadı.' });

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return socket.emit('errorMsg', { message: 'Oyuncu bu odada değil.' });

    const { gameState } = room;
    if (gameState.winner) return socket.emit('errorMsg', { message: 'Oyun çoktan bitti.' });
    if (gameState.activeTeam !== player.team) return socket.emit('errorMsg', { message: 'Sizin sıranız değil.' });

    doEndTurn(room, io, roomCode);
  });

  // Disconnection handler
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    
    // Find rooms this socket was in
    for (const code in rooms) {
      const room = rooms[code];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        if (room.timeoutId) {
          clearTimeout(room.timeoutId);
          room.timeoutId = null;
        }
        // Notify the other player
        socket.to(code).emit('opponentDisconnected', {
          message: 'Rakibiniz oyundan ayrıldı.'
        });
        console.log(`Cleaning up room ${code} because player ${socket.id} disconnected.`);
        delete rooms[code];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
