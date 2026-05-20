/* ============================================================
   THREE.JS 3D SCENES — Realistic Cake & 3D Gift Box
   ============================================================ */

// ════════════════════════════════════════════════════════════
//  REALISTIC 3D CAKE WITH THREE.JS
// ════════════════════════════════════════════════════════════
(function () {
  function initCake3D() {
    const canvas = document.getElementById('cakeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = canvas.clientWidth || 420;
    const H = canvas.clientHeight || 380;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = null; // transparent

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 3.5, 7);
    camera.lookAt(0, 0.5, 0);

    // ─── Lighting ─────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.4);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xff9ebc, 0.8, 20);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc084fc, 0.6, 15);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // ─── Materials ────────────────────────────────────────
    function matPhong(color, specColor, shininess) {
      return new THREE.MeshPhongMaterial({ color, specular: specColor, shininess });
    }

    // Plate
    const plateMat = matPhong(0xf8f0e8, 0xffffff, 80);
    const plateGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.12, 48);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -1.38;
    plate.receiveShadow = true;
    scene.add(plate);

    // Bottom layer — chocolate sponge
    const botMat = new THREE.MeshPhongMaterial({
      color: 0x8B3A0F, specular: 0x441800, shininess: 30
    });
    const botGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.75, 48);
    const bot = new THREE.Mesh(botGeo, botMat);
    bot.position.y = -0.88;
    bot.castShadow = true;
    bot.receiveShadow = true;
    scene.add(bot);

    // Bottom frosting band
    const frostBotMat = matPhong(0xFFF8F0, 0xffffff, 60);
    const frostBotGeo = new THREE.CylinderGeometry(1.87, 1.87, 0.18, 48);
    const frostBot = new THREE.Mesh(frostBotGeo, frostBotMat);
    frostBot.position.y = -0.52;
    scene.add(frostBot);

    // Mid layer — vanilla
    const midMat = matPhong(0xF5DEB3, 0xffddaa, 40);
    const midGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.65, 48);
    const mid = new THREE.Mesh(midGeo, midMat);
    mid.position.y = -0.06;
    mid.castShadow = true;
    scene.add(mid);

    // Mid frosting band
    const frostMidMat = matPhong(0xFF9EBC, 0xff4d8d, 80);
    const frostMidGeo = new THREE.CylinderGeometry(1.62, 1.62, 0.16, 48);
    const frostMid = new THREE.Mesh(frostMidGeo, frostMidMat);
    frostMid.position.y = 0.27;
    scene.add(frostMid);

    // Top layer — pink strawberry
    const topMat = matPhong(0xFF6B9D, 0xff4d8d, 60);
    const topGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.55, 48);
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.66;
    top.castShadow = true;
    scene.add(top);

    // Top frosting (drip effect — slightly oversized flat top)
    const topFrostMat = matPhong(0xFFF0FA, 0xffffff, 90);
    const topFrostGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 48);
    const topFrost = new THREE.Mesh(topFrostGeo, topFrostMat);
    topFrost.position.y = 0.96;
    scene.add(topFrost);

    // Frosting drips (torus segments around top layer)
    const dripMat = matPhong(0xFFF0FA, 0xffffff, 100);
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const dripGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.scale.y = 1.8 + Math.random() * 0.8;
      drip.position.set(
        Math.cos(angle) * 1.28,
        0.68 + Math.random() * 0.1,
        Math.sin(angle) * 1.28
      );
      scene.add(drip);
    }

    // Decorative sprinkles on top
    const sprinkleColors = [0xFF4D8D, 0xFFD700, 0x00E5FF, 0xc084fc, 0x39FF14, 0xFF8C00];
    for (let i = 0; i < 30; i++) {
      const r = Math.random() * 1.1;
      const a = Math.random() * Math.PI * 2;
      const sGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.22, 6);
      const sMat = matPhong(sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)], 0xffffff, 80);
      const sp = new THREE.Mesh(sGeo, sMat);
      sp.position.set(Math.cos(a) * r, 1.01, Math.sin(a) * r);
      sp.rotation.z = Math.random() * Math.PI;
      sp.rotation.x = Math.random() * Math.PI;
      scene.add(sp);
    }

    // ─── Candles ──────────────────────────────────────────
    const candleColors = [0xFF4D8D, 0xFFD700, 0x00E5FF, 0xc084fc, 0x39FF14, 0xFF8C00];
    window._cakeCandles3D = [];
    window._candlesOutFlags = [];
    const totalC = window._cakeCandleCount || 5;

    const candlePositions = [];
    for (let i = 0; i < totalC; i++) {
      const angle = (i / totalC) * Math.PI * 2;
      const r = totalC === 1 ? 0 : 0.7;
      candlePositions.push([Math.cos(angle) * r, Math.sin(angle) * r]);
    }

    candlePositions.forEach((pos, i) => {
      const col = candleColors[i % candleColors.length];
      const cMat = matPhong(col, 0xffffff, 50);
      const cGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.55, 12);
      const cand = new THREE.Mesh(cGeo, cMat);
      cand.position.set(pos[0], 1.28, pos[1]);
      cand.castShadow = true;
      scene.add(cand);

      // Flame (small emissive teardrop)
      const flameGroup = new THREE.Group();
      flameGroup.position.set(pos[0], 1.6, pos[1]);
      const flameMat = new THREE.MeshPhongMaterial({
        color: 0xFFAA00, emissive: 0xFF6600, emissiveIntensity: 1.2,
        transparent: true, opacity: 0.9
      });
      const flameGeo = new THREE.ConeGeometry(0.065, 0.22, 8);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 0.08;
      flameGroup.add(flame);

      // Flame glow (point light)
      const flameLight = new THREE.PointLight(col, 0.6, 3);
      flameGroup.add(flameLight);

      scene.add(flameGroup);
      window._cakeCandles3D.push({ flameGroup, flameLight, lit: true });
      window._candlesOutFlags.push(false);
    });

    // ─── Click to blow candle ─────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // blow nearest lit candle on click
      const nextLit = window._cakeCandles3D.findIndex(c => c.lit);
      if (nextLit >= 0) {
        blowCandle3D(nextLit);
      }
    });

    // Expose blow function
    window.blowCandle3D = function(i) {
      const c = window._cakeCandles3D[i];
      if (!c || !c.lit) return;
      c.lit = false;
      c.flameGroup.visible = false;
      window._candlesOutFlags[i] = true;

      // Update candlesOut for original logic
      if (typeof candlesOut !== 'undefined') {
        candlesOut++;
        if (candlesOut === totalCandles) {
          setTimeout(() => {
            const msg = document.getElementById('candleMsg');
            if (msg) msg.textContent = `🎉 Wish Made! Happy Birthday ${personName}! 🎂`;
          }, 500);
        }
      }
    };

    // Override original blowCandle to also update 3D
    window._original_blowCandle = window.blowCandle;
    window.blowCandle = function(i) {
      blowCandle3D(i);
    };

    // ─── Animate ──────────────────────────────────────────
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.016;

      // Gentle auto-rotate
      scene.rotation.y = Math.sin(t * 0.3) * 0.15;

      // Flicker flames
      window._cakeCandles3D.forEach((c) => {
        if (!c.lit) return;
        const flicker = 0.9 + Math.sin(t * 12 + Math.random()) * 0.1;
        c.flameGroup.scale.set(flicker, 0.9 + Math.sin(t * 18) * 0.15, flicker);
        c.flameLight.intensity = 0.5 + Math.sin(t * 15) * 0.15;
      });

      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  }

  // Wait for DOM and expose init
  window.initCake3D = initCake3D;
})();


// ════════════════════════════════════════════════════════════
//  REALISTIC 3D GIFT BOX WITH THREE.JS + SHAKE ANIMATION
// ════════════════════════════════════════════════════════════
(function () {
  let giftRenderer, giftScene, giftCamera, giftAnimId;
  let giftLidMesh, giftBodyMesh, giftRibbons = [];
  let giftIsOpen = false;
  let shakeTime = 0;
  let isShaking = true;
  let lidOpenProgress = 0;
  let lidOpening = false;

  function initGift3D() {
    const canvas = document.getElementById('giftCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const W = canvas.clientWidth || 320;
    const H = canvas.clientHeight || 340;

    giftRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    giftRenderer.setSize(W, H);
    giftRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    giftRenderer.shadowMap.enabled = true;

    giftScene = new THREE.Scene();
    giftScene.background = null;

    giftCamera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    giftCamera.position.set(0, 2.5, 7);
    giftCamera.lookAt(0, 0, 0);

    // ─── Lighting ─────────────────────────────────────────
    giftScene.add(new THREE.AmbientLight(0xffeedd, 0.7));

    const key = new THREE.DirectionalLight(0xfff4e0, 1.5);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    giftScene.add(key);

    const fill = new THREE.PointLight(0xff9ebc, 0.9, 20);
    fill.position.set(-5, 3, 3);
    giftScene.add(fill);

    const rim = new THREE.PointLight(0xFFD700, 0.5, 15);
    rim.position.set(0, -2, -5);
    giftScene.add(rim);

    // ─── Gift Box Body ────────────────────────────────────
    function makeMat(color, emissive, shininess) {
      return new THREE.MeshPhongMaterial({ color, emissive, emissiveIntensity: 0.08, shininess });
    }

    // Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 2, 2.4);
    const bodyMat = makeMat(0xCC1155, 0x880022, 80);
    giftBodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    giftBodyMesh.position.y = -0.3;
    giftBodyMesh.castShadow = true;
    giftBodyMesh.receiveShadow = true;
    giftScene.add(giftBodyMesh);

    // Body ribbon vertical
    const ribbonVMat = new THREE.MeshPhongMaterial({ color: 0xFFD700, shininess: 120 });
    const ribbonVGeo = new THREE.BoxGeometry(0.22, 2.02, 2.42);
    const ribbonV = new THREE.Mesh(ribbonVGeo, ribbonVMat);
    ribbonV.position.y = -0.3;
    giftScene.add(ribbonV);
    giftRibbons.push(ribbonV);

    // Body ribbon horizontal
    const ribbonHGeo = new THREE.BoxGeometry(2.42, 2.02, 0.22);
    const ribbonH = new THREE.Mesh(ribbonHGeo, ribbonVMat);
    ribbonH.position.y = -0.3;
    giftScene.add(ribbonH);
    giftRibbons.push(ribbonH);

    // ─── Lid ──────────────────────────────────────────────
    const lidGroup = new THREE.Group();
    lidGroup.position.y = 0.7; // sits on top of body

    const lidGeo = new THREE.BoxGeometry(2.5, 0.45, 2.5);
    const lidMat = makeMat(0xFF2266, 0x990033, 90);
    giftLidMesh = new THREE.Mesh(lidGeo, lidMat);
    giftLidMesh.position.y = 0;
    giftLidMesh.castShadow = true;
    lidGroup.add(giftLidMesh);

    // Lid ribbon
    const lidRibV = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.46, 2.52), ribbonVMat);
    lidGroup.add(lidRibV);
    const lidRibH = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.46, 0.23), ribbonVMat);
    lidGroup.add(lidRibH);

    // Bow (two torus loops + knot)
    const bowMat = new THREE.MeshPhongMaterial({ color: 0xFFD700, shininess: 150 });
    const loopGeo = new THREE.TorusGeometry(0.38, 0.1, 10, 24);
    const loop1 = new THREE.Mesh(loopGeo, bowMat);
    loop1.position.set(-0.38, 0.42, 0);
    loop1.rotation.y = Math.PI / 5;
    lidGroup.add(loop1);

    const loop2 = new THREE.Mesh(loopGeo, bowMat);
    loop2.position.set(0.38, 0.42, 0);
    loop2.rotation.y = -Math.PI / 5;
    lidGroup.add(loop2);

    const knotGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const knot = new THREE.Mesh(knotGeo, bowMat);
    knot.position.y = 0.42;
    lidGroup.add(knot);

    giftScene.add(lidGroup);
    window._giftLidGroup = lidGroup;

    // ─── Shadow plane ─────────────────────────────────────
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.32;
    giftScene.add(shadowPlane);

    // ─── Animate ──────────────────────────────────────────
    let t = 0;
    function animate() {
      giftAnimId = requestAnimationFrame(animate);
      t += 0.016;

      // Slow gentle rotation
      giftScene.rotation.y = t * 0.4;

      if (isShaking && !giftIsOpen) {
        // Shake animation — gets more urgent as time goes on
        const urgency = Math.min(1, t / 6);
        const shakeAmp = 0.06 + urgency * 0.1;
        const shakeFreq = 6 + urgency * 8;
        giftLidMesh.parent.position.y = 0.7 + Math.sin(t * shakeFreq) * shakeAmp;
        giftBodyMesh.rotation.z = Math.sin(t * shakeFreq * 0.7) * 0.04 * urgency;
        giftBodyMesh.rotation.x = Math.sin(t * shakeFreq * 0.9 + 1) * 0.025 * urgency;
      }

      if (lidOpening) {
        lidOpenProgress = Math.min(1, lidOpenProgress + 0.03);
        const eased = 1 - Math.pow(1 - lidOpenProgress, 3);
        window._giftLidGroup.rotation.x = -eased * Math.PI * 0.8;
        window._giftLidGroup.position.y = 0.7 + eased * 2.5;
        window._giftLidGroup.position.z = eased * -2;
        if (lidOpenProgress >= 1) {
          lidOpening = false;
          giftIsOpen = true;
          isShaking = false;
          // Show burst and message (original logic)
          const burst = document.getElementById('giftBurst');
          if (burst) { burst.textContent = '🎉✨🎊💫🌟'; burst.classList.add('show'); }
          setTimeout(() => {
            const m = typeof giftMessages !== 'undefined'
              ? giftMessages[Math.floor(Math.random() * giftMessages.length)]
              : '🎁 Happy Birthday!';
            const msg = document.getElementById('giftMessage');
            if (msg) { msg.textContent = m; msg.classList.add('show'); }
          }, 400);
        }
      }

      giftRenderer.render(giftScene, giftCamera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      giftRenderer.setSize(w, h);
      giftCamera.aspect = w / h;
      giftCamera.updateProjectionMatrix();
    });
  }

  // Override openGift to trigger 3D lid opening
  window.openGift3D = function () {
    if (giftIsOpen || lidOpening) return;
    lidOpening = true;
  };

  window.initGift3D = initGift3D;
})();
