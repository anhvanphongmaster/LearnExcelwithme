(() => {
if (typeof THREE === "undefined") {
  const m = document.getElementById("msg");
  if (m) m.textContent = "Không tải được Three.js (cần mạng). Thử F5 hoặc đổi mạng.";
  return;
}
const PER = 30, LIMIT = 15, BEST_KEY = "avp_excel_race3d_best";
const $ = (id) => document.getElementById(id);

let all = [], level = 1, inLevel = [], idx = 0, streak = 0, best = 0;
let locked = false, playing = false, timerId = null, endsAt = 0;
let speed = 0, targetSpeed = 0, crashT = 0;

const canvas = $("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x0b1a12);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b1a12, 12, 55);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 4.2, 8);

const hemi = new THREE.HemisphereLight(0xb6ffd0, 0x1a2e22, 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 0.85);
sun.position.set(5, 12, 6);
scene.add(sun);

// ground / road
const road = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 200),
  new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95 })
);
road.rotation.x = -Math.PI / 2;
road.position.z = -80;
scene.add(road);

const grassL = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 200),
  new THREE.MeshStandardMaterial({ color: 0x1e4d32, roughness: 1 })
);
grassL.rotation.x = -Math.PI / 2;
grassL.position.set(-24, -0.02, -80);
scene.add(grassL);
const grassR = grassL.clone();
grassR.position.x = 24;
scene.add(grassR);

// lane dashes
const dashes = new THREE.Group();
for (let i = 0; i < 40; i++) {
  const d = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.02, 1.2),
    new THREE.MeshBasicMaterial({ color: 0xf1c40f })
  );
  d.position.set(0, 0.02, -i * 4);
  dashes.add(d);
}
scene.add(dashes);

// low-poly car
const car = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.45, 2.1),
  new THREE.MeshStandardMaterial({ color: 0x2ecc71, metalness: 0.2, roughness: 0.4 })
);
body.position.y = 0.45;
car.add(body);
const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1.0, 0.4, 1.0),
  new THREE.MeshStandardMaterial({ color: 0x1abc9c, metalness: 0.1, roughness: 0.35 })
);
cabin.position.set(0, 0.85, -0.15);
car.add(cabin);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
[[-0.55, 0.22, 0.7], [0.55, 0.22, 0.7], [-0.55, 0.22, -0.7], [0.55, 0.22, -0.7]].forEach(([x, y, z]) => {
  const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10), wheelMat);
  w.rotation.z = Math.PI / 2;
  w.position.set(x, y, z);
  car.add(w);
});
car.position.set(0, 0, 0);
scene.add(car);

// obstacles / finish markers floating
const gates = new THREE.Group();
for (let i = 1; i <= 8; i++) {
  const g = new THREE.Mesh(
    new THREE.BoxGeometry(6.5, 0.15, 0.15),
    new THREE.MeshBasicMaterial({ color: 0x9b59b6 })
  );
  g.position.set(0, 0.4, -i * 18);
  gates.add(g);
}
scene.add(gates);

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}
addEventListener("resize", onResize);

function loadBest() {
  try { best = Number(localStorage.getItem(BEST_KEY) || 0) || 0; } catch { best = 0; }
  $("best").textContent = String(best);
}
function saveBest() {
  if (streak > best) {
    best = streak;
    try { localStorage.setItem(BEST_KEY, String(best)); } catch {}
    $("best").textContent = String(best);
  }
}

function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}
function pool(lv) {
  const p = all.filter((q) => q.lv === lv);
  if (p.length) return p;
  const s = (lv - 1) * PER;
  return all.slice(s, s + PER);
}

function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
function paintTimer(left) {
  const fill = $("fill");
  fill.style.width = Math.max(0, Math.min(100, (left / LIMIT) * 100)) + "%";
  fill.classList.toggle("warn", left <= 8 && left > 5);
  fill.classList.toggle("danger", left <= 5);
  $("sec").textContent = String(Math.max(0, Math.ceil(left)));
}
function startTimer() {
  stopTimer();
  endsAt = Date.now() + LIMIT * 1000;
  paintTimer(LIMIT);
  timerId = setInterval(() => {
    const left = (endsAt - Date.now()) / 1000;
    paintTimer(left);
    if (left <= 0) {
      stopTimer();
      if (!playing || locked) return;
      locked = true;
      $("msg").textContent = "Hết giờ — đâm xe!";
      fail();
    }
  }, 100);
}

function hud() {
  $("lv").textContent = String(level);
  $("pg").textContent = idx + "/" + Math.min(PER, inLevel.length || PER);
  $("st").textContent = String(streak);
}

function showQ() {
  locked = false;
  if (idx >= inLevel.length) {
    level += 1;
    idx = 0;
    inLevel = shuffle(pool(level));
    if (!inLevel.length) {
      stopTimer();
      playing = false;
      targetSpeed = 0;
      $("msg").textContent = "Hết ngân hàng câu hỏi — quá đỉnh!";
      $("q").hidden = true;
      $("ans").hidden = true;
      $("start").hidden = false;
      $("start").textContent = "Chơi lại";
      return;
    }
    $("msg").textContent = "Lên cấp " + level + "!";
  }
  const q = inLevel[idx];
  $("q").textContent = q.q;
  $("q").hidden = false;
  $("ans").hidden = false;
  const flip = Math.random() < 0.5;
  const L = flip ? { t: q.b, k: "b" } : { t: q.a, k: "a" };
  const R = flip ? { t: q.a, k: "a" } : { t: q.b, k: "b" };
  $("a1").textContent = L.t; $("a1").dataset.key = L.k; $("a1").className = "";
  $("a2").textContent = R.t; $("a2").dataset.key = R.k; $("a2").className = "";
  hud();
  startTimer();
}

function fail() {
  locked = true;
  stopTimer();
  crashT = 1;
  targetSpeed = 0;
  speed = 0;
  setTimeout(() => {
    level = 1; idx = 0; streak = 0;
    inLevel = shuffle(pool(1));
    car.position.x = 0;
    car.rotation.z = 0;
    crashT = 0;
    $("msg").textContent = "Chơi lại từ cấp 1 — câu đã xáo.";
    hud();
    showQ();
  }, 900);
}

function answer(btn) {
  if (!playing || locked) return;
  locked = true;
  stopTimer();
  const q = inLevel[idx];
  const ok = btn.dataset.key === q.c;
  btn.className = ok ? "ok" : "bad";
  if (ok) {
    streak += 1; saveBest(); idx += 1;
    targetSpeed = Math.min(28, 8 + streak * 0.35);
    $("msg").textContent = "Đúng — tăng tốc!";
    hud();
    setTimeout(showQ, 320);
  } else {
    const other = btn.id === "a1" ? $("a2") : $("a1");
    other.className = "ok";
    $("msg").textContent = "Sai — đâm xe!";
    fail();
  }
}

function start() {
  all = (window.EXCEL_RACE_QUESTIONS || []).slice();
  if (!all.length) { $("msg").textContent = "Thiếu excel-race-questions.js"; return; }
  stopTimer();
  playing = true; level = 1; idx = 0; streak = 0;
  inLevel = shuffle(pool(1));
  targetSpeed = 6; speed = 4;
  $("start").hidden = true;
  $("msg").textContent = "Xuất phát!";
  showQ();
}

$("start").onclick = start;
$("a1").onclick = () => answer($("a1"));
$("a2").onclick = () => answer($("a2"));
loadBest();

let last = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  speed += (targetSpeed - speed) * Math.min(1, dt * 3);

  // scroll world toward camera
  const move = speed * dt;
  dashes.children.forEach((d) => {
    d.position.z += move;
    if (d.position.z > 6) d.position.z -= 160;
  });
  gates.children.forEach((g) => {
    g.position.z += move;
    if (g.position.z > 6) g.position.z -= 144;
  });
  road.position.z = -80 + (road.position.z + move) % 4;

  if (crashT > 0) {
    crashT = Math.max(0, crashT - dt);
    car.rotation.z = Math.sin(now * 0.03) * 0.4;
    car.position.x = Math.sin(now * 0.02) * 0.8;
  } else {
    car.rotation.z *= 0.9;
    car.position.x *= 0.9;
    car.position.y = 0.05 * Math.sin(now * 0.01 * (1 + speed * 0.05));
  }

  camera.position.x = car.position.x * 0.3;
  camera.position.y = 4.2;
  camera.position.z = 8;
  camera.lookAt(car.position.x, 0.6, car.position.z - 6);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

})();
