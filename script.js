// =========================================
// QILAN — Site Interactions
// =========================================

(function () {
  'use strict';

  // --- Persistent knowledge-base navigation ---
  // Keep every published page visible from one calm, GitBook-like index.
  function buildKnowledgeSidebar() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const inPosts = path.indexOf('/posts/') !== -1;
    const currentFile = path.split('/').pop() || 'index.html';
    const currentPage = inPosts ? 'posts/' + currentFile : currentFile;
    const prefix = inPosts ? '../' : '';

    const groups = [
      {
        label: '开始',
        items: [
          ['index.html', '首页 · 从这里开始'],
          ['posts/what-i-build-and-how.html', '我在做什么，以及怎么做'],
          ['posts/personal-knowledge-flywheel-2026.html', '2026 个人知识飞轮']
        ]
      },
      {
        label: '项目与实践',
        items: [
          ['projects.html', '项目总览'],
          ['products.html', '个人产品'],
          ['posts/hermes-rag-finance-system.html', 'Hermes 财经 RAG'],
          ['posts/ai-writing-automation.html', 'AI 写作流水线'],
          ['posts/content-distribution-workflow.html', '多平台内容分发'],
          ['posts/github-pages-migration.html', 'GitHub Pages 迁移']
        ]
      },
      {
        label: '阅读与判断',
        items: [
          ['reading.html', '阅读书架'],
          ['posts/reading-list-for-building.html', 'AI 与独立开发书单'],
          ['posts/how-to-choose-an-industry.html', '如何选择行业'],
          ['investment.html', '投资导航'],
          ['posts/investment-navigation.html', '投资入门与风险边界']
        ]
      },
      {
        label: '公开输出',
        items: [
          ['articles.html', '全部文章'],
          ['media.html', '自媒体账号']
        ]
      }
    ];

    function renderGroup(group) {
      const links = group.items.map(function (item) {
        const isActive = item[0] === currentPage;
        return '<a class="knowledge-link' + (isActive ? ' is-active' : '') + '" href="' +
          prefix + item[0] + '"' + (isActive ? ' aria-current="page"' : '') +
          '><span>' + item[1] + '</span></a>';
      }).join('');

      return '<section class="knowledge-group"><h2>' + group.label + '</h2>' + links + '</section>';
    }

    const sidebar = document.createElement('aside');
    sidebar.className = 'knowledge-sidebar';
    sidebar.id = 'knowledgeSidebar';
    sidebar.setAttribute('aria-label', '全部内容目录');
    sidebar.innerHTML =
      '<div class="knowledge-brand">' +
        '<a href="' + prefix + 'index.html" aria-label="返回起岚首页">' +
          '<span class="knowledge-mark">岚</span>' +
          '<span><strong>起岚 QILAN</strong><small>从笔记到代码</small></span>' +
        '</a>' +
      '</div>' +
      '<label class="knowledge-search">' +
        '<span aria-hidden="true">⌕</span>' +
        '<input type="search" placeholder="搜索全部内容" aria-label="搜索全部内容">' +
      '</label>' +
      '<nav class="knowledge-nav" aria-label="知识库目录">' +
        groups.map(renderGroup).join('') +
      '</nav>' +
      '<div class="knowledge-foot">' +
        '<p>持续记录真实过程，区分已完成、进行中和待验证。</p>' +
        '<div><a href="https://github.com/xiaoyaoqilan" target="_blank" rel="noreferrer">GitHub ↗</a>' +
        '<a href="https://x.com/dss_ws14043" target="_blank" rel="noreferrer">X ↗</a></div>' +
      '</div>';

    const mobileBar = document.createElement('header');
    mobileBar.className = 'knowledge-mobile-bar';
    mobileBar.innerHTML =
      '<a href="' + prefix + 'index.html"><span>岚</span> 起岚 QILAN</a>' +
      '<button type="button" aria-controls="knowledgeSidebar" aria-expanded="false">目录</button>';

    const scrim = document.createElement('div');
    scrim.className = 'knowledge-scrim';
    scrim.setAttribute('aria-hidden', 'true');

    const main = document.querySelector('main, article.article-page');
    if (main && !main.id) main.id = 'main-content';

    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = '跳到正文';

    document.body.classList.add('qilan-docs');
    document.body.insertBefore(skip, document.body.firstChild);
    document.body.insertBefore(scrim, document.body.firstChild);
    document.body.insertBefore(sidebar, document.body.firstChild);
    document.body.insertBefore(mobileBar, document.body.firstChild);

    const menuButton = mobileBar.querySelector('button');
    function setMenu(open) {
      document.body.classList.toggle('knowledge-menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    }

    menuButton.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('knowledge-menu-open'));
    });
    scrim.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    const searchInput = sidebar.querySelector('input[type="search"]');
    searchInput.addEventListener('input', function () {
      const query = this.value.trim().toLocaleLowerCase('zh-CN');
      sidebar.querySelectorAll('.knowledge-group').forEach(function (group) {
        let visible = 0;
        group.querySelectorAll('.knowledge-link').forEach(function (link) {
          const match = !query || link.textContent.toLocaleLowerCase('zh-CN').indexOf(query) !== -1;
          link.hidden = !match;
          if (match) visible += 1;
        });
        group.hidden = visible === 0;
      });
    });
  }

  buildKnowledgeSidebar();

  // --- Navigation scroll effect ---
  const nav = document.getElementById('siteNav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const revealPoint = windowHeight * 0.88;
      if (rect.top < revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  // Run on load and scroll
  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('load', checkReveal);
  // Also run immediately in case elements are already in view
  checkReveal();

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Cursor glow on project cards (subtle) ---
  document.querySelectorAll('.project-card, .service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background =
        'radial-gradient(600px circle at ' +
        x + 'px ' + y + 'px, rgba(200,169,110,0.04), transparent 40%)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

  // --- Counter animation for stats ---
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(function (el) {
      const text = el.textContent.trim();
      // Only animate numeric values
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      if (el.dataset.animated) return;

      const target = parseInt(match[1], 10);
      const suffix = match[2]; // e.g. "+", "K+", etc.
      const duration = 1500;
      const start = performance.now();
      el.dataset.animated = 'true';

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * ease);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Use IntersectionObserver for counter trigger
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(statsSection);
  }
})();
