/* =============================================================================
   Kidiverse — nexomalabs.com/kidiverse/

   Everything the page does at runtime. No dependencies, no build step.

   The sky is drawn rather than recorded: the same five gestures the app
   recognises drive the same five world responses here, so the demo cannot drift
   away from the product by being a video someone forgot to re-cut.

   One rule carried over from the app itself: the lightning wash never exceeds
   three flashes a second. In the app that limit lives in world logic because it
   is a photosensitivity constraint, not an animation preference. Same here.
   ========================================================================== */
'use strict';

/**
 * Where the early-access form posts. Empty means "no endpoint yet", and the form
 * falls back to opening a pre-filled message to the address below — which works
 * today, on a static host, with nothing to run server-side.
 */
const EARLY_ACCESS_ENDPOINT = '';
const EARLY_ACCESS_EMAIL = 'hello@nexomalabs.com';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- theme ---------------------------------------------------------------- */
(function theme() {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');
  if (!button || !label) return;

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  function read() {
    try {
      return localStorage.getItem('kidiverse-theme');
    } catch (err) {
      return null;
    }
  }

  function paint(mode) {
    const clear = mode === 'light';
    label.textContent = clear ? 'Clear' : 'Storm';
    button.setAttribute('aria-label', clear ? 'Switch to storm' : 'Switch to clear sky');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', clear ? '#eef3f8' : '#0a1422');
  }

  const stored = read();
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
    paint(stored);
  } else {
    paint(prefersLight ? 'light' : 'dark');
  }

  button.addEventListener('click', () => {
    const current = root.getAttribute('data-theme')
      || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    paint(next);
    try {
      localStorage.setItem('kidiverse-theme', next);
    } catch (err) {
      /* Private windows and blocked site data are fine; the choice just won't persist. */
    }
  });
})();

/* --- nav + reveals -------------------------------------------------------- */
(function chrome() {
  const nav = document.getElementById('nav');
  if (nav) {
    const mark = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
    mark();
    window.addEventListener('scroll', mark, { passive: true });
  }

  const targets = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
  );
  targets.forEach((el) => io.observe(el));
})();

/* --- early access --------------------------------------------------------- */
(function signup() {
  const form = document.getElementById('signup');
  const status = document.getElementById('signup-status');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const field = form.querySelector('input[type="email"]');
    const value = (field.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      status.textContent = 'That address looks incomplete — check it and try again.';
      field.focus();
      return;
    }

    if (EARLY_ACCESS_ENDPOINT) {
      status.textContent = 'Sending…';
      fetch(EARLY_ACCESS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, source: 'kidiverse-site' }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          status.textContent = 'You are on the list. We will write when there is something to play.';
        })
        .catch(() => {
          status.textContent = `That did not go through. Write to ${EARLY_ACCESS_EMAIL} instead.`;
        });
      return;
    }

    const subject = encodeURIComponent('Kidiverse early access');
    const body = encodeURIComponent(`Please add ${value} to the Kidiverse early access list.`);
    window.location.href = `mailto:${EARLY_ACCESS_EMAIL}?subject=${subject}&body=${body}`;
    status.textContent = 'Opening your mail app — send the message and you are on the list.';
  });
})();

/* --- shared canvas helpers ------------------------------------------------ */
function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h, dpr };
}

/** Frame-rate-independent approach, so the eased values behave the same on any display. */
function approach(current, target, rate, dt) {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

function coverDraw(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) * 0.55, dw, dh);
}

/* --- the sky -------------------------------------------------------------- */
/**
 * A world that answers. `storm`, `wind`, `sun` and `spin` are the only values the
 * scene reads — the same shape as the app's world contract, which carries meaning
 * (how stormy, which way the wind blows) and never body coordinates.
 */
function createSky(canvas, options) {
  const ctx = canvas.getContext('2d');
  const settings = Object.assign({ art: null, figure: false, storm: 0.15, wind: 0, sun: 1 }, options);

  const state = { storm: settings.storm, wind: settings.wind, sun: settings.sun, spin: 0, lift: 0 };
  const target = { storm: settings.storm, wind: settings.wind, sun: settings.sun, spin: 0, lift: 0 };

  let art = null;
  if (settings.art) {
    const img = new Image();
    img.decoding = 'async';
    img.src = settings.art;
    img.addEventListener('load', () => {
      art = img;
    });
  }

  const clouds = [];
  for (let i = 0; i < 7; i += 1) {
    clouds.push({
      x: Math.random(),
      y: 0.06 + Math.random() * 0.26,
      s: 0.55 + Math.random() * 0.7,
      drift: 0.004 + Math.random() * 0.01,
    });
  }

  const drops = [];
  for (let i = 0; i < 340; i += 1) {
    drops.push({ x: Math.random(), y: Math.random(), len: 0.02 + Math.random() * 0.05, v: 0.9 + Math.random() * 0.8 });
  }

  /* The photosensitivity limit, in the same place the app keeps it: world logic. */
  const MIN_STRIKE_GAP = 340;
  let lastStrike = -1e6;
  let strikeAt = -1e6;
  let bolt = null;
  let spinPhase = 0;
  let pose = basePose('idle');
  let poseTarget = basePose('idle');

  function strike(now) {
    if (now - lastStrike < MIN_STRIKE_GAP) return false;
    lastStrike = now;
    strikeAt = now;
    bolt = makeBolt();
    return true;
  }

  function makeBolt() {
    const points = [];
    let x = 0.34 + Math.random() * 0.32;
    let y = 0.2;
    points.push([x, y]);
    while (y < 0.78) {
      y += 0.07 + Math.random() * 0.09;
      x += (Math.random() - 0.5) * 0.09;
      points.push([x, y]);
    }
    return points;
  }

  function paint(now, dt) {
    const { w, h } = fitCanvas(canvas);
    const rate = 3.2;
    state.storm = approach(state.storm, target.storm, rate, dt);
    state.wind = approach(state.wind, target.wind, rate, dt);
    state.sun = approach(state.sun, target.sun, rate, dt);
    state.spin = approach(state.spin, target.spin, rate, dt);
    state.lift = approach(state.lift, target.lift, 9, dt);
    for (const key of Object.keys(pose)) {
      pose[key][0] = approach(pose[key][0], poseTarget[key][0], 7, dt);
      pose[key][1] = approach(pose[key][1], poseTarget[key][1], 7, dt);
    }

    ctx.clearRect(0, 0, w, h);

    if (art) {
      coverDraw(ctx, art, w, h);
    } else {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#3d86c4');
      sky.addColorStop(1, '#9ed0e8');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
    }

    /* Storm darkens and cools the whole scene rather than only adding rain. */
    if (state.storm > 0.01) {
      ctx.fillStyle = `rgba(14, 30, 52, ${0.62 * state.storm})`;
      ctx.fillRect(0, 0, w, h);
    }

    drawSun(ctx, w, h, state.sun * (1 - state.storm * 0.85));
    drawClouds(ctx, w, h, now);
    if (state.spin > 0.02) drawTornado(ctx, w, h, now);
    if (state.storm > 0.05) drawRain(ctx, w, h, dt);
    if (settings.figure) drawFigure(ctx, w, h, pose, state.lift);
    drawLightning(ctx, w, h, now);

    /* A jump is instantaneous: the lift returns on its own. */
    if (target.lift > 0 && now - strikeAt > 240) target.lift = 0;
  }

  function drawSun(c, w, h, amount) {
    if (amount <= 0.02) return;
    const cx = w * 0.78;
    const cy = h * 0.2;
    const r = Math.min(w, h) * 0.42;
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(255, 226, 158, ${0.6 * amount})`);
    g.addColorStop(0.4, `rgba(255, 196, 104, ${0.22 * amount})`);
    g.addColorStop(1, 'rgba(255, 196, 104, 0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.beginPath();
    c.arc(cx, cy, Math.min(w, h) * 0.055, 0, Math.PI * 2);
    c.fillStyle = `rgba(255, 236, 190, ${0.85 * amount})`;
    c.fill();
  }

  function drawClouds(c, w, h, now) {
    const dark = state.storm;
    const alpha = 0.30 + 0.62 * dark;
    for (const cloud of clouds) {
      cloud.x += cloud.drift * (0.25 + state.wind * 1.9) * 0.016;
      if (cloud.x > 1.25) cloud.x -= 1.5;
      if (cloud.x < -0.25) cloud.x += 1.5;
      const size = Math.min(w, h) * 0.16 * cloud.s * (0.75 + dark * 0.75);
      const x = cloud.x * w;
      const y = cloud.y * h + Math.sin(now / 3200 + cloud.s * 6) * h * 0.006;
      const tone = 232 - 150 * dark;
      c.fillStyle = `rgba(${tone}, ${tone + 6}, ${tone + 16}, ${alpha})`;
      blob(c, x, y, size);
    }
  }

  function blob(c, x, y, s) {
    c.beginPath();
    c.arc(x - s * 0.6, y + s * 0.12, s * 0.52, 0, Math.PI * 2);
    c.arc(x, y - s * 0.18, s * 0.72, 0, Math.PI * 2);
    c.arc(x + s * 0.66, y + s * 0.1, s * 0.55, 0, Math.PI * 2);
    c.arc(x + s * 0.05, y + s * 0.3, s * 0.6, 0, Math.PI * 2);
    c.fill();
  }

  function drawRain(c, w, h, dt) {
    const count = Math.round(drops.length * Math.min(1, state.storm));
    const slant = state.wind * 0.55;
    c.strokeStyle = `rgba(186, 220, 245, ${0.24 + 0.4 * state.storm})`;
    c.lineWidth = Math.max(1, w * 0.0012);
    c.beginPath();
    for (let i = 0; i < count; i += 1) {
      const d = drops[i];
      d.y += d.v * dt * 0.85;
      d.x += slant * d.v * dt * 0.5;
      if (d.y > 1.05) {
        d.y -= 1.1;
        d.x = Math.random();
      }
      if (d.x > 1.1) d.x -= 1.2;
      if (d.x < -0.1) d.x += 1.2;
      const x = d.x * w;
      const y = d.y * h;
      c.moveTo(x, y);
      c.lineTo(x + slant * d.len * h, y + d.len * h);
    }
    c.stroke();
  }

  function drawTornado(c, w, h, now) {
    spinPhase += 0.09;
    const amount = state.spin;
    const cx = w * 0.63;
    const baseY = h * 0.9;
    const topY = h * 0.24;
    const topR = w * 0.085 * amount;
    const botR = w * 0.018 * amount;
    c.save();
    c.globalAlpha = 0.72 * amount;
    const g = c.createLinearGradient(0, topY, 0, baseY);
    g.addColorStop(0, 'rgba(196, 214, 232, 0.85)');
    g.addColorStop(1, 'rgba(120, 146, 172, 0.35)');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(cx - topR, topY);
    for (let t = 0; t <= 1.001; t += 0.05) {
      const y = topY + (baseY - topY) * t;
      const r = topR + (botR - topR) * t;
      c.lineTo(cx - r + Math.sin(spinPhase + t * 7) * r * 0.32, y);
    }
    for (let t = 1; t >= -0.001; t -= 0.05) {
      const y = topY + (baseY - topY) * t;
      const r = topR + (botR - topR) * t;
      c.lineTo(cx + r + Math.sin(spinPhase + t * 7) * r * 0.32, y);
    }
    c.closePath();
    c.fill();
    c.restore();
  }

  function drawLightning(c, w, h, now) {
    const age = now - strikeAt;
    if (age > 420 || !bolt) return;
    const fade = Math.max(0, 1 - age / 420);
    c.fillStyle = `rgba(226, 240, 255, ${0.5 * fade * fade})`;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = `rgba(255, 252, 235, ${0.95 * fade})`;
    c.lineWidth = Math.max(1.6, w * 0.0035);
    c.lineJoin = 'round';
    c.lineCap = 'round';
    c.shadowColor = 'rgba(180, 220, 255, 0.9)';
    c.shadowBlur = 18;
    c.beginPath();
    bolt.forEach((p, i) => {
      const x = p[0] * w;
      const y = p[1] * h;
      if (i === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    });
    c.stroke();
    c.shadowBlur = 0;
  }

  return {
    state,
    target,
    paint,
    strike,
    setPose(next) {
      poseTarget = basePose(next);
    },
  };
}

/* --- the figure ----------------------------------------------------------- */
/**
 * Poses live in a local space 68 units wide and 100 tall, feet at y=96. Only five
 * of them exist, because only five gestures do.
 */
const POSES = {
  idle: {},
  gather: { eL: [-18, 10], eR: [18, 10], hL: [-12, -8], hR: [12, -8] },
  wind: { eR: [20, 26], hR: [34, 20], eL: [-15, 34], hL: [-16, 46] },
  jump: {
    eL: [-19, 12], eR: [19, 12], hL: [-16, -4], hR: [16, -4],
    kL: [-11, 66], kR: [11, 66], fL: [-16, 80], fR: [16, 80],
  },
  spin: { eR: [19, 28], hR: [28, 18] },
  clear: { eL: [-20, 38], eR: [20, 38], hL: [-31, 52], hR: [31, 52] },
  reach: { eR: [17, 22], hR: [22, 6], eL: [-16, 40], hL: [-18, 54] },
};

const IDLE = {
  head: [0, 10], neck: [0, 20],
  sL: [-11, 22], sR: [11, 22],
  eL: [-17, 36], eR: [17, 36],
  hL: [-21, 50], hR: [21, 50],
  hip: [0, 52],
  kL: [-8, 72], kR: [8, 72],
  fL: [-10, 95], fR: [10, 95],
};

function basePose(name) {
  const overrides = POSES[name] || {};
  const out = {};
  for (const key of Object.keys(IDLE)) {
    out[key] = (overrides[key] || IDLE[key]).slice();
  }
  return out;
}

const BONES = [
  ['neck', 'hip'], ['neck', 'sL'], ['neck', 'sR'],
  ['sL', 'eL'], ['eL', 'hL'], ['sR', 'eR'], ['eR', 'hR'],
  ['hip', 'kL'], ['kL', 'fL'], ['hip', 'kR'], ['kR', 'fR'],
];

function poseMapper(w, h, pose, options) {
  const opts = Object.assign({ x: 0.38, height: 0.46, lift: 0 }, options);
  const scale = (h * opts.height) / 100;
  const originY = h * 0.95 - opts.lift * h * 0.1;
  const topY = originY - 96 * scale;
  const originX = w * opts.x;
  return {
    scale,
    at(key) {
      const p = pose[key];
      return [originX + p[0] * scale, topY + p[1] * scale];
    },
  };
}

function drawFigure(c, w, h, pose, lift) {
  const m = poseMapper(w, h, pose, { lift });
  const stroke = (colour, width) => {
    c.strokeStyle = colour;
    c.lineWidth = width;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    for (const [a, b] of BONES) {
      const p = m.at(a);
      const q = m.at(b);
      c.moveTo(p[0], p[1]);
      c.lineTo(q[0], q[1]);
    }
    c.stroke();
  };

  /* A dark pass underneath keeps the figure legible over bright art. */
  stroke('rgba(9, 18, 30, 0.55)', m.scale * 7.4);
  stroke('#ffb43d', m.scale * 4.4);

  const head = m.at('head');
  c.beginPath();
  c.arc(head[0], head[1], m.scale * 8.6, 0, Math.PI * 2);
  c.fillStyle = 'rgba(9, 18, 30, 0.55)';
  c.fill();
  c.beginPath();
  c.arc(head[0], head[1], m.scale * 7.2, 0, Math.PI * 2);
  c.fillStyle = '#ffb43d';
  c.fill();
}

/* --- wiring: hero --------------------------------------------------------- */
(function hero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const sky = createSky(canvas, { art: 'assets/worlds/valley-open.jpg', storm: 0.34, wind: 0.28, sun: 0.7 });
  run(sky, canvas);
})();

/* --- wiring: the demo ----------------------------------------------------- */
(function demo() {
  const canvas = document.getElementById('demo-canvas');
  const rail = document.querySelector('.demo__rail');
  if (!canvas || !rail) return;

  const sky = createSky(canvas, { art: 'assets/worlds/valley-vines.jpg', figure: true, storm: 0.1, wind: 0, sun: 1 });
  let runner = null;
  const readouts = {
    storm: document.getElementById('hud-storm'),
    wind: document.getElementById('hud-wind'),
    sun: document.getElementById('hud-sun'),
  };

  /**
   * The world's answer to each gesture. These are the values the contract would
   * carry — magnitudes and a signed direction, never a joint.
   */
  const RESPONSES = {
    gather: { storm: 0.92, wind: 0.1, sun: 0.06, spin: 0 },
    wind: { storm: 0.62, wind: 0.95, sun: 0.25, spin: 0 },
    jump: { storm: 0.88, wind: 0.2, sun: 0.05, spin: 0 },
    spin: { storm: 0.7, wind: 0.45, sun: 0.15, spin: 1 },
    clear: { storm: 0.02, wind: 0.05, sun: 1, spin: 0 },
  };

  function select(name, node) {
    rail.querySelectorAll('.gest').forEach((b) => {
      const on = b === node;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const response = RESPONSES[name];
    Object.assign(sky.target, response);
    sky.setPose(name);
    /* The lightning wash is a full-screen flash. Someone who asked for less motion
       gets the storm without it, not a smaller version of it. */
    if (name === 'jump' && !REDUCED) {
      sky.target.lift = 1;
      sky.strike(performance.now());
    }
    if (runner) runner.redraw();
  }

  rail.addEventListener('click', (event) => {
    const button = event.target.closest('.gest');
    if (button) select(button.dataset.gesture, button);
  });

  runner = run(sky, canvas, () => {
    if (!readouts.storm) return;
    readouts.storm.textContent = sky.state.storm.toFixed(2);
    readouts.wind.textContent = (sky.state.wind >= 0 ? '' : '-') + Math.abs(sky.state.wind).toFixed(2);
    readouts.sun.textContent = sky.state.sun.toFixed(2);
  });

  select('gather', rail.querySelector('.gest'));
})();

/* Runs a scene only while it is on screen, so a page left open costs nothing. */
function run(scene, canvas, onFrame) {
  let last = performance.now();
  let raf = 0;
  let visible = true;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    scene.paint(now, dt);
    if (onFrame) onFrame();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf || !visible) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  if (REDUCED) {
    /* Two frames: one to settle the eased values, one to draw them. */
    const settle = () => {
      /* One long step lands the eased values on their targets, one short step draws them. */
      scene.paint(performance.now(), 4);
      scene.paint(performance.now(), 0.016);
      if (onFrame) onFrame();
    };
    settle();
    return { redraw: settle, start() {}, stop() {} };
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.02 }).observe(canvas);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  start();
  return { stop, start, redraw() {} };
}

/* --- wiring: the anatomy figure ------------------------------------------- */
/**
 * The third world, in miniature. Four layers over one moving body — which is the
 * point of it: the same tracked movement, shown through a different layer.
 */
(function anatomy() {
  const canvas = document.getElementById('anatomy-canvas');
  const pills = document.getElementById('anatomy-pills');
  if (!canvas || !pills) return;

  const ctx = canvas.getContext('2d');
  let layer = 'skeleton';
  let pose = basePose('idle');
  let towards = 'reach';
  let switchAt = 0;

  pills.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    layer = button.dataset.layer;
    pills.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b === button));
    if (REDUCED) draw(performance.now(), 0.016);
  });

  function draw(now, dt) {
    const { w, h } = fitCanvas(canvas);

    if (!REDUCED && now - switchAt > 3400) {
      switchAt = now;
      towards = towards === 'reach' ? 'idle' : 'reach';
    }
    const target = basePose(towards);
    for (const key of Object.keys(pose)) {
      pose[key][0] = approach(pose[key][0], target[key][0], 1.6, dt);
      pose[key][1] = approach(pose[key][1], target[key][1], 1.6, dt);
    }

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#12283e');
    bg.addColorStop(1, '#0a1626');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(120, 170, 210, 0.08)';
    ctx.lineWidth = 1;
    const step = Math.max(24, w / 26);
    ctx.beginPath();
    for (let x = 0; x < w; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    const m = poseMapper(w, h, pose, { x: 0.5, height: 0.72 });
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const limbs = (colour, width) => {
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.beginPath();
      for (const [a, b] of BONES) {
        const p = m.at(a);
        const q = m.at(b);
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(q[0], q[1]);
      }
      ctx.stroke();
    };

    const head = m.at('head');
    const neck = m.at('neck');
    const hip = m.at('hip');

    if (layer === 'skeleton') {
      limbs('#cfe6f5', m.scale * 2.2);
      ctx.strokeStyle = 'rgba(207, 230, 245, 0.75)';
      ctx.lineWidth = m.scale * 1.3;
      for (let i = 0; i < 4; i += 1) {
        const t = 0.18 + i * 0.15;
        const y = neck[1] + (hip[1] - neck[1]) * t;
        const rw = m.scale * (11 - i * 0.9);
        ctx.beginPath();
        ctx.moveTo(neck[0] - rw, y);
        ctx.quadraticCurveTo(neck[0], y + m.scale * 3.4, neck[0] + rw, y);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(head[0], head[1], m.scale * 7.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#8fd0e6';
      for (const key of ['sL', 'sR', 'eL', 'eR', 'hL', 'hR', 'kL', 'kR', 'fL', 'fR']) {
        const p = m.at(key);
        ctx.beginPath();
        ctx.arc(p[0], p[1], m.scale * 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (layer === 'muscles') {
      limbs('rgba(196, 78, 62, 0.35)', m.scale * 11);
      limbs('#d8604a', m.scale * 7);
      ctx.fillStyle = '#c2513d';
      ctx.beginPath();
      ctx.ellipse(neck[0], (neck[1] + hip[1]) / 2, m.scale * 12, (hip[1] - neck[1]) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(head[0], head[1], m.scale * 7.6, 0, Math.PI * 2);
      ctx.fillStyle = '#b94a38';
      ctx.fill();
    } else if (layer === 'organs') {
      limbs('rgba(255, 180, 61, 0.18)', m.scale * 6);
      ctx.fillStyle = 'rgba(210, 232, 246, 0.16)';
      ctx.beginPath();
      ctx.ellipse(neck[0], (neck[1] + hip[1]) / 2, m.scale * 13, (hip[1] - neck[1]) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      const midY = neck[1] + (hip[1] - neck[1]) * 0.34;
      ctx.fillStyle = 'rgba(127, 180, 216, 0.85)';
      ctx.beginPath();
      ctx.ellipse(neck[0] - m.scale * 5.4, midY, m.scale * 4.2, m.scale * 7, 0.12, 0, Math.PI * 2);
      ctx.ellipse(neck[0] + m.scale * 5.4, midY, m.scale * 4.2, m.scale * 7, -0.12, 0, Math.PI * 2);
      ctx.fill();
      const beat = REDUCED ? 1 : 1 + Math.sin(now / 300) * 0.07;
      ctx.fillStyle = '#e05252';
      ctx.beginPath();
      ctx.ellipse(neck[0] - m.scale * 1.2, midY + m.scale * 1.4, m.scale * 3.3 * beat, m.scale * 3.8 * beat, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(210, 232, 246, 0.3)';
      ctx.beginPath();
      ctx.arc(head[0], head[1], m.scale * 7.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      limbs('rgba(255, 180, 61, 0.28)', m.scale * 13);
      limbs('#ffb43d', m.scale * 8);
      ctx.fillStyle = '#ffb43d';
      ctx.beginPath();
      ctx.arc(head[0], head[1], m.scale * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  run({ paint: draw }, canvas);
})();
