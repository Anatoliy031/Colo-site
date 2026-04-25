/* =====================================================================
   ЦОД категории III — общий JS
   ===================================================================== */
(function () {
  'use strict';

  // --- 1. Burger-меню для мобильной шапки ----------------------------
  function initNavToggle() {
    var btn = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Закрытие при клике вне
    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !btn.contains(e.target)) {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Закрытие при клике по ссылке
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Закрытие по Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 2. Подсветка активного пункта навигации -----------------------
  function highlightActiveNav() {
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // --- 3. FAB «в начало» ---------------------------------------------
  function initBackToTop() {
    var btn = document.getElementById('fab-top');
    if (!btn) return;
    var onScroll = function () {
      if (window.scrollY > 300) btn.classList.add('show');
      else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. Подсветка карточек от курсора ------------------------------
  function initCardHover() {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // --- 5. Восстановление позиции прокрутки на главной -----------------
  function initScrollMemory() {
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      try {
        var u = new URL(href, location.href);
        if (u.origin !== location.origin) return;
        var isHtml = /\.html(?:#.*)?$/i.test(u.pathname);
        var isIndex = /(?:^|\/)index\.html$/i.test(u.pathname);
        if (isHtml && !isIndex) {
          sessionStorage.setItem('indexScrollY', String(window.scrollY || 0));
        }
      } catch (e) { /* ignore */ }
    }, { passive: true });

    // На главной — восстанавливаем
    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (path === 'index.html' || path === '') {
      try {
        var y = parseInt(sessionStorage.getItem('indexScrollY') || '0', 10) || 0;
        if (y > 0) {
          window.scrollTo(0, y);
          sessionStorage.removeItem('indexScrollY');
        }
      } catch (e) { /* ignore */ }
    }
  }

  // --- 6. Старт ------------------------------------------------------
  function start() {
    initNavToggle();
    highlightActiveNav();
    initBackToTop();
    initCardHover();
    initScrollMemory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
