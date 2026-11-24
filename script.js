// ==========================================================================
// FOKİ'NİN OYUN HAMURU DÜNYASI - İNTERAKTİF SCRİPT
// Özellikler: Galeri Filtreleme, Tam Ekran Lightbox, Konfeti Patlatma,
// Sevimli Pul Modu, Mobil Menü ve Neşeli Geri Bildirimler
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initGalleryFiltering();
  initLightbox();
  initConfetti();
  initStampMode();
  initNewsletterForm();
});

/* ==========================================================================
   1. MOBİL MENÜ
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. GALERİ FİLTRELEME
   ========================================================================== */
function initGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card-special');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   3. LIGHTBOX (TAM EKRAN FOTOĞRAF İNCELEME)
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('image-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.getElementById('lightbox-backdrop');

  function openLightbox(imgSrc, title, caption) {
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalCaption.textContent = caption;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Galeri kartlarına tıklandığında aç
  const galleryCards = document.querySelectorAll('.gallery-card-special');
  galleryCards.forEach(card => {
    const frame = card.querySelector('.card-inner-frame');
    const img = frame.querySelector('img');
    const title = card.getAttribute('data-title') || 'Foki Fotoğrafı';
    const desc = card.getAttribute('data-desc') || 'Oyun hamurundan el yapımı sevimli kare.';

    frame.addEventListener('click', () => {
      openLightbox(img.src, title, desc);
    });
  });

  // Macera satırlarındaki butonlara tıklandığında aç
  const adventureButtons = document.querySelectorAll('.open-photo-modal');
  adventureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      openLightbox(src, title, desc);
    });
  });

  // Hero bölümündeki fotoğraflara tıklandığında da aç
  const heroMainCard = document.querySelector('.photo-card-main');
  if (heroMainCard) {
    heroMainCard.style.cursor = 'pointer';
    heroMainCard.addEventListener('click', () => {
      openLightbox('images/tilki-maskot.jpg', "Foki: Sevimli Maskot", "%100 turuncu oyun hamurundan şekillendirilmiş ana karakterimiz.");
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   4. SEVİMLİ PUL MODU (STAMP MODE)
   ========================================================================== */
function initStampMode() {
  const toggleBtn = document.getElementById('toggle-stamp-btn');
  const toast = document.getElementById('stamper-toast');
  let stampModeActive = false;

  const stampEmojis = ['🦊', '🎨', '🌻', '🧡', '✨', '🥧', '🎵', '🐾', '🌈', '🧁', '⭐', '🌸'];

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stampModeActive = !stampModeActive;
      toggleBtn.classList.toggle('active', stampModeActive);

      if (stampModeActive) {
        toggleBtn.innerHTML = '<span class="icon">✨</span> Pul Açık!';
        showToast('🎨 Harika! Sayfanın herhangi bir yerine tıkla ve Foki pulları bırak!');
      } else {
        toggleBtn.innerHTML = '<span class="icon">🎨</span> Pul Modu';
        showToast('Pul modu kapatıldı');
      }
    });
  }

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }

  document.addEventListener('click', (e) => {
    if (!stampModeActive) return;

    // Etkileşimli buton veya formlara tıklandıysa pul basma
    if (e.target.closest('button, a, input, .lightbox-modal')) return;

    const stamp = document.createElement('div');
    stamp.className = 'floating-stamp';
    
    const randomEmoji = stampEmojis[Math.floor(Math.random() * stampEmojis.length)];
    stamp.textContent = randomEmoji;

    stamp.style.left = `${e.clientX}px`;
    stamp.style.top = `${e.clientY}px`;

    document.body.appendChild(stamp);

    setTimeout(() => {
      stamp.remove();
    }, 1400);
  });
}

/* ==========================================================================
   5. KONFETİ SİSTEMİ
   ========================================================================== */
let confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const confettiBtn = document.getElementById('confetti-joy-btn');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const colors = ['#FF6B6B', '#FFB703', '#FFD166', '#88D49E', '#9C8EB9', '#FF8E72', '#FB8500'];

  function createConfettiBurst(originX, originY) {
    const count = 100;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: originX || window.innerWidth / 2,
        y: originY || window.innerHeight / 2,
        r: Math.random() * 6 + 4,
        d: Math.random() * count,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.9) * 15,
        gravity: 0.28,
        friction: 0.98,
        opacity: 1
      });
    }

    if (!confettiAnimationId) {
      animateConfetti(ctx, canvas);
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.tiltAngle += p.tiltAngleInc;
      p.tilt = Math.sin(p.tiltAngle) * 15;
      p.opacity -= 0.007;

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    }

    confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < canvas.height + 20);

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
  }

  window.triggerConfetti = createConfettiBurst;

  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      const rect = confettiBtn.getBoundingClientRect();
      createConfettiBurst(rect.left + rect.width / 2, rect.top);
    });
  }
}

/* ==========================================================================
   6. BÜLTEN FORMU & GERİ BİLDİRİM
   ========================================================================== */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const feedback = document.getElementById('newsletter-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('subscriber-name');
    const name = nameInput.value.trim() || 'Minik Dost';

    feedback.innerHTML = `🎉 <strong>Harika bir haber, ${name}!</strong> Foki seni arkadaş listesine ekledi! İlk boyama ve hamur şablonu kartın e-posta adresine gönderildi! 🦊💌`;
    feedback.style.display = 'block';

    if (window.triggerConfetti) {
      window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
    }

    form.reset();
  });
}
