(async function () {
  const lang = window.APP_LANG || 'en';
  const assetBase = window.ASSET_BASE || '';
  const localePath = (lc) => `${assetBase}assets/i18n/texts.${lc}.json`;

  async function loadLocale(lc) {
    const response = await fetch(localePath(lc));
    if (!response.ok) {
      throw new Error(`Unable to load translations for ${lc}`);
    }
    return response.json();
  }

  let primary;
  try {
    primary = await loadLocale(lang);
  } catch (err) {
    console.error(err);
    primary = await loadLocale('en');
  }

  const fallback = lang === 'en' ? primary : await loadLocale('en');

  function resolve(source, path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), source);
  }

  function getValue(key) {
    const value = resolve(primary, key);
    if (value !== undefined) {
      return value;
    }
    return resolve(fallback, key);
  }

  function handleOptional(el, value) {
    if (value && value.trim() !== '') {
      return;
    }
    const parentSelector = el.getAttribute('data-i18n-parent');
    if (parentSelector) {
      const parent = el.closest(parentSelector);
      if (parent) parent.classList.add('d-none');
      return;
    }
    el.classList.add('d-none');
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const value = getValue(key);
    if (value === undefined) return;
    el.textContent = value;
    handleOptional(el, value);
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    const value = getValue(key);
    if (value === undefined) return;
    el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!key) return;
    const value = getValue(key);
    if (value === undefined) return;
    el.setAttribute('placeholder', value);
  });

  document.querySelectorAll('[data-i18n-msg]').forEach((el) => {
    const key = el.getAttribute('data-i18n-msg');
    if (!key) return;
    const value = getValue(key);
    if (value === undefined) return;
    el.setAttribute('data-msg', value);
  });

  document.querySelectorAll('[data-i18n-content]').forEach((el) => {
    const key = el.getAttribute('data-i18n-content');
    if (!key) return;
    const value = getValue(key);
    if (value === undefined) return;
    el.setAttribute('content', value);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (!key) return;
    const value = getValue(key);
    if (value === undefined) return;
    el.setAttribute('title', value);
  });

  if (document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
  }

  const metaTitle = getValue('global.meta.title');
  if (metaTitle) {
    document.title = metaTitle;
  }
})();
