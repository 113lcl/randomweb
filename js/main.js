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

})();
