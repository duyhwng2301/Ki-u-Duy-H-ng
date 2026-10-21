/**
 * FootAI - Main Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMatchCenter();
  initTacticalBoard();
  initAiChat();
  initPlayerScout();
  initStandings();
  initLiveTickerSimulation();
});

/* ==========================================================================
   1. NAVIGATION & TAB SWITCHING
   ========================================================================== */
function initNavigation() {
  const tabButtons = document.querySelectorAll('.nav-tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(`pane-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }

      // If switching to tactics, resize canvas to match container
      if (targetTab === 'tactics') {
        resizeTacticalCanvas();
      }
    });
  });
}

/* ==========================================================================
   2. MATCH CENTER & LIVE STATS
   ========================================================================== */
let currentLeagueFilter = 'all';
let currentStatusFilter = 'all';

function initMatchCenter() {
  const leagueContainer = document.getElementById('leaguePillsContainer');
  const statusFilter = document.getElementById('matchStatusFilter');
  const modal = document.getElementById('matchDetailsModal');
  const modalClose = document.getElementById('modalCloseBtn');

  // Populate league filter pills
  leagueContainer.innerHTML = FOOTBALL_DATA.leagues.map(l => `
    <button class="pill-btn ${l.id === 'all' ? 'active' : ''}" data-league="${l.id}">
      <span>${l.icon}</span> ${l.name}
    </button>
  `).join('');

  leagueContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    leagueContainer.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLeagueFilter = btn.getAttribute('data-league');
    renderMatches();
  });

  statusFilter.addEventListener('change', (e) => {
    currentStatusFilter = e.target.value;
    renderMatches();
  });

  // Modal close listeners
  modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  renderMatches();
}

function renderMatches() {
  const grid = document.getElementById('matchesListGrid');
  const filtered = FOOTBALL_DATA.matches.filter(m => {
    const leagueMatch = (currentLeagueFilter === 'all') || (m.league === currentLeagueFilter);
    const statusMatch = (currentStatusFilter === 'all') || (m.status === currentStatusFilter);
    return leagueMatch && statusMatch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-glass);">
        <p style="font-size: 1.1rem; color: var(--text-secondary);">Không tìm thấy trận đấu nào phù hợp với bộ lọc hiện tại.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(m => {
    const isLive = m.status === 'LIVE';
    const isFT = m.status === 'FT';
    const statusBadge = isLive 
      ? `<span class="match-status-badge status-live"><span class="pulse-dot"></span> ĐANG ĐÁ • ${m.minute}'</span>`
      : isFT 
        ? `<span class="match-status-badge status-ft">HẾT GIỜ (FT)</span>`
        : `<span class="match-status-badge status-upcoming">SẮP ĐÁ • ${m.time || '20:00'}</span>`;

    const scoreDisplay = (m.homeScore !== null && m.awayScore !== null)
      ? `${m.homeScore} <span class="score-divider">-</span> ${m.awayScore}`
      : `VS`;

    return `
      <article class="match-card" data-match-id="${m.id}" onclick="openMatchModal('${m.id}')">
        <div class="match-card-header">
          <span class="match-league-info">${m.leagueName}</span>
          ${statusBadge}
        </div>

        <div class="match-teams-box">
          <div class="match-team">
            <div class="team-logo-circle">${m.homeTeam.logo}</div>
            <span class="team-name">${m.homeTeam.name}</span>
          </div>

          <div class="match-score-center">
            <div class="score-display">${scoreDisplay}</div>
            ${isLive ? `<span class="match-minute-label">${m.minute}' Phút</span>` : ''}
          </div>

          <div class="match-team">
            <div class="team-logo-circle">${m.awayTeam.logo}</div>
            <span class="team-name">${m.awayTeam.name}</span>
          </div>
        </div>

        <div class="match-card-footer">
          <span class="match-venue">📍 ${m.stadium}</span>
          <button class="view-details-btn" type="button">Chi Tiết Trận Đấu ▸</button>
        </div>
      </article>
    `;
  }).join('');
}

window.openMatchModal = function(matchId) {
  const match = FOOTBALL_DATA.matches.find(m => m.id === matchId);
  if (!match) return;

  const modal = document.getElementById('matchDetailsModal');
  const container = document.getElementById('modalDynamicContent');

  const stats = match.stats;
  const homeScore = match.homeScore !== null ? match.homeScore : '-';
  const awayScore = match.awayScore !== null ? match.awayScore : '-';

  container.innerHTML = `
    <div class="modal-match-header">
      <div style="font-size:0.85rem;color:var(--text-muted);font-weight:700;margin-bottom:6px;">${match.leagueName}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:12px;">
        <div style="text-align:right;flex:1;">
          <h3 style="font-size:1.3rem;font-weight:800;">${match.homeTeam.name}</h3>
        </div>
        <div style="font-family:'Outfit';font-size:2.4rem;font-weight:900;color:var(--accent-green);">
          ${homeScore} : ${awayScore}
        </div>
        <div style="text-align:left;flex:1;">
          <h3 style="font-size:1.3rem;font-weight:800;">${match.awayTeam.name}</h3>
        </div>
      </div>
      <p style="font-size:0.82rem;color:var(--text-secondary);">🏟️ ${match.stadium} | 👤 Trọng tài: ${match.referee}</p>
    </div>

    <div class="modal-stats-section" style="margin-bottom: 24px;">
      <h4>📊 Thống Kê Trận Đấu Chi Tiết</h4>

      <div class="stat-row">
        <div class="stat-labels">
          <span>${stats.possession[0]}%</span>
          <span style="color:var(--text-secondary);">Kiểm soát bóng</span>
          <span>${stats.possession[1]}%</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-home" style="width:${stats.possession[0]}%"></div>
          <div class="stat-bar-away" style="width:${stats.possession[1]}%"></div>
        </div>
      </div>

      <div class="stat-row">
        <div class="stat-labels">
          <span>${stats.xg[0]}</span>
          <span style="color:var(--text-secondary);">Bàn thắng kỳ vọng (xG)</span>
          <span>${stats.xg[1]}</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-home" style="width:${(stats.xg[0] / (stats.xg[0] + stats.xg[1] || 1)) * 100}%"></div>
          <div class="stat-bar-away" style="width:${(stats.xg[1] / (stats.xg[0] + stats.xg[1] || 1)) * 100}%"></div>
        </div>
      </div>

      <div class="stat-row">
        <div class="stat-labels">
          <span>${stats.shots[0]} (${stats.shotsOnTarget[0]})</span>
          <span style="color:var(--text-secondary);">Tổng cú sút (Trúng đích)</span>
          <span>${stats.shots[1]} (${stats.shotsOnTarget[1]})</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-home" style="width:${(stats.shots[0] / (stats.shots[0] + stats.shots[1] || 1)) * 100}%"></div>
          <div class="stat-bar-away" style="width:${(stats.shots[1] / (stats.shots[0] + stats.shots[1] || 1)) * 100}%"></div>
        </div>
      </div>

      <div class="stat-row">
        <div class="stat-labels">
          <span>${stats.corners[0]}</span>
          <span style="color:var(--text-secondary);">Phạt góc</span>
          <span>${stats.corners[1]}</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-home" style="width:${(stats.corners[0] / (stats.corners[0] + stats.corners[1] || 1)) * 100}%"></div>
          <div class="stat-bar-away" style="width:${(stats.corners[1] / (stats.corners[0] + stats.corners[1] || 1)) * 100}%"></div>
        </div>
      </div>
    </div>

    ${match.timeline && match.timeline.length > 0 ? `
      <div class="modal-events-section" style="margin-bottom:20px;">
        <h4>⏱️ Diễn Biến Nổi Bật (Timeline)</h4>
        <div class="events-list">
          ${match.timeline.map(ev => `
            <div class="event-item">
              <span class="event-min">${ev.min}</span>
              <span>${ev.type === 'goal' ? '⚽' : '🟨'} ${ev.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div style="background:rgba(0, 230, 118, 0.08);border:1px solid rgba(0, 230, 118, 0.25);border-radius:var(--radius-sm);padding:14px;">
      <div style="font-size:0.82rem;font-weight:700;color:var(--accent-green);margin-bottom:4px;">💡 Nhận Định Chuyên Gia:</div>
      <p style="font-size:0.86rem;color:#cbd5e1;">${match.expertTip}</p>
      <p style="font-size:0.78rem;color:var(--text-muted);margin-top:6px;">📈 ${match.h2h}</p>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

/* ==========================================================================
   3. TACTICAL BOARD (SA BÀN CHIẾN THUẬT)
   ========================================================================== */
let currentFormation = '4-3-3';
let isDrawMode = false;
let isDrawing = false;
let canvas, ctx;
let activeDragPlayer = null;

function initTacticalBoard() {
  const formationSelect = document.getElementById('formationSelect');
  const btnToggleDraw = document.getElementById('btnToggleDraw');
  const btnClearDraw = document.getElementById('btnClearDraw');
  const btnResetFormation = document.getElementById('btnResetFormation');
  canvas = document.getElementById('pitchCanvas');
  ctx = canvas.getContext('2d');

  formationSelect.addEventListener('change', (e) => {
    currentFormation = e.target.value;
    updateFormationUI();
  });

  btnToggleDraw.addEventListener('click', () => {
    isDrawMode = !isDrawMode;
    btnToggleDraw.classList.toggle('btn-active', isDrawMode);
    canvas.style.pointerEvents = isDrawMode ? 'auto' : 'none';
  });

  btnClearDraw.addEventListener('click', () => {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });

  btnResetFormation.addEventListener('click', () => {
    renderPlayersOnPitch(FOOTBALL_DATA.formations[currentFormation].players);
  });

  initCanvasEvents();
  initPlayerDragDrop();
  updateFormationUI();
}

function updateFormationUI() {
  const formation = FOOTBALL_DATA.formations[currentFormation];
  if (!formation) return;

  document.getElementById('tacticalName').textContent = formation.name;
  document.getElementById('tacticalDesc').textContent = formation.desc;
  renderPlayersOnPitch(formation.players);
}

function renderPlayersOnPitch(players) {
  const layer = document.getElementById('playersPitchLayer');
  layer.innerHTML = players.map(p => `
    <div class="player-node ${p.role === 'GK' ? 'gk' : ''}" id="playerNode-${p.id}" data-id="${p.id}" style="left: ${p.x}%; top: ${p.y}%;">
      <div class="player-shirt">${p.label}</div>
      <span class="player-tag">${p.role}</span>
    </div>
  `).join('');
}

function initPlayerDragDrop() {
  const pitchField = document.getElementById('pitchField');

  pitchField.addEventListener('pointerdown', (e) => {
    if (isDrawMode) return;
    const node = e.target.closest('.player-node');
    if (!node) return;

    activeDragPlayer = node;
    node.setPointerCapture(e.pointerId);
  });

  pitchField.addEventListener('pointermove', (e) => {
    if (!activeDragPlayer || isDrawMode) return;

    const rect = pitchField.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));

    activeDragPlayer.style.left = `${clampedX}%`;
    activeDragPlayer.style.top = `${clampedY}%`;
  });

  const stopDrag = (e) => {
    if (activeDragPlayer) {
      try {
        activeDragPlayer.releasePointerCapture(e.pointerId);
      } catch (err) {}
      activeDragPlayer = null;
    }
  };

  pitchField.addEventListener('pointerup', stopDrag);
  pitchField.addEventListener('pointercancel', stopDrag);
}

function initCanvasEvents() {
  canvas.style.pointerEvents = 'none';

  canvas.addEventListener('mousedown', (e) => {
    if (!isDrawMode) return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !isDrawMode) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 8;
    ctx.stroke();
  });

  const stopDrawing = () => {
    isDrawing = false;
  };

  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
}

function resizeTacticalCanvas() {
  const pitchField = document.getElementById('pitchField');
  if (pitchField && canvas) {
    canvas.width = pitchField.clientWidth;
    canvas.height = pitchField.clientHeight;
  }
}

/* ==========================================================================
   4. AI FOOTBALL CHAT ASSISTANT
   ========================================================================== */
function initAiChat() {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessagesContainer');
  const suggestions = document.getElementById('chatSuggestionsBar');
  const btnClear = document.getElementById('btnClearChatHistory');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    handleUserMessage(query);
    input.value = '';
  });

  suggestions.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (!chip) return;
    const prompt = chip.getAttribute('data-prompt');
    handleUserMessage(prompt);
  });

  btnClear.addEventListener('click', () => {
    messages.innerHTML = `
      <div class="chat-bubble bot">
        <h3>Hội thoại đã được làm mới! ⚽</h3>
        <p>Tôi có thể giúp gì tiếp theo cho bạn về bóng đá hôm nay?</p>
      </div>
    `;
  });
}

function handleUserMessage(query) {
  const messages = document.getElementById('chatMessagesContainer');

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = query;
  messages.appendChild(userBubble);
  messages.scrollTop = messages.scrollHeight;

  // Append thinking bot bubble
  const botBubble = document.createElement('div');
  botBubble.className = 'chat-bubble bot';
  botBubble.innerHTML = `<em>FootAI đang phân tích dữ liệu trận đấu và chiến thuật... ⏳</em>`;
  messages.appendChild(botBubble);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    const replyHtml = generateFootballAiResponse(query);
    botBubble.innerHTML = replyHtml;
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

function generateFootballAiResponse(query) {
  const lower = query.toLowerCase();

  // Search in pre-defined FAQ knowledge base
  for (const item of FOOTBALL_DATA.faqKnowledge) {
    if (item.keywords.some(k => lower.includes(k))) {
      return convertMarkdownToHtml(item.answer);
    }
  }

  // Check for specific player questions
  for (const player of FOOTBALL_DATA.players) {
    if (lower.includes(player.name.toLowerCase()) || lower.includes(player.name.split(' ').pop().toLowerCase())) {
      return `
        <h3>🌟 Phân tích cầu thủ: ${player.name} (${player.team})</h3>
        <p><strong>Vị trí:</strong> ${player.pos} | <strong>Quốc tịch:</strong> ${player.nat} | <strong>Tuổi:</strong> ${player.age}</p>
        <div style="background:rgba(255,255,255,0.04);padding:12px;border-radius:8px;margin:10px 0;">
          <p>⚡ <strong>Tốc độ:</strong> ${player.stats.pace}/100 | 🎯 <strong>Dứt điểm:</strong> ${player.stats.shooting}/100</p>
          <p>🪄 <strong>Chuyền bóng:</strong> ${player.stats.passing}/100 | 🌪️ <strong>Rê dắt:</strong> ${player.stats.dribbling}/100</p>
          <p>🛡️ <strong>Thể lực & Sức mạnh:</strong> ${player.stats.physical}/100 | ⚽ <strong>Bàn thắng mùa này:</strong> ${player.stats.goals} bàn</p>
        </div>
        <p>💡 <em>FootAI Đánh giá:</em> ${player.name} là mẫu cầu thủ trụ cột sở hữu chỉ số xG per 90 lên đến <strong>${player.stats.xgPer90}</strong>, đóng vai trò sống còn trong cách triển khai lối chơi của ${player.team}.</p>
      `;
    }
  }

  // Fallback intelligent response
  return `
    <h3>🤖 Phân tích chuyên sâu từ FootAI Master</h3>
    <p>Cảm ơn bạn đã hỏi về: <strong>"${escapeHtml(query)}"</strong></p>
    <p>Dưới góc nhìn chiến thuật hiện đại:</p>
    <ul>
      <li><strong>Kiểm soát nhịp độ:</strong> Các đội bóng hàng đầu ngày nay đều ưu tiên tối đa hóa khả năng chiếm lĩnh không gian half-space và luân chuyển bóng với 3 tam giác liên kết.</li>
      <li><strong>Thông số xG (Expected Goals):</strong> Luôn là thước đo chân thực nhất phản ánh chất lượng cơ hội tạo ra, thay vì chỉ dựa trên số lượng cú sút đơn thuần.</li>
      <li><strong>Chuyển đổi trạng thái (Transitions):</strong> Tốc độ triển khai trong 3 đến 5 giây đầu tiên sau khi thu hồi bóng chính là chìa khóa định đoạt 70% các bàn thắng tại giải đấu đỉnh cao.</li>
    </ul>
    <p style="margin-top:8px;font-size:0.85rem;color:var(--text-secondary);">💡 <em>Gợi ý: Bạn có thể thử các câu hỏi như: "Phân tích Man City vs Arsenal", "So sánh Haaland và Mbappe", "Giải thích luật việt vị" hoặc "So sánh 4-3-3 và 4-2-3-1"!</em></p>
  `;
}

function convertMarkdownToHtml(md) {
  let html = md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '<p></p>')
    .replace(/\n/gim, '<br>');

  // Simple table support
  if (html.includes('|')) {
    const lines = html.split('<br>');
    let tableHtml = '<table>';
    let inTable = false;

    lines.forEach(line => {
      if (line.includes('|')) {
        inTable = true;
        const cells = line.split('|').filter((c, idx, arr) => idx !== 0 && idx !== arr.length - 1);
        if (cells.length > 0 && !line.includes(':---')) {
          tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
        }
      } else {
        if (inTable) {
          tableHtml += '</table>';
          inTable = false;
        }
      }
    });

    if (inTable) tableHtml += '</table>';
    return tableHtml;
  }

  return html;
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* ==========================================================================
   5. PLAYER SCOUT & COMPARISON
   ========================================================================== */
function initPlayerScout() {
  const p1Select = document.getElementById('scoutPlayer1');
  const p2Select = document.getElementById('scoutPlayer2');

  const options = FOOTBALL_DATA.players.map(p => `
    <option value="${p.id}">${p.name} (${p.team})</option>
  `).join('');

  p1Select.innerHTML = options;
  p2Select.innerHTML = options;

  p1Select.value = 'p1'; // Haaland
  p2Select.value = 'p2'; // Mbappé

  const updateScout = () => {
    renderPlayerComparison(p1Select.value, p2Select.value);
  };

  p1Select.addEventListener('change', updateScout);
  p2Select.addEventListener('change', updateScout);

  updateScout();
}

function renderPlayerComparison(id1, id2) {
  const p1 = FOOTBALL_DATA.players.find(p => p.id === id1) || FOOTBALL_DATA.players[0];
  const p2 = FOOTBALL_DATA.players.find(p => p.id === id2) || FOOTBALL_DATA.players[1];
  const grid = document.getElementById('scoutComparisonGrid');

  const renderCard = (p, otherP) => {
    return `
      <div class="player-card-profile">
        <div class="player-card-header">
          <div class="player-avatar-large">${p.avatar}</div>
          <div>
            <h3 class="player-name-title">${p.name}</h3>
            <span class="player-club-sub">${p.team} • ${p.nat}</span>
          </div>
        </div>

        <div class="player-attributes-list">
          ${renderAttributeRow('Tốc độ (Pace)', p.stats.pace, otherP.stats.pace)}
          ${renderAttributeRow('Dứt điểm (Shooting)', p.stats.shooting, otherP.stats.shooting)}
          ${renderAttributeRow('Chuyền bóng (Passing)', p.stats.passing, otherP.stats.passing)}
          ${renderAttributeRow('Rê dắt (Dribbling)', p.stats.dribbling, otherP.stats.dribbling)}
          ${renderAttributeRow('Thể lực & Sức mạnh (Physical)', p.stats.physical, otherP.stats.physical)}
          ${renderAttributeRow('Đánh đầu (Heading)', p.stats.heading, otherP.stats.heading)}
        </div>

        <div style="margin-top:20px;padding-top:14px;border-top:1px solid var(--border-glass);display:flex;justify-content:space-between;font-size:0.85rem;">
          <span>⚽ Tổng bàn thắng: <strong style="color:var(--accent-green);">${p.stats.goals}</strong></span>
          <span>🎯 xG / 90 phút: <strong style="color:var(--accent-cyan);">${p.stats.xgPer90}</strong></span>
        </div>
      </div>
    `;
  };

  grid.innerHTML = renderCard(p1, p2) + renderCard(p2, p1);
}

function renderAttributeRow(label, val1, val2) {
  const isHigher = val1 > val2;
  const color = isHigher ? 'var(--accent-green)' : 'var(--accent-cyan)';
  return `
    <div class="attribute-row">
      <div class="attr-header">
        <span>${label}</span>
        <span style="color:${color};font-weight:700;">${val1} / 100</span>
      </div>
      <div class="attr-bar">
        <div class="attr-fill" style="width:${val1}%; background:${color};"></div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   6. STANDINGS TABLE
   ========================================================================== */
function initStandings() {
  const leaguePills = document.getElementById('standingsLeaguePills');
  leaguePills.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill-btn');
    if (!btn) return;
    leaguePills.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderStandings(btn.getAttribute('data-league'));
  });

  renderStandings('epl');
}

function renderStandings(leagueKey) {
  const data = FOOTBALL_DATA.standings[leagueKey] || FOOTBALL_DATA.standings.epl;
  const container = document.getElementById('standingsTableContainer');

  container.innerHTML = `
    <table class="standings-table">
      <thead>
        <tr>
          <th>Hạng</th>
          <th>Câu Lạc Bộ</th>
          <th>Trận</th>
          <th>Thắng</th>
          <th>Hòa</th>
          <th>Thua</th>
          <th>Bàn Thắng</th>
          <th>Bàn Thua</th>
          <th>Hiệu Số</th>
          <th>Điểm Số</th>
          <th>Phong Độ</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(team => `
          <tr>
            <td class="team-rank-cell">#${team.rank}</td>
            <td class="team-name-cell">${team.team}</td>
            <td>${team.p}</td>
            <td>${team.w}</td>
            <td>${team.d}</td>
            <td>${team.l}</td>
            <td>${team.gf}</td>
            <td>${team.ga}</td>
            <td style="font-weight:700;color:${team.gd.startsWith('+') ? 'var(--accent-green)' : '#ff5252'}">${team.gd}</td>
            <td style="font-family:'Outfit';font-size:1.1rem;font-weight:800;color:#fff;">${team.pts}</td>
            <td>
              <div class="form-badge-group">
                ${team.form.map(f => `
                  <span class="form-pill ${f === 'W' ? 'form-w' : f === 'D' ? 'form-d' : 'form-l'}">${f}</span>
                `).join('')}
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* ==========================================================================
   7. LIVE TICKER SIMULATION
   ========================================================================== */
function initLiveTickerSimulation() {
  setInterval(() => {
    FOOTBALL_DATA.matches.forEach(m => {
      if (m.status === 'LIVE' && m.minute < 90) {
        m.minute += 1;
      }
    });

    const activeTab = document.querySelector('.nav-tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'matches') {
      const liveCards = document.querySelectorAll('.match-card');
      liveCards.forEach(card => {
        const id = card.getAttribute('data-match-id');
        const match = FOOTBALL_DATA.matches.find(m => m.id === id);
        if (match && match.status === 'LIVE') {
          const minLabel = card.querySelector('.match-minute-label');
          if (minLabel) minLabel.textContent = `${match.minute}' Phút`;
          const statusBadge = card.querySelector('.status-live');
          if (statusBadge) statusBadge.innerHTML = `<span class="pulse-dot"></span> ĐANG ĐÁ • ${match.minute}'`;
        }
      });
    }
  }, 4000);
}
