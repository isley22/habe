document.addEventListener('DOMContentLoaded', () => {

  /* ================= إعدادات عامة ================= */
  const BIRTHDAY_DATE = new Date('2026-10-02T00:00:00');
  const congratsMessage = 'Happy Birthday to You, Rana! 🎉🎂✨';

  /* ================= خلفية نجوم متحركة خفيفة ================= */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function initStars(){
    const count = window.innerWidth < 640 ? 35 : 60;
    stars = Array.from({length: count}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.15 + 0.03,
      phase: Math.random() * Math.PI * 2
    }));
  }
  resizeCanvas();
  initStars();
  window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

  let t = 0;
  function drawStars(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.02;
    stars.forEach(s => {
      const twinkle = (Math.sin(t + s.phase) + 1) / 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 201, 105, ${0.25 + twinkle * 0.55})`;
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) s.y = canvas.height + 5;
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ================= قلوب عائمة خفيفة ================= */
  const heartsLayer = document.getElementById('hearts-layer');
  function spawnHeart(){
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['💗','💕','💖','💜'][Math.floor(Math.random()*4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    heart.style.animationDuration = (6 + Math.random() * 5) + 's';
    heart.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    heartsLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 12000);
  }
  setInterval(spawnHeart, 1400);

  /* ================= Confetti ================= */
  const confettiLayer = document.getElementById('confetti-layer');
  const confettiColors = ['#ffb6d9', '#b28dff', '#f3c969', '#f487b6', '#ffffff'];
  function burstConfetti(amount = 90){
    for (let i = 0; i < amount; i++){
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
      piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  /* ================= زر المفاجأة ================= */
  const surpriseBtn = document.getElementById('surpriseBtn');
  const congratsOverlay = document.getElementById('congratsOverlay');
  const congratsText = document.getElementById('congratsText');
  const scrollHint = document.getElementById('scrollHint');
  let surpriseOpened = false;
 
  function typeMessage(el, text, speed = 45){
    el.innerHTML = '';
    el.style.direction = 'ltr';
    el.style.unicodeBidi = 'isolate';
    el.style.textAlign = 'center';

    [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = (i * speed) + 'ms';
        el.appendChild(span);
    });
}

  surpriseBtn.addEventListener('click', () => {
    if (surpriseOpened) return;
    surpriseOpened = true;

    burstConfetti(110);
    setTimeout(() => burstConfetti(60), 500);

    congratsOverlay.classList.add('show');
    typeMessage(congratsText, congratsMessage);

    setTimeout(() => {
      congratsOverlay.classList.remove('show');
      document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
    }, 4000);
  });

  scrollHint.addEventListener('click', () => {
    document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = window.scrollY > 40 ? '0' : '.75';
  });

  /* ================= العد التنازلي ================= */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownBox = document.getElementById('countdown');
  const celebrateTitle = document.getElementById('celebrateTitle');

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(){
    const now = new Date();
    const diff = BIRTHDAY_DATE - now;

    if (diff <= 0){
      countdownBox.hidden = true;
      celebrateTitle.hidden = false;
      clearInterval(countdownTimer);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(d);
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
  }

  updateCountdown();
  const countdownTimer = setInterval(updateCountdown, 1000);

  /* ================= معرض الصور + Lightbox ================= */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('placeholder')) return;
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('show');
    });
  });

  function closeLightbox(){ lightbox.classList.remove('show'); lightboxImg.src=''; }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ================= الموسيقى ================= */
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');
  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (!isPlaying){
      bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.textContent = '🔇';
        musicBtn.classList.add('playing');
      }).catch(() => {
        musicBtn.textContent = '⚠️';
        setTimeout(() => { musicBtn.textContent = '🎵'; }, 1500);
      });
    } else {
      bgMusic.pause();
      isPlaying = false;
      musicBtn.textContent = '🎵';
      musicBtn.classList.remove('playing');
    }
  });

  /* ================= ظهور الأقسام تدريجيًا عند التمرير ================= */
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(28px)';
    sec.style.transition = 'opacity .8s ease, transform .8s ease';
    observer.observe(sec);
  });

});
