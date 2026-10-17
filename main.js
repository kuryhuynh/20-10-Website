/**
 * 20/10 VIETNAMESE WOMEN'S DAY - MAIN JAVASCRIPT LOGIC
 * Features:
 * - Scene 1: Blooming rose flower & rose wall unfolding
 * - Scene 2: 3D rotating memory sphere with polaroid photos & floating quotes
 * - Scene 3: Cute handwritten love card with corner doodles & moodboard backdrop
 * - Scene 4: Iconic golden frame card with heart jigsaw puzzle & October 2026 calendar
 * - Synchronized lyrics subtitle bar matched to TikTok acoustic track
 * - Web Audio API chime sound synthesizer & canvas particle effects
 * - Native <dialog> modals for Wishes, Photo Customization, and Name Personalization
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. STATE & PERSISTENCE
  // ============================================================
  const state = {
    sender: localStorage.getItem('womenDay_sender') || 'Anh',
    recipient: localStorage.getItem('womenDay_recipient') || 'Em',
    photoSrc: localStorage.getItem('womenDay_photo') || 'assets/photo-couple.jpg',
    category: localStorage.getItem('womenDay_category') || 'lover',
    customWishes: localStorage.getItem('womenDay_customWishes') || '',
    activeScene: 'bloom',
    userManualSceneOverride: false,
    isScattered: false,
    isPlayingMusic: false,
    audioUnlocked: false
  };

  // URL Query Parameters Override
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('from')) state.sender = decodeURIComponent(urlParams.get('from'));
  if (urlParams.get('to')) state.recipient = decodeURIComponent(urlParams.get('to'));
  if (urlParams.get('cat')) state.category = decodeURIComponent(urlParams.get('cat'));

  // Predefined Wishes by Category
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
  // Navigation & Scene Panes
  const navTabs = document.querySelectorAll('.nav-tab');
  const scenePanes = document.querySelectorAll('.scene-pane');
  const btnReplayStory = document.getElementById('btn-replay-story');
  const btnCustomNames = document.getElementById('btn-custom-names');
  const btnShareLink = document.getElementById('btn-share-link');

  // Scene 1: Bloom
  const bloomWrapper = document.querySelector('.bloom-wrapper');
  const bloomingFlower = document.getElementById('blooming-flower');
  const roseWall = document.getElementById('rose-wall');

  // Scene 2: 3D Sphere
  const sphereViewport = document.getElementById('sphere-viewport');
  const world3d = document.getElementById('world-3d');
  const orbitContainer = document.getElementById('orbit-container');

  // Scene 3: Cute Card
  const backdropPhotosGrid = document.getElementById('backdrop-photos-grid');
  const cuteCardTitle = document.getElementById('cute-card-title');
  const cuteCardBodyText = document.getElementById('cute-card-body-text');
  const cuteCardSignature = document.getElementById('cute-card-signature');

  // Scene 4: Frame & Heart Puzzle
  const displaySender = document.getElementById('display-sender');
  const displayRecipient = document.getElementById('display-recipient');
  const puzzleGroup = document.getElementById('puzzle-group');
  const puzzleImgElem = document.getElementById('puzzle-image-elem');
  const bubbleTooltip = document.getElementById('piece-compliment');
  const bubbleText = document.getElementById('bubble-text');
  const btnReorderPuzzle = document.getElementById('btn-reorder-puzzle');
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const specialDay20 = document.getElementById('special-day-20');
  const btnMainCelebrate = document.getElementById('btn-main-celebrate');
  const coupleTitleWrap = document.getElementById('couple-title-wrap');

  // Lyrics Bar
  const lyricsBar = document.getElementById('lyrics-bar');
  const lyricsText = document.getElementById('lyrics-text');

  // Audio Controls
  const bgAudio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');
  const musicDisc = document.getElementById('music-disc');
  const musicStatus = document.getElementById('music-status');

  // Modals & Forms
  const wishesDialog = document.getElementById('wishes-dialog');
  const photoDialog = document.getElementById('photo-dialog');
  const namesDialog = document.getElementById('names-dialog');
  const btnCloseDialog = document.getElementById('btn-close-dialog');
  const btnClosePhotoDialog = document.getElementById('btn-close-photo-dialog');
  const btnCloseNamesDialog = document.getElementById('btn-close-names-dialog');
  const namesForm = document.getElementById('names-form');
  const inputSender = document.getElementById('input-sender');
  const inputRecipient = document.getElementById('input-recipient');
  const btnTriggerFireworks = document.getElementById('btn-trigger-fireworks');
  const btnCopyWishes = document.getElementById('btn-copy-wishes');
  const imageFileInput = document.getElementById('image-file-input');
  const toastMessage = document.getElementById('toast-message');

  // Letter Elements
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
  // 3. SOUND SYNTHESIS (Web Audio API)
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
    } catch (_) {}
  }

  function playMagicalArpeggio() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playChime(freq, 'triangle', 0.6), idx * 100);
    });
  }

  // ============================================================
  // 4. SCENE NAVIGATION & TRANSITIONS
  // ============================================================
  function switchScene(sceneName, isManual = false) {
    if (isManual) {
      state.userManualSceneOverride = true;
    }
    state.activeScene = sceneName;

    // Update Top Tabs
    navTabs.forEach(tab => {
      const isTarget = tab.getAttribute('data-scene') === sceneName;
      tab.classList.toggle('active', isTarget);
    });

    // Update Scene Panes
    scenePanes.forEach(pane => {
      const isTarget = pane.id === `scene-${sceneName}`;
      pane.classList.toggle('active-scene', isTarget);
    });

    // Special scene triggers
    if (sceneName === 'bloom') {
      // Bloom state
    } else if (sceneName === 'sphere') {
      // 3D sphere viewport active
    } else if (sceneName === 'frame') {
      // Frame active
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetScene = tab.getAttribute('data-scene');
      playChime(659.25, 'sine', 0.3);
      switchScene(targetScene, true);
    });
  });

  // Replay Story Button
  btnReplayStory.addEventListener('click', () => {
    state.userManualSceneOverride = false;
    bgAudio.currentTime = 0;
    switchScene('bloom', false);
    if (bloomWrapper) bloomWrapper.classList.remove('blooming');
    if (bgAudio.paused) {
      toggleMusic();
    }
    showToast('Bắt đầu câu chuyện tự động từ đầu ✨');
  });

  // Bloom Screen Click to Start
  if (bloomWrapper) {
    bloomWrapper.addEventListener('click', () => {
      state.userManualSceneOverride = false;
      bloomWrapper.classList.add('blooming');
      if (bgAudio.paused) {
        toggleMusic();
      }
      playMagicalArpeggio();
    });
  }

  // ============================================================
  // 5. TIMELINE & SYNCHRONIZED LYRICS
  // ============================================================
  const lyricsTimeline = [
    { start: 0.0, end: 4.5, text: "CHỜ ANH CHÚT...", scene: 'bloom' },
    { start: 4.5, end: 11.0, text: "CHỜ CHÚT THÔI, RỒI ANH SẼ TÌM TỚI", scene: 'bloom', bloomTrigger: true },
    { start: 11.0, end: 16.5, text: "ĐÃ PHIỀN", scene: 'sphere' },
    { start: 16.5, end: 22.5, text: "CÓ ANH Ở ĐÂY RỒI!!", scene: 'sphere' },
    { start: 22.5, end: 28.5, text: "Cầm tay anh, dựa vai anh", scene: 'sphere' },
    { start: 28.5, end: 36.0, text: "Ngàn ánh sao vụt qua nhẹ ôm lấy em", scene: 'card' },
    { start: 36.0, end: 43.5, text: "Nguyện mãi bên cạnh nhau yêu say đắm như ngày đầu", scene: 'card' },
    { start: 43.5, end: 999.0, text: "CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10 💖", scene: 'frame' }
  ];

  bgAudio.addEventListener('timeupdate', () => {
    const curTime = bgAudio.currentTime;
    const currentItem = lyricsTimeline.find(item => curTime >= item.start && curTime < item.end);

    if (currentItem) {
      if (lyricsText && lyricsText.textContent !== currentItem.text) {
        lyricsText.style.opacity = '0';
        setTimeout(() => {
          lyricsText.textContent = currentItem.text;
          lyricsText.style.opacity = '1';
        }, 150);
      }

      if (!state.userManualSceneOverride) {
        if (state.activeScene !== currentItem.scene) {
          switchScene(currentItem.scene, false);
        }
        if (currentItem.bloomTrigger && bloomWrapper) {
          bloomWrapper.classList.add('blooming');
        }
      }
    }
  });

  // ============================================================
  // 6. SCENE 2: 3D MEMORY SPHERE GENERATOR & DRAG ROTATION
  // ============================================================
  const memoryPhotos = [
    { src: 'assets/photo-couple.jpg', title: 'Khoảnh khắc ngọt ngào ❤️' },
    { src: 'assets/mem-1.jpg', title: 'Nụ cười rực rỡ ✨' },
    { src: 'assets/mem-2.jpg', title: 'Tình yêu đong đầy 🌹' },
    { src: 'assets/mem-3.jpg', title: 'Bình yên bên em 🌸' },
    { src: 'assets/mem-4.jpg', title: 'Tay trong tay 👫' },
    { src: 'assets/photo-girl.jpg', title: 'Ánh mắt dịu dàng 💫' },
    { src: 'assets/mem-5.jpg', title: 'Hạnh phúc giản đơn 🍀' },
    { src: 'assets/mem-6.jpg', title: 'Mãi mãi bên nhau 💍' },
    { src: 'assets/mem-7.jpg', title: 'Kỷ niệm thu vàng 🍂' },
    { src: 'assets/photo-mother.jpg', title: 'Thương yêu vô bờ 💐' },
    { src: 'assets/mem-8.jpg', title: 'Tỏa sáng mỗi ngày 🌟' },
    { src: 'assets/photo-flowers.jpg', title: '20/10 vẹn tròn 🌷' }
  ];

  const floatingQuotes = [
    "CÓ ANH Ở ĐÂY RỒI!!",
    "Cầm tay anh, dựa vai anh",
    "Ngàn ánh sao ôm lấy em ✨",
    "Yêu em say đắm ❤️",
    "Bình yên của anh 🕊️",
    "20/10 ngập tràn hạnh phúc 🎉"
  ];

  function build3DSphere() {
    if (!orbitContainer) return;
    orbitContainer.innerHTML = '';

    const nodes = [];

    // Combine photos and quotes
    memoryPhotos.forEach(p => nodes.push({ type: 'photo', data: p }));
    floatingQuotes.forEach(q => nodes.push({ type: 'quote', text: q }));

    const total = nodes.length; // 18 nodes
    const sphereRadius = window.innerWidth > 768 ? 260 : 190;

    nodes.forEach((node, i) => {
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.cos(phi);
      const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

      const rotY = (Math.atan2(x, z) * 180 / Math.PI);
      const rotX = (-Math.asin(y / sphereRadius) * 180 / Math.PI);

      if (node.type === 'photo') {
        const item = document.createElement('div');
        item.className = 'polaroid-item';
        item.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg)`;

        const img = document.createElement('img');
        img.src = node.data.src;
        img.alt = node.data.title;
        img.loading = 'lazy';

        const cap = document.createElement('div');
        cap.className = 'polaroid-caption';
        cap.textContent = node.data.title;

        item.appendChild(img);
        item.appendChild(cap);

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          playChime(783.99, 'sine', 0.4);
          setPuzzlePhoto(node.data.src);
          showToast(`Đã chọn ảnh kỷ niệm: ${node.data.title}`);
        });

        orbitContainer.appendChild(item);
      } else {
        const tag = document.createElement('div');
        tag.className = 'quote-tag';
        tag.textContent = node.text;
        tag.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg)`;
        orbitContainer.appendChild(tag);
      }
    });
  }

  // 3D Sphere Drag Interaction
  let isDraggingSphere = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let curRotX = -12;
  let curRotY = 0;
  let targetRotX = -12;
  let targetRotY = 0;

  if (sphereViewport) {
    sphereViewport.addEventListener('pointerdown', (e) => {
      isDraggingSphere = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      sphereViewport.setPointerCapture(e.pointerId);
    });

    sphereViewport.addEventListener('pointermove', (e) => {
      if (!isDraggingSphere) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      targetRotY += dx * 0.45;
      targetRotX -= dy * 0.45;
      targetRotX = Math.max(-75, Math.min(75, targetRotX));
    });

    const endSphereDrag = (e) => {
      if (isDraggingSphere) {
        isDraggingSphere = false;
        try { sphereViewport.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };

    sphereViewport.addEventListener('pointerup', endSphereDrag);
    sphereViewport.addEventListener('pointercancel', endSphereDrag);
  }

  function animate3DSphere() {
    if (!isDraggingSphere) {
      targetRotY += 0.22; // gentle auto-rotation
    }
    curRotX += (targetRotX - curRotX) * 0.08;
    curRotY += (targetRotY - curRotY) * 0.08;

    if (world3d) {
      world3d.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
    }
    requestAnimationFrame(animate3DSphere);
  }

  // ============================================================
  // 7. SCENE 3: CUTE CARD SETUP
  // ============================================================
  function setupCuteCard() {
    if (cuteCardTitle) cuteCardTitle.textContent = `Gửi ${state.recipient} !`;
    if (cuteCardSignature) cuteCardSignature.textContent = `${state.sender} ❤️`;

    if (backdropPhotosGrid) {
      backdropPhotosGrid.innerHTML = '';
      const sampleBackdrops = memoryPhotos.slice(0, 8);
      sampleBackdrops.forEach((p, idx) => {
        const thumb = document.createElement('img');
        thumb.src = p.src;
        thumb.alt = p.title;
        thumb.className = 'backdrop-thumb';
        const rot = ((idx % 2 === 0 ? 1 : -1) * (4 + (idx % 5) * 2));
        thumb.style.setProperty('--rot', `${rot}deg`);
        backdropPhotosGrid.appendChild(thumb);
      });
    }
  }

  // ============================================================
  // 8. SCENE 4: SVG JIGSAW PUZZLE (Heart Shape)
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
      const px = x1 + dx * t + nx * d * L;
      const py = y1 + dy * t + ny * d * L;
      return `${px.toFixed(1)} ${py.toFixed(1)}`;
    };

    return ` L ${pt(0.38, 0)} ` +
           ` C ${pt(0.36, 0.08)}, ${pt(0.32, 0.22)}, ${pt(0.42, 0.24)} ` +
           ` C ${pt(0.48, 0.26)}, ${pt(0.52, 0.26)}, ${pt(0.58, 0.24)} ` +
           ` C ${pt(0.68, 0.22)}, ${pt(0.64, 0.08)}, ${pt(0.62, 0)} ` +
           ` L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }

  function generateHeartPuzzle() {
    if (!puzzleGroup) return;
    puzzleGroup.innerHTML = '';

    const cols = 6;
    const rows = 6;
    const width = 360;
    const height = 310;
    const startX = 20;
    const startY = 15;
    const cellW = width / cols;
    const cellH = height / rows;

    const hDirs = [];
    for (let r = 0; r <= rows; r++) {
      hDirs[r] = [];
      for (let c = 0; c < cols; c++) {
        hDirs[r][c] = (r === 0 || r === rows) ? 0 : ((r + c) % 2 === 0 ? 1 : -1);
      }
    }

    const vDirs = [];
    for (let r = 0; r < rows; r++) {
      vDirs[r] = [];
      for (let c = 0; c <= cols; c++) {
        vDirs[r][c] = (c === 0 || c === cols) ? 0 : ((r + c) % 2 === 0 ? -1 : 1);
      }
    }

    let pieceIndex = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = startX + c * cellW;
        const y0 = startY + r * cellH;
        const x1 = x0 + cellW;
        const y1 = y0 + cellH;

        // Skip corner pieces to form a heart contour
        if ((r === 0 && (c === 0 || c === 5)) ||
            (r === 4 && (c === 0 || c === 5)) ||
            (r === 5 && (c <= 1 || c >= 4))) {
          continue;
        }

        const topDir = hDirs[r][c];
        const rightDir = vDirs[r][c + 1];
        const bottomDir = -hDirs[r + 1][c];
        const leftDir = -vDirs[r][c];

        let d = `M ${x0.toFixed(1)} ${y0.toFixed(1)}`;
        d += buildJigsawEdge(x0, y0, x1, y0, topDir);
        d += buildJigsawEdge(x1, y0, x1, y1, rightDir);
        d += buildJigsawEdge(x1, y1, x0, y1, bottomDir);
        d += buildJigsawEdge(x0, y1, x0, y0, leftDir);
        d += ' Z';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'puzzle-piece');
        path.setAttribute('fill', 'url(#puzzle-img-pattern)');
        path.setAttribute('stroke', '#f6d365');
        path.setAttribute('stroke-width', '1.2');
        path.setAttribute('data-id', pieceIndex);

        const complimentText = compliments[pieceIndex % compliments.length];
        path.setAttribute('data-compliment', complimentText);

        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;
        path.setAttribute('data-cx', cx);
        path.setAttribute('data-cy', cy);

        // Click / touch interaction
        path.addEventListener('click', (e) => {
          e.stopPropagation();
          handlePieceClick(path, complimentText);
        });

        puzzleGroup.appendChild(path);
        pieceIndex++;
      }
    }
  }

  function handlePieceClick(path, complimentText) {
    playChime(587.33, 'triangle', 0.4);
    path.classList.add('pulse-piece');
    setTimeout(() => path.classList.remove('pulse-piece'), 600);

    if (bubbleText) bubbleText.textContent = complimentText;
    if (bubbleTooltip) {
      bubbleTooltip.classList.add('visible');
      setTimeout(() => bubbleTooltip.classList.remove('visible'), 3600);
    }
  }

  function togglePuzzleScatter() {
    state.isScattered = !state.isScattered;
    const pieces = document.querySelectorAll('.puzzle-piece');

    pieces.forEach((piece, idx) => {
      if (state.isScattered) {
        const randX = (Math.random() - 0.5) * 160;
        const randY = (Math.random() - 0.5) * 140;
        const randRot = (Math.random() - 0.5) * 70;
        piece.style.transform = `translate(${randX.toFixed(1)}px, ${randY.toFixed(1)}px) rotate(${randRot.toFixed(1)}deg)`;
        piece.style.opacity = '0.85';
      } else {
        piece.style.transform = 'translate(0px, 0px) rotate(0deg)';
        piece.style.opacity = '1';
      }
    });

    if (btnReorderPuzzle) {
      btnReorderPuzzle.innerHTML = state.isScattered ?
        '<span class="icon">✨</span> Ghép Lại' :
        '<span class="icon">🧩</span> Xáo Trộn';
    }

    if (state.isScattered) {
      playChime(440, 'sawtooth', 0.3);
      showToast('Đã xáo trộn các mảnh ghép!');
    } else {
      playMagicalArpeggio();
      showToast('Đã ghép lại trái tim hoàn chỉnh!');
    }
  }

  function setPuzzlePhoto(src) {
    state.photoSrc = src;
    localStorage.setItem('womenDay_photo', src);
    if (puzzleImgElem) puzzleImgElem.setAttribute('href', src);

    document.querySelectorAll('.photo-preset-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-src') === src);
    });
  }

  // ============================================================
  // 9. AUDIO CONTROLLER & BACKGROUND MUSIC
  // ============================================================
  function toggleMusic() {
    initAudioContext();
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        state.isPlayingMusic = true;
        if (musicDisc) musicDisc.classList.add('playing');
        if (musicStatus) musicStatus.textContent = 'Đang phát nhạc 🎶';
        showToast('Đang phát: "Chờ chút thôi, rồi anh sẽ tìm tới"');
      }).catch(err => {
        console.warn('Audio play restricted:', err);
        showToast('Vui lòng chạm màn hình để phát nhạc!');
      });
    } else {
      bgAudio.pause();
      state.isPlayingMusic = false;
      if (musicDisc) musicDisc.classList.remove('playing');
      if (musicStatus) musicStatus.textContent = 'Nhạc tạm dừng';
      showToast('Đã tạm dừng bài hát');
    }
  }

  function attemptAutoPlay() {
    if (state.audioUnlocked) return;
    state.audioUnlocked = true;
    initAudioContext();
    if (bgAudio.paused && !state.isPlayingMusic) {
      bgAudio.play().then(() => {
        state.isPlayingMusic = true;
        if (musicDisc) musicDisc.classList.add('playing');
        if (musicStatus) musicStatus.textContent = 'Đang phát nhạc 🎶';
      }).catch(() => {});
    }
    document.removeEventListener('click', attemptAutoPlay);
    document.removeEventListener('touchstart', attemptAutoPlay);
  }

  document.addEventListener('click', attemptAutoPlay, { once: true });
  document.addEventListener('touchstart', attemptAutoPlay, { once: true });

  // ============================================================
  // 10. ATMOSPHERIC PARTICLES & PETALS CANVASES
  // ============================================================
  const ambCanvas = document.getElementById('ambient-canvas');
  const ambCtx = ambCanvas ? ambCanvas.getContext('2d') : null;
  let stars = [];

  function resizeAmbientCanvas() {
    if (!ambCanvas) return;
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
    if (!ambCtx || !ambCanvas) return;
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

  const petalsCanvas = document.getElementById('petals-canvas');
  const petalsCtx = petalsCanvas ? petalsCanvas.getContext('2d') : null;
  let petals = [];

  function createPetal(randomY = false) {
    return {
      x: Math.random() * (petalsCanvas ? petalsCanvas.width : 500),
      y: randomY ? Math.random() * (petalsCanvas ? petalsCanvas.height : 500) : -30,
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

  function resizePetalsCanvas() {
    if (!petalsCanvas) return;
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;
    petals = [];
    const count = window.innerWidth > 768 ? 24 : 14;
    for (let i = 0; i < count; i++) {
      petals.push(createPetal(true));
    }
  }

  function drawPetals() {
    if (!petalsCtx || !petalsCanvas) return;
    petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

    for (let p of petals) {
      p.y += p.speedY;
      p.swing += p.swingSpeed;
      p.x += Math.sin(p.swing) * 0.6 + p.speedX;
      p.rot += p.rotSpeed;

      if (p.y > petalsCanvas.height + 40) {
        Object.assign(p, createPetal(false));
      }

      petalsCtx.save();
      petalsCtx.translate(p.x, p.y);
      petalsCtx.rotate(p.rot);

      petalsCtx.beginPath();
      petalsCtx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
      petalsCtx.fillStyle = `${p.color}0.75)`;
      petalsCtx.shadowBlur = 6;
      petalsCtx.shadowColor = 'rgba(255, 117, 140, 0.4)';
      petalsCtx.fill();

      petalsCtx.restore();
    }
    requestAnimationFrame(drawPetals);
  }

  // ============================================================
  // 11. FIREWORKS & CONFETTI CELEBRATION EFFECT
  // ============================================================
  function triggerFireworksEffect() {
    playMagicalArpeggio();

    const particles = [];
    const colors = ['#ff758c', '#f6d365', '#fda085', '#2ed573', '#1e90ff', '#ffffff', '#e84118'];

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'celebration-spark';
      p.style.cssText = `
        position: fixed;
        left: 50vw;
        top: 50vh;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 12px currentColor;
        transition: transform 1.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.2s ease;
      `;
      document.body.appendChild(p);
      particles.push(p);

      const angle = (Math.PI * 2 / 40) * i + Math.random() * 0.2;
      const dist = Math.random() * 260 + 120;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        p.style.transform = `translate(${tx}px, ${ty}px) scale(${Math.random() * 1.5 + 0.5})`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 1300);
    }
  }

  // ============================================================
  // 12. DIALOGS & SETTINGS HANDLERS
  // ============================================================
  function updateWishesContent() {
    const data = wishesData[state.category] || wishesData.lover;
    if (modalRecipientTag) modalRecipientTag.textContent = data.tag;

    if (state.category === 'custom') {
      if (customEditorBox) customEditorBox.style.display = 'block';
      if (letterContentDisplay) letterContentDisplay.style.display = 'none';
    } else {
      if (customEditorBox) customEditorBox.style.display = 'none';
      if (letterContentDisplay) letterContentDisplay.style.display = 'block';
      if (letterLead) letterLead.textContent = data.lead;
      if (letterP1) letterP1.textContent = data.p1;
      if (letterP2) letterP2.textContent = data.p2;
      if (letterP3) letterP3.textContent = data.p3;
      if (letterSigName) letterSigName.textContent = data.sig;
    }

    document.querySelectorAll('.cat-tab').forEach(tab => {
      const isSel = tab.getAttribute('data-category') === state.category;
      tab.classList.toggle('active', isSel);
      tab.setAttribute('aria-selected', isSel ? 'true' : 'false');
    });

    // Update names on frame & cute card
    if (displaySender) displaySender.textContent = state.sender;
    if (displayRecipient) displayRecipient.textContent = state.recipient;
    setupCuteCard();
  }

  function openWishesDialog() {
    updateWishesContent();
    if (wishesDialog) {
      wishesDialog.showModal();
      playChime(659.25, 'triangle', 0.4);
    }
  }

  function closeWishesDialog() {
    if (wishesDialog) wishesDialog.close();
  }

  function openPhotoDialog() {
    if (photoDialog) {
      photoDialog.showModal();
      playChime(523.25, 'sine', 0.3);
    }
  }

  function closePhotoDialog() {
    if (photoDialog) photoDialog.close();
  }

  function openNamesDialog() {
    if (inputSender) inputSender.value = state.sender;
    if (inputRecipient) inputRecipient.value = state.recipient;
    if (namesDialog) {
      namesDialog.showModal();
      playChime(587.33, 'sine', 0.3);
    }
  }

  function closeNamesDialog() {
    if (namesDialog) namesDialog.close();
  }

  // Name Form Submission
  if (namesForm) {
    namesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const s = inputSender ? inputSender.value.trim() : '';
      const r = inputRecipient ? inputRecipient.value.trim() : '';
      if (s) state.sender = s;
      if (r) state.recipient = r;

      localStorage.setItem('womenDay_sender', state.sender);
      localStorage.setItem('womenDay_recipient', state.recipient);

      updateWishesContent();
      closeNamesDialog();
      playMagicalArpeggio();
      showToast(`Đã cập nhật: ${state.sender} ❤️ ${state.recipient}`);
    });
  }

  // Name Preset Chips
  document.querySelectorAll('.name-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (inputSender) inputSender.value = chip.getAttribute('data-sender');
      if (inputRecipient) inputRecipient.value = chip.getAttribute('data-recipient');
    });
  });

  // Share Link Builder
  function copyShareLink() {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?from=${encodeURIComponent(state.sender)}&to=${encodeURIComponent(state.recipient)}&cat=${encodeURIComponent(state.category)}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Đã sao chép liên kết thiệp cá nhân hóa!');
      }).catch(() => {
        prompt('Sao chép liên kết chia sẻ bên dưới:', shareUrl);
      });
    } else {
      prompt('Sao chép liên kết chia sẻ bên dưới:', shareUrl);
    }
    playChime(880, 'sine', 0.3);
  }

  // Copy Wishes Text
  function copyWishesText() {
    const data = wishesData[state.category] || wishesData.lover;
    const textToCopy = `${data.lead}\n\n${data.p1}\n\n${data.p2}\n\n${data.p3}\n\n${data.sig}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Đã sao chép trọn vẹn lời chúc 20/10!');
      }).catch(() => {
        showToast('Không thể tự động sao chép!');
      });
    }
  }

  // Local File Upload
  if (imageFileInput) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          setPuzzlePhoto(loadEvent.target.result);
          closePhotoDialog();
          showToast('Đã tải ảnh kỷ niệm riêng của bạn lên thành công!');
          playMagicalArpeggio();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Toast Helper
  let toastTimer = null;
  function showToast(msg) {
    if (!toastMessage) return;
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3200);
  }

  // ============================================================
  // 13. EVENT LISTENERS WIRING
  // ============================================================
  if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
  if (btnReorderPuzzle) btnReorderPuzzle.addEventListener('click', togglePuzzleScatter);
  if (btnChangePhoto) btnChangePhoto.addEventListener('click', openPhotoDialog);
  if (btnCustomNames) btnCustomNames.addEventListener('click', openNamesDialog);
  if (btnShareLink) btnShareLink.addEventListener('click', copyShareLink);
  if (btnMainCelebrate) btnMainCelebrate.addEventListener('click', openWishesDialog);

  if (specialDay20) {
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
  }

  if (coupleTitleWrap) coupleTitleWrap.addEventListener('click', openNamesDialog);

  if (btnCloseDialog) btnCloseDialog.addEventListener('click', closeWishesDialog);
  if (btnClosePhotoDialog) btnClosePhotoDialog.addEventListener('click', closePhotoDialog);
  if (btnCloseNamesDialog) btnCloseNamesDialog.addEventListener('click', closeNamesDialog);

  [wishesDialog, photoDialog, namesDialog].forEach(dialog => {
    if (dialog) {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
      });
    }
  });

  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.category = tab.getAttribute('data-category');
      localStorage.setItem('womenDay_category', state.category);
      updateWishesContent();
      if (state.category === 'custom' && customWishesInput) {
        customWishesInput.value = state.customWishes || `${state.recipient} thân yêu,\nChúc mừng ngày 20/10 thật hạnh phúc!`;
      }
    });
  });

  if (btnSaveCustomWishes) {
    btnSaveCustomWishes.addEventListener('click', () => {
      if (customWishesInput) {
        state.customWishes = customWishesInput.value.trim();
        localStorage.setItem('womenDay_customWishes', state.customWishes);
        updateWishesContent();
        showToast('Đã lưu lời chúc riêng của bạn!');
      }
    });
  }

  document.querySelectorAll('.photo-preset-item').forEach(item => {
    item.addEventListener('click', () => {
      setPuzzlePhoto(item.getAttribute('data-src'));
      closePhotoDialog();
    });
  });

  if (btnTriggerFireworks) btnTriggerFireworks.addEventListener('click', triggerFireworksEffect);
  if (btnCopyWishes) btnCopyWishes.addEventListener('click', copyWishesText);

  window.addEventListener('resize', () => {
    resizeAmbientCanvas();
    resizePetalsCanvas();
    build3DSphere();
  });

  // ============================================================
  // 14. INITIALIZATION
  // ============================================================
  build3DSphere();
  animate3DSphere();
  setupCuteCard();
  generateHeartPuzzle();
  setPuzzlePhoto(state.photoSrc);
  updateWishesContent();

  resizeAmbientCanvas();
  drawAmbient();

  resizePetalsCanvas();
  drawPetals();

  // Initial Scene
  switchScene('bloom', false);

  setTimeout(() => {
    playMagicalArpeggio();
  }, 1000);
});
