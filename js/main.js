// 滚动浮现
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// 侧边栏时钟
const clock = document.getElementById('clock');
if (clock) {
  const tick = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false }) + ' PST';
  };
  tick();
  setInterval(tick, 1000);
}

// 背景十字定位标记（制图风格）
const marks = document.createElement('div');
marks.className = 'bg-marks';
marks.setAttribute('aria-hidden', 'true');
[[16.66, 16], [50, 30], [83.33, 12], [33.33, 62], [66.66, 78], [16.66, 86], [83.33, 55]]
  .forEach(([x, y]) => {
    const i = document.createElement('i');
    i.style.left = x + '%';
    i.style.top = y + '%';
    marks.appendChild(i);
  });
document.body.appendChild(marks);

// 光标跟随环（仅精确指针设备）
if (window.matchMedia('(pointer: fine)').matches) {
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.style.opacity = '0';
  document.body.appendChild(ring);

  let tx = 0, ty = 0, rx = 0, ry = 0, shown = false, running = false;
  const loop = () => {
    rx += (tx - rx) * 0.14;
    ry += (ty - ry) * 0.14;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    // 鼠标静止且环已就位时暂停循环，避免持续重绘
    if (Math.abs(tx - rx) > 0.3 || Math.abs(ty - ry) > 0.3) {
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  };
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { rx = tx; ry = ty; ring.style.opacity = '1'; shown = true; }
    if (!running) { running = true; requestAnimationFrame(loop); }
  });

  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('is-hover', !!e.target.closest('a, button'));
  });
}

// Blog 页标签筛选
const filterBtns = document.querySelectorAll('.filterbar button');
if (filterBtns.length) {
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    document.querySelectorAll('.post[data-tag]').forEach((p) => {
      p.style.display = (f === 'all' || p.dataset.tag === f) ? '' : 'none';
    });
    document.querySelectorAll('.year-group').forEach((g) => {
      const hasVisible = [...g.querySelectorAll('.post')].some((p) => p.style.display !== 'none');
      g.style.display = hasVisible ? '' : 'none';
    });
  }));
}
