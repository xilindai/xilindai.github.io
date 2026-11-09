(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  try {
    const saved = localStorage.getItem('xilin-theme');
    if (saved === 'light' || saved === 'dark') applyTheme(saved);
  } catch {}
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('xilin-theme', theme); } catch {}
  });

  const filters = [...document.querySelectorAll('.filter')];
  const papers = [...document.querySelectorAll('.paper')];
  const resultCount = document.querySelector('.result-count');
  const matches = (paper, category) => category === 'all' || paper.dataset.category === category;
  filters.forEach((filter) => {
    filter.querySelector('span').textContent = papers.filter((paper) => matches(paper, filter.dataset.filter)).length;
  });
  const showCount = () => {
    const visible = papers.filter((paper) => !paper.hidden).length;
    resultCount.textContent = `${visible} publication${visible === 1 ? '' : 's'}`;
  };
  showCount();
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const selected = filter.dataset.filter;
      filters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      papers.forEach((paper) => {
        paper.hidden = !matches(paper, selected);
      });
      showCount();
      updateNavigation();
    });
  });

  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href')));
  const navigation = document.querySelector('.top-nav');
  const updateNavigation = () => {
    let current = sections[0];
    const offset = Math.max(navigation.getBoundingClientRect().height, parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) + 24;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) current = section;
    });
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateNavigation(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();
})();
