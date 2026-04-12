document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR PERSONALIZADO ── */
  const cursor    = document.createElement('div');
  const cursorDot = document.createElement('div');

  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 36px; height: 36px; border-radius: 50%;
    border: 1.5px solid transparent;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, border-color 0.3s, opacity 0.3s;
    will-change: left, top;
  `;
  cursorDot.style.cssText = `
    position: fixed; pointer-events: none; z-index: 10000;
    width: 6px; height: 6px; border-radius: 50%;
    background: transparent;
    transform: translate(-50%, -50%);
    will-change: left, top;
  `;
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });
  (function lerp() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(lerp);
  })();

  document.addEventListener('mouseleave', () => { cursor.style.opacity = cursorDot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = cursorDot.style.opacity = '1'; });

  document.querySelectorAll('.card, .skill, .tag, .btn-contato, .exp-item, a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '56px'; cursor.style.height = '56px';
      cursor.style.borderColor = '#fff'; cursor.style.mixBlendMode = 'difference';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '36px'; cursor.style.height = '36px';
      cursor.style.borderColor = 'transparent'; cursor.style.mixBlendMode = 'normal';
    });
  });

  /* ── CARDS: ENTRADA ESCALONADA ── */
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.card').forEach((card, i) => {
        setTimeout(() => card.classList.add('visivel'), i * 120);
      });
      cardObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.cards').forEach(grid => cardObserver.observe(grid));

  /* ── CARDS: 3D TILT ── */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rotX = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -6;
      const rotY = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  6;
      card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── SCROLL: REVELAR ELEMENTOS ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visivel');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.secao, .exp-item, .skill, .secao-bio').forEach(el => {
    el.classList.add('scroll-hidden');
    revealObserver.observe(el);
  });

  /* ── BARRA DE PROGRESSO ── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 99999;
    height: 2px; width: 0%; background: #ff5500;
    transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  /* ── SCROLL: PARALLAX FOTOS + TEXTO CENTRAL ── */
  const titulo     = document.querySelector('.headline h1');
  const fotoEsq    = document.querySelector('.foto-esquerda');   /* <-- sua classe da foto esq */
  const fotoDir    = document.querySelector('.foto-direita');    /* <-- sua classe da foto dir */
  const headlineSec= document.querySelector('.headline');

  /* split do título em spans por palavra para animar por palavra */
  if (titulo) {
    const palavras = titulo.innerHTML.split(/\s+/);
    titulo.innerHTML = palavras
      .map((p, i) => `<span class="palavra" style="
        display:inline-block;
        opacity:0;
        transform:translateY(40px) skewY(4deg);
        transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s,
                    transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s;
      ">${p}</span>`)
      .join(' ');

    /* ativa as palavras após 300ms (página carregada) */
    setTimeout(() => {
      titulo.querySelectorAll('.palavra').forEach(p => {
        p.style.opacity   = '1';
        p.style.transform = 'translateY(0) skewY(0deg)';
      });
    }, 300);

    /* hover no headline: cada palavra reage ao mouse */
    titulo.querySelectorAll('.palavra').forEach(palavra => {
      palavra.addEventListener('mouseenter', () => {
        palavra.style.color     = '#fff';
        palavra.style.transform = 'translateY(-6px) skewY(-2deg) scale(1.06)';
        palavra.style.transition = 'all 0.2s ease';
      });
      palavra.addEventListener('mouseleave', () => {
        palavra.style.color     = '';
        palavra.style.transform = '';
        palavra.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* distorção leve nas fotos conforme o mouse se move pela página */
  document.addEventListener('mousemove', e => {
    const px = (e.clientX / window.innerWidth  - 0.5);  /* -0.5 → +0.5 */
    const py = (e.clientY / window.innerHeight - 0.5);

    if (fotoEsq) {
      fotoEsq.style.transform = `
        scale(1.04)
        translate(${px * -18}px, ${py * -10}px)
        rotateY(${px * 6}deg)
      `;
    }
    if (fotoDir) {
      fotoDir.style.transform = `
        scale(1.04)
        translate(${px * 18}px, ${py * -10}px)
        rotateY(${px * -6}deg)
      `;
    }
  });

  /* fotos voltam ao lugar quando o mouse sai */
  document.addEventListener('mouseleave', () => {
    [fotoEsq, fotoDir].forEach(f => {
      if (f) f.style.transform = 'scale(1) translate(0,0) rotateY(0deg)';
    });
  });

  /* transição suave nas fotos */
  [fotoEsq, fotoDir].forEach(f => {
    if (!f) return;
    f.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    f.style.willChange = 'transform';
    f.style.transformStyle = 'preserve-3d';
  });

  /* ── SCROLL: parallax headline + fotos + progresso ── */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    /* headline sobe e some */
    if (titulo) {
      titulo.style.transform = `translateY(${scrollY * 0.2}px)`;
      if (headlineSec) headlineSec.style.opacity = Math.max(0, 1 - scrollY / 420);
    }

    /* fotos se movem em direções opostas no scroll */
    if (fotoEsq) fotoEsq.style.transform = `translateY(${scrollY * 0.12}px) scale(1.04)`;
    if (fotoDir) fotoDir.style.transform  = `translateY(${scrollY * -0.08}px) scale(1.04)`;

    /* barra de progresso */
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrollY / docH) * 100) + '%';

    /* custom prop nas seções */
    document.querySelectorAll('.secao').forEach(secao => {
      const rect  = secao.getBoundingClientRect();
      const ratio = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
      secao.style.setProperty('--scroll-ratio', ratio);
    });

  }, { passive: true });

  /* ── CONTADOR DE NÚMEROS ── */
  const numObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.ceil(end / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, end);
        el.textContent = current + (el.dataset.suffix || '');
        if (current >= end) clearInterval(timer);
      }, 30);
      numObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => numObserver.observe(el));

  /* ── EFEITO MAGNÉTICO NOS BOTÕES ── */
  document.querySelectorAll('.btn-contato, .skill').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── FOTOS: efeito revelar ao scroll ── */
  const fotoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('foto-revelada');
        fotoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.foto-esquerda, .foto-direita').forEach(f => {
    f.classList.add('foto-escondida');
    fotoObserver.observe(f);
  });

});

/* ── CSS INJETADO ── */
const style = document.createElement('style');
style.textContent = `

  /* scroll reveal genérico */
  .scroll-hidden {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .exp-item.scroll-hidden  { transform: translateX(-32px); }
  .skill.scroll-hidden     { transform: scale(0.85); }
  .scroll-visivel          { opacity: 1 !important; transform: none !important; }

  /* fotos: entrada com clip-path (revelação de baixo pra cima) */
  .foto-escondida {
    clip-path: inset(100% 0 0 0);
    transition: clip-path 1.1s cubic-bezier(0.16,1,0.3,1),
                filter 1.1s ease;
    filter: grayscale(100%) brightness(0.6);
    overflow: hidden;
  }
  .foto-revelada {
    clip-path: inset(0% 0 0 0) !important;
    filter: grayscale(100%) brightness(1) !important;
  }

  /* hover nas fotos: zoom interno */
  .foto-esquerda img,
  .foto-direita  img {
    transition: transform 0.6s cubic-bezier(0.16,1,0.3,1),
                filter 0.4s ease;
    will-change: transform;
  }
  .foto-esquerda:hover img,
  .foto-direita:hover  img {
    transform: scale(1.07);
    filter: grayscale(0%) brightness(1.05) !important;
  }

  /* parallax: seção com prop customizada */
  .secao { --scroll-ratio: 0; }
`;
document.head.appendChild(style);

/* ── JS: Sobre Mim ── */
(function initSobre() {

  /* ── REVELAR IMAGEM ao scroll ── */
  const imgObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revelada');
        imgObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.sobre-imagem').forEach(el => imgObs.observe(el));

  /* ── REVELAR PARÁGRAFOS ao scroll ── */
  const paraObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sobre-paragrafo').forEach((p, i) => {
          setTimeout(() => p.classList.add('visivel'), i * 140);
        });
        paraObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.sobre-texto').forEach(el => paraObs.observe(el));

  /* ── SPLIT POR PALAVRA nos parágrafos ── */
  document.querySelectorAll('.sobre-paragrafo').forEach(p => {
    p.innerHTML = p.innerText
      .split(' ')
      .map(w => `<span class="palavra">${w}</span>`)
      .join(' ');
  });

  /* ── PARALLAX: imagem sobe levemente no scroll ── */
  const sobreImg = document.querySelector('.sobre-imagem img');
  window.addEventListener('scroll', () => {
    if (!sobreImg) return;
    const rect = sobreImg.closest('.sobre-imagem').getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const ratio = rect.top / window.innerHeight;
    sobreImg.style.transform = `scale(1.08) translateY(${ratio * 30}px)`;
  }, { passive: true });

  /* ── TILT 3D na imagem com o mouse ── */
  const sobreWrapper = document.querySelector('.sobre-imagem');
  if (sobreWrapper) {
    sobreWrapper.addEventListener('mousemove', e => {
      const r  = sobreWrapper.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
      sobreWrapper.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    sobreWrapper.addEventListener('mouseleave', () => {
      sobreWrapper.style.transform = '';
    });
    sobreWrapper.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
  }

})();