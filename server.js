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
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Create room event
  socket.on('createRoom', ({ username } = {}) => {
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
      }
    };
    socket.join(code);
    socket.emit('roomCreated', { code });
    console.log(`Oda oluşturuldu: ${code} - Oyuncu: ${playerName}`);
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

    // Calculate damage: basic attack with random variance (85% to 115%)
    const variance = 0.85 + Math.random() * 0.3;
    const damage = Math.max(1, Math.round(attacker.atk * variance));
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
