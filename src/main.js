import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'bootstrap/js/dist/modal';
import './styles/main.scss';

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

  header.classList.toggle('header--menu-open', isOpen);
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
    const shouldOpen = !header?.classList.contains('header--menu-open');
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
        .querySelectorAll(':scope > .menu__entry > [data-submenu-toggle]')
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
  } else if (!header?.classList.contains('header--menu-open')) {
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

/* START: Callback modal files and consents */
document.querySelectorAll('.contact-form').forEach((managedForm) => {
  const callbackSubmitButton = managedForm.querySelector('[data-callback-submit]');

  if (!callbackSubmitButton) {
    return;
  }

  const callbackModalElement = managedForm.closest('.modal');
  const callbackFilesInput = managedForm.querySelector('[data-callback-files-input]');
  const callbackFilesTrigger = managedForm.querySelector('[data-callback-files-trigger]');
  const callbackFilesList = managedForm.querySelector('[data-callback-files-list]');
  const callbackRequiredConsents = managedForm.querySelectorAll('[data-callback-required-consent]');
  let callbackFilesStore = [];

  const getFileKey = (file) => `${file.name}-${file.size}-${file.lastModified}`;

  const syncCallbackSubmitState = () => {
    const isEnabled = [...callbackRequiredConsents].every((checkbox) => checkbox.checked);
    callbackSubmitButton.disabled = !isEnabled;
  };

  const syncCallbackFilesInput = () => {
    if (!callbackFilesInput) {
      return;
    }

    const dataTransfer = new DataTransfer();
    callbackFilesStore.forEach((file) => dataTransfer.items.add(file));
    callbackFilesInput.files = dataTransfer.files;
  };

  const renderCallbackFiles = () => {
    if (!callbackFilesList) {
      return;
    }

    callbackFilesList.innerHTML = '';

    if (callbackFilesStore.length === 0) {
      callbackFilesList.hidden = true;
      return;
    }

    callbackFilesList.hidden = false;

    callbackFilesStore.forEach((file, index) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      const removeButton = document.createElement('button');

      name.textContent = file.name;

      removeButton.type = 'button';
      removeButton.innerHTML = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_85_1788" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="19" height="19">
<rect width="18.9922" height="18.9922" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_85_1788)">
<path d="M4.96313 14.6611L4.33008 14.028L8.86203 9.49606L4.33008 4.96411L4.96313 4.33105L9.49508 8.86301L14.027 4.33105L14.6601 4.96411L10.1281 9.49606L14.6601 14.028L14.027 14.6611L9.49508 10.1291L4.96313 14.6611Z" fill="black"/>
</g>
</svg>`;
      removeButton.dataset.callbackFileRemove = String(index);

      item.append(name, removeButton);
      callbackFilesList.append(item);
    });
  };

  const resetCallbackFormState = () => {
    callbackFilesStore = [];
    syncCallbackFilesInput();
    renderCallbackFiles();
    syncCallbackSubmitState();
  };

  callbackFilesTrigger?.addEventListener('click', () => {
    callbackFilesInput?.click();
  });

  callbackFilesInput?.addEventListener('change', (event) => {
    const nextFiles = Array.from(event.target.files ?? []);

    nextFiles.forEach((file) => {
      const exists = callbackFilesStore.some((storedFile) => getFileKey(storedFile) === getFileKey(file));

      if (!exists) {
        callbackFilesStore.push(file);
      }
    });

    syncCallbackFilesInput();
    renderCallbackFiles();
    event.target.value = '';
  });

  callbackFilesList?.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-callback-file-remove]');

    if (!removeButton) {
      return;
    }

    const fileIndex = Number(removeButton.dataset.callbackFileRemove);

    callbackFilesStore = callbackFilesStore.filter((_, index) => index !== fileIndex);
    syncCallbackFilesInput();
    renderCallbackFiles();
  });

  callbackRequiredConsents.forEach((checkbox) => {
    checkbox.addEventListener('change', syncCallbackSubmitState);
  });

  managedForm.addEventListener('submit', () => {
    window.setTimeout(resetCallbackFormState, 0);
  });

  callbackModalElement?.addEventListener('hidden.bs.modal', resetCallbackFormState);

  syncCallbackFilesInput();
  renderCallbackFiles();
  syncCallbackSubmitState();
});
/* END: Callback modal files and consents */

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
