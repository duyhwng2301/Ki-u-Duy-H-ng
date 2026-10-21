/* ==========================================================================
   Kiều Duy Hưng - Interactive CV Scripts
   Theme, Language, Modals, Skills Filter & Clipboard Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Toggle (Dark / Light Mode) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('kdh_cv_theme') || 'light';
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = getLang() === 'en' ? 'Light Mode' : 'Chế độ sáng';
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
    });
  }

  // --- 2. Color Preset Switcher ---
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
      showToast(getLang() === 'en' ? `Theme color updated: ${color}` : `Đã đổi tông màu chủ đạo: ${color}`);
    });
  });

  // --- 3. Language Switcher (VI / EN) ---
  const langToggleBtn = document.getElementById('langToggleBtn');
  const langText = document.getElementById('langText');
  let currentLang = localStorage.getItem('kdh_cv_lang') || 'vi';

  function getLang() {
    return currentLang;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('kdh_cv_lang', lang);
    if (langText) langText.textContent = lang === 'vi' ? 'English (EN)' : 'Tiếng Việt (VI)';
    
    document.querySelectorAll('[data-vi]').forEach(el => {
      el.innerHTML = lang === 'en' ? (el.dataset.en || el.dataset.vi) : el.dataset.vi;
    });

    const isDark = root.getAttribute('data-theme') === 'dark';
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
      showToast(nextLang === 'en' ? 'Language switched to English' : 'Đã chuyển sang Tiếng Việt');
    });
  }

  // --- 4. Toast Notification System ---
  const toast = document.getElementById('toastNotice');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // --- 5. One-Click Copy to Clipboard ---
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.dataset.copyText || btn.textContent.trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`📋 ${getLang() === 'en' ? 'Copied to clipboard:' : 'Đã sao chép:'} ${textToCopy}`);
      }).catch(() => {
        showToast(getLang() === 'en' ? 'Failed to copy' : 'Không thể sao chép');
      });
    });
  });

  // --- 6. Modals System (Avatar Lightbox, QR Code, Contact Message, Projects) ---
  const modals = {
    avatar: document.getElementById('modalAvatar'),
    qr: document.getElementById('modalQR'),
    contact: document.getElementById('modalContact'),
    project: document.getElementById('modalProject')
  };

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

  // Trigger Open Modals
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

  // Close modals on clicking overlay or close buttons
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal(overlay);
      }
    });
  });

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
    }
  });

  // --- 7. Project Details Modal Dynamic Content ---
  const projectDetails = {
    footai: {
      title_vi: 'FootAI Master - Trợ Lý Thể Thao & Sa Bàn Túc Cầu',
      title_en: 'FootAI Master - AI Football Assistant & Tactics Board',
      desc_vi: `
        <p><strong>Mục tiêu:</strong> Xây dựng nền tảng thông tin thể thao thông minh phục vụ người yêu bóng đá tại Việt Nam.</p>
        <p style="margin-top:8px;"><strong>Tính năng chính:</strong></p>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>Cập nhật tỉ số trực tiếp thời gian thực, sự kiện trận đấu và bảng xếp hạng EPL, La Liga, V-League.</li>
          <li>Sa bàn chiến thuật tương tác đa sơ đồ (4-3-3, 4-2-3-1, 3-5-2) hỗ trợ kéo thả vị trí cầu thủ trên sân.</li>
          <li>So sánh chỉ số đối đầu giữa các ngôi sao bóng đá (xG, bàn thắng, kiến tạo, rê bóng).</li>
          <li>Trợ lý hỏi đáp AI về bóng đá tích hợp hệ thống tri thức chuyên sâu.</li>
        </ul>
        <p style="margin-top:10px;"><strong>Công nghệ:</strong> HTML5, CSS3 Grid/Flexbox, JavaScript ES6+, Local Storage API.</p>
        <div style="margin-top:16px;">
          <a href="footai/index.html" class="btn btn-primary" target="_blank">🚀 Mở ứng dụng FootAI</a>
        </div>
      `,
      desc_en: `
        <p><strong>Goal:</strong> Build an interactive, modern sports assistant platform for football fans.</p>
        <p style="margin-top:8px;"><strong>Key Features:</strong></p>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>Real-time live scores, match events, and top leagues standings (EPL, La Liga, V-League).</li>
          <li>Interactive tactics board supporting 4-3-3, 4-2-3-1, 3-5-2 with drag-and-drop mechanics.</li>
          <li>Player scout & head-to-head comparison stats (xG, assists, dribbles).</li>
          <li>AI Football chatbot with specialized knowledge base.</li>
        </ul>
        <p style="margin-top:10px;"><strong>Tech Stack:</strong> HTML5, CSS3 Grid/Flexbox, JavaScript ES6+, Local Storage API.</p>
        <div style="margin-top:16px;">
          <a href="footai/index.html" class="btn btn-primary" target="_blank">🚀 Open FootAI App</a>
        </div>
      `
    },
    portfolio: {
      title_vi: 'Trang CV & Portfolio Cá Nhân Trực Tuyến',
      title_en: 'Personal Online CV & Interactive Portfolio',
      desc_vi: `
        <p><strong>Mục tiêu:</strong> Xây dựng trang hồ sơ năng lực số chuẩn hiện đại, giới thiệu bản thân một cách chuyên nghiệp tới nhà tuyển dụng.</p>
        <p style="margin-top:8px;"><strong>Tính năng chính:</strong></p>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>Hỗ trợ chuyển đổi Chế độ Sáng / Tối (Dark / Light mode) và 4 bảng màu chủ đạo.</li>
          <li>Hỗ trợ song ngữ Tiếng Việt & Tiếng Anh.</li>
          <li>Xem ảnh chân dung sắc nét và mã QR quét bằng điện thoại.</li>
          <li>Chức năng in và xuất file PDF chuẩn tỉ lệ A4 bằng Print Media Query.</li>
          <li>Tính năng sao chép thông tin liên hệ 1-chạm vào bộ nhớ tạm.</li>
        </ul>
        <p style="margin-top:10px;"><strong>Công nghệ:</strong> Vanilla HTML5, Modern CSS Variables, Responsive Design, Vanilla JavaScript.</p>
      `,
      desc_en: `
        <p><strong>Goal:</strong> Craft a state-of-the-art interactive curriculum vitae to present personal competence to tech recruiters.</p>
        <p style="margin-top:8px;"><strong>Key Features:</strong></p>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>Light / Dark mode toggle and 4 accent color presets.</li>
          <li>Bilingual support (Vietnamese & English).</li>
          <li>High-res portrait lightbox & instant QR Code for mobile view.</li>
          <li>One-click A4 PDF export using Print Media Query.</li>
          <li>One-click copy to clipboard for contact details.</li>
        </ul>
        <p style="margin-top:10px;"><strong>Tech Stack:</strong> Vanilla HTML5, Modern CSS Variables, Responsive Design, Vanilla JavaScript.</p>
      `
    },
    student_sys: {
      title_vi: 'Ứng Dụng Quản Lý Sinh Viên & Đề Tài Học Tập',
      title_en: 'Student & Academic Project Management System',
      desc_vi: `
        <p><strong>Mục tiêu:</strong> Hệ thống quản lý thông tin hồ sơ sinh viên, điểm số và bài tập lớn trong học kỳ.</p>
        <p style="margin-top:8px;"><strong>Tính năng chính:</strong></p>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>Thêm, sửa, xóa thông tin sinh viên và tra cứu theo mã sinh viên.</li>
          <li>Phân loại kết quả học tập và hiển thị biểu đồ thống kê đơn giản.</li>
          <li>Lưu trữ dữ liệu an toàn trên LocalStorage trình duyệt.</li>
        </ul>
        <p style="margin-top:10px;"><strong>Công nghệ:</strong> HTML5, CSS3, JavaScript ES6 (Array methods, LocalStorage).</p>
      `,
      desc_en: `
        <p><strong>Goal:</strong> Internal mini management tool for student profiles, semester grades, and project assignments.</p>
        <p style="margin-top:8px;"><strong>Key Features:</strong></p>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>CRUD operations for student records with Student ID search.</li>
          <li>Academic performance classification and basic charts.</li>
          <li>Safe data persistence with browser LocalStorage.</li>
        </ul>
        <p style="margin-top:10px;"><strong>Tech Stack:</strong> HTML5, CSS3, JavaScript ES6 (Array methods, LocalStorage).</p>
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

  // --- 8. Skills Filtering Tabs ---
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
    });
  });

  // --- 9. Contact Message Submission Simulation ---
  const quickMsgForm = document.getElementById('quickMsgForm');
  if (quickMsgForm) {
    quickMsgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('msgSenderName').value.trim();
      const senderContact = document.getElementById('msgSenderContact').value.trim();
      const senderMessage = document.getElementById('msgContent').value.trim();

      const mailtoUrl = `mailto:kieuduyhung2301@gmail.com?subject=${encodeURIComponent('Liên hệ từ CV: ' + senderName)}&body=${encodeURIComponent('Họ tên: ' + senderName + '\nLiên hệ: ' + senderContact + '\n\nLời nhắn:\n' + senderMessage)}`;
      window.open(mailtoUrl, '_blank');

      closeModal(modals.contact);
      showToast(getLang() === 'en' ? 'Thank you! Mail client opened.' : 'Cảm ơn bạn! Đã mở ứng dụng gửi thư.');
      quickMsgForm.reset();
    });
  }

  // --- 10. Console Greeting & Easter Egg ---
  console.log(
    '%c Kiều Duy Hưng - Interactive CV %c DTC235200372 %c',
    'background:#2563eb; color:white; font-weight:bold; padding:4px 8px; border-radius:4px 0 0 4px;',
    'background:#0f172a; color:#38bdf8; font-weight:bold; padding:4px 8px; border-radius:0 4px 4px 0;',
    'background:transparent;'
  );
});
