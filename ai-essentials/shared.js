const STORAGE_KEY = 'aiEssentialsProgress';

const pages = [
  {
    id: 'overview',
    title: 'Overview',
    href: 'index.html',
  },
  {
    id: 'terms',
    title: 'AI Terminology',
    href: 'terminology.html',
  },
];

const coreConcepts = [
  {
    id: 'prompts-temperature',
    title: 'Prompts & Temperature',
    href: 'activity-prompts-temperature.html',
  },
  {
    id: 'hallucinations-rag',
    title: 'Hallucinations & RAG',
    href: 'activity-hallucinations-rag.html',
  },
  {
    id: 'tokens-context',
    title: 'Tokens & Context Windows',
    href: 'activity-tokens-context.html',
  },
];

const getProgress = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
};

const saveProgress = (progress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const setCompletion = (activityId, completed) => {
  const progress = getProgress();
  progress[activityId] = { completed };
  saveProgress(progress);
};

const applyCompletionIndicators = () => {
  const progress = getProgress();

  document.querySelectorAll('[data-activity-status]').forEach((element) => {
    const activityId = element.dataset.activityStatus;
    const completed = progress[activityId]?.completed;
    element.textContent = completed ? 'Completed' : 'Not completed';
    element.classList.toggle('is-complete', Boolean(completed));
  });

  document.querySelectorAll('[data-activity-card]').forEach((card) => {
    const activityId = card.dataset.activityCard;
    const completed = progress[activityId]?.completed;
    card.classList.toggle('is-complete', Boolean(completed));
  });

  document.querySelectorAll('.site-nav a[data-activity-link]').forEach((link) => {
    const activityId = link.dataset.activityLink;
    const completed = progress[activityId]?.completed;
    link.classList.toggle('completed', Boolean(completed));
  });
};

const updateCompletionButton = (button, completed) => {
  if (!button) {
    return;
  }

  const feedback = button
    .closest('.completion-section')
    ?.querySelector('.completion-feedback');

  if (completed) {
    button.textContent = 'Mark as Incomplete';
    button.classList.add('completed');
    feedback?.classList.add('show');
    setTimeout(() => feedback?.classList.remove('show'), 3000);
  } else {
    button.textContent = 'Mark as Complete';
    button.classList.remove('completed');
  }
};

const initCompletionButton = () => {
  const button = document.querySelector('[data-activity-id]');
  if (!button) {
    return;
  }

  const activityId = button.dataset.activityId;
  const progress = getProgress();
  const completed = progress[activityId]?.completed;
  updateCompletionButton(button, completed);

  button.addEventListener('click', () => {
    const currentProgress = getProgress();
    const isCompleted = Boolean(currentProgress[activityId]?.completed);
    setCompletion(activityId, !isCompleted);
    updateCompletionButton(button, !isCompleted);
    applyCompletionIndicators();
  });
};

const initNavigation = () => {
  const navContainer = document.querySelector('[data-nav]');
  if (!navContainer) {
    return;
  }

  const currentPage = document.body.dataset.page;

  pages.forEach((page) => {
    const link = document.createElement('a');
    link.href = page.href;
    link.textContent = page.title;

    if (currentPage === page.id) {
      link.classList.add('active');
    }

    navContainer.appendChild(link);
  });

  const dropdownGroup = document.createElement('div');
  dropdownGroup.className = 'nav-group';

  const dropdownToggle = document.createElement('a');
  dropdownToggle.href = '#';
  dropdownToggle.className = 'nav-dropdown-toggle';
  dropdownToggle.textContent = 'Core Concepts';
  dropdownToggle.setAttribute('aria-haspopup', 'true');
  dropdownToggle.setAttribute('aria-expanded', 'false');
  dropdownToggle.addEventListener('click', (event) => {
    event.preventDefault();
  });

  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'nav-dropdown';

  coreConcepts.forEach((page) => {
    const link = document.createElement('a');
    link.href = page.href;
    link.textContent = page.title;
    link.dataset.activityLink = page.id;
    if (currentPage === page.id) {
      link.classList.add('active');
    }
    dropdownMenu.appendChild(link);
  });

  dropdownGroup.appendChild(dropdownToggle);
  dropdownGroup.appendChild(dropdownMenu);
  navContainer.appendChild(dropdownGroup);

  applyCompletionIndicators();
};

const initCopyButtons = () => {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => {
      const promptId = button.dataset.copy;
      const promptText = document.getElementById(promptId)?.textContent;
      if (!promptText) {
        return;
      }

      navigator.clipboard.writeText(promptText).then(() => {
        button.textContent = '✓ Copied!';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = 'Copy Prompt';
          button.classList.remove('copied');
        }, 2000);
      });
    });
  });
};

const initFlipCards = () => {
  document.querySelectorAll('.flip-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCompletionButton();
  initCopyButtons();
  initFlipCards();
  applyCompletionIndicators();
});
