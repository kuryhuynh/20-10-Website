/**
 * 20/10 VIETNAMESE WOMEN'S DAY - MAIN JAVASCRIPT LOGIC
 * Features:
 * - Dynamic SVG Jigsaw Heart with interlocking tabs and scatter/assemble animations
 * - Background ambient glowing particles & falling rose petals
 * - Audio player with acoustic music & Web Audio API chime synthesis
 * - Native <dialog> modals for Wishes, Photo Selection, and Name Customization
 * - LocalStorage persistence and URL query parameter sharing
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. STATE & LOCAL STORAGE INITIALIZATION
  // ============================================================
  const state = {
    sender: localStorage.getItem('womenDay_sender') || 'Anh',
    recipient: localStorage.getItem('womenDay_recipient') || 'Em',
    photoSrc: localStorage.getItem('womenDay_photo') || 'assets/photo-couple.jpg',
    category: localStorage.getItem('womenDay_category') || 'lover',
    customWishes: localStorage.getItem('womenDay_customWishes') || '',
    isScattered: false,
    isPlayingMusic: false,
    audioUnlocked: false
  };

  // URL Query Parameters Override (for shared links)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('from')) state.sender = decodeURIComponent(urlParams.get('from'));
  if (urlParams.get('to')) state.recipient = decodeURIComponent(urlParams.get('to'));
  if (urlParams.get('cat')) state.category = decodeURIComponent(urlParams.get('cat'));

  // Predefined Heartfelt Wishes by Category
  const wishesData = {
    lover: {
      tag: 'Dành tặng: Người Yêu / Vợ ❤️',
      lead: `${state.recipient} yêu dấu của anh,`,
      p1: `Nhân ngày Phụ nữ Việt Nam 20/10, chúc em luôn luôn xinh đẹp, rạng rỡ và tràn ngập niềm vui. Cảm ơn em vì đã đến bên anh, mang lại cho cuộc đời anh những ấm áp, nụ cười ngọt ngào và những khoảnh khắc dịu dàng nhất.`,
      p2: `Chúc em luôn giữ vững niềm tin, tự tin tỏa sáng và đạt được mọi điều mình mong ước. Dù ngoài kia có bao thăng trầm, anh vẫn luôn ở đây để yêu thương, che chở và là chỗ dựa bình yên nhất cho em.`,
      p3: `Mong cho nụ cười trên môi em sẽ luôn rạng rỡ như những đóa hoa cúc họa mi trong nắng thu. Chúc mừng ngày 20/10 tuyệt vời nhất của anh!`,
      sig: `Người luôn yêu em, ${state.sender}`
    },
    mother: {
      tag: 'Dành tặng: Mẹ Kính Yêu 🌸',
      lead: `Mẹ kính yêu của con,`,
      p1: `Nhân ngày 20/10, con xin gửi tới Mẹ ngàn lời chúc tốt đẹp nhất. Con cảm ơn Mẹ vì tất cả sự hy sinh thầm lặng, sự bao dung và tình yêu thương vô bờ bến mà Mẹ đã dành cho chúng con suốt cuộc đời.`,
      p2: `Con chỉ mong Mẹ luôn dồi dào sức khỏe, luôn vui vẻ, bình an trong tâm hồn. Mẹ mãi là ngọn hải đăng soi sáng và là điểm tựa ấm áp nhất của cuộc đời con.`,
      p3: `Cầu chúc cho Mẹ mỗi ngày đều là một ngày hạnh phúc, ngập tràn tiếng cười và bình yên bên gia đình yêu thương.`,
      sig: `${state.sender} yêu Mẹ rất nhiều`
    },
    sister: {
      tag: 'Dành tặng: Chị Em / Bạn Bè Tuyệt Vời 🌻',
      lead: `Gửi ${state.recipient} thân mến,`,
      p1: `Chúc bạn một ngày 20/10 thật nhiều niềm vui, hoa và những món quà bất ngờ! Chúc bạn luôn rạng rỡ, xinh tươi, tự tin và tràn đầy năng lượng tích cực.`,
      p2: `Chúc cho mọi dự định và ước mơ trong công việc cũng như cuộc sống của bạn đều sẽ thành công rực rỡ. Hãy luôn yêu thương bản thân và sống trọn vẹn từng khoảnh khắc đáng nhớ nhé!`,
      p3: `Cảm ơn bạn vì đã luôn là một người bạn / người chị em tuyệt vời, mang đến tiếng cười và sự ấm áp cho mọi người xung quanh.`,
      sig: `Thân mến từ ${state.sender}`
    }
  };

  const compliments = [
    "Nụ cười rạng rỡ tỏa nắng ✨", 
    "Trái tim ấm áp & nhân hậu ❤️", 
    "Dịu dàng & vô cùng tinh tế 🌸",
    "Xinh đẹp tuyệt vời trong mắt anh 🌹", 
    "Đôi mắt biếc long lanh biết cười 💫", 
    "Tự tin, bản lĩnh & độc lập 💎",
    "Luôn là điều ngọt ngào nhất 🍬", 
    "Hạnh phúc trọn vẹn của cuộc đời anh 🍀", 
    "Bình an & rực rỡ như hoa thu 🌼",
    "Người phụ nữ phi thường & bao dung 👑", 
    "Yêu đời, lạc quan & đáng yêu 🎶", 
    "Nguồn cảm hứng bất tận của anh ☀️",
    "Mãi luôn tỏa sáng trong mọi hoàn cảnh 🌟", 
    "Vẻ đẹp sâu thẳm từ tâm hồn 🌷", 
    "Duyên dáng và đầy quyến rũ 🦋",
    "Bờ vai dịu êm, chỗ dựa ấm lòng 🌿", 
    "Giọng nói ngọt ngào ấm áp 🎵", 
    "Nụ cười xua tan mọi mỏi mệt ☕",
    "Tâm hồn trong trẻo, chân thành 🕊️", 
    "Trí tuệ, thông minh & duyên dáng 📖", 
    "Vạn sự như ý, tỷ sự như mơ 🌈",
    "Mỗi ngày bên em đều là một ngày vui 🌻", 
    "Cảm ơn vì đã luôn ở bên cạnh anh 💖", 
    "Ngàn lời yêu thương gửi trọn đến em 💌",
    "Mãi luôn trẻ trung, tươi tắn 🌺", 
    "Tình cảm chân thành và thủy chung 💍", 
    "Chúc ngày 20/10 ngập tràn hạnh phúc! 🎉"
  ];

  // ============================================================
  // 2. DOM ELEMENTS CACHE
  // ============================================================
  const displaySender = document.getElementById('display-sender');
  const displayRecipient = document.getElementById('display-recipient');
  const puzzleGroup = document.getElementById('puzzle-group');
  const puzzleImgElem = document.getElementById('puzzle-image-elem');
  const bubbleTooltip = document.getElementById('piece-compliment');
  const bubbleText = document.getElementById('bubble-text');
  
  // Audio Elements
  const bgAudio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');
  const musicDisc = document.getElementById('music-disc');
  const musicStatus = document.getElementById('music-status');
  
  // Dialog Elements
  const wishesDialog = document.getElementById('wishes-dialog');
  const photoDialog = document.getElementById('photo-dialog');
  const namesDialog = document.getElementById('names-dialog');
  
  // Buttons
  const btnOpenWishes = document.getElementById('btn-open-wishes');
  const btnReorderPuzzle = document.getElementById('btn-reorder-puzzle');
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const btnCustomText = document.getElementById('btn-custom-text');
  const btnShareLink = document.getElementById('btn-share-link');
  const btnMainCelebrate = document.getElementById('btn-main-celebrate');
  const specialDay20 = document.getElementById('special-day-20');
  const coupleTitleWrap = document.getElementById('couple-title-wrap');
  
  // Dialog Internal Controls
  const btnCloseDialog = document.getElementById('btn-close-dialog');
  const btnClosePhotoDialog = document.getElementById('btn-close-photo-dialog');
  const btnCloseNamesDialog = document.getElementById('btn-close-names-dialog');
  const btnTriggerFireworks = document.getElementById('btn-trigger-fireworks');
  const btnCopyWishes = document.getElementById('btn-copy-wishes');
  const imageFileInput = document.getElementById('image-file-input');
  const toastMessage = document.getElementById('toast-message');

  // Letter DOM elements
  const modalRecipientTag = document.getElementById('modal-recipient-tag');
  const letterLead = document.getElementById('letter-lead');
  const letterP1 = document.getElementById('letter-p1');
  const letterP2 = document.getElementById('letter-p2');
  const letterP3 = document.getElementById('letter-p3');
  const letterSigName = document.getElementById('letter-sig-name');
  const customEditorBox = document.getElementById('custom-editor-box');
  const customWishesInput = document.getElementById('custom-wishes-input');
  const btnSaveCustomWishes = document.getElementById('btn-save-custom-wishes');
  const letterContentDisplay = document.getElementById('letter-content-display');

  // ============================================================
  // 3. WEB AUDIO API SYNTHESIZER (Sound Effects & Chimes)
  // ============================================================
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime(freq = 523.25, type = 'sine', duration = 0.5) {
    try {
      initAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context error guarded
    }
  }

  function playMagicalArpeggio() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playChime(freq, 'triangle', 0.6), idx * 100);
    });
  }

  // ============================================================
  // 4. GENERATE JIGSAW PUZZLE PIECES (27 Heart Grid Pieces)
  // ============================================================
  function buildJigsawEdge(x1, y1, x2, y2, dir) {
    if (dir === 0) {
      return ` L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    }
    const dx = x2 - x1;
    const dy = y2 - y1;
    const L = Math.hypot(dx, dy);
    const ux = dx / L;
    const uy = dy / L;
    const nx = -uy * dir;
    const ny = ux * dir;

    const pt = (t, d) => {
      const px = x1 + t * dx + d * L * nx;
      const py = y1 + t * dy + d * L * ny;
      return `${px.toFixed(1)} ${py.toFixed(1)}`;
    };

    return ` L ${pt(0.35, 0)} ` +
           `C ${pt(0.35, -0.05)} ${pt(0.38, 0.05)} ${pt(0.38, 0.20)} ` +
           `C ${pt(0.38, 0.36)} ${pt(0.62, 0.36)} ${pt(0.62, 0.20)} ` +
           `C ${pt(0.62, 0.05)} ${pt(0.65, -0.05)} ${pt(0.65, 0)} ` +
           `L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  function generateHeartPuzzle() {
    const cols = 7;
    const rows = 6;
    const cellW = 46;
    const cellH = 46;
    const originX = 35;
    const originY = 30;

    const heartGrid = [
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0]
    ];

    const vEdges = [];
    for (let r = 0; r < rows; r++) {
      vEdges[r] = [];
      for (let c = 0; c <= cols; c++) {
        vEdges[r][c] = ((r * 7 + c * 13) % 2 === 0) ? 1 : -1;
      }
    }

    const hEdges = [];
    for (let r = 0; r <= rows; r++) {
      hEdges[r] = [];
      for (let c = 0; c < cols; c++) {
        hEdges[r][c] = ((r * 11 + c * 5) % 2 === 0) ? 1 : -1;
      }
    }

    let pieceIndex = 0;
    puzzleGroup.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!heartGrid[r][c]) continue;

        const x = originX + c * cellW;
        const y = originY + r * cellH;

        // Tabs for inner and outer edges (giving authentic jigsaw puzzle shape)
        const topDir = (r > 0 && heartGrid[r - 1][c]) ? -hEdges[r][c] : (((r * 5 + c * 11) % 2 === 0) ? 1 : -1);
        const rightDir = (c < cols - 1 && heartGrid[r][c + 1]) ? vEdges[r][c + 1] : (((c * 7 + r * 13) % 2 === 0) ? 1 : -1);
        const botDir = (r < rows - 1 && heartGrid[r + 1][c]) ? hEdges[r + 1][c] : (((r * 9 + c * 3) % 2 === 0) ? -1 : 1);
        const leftDir = (c > 0 && heartGrid[r][c - 1]) ? -vEdges[r][c] : (((c * 17 + r * 5) % 2 === 0) ? -1 : 1);

        let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        d += buildJigsawEdge(x, y, x + cellW, y, topDir);
        d += buildJigsawEdge(x + cellW, y, x + cellW, y + cellH, rightDir);
        d += buildJigsawEdge(x + cellW, y + cellH, x, y + cellH, botDir);
        d += buildJigsawEdge(x, y + cellH, x, y, leftDir);
        d += ' Z';

        const comp = compliments[pieceIndex % compliments.length];
        
        // Random scatter offsets for animation
        const scatterX = ((pieceIndex * 29) % 80) - 40;
        const scatterY = ((pieceIndex * 37) % 70) - 35;
        const scatterRot = ((pieceIndex * 19) % 40) - 20;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', `piece-${pieceIndex}`);
        path.setAttribute('class', 'puzzle-piece');
        path.setAttribute('data-index', pieceIndex);
        path.setAttribute('data-compliment', comp);
        path.setAttribute('data-scatter-x', scatterX);
        path.setAttribute('data-scatter-y', scatterY);
        path.setAttribute('data-scatter-rot', scatterRot);
        path.setAttribute('d', d);
        path.setAttribute('fill', 'url(#puzzle-img-pattern)');
        path.setAttribute('stroke', 'rgba(255, 255, 255, 0.75)');
        path.setAttribute('stroke-width', '1.2');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('tabindex', '0');
        path.setAttribute('role', 'button');
        path.setAttribute('aria-label', `Mảnh ghép ${pieceIndex + 1}: ${comp}`);

        // Event Listeners for Pieces
        path.addEventListener('click', (e) => onPieceClicked(path, comp));
        path.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPieceClicked(path, comp);
          }
        });

        puzzleGroup.appendChild(path);
        pieceIndex++;
      }
    }
  }

  let bubbleTimer = null;
  function onPieceClicked(pieceElem, complimentText) {
    initAudioContext();
    playChime(659.25 + (Math.random() * 200 - 100), 'sine', 0.35);

    // Visual highlight on piece
    document.querySelectorAll('.puzzle-piece').forEach(p => p.classList.remove('active-piece'));
    pieceElem.classList.add('active-piece');

    // Show compliment bubble
    bubbleText.textContent = complimentText;
    bubbleTooltip.classList.add('visible');

    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      bubbleTooltip.classList.remove('visible');
    }, 3200);

    // Burst a few mini hearts at cursor
    spawnMiniHeartsBurst();
  }

  // Toggle Scatter & Reassemble Animation
  function togglePuzzleScatter() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    state.isScattered = !state.isScattered;

    if (state.isScattered) {
      initAudioContext();
      playChime(392.00, 'sawtooth', 0.4);
      btnReorderPuzzle.innerHTML = '<span class="icon">✨</span> Lắp Ráp';
      showToast('Đã tháo rời các mảnh ghép! Nhấn lần nữa để ghép lại.');

      pieces.forEach(p => {
        const sx = p.getAttribute('data-scatter-x');
        const sy = p.getAttribute('data-scatter-y');
        const srot = p.getAttribute('data-scatter-rot');
        p.classList.add('scattered');
        p.style.transform = `translate(${sx}px, ${sy}px) rotate(${srot}deg)`;
      });
    } else {
      playMagicalArpeggio();
      btnReorderPuzzle.innerHTML = '<span class="icon">🧩</span> Ghép Hình';
      showToast('Trái tim đã được ghép lại trọn vẹn! ❤️');

      pieces.forEach(p => {
        p.style.transform = 'translate(0px, 0px) rotate(0deg)';
      });

      setTimeout(() => {
        pieces.forEach(p => p.classList.remove('scattered'));
      }, 700);
    }
  }

  // ============================================================
  // 5. AUDIO CONTROLLER & BACKGROUND MUSIC
  // ============================================================
  function toggleMusic() {
    initAudioContext();
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        state.isPlayingMusic = true;
        musicDisc.classList.add('playing');
        musicStatus.textContent = 'Đang phát nhạc 🎶';
        showToast('Đang phát bài hát "Chờ chút thôi, rồi anh sẽ tìm tới"');
      }).catch(err => {
        console.warn('Audio play restricted:', err);
        showToast('Vui lòng tương tác với trang để bật nhạc!');
      });
    } else {
      bgAudio.pause();
      state.isPlayingMusic = false;
      musicDisc.classList.remove('playing');
      musicStatus.textContent = 'Nhạc đã tạm dừng';
      showToast('Đã tạm dừng bài hát');
    }
  }

  // Automatic Audio Unlock on First User Click
  function attemptAutoPlay() {
    if (state.audioUnlocked) return;
    state.audioUnlocked = true;
    initAudioContext();
    if (bgAudio.paused && !state.isPlayingMusic) {
      bgAudio.play().then(() => {
        state.isPlayingMusic = true;
        musicDisc.classList.add('playing');
        musicStatus.textContent = 'Đang phát nhạc 🎶';
      }).catch(() => {});
    }
    document.removeEventListener('click', attemptAutoPlay);
    document.removeEventListener('touchstart', attemptAutoPlay);
  }

  document.addEventListener('click', attemptAutoPlay, { once: true });
  document.addEventListener('touchstart', attemptAutoPlay, { once: true });

  // ============================================================
  // 6. ATMOSPHERIC CANVAS EFFECTS
  // ============================================================
  // Ambient Canvas: Twinkling Stars & Fireflies
  const ambCanvas = document.getElementById('ambient-canvas');
  const ambCtx = ambCanvas.getContext('2d');
  let stars = [];

  function resizeAmbientCanvas() {
    ambCanvas.width = window.innerWidth;
    ambCanvas.height = window.innerHeight;
    stars = [];
    const count = Math.min(window.innerWidth > 768 ? 90 : 45, 120);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * ambCanvas.width,
        y: Math.random() * ambCanvas.height,
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '255, 220, 140' : '255, 150, 180'
      });
    }
  }

  function drawAmbient() {
    ambCtx.clearRect(0, 0, ambCanvas.width, ambCanvas.height);
    const now = Date.now() * 0.001;

    for (let s of stars) {
      const a = (Math.sin(now * s.speed * 60 + s.phase) + 1) * 0.5 * s.alpha;
      ambCtx.beginPath();
      ambCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ambCtx.fillStyle = `rgba(${s.color}, ${a})`;
      ambCtx.shadowBlur = 8;
      ambCtx.shadowColor = `rgba(${s.color}, 0.8)`;
      ambCtx.fill();
    }
    requestAnimationFrame(drawAmbient);
  }

  // Petals Canvas: Soft Falling Rose Petals
  const petalsCanvas = document.getElementById('petals-canvas');
  const petalsCtx = petalsCanvas.getContext('2d');
  let petals = [];

  function resizePetalsCanvas() {
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;
    petals = [];
    const count = window.innerWidth > 768 ? 24 : 14;
    for (let i = 0; i < count; i++) {
      petals.push(createPetal(true));
    }
  }

  function createPetal(randomY = false) {
    return {
      x: Math.random() * petalsCanvas.width,
      y: randomY ? Math.random() * petalsCanvas.height : -30,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 1.2 + 0.8,
      speedX: Math.random() * 0.8 - 0.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.3 ? 'rgba(255, 117, 140, ' : 'rgba(255, 179, 193, '
    };
  }

  function drawPetals() {
    petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

    for (let p of petals) {
      p.y += p.speedY;
      p.swing += p.swingSpeed;
      p.x += Math.sin(p.swing) * 1.2 + p.speedX;
      p.rot += p.rotSpeed;

      petalsCtx.save();
      petalsCtx.translate(p.x, p.y);
      petalsCtx.rotate(p.rot);

      petalsCtx.beginPath();
      petalsCtx.moveTo(0, -p.size * 0.5);
      petalsCtx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.6, p.size * 0.4, 0, p.size * 0.6);
      petalsCtx.bezierCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.6, -p.size * 0.5, 0, -p.size * 0.5);
      petalsCtx.fillStyle = p.color + '0.75)';
      petalsCtx.shadowBlur = 4;
      petalsCtx.shadowColor = 'rgba(255, 105, 135, 0.4)';
      petalsCtx.fill();

      petalsCtx.restore();

      if (p.y > petalsCanvas.height + 40 || p.x < -50 || p.x > petalsCanvas.width + 50) {
        Object.assign(p, createPetal(false));
      }
    }
    requestAnimationFrame(drawPetals);
  }

  // Fireworks & Heart Particles Burst
  function triggerFireworksEffect() {
    initAudioContext();
    playMagicalArpeggio();

    const burstColors = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#e056fd', '#f1f2f6'];
    const burstCount = 60;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < burstCount; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 / burstCount) * i + (Math.random() - 0.5);
      const velocity = Math.random() * 180 + 120;
      const isHeart = Math.random() > 0.4;

      particle.style.position = 'fixed';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      particle.style.fontSize = isHeart ? `${Math.random() * 16 + 14}px` : '0px';
      particle.textContent = isHeart ? (Math.random() > 0.5 ? '❤️' : '✨') : '';

      if (!isHeart) {
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.background = burstColors[Math.floor(Math.random() * burstColors.length)];
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
      }

      document.body.appendChild(particle);

      const anim = particle.animate([
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity + 60}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: Math.random() * 800 + 700,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      });

      anim.onfinish = () => particle.remove();
    }

    showToast('💐 Chúc mừng ngày Phụ nữ Việt Nam 20/10! 💐');
  }

  function spawnMiniHeartsBurst() {
    const symbols = ['❤️', '✨', '🌸', '💖'];
    const bubbleRect = bubbleTooltip.getBoundingClientRect();
    const bx = bubbleRect.left + bubbleRect.width / 2;
    const by = bubbleRect.top;

    for (let i = 0; i < 6; i++) {
      const p = document.createElement('span');
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.position = 'fixed';
      p.style.left = `${bx}px`;
      p.style.top = `${by}px`;
      p.style.pointerEvents = 'none';
      p.style.fontSize = '18px';
      p.style.zIndex = '999';

      document.body.appendChild(p);

      const dx = (Math.random() - 0.5) * 80;
      const dy = -Math.random() * 60 - 20;

      const anim = p.animate([
        { transform: 'translate(0, 0) scale(0.8)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.3)`, opacity: 0 }
      ], {
        duration: 900,
        easing: 'ease-out'
      });

      anim.onfinish = () => p.remove();
    }
  }

  // ============================================================
  // 7. WISHES MODAL & CATEGORY SWITCHING
  // ============================================================
  function updateWishesContent() {
    displaySender.textContent = state.sender;
    displayRecipient.textContent = state.recipient;

    if (state.category === 'custom' && state.customWishes.trim()) {
      modalRecipientTag.textContent = `Dành tặng: ${state.recipient} ❤️`;
      letterLead.textContent = `${state.recipient} thân yêu,`;
      letterP1.textContent = state.customWishes;
      letterP2.textContent = '';
      letterP3.textContent = '';
      letterSigName.textContent = state.sender;
      customEditorBox.style.display = 'block';
      letterContentDisplay.style.display = 'block';
    } else {
      const data = wishesData[state.category] || wishesData.lover;
      modalRecipientTag.textContent = data.tag;
      letterLead.textContent = data.lead;
      letterP1.textContent = data.p1;
      letterP2.textContent = data.p2;
      letterP3.textContent = data.p3;
      letterSigName.textContent = data.sig;
      customEditorBox.style.display = state.category === 'custom' ? 'block' : 'none';
      letterContentDisplay.style.display = 'block';
    }

    // Update active tab buttons
    document.querySelectorAll('.cat-tab').forEach(tab => {
      const cat = tab.getAttribute('data-category');
      tab.classList.toggle('active', cat === state.category);
      tab.setAttribute('aria-selected', cat === state.category ? 'true' : 'false');
    });
  }

  function openWishesDialog() {
    initAudioContext();
    playMagicalArpeggio();
    updateWishesContent();
    wishesDialog.showModal();
  }

  function closeWishesDialog() {
    wishesDialog.close();
  }

  // ============================================================
  // 8. PHOTO PRESETS & CUSTOM UPLOAD
  // ============================================================
  function openPhotoDialog() {
    initAudioContext();
    playChime(523.25, 'triangle', 0.25);
    photoDialog.showModal();
  }

  function closePhotoDialog() {
    photoDialog.close();
  }

  function setPuzzlePhoto(src) {
    state.photoSrc = src;
    localStorage.setItem('womenDay_photo', src);
    puzzleImgElem.setAttribute('href', src);

    // Update active preset styling
    document.querySelectorAll('.photo-preset-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-src') === src);
    });

    showToast('Đã đổi ảnh trong trái tim ghép hình!');
  }

  // Handle local image file upload
  imageFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn một tệp hình ảnh!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setPuzzlePhoto(dataUrl);
        closePhotoDialog();
      };
      reader.readAsDataURL(file);
    }
  });

  // ============================================================
  // 9. NAMES CUSTOMIZATION MODAL
  // ============================================================
  function openNamesDialog() {
    initAudioContext();
    playChime(587.33, 'triangle', 0.25);
    document.getElementById('input-sender').value = state.sender;
    document.getElementById('input-recipient').value = state.recipient;
    namesDialog.showModal();
  }

  function closeNamesDialog() {
    namesDialog.close();
  }

  document.getElementById('names-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const s = document.getElementById('input-sender').value.trim();
    const r = document.getElementById('input-recipient').value.trim();

    if (s) state.sender = s;
    if (r) state.recipient = r;

    localStorage.setItem('womenDay_sender', state.sender);
    localStorage.setItem('womenDay_recipient', state.recipient);

    updateWishesContent();
    closeNamesDialog();
    showToast(`Đã lưu: ${state.sender} ❤️ ${state.recipient}`);
  });

  // Quick Preset Chips in Names Dialog
  document.querySelectorAll('.name-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('input-sender').value = chip.getAttribute('data-sender');
      document.getElementById('input-recipient').value = chip.getAttribute('data-recipient');
    });
  });

  // ============================================================
  // 10. SHAREABLE LINK GENERATION
  // ============================================================
  function copyShareLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('from', state.sender);
    url.searchParams.set('to', state.recipient);
    url.searchParams.set('cat', state.category);

    navigator.clipboard.writeText(url.toString()).then(() => {
      showToast('Đã sao chép liên kết chúc mừng vào khay nhớ tạm! 💌');
    }).catch(() => {
      showToast('Liên kết: ' + url.toString());
    });
  }

  // Copy wishes text to clipboard
  function copyWishesText() {
    const text = `${letterLead.textContent}\n\n${letterP1.textContent}\n\n${letterP2.textContent}\n\n${letterP3.textContent}\n\n${letterSigName.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép toàn bộ lời chúc! 📋');
    }).catch(() => {});
  }

  // Toast Feedback Helper
  let toastTimer = null;
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3000);
  }

  // ============================================================
  // 11. EVENT LISTENERS WIRING
  // ============================================================
  // Audio
  musicBtn.addEventListener('click', toggleMusic);

  // Toolbar
  btnOpenWishes.addEventListener('click', openWishesDialog);
  btnReorderPuzzle.addEventListener('click', togglePuzzleScatter);
  btnChangePhoto.addEventListener('click', openPhotoDialog);
  btnCustomText.addEventListener('click', openNamesDialog);
  btnShareLink.addEventListener('click', copyShareLink);
  btnMainCelebrate.addEventListener('click', openWishesDialog);
  
  // Special Day 20 click
  specialDay20.addEventListener('click', () => {
    triggerFireworksEffect();
    setTimeout(openWishesDialog, 600);
  });
  specialDay20.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerFireworksEffect();
      setTimeout(openWishesDialog, 600);
    }
  });

  // Header click / double click
  coupleTitleWrap.addEventListener('click', openNamesDialog);

  // Dialog Close buttons
  btnCloseDialog.addEventListener('click', closeWishesDialog);
  btnClosePhotoDialog.addEventListener('click', closePhotoDialog);
  btnCloseNamesDialog.addEventListener('click', closeNamesDialog);

  // Close dialog on backdrop click (Light Dismiss)
  [wishesDialog, photoDialog, namesDialog].forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  });

  // Category Tabs inside Wishes Dialog
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.category = tab.getAttribute('data-category');
      localStorage.setItem('womenDay_category', state.category);
      updateWishesContent();
      if (state.category === 'custom') {
        customWishesInput.value = state.customWishes || `${state.recipient} thân yêu,\nChúc mừng ngày 20/10 thật hạnh phúc!`;
      }
    });
  });

  // Save Custom Wishes Button
  btnSaveCustomWishes.addEventListener('click', () => {
    state.customWishes = customWishesInput.value.trim();
    localStorage.setItem('womenDay_customWishes', state.customWishes);
    updateWishesContent();
    showToast('Đã lưu lời chúc riêng của bạn!');
  });

  // Photo Preset Items click
  document.querySelectorAll('.photo-preset-item').forEach(item => {
    item.addEventListener('click', () => {
      setPuzzlePhoto(item.getAttribute('data-src'));
      closePhotoDialog();
    });
  });

  // Dialog Action buttons
  btnTriggerFireworks.addEventListener('click', triggerFireworksEffect);
  btnCopyWishes.addEventListener('click', copyWishesText);

  // Window resize handlers
  window.addEventListener('resize', () => {
    resizeAmbientCanvas();
    resizePetalsCanvas();
  });

  // ============================================================
  // 12. INITIALIZATION CALLS
  // ============================================================
  generateHeartPuzzle();
  setPuzzlePhoto(state.photoSrc);
  updateWishesContent();

  resizeAmbientCanvas();
  drawAmbient();

  resizePetalsCanvas();
  drawPetals();

  // Subtle assembly animation on first entrance
  setTimeout(() => {
    playMagicalArpeggio();
  }, 1000);
});
