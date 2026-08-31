/* ==========================================================================
   PULSAR STUDIO — Interaction Engine
   ========================================================================== */
(function(){
  "use strict";

  const isTouch = matchMedia('(hover: none)').matches || 'ontouchstart' in window;
  if(isTouch) document.documentElement.classList.add('has-touch');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if(loader){
      setTimeout(() => loader.classList.add('done'), 250);
    }
    document.querySelectorAll('.hero').forEach(h => h.classList.add('is-ready'));
  });
  // Fallback in case load event already fired / is slow
  setTimeout(() => {
    const loader = document.querySelector('.loader');
    if(loader) loader.classList.add('done');
    document.querySelectorAll('.hero').forEach(h => h.classList.add('is-ready'));
  }, 1400);

  /* ---------- Scroll progress bar ---------- */
  const progress = document.querySelector('.progress-bar');
  function onScrollProgress(){
    if(!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', onScrollProgress, { passive:true });

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  function onScrollNav(){
    if(!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  document.addEventListener('scroll', onScrollNav, { passive:true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if(burger && mobileNav){
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
    });
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      mobileNav.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }));
  }

  /* ---------- Custom cursor ---------- */
  if(!isTouch){
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    function loop(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const hoverables = 'a, button, .magnetic, .work-card, .tilt-card, input, textarea, select, .acc-item__head';
    document.addEventListener('mouseover', e => {
      if(e.target.closest(hoverables)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', e => {
      if(e.target.closest(hoverables)) ring.classList.remove('is-hover');
    });
    document.addEventListener('mousedown', () => ring.style.transform += ' scale(0.85)');
  }

  /* ---------- Magnetic buttons ---------- */
  if(!isTouch && !reduceMotion){
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `translate(${x*0.28}px, ${y*0.5}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Tilt cards ---------- */
  if(!isTouch && !reduceMotion){
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${px*8}deg) rotateX(${-py*8}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = el.dataset.count.includes('.') ? el.dataset.count.split('.')[1].length : 0;
        const dur = 1600;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => co.observe(el));
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-item__head');
    const body = item.querySelector('.acc-item__body');
    if(!head || !body) return;
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.closest('[data-accordion]')?.querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.acc-item__body').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Work filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('[data-cat]');
  if(filterBtns.length && workCards.length){
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        workCards.forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Marquee auto-duplicate for seamless loop ---------- */
  document.querySelectorAll('.marquee__track').forEach(track => {
    if(track.dataset.doubled) return;
    track.innerHTML += track.innerHTML;
    track.dataset.doubled = 'true';
  });

  /* ---------- Contact form (demo only, no backend) ---------- */
  const form = document.querySelector('[data-contact-form]');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Message sent ✓';
      form.reset();
      form.querySelectorAll('input, textarea').forEach(f => f.blur());
      setTimeout(() => { btn.innerHTML = original; }, 3000);
    });
  }

  /* ---------- Set active nav link ---------- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .mobile-nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === current) a.classList.add('active');
  });

  /* ---------- Theme toggle ---------- */
  (function themeInit(){
    const root = document.documentElement;
    const stored = localStorage.getItem('pulsar-theme');
    if(stored) root.setAttribute('data-theme', stored);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        const next = isLight ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('pulsar-theme', next);
      });
    });
  })();

  /* ---------- Back to top ---------- */
  const backToTop = document.querySelector('[data-back-to-top]');
  if(backToTop){
    document.addEventListener('scroll', () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 800);
    }, { passive:true });
    backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---------- Text scramble on nav logo ---------- */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ*#%$&';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const original = el.textContent;
    let frame = 0, raf = null;
    function scramble(){
      let output = '';
      const progress = frame / 10;
      for(let i = 0; i < original.length; i++){
        if(i < progress){ output += original[i]; }
        else { output += CHARS[Math.floor(Math.random() * CHARS.length)]; }
      }
      el.textContent = output;
      frame++;
      if(frame <= original.length + 10){ raf = requestAnimationFrame(scramble); }
      else { el.textContent = original; }
    }
    el.addEventListener('mouseenter', () => {
      if(isTouch || reduceMotion) return;
      cancelAnimationFrame(raf);
      frame = 0;
      scramble();
    });
  });

  /* ---------- Command palette (⌘K) ---------- */
  (function cmdk(){
    const overlay = document.querySelector('[data-cmdk-overlay]');
    if(!overlay) return;
    const input = overlay.querySelector('[data-cmdk-input]');
    const list = overlay.querySelector('[data-cmdk-list]');
    const pages = [
      { title:'Home', tag:'Page', href:'index.html' },
      { title:'Work', tag:'Page', href:'work.html' },
      { title:'Lab', tag:'Page', href:'lab.html' },
      { title:'Studio', tag:'Page', href:'about.html' },
      { title:'Services', tag:'Page', href:'services.html' },
      { title:'Team', tag:'Page', href:'team.html' },
      { title:'Journal', tag:'Page', href:'blog.html' },
      { title:'Contact', tag:'Page', href:'contact.html' },
      { title:'Aurora — Fintech branding case study', tag:'Work', href:'work-aurora.html' },
      { title:'Vitality — Health product case study', tag:'Work', href:'work-vitality.html' },
      { title:'Norrland — E-commerce case study', tag:'Work', href:'work-norrland.html' },
      { title:'Why we stopped designing in components', tag:'Journal', href:'blog-systems-design.html' },
      { title:'Shipping motion-heavy sites without tanking CWV', tag:'Journal', href:'blog-cwv.html' },
      { title:'The case for fewer, bolder typefaces', tag:'Journal', href:'blog-typefaces.html' },
      { title:'Email hello@pulsarstudio.co', tag:'Contact', href:'mailto:hello@pulsarstudio.co' },
    ];
    let activeIndex = 0;
    let filtered = pages;

    function render(){
      list.innerHTML = '';
      if(!filtered.length){
        list.innerHTML = '<div class="cmdk-empty">No results. Try another search.</div>';
        return;
      }
      filtered.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = 'cmdk-item' + (i === activeIndex ? ' is-active' : '');
        item.innerHTML = `<span>${p.title}</span><span class="cmdk-item__tag">${p.tag}</span>`;
        item.addEventListener('mouseenter', () => { activeIndex = i; render(); });
        item.addEventListener('click', () => go(p));
        list.appendChild(item);
      });
    }
    function go(p){
      close();
      window.location.href = p.href;
    }
    function open(){
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      input.value = '';
      filtered = pages;
      activeIndex = 0;
      render();
      setTimeout(() => input.focus(), 50);
    }
    function close(){
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }
    document.querySelectorAll('[data-cmdk-open]').forEach(btn => btn.addEventListener('click', open));
    overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      filtered = pages.filter(p => p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
      activeIndex = 0;
      render();
    });
    document.addEventListener('keydown', e => {
      if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault();
        overlay.classList.contains('is-open') ? close() : open();
      }
      if(!overlay.classList.contains('is-open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowDown'){ e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      if(e.key === 'ArrowUp'){ e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      if(e.key === 'Enter' && filtered[activeIndex]){ go(filtered[activeIndex]); }
    });
  })();

  /* ---------- Testimonial / generic carousel ---------- */
  document.querySelectorAll('[data-carousel]').forEach(root => {
    const track = root.querySelector('.carousel__track');
    const slides = root.querySelectorAll('.carousel__slide');
    const dotsWrap = root.querySelector('.carousel__dots');
    if(!track || !slides.length) return;
    let index = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { index = i; update(); });
      dotsWrap?.appendChild(dot);
    });
    function update(){
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap?.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === index));
    }
    let timer = setInterval(() => { index = (index + 1) % slides.length; update(); }, 5500);
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', () => { timer = setInterval(() => { index = (index + 1) % slides.length; update(); }, 5500); });
  });

  /* ---------- Lab: gradient mesh canvas ---------- */
  document.querySelectorAll('[data-mesh]').forEach(stage => {
    const canvas = document.createElement('canvas');
    stage.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let w, h, mx = 0.5, my = 0.5;
    function resize(){ w = canvas.width = stage.clientWidth; h = canvas.height = stage.clientHeight; }
    resize();
    window.addEventListener('resize', resize);
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    });
    const blobs = [
      { c:'#7c5cff', dx:.2, dy:.15 },
      { c:'#c6ff3d', dx:-.25, dy:.2 },
      { c:'#ff5c8a', dx:.15, dy:-.2 }
    ];
    function draw(t){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#0a0a0b';
      ctx.fillRect(0,0,w,h);
      blobs.forEach((b, i) => {
        const x = w * (0.5 + Math.sin(t/2000 + i) * 0.3 + (mx - 0.5) * b.dx);
        const y = h * (0.5 + Math.cos(t/2400 + i) * 0.3 + (my - 0.5) * b.dy);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, w * 0.35);
        grad.addColorStop(0, b.c + 'aa');
        grad.addColorStop(1, b.c + '00');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,w,h);
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  });

  /* ---------- Lab: draggable stack ---------- */
  document.querySelectorAll('[data-stack]').forEach(stage => {
    const cards = stage.querySelectorAll('.stack-card');
    cards.forEach(card => {
      let dragging = false, startX, startY, origX, origY;
      card.addEventListener('pointerdown', e => {
        dragging = true;
        stage.appendChild(card);
        startX = e.clientX; startY = e.clientY;
        origX = card.offsetLeft; origY = card.offsetTop;
        card.setPointerCapture(e.pointerId);
      });
      card.addEventListener('pointermove', e => {
        if(!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        card.style.left = origX + dx + 'px';
        card.style.top = origY + dy + 'px';
        card.style.transform = `rotate(${dx * 0.04}deg)`;
      });
      card.addEventListener('pointerup', () => { dragging = false; });
    });
  });

  /* ---------- Lab: scramble demo ---------- */
  document.querySelectorAll('[data-scramble-demo]').forEach(el => {
    const words = ['CREATIVITY', 'INTERACTION', 'MOTION', 'CRAFT', 'PULSAR'];
    let wi = 0, frame = 0, raf;
    function run(){
      const target = words[wi];
      let output = '';
      for(let i = 0; i < target.length; i++){
        output += i < frame/2 ? target[i] : CHARS[Math.floor(Math.random()*CHARS.length)];
      }
      el.textContent = output;
      frame++;
      if(frame < target.length * 2 + 20){ raf = requestAnimationFrame(run); }
      else { wi = (wi + 1) % words.length; frame = 0; setTimeout(() => requestAnimationFrame(run), 900); }
    }
    run();
  });

  /* ---------- Lab: palette generator ---------- */
  document.querySelectorAll('[data-palette]').forEach(stage => {
    function randomPalette(){
      stage.innerHTML = '';
      const hue = Math.floor(Math.random() * 360);
      for(let i = 0; i < 5; i++){
        const h = (hue + i * (360/7)) % 360;
        const sw = document.createElement('div');
        sw.className = 'palette-swatch';
        sw.style.background = `hsl(${h}, 70%, ${38 + i*4}%)`;
        sw.textContent = `#${Math.floor(h)}`;
        sw.addEventListener('click', randomPalette);
        stage.appendChild(sw);
      }
    }
    randomPalette();
  });

  /* ---------- Lab: magnet grid ---------- */
  document.querySelectorAll('[data-magnet-grid]').forEach(stage => {
    for(let i = 0; i < 60; i++){
      const dot = document.createElement('div');
      dot.className = 'magnet-dot';
      stage.appendChild(dot);
    }
    const dots = stage.querySelectorAll('.magnet-dot');
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      dots.forEach(dot => {
        const dr = dot.getBoundingClientRect();
        const dx = (dr.left + dr.width/2) - e.clientX;
        const dy = (dr.top + dr.height/2) - e.clientY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const strength = Math.max(0, 1 - dist / 120);
        dot.style.transform = `translate(${dx*strength*0.5}px, ${dy*strength*0.5}px) scale(${1+strength})`;
        dot.style.background = strength > 0.1 ? 'var(--accent)' : '';
      });
    });
    stage.addEventListener('mouseleave', () => dots.forEach(d => { d.style.transform=''; d.style.background=''; }));
  });

  /* ---------- Lab: slider readout ---------- */
  document.querySelectorAll('[data-slider]').forEach(wrap => {
    const range = wrap.querySelector('input[type=range]');
    const readout = wrap.querySelector('.slider-readout');
    if(!range || !readout) return;
    const suffix = wrap.dataset.suffix || '';
    const update = () => readout.textContent = range.value + suffix;
    range.addEventListener('input', update);
    update();
  });

})();
