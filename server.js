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
  return [
    // Blue Team
    { id: 'blue_cav', type: 'Cavalry', team: 'blue', name: 'Mavi Süvari', x: 2, z: 0, hp: 85, maxHp: 85, atk: 25, range: 1, mov: 5, ap: 2, maxAp: 2 },
    { id: 'blue_inf1', type: 'Infantry', team: 'blue', name: 'Mavi Piyade 1', x: 4, z: 0, hp: 100, maxHp: 100, atk: 30, range: 1, mov: 3, ap: 2, maxAp: 2 },
    { id: 'blue_inf2', type: 'Infantry', team: 'blue', name: 'Mavi Piyade 2', x: 7, z: 0, hp: 100, maxHp: 100, atk: 30, range: 1, mov: 3, ap: 2, maxAp: 2 },
    { id: 'blue_arc', type: 'Archer', team: 'blue', name: 'Mavi Okçu', x: 9, z: 0, hp: 70, maxHp: 70, atk: 20, range: 4, mov: 3, ap: 2, maxAp: 2 },

    // Red Team
    { id: 'red_cav', type: 'Cavalry', team: 'red', name: 'Kırmızı Süvari', x: 2, z: 11, hp: 85, maxHp: 85, atk: 25, range: 1, mov: 5, ap: 2, maxAp: 2 },
    { id: 'red_inf1', type: 'Infantry', team: 'red', name: 'Kırmızı Piyade 1', x: 4, z: 11, hp: 100, maxHp: 100, atk: 30, range: 1, mov: 3, ap: 2, maxAp: 2 },
    { id: 'red_inf2', type: 'Infantry', team: 'red', name: 'Kırmızı Piyade 2', x: 7, z: 11, hp: 100, maxHp: 100, atk: 30, range: 1, mov: 3, ap: 2, maxAp: 2 },
    { id: 'red_arc', type: 'Archer', team: 'red', name: 'Kırmızı Okçu', x: 9, z: 11, hp: 70, maxHp: 70, atk: 20, range: 4, mov: 3, ap: 2, maxAp: 2 }
  ];
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

    // Broadcast move to all players in the room
    io.to(roomCode).emit('unitMoved', {
      unitId,
      oldX,
      oldZ,
      newX: targetX,
      newZ: targetZ,
      apRemaining: unit.ap,
      gameState
    });
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

    // Broadcast attack results
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
    }
  });

  // End turn event
  socket.on('endTurn', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return socket.emit('errorMsg', { message: 'Oda bulunamadı.' });

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return socket.emit('errorMsg', { message: 'Oyuncu bu odada değil.' });

    const { gameState } = room;
    if (gameState.winner) return socket.emit('errorMsg', { message: 'Oyun çoktan bitti.' });
    if (gameState.activeTeam !== player.team) return socket.emit('errorMsg', { message: 'Sizin sıranız değil.' });

    // Switch active team
    const nextTeam = gameState.activeTeam === 'blue' ? 'red' : 'blue';
    gameState.activeTeam = nextTeam;

    if (nextTeam === 'blue') {
      gameState.turn += 1;
    }

    // Replenish action points of the incoming team's units
    gameState.units.forEach(u => {
      if (u.team === nextTeam) {
        u.ap = u.maxAp;
      }
    });

    io.to(roomCode).emit('turnEnded', {
      activeTeam: nextTeam,
      turn: gameState.turn,
      gameState
    });
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
