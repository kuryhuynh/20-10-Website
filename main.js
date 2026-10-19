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
    sender: (() => {
      const s = localStorage.getItem('womenDay_sender');
      if (!s || s === 'Anh' || s === 'Saphocit') {
        localStorage.setItem('womenDay_sender', 'Tập thể nam lớp 9/6');
        return 'Tập thể nam lớp 9/6';
      }
      return s;
    })(),
    recipient: localStorage.getItem('womenDay_recipient') || 'Em',
    photoSrc: localStorage.getItem('womenDay_photo') || 'assets/photo-couple.jpg',
    category: localStorage.getItem('womenDay_category') || 'lover',
    customWishes: localStorage.getItem('womenDay_customWishes') || '',
    activeScene: 'bloom',
    userManualSceneOverride: false,
    isScattered: false,
    isPlayingMusic: false,
    audioUnlocked: false,
    bloomClicks: 0,
    bloomCompleted: false,
    bloomTargetClicks: 5,
    transitioningToHeart: false,
    playlist: [],
    currentTrackIndex: 0,
    autoPlayNext: localStorage.getItem('womenDay_autoPlayNext') !== 'false',
    repeatMode: localStorage.getItem('womenDay_repeatMode') || 'all',
    shuffle: localStorage.getItem('womenDay_shuffle') === 'true'
  };

  const defaultPlaylist = [
    {
      id: 'local-tiktok',
      title: 'Chờ Chút Thôi, Rồi Anh Sẽ Tìm Tới',
      artist: 'CONGB (TikTok 20/10)',
      type: 'local',
      src: 'assets/music.mp3',
      thumbnail: 'assets/photo-flowers.jpg',
      tag: 'Nhạc Gốc'
    },
    {
      id: 'local-dedanhchoem',
      title: 'Để Dành Cho Em',
      artist: 'Dangrangto (Acoustic R&B)',
      type: 'local',
      src: 'assets/music-2.mp3',
      thumbnail: 'assets/photo-girl.jpg',
      tag: 'Dangrangto'
    },
    {
      id: 'local-nangtho',
      title: 'Nàng Thơ',
      artist: 'Hoàng Dũng (Acoustic Ballad)',
      type: 'local',
      src: 'assets/music-3.mp3',
      thumbnail: 'assets/photo-mother.jpg',
      tag: 'Hoàng Dũng'
    }
  ];

  try {
    const savedCustom = JSON.parse(localStorage.getItem('womenDay_customPlaylist') || '[]');
    state.playlist = [...defaultPlaylist, ...savedCustom];
  } catch (_) {
    state.playlist = [...defaultPlaylist];
  }

  const savedTrackIndex = parseInt(localStorage.getItem('womenDay_trackIndex'), 10);
  if (!isNaN(savedTrackIndex) && savedTrackIndex >= 0 && savedTrackIndex < state.playlist.length) {
    state.currentTrackIndex = savedTrackIndex;
  }

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
  const storyProgressStrip = document.getElementById('story-progress-strip');
  const progressSegments = document.querySelectorAll('.progress-segment');

  // Scene 1: Bloom
  const bloomWrapper = document.querySelector('.bloom-wrapper');
  const bloomingFlower = document.getElementById('blooming-flower');
  const realRoseBloom = document.getElementById('real-rose-bloom');
  const roseWall = document.getElementById('rose-wall');
  const bloomProgressBar = document.getElementById('bloom-progress-bar');
  const bloomHeartDots = document.querySelectorAll('.bloom-heart-dot');
  const bloomCountNum = document.getElementById('bloom-count-num');
  const bloomCueText = document.getElementById('bloom-cue-text');

  // Scene 2: 3D Heart & Falling Names
  const sphereViewport = document.getElementById('sphere-viewport');
  const heart3dCanvas = document.getElementById('heart-3d-canvas');
  const fallingNamesContainer = document.getElementById('falling-names-container');

  // Scene 3: Cute Card
  const backdropPhotosGrid = document.getElementById('backdrop-photos-grid');
  const cuteCardTitle = document.getElementById('cute-card-title');
  const cuteCardBodyText = document.getElementById('cute-card-body-text');
  const cuteCardSignature = document.getElementById('cute-card-signature');

  // Scene 4: Frame & Heart Puzzle
  const displaySender = document.getElementById('display-sender');
  const displayRecipient = document.getElementById('display-recipient');
  const puzzleSvg = document.getElementById('puzzle-svg');
  const puzzleSlotsGroup = document.getElementById('puzzle-slots-group');
  const puzzleGroup = document.getElementById('puzzle-group');
  const puzzleImgElem = document.getElementById('puzzle-image-elem');
  const puzzleProgressText = document.getElementById('puzzle-progress-text');
  const bubbleTooltip = document.getElementById('piece-compliment');
  const bubbleText = document.getElementById('bubble-text');
  const btnReorderPuzzle = document.getElementById('btn-reorder-puzzle');
  const btnAutoSolvePuzzle = document.getElementById('btn-auto-solve-puzzle');
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const specialDay20 = document.getElementById('special-day-20');
  const specialDayTag = document.getElementById('special-day-tag');
  const btnMainCelebrate = document.getElementById('btn-main-celebrate');
  const coupleTitleWrap = document.getElementById('couple-title-wrap');

  // Lyrics Bar
  const lyricsBar = document.getElementById('lyrics-bar');
  const lyricsText = document.getElementById('lyrics-text');

  // Audio Controls & Music Player
  const bgAudio = document.getElementById('bg-audio');
  if (bgAudio) {
    bgAudio.volume = 0.25; // Softer, gentle background music volume
  }
  const musicBtn = document.getElementById('music-btn');
  const musicDisc = document.getElementById('music-disc');
  const musicStatus = document.getElementById('music-status');
  const musicTitle = document.getElementById('music-title');
  const playerMetaBtn = document.getElementById('player-meta-btn');
  const btnPrevTrack = document.getElementById('btn-prev-track');
  const btnPlayPauseTrack = document.getElementById('btn-play-pause-track');
  const btnNextTrack = document.getElementById('btn-next-track');
  const btnOpenPlaylist = document.getElementById('btn-open-playlist');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  const btnMusicPlaylistTop = document.getElementById('btn-music-playlist');
  const musicDialog = document.getElementById('music-dialog');
  const btnCloseMusicDialog = document.getElementById('btn-close-music-dialog');
  const chkAutoplayNext = document.getElementById('chk-autoplay-next');
  const btnToggleRepeat = document.getElementById('btn-toggle-repeat');
  const repeatModeText = document.getElementById('repeat-mode-text');
  const btnToggleShuffle = document.getElementById('btn-toggle-shuffle');
  const shuffleModeText = document.getElementById('shuffle-mode-text');
  const musicPlaylistList = document.getElementById('music-playlist-list');
  const customMusicForm = document.getElementById('custom-music-form');
  const customMusicUrl = document.getElementById('custom-music-url');
  const ytPlayerDock = document.getElementById('yt-player-dock');

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
  function unlockTab(tab) {
    if (!tab) return;
    if (tab.classList.contains('tab-hidden-layer')) {
      tab.classList.remove('tab-hidden-layer');
      tab.classList.add('tab-revealed');
      const realTitle = tab.getAttribute('data-real-title');
      if (realTitle) {
        tab.setAttribute('title', realTitle);
      }
      playChime(783.99, 'sine', 0.2);
    }
  }

  const storySceneOrder = ['bloom', 'sphere', 'card', 'frame'];
  const storySceneDurations = {
    bloom: 10.8,
    sphere: 12.0,
    card: 13.0,
    frame: 15.0
  };
  let sceneElapsedTime = 0;
  let lastProgressTimestamp = performance.now();

  function updateStoryProgressBar(activeSceneName, progressRatio) {
    if (!progressSegments || progressSegments.length === 0) return;
    const curIdx = storySceneOrder.indexOf(activeSceneName);
    if (curIdx === -1) return;

    progressSegments.forEach((seg, idx) => {
      const fill = seg.querySelector('.segment-fill');
      if (!fill) return;

      if (idx < curIdx) {
        seg.classList.add('completed');
        fill.style.width = '100%';
      } else if (idx === curIdx) {
        seg.classList.remove('completed');
        const pct = Math.min(100, Math.max(0, progressRatio * 100));
        fill.style.width = `${pct.toFixed(1)}%`;
      } else {
        seg.classList.remove('completed');
        fill.style.width = '0%';
      }
    });
  }

  function resetStoryProgressBar() {
    sceneElapsedTime = 0;
    lastProgressTimestamp = performance.now();
    updateStoryProgressBar('bloom', 0);
  }

  function resetNavTabsHideLayers() {
    navTabs.forEach(tab => {
      const scene = tab.getAttribute('data-scene');
      if (scene !== 'bloom') {
        tab.classList.add('tab-hidden-layer');
        tab.classList.remove('tab-revealed');
        tab.setAttribute('title', 'Chưa mở khóa - Nhấn để khám phá');
      }
    });
  }

  function switchScene(sceneName, isManual = false) {
    if (isManual) {
      state.userManualSceneOverride = true;
    }
    state.activeScene = sceneName;
    sceneElapsedTime = 0;
    updateStoryProgressBar(sceneName, 0);

    // Update Top Tabs
    navTabs.forEach(tab => {
      const isTarget = tab.getAttribute('data-scene') === sceneName;
      tab.classList.toggle('active', isTarget);
      if (isTarget) {
        unlockTab(tab);
      }
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
      resize3DHeartCanvas();
      if (!scene2LoopRunning) {
        scene2LoopRunning = true;
        requestAnimationFrame(renderScene2Loop);
      }
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

  if (progressSegments) {
    progressSegments.forEach(seg => {
      seg.addEventListener('click', () => {
        const targetScene = seg.getAttribute('data-scene');
        if (targetScene) {
          playChime(659.25, 'sine', 0.25);
          sceneElapsedTime = 0;
          switchScene(targetScene, true);
        }
      });
    });
  }

  // Replay Story Button
  btnReplayStory.addEventListener('click', () => {
    state.userManualSceneOverride = false;
    resetBloomState();
    resetNavTabsHideLayers();
    resetStoryProgressBar();
    bgAudio.currentTime = 0;
    switchScene('bloom', false);
    if (bgAudio.paused) {
      toggleMusic();
    }
    showToast('Bắt đầu câu chuyện tự động từ đầu ✨');
  });

  // ============================================================
  // SPAM CLICK BLOOM MECHANISM (Scene 1)
  // ============================================================
  const bloomNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
  const promptSteps = [
    "Chạm liên tục để đánh thức đóa hoa 💖",
    "Chạm tiếp nào! ✨",
    "Hoa đang thức giấc... 🌸",
    "Sắp nở rồi, cố lên! 🌺",
    "Thêm một lần nữa thôi! 🌹",
    "Đóa hoa bừng nở rực rỡ! 🎉🌹"
  ];

  function resetBloomState() {
    state.bloomClicks = 0;
    state.bloomCompleted = false;
    state.transitioningToHeart = false;
    if (bloomWrapper) bloomWrapper.classList.remove('blooming');
    if (bloomingFlower) {
      bloomingFlower.classList.remove('click-pop', 'warping-out');
      bloomingFlower.style.removeProperty('--rose-scale');
      bloomingFlower.style.removeProperty('--pop-rot');
      bloomingFlower.style.removeProperty('transform');
      bloomingFlower.style.removeProperty('opacity');
    }
    bloomHeartDots.forEach(dot => {
      dot.textContent = '🤍';
      dot.classList.remove('active');
    });
    if (bloomCountNum) bloomCountNum.textContent = '0/5';
    if (bloomCueText) {
      bloomCueText.textContent = promptSteps[0];
      bloomCueText.classList.remove('pulse-ready');
      bloomCueText.style.removeProperty('color');
    }
  }

  function spawnClickParticles(x, y) {
    const emojis = ['💖', '❤️', '✨', '🌸', '🌹', '💕', '⭐'];
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('span');
      p.className = 'click-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 65 + 30;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 50;
      const drot = (Math.random() - 0.5) * 60;

      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--drot', `${drot}deg`);
      p.style.setProperty('--p-size', `${Math.floor(Math.random() * 10 + 20)}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  // Phase 1: Blooming after 5 clicks (waits for 1 more click to transition!)
  function triggerBloomOnly() {
    if (state.bloomCompleted) return;
    state.bloomCompleted = true;

    if (bloomWrapper) bloomWrapper.classList.add('blooming');
    if (bloomCueText) {
      bloomCueText.textContent = '✨ Đóa hoa đã nở! Chạm thêm 1 lần nữa để mở Trái Tim 3D 💖';
      bloomCueText.classList.add('pulse-ready');
    }

    playMagicalArpeggio();
    triggerFireworksEffect();

    // If background music is paused, play seamlessly without resetting position
    const activeTrack = state.playlist[state.currentTrackIndex];
    if (activeTrack && activeTrack.type === 'local' && bgAudio && bgAudio.paused) {
      playTrack(state.currentTrackIndex, true);
    }
  }

  // Phase 2: Click again after bloom -> Warp & transition to 3D Heart
  function transitionTo3DHeart() {
    if (state.transitioningToHeart) return;
    state.transitioningToHeart = true;

    if (bloomCueText) {
      bloomCueText.textContent = 'Đang mở Trái Tim 3D... ✨';
    }

    playChime(1046.50, 'sine', 0.35);
    playMagicalArpeggio();
    triggerFireworksEffect();

    if (bloomingFlower) {
      bloomingFlower.classList.add('warping-out');
    }

    setTimeout(() => {
      switchScene('sphere', false);
      const curTrack = state.playlist[state.currentTrackIndex];
      if (curTrack && curTrack.type === 'local' && bgAudio && bgAudio.paused) {
        bgAudio.play().catch(e => console.warn(e));
      }
      if (bloomingFlower) {
        bloomingFlower.classList.remove('warping-out');
        bloomingFlower.style.removeProperty('transform');
        bloomingFlower.style.removeProperty('opacity');
      }
    }, 450);
  }

  function handleBloomClick(e) {
    if (state.activeScene !== 'bloom') return;

    let clientX = e ? e.clientX : window.innerWidth / 2;
    let clientY = e ? e.clientY : window.innerHeight / 2;
    if (e && e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    spawnClickParticles(clientX, clientY);

    // If flower has already bloomed, this extra click transitions to Trái Tim 3D!
    if (state.bloomCompleted) {
      transitionTo3DHeart();
      return;
    }

    state.bloomClicks++;
    initAudioContext();

    // Rising chime sound on every click
    const noteIdx = Math.min(state.bloomClicks - 1, bloomNotes.length - 1);
    playChime(bloomNotes[noteIdx], 'sine', 0.22);

    // Spring pop animation on the flower
    if (bloomingFlower) {
      bloomingFlower.classList.remove('click-pop');
      void bloomingFlower.offsetWidth;
      bloomingFlower.classList.add('click-pop');

      const scaleVal = 1 + Math.min(state.bloomClicks, 5) * 0.035;
      bloomingFlower.style.setProperty('--rose-scale', scaleVal);
      const rot = (state.bloomClicks % 2 === 0 ? 3 : -3);
      bloomingFlower.style.setProperty('--pop-rot', `${rot}deg`);
    }

    // Update heart indicators
    bloomHeartDots.forEach((dot, idx) => {
      if (idx < state.bloomClicks) {
        dot.textContent = '❤️';
        dot.classList.add('active');
      } else {
        dot.textContent = '🤍';
        dot.classList.remove('active');
      }
    });

    if (bloomCountNum) {
      bloomCountNum.textContent = `${Math.min(state.bloomClicks, 5)}/5`;
    }

    if (bloomCueText && state.bloomClicks < 5) {
      bloomCueText.textContent = promptSteps[state.bloomClicks];
    }

    // When 5 clicks are reached, trigger blooming (waits for extra click to transition)
    if (state.bloomClicks >= 5) {
      triggerBloomOnly();
    }
  }

  // Bloom Screen Click to Start
  if (bloomWrapper) {
    bloomWrapper.addEventListener('click', handleBloomClick);
  }

  // ============================================================
  // 5. TIMELINE & SYNCHRONIZED LYRICS
  // ============================================================
  const lyricsTimeline = [
    { start: 0.0, end: 3.2, text: "Chờ anh chút thôi, khi mùa đông vừa sang", scene: 'bloom' },
    { start: 3.2, end: 7.0, text: "Xếp lại hết ngổn ngang", scene: 'bloom', bloomTrigger: true },
    { start: 7.0, end: 10.8, text: "Chờ chút thôi, rồi anh sẽ tìm tới", scene: 'bloom' },
    { start: 10.8, end: 14.8, text: "Chờ anh chút thôi, đã phiền em phải đợi", scene: 'sphere' },
    { start: 14.8, end: 17.5, text: "Có anh ở đây rồi", scene: 'sphere' },
    { start: 17.5, end: 22.0, text: "Thật gần em thôi, dù xa cách phương trời", scene: 'sphere' },
    { start: 22.0, end: 26.8, text: "Cầm tay anh, dựa vai anh", scene: 'card' },
    { start: 26.8, end: 32.8, text: "Ngàn ánh sao vụt qua nhẹ ôm lấy em", scene: 'card' },
    { start: 32.8, end: 40.5, text: "Nguyện mãi bên cạnh nhau, say đắm như ngày đầu", scene: 'card' },
    { start: 40.5, end: 999.0, text: "Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10 💖", scene: 'frame' }
  ];

  bgAudio.addEventListener('timeupdate', () => {
    const activeTrack = state.playlist[state.currentTrackIndex];
    if (!activeTrack) return;

    if (activeTrack.id === 'local-tiktok') {
      const curTime = bgAudio.currentTime;
      const currentItem = lyricsTimeline.find(item => curTime >= item.start && curTime < item.end);

      if (currentItem) {
        if (lyricsText && lyricsText.textContent !== currentItem.text) {
          lyricsText.textContent = currentItem.text;
        }

        if (!state.userManualSceneOverride) {
          if (currentItem.bloomTrigger && bloomWrapper) {
            bloomWrapper.classList.add('blooming');
          }
        }
      }
    } else {
      const trackNotice = `Giai điệu: ${activeTrack.title} - ${activeTrack.artist} 💖`;
      if (lyricsText && lyricsText.textContent !== trackNotice) {
        lyricsText.textContent = trackNotice;
      }
    }
  });

  // ============================================================
  // Story Auto-Progress Loop Across Categories
  // ============================================================
  function runStoryProgressLoop(now) {
    const dt = Math.min(0.1, (now - lastProgressTimestamp) / 1000);
    lastProgressTimestamp = now;

    const activeTrack = state.playlist[state.currentTrackIndex];
    const isTikTokTrack = activeTrack && activeTrack.id === 'local-tiktok';

    let curRatio = 0;
    const curScene = state.activeScene;

    if (isTikTokTrack && bgAudio) {
      const curTime = bgAudio.currentTime;

      if (curScene === 'bloom') {
        curRatio = Math.min(1, Math.max(0, curTime / 10.8));
        if (curTime >= 6.0 && !state.bloomCompleted) {
          triggerBloomOnly();
        }
        if (curTime >= 10.8 && !state.userManualSceneOverride) {
          if (!state.transitioningToHeart) {
            transitionTo3DHeart();
          }
        }
      } else if (curScene === 'sphere') {
        curRatio = Math.min(1, Math.max(0, (curTime - 10.8) / 11.2));
        if (curTime >= 22.0 && !state.userManualSceneOverride) {
          switchScene('card', false);
        }
      } else if (curScene === 'card') {
        curRatio = Math.min(1, Math.max(0, (curTime - 22.0) / 13.0));
        if (curTime >= 35.0 && !state.userManualSceneOverride) {
          switchScene('frame', false);
        }
      } else if (curScene === 'frame') {
        curRatio = Math.min(1, Math.max(0, (curTime - 35.0) / 15.0));
      }
    } else {
      // High-precision timer for other tracks / without audio
      const sceneDur = storySceneDurations[curScene] || 12.0;

      if (!document.body.classList.contains('loading-state')) {
        sceneElapsedTime += dt;
      }
      curRatio = Math.min(1, sceneElapsedTime / sceneDur);

      if (!state.userManualSceneOverride) {
        if (curScene === 'bloom') {
          if (curRatio >= 0.55 && !state.bloomCompleted) {
            triggerBloomOnly();
          }
          if (curRatio >= 1.0 && !state.transitioningToHeart) {
            transitionTo3DHeart();
            sceneElapsedTime = 0;
          }
        } else if (curScene === 'sphere') {
          if (curRatio >= 1.0) {
            switchScene('card', false);
            sceneElapsedTime = 0;
          }
        } else if (curScene === 'card') {
          if (curRatio >= 1.0) {
            switchScene('frame', false);
            sceneElapsedTime = 0;
          }
        } else if (curScene === 'frame') {
          curRatio = 1.0;
        }
      }
    }

    updateStoryProgressBar(curScene, curRatio);
    requestAnimationFrame(runStoryProgressLoop);
  }

  requestAnimationFrame(runStoryProgressLoop);

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

  // Honorary Women for 20/10 Vietnamese Women's Day
  const honoraryWomenList = [
    {
      name: "Ánh Duyên",
      icon: "🌹",
      isVip: true,
      wish: "🌹 Chúc Ánh Duyên luôn xinh đẹp kiêu sa, tỏa sáng rực rỡ như đóa hồng nhung ngát hương và ngập tràn hạnh phúc yêu thương! 💖✨ (Thân tặng từ Tập thể nam lớp 9/6)"
    },
    { name: "Nguyễn Ngọc Thanh Giang", icon: "🌸", wish: "Chúc Thanh Giang luôn rạng rỡ, ngập tràn niềm vui và bình an! 🌸" },
    { name: "Đỗ Thị Như Quỳnh", icon: "💖", wish: "Chúc Như Quỳnh mãi xinh đẹp, tự tin và vạn sự như ý! 💖" },
    { name: "Hồ Thanh Hà", icon: "🌷", wish: "Chúc Thanh Hà một ngày 20/10 ngọt ngào, thành công và luôn tươi vui! 🌷" },
    { name: "Lương Ngọc Bảo Hân", icon: "✨", wish: "Chúc Bảo Hân luôn là đóa hoa thơm ngát, tươi tắn và hạnh phúc! ✨" },
    { name: "Phạm Mai Xuân Thảo", icon: "🌺", wish: "Chúc Xuân Thảo luôn tràn đầy năng lượng tích cực và may mắn! 🌺" },
    { name: "Nguyễn Đặng Bích Lam", icon: "🌼", wish: "Chúc Bích Lam luôn dịu dàng, duyên dáng và chạm đến mọi ước mơ! 🌼" },
    { name: "Võ Ngọc Thảo Nhi", icon: "💫", wish: "Chúc Thảo Nhi luôn rạng ngời nụ cười xinh và được yêu thương trọn vẹn! 💫" },
    { name: "Lê Quách Kim Thư", icon: "💐", wish: "Chúc Kim Thư một ngày 20/10 thật nhiều hoa, quà và tiếng cười! 💐" },
    { name: "Huỳnh Kim Phụng", icon: "👑", wish: "Chúc Kim Phụng luôn bản lĩnh, rực rỡ và gặt hái nhiều thành công! 👑" },
    { name: "Võ Ngọc Khánh An", icon: "🍀", wish: "Chúc Khánh An luôn bình an, may mắn và ngập tràn niềm vui! 🍀" },
    { name: "Nguyễn Yến Thư", icon: "🎀", wish: "Chúc Yến Thư luôn trong trẻo, đáng yêu và hạnh phúc mỗi ngày! 🎀" },
    { name: "Lê Ngọc Bảo Châu", icon: "💎", wish: "Chúc Bảo Châu mãi là viên ngọc quý tỏa sáng lấp lánh! 💎" },
    { name: "Trần Lương Anh Thư", icon: "🌹", wish: "Chúc Anh Thư luôn tươi trẻ, thông minh và tràn ngập yêu thương! 🌹" },
    { name: "Trần Thị Trúc Quỳnh", icon: "🌸", wish: "Chúc Trúc Quỳnh thanh tú, ngọt ngào và hạnh phúc ngập tràn! 🌸" },
    { name: "Nguyễn Vũ Trúc Quỳnh", icon: "☀️", wish: "Chúc Trúc Quỳnh luôn rạng rỡ như ánh dương, mọi điều suôn sẻ! ☀️" },
    { name: "Nguyễn Ngọc Bảo Trân", icon: "🦋", wish: "Chúc Bảo Trân luôn xinh đẹp, may mắn và vạn điều như ý! 🦋" },
    { name: "Huỳnh Thiên Kim", icon: "🌟", wish: "Chúc Thiên Kim luôn tỏa sáng, quý phái và thành công rực rỡ! 🌟" },
    { name: "Nguyễn Bùi Gia Linh", icon: "💕", wish: "Chúc Gia Linh luôn đáng yêu, hạnh phúc và gặp nhiều điều tuyệt vời nhất! 💕" }
  ];

  // ------------------------------------------------------------
  // PART A: 3D Big Heart Assembled from Hundreds of Mini Hearts
  // ------------------------------------------------------------
  let heartCtx = null;
  let heartParticles = [];
  let haloMiniHearts = [];
  let heartSprites = [];

  // Pre-render glowing mini heart sprites for 60fps performance
  function createMiniHeartSprite(fillColor, glowColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 14;
    ctx.fillStyle = fillColor;

    ctx.save();
    ctx.translate(32, 28);
    ctx.scale(1.2, 1.2);
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.bezierCurveTo(-3, -12, -14, -12, -14, -3);
    ctx.bezierCurveTo(-14, 5, -5, 11, 0, 16);
    ctx.bezierCurveTo(5, 11, 14, 5, 14, -3);
    ctx.bezierCurveTo(14, -12, 3, -12, 0, -4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    return canvas;
  }

  function initHeartSprites() {
    heartSprites = [
      createMiniHeartSprite('#ff0055', '#ff4081'), // Ruby Vivid
      createMiniHeartSprite('#ff477e', '#ff758c'), // Rose Pink
      createMiniHeartSprite('#ffd700', '#f6d365'), // Champagne Gold
      createMiniHeartSprite('#ffffff', '#ffccd5'), // Diamond White
      createMiniHeartSprite('#e0115f', '#ff1744')  // Velvet Crimson
    ];
  }

  function generate3DHeartParticles() {
    const list = [];
    const zSlices = 18;

    // 1. Surface outline cross-sections (forming the 3D heart shell)
    for (let s = 0; s < zSlices; s++) {
      const zNorm = -1 + (2 * s) / (zSlices - 1); // -1 to 1
      const z = zNorm * 11;
      const radiusProfile = Math.sqrt(Math.max(0, 1 - zNorm * zNorm));
      const pointsInSlice = Math.round(18 * radiusProfile) + 4;

      for (let j = 0; j < pointsInSlice; j++) {
        const t = (Math.PI * 2 * j) / pointsInSlice;
        // 2D heart parametric formula
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        list.push({
          x: hx * radiusProfile,
          y: hy * radiusProfile,
          z: z,
          baseSize: Math.random() * 8 + 14,
          spriteIdx: Math.floor(Math.random() * heartSprites.length),
          driftPhase: Math.random() * Math.PI * 2,
          driftSpeed: Math.random() * 0.03 + 0.02
        });
      }
    }

    // 2. Interior volumetric points (fill heart interior with sparkling mini-hearts)
    const interiorTarget = 440;
    while (list.length < interiorTarget) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.55);
      const zNorm = (-1 + Math.random() * 2) * 0.85;
      const radiusProfile = Math.sqrt(Math.max(0, 1 - zNorm * zNorm)) * r;

      const hx = 16 * Math.pow(Math.sin(t), 3) * radiusProfile;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * radiusProfile;
      const z = zNorm * 10;

      list.push({
        x: hx,
        y: hy,
        z: z,
        baseSize: Math.random() * 6 + 11,
        spriteIdx: Math.floor(Math.random() * heartSprites.length),
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.03 + 0.02
      });
    }

    // 3. Orbiting halo stardust mini-hearts (ring orbiting around the heart)
    const halo = [];
    const haloCount = 45;
    for (let h = 0; h < haloCount; h++) {
      const angle = (Math.PI * 2 * h) / haloCount;
      const dist = 24 + Math.random() * 6;
      halo.push({
        angle: angle,
        dist: dist,
        baseSize: Math.random() * 5 + 8,
        speed: 0.015 + Math.random() * 0.01,
        spriteIdx: Math.random() > 0.5 ? 2 : 1 // gold or rose
      });
    }

    heartParticles = list;
    haloMiniHearts = halo;
  }

  // ------------------------------------------------------------
  // PART B: Continuous Falling Names System (18 Women)
  // ------------------------------------------------------------
  let fallingItems = [];

  function buildFallingNames() {
    if (!fallingNamesContainer || !sphereViewport) return;
    fallingNamesContainer.innerHTML = '';

    const vHeight = sphereViewport.clientHeight || window.innerHeight || 800;
    const totalSpan = vHeight + 200;

    const regularWomen = honoraryWomenList.filter(p => !p.isVip);
    const vipPerson = honoraryWomenList.find(p => p.isVip);
    const regCount = regularWomen.length;

    // All items share the exact same falling speed so vertical spacing is conserved
    const uniformSpeed = 0.88;

    fallingItems = [];

    // 1. VIP Item: Ánh Duyên (Starts cleanly visible at the top, alone in VIP corridor)
    if (vipPerson) {
      const card = document.createElement('div');
      card.className = 'falling-name-card vip-rose-card';
      card.innerHTML = `
        <div class="falling-name-pill vip-rose-pill" title="Nhấn để nhận lời chúc đặc biệt 20/10 dành riêng cho Ánh Duyên!">
          <div class="rose-border-garland" aria-hidden="true">
            <span class="rose-flower-badge tl">🌹</span>
            <span class="rose-flower-badge tr">🌹</span>
            <span class="rose-flower-badge bl">🌹</span>
            <span class="rose-flower-badge br">🌹</span>
            <span class="rose-leaf-badge top">🌿</span>
            <span class="rose-leaf-badge bottom">🌿</span>
          </div>
          <div class="vip-rose-content">
            <div class="vip-rose-header">
              <span class="vip-crown">👑</span>
              <span class="vip-tag-text">ĐÓA HỒNG RẠNG RỠ NHẤT</span>
              <span class="vip-crown">👑</span>
            </div>
            <div class="vip-name-row">
              <img src="assets/real-rose.png" alt="" class="vip-mini-rose-img left" />
              <span class="falling-name-title vip-name-title">${vipPerson.name}</span>
              <img src="assets/real-rose.png" alt="" class="vip-mini-rose-img right" />
            </div>
            <span class="falling-name-sub vip-name-sub">🌹 Nàng Thơ 20/10 🌹</span>
          </div>
        </div>
      `;
      fallingNamesContainer.appendChild(card);

      const vipItem = {
        el: card,
        person: vipPerson,
        idx: 0,
        regIdx: -1,
        isVip: true,
        y: 60, // Clean initial position, high up and clear of other cards
        x: 0,
        speed: uniformSpeed,
        swayTime: 0,
        swaySpeed: 0.012,
        swayAmp: 10,
        isHovered: false
      };

      card.addEventListener('mouseenter', () => { vipItem.isHovered = true; });
      card.addEventListener('mouseleave', () => { vipItem.isHovered = false; });
      card.addEventListener('touchstart', () => { vipItem.isHovered = true; }, { passive: true });
      card.addEventListener('touchend', () => {
        setTimeout(() => { vipItem.isHovered = false; }, 900);
      });

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = card.getBoundingClientRect();
        playMagicalArpeggio();
        spawnClickParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        triggerFireworksEffect();
        showToast(vipPerson.wish);
      });

      fallingItems.push(vipItem);
    }

    // 2. Regular 18 Women
    regularWomen.forEach((person, rIdx) => {
      const card = document.createElement('div');
      card.className = 'falling-name-card';
      card.innerHTML = `
        <div class="falling-name-pill">
          <span class="falling-name-title">${person.name}</span>
          <span class="falling-name-sub">20/10 Rạng Rỡ</span>
        </div>
      `;
      fallingNamesContainer.appendChild(card);

      // Stagger initial Y uniformly across totalSpan
      const startY = -70 + ((rIdx + 0.5) / regCount) * totalSpan;

      const item = {
        el: card,
        person: person,
        idx: rIdx + 1,
        regIdx: rIdx,
        isVip: false,
        y: startY,
        x: 0,
        speed: uniformSpeed,
        swayTime: (rIdx + 1) * 0.73,
        swaySpeed: 0.015,
        swayAmp: 10,
        isHovered: false
      };

      card.addEventListener('mouseenter', () => { item.isHovered = true; });
      card.addEventListener('mouseleave', () => { item.isHovered = false; });
      card.addEventListener('touchstart', () => { item.isHovered = true; }, { passive: true });
      card.addEventListener('touchend', () => {
        setTimeout(() => { item.isHovered = false; }, 900);
      });

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = card.getBoundingClientRect();
        playChime(880, 'sine', 0.4);
        spawnClickParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        showToast(person.wish);
      });

      fallingItems.push(item);
    });
  }

  function resize3DHeartCanvas() {
    if (!heart3dCanvas || !sphereViewport) return;
    const rect = sphereViewport.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width || sphereViewport.clientWidth || window.innerWidth || 800;
    const h = rect.height || sphereViewport.clientHeight || (window.innerHeight - 120) || 600;
    heart3dCanvas.width = Math.round(w * dpr);
    heart3dCanvas.height = Math.round(h * dpr);
    if (heartCtx) {
      heartCtx.setTransform(1, 0, 0, 1, 0, 0);
      heartCtx.scale(dpr, dpr);
    }
  }

  // Interaction & Rotation variables
  let isDraggingSphere = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let curRotX = -10;
  let curRotY = 0;
  let targetRotX = -10;
  let targetRotY = 0;
  let animTime = 0;
  let scene2LoopRunning = false;

  function init3DHeartScene() {
    if (!heart3dCanvas) return;
    heartCtx = heart3dCanvas.getContext('2d');
    initHeartSprites();
    generate3DHeartParticles();
    resize3DHeartCanvas();
    buildFallingNames();

    // Canvas click to trigger celebratory burst
    if (!heart3dCanvas.dataset.bound) {
      heart3dCanvas.dataset.bound = 'true';
      heart3dCanvas.addEventListener('click', (e) => {
        if (Math.abs(e.clientX - dragStartX) > 8 || Math.abs(e.clientY - dragStartY) > 8) return;
        playMagicalArpeggio();
        spawnClickParticles(e.clientX, e.clientY);
        triggerFireworksEffect();
        showToast('Trái tim 3D chúc các đóa hoa 20/10 luôn xinh đẹp, rạng ngời và ngập tràn hạnh phúc! 💖🌹');
      });
    }

    if (sphereViewport && !sphereViewport.dataset.dragBound) {
      sphereViewport.dataset.dragBound = 'true';
      sphereViewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.falling-name-card') || e.target.closest('.sphere-drag-hint')) return;
        isDraggingSphere = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        try { sphereViewport.setPointerCapture(e.pointerId); } catch (_) {}
      });

      sphereViewport.addEventListener('pointermove', (e) => {
        if (!isDraggingSphere) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragStartX = e.clientX;
        dragStartY = e.clientY;

        targetRotY += dx * 0.45;
        targetRotX -= dy * 0.45;
        targetRotX = Math.max(-65, Math.min(65, targetRotX));
      });

      const endDrag = (e) => {
        if (isDraggingSphere) {
          isDraggingSphere = false;
          try { sphereViewport.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      };

      sphereViewport.addEventListener('pointerup', endDrag);
      sphereViewport.addEventListener('pointercancel', endDrag);
    }

    if (!scene2LoopRunning) {
      scene2LoopRunning = true;
      requestAnimationFrame(renderScene2Loop);
    }
  }

  function renderScene2Loop() {
    if (state.activeScene !== 'sphere') {
      scene2LoopRunning = false;
      return;
    }

    animTime += 0.025;

    // Smooth drag inertia & continuous auto-rotation
    if (!isDraggingSphere) {
      targetRotY += 0.28; // gentle cosmic auto spin
    }
    curRotX += (targetRotX - curRotX) * 0.08;
    curRotY += (targetRotY - curRotY) * 0.08;

    // --------------------------------------------------------
    // 1. RENDER 3D BIG HEART COMPOSED OF MINI HEARTS
    // --------------------------------------------------------
    if (heartCtx && heart3dCanvas && sphereViewport) {
      const rect = sphereViewport.getBoundingClientRect();
      const w = rect.width || sphereViewport.clientWidth || window.innerWidth || 800;
      const h = rect.height || sphereViewport.clientHeight || (window.innerHeight - 120) || 600;
      heartCtx.clearRect(0, 0, w, h);

      // Heartbeat pulse calculation
      const beat = 1 + 0.07 * Math.sin(animTime * 3.4) + 0.035 * Math.sin(animTime * 6.8);
      const heartScale = (w < 768 ? 6.2 : 8.2) * beat;

      const radY = (curRotY * Math.PI) / 180;
      const radX = (curRotX * Math.PI) / 180;
      const cosY = Math.cos(radY), sinY = Math.sin(radY);
      const cosX = Math.cos(radX), sinX = Math.sin(radX);

      const focal = 620;
      const cx = w / 2;
      const cy = h / 2 - 15;

      // Project all mini hearts into 3D
      const projected = [];

      heartParticles.forEach((p) => {
        const drift = Math.sin(animTime * p.driftSpeed + p.driftPhase) * 0.6;
        const px = (p.x + drift) * heartScale;
        const py = (p.y + drift) * heartScale;
        const pz = p.z * heartScale;

        // Rotate Y
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective projection
        const persp = focal / (focal + z2);
        const screenX = cx + x1 * persp;
        const screenY = cy + y2 * persp;
        const renderSize = p.baseSize * persp;

        projected.push({
          x: screenX,
          y: screenY,
          z: z2,
          size: renderSize,
          spriteIdx: p.spriteIdx,
          alpha: Math.min(1, Math.max(0.4, 0.75 + (z2 / (20 * heartScale)) * 0.35))
        });
      });

      // Halo mini hearts orbiting around
      haloMiniHearts.forEach((halo) => {
        const curAngle = halo.angle + animTime * halo.speed;
        const hx = Math.cos(curAngle) * halo.dist * heartScale;
        const hy = Math.sin(curAngle) * (halo.dist * 0.35) * heartScale;
        const hz = Math.sin(curAngle) * halo.dist * heartScale * 0.85;

        const x1 = hx * cosY + hz * sinY;
        const z1 = -hx * sinY + hz * cosY;
        const y2 = hy * cosX - z1 * sinX;
        const z2 = hy * sinX + z1 * cosX;

        const persp = focal / (focal + z2);
        projected.push({
          x: cx + x1 * persp,
          y: cy + y2 * persp,
          z: z2,
          size: halo.baseSize * persp,
          spriteIdx: halo.spriteIdx,
          alpha: 0.85
        });
      });

      // Painter's algorithm: sort by depth Z (back to front)
      projected.sort((a, b) => a.z - b.z);

      // Central radial glow aura behind the heart
      const auraGrad = heartCtx.createRadialGradient(cx, cy, 10, cx, cy, 130 * beat);
      auraGrad.addColorStop(0, 'rgba(255, 64, 129, 0.38)');
      auraGrad.addColorStop(0.5, 'rgba(235, 47, 6, 0.12)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      heartCtx.fillStyle = auraGrad;
      heartCtx.beginPath();
      heartCtx.arc(cx, cy, 130 * beat, 0, Math.PI * 2);
      heartCtx.fill();

      // Draw all mini hearts
      projected.forEach((p) => {
        const sprite = heartSprites[p.spriteIdx] || heartSprites[0];
        heartCtx.globalAlpha = p.alpha;
        heartCtx.drawImage(sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });
      heartCtx.globalAlpha = 1;
    }

    // --------------------------------------------------------
    // 2. ANIMATE CONTINUOUS FALLING NAMES WATERFALL
    // --------------------------------------------------------
    if (sphereViewport && fallingNamesContainer && fallingItems.length > 0) {
      const vWidth = sphereViewport.clientWidth || window.innerWidth;
      const vHeight = sphereViewport.clientHeight || window.innerHeight;
      const totalSpan = vHeight + 200;

      // Responsive balanced lane fractions across the width
      // VIP card (Ánh Duyên) has its OWN dedicated lane; regular cards never occupy vipFraction
      let regLanes;
      let regPattern;
      let vipFraction;
      const cardEstWidth = vWidth < 540 ? 135 : 175;
      const vipEstWidth = vWidth < 540 ? 195 : 240;

      if (vWidth < 768) {
        // Mobile / Small tablet (2 distinct side lanes, VIP in center lane)
        regLanes = [0.02, 0.98];
        regPattern = [0, 1];
        vipFraction = 0.50;
      } else if (vWidth < 1100) {
        // Tablet / Small desktop (4 regular lanes, VIP in dedicated center lane)
        regLanes = [0.02, 0.23, 0.77, 0.98];
        regPattern = [0, 2, 1, 3];
        vipFraction = 0.50;
      } else {
        // Desktop (5 regular lanes + 1 dedicated VIP lane = 6 non-overlapping columns)
        regLanes = [0.02, 0.20, 0.61, 0.79, 0.98];
        regPattern = [0, 2, 4, 1, 3];
        vipFraction = 0.40; // Perfectly frames left of the 3D heart, clear of Lane 1 (0.20) and Lane 2 (0.61)
      }

      // Step 1: Base falling motion & horizontal lane positioning
      fallingItems.forEach((item) => {
        const cardW = item.isVip ? vipEstWidth : cardEstWidth;
        let fraction;
        if (item.isVip) {
          fraction = vipFraction;
        } else {
          const laneIdx = regPattern[item.regIdx % regPattern.length];
          fraction = regLanes[laneIdx];
        }

        const maxX = vWidth - cardW - 8;
        const baseX = Math.max(8, Math.min(maxX, 8 + fraction * (vWidth - cardW - 16)));

        if (!item.isHovered) {
          item.y += item.speed;
          item.swayTime += item.swaySpeed;

          // Seamless wrap: preserves uniform vertical intervals indefinitely
          if (item.y > vHeight + 90) {
            item.y -= totalSpan;
          }
        }

        const swayX = Math.sin(item.swayTime) * item.swayAmp;
        item.x = Math.max(6, Math.min(maxX, baseX + swayX));
      });

      // Step 2: Dynamic Anti-Collision & Proximity Repulsion Guard
      // Guarantees Ánh Duyên and all cards NEVER overlap or cover each other
      const itemCount = fallingItems.length;
      for (let i = 0; i < itemCount; i++) {
        const itemA = fallingItems[i];
        const aW = itemA.isVip ? vipEstWidth : cardEstWidth;
        const aCenterX = itemA.x + aW / 2;

        for (let j = i + 1; j < itemCount; j++) {
          const itemB = fallingItems[j];
          const bW = itemB.isVip ? vipEstWidth : cardEstWidth;
          const bCenterX = itemB.x + bW / 2;

          const isVipInvolved = itemA.isVip || itemB.isVip;
          const minSafeX = isVipInvolved ? (vWidth < 540 ? 150 : 215) : (vWidth < 540 ? 100 : 155);
          const minSafeY = isVipInvolved ? 70 : 44;

          const dx = aCenterX - bCenterX;
          const dy = itemA.y - itemB.y;

          if (Math.abs(dx) < minSafeX && Math.abs(dy) < minSafeY) {
            // Proximity detected! Smoothly separate them:
            // Vertical separation: retard trailing item
            if (dy > 0) {
              // itemA is lower (ahead), itemB is higher (trailing)
              if (!itemB.isHovered) itemB.y -= 1.2;
              if (!itemA.isHovered) itemA.y += 0.4;
            } else {
              // itemB is lower (ahead), itemA is higher (trailing)
              if (!itemA.isHovered) itemA.y -= 1.2;
              if (!itemB.isHovered) itemB.y += 0.4;
            }

            // Horizontal gentle push away
            const overlapX = minSafeX - Math.abs(dx);
            const pushX = Math.min(10, overlapX * 0.2);
            if (dx >= 0) {
              itemA.x = Math.min(vWidth - aW - 6, itemA.x + pushX);
              itemB.x = Math.max(6, itemB.x - pushX);
            } else {
              itemA.x = Math.max(6, itemA.x - pushX);
              itemB.x = Math.min(vWidth - bW - 6, itemB.x + pushX);
            }
          }
        }
      }

      // Step 3: Apply transform to DOM elements
      fallingItems.forEach((item) => {
        item.el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0)`;
      });
    }

    requestAnimationFrame(renderScene2Loop);
  }

  // Compatibility aliases
  function build3DSphere() {
    init3DHeartScene();
  }

  function animate3DSphere() {
    if (!scene2LoopRunning) {
      scene2LoopRunning = true;
      requestAnimationFrame(renderScene2Loop);
    }
  }

  // ============================================================
  // 7. SCENE 3: CUTE CARD SETUP
  // ============================================================
  function setupCuteCard() {
    if (cuteCardTitle) {
      if (!state.recipient || state.recipient === 'Em') {
        cuteCardTitle.textContent = 'Gửi Chị Em Phụ Nữ !';
      } else {
        cuteCardTitle.textContent = `Gửi ${state.recipient} !`;
      }
    }
    if (cuteCardSignature) cuteCardSignature.textContent = `${state.sender}`;

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
  // 8. SCENE 4: INTERACTIVE SVG JIGSAW PUZZLE (Heart Shape)
  // ============================================================
  function getSVGPoint(svgElem, clientX, clientY) {
    if (!svgElem) return { x: clientX, y: clientY };
    const pt = svgElem.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    try {
      const ctm = svgElem.getScreenCTM();
      if (ctm) {
        return pt.matrixTransform(ctm.inverse());
      }
    } catch (_) {}
    return { x: clientX, y: clientY };
  }

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
    if (puzzleSlotsGroup) puzzleSlotsGroup.innerHTML = '';

    const cols = 6;
    const rows = 6;
    const width = 280;
    const height = 240;
    const startX = 70;
    const startY = 12;
    const cellW = width / cols;
    const cellH = height / rows;

    // Piece Tray configuration (7 cols x 4 rows = 28 spots inside tray)
    const trayX = 14;
    const trayY = 308;
    const trayW = 392;
    const trayH = 136;
    const trayCols = 7;
    const trayRows = 4;
    const trayCellW = trayW / trayCols;
    const trayCellH = trayH / trayRows;

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

    // Global window-level drag manager for 100% uninterrupted, stutter-free dragging
    let activePiece = null;
    let activeSlot = null;
    let isDragging = false;
    let startPtrX = 0, startPtrY = 0;
    let startPieceX = 0, startPieceY = 0;
    let curClientX = 0, curClientY = 0;
    let hasMoved = false;
    let rafId = null;
    let invCTM = null;

    const onGlobalTouchMove = (e) => {
      if (isDragging && e.cancelable) {
        e.preventDefault();
      }
    };

    const updatePieceDrag = () => {
      rafId = null;
      if (!isDragging || !activePiece) return;

      const pt = puzzleSvg.createSVGPoint();
      pt.x = curClientX;
      pt.y = curClientY;
      const svgPt = invCTM ? pt.matrixTransform(invCTM) : pt;

      const dx = svgPt.x - startPtrX;
      const dy = svgPt.y - startPtrY;

      if (Math.hypot(dx, dy) > 3) {
        hasMoved = true;
      }

      const newX = startPieceX + dx;
      const newY = startPieceY + dy;
      activePiece.setAttribute('data-current-x', newX.toFixed(1));
      activePiece.setAttribute('data-current-y', newY.toFixed(1));

      const dist = Math.hypot(newX, newY);

      if (dist < 55) {
        activePiece.classList.add('snap-ready');
        if (activeSlot) activeSlot.classList.add('in-range');
      } else {
        activePiece.classList.remove('snap-ready');
        if (activeSlot) activeSlot.classList.remove('in-range');
      }

      activePiece.setAttribute('transform', `translate(${newX.toFixed(1)}, ${newY.toFixed(1)})`);
    };

    const onGlobalPointerMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      curClientX = e.clientX;
      curClientY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updatePieceDrag);
      }
    };

    const onGlobalPointerEnd = (e) => {
      if (!isDragging || !activePiece) return;
      isDragging = false;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      document.body.classList.remove('puzzle-dragging-active');
      window.removeEventListener('pointermove', onGlobalPointerMove);
      window.removeEventListener('pointerup', onGlobalPointerEnd);
      window.removeEventListener('pointercancel', onGlobalPointerEnd);
      window.removeEventListener('touchmove', onGlobalTouchMove);

      const piece = activePiece;
      const slot = activeSlot;
      piece.classList.remove('is-dragging', 'snap-ready');
      if (slot) slot.classList.remove('highlight-target', 'in-range');

      const curX = parseFloat(piece.getAttribute('data-current-x')) || 0;
      const curY = parseFloat(piece.getAttribute('data-current-y')) || 0;
      const dist = Math.hypot(curX, curY);

      activePiece = null;
      activeSlot = null;

      if (!hasMoved) {
        if (piece.getAttribute('data-placed') !== 'true') {
          if (slot) {
            slot.classList.add('highlight-target');
            setTimeout(() => slot.classList.remove('highlight-target'), 1500);
          }
          showToast('💡 Nhấn giữ và kéo mảnh ghép này lên ô viền trong trái tim nhé! 💖');
          playChime(587.33, 'triangle', 0.25);
        } else {
          const compliment = piece.getAttribute('data-compliment');
          handlePieceClick(piece, compliment);
        }
        return;
      }

      if (dist < 55) {
        snapPieceToSlot(piece, true);
      } else {
        const tX = parseFloat(piece.getAttribute('data-tray-x')) || 0;
        const tY = parseFloat(piece.getAttribute('data-tray-y')) || 0;
        piece.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
        piece.setAttribute('transform', `translate(${tX.toFixed(1)}, ${tY.toFixed(1)})`);
        piece.setAttribute('data-current-x', tX);
        piece.setAttribute('data-current-y', tY);
        piece.setAttribute('data-placed', 'false');
        setTimeout(() => {
          piece.style.removeProperty('transition');
        }, 320);
        playChime(349.23, 'sine', 0.15);
        updatePuzzleProgress();
      }
    };

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

        const pIdx = pieceIndex;
        const complimentText = compliments[pIdx % compliments.length];

        // 1. Build Target Guide Slot (Dashed Frame Outline in Heart)
        if (puzzleSlotsGroup) {
          const slot = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          slot.setAttribute('d', d);
          slot.setAttribute('class', 'puzzle-slot');
          slot.setAttribute('id', `puzzle-slot-${pIdx}`);
          puzzleSlotsGroup.appendChild(slot);
        }

        // Calculate piece center in heart vs target spot in piece tray
        const pieceCenterX = (x0 + x1) / 2;
        const pieceCenterY = (y0 + y1) / 2;

        const trayCol = pIdx % trayCols;
        const trayRow = Math.floor(pIdx / trayCols);
        const traySpotX = trayX + trayCol * trayCellW + trayCellW / 2;
        const traySpotY = trayY + trayRow * trayCellH + trayCellH / 2;

        const trayDx = traySpotX - pieceCenterX;
        const trayDy = traySpotY - pieceCenterY;

        // 2. Build Draggable Puzzle Piece
        const piece = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        piece.setAttribute('d', d);
        piece.setAttribute('class', 'puzzle-piece placed-success');
        piece.setAttribute('fill', 'url(#puzzle-img-pattern)');
        piece.setAttribute('stroke', '#f6d365');
        piece.setAttribute('stroke-width', '1.2');
        piece.setAttribute('data-id', pIdx);
        piece.setAttribute('data-row', r);
        piece.setAttribute('data-col', c);
        piece.setAttribute('data-compliment', complimentText);
        piece.setAttribute('data-current-x', '0');
        piece.setAttribute('data-current-y', '0');
        piece.setAttribute('data-tray-x', trayDx.toFixed(1));
        piece.setAttribute('data-tray-y', trayDy.toFixed(1));
        piece.setAttribute('data-placed', 'true');

        piece.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 && e.pointerType === 'mouse') return;
          if (e.cancelable) e.preventDefault();

          activePiece = piece;
          activeSlot = document.getElementById(`puzzle-slot-${pIdx}`);
          isDragging = true;
          hasMoved = false;

          piece.style.transition = 'none';

          try {
            const ctm = puzzleSvg.getScreenCTM();
            invCTM = ctm ? ctm.inverse() : null;
          } catch (_) {
            invCTM = null;
          }

          const pt = puzzleSvg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const svgPt = invCTM ? pt.matrixTransform(invCTM) : pt;

          startPtrX = svgPt.x;
          startPtrY = svgPt.y;
          curClientX = e.clientX;
          curClientY = e.clientY;
          startPieceX = parseFloat(piece.getAttribute('data-current-x')) || 0;
          startPieceY = parseFloat(piece.getAttribute('data-current-y')) || 0;

          puzzleGroup.appendChild(piece);
          piece.classList.add('is-dragging');

          if (activeSlot) activeSlot.classList.add('highlight-target');

          document.body.classList.add('puzzle-dragging-active');
          window.addEventListener('pointermove', onGlobalPointerMove, { passive: false });
          window.addEventListener('pointerup', onGlobalPointerEnd);
          window.addEventListener('pointercancel', onGlobalPointerEnd);
          window.addEventListener('touchmove', onGlobalTouchMove, { passive: false });
        });

        puzzleGroup.appendChild(piece);
        pieceIndex++;
      }
    }

    updatePuzzleProgress();
  }

  function snapPieceToSlot(piece, triggerFx = true) {
    if (!piece) return;
    piece.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    piece.setAttribute('transform', 'translate(0, 0)');
    piece.setAttribute('data-current-x', '0');
    piece.setAttribute('data-current-y', '0');
    piece.setAttribute('data-placed', 'true');
    piece.classList.add('placed-success');

    setTimeout(() => {
      piece.style.removeProperty('transition');
    }, 350);

    if (triggerFx) {
      const pIdx = parseInt(piece.getAttribute('data-id'), 10) || 0;
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      playChime(notes[pIdx % notes.length], 'sine', 0.28);

      const compliment = piece.getAttribute('data-compliment');
      if (compliment) {
        handlePieceClick(piece, compliment);
      }
      checkPuzzleCompletion();
    }
  }

  function updatePuzzleProgress() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const total = pieces.length;
    let placed = 0;
    pieces.forEach(p => {
      if (p.getAttribute('data-placed') === 'true') placed++;
    });

    if (puzzleProgressText) {
      if (placed === total) {
        puzzleProgressText.textContent = `💖 Hoàn thành 100%! Trái tim vẹn tròn (${total}/${total} mảnh)`;
      } else {
        puzzleProgressText.textContent = `🧩 Đã ghép: ${placed} / ${total} mảnh (Giữ và kéo từ khay lên khung)`;
      }
    }
  }

  function checkPuzzleCompletion() {
    updatePuzzleProgress();
    const pieces = document.querySelectorAll('.puzzle-piece');
    const total = pieces.length;
    let placed = 0;
    pieces.forEach(p => {
      if (p.getAttribute('data-placed') === 'true') placed++;
    });

    if (placed === total && total > 0) {
      state.isScattered = false;
      playMagicalArpeggio();
      triggerFireworksEffect();
      showToast('🎉 Tuyệt vời! Bạn đã ghép thành công bức tranh trái tim 20/10 yêu thương! 💖');
      if (btnReorderPuzzle) {
        btnReorderPuzzle.textContent = 'Xáo Trộn Lại';
      }
    }
  }

  function scatterPuzzlePieces() {
    state.isScattered = true;
    const pieces = document.querySelectorAll('.puzzle-piece');

    pieces.forEach((piece) => {
      const tX = parseFloat(piece.getAttribute('data-tray-x')) || 0;
      const tY = parseFloat(piece.getAttribute('data-tray-y')) || 0;

      piece.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2)';
      piece.setAttribute('transform', `translate(${tX.toFixed(1)}, ${tY.toFixed(1)})`);
      piece.setAttribute('data-current-x', tX);
      piece.setAttribute('data-current-y', tY);
      piece.setAttribute('data-placed', 'false');

      setTimeout(() => {
        piece.style.removeProperty('transition');
      }, 550);
    });

    playChime(392, 'sawtooth', 0.25);
    showToast('Đã xáo trộn vào khay! Hãy giữ và kéo từng mảnh lên ô khung mẫu 💖');
    updatePuzzleProgress();

    if (btnReorderPuzzle) {
      btnReorderPuzzle.textContent = 'Xáo Trộn Lại';
    }
  }

  function autoSolvePuzzle() {
    state.isScattered = false;
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach((piece, idx) => {
      setTimeout(() => {
        snapPieceToSlot(piece, idx === pieces.length - 1);
      }, idx * 35);
    });
    playMagicalArpeggio();
    showToast('Đang tự động xếp các mảnh ghép từ khay vào khung mẫu... ✨');
  }

  function togglePuzzleScatter() {
    if (state.isScattered) {
      autoSolvePuzzle();
    } else {
      scatterPuzzlePieces();
    }
  }

  function handlePieceClick(path, complimentText) {
    playChime(587.33, 'triangle', 0.35);
    path.classList.add('pulse-piece');
    setTimeout(() => path.classList.remove('pulse-piece'), 600);

    if (bubbleText) bubbleText.textContent = complimentText;
    if (bubbleTooltip) {
      bubbleTooltip.classList.add('visible');
      setTimeout(() => bubbleTooltip.classList.remove('visible'), 3600);
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
  // 9. HYBRID AUDIO ENGINE & PLAYLIST MANAGER (HTML5 + YouTube API)
  // ============================================================
  let ytPlayer = null;
  let isYtReady = false;
  let pendingYtTrack = null;

  function updatePlayerBarUI() {
    const curTrack = state.playlist[state.currentTrackIndex] || state.playlist[0];
    if (musicTitle && curTrack) {
      musicTitle.textContent = `${curTrack.title} - ${curTrack.artist}`;
    }
    if (lyricsText && curTrack) {
      if (curTrack.id !== 'local-tiktok') {
        lyricsText.textContent = `Giai điệu: ${curTrack.title} - ${curTrack.artist} 💖`;
      } else {
        const curTime = bgAudio ? bgAudio.currentTime : 0;
        const currentItem = lyricsTimeline.find(item => curTime >= item.start && curTime < item.end) || lyricsTimeline[0];
        lyricsText.textContent = currentItem.text;
      }
    }
    if (musicStatus) {
      musicStatus.textContent = state.isPlayingMusic ? 'Đang phát nhạc' : 'Nhạc tạm dừng';
    }
    if (iconPlay && iconPause) {
      iconPlay.style.display = state.isPlayingMusic ? 'none' : 'block';
      iconPause.style.display = state.isPlayingMusic ? 'block' : 'none';
    }
    if (musicDisc) {
      musicDisc.classList.toggle('playing', state.isPlayingMusic);
    }
  }

  function setPlayerUIPlaying(isPlaying) {
    state.isPlayingMusic = isPlaying;
    updatePlayerBarUI();
    renderPlaylist();
  }

  // YouTube IFrame API Callback
  window.onYouTubeIframeAPIReady = function() {
    try {
      ytPlayer = new YT.Player('yt-player-host', {
        height: '100%',
        width: '100%',
        videoId: 'QxXYWMIQAcQ',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            isYtReady = true;
            if (pendingYtTrack) {
              const trk = pendingYtTrack;
              pendingYtTrack = null;
              playYouTubeTrack(trk);
            }
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setPlayerUIPlaying(true);
            } else if (event.data === YT.PlayerState.PAUSED) {
              setPlayerUIPlaying(false);
            } else if (event.data === YT.PlayerState.ENDED) {
              handleTrackEnded();
            }
          },
          onError: (err) => {
            console.warn('YouTube playback error:', err);
            const cur = state.playlist[state.currentTrackIndex];
            if (cur && cur.type === 'youtube') {
              showToast('Video YouTube không khả dụng, chuyển sang bài tiếp theo 🎶');
              setTimeout(() => playNextTrack(), 1000);
            }
          }
        }
      });
    } catch (e) {
      console.warn('YT initialization error:', e);
    }
  };

  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
  }

  function playYouTubeTrack(track) {
    initAudioContext();
    if (bgAudio && !bgAudio.paused) {
      bgAudio.pause();
    }
    if (!isYtReady || !ytPlayer) {
      pendingYtTrack = track;
      return;
    }
    try {
      ytPlayer.loadVideoById(track.ytId);
      ytPlayer.playVideo();
      setPlayerUIPlaying(true);
      showToast(`Đang phát: "${track.title}" 🎶`);
    } catch (err) {
      console.warn('Error playing YouTube track:', err);
    }
  }

  function playLocalTrack(track) {
    initAudioContext();
    if (isYtReady && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      try { ytPlayer.pauseVideo(); } catch (_) {}
    }
    if (bgAudio) {
      bgAudio.volume = 0.25;
      const targetSrc = track.src;
      const currentSrc = bgAudio.getAttribute('src') || bgAudio.src || '';
      if (!currentSrc.includes(targetSrc)) {
        bgAudio.src = targetSrc;
        bgAudio.currentTime = 0;
        bgAudio.load();
      }
      bgAudio.play().then(() => {
        setPlayerUIPlaying(true);
        showToast(`Đang phát: "${track.title}" 🎶`);
      }).catch(err => {
        console.warn('Audio play restricted:', err);
        showToast('Vui lòng chạm màn hình để phát nhạc!');
      });
    }
  }

  function playTrack(index, autoPlay = true) {
    if (index < 0 || index >= state.playlist.length) return;
    state.currentTrackIndex = index;
    localStorage.setItem('womenDay_trackIndex', index);

    const track = state.playlist[index];
    updatePlayerBarUI();
    renderPlaylist();

    if (!autoPlay) return;

    if (track.type === 'local') {
      playLocalTrack(track);
    } else if (track.type === 'youtube') {
      playYouTubeTrack(track);
    }
  }

  function togglePlayPause() {
    initAudioContext();
    const curTrack = state.playlist[state.currentTrackIndex] || state.playlist[0];

    if (state.isPlayingMusic) {
      // Pause active source
      if (curTrack.type === 'local' && bgAudio) {
        bgAudio.pause();
      } else if (curTrack.type === 'youtube' && isYtReady && ytPlayer) {
        try { ytPlayer.pauseVideo(); } catch (_) {}
      }
      setPlayerUIPlaying(false);
      showToast('Đã tạm dừng bài hát');
    } else {
      // Resume active source
      if (curTrack.type === 'local' && bgAudio) {
        const targetSrc = curTrack.src;
        const currentSrc = bgAudio.getAttribute('src') || bgAudio.src || '';
        if (targetSrc && !currentSrc.includes(targetSrc)) {
          bgAudio.src = targetSrc;
          bgAudio.currentTime = 0;
          bgAudio.load();
        }
        bgAudio.play().then(() => {
          setPlayerUIPlaying(true);
          showToast(`Đang phát: "${curTrack.title}" 🎶`);
        }).catch(err => {
          console.warn('Playback error:', err);
        });
      } else if (curTrack.type === 'youtube') {
        if (isYtReady && ytPlayer) {
          try {
            ytPlayer.playVideo();
            setPlayerUIPlaying(true);
            showToast(`Đang phát: "${curTrack.title}" 🎶`);
          } catch (_) {
            playYouTubeTrack(curTrack);
          }
        } else {
          playYouTubeTrack(curTrack);
        }
      }
    }
  }

  function toggleMusic() {
    togglePlayPause();
  }

  function playNextTrack() {
    if (state.playlist.length === 0) return;
    let nextIdx = 0;
    if (state.shuffle && state.playlist.length > 1) {
      do {
        nextIdx = Math.floor(Math.random() * state.playlist.length);
      } while (nextIdx === state.currentTrackIndex);
    } else {
      nextIdx = (state.currentTrackIndex + 1) % state.playlist.length;
    }
    playTrack(nextIdx, true);
  }

  function playPrevTrack() {
    if (state.playlist.length === 0) return;
    let prevIdx = 0;
    if (state.shuffle && state.playlist.length > 1) {
      do {
        prevIdx = Math.floor(Math.random() * state.playlist.length);
      } while (prevIdx === state.currentTrackIndex);
    } else {
      prevIdx = (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
    }
    playTrack(prevIdx, true);
  }

  function handleTrackEnded() {
    if (state.repeatMode === 'one') {
      const curTrack = state.playlist[state.currentTrackIndex];
      if (curTrack.type === 'local' && bgAudio) {
        bgAudio.currentTime = 0;
        bgAudio.play().catch(() => {});
      } else if (curTrack.type === 'youtube' && isYtReady && ytPlayer) {
        ytPlayer.seekTo(0);
        ytPlayer.playVideo();
      }
    } else if (state.autoPlayNext) {
      playNextTrack();
    } else {
      setPlayerUIPlaying(false);
    }
  }

  if (bgAudio) {
    bgAudio.addEventListener('ended', handleTrackEnded);
  }

  function extractYouTubeId(url) {
    if (!url) return null;
    url = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return longMatch[1];
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    return null;
  }

  function renderPlaylist() {
    if (!musicPlaylistList) return;
    musicPlaylistList.innerHTML = '';

    state.playlist.forEach((track, idx) => {
      const item = document.createElement('div');
      const isActive = idx === state.currentTrackIndex;
      item.className = `playlist-track-item ${isActive ? 'active' : ''} ${isActive && state.isPlayingMusic ? 'playing' : ''}`;
      item.setAttribute('role', 'listitem');
      item.setAttribute('data-index', idx);

      item.innerHTML = `
        <img src="${track.thumbnail}" alt="${track.title}" class="track-thumb" loading="lazy">
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        <div class="track-wave" aria-hidden="true">
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
          <span class="wave-bar"></span>
        </div>
        <span class="track-badge">${track.tag || (track.type === 'youtube' ? 'YouTube' : 'Gốc')}</span>
      `;

      item.addEventListener('click', () => {
        if (idx === state.currentTrackIndex) {
          togglePlayPause();
        } else {
          playTrack(idx, true);
        }
      });

      musicPlaylistList.appendChild(item);
    });
  }

  function openMusicDialog() {
    if (musicDialog) {
      renderPlaylist();
      if (chkAutoplayNext) chkAutoplayNext.checked = state.autoPlayNext;
      if (repeatModeText) {
        repeatModeText.textContent = state.repeatMode === 'one' ? 'Lặp 1 bài' : 'Lặp toàn bộ';
      }
      if (shuffleModeText) {
        shuffleModeText.textContent = state.shuffle ? 'Xáo trộn: Bật' : 'Xáo trộn: Tắt';
      }
      musicDialog.showModal();
    }
  }

  function closeMusicDialog() {
    if (musicDialog) musicDialog.close();
  }

  // Playlist Form Submission (Add Custom YouTube Song)
  if (customMusicForm) {
    customMusicForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = customMusicUrl ? customMusicUrl.value.trim() : '';
      const ytId = extractYouTubeId(val);

      if (!ytId) {
        showToast('Link YouTube không hợp lệ, vui lòng kiểm tra lại!');
        return;
      }

      const newTrack = {
        id: ytId,
        title: `Giai điệu tặng em (${ytId.substring(0, 6)}...)`,
        artist: 'Nhạc tuyển chọn',
        type: 'youtube',
        ytId: ytId,
        thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        tag: 'Tự Thêm'
      };

      state.playlist.push(newTrack);

      // Save custom tracks to localStorage
      const customTracks = state.playlist.filter(t => t.tag === 'Tự Thêm');
      localStorage.setItem('womenDay_customPlaylist', JSON.stringify(customTracks));

      if (customMusicUrl) customMusicUrl.value = '';
      showToast('Đã thêm bài hát vào danh sách phát! Đang phát ngay 💖');

      renderPlaylist();
      playTrack(state.playlist.length - 1, true);

      // Fetch title in background via noembed API
      fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.title) {
            newTrack.title = data.title;
            if (data.author_name) newTrack.artist = data.author_name;
            localStorage.setItem('womenDay_customPlaylist', JSON.stringify(state.playlist.filter(t => t.tag === 'Tự Thêm')));
            renderPlaylist();
            updatePlayerBarUI();
          }
        })
        .catch(() => {});
    });
  }

  // Autoplay next toggle
  if (chkAutoplayNext) {
    chkAutoplayNext.addEventListener('change', () => {
      state.autoPlayNext = chkAutoplayNext.checked;
      localStorage.setItem('womenDay_autoPlayNext', state.autoPlayNext);
      showToast(state.autoPlayNext ? 'Đã bật: Tự động chuyển bài khi kết thúc' : 'Đã tắt: Tự động chuyển bài');
    });
  }

  // Repeat mode toggle
  if (btnToggleRepeat) {
    btnToggleRepeat.addEventListener('click', () => {
      state.repeatMode = state.repeatMode === 'all' ? 'one' : 'all';
      localStorage.setItem('womenDay_repeatMode', state.repeatMode);
      if (repeatModeText) {
        repeatModeText.textContent = state.repeatMode === 'one' ? 'Lặp 1 bài' : 'Lặp toàn bộ';
      }
      btnToggleRepeat.classList.toggle('active', state.repeatMode === 'one');
      showToast(state.repeatMode === 'one' ? 'Chế độ: Lặp lại 1 bài hát' : 'Chế độ: Lặp lại toàn bộ danh sách');
    });
  }

  // Shuffle mode toggle
  if (btnToggleShuffle) {
    btnToggleShuffle.addEventListener('click', () => {
      state.shuffle = !state.shuffle;
      localStorage.setItem('womenDay_shuffle', state.shuffle);
      if (shuffleModeText) {
        shuffleModeText.textContent = state.shuffle ? 'Xáo trộn: Bật' : 'Xáo trộn: Tắt';
      }
      btnToggleShuffle.classList.toggle('active', state.shuffle);
      showToast(state.shuffle ? 'Đã bật phát nhạc xáo trộn ngẫu nhiên' : 'Đã tắt phát nhạc ngẫu nhiên');
    });
  }

  // Wiring Player Buttons
  if (musicBtn) musicBtn.addEventListener('click', togglePlayPause);
  if (btnPlayPauseTrack) btnPlayPauseTrack.addEventListener('click', togglePlayPause);
  if (btnPrevTrack) btnPrevTrack.addEventListener('click', playPrevTrack);
  if (btnNextTrack) btnNextTrack.addEventListener('click', playNextTrack);
  if (btnOpenPlaylist) btnOpenPlaylist.addEventListener('click', openMusicDialog);
  if (playerMetaBtn) playerMetaBtn.addEventListener('click', openMusicDialog);
  if (btnMusicPlaylistTop) btnMusicPlaylistTop.addEventListener('click', openMusicDialog);
  if (btnCloseMusicDialog) btnCloseMusicDialog.addEventListener('click', closeMusicDialog);

  function attemptAutoPlay() {
    if (state.audioUnlocked) return;
    state.audioUnlocked = true;
    initAudioContext();
    if (!state.isPlayingMusic) {
      playTrack(state.currentTrackIndex, true);
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
      ambCtx.fill();
    }
    requestAnimationFrame(drawAmbient);
  }

  const petalsCanvas = document.getElementById('petals-canvas');
  const petalsCtx = petalsCanvas ? petalsCanvas.getContext('2d') : null;
  let petals = [];

  function createPetal(randomY = false) {
    const shades = [
      { highlight: '#ff758f', body: '#c9184a', base: '#590d22', rim: 'rgba(255, 205, 225, 0.55)' },
      { highlight: '#ff4d6d', body: '#a4133c', base: '#49111c', rim: 'rgba(255, 190, 210, 0.5)' },
      { highlight: '#ff8fa3', body: '#d90429', base: '#540b1e', rim: 'rgba(255, 220, 235, 0.55)' },
      { highlight: '#e63946', body: '#8b0000', base: '#3d0000', rim: 'rgba(255, 180, 200, 0.45)' }
    ];
    return {
      x: Math.random() * (petalsCanvas ? petalsCanvas.width : 500),
      y: randomY ? Math.random() * (petalsCanvas ? petalsCanvas.height : 500) : -40,
      size: Math.random() * 12 + 16,
      speedY: Math.random() * 1.1 + 0.75,
      speedX: Math.random() * 0.8 - 0.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.022,
      tilt: Math.random() * Math.PI * 2,
      tiltSpeed: Math.random() * 0.03 + 0.012,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.025 + 0.01,
      shade: shades[Math.floor(Math.random() * shades.length)]
    };
  }

  function resizePetalsCanvas() {
    if (!petalsCanvas) return;
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;
    petals = [];
    const count = window.innerWidth > 768 ? 26 : 15;
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
      p.tilt += p.tiltSpeed;
      p.x += Math.sin(p.swing) * 0.75 + p.speedX;
      p.rot += p.rotSpeed;

      if (p.y > petalsCanvas.height + 45) {
        Object.assign(p, createPetal(false));
      }

      petalsCtx.save();
      petalsCtx.translate(p.x, p.y);
      petalsCtx.rotate(p.rot);

      // 3D tumbling flip effect
      const cosTilt = Math.cos(p.tilt);
      petalsCtx.scale(1, Math.abs(cosTilt) < 0.12 ? 0.12 : cosTilt);

      const w = p.size * 0.72;
      const h = p.size;

      // Realistic organic curved rose petal with tapered base and soft indented top lobe
      petalsCtx.beginPath();
      petalsCtx.moveTo(0, h * 0.45);
      petalsCtx.bezierCurveTo(-w * 0.65, h * 0.3, -w * 0.78, -h * 0.1, -w * 0.55, -h * 0.38);
      petalsCtx.bezierCurveTo(-w * 0.38, -h * 0.58, -w * 0.1, -h * 0.52, 0, -h * 0.42);
      petalsCtx.bezierCurveTo(w * 0.1, -h * 0.52, w * 0.38, -h * 0.58, w * 0.55, -h * 0.38);
      petalsCtx.bezierCurveTo(w * 0.78, -h * 0.1, w * 0.65, h * 0.3, 0, h * 0.45);
      petalsCtx.closePath();

      // Rich velvet gradient
      const grad = petalsCtx.createRadialGradient(-w * 0.15, -h * 0.2, p.size * 0.08, 0, 0, p.size * 0.85);
      grad.addColorStop(0, p.shade.highlight);
      grad.addColorStop(0.35, p.shade.body);
      grad.addColorStop(1, p.shade.base);

      petalsCtx.fillStyle = grad;
      petalsCtx.fill();

      // Delicate translucent curled edge rim
      petalsCtx.lineWidth = 0.8;
      petalsCtx.strokeStyle = p.shade.rim;
      petalsCtx.stroke();

      // Subtle central vein
      petalsCtx.beginPath();
      petalsCtx.moveTo(0, h * 0.35);
      petalsCtx.quadraticCurveTo(w * 0.05, 0, 0, -h * 0.28);
      petalsCtx.strokeStyle = 'rgba(255, 230, 240, 0.2)';
      petalsCtx.lineWidth = 0.75;
      petalsCtx.stroke();

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
  if (btnAutoSolvePuzzle) btnAutoSolvePuzzle.addEventListener('click', autoSolvePuzzle);
  if (btnChangePhoto) btnChangePhoto.addEventListener('click', openPhotoDialog);
  if (btnCustomNames) btnCustomNames.addEventListener('click', openNamesDialog);
  if (btnShareLink) btnShareLink.addEventListener('click', copyShareLink);
  if (btnMainCelebrate) btnMainCelebrate.addEventListener('click', openWishesDialog);

  let isSpecialDayRevealed = false;
  function revealSpecialDayMessage() {
    isSpecialDayRevealed = true;
    if (specialDayTag) {
      specialDayTag.classList.remove('mystery-hidden');
      specialDayTag.classList.add('revealed');
      specialDayTag.textContent = 'NGÀY ĐẶC BIỆT CHO CHỊ EM PHỤ NỮ';
      specialDayTag.title = '20/10 - Ngày Phụ Nữ Việt Nam';
    }
    if (specialDay20) {
      specialDay20.classList.remove('celebrating');
      void specialDay20.offsetWidth;
      specialDay20.classList.add('celebrating');
    }
    triggerFireworksEffect();
    playMagicalArpeggio();
    showToast('✨ Ngày Đặc Biệt Cho Chị Em Phụ Nữ 20/10 ✨');
  }

  if (specialDay20) {
    specialDay20.addEventListener('click', (e) => {
      e.preventDefault();
      revealSpecialDayMessage();
    });
    specialDay20.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        revealSpecialDayMessage();
      }
    });
  }

  if (specialDayTag) {
    specialDayTag.addEventListener('click', (e) => {
      e.preventDefault();
      revealSpecialDayMessage();
    });
    specialDayTag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        revealSpecialDayMessage();
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
  // 14. IMMERSIVE LOADING SCREEN (PRELOADER CONTROLLER)
  // ============================================================
  const preloaderOverlay = document.getElementById('preloader-overlay');
  const preloaderProgress = document.getElementById('preloader-progress');
  const liquidProgressFill = document.getElementById('liquid-progress-fill');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderStatus = document.getElementById('preloader-status-text');
  const btnEnterStory = document.getElementById('btn-enter-story');

  const assetsToPreload = [
    'assets/music.mp3',
    'assets/photo-couple.jpg',
    'assets/photo-girl.jpg',
    'assets/photo-mother.jpg',
    'assets/photo-flowers.jpg',
    'assets/mem-1.jpg',
    'assets/mem-2.jpg',
    'assets/mem-3.jpg',
    'assets/mem-4.jpg',
    'assets/mem-5.jpg',
    'assets/mem-6.jpg',
    'assets/mem-7.jpg',
    'assets/mem-8.jpg'
  ];

  let loadedCount = 0;
  const totalAssets = assetsToPreload.length;
  let targetProgress = 15;
  let currentDisplayProgress = 0;
  let isPreloaderComplete = false;

  function onAssetLoaded() {
    loadedCount++;
    targetProgress = Math.max(targetProgress, Math.min(100, Math.round((loadedCount / totalAssets) * 100)));
  }

  assetsToPreload.forEach(src => {
    if (src.endsWith('.mp3')) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', onAssetLoaded, { once: true });
      audio.addEventListener('error', onAssetLoaded, { once: true });
      audio.src = src;
      setTimeout(onAssetLoaded, 2000);
    } else {
      const img = new Image();
      img.onload = onAssetLoaded;
      img.onerror = onAssetLoaded;
      img.src = src;
    }
  });

  const progressTimer = setInterval(() => {
    if (currentDisplayProgress < targetProgress) {
      currentDisplayProgress++;
      if (preloaderProgress) preloaderProgress.value = currentDisplayProgress;
      if (liquidProgressFill) liquidProgressFill.style.width = `${currentDisplayProgress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${currentDisplayProgress}%`;

      if (currentDisplayProgress >= 35 && currentDisplayProgress < 75) {
        if (preloaderStatus) preloaderStatus.textContent = 'Đang kết nối những giai điệu và đóa hoa... 🌸';
      } else if (currentDisplayProgress >= 75 && currentDisplayProgress < 100) {
        if (preloaderStatus) preloaderStatus.textContent = 'Món quà 20/10 sắp hé mở... ✨';
      }
    }

    if (currentDisplayProgress >= 100 && !isPreloaderComplete) {
      isPreloaderComplete = true;
      clearInterval(progressTimer);
      if (preloaderProgress) preloaderProgress.value = 100;
      if (liquidProgressFill) liquidProgressFill.style.width = '100%';
      if (preloaderPercent) preloaderPercent.textContent = '100%';
      if (preloaderStatus) preloaderStatus.textContent = 'Món quà 20/10 đã sẵn sàng! 🎁';
      if (btnEnterStory) {
        btnEnterStory.style.display = 'inline-flex';
        btnEnterStory.focus();
      }
      if (preloaderOverlay) {
        preloaderOverlay.style.cursor = 'pointer';
        preloaderOverlay.addEventListener('click', enterExperience);
      }
    }
  }, 22);

  setTimeout(() => {
    targetProgress = 100;
  }, 2000);

  function enterExperience() {
    if (!preloaderOverlay || preloaderOverlay.classList.contains('fade-out')) return;
    preloaderOverlay.classList.add('fade-out');
    document.body.classList.remove('loading-state');

    initAudioContext();
    resetBloomState();
    resetNavTabsHideLayers();
    switchScene('bloom', false);
    playTrack(state.currentTrackIndex, true);
    playMagicalArpeggio();

    setTimeout(() => {
      preloaderOverlay.style.display = 'none';
    }, 850);
  }

  if (btnEnterStory) {
    btnEnterStory.addEventListener('click', (e) => {
      e.stopPropagation();
      enterExperience();
    });
  }

  // ============================================================
  // 15. INITIALIZATION
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

  updatePlayerBarUI();
  renderPlaylist();

  // Initial Scene
  switchScene('bloom', false);
});
