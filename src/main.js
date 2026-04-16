import Modal from 'bootstrap/js/dist/modal';
import './styles/main.scss';

/* Menu variant 1 start */

const header = document.querySelector('[data-menu-root]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const menuPanel = document.querySelector('[data-menu-panel]');
const submenuToggles = document.querySelectorAll('[data-submenu-toggle]');
const menuCloseTriggers = document.querySelectorAll('[data-menu-close], [data-menu-link]');
const requestTopicOutput = document.querySelector('[data-request-topic]');
const requestTopicInput = document.querySelector('[data-request-input]');
const openRequestButtons = document.querySelectorAll('[data-form-topic]');
const forms = document.querySelectorAll('.contact-form');
const successModalElement = document.querySelector('#success-modal');
const desktopMediaQuery = window.matchMedia('(min-width: 992px)');

const successModal = successModalElement
  ? Modal.getOrCreateInstance(successModalElement)
  : null;

const setMenuState = (isOpen) => {
  if (!header || !menuToggle) {
    return;
  }

  header.classList.toggle('site-header--menu-open', isOpen);
  document.body.classList.toggle('is-scroll-locked', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute(
    'aria-label',
    isOpen ? 'Закрыть меню' : 'Открыть меню'
  );

  if (menuPanel) {
    menuPanel.removeAttribute('hidden');
  }
};

const closeNestedMenus = (parent = document) => {
  parent.querySelectorAll('[data-menu-item].is-open').forEach((item) => {
    item.classList.remove('is-open');
  });

  parent.querySelectorAll('[data-submenu-toggle]').forEach((toggle) => {
    toggle.setAttribute('aria-expanded', 'false');
  });
};

const closeMenu = () => {
  setMenuState(false);
  closeNestedMenus(header ?? document);
};

if (menuPanel && !desktopMediaQuery.matches) {
  menuPanel.setAttribute('hidden', '');
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const shouldOpen = !header?.classList.contains('site-header--menu-open');
    setMenuState(Boolean(shouldOpen));
  });
}

menuCloseTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!desktopMediaQuery.matches) {
      closeMenu();
    }
  });
});

const handleSubmenuToggle = (toggle) => {
  const currentItem = toggle.closest('[data-menu-item]');
  const currentList = currentItem?.parentElement;
  const isOpen = currentItem?.classList.contains('is-open');

  if (!currentItem || !currentList) {
    return;
  }

  currentList.querySelectorAll(':scope > [data-menu-item].is-open').forEach((item) => {
    if (item !== currentItem) {
      item.classList.remove('is-open');
      item
        .querySelectorAll(':scope > .menu__entry > .menu__toggle')
        .forEach((siblingToggle) => siblingToggle.setAttribute('aria-expanded', 'false'));
    }
  });

  currentItem.classList.toggle('is-open', !isOpen);
  toggle.setAttribute('aria-expanded', String(!isOpen));
};

submenuToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    handleSubmenuToggle(toggle);
  });

  toggle.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    handleSubmenuToggle(toggle);
  });
});

document.addEventListener('click', (event) => {
  if (!header || desktopMediaQuery.matches === false) {
    return;
  }

  if (!header.contains(event.target)) {
    closeNestedMenus(header);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  closeMenu();
});

desktopMediaQuery.addEventListener('change', (event) => {
  if (!menuPanel) {
    return;
  }

  if (event.matches) {
    menuPanel.removeAttribute('hidden');
    document.body.classList.remove('is-scroll-locked');
  } else if (!header?.classList.contains('site-header--menu-open')) {
    menuPanel.setAttribute('hidden', '');
  }
});

openRequestButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const topic = button.dataset.formTopic?.trim();

    if (!topic) {
      return;
    }

    if (requestTopicOutput) {
      requestTopicOutput.textContent = topic;
    }

    if (requestTopicInput) {
      requestTopicInput.value = topic;
    }
  });
});

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const modalElement = form.closest('.modal');
    const currentModal = modalElement
      ? Modal.getOrCreateInstance(modalElement)
      : null;

    form.reset();
    currentModal?.hide();
    successModal?.show();
  });
});

/* Menu variant 1 end */


/* Menu variant 2 start */

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.js-header-bottom-toggle');
  const menu = event.target.closest('.header-bottom-menu');

  if (!toggle) {
    if (!menu) {
      document.querySelectorAll('.header-bottom-menu__item.is-open').forEach((item) => {
        item.classList.remove('is-open');
        item
          .querySelectorAll('.js-header-bottom-toggle')
          .forEach((button) => button.setAttribute('aria-expanded', 'false'));
      });
    }
    return;
  }

  const item = toggle.closest('.header-bottom-menu__item--parent');
  if (!item || window.innerWidth > 991) {
    return;
  }

  event.preventDefault();

  const isOpen = item.classList.contains('is-open');

  document.querySelectorAll('.header-bottom-menu__item.is-open').forEach((openedItem) => {
    if (openedItem !== item) {
      openedItem.classList.remove('is-open');
      openedItem
        .querySelectorAll('.js-header-bottom-toggle')
        .forEach((button) => button.setAttribute('aria-expanded', 'false'));
    }
  });

  item.classList.toggle('is-open', !isOpen);
  toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
});

document.querySelectorAll('.js-header-bottom-toggle').forEach((toggle) => {
  toggle.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    toggle.click();
  });
});

/* Menu variant 2 end */
