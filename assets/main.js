const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('.site-menu');
const themeToggle = document.querySelector('.theme-toggle');
const repoGrid = document.querySelector('#repo-grid');

if (menuToggle && siteMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const preferredTheme = localStorage.getItem('theme');
if (preferredTheme === 'light') {
  document.body.classList.add('light');
}

const updateThemeButton = () => {
  if (!themeToggle) return;
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? 'Dark Mode' : 'Light Mode';
};

updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeButton();
  });
}

const renderRepos = (repos) => {
  if (!repoGrid) return;

  if (!repos.length) {
    repoGrid.innerHTML = '<article class="repo-card">No public repositories found yet.</article>';
    return;
  }

  repoGrid.innerHTML = repos.map((repo) => {
    const description = repo.description || 'No description available yet.';
    const stars = repo.stargazers_count || 0;
    const language = repo.language || 'Mixed';

    return `
      <article class="repo-card reveal visible">
        <p class="repo-meta">${language} · ${stars} stars</p>
        <h3>${repo.name}</h3>
        <p>${description}</p>
        <a href="${repo.html_url}" target="_blank" rel="noreferrer">View Repository</a>
      </article>
    `;
  }).join('');
};

const loadRepositories = async () => {
  if (!repoGrid) return;

  try {
    const response = await fetch('https://api.github.com/users/NexomaLabs/repos?sort=updated&per_page=6');

    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }

    const data = await response.json();
    const filtered = data
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    renderRepos(filtered);
  } catch (error) {
    repoGrid.innerHTML = `
      <article class="repo-card">
        <h3>Unable to load repositories right now.</h3>
        <p>Please visit the organization page directly while the API is unavailable.</p>
        <a href="https://github.com/NexomaLabs" target="_blank" rel="noreferrer">Open GitHub Organization</a>
      </article>
    `;
  }
};

loadRepositories();

const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => observer.observe(item));
}
