/* ==========================================================================
   Kiều Duy Hưng - Interactive CV High-Tech Engine (Rock-Solid & Crash-Proof)
   Fixed All Variable Scoping / TDZ Bugs, Enhanced UI Buttons & Features
   ========================================================================== */

// Global state initialization (Safe from Temporal Dead Zone)
let currentLang = 'vi';
let soundEnabled = false;
let fxEnabled = true;
let audioCtx = null;
let toastTimer = null;

// Global Helper Functions (Hoisted & Safe)
function getLang() {
  return currentLang;
}

function showToast(message) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function playTone(freq = 440, type = 'sine', duration = 0.05, gainValue = 0.03) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio safe fallback
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) resolve();
        else reject(new Error('execCommand copy failed'));
      } catch (err) {
        reject(err);
      }
    });
  }
}

function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Kiều Duy Hưng',
    'N:Kiều;Duy Hưng;;;',
    'TITLE:Sinh viên năm 4 - Khoa Công nghệ Thông tin',
    'ORG:Trường ĐH Công nghệ Thông tin & Truyền thông Thái Nguyên (ICTU)',
    'TEL;TYPE=CELL,VOICE:0395317625',
    'EMAIL;TYPE=INTERNET,PREF:kieuduyhung2301@gmail.com',
    'URL:https://duyhwng2301.github.io/Ki-u-Duy-H-ng/',
    'NOTE:Mã SV: DTC235200372 - Sinh năm 2005 - Thái Nguyên, VN',
    'END:VCARD'
  ].join('\r\n');

  try {
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Kieu_Duy_Hung_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(getLang() === 'en' ? '📇 Downloaded Kieu Duy Hung vCard (.vcf)' : '📇 Đã tải danh bạ Kiều Duy Hưng (.vcf)');
    playTone(784, 'triangle', 0.08, 0.05);
  } catch (err) {
    showToast('Lỗi khi tải danh bạ');
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Main execution when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // 1. Language Initialization
  try {
    currentLang = localStorage.getItem('kdh_cv_lang') || 'vi';
    const langToggleBtn = document.getElementById('langToggleBtn');
    const langText = document.getElementById('langText');

    function applyLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('kdh_cv_lang', lang);
      if (langText) langText.textContent = lang === 'vi' ? 'English (EN)' : 'Tiếng Việt (VI)';
      
      document.querySelectorAll('[data-vi]').forEach(el => {
        el.innerHTML = lang === 'en' ? (el.dataset.en || el.dataset.vi) : el.dataset.vi;
      });

      const isDark = root.getAttribute('data-theme') === 'dark';
      const themeText = document.getElementById('themeText');
      if (themeText) {
        themeText.textContent = lang === 'en' 
          ? (isDark ? 'Light Mode' : 'Dark Mode') 
          : (isDark ? 'Chế độ sáng' : 'Chế độ tối');
      }
    }

    if (currentLang === 'en') {
      applyLanguage('en');
    }

    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'vi' ? 'en' : 'vi';
        applyLanguage(nextLang);
        showToast(nextLang === 'en' ? 'Switched to English' : 'Đã chuyển sang Tiếng Việt');
        playTone(440, 'sine', 0.04, 0.03);
      });
    }
  } catch (e) {
    console.error('Lang Init Error:', e);
  }

  // 2. Theme & Color Presets
  try {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    const savedTheme = localStorage.getItem('kdh_cv_theme') || 'dark';
    if (savedTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = getLang() === 'en' ? 'Light Mode' : 'Chế độ sáng';
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = getLang() === 'en' ? 'Dark Mode' : 'Chế độ tối';
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
          root.removeAttribute('data-theme');
          localStorage.setItem('kdh_cv_theme', 'light');
          if (themeIcon) themeIcon.textContent = '🌙';
          if (themeText) themeText.textContent = getLang() === 'en' ? 'Dark Mode' : 'Chế độ tối';
          showToast(getLang() === 'en' ? 'Switched to Light mode' : 'Đã chuyển sang giao diện Sáng');
        } else {
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('kdh_cv_theme', 'dark');
          if (themeIcon) themeIcon.textContent = '☀️';
          if (themeText) themeText.textContent = getLang() === 'en' ? 'Light Mode' : 'Chế độ sáng';
          showToast(getLang() === 'en' ? 'Switched to Dark mode' : 'Đã chuyển sang giao diện Tối');
        }
        playTone(659.25, 'triangle', 0.05, 0.04);
      });
    }

    const colorDots = document.querySelectorAll('.color-dot');
    const savedColor = localStorage.getItem('kdh_cv_color') || 'blue';
    if (savedColor !== 'blue') {
      root.setAttribute('data-color', savedColor);
      colorDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.color === savedColor);
      });
    }

    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const color = dot.dataset.color;
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        if (color === 'blue') {
          root.removeAttribute('data-color');
          localStorage.removeItem('kdh_cv_color');
        } else {
          root.setAttribute('data-color', color);
          localStorage.setItem('kdh_cv_color', color);
        }
        showToast(getLang() === 'en' ? `Theme color: ${color}` : `Đã đổi tông màu: ${color}`);
        playTone(493.88, 'sine', 0.04, 0.03);
      });
    });
  } catch (e) {
    console.error('Theme Init Error:', e);
  }

  // 3. Audio SFX Button
  try {
    soundEnabled = localStorage.getItem('kdh_cv_sfx') === 'true';
    const sfxBtn = document.getElementById('sfxToggleBtn');
    const sfxIcon = document.getElementById('sfxIcon');
    if (sfxBtn) {
      if (sfxIcon) sfxIcon.textContent = soundEnabled ? '🔊' : '🔇';
      sfxBtn.classList.toggle('active', soundEnabled);

      sfxBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('kdh_cv_sfx', soundEnabled);
        if (sfxIcon) sfxIcon.textContent = soundEnabled ? '🔊' : '🔇';
        sfxBtn.classList.toggle('active', soundEnabled);
        if (soundEnabled) playTone(587.33, 'triangle', 0.08, 0.06);
        showToast(soundEnabled ? '🔊 Đã bật âm thanh giao diện' : '🔇 Đã tắt âm thanh giao diện');
      });
    }

    // Attach click feedback sound to all buttons
    document.querySelectorAll('.btn, .color-dot, .copy-mini-btn, .skill-tab-btn, .project-box').forEach(el => {
      el.addEventListener('mouseenter', () => playTone(330, 'sine', 0.02, 0.015));
      el.addEventListener('click', () => playTone(520, 'triangle', 0.04, 0.03));
    });
  } catch (e) {
    console.error('SFX Init Error:', e);
  }

  // 4. vCard Download Button Trigger
  const vcardBtn = document.getElementById('downloadVcardBtn');
  if (vcardBtn) {
    vcardBtn.addEventListener('click', downloadVCard);
  }

  // 5. One-Click Copy To Clipboard
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.dataset.copyText || btn.textContent.trim();
      copyToClipboard(textToCopy).then(() => {
        showToast(`📋 ${getLang() === 'en' ? 'Copied to clipboard:' : 'Đã sao chép:'} ${textToCopy}`);
        playTone(784, 'triangle', 0.08, 0.05);
      }).catch(() => {
        showToast(getLang() === 'en' ? 'Copy failed' : 'Không thể sao chép');
      });
    });
  });

  // 6. Typewriter Effect
  try {
    const typewriterEl = document.getElementById('typewriterText');
    if (typewriterEl) {
      const titlesVi = [
        'Sinh viên năm 4 - Khoa Công nghệ Thông tin',
        'Đại học CNTT & Truyền thông Thái Nguyên (ICTU)',
        'Frontend Developer & UI/UX Enthusiast',
        'Đam mê Lập trình Web Hiện đại & Sa bàn Thể thao',
        'Sẵn sàng làm việc & Thực tập (Open to work)'
      ];
      const titlesEn = [
        'Senior Student - Faculty of Information Technology',
        'Thai Nguyen ICTU University (Graduating Senior)',
        'Frontend Developer & UI/UX Enthusiast',
        'Passionate about Modern Web & Interactive Tactics',
        'Available for full-time & internship opportunities'
      ];

      let titleIdx = 0;
      let charIdx = 0;
      let isDeleting = false;
      let typingSpeed = 80;

      function typeLoop() {
        const titles = getLang() === 'en' ? titlesEn : titlesVi;
        const currentFullText = titles[titleIdx % titles.length];

        if (isDeleting) {
          typewriterEl.textContent = currentFullText.substring(0, charIdx - 1);
          charIdx--;
          typingSpeed = 35;
        } else {
          typewriterEl.textContent = currentFullText.substring(0, charIdx + 1);
          charIdx++;
          typingSpeed = 75;
        }

        if (!isDeleting && charIdx === currentFullText.length) {
          typingSpeed = 2200;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          titleIdx++;
          typingSpeed = 400;
        }

        setTimeout(typeLoop, typingSpeed);
      }

      typeLoop();
    }
  } catch (e) {
    console.error('Typewriter Error:', e);
  }

  // 7. GitHub Contribution Heatmap Simulation
  try {
    const heatmapGrid = document.getElementById('githubHeatmapGrid');
    if (heatmapGrid) {
      heatmapGrid.innerHTML = '';
      const totalCells = 52 * 7;
      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'heat-cell';
        const rand = Math.random();
        if (rand > 0.84) cell.classList.add('heat-l4');
        else if (rand > 0.64) cell.classList.add('heat-l3');
        else if (rand > 0.44) cell.classList.add('heat-l2');
        else if (rand > 0.24) cell.classList.add('heat-l1');
        cell.title = `Commit activity • Day ${i + 1}`;
        heatmapGrid.appendChild(cell);
      }
    }
  } catch (e) {
    console.error('Heatmap Error:', e);
  }

  // 8. Particle Canvas Network
  try {
    const canvas = document.getElementById('techCanvas');
    fxEnabled = localStorage.getItem('kdh_cv_fx') !== 'false';
    const fxBtn = document.getElementById('fxToggleBtn');

    if (fxBtn) {
      fxBtn.classList.toggle('active', fxEnabled);
    }

    if (canvas) {
      const ctx = canvas.getContext('2d');
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.7;
          this.vy = (Math.random() - 0.5) * 0.7;
          this.radius = Math.random() * 2 + 1;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = root.getAttribute('data-theme') === 'dark' ? 'rgba(59, 130, 246, 0.65)' : 'rgba(37, 99, 235, 0.45)';
          ctx.fill();
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      function renderParticles() {
        if (!fxEnabled) return;
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const alpha = (1 - dist / 110) * 0.22;
              ctx.strokeStyle = root.getAttribute('data-theme') === 'dark'
                ? `rgba(96, 165, 250, ${alpha})`
                : `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(renderParticles);
      }

      if (fxEnabled) {
        renderParticles();
      } else {
        document.body.classList.add('fx-disabled');
      }

      if (fxBtn) {
        fxBtn.addEventListener('click', () => {
          fxEnabled = !fxEnabled;
          localStorage.setItem('kdh_cv_fx', fxEnabled);
          document.body.classList.toggle('fx-disabled', !fxEnabled);
          fxBtn.classList.toggle('active', fxEnabled);
          if (fxEnabled) renderParticles();
          showToast(fxEnabled ? '⚡ Đã bật hiệu ứng mạng lưới hạt' : '⏸️ Đã tạm dừng hiệu ứng hạt');
        });
      }
    }
  } catch (e) {
    console.error('Particle Canvas Error:', e);
  }

  // 9. Developer Terminal Console
  try {
    const terminalModal = document.getElementById('modalTerminal');
    const terminalBtn = document.getElementById('terminalBtn');
    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('termOutput');
    const cmdHistory = [];
    let historyIdx = -1;

    if (terminalBtn && terminalModal) {
      terminalBtn.addEventListener('click', () => {
        openModal(terminalModal);
        setTimeout(() => termInput && termInput.focus(), 150);
        playTone(520, 'sine', 0.06, 0.04);
      });
    }

    if (terminalModal) {
      terminalModal.addEventListener('click', (e) => {
        if (!e.target.closest('.modal-close-btn') && !e.target.closest('.mac-close')) {
          if (termInput) termInput.focus();
        }
      });
    }

    function appendTerminalLine(content, className = '') {
      if (!termOutput) return;
      const line = document.createElement('div');
      line.className = `term-line ${className}`;
      line.innerHTML = content;
      termOutput.appendChild(line);
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    if (termInput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = termInput.value.trim();
          if (command) {
            cmdHistory.push(command);
            historyIdx = cmdHistory.length;
            appendTerminalLine(`<span class="term-prompt">hung@ictu:~$</span> ${command}`);
            executeTerminalCommand(command.toLowerCase());
            termInput.value = '';
            playTone(440, 'triangle', 0.03, 0.03);
          }
        } else if (e.key === 'ArrowUp') {
          if (historyIdx > 0) {
            historyIdx--;
            termInput.value = cmdHistory[historyIdx] || '';
          }
        } else if (e.key === 'ArrowDown') {
          if (historyIdx < cmdHistory.length - 1) {
            historyIdx++;
            termInput.value = cmdHistory[historyIdx] || '';
          } else {
            historyIdx = cmdHistory.length;
            termInput.value = '';
          }
        }
      });
    }

    function executeTerminalCommand(cmd) {
      switch (cmd) {
        case 'help':
          appendTerminalLine(`
            <div class="term-cyan">=== CÁC CÂU LỆNH KHẢ DỤNG ===</div>
            <div><span class="term-green">bio</span>       : Xem lý lịch tóm tắt Kiều Duy Hưng</div>
            <div><span class="term-green">skills</span>    : Bảng kỹ năng kỹ thuật & độ thành thạo</div>
            <div><span class="term-green">projects</span>  : Danh sách dự án nổi bật (FootAI, Portfolio)</div>
            <div><span class="term-green">contact</span>   : Thông tin SĐT (0395 317 625), Email, GitHub</div>
            <div><span class="term-green">phone</span>     : Sao chép nhanh số điện thoại 0395 317 625</div>
            <div><span class="term-green">vcard</span>     : Tải danh bạ điện thoại (.vcf)</div>
            <div><span class="term-green">theme</span>     : Đổi giao diện ('theme dark' hoặc 'theme light')</div>
            <div><span class="term-green">color</span>     : Đổi tông màu ('color blue', 'violet', 'emerald', 'rose')</div>
            <div><span class="term-green">sudo hire</span> : Gửi yêu cầu tuyển dụng trực tiếp</div>
            <div><span class="term-green">clear</span>     : Làm sạch màn hình terminal</div>
            <div><span class="term-green">exit / quit</span>: Đóng cửa sổ terminal</div>
          `);
          break;

        case 'bio':
          appendTerminalLine(`
            <div class="term-cyan">[HỒ SƠ CÁ NHÂN]</div>
            <div>👤 Họ tên: <strong>Kiều Duy Hưng</strong> (21 tuổi - Sinh năm 2005)</div>
            <div>🎓 Học vấn: Sinh viên năm 4 - Khoa Công nghệ Thông tin (ICTU Thái Nguyên)</div>
            <div>🏷️ Mã SV: <strong>DTC235200372</strong></div>
            <div>📍 Quê quán: Thái Nguyên, Việt Nam</div>
            <div>🎯 Định hướng: Thực tập sinh / Junior Frontend Developer</div>
          `);
          break;

        case 'skills':
          appendTerminalLine(`
            <div class="term-cyan">[KỸ NĂNG CHUYÊN MÔN]</div>
            <div>⚡ HTML5 / Semantic Web     : [████████░░] 88%</div>
            <div>🎨 CSS3 / Flexbox / Grid     : [████████░░] 85%</div>
            <div>💻 JavaScript ES6+ / DOM API: [███████░░░] 78%</div>
            <div>🐙 Git & GitHub Workflow     : [███████░░░] 75%</div>
            <div>📱 Responsive Web Design    : [████████░░] 85%</div>
            <div>🤝 Làm việc nhóm & Tự học   : [█████████░] 90%</div>
          `);
          break;

        case 'projects':
          appendTerminalLine(`
            <div class="term-cyan">[DỰ ÁN TIÊU BIỂU]</div>
            <div>1. <strong>FootAI Master</strong>: Web app sa bàn chiến thuật & trợ lý túc cầu (HTML5/CSS3/JS)</div>
            <div>2. <strong>Interactive Digital CV</strong>: Hồ sơ cá nhân số đa tính năng, dark mode, print A4</div>
            <div>3. <strong>Student Management Mini-App</strong>: Ứng dụng tra cứu & quản lý đề tài sinh viên DTC</div>
          `);
          break;

        case 'contact':
          appendTerminalLine(`
            <div class="term-cyan">[THÔNG TIN LIÊN HỆ]</div>
            <div>📞 Số điện thoại: <strong>0395 317 625</strong></div>
            <div>✉️ Email: <strong>kieuduyhung2301@gmail.com</strong></div>
            <div>🌐 GitHub: <a href="https://github.com/duyhwng2301" target="_blank" style="color:#58a6ff;">github.com/duyhwng2301</a></div>
            <div>📍 Địa chỉ: Thái Nguyên, Việt Nam</div>
          `);
          break;

        case 'phone':
          copyToClipboard('0395317625').then(() => {
            appendTerminalLine('✅ Đã sao chép số điện thoại: <strong>0395 317 625</strong> vào bộ nhớ tạm.');
          });
          break;

        case 'vcard':
          downloadVCard();
          appendTerminalLine('✅ Đã khởi chạy tải danh bạ Kiều Duy Hưng (.vcf)');
          break;

        case 'exit':
        case 'quit':
          closeModal(terminalModal);
          break;

        case 'sudo hire':
          appendTerminalLine(`
            <div class="term-green" style="font-size:0.95rem;">🎉 Chúc mừng bạn đã tìm được ứng viên lý tưởng!</div>
            <div>Kiều Duy Hưng luôn sẵn sàng cống hiến 100% nhiệt huyết và khả năng học hỏi nhanh chóng cho team.</div>
            <div>Vui lòng gọi ngay: <strong style="color:#ffbd2e;">0395 317 625</strong> hoặc gửi mail tới <strong style="color:#ffbd2e;">kieuduyhung2301@gmail.com</strong>!</div>
          `);
          playTone(880, 'triangle', 0.12, 0.06);
          break;

        case 'theme dark':
          root.setAttribute('data-theme', 'dark');
          localStorage.setItem('kdh_cv_theme', 'dark');
          appendTerminalLine('✅ Đã kích hoạt giao diện Tối (Dark Mode)');
          break;

        case 'theme light':
          root.removeAttribute('data-theme');
          localStorage.setItem('kdh_cv_theme', 'light');
          appendTerminalLine('✅ Đã kích hoạt giao diện Sáng (Light Mode)');
          break;

        case 'color blue':
        case 'color violet':
        case 'color emerald':
        case 'color rose':
          const chosen = cmd.split(' ')[1];
          if (chosen === 'blue') {
            root.removeAttribute('data-color');
            localStorage.removeItem('kdh_cv_color');
          } else {
            root.setAttribute('data-color', chosen);
            localStorage.setItem('kdh_cv_color', chosen);
          }
          appendTerminalLine(`✅ Đã đổi tông màu chủ đạo thành: ${chosen}`);
          break;

        case 'clear':
          termOutput.innerHTML = '';
          break;

        default:
          appendTerminalLine(`❌ Lệnh không xác định: '${cmd}'. Gõ <span class="term-yellow">'help'</span> để xem danh sách câu lệnh.`, 'term-dim');
          break;
      }
    }
  } catch (e) {
    console.error('Terminal Error:', e);
  }

  // 10. Modals Management (Avatar, QR, Contact, Projects, Terminal)
  try {
    const modals = {
      avatar: document.getElementById('modalAvatar'),
      qr: document.getElementById('modalQR'),
      contact: document.getElementById('modalContact'),
      project: document.getElementById('modalProject'),
      terminal: document.getElementById('modalTerminal')
    };

    const avatarWrapper = document.getElementById('avatarWrapper');
    if (avatarWrapper) {
      avatarWrapper.addEventListener('click', () => openModal(modals.avatar));
    }

    const qrBtn = document.getElementById('qrBtn');
    if (qrBtn) {
      qrBtn.addEventListener('click', () => openModal(modals.qr));
    }

    const contactBtns = document.querySelectorAll('.open-contact-btn');
    contactBtns.forEach(btn => {
      btn.addEventListener('click', () => openModal(modals.contact));
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.closest('.modal-close-btn') || e.target.closest('.mac-close')) {
          closeModal(overlay);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
      }
    });

    // Project Details Data
    const projectDetails = {
      footai: {
        title_vi: 'FootAI Master - Trợ Lý Thể Thao & Sa Bàn Túc Cầu',
        title_en: 'FootAI Master - AI Football Assistant & Tactics Board',
        desc_vi: `
          <p><strong>Mục tiêu:</strong> Nền tảng thể thao thông minh phục vụ người yêu bóng đá tại Việt Nam.</p>
          <p style="margin-top:8px;"><strong>Tính năng chính:</strong></p>
          <ul style="padding-left:18px; margin-top:4px;">
            <li>Cập nhật tỉ số trực tiếp thời gian thực, sự kiện trận đấu và BXH hàng đầu.</li>
            <li>Sa bàn chiến thuật kéo thả (4-3-3, 4-2-3-1, 3-5-2) trực quan mượt mà.</li>
            <li>So sánh chỉ số đối đầu cầu thủ chuyên nghiệp (xG, kiến tạo, rê bóng).</li>
          </ul>
          <p style="margin-top:10px;"><strong>Công nghệ:</strong> HTML5, CSS3 Grid/Flexbox, JavaScript ES6+, Local Storage API.</p>
          <div style="margin-top:16px;">
            <a href="footai/index.html" class="btn btn-primary" target="_blank">🚀 Mở ứng dụng FootAI</a>
          </div>
        `,
        desc_en: `
          <p><strong>Goal:</strong> Smart football platform for match statistics and tactic simulation.</p>
          <p style="margin-top:8px;"><strong>Features:</strong> Real-time livescores, interactive tactics board, player scouting stats.</p>
          <p style="margin-top:10px;"><strong>Tech:</strong> HTML5, CSS3, JavaScript ES6+, Local Storage.</p>
          <div style="margin-top:16px;">
            <a href="footai/index.html" class="btn btn-primary" target="_blank">🚀 Launch FootAI</a>
          </div>
        `
      },
      portfolio: {
        title_vi: 'Trang CV & Portfolio Cá Nhân Tương Tác',
        title_en: 'Interactive Digital CV & Portfolio',
        desc_vi: `
          <p><strong>Mục tiêu:</strong> Hồ sơ năng lực số hiện đại của Kiều Duy Hưng với giao diện công nghệ chuẩn cao.</p>
          <p style="margin-top:8px;"><strong>Tính năng:</strong> Particle canvas mạng lưới, Developer Terminal dòng lệnh, Song ngữ Anh-Việt, 4 bảng màu, QR code quét điện thoại và in PDF A4.</p>
          <p style="margin-top:10px;"><strong>Công nghệ:</strong> HTML5, Vanilla CSS Design Tokens, JavaScript ES6+, Web Audio Synth.</p>
        `,
        desc_en: `
          <p><strong>Goal:</strong> High-tech interactive digital resume showcasing engineering competence.</p>
          <p style="margin-top:8px;"><strong>Features:</strong> Particle canvas, Dev Terminal console, bilingual VI/EN, 4 color palettes, QR scanner and A4 PDF export.</p>
          <p style="margin-top:10px;"><strong>Tech:</strong> HTML5, Vanilla CSS Tokens, JavaScript ES6+, Web Audio API.</p>
        `
      },
      student_sys: {
        title_vi: 'Ứng Dụng Quản Lý Sinh Viên & Đề Tài Học Tập',
        title_en: 'Student & Academic Project Management Mini-App',
        desc_vi: `
          <p><strong>Mục tiêu:</strong> Ứng dụng tra cứu và quản lý thông tin sinh viên theo mã số (DTC235200372).</p>
          <p style="margin-top:8px;"><strong>Tính năng:</strong> Thêm, sửa, xóa, tìm kiếm nhanh mã sinh viên, phân loại học tập và biểu đồ trực quan.</p>
          <p style="margin-top:10px;"><strong>Công nghệ:</strong> HTML5, CSS3, JavaScript ES6, LocalStorage.</p>
        `,
        desc_en: `
          <p><strong>Goal:</strong> Academic management system for tracking student records and course projects.</p>
          <p style="margin-top:8px;"><strong>Features:</strong> Full CRUD, fast Student ID search, grade classification.</p>
          <p style="margin-top:10px;"><strong>Tech:</strong> HTML5, CSS3, JavaScript ES6, LocalStorage.</p>
        `
      }
    };

    document.querySelectorAll('.open-project-modal').forEach(card => {
      card.addEventListener('click', () => {
        const projId = card.dataset.project;
        const data = projectDetails[projId];
        if (!data) return;

        const titleEl = document.getElementById('projectModalTitle');
        const bodyEl = document.getElementById('projectModalBody');
        const isEn = getLang() === 'en';

        if (titleEl) titleEl.textContent = isEn ? data.title_en : data.title_vi;
        if (bodyEl) bodyEl.innerHTML = isEn ? data.desc_en : data.desc_vi;

        openModal(modals.project);
      });
    });
  } catch (e) {
    console.error('Modal Init Error:', e);
  }

  // 11. Skills Filtering Tabs
  try {
    const skillTabs = document.querySelectorAll('.skill-tab-btn');
    const skillItems = document.querySelectorAll('.skill-item');
    const skillPills = document.querySelectorAll('.skill-pill');

    skillTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;

        skillItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });

        skillPills.forEach(pill => {
          if (filter === 'all' || pill.dataset.category === filter) {
            pill.style.display = 'inline-block';
          } else {
            pill.style.display = 'none';
          }
        });
        playTone(480, 'sine', 0.03, 0.02);
      });
    });
  } catch (e) {
    console.error('Skill Filter Error:', e);
  }

  // 12. Contact Form & Copy Message
  try {
    const quickMsgForm = document.getElementById('quickMsgForm');
    if (quickMsgForm) {
      quickMsgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const senderName = document.getElementById('msgSenderName').value.trim();
        const senderContact = document.getElementById('msgSenderContact').value.trim();
        const senderMessage = document.getElementById('msgContent').value.trim();

        const mailtoUrl = `mailto:kieuduyhung2301@gmail.com?subject=${encodeURIComponent('Liên hệ phỏng vấn Kiều Duy Hưng từ ' + senderName)}&body=${encodeURIComponent('Họ tên: ' + senderName + '\nLiên hệ: ' + senderContact + '\n\nLời nhắn:\n' + senderMessage)}`;
        window.open(mailtoUrl, '_blank');

        const contactModal = document.getElementById('modalContact');
        if (contactModal) closeModal(contactModal);
        showToast(getLang() === 'en' ? 'Thank you! Mail client launched.' : 'Cảm ơn bạn! Đã mở ứng dụng gửi thư.');
        quickMsgForm.reset();
      });
    }

    const copyMsgBtn = document.getElementById('copyMsgBtn');
    if (copyMsgBtn) {
      copyMsgBtn.addEventListener('click', () => {
        const senderName = document.getElementById('msgSenderName').value.trim();
        const senderContact = document.getElementById('msgSenderContact').value.trim();
        const senderMessage = document.getElementById('msgContent').value.trim();

        const text = `Gửi Kiều Duy Hưng,\nHọ tên: ${senderName || '[Tên người gửi]'}\nLiên hệ: ${senderContact || '[Email/SĐT]'}\nNội dung: ${senderMessage || '[Lời nhắn]'}`;
        copyToClipboard(text).then(() => {
          showToast('📋 Đã sao chép nội dung tin nhắn vào bộ nhớ tạm');
          playTone(784, 'triangle', 0.08, 0.05);
        });
      });
    }
  } catch (e) {
    console.error('Contact Form Error:', e);
  }

  // 13. Floating Back to Top Button
  try {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        playTone(660, 'triangle', 0.05, 0.04);
      });
    }
  } catch (e) {
    console.error('BackToTop Error:', e);
  }
});
