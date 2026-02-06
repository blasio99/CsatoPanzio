const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const templateDir = path.join(rootDir, 'src', 'templates');

const templates = {
  home: fs.readFileSync(path.join(templateDir, 'home.html'), 'utf8'),
  location: fs.readFileSync(path.join(templateDir, 'location.html'), 'utf8'),
  privacy: fs.readFileSync(path.join(templateDir, 'privacy.html'), 'utf8')
};

const languages = [
  {
    code: 'hu',
    langAttr: 'hu',
    baseDir: '',
    homeHref: '/',
    joseniHref: '/joseni',
    borzontHref: '/borzont',
    privacyHref: '/privacy-policy'
  },
  {
    code: 'en',
    langAttr: 'en',
    baseDir: 'en',
    homeHref: '/en',
    joseniHref: '/en/joseni',
    borzontHref: '/en/borzont',
    privacyHref: '/en/privacy-policy'
  },
  {
    code: 'ro',
    langAttr: 'ro',
    baseDir: 'ro',
    homeHref: '/ro',
    joseniHref: '/ro/joseni',
    borzontHref: '/ro/borzont',
    privacyHref: '/ro/privacy-policy'
  }
];

const locationSections = {
  joseni: [
    {
      key: 'whole',
      images: ['1.webp', '2.webp'],
      hasPlacement: false,
      hasCount: false
    },
    {
      key: 'room3',
      images: ['room3.webp', 'bathroom.webp'],
      hasPlacement: true,
      hasCount: true
    },
    {
      key: 'apartmentUp',
      images: ['room4.webp', 'bathroom.webp', 'living4.webp'],
      hasPlacement: true,
      hasCount: true
    },
    {
      key: 'apartmentDown',
      images: ['room4.webp', 'living4jos.webp', 'tub.webp'],
      hasPlacement: true,
      hasCount: true
    }
  ],
  borzont: [
    {
      key: 'whole',
      images: ['1.webp', '2.webp', '3.webp'],
      hasPlacement: false,
      hasCount: false
    },
    {
      key: 'rooms',
      images: ['room1.webp', 'room2.webp', 'room3.webp', 'room4.webp', 'bathroom1.webp'],
      hasPlacement: true,
      hasCount: true
    }
  ]
};

const locationPages = [
  {
    key: 'joseni',
    imageFolder: 'joseni',
    bookingLink: 'https://www.booking.com/hotel/ro/csato-panzio-pensiunea-csato.html?lang=xu'
  },
  {
    key: 'borzont',
    imageFolder: 'borzont',
    bookingLink: 'https://www.booking.com/hotel/ro/pensiunea-csato-borzont-csato-panzio-borzont.html'
  }
];

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function render(template, vars) {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    if (!(key in vars)) {
      throw new Error(`Missing template variable: ${key}`);
    }
    return vars[key];
  });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, stripTranslationFallbacks(content), 'utf8');
  console.log(`Built ${toPosix(path.relative(rootDir, filePath))}`);
}

function buildPath(lang, ...segments) {
  const parts = [rootDir];
  if (lang.baseDir) {
    parts.push(lang.baseDir);
  }
  return path.join(...parts, ...segments);
}

function computeAssetBase(outputFile) {
  const relative = path.relative(path.dirname(outputFile), rootDir);
  if (!relative || relative === '.') {
    return '';
  }
  const normalized = toPosix(relative);
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function buildImageMarkup(assetBase, folder, image) {
  return `              <img src="${assetBase}assets/img/${folder}/${image}" class="img-fluid" alt="">`;
}

function buildLocationSectionsMarkup(pageKey, assetBase, folder, sections, bookingLink) {
  const bookingHref = bookingLink || 'https://www.booking.com/hotel/ro/csato-panzio-pensiunea-csato.html?lang=xu';
  return sections
    .map((section) => {
      const images = section.images.map((image) => buildImageMarkup(assetBase, folder, image)).join('\n');
      const placement = section.hasPlacement
        ? `
              <li>
                <strong data-i18n="lodging.labels.placement">Placement:</strong>
                <span data-i18n="${pageKey}.sections.${section.key}.list.placement" data-i18n-parent="li">Placement</span>
              </li>`
        : '';
      const count = section.hasCount
        ? `
              <li data-i18n="${pageKey}.sections.${section.key}.count">Count</li>`
        : '';

      return `
    <section id="portfolio-details" class="portfolio-details">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h2 class="portfolio-title" data-i18n="${pageKey}.sections.${section.key}.title">Section title</h2>
            <div class="owl-carousel portfolio-details-carousel">
${images}
            </div>
          </div>

          <div class="col-lg-4 portfolio-info">
            <h3 data-i18n="${pageKey}.sections.${section.key}.subtitle">Section subtitle</h3>
            <ul>
              <li>
                <strong data-i18n="lodging.labels.type">Type:</strong>
                <span data-i18n="${pageKey}.sections.${section.key}.list.type">Type</span>
              </li>
              ${placement}${count}
              <li>
                <strong data-i18n="lodging.labels.book">Book now:</strong>
                <a href="https://forms.gle/5kmLQehRwpPD4J3R7" data-i18n="home.contact.googleForm">Google Form</a>
              </li>
              <li>
                <strong data-i18n="lodging.labels.book">Book now:</strong>
                <a href="${bookingHref}" data-i18n="home.contact.booking">Booking.com</a>
              </li>
            </ul>

            <p data-i18n="${pageKey}.sections.${section.key}.description">Description</p>
          </div>
        </div>
      </div>
    </section>`;
    })
    .join('\n');
}

function stripTranslationFallbacks(html) {
  const htmlBlockRegex = /(<([a-zA-Z0-9:-]+)[^>]*data-i18n-html="[^"]+"[^>]*>)([\s\S]*?)(<\/\2>)/g;
  const textBlockRegex = /(<([a-zA-Z0-9:-]+)[^>]*data-i18n="[^"]+"[^>]*>)([\s\S]*?)(<\/\2>)/g;

  return html
    .replace(htmlBlockRegex, '$1$4')
    .replace(textBlockRegex, '$1$4')
    .replace(/placeholder="[^"]*"(?=[^>]*data-i18n-placeholder)/g, 'placeholder=""')
    .replace(/data-msg="[^"]*"(?=[^>]*data-i18n-msg)/g, 'data-msg=""')
    .replace(/title="[^"]*"(?=[^>]*data-i18n-title)/g, 'title=""');
}

function buildHomePages() {
  languages.forEach((lang) => {
    const output = buildPath(lang, 'index.html');
    const assetBase = computeAssetBase(output);
    const html = render(templates.home, {
      langAttr: lang.langAttr,
      assetBase,
      homeHref: lang.homeHref,
      joseniHref: lang.joseniHref,
      borzontHref: lang.borzontHref,
      privacyHref: lang.privacyHref,
      appLang: lang.code
    });
    writeFile(output, html);
  });
}

function buildLocationPages() {
  languages.forEach((lang) => {
    locationPages.forEach((page) => {
      const pageSections = locationSections[page.key];
      if (!pageSections) {
        throw new Error(`Missing location sections for page ${page.key}`);
      }
      const output = buildPath(lang, page.key, 'index.html');
      const assetBase = computeAssetBase(output);
      const sections = buildLocationSectionsMarkup(page.key, assetBase, page.imageFolder, pageSections, page.bookingLink);
      const html = render(templates.location, {
        langAttr: lang.langAttr,
        assetBase,
        homeHref: lang.homeHref,
        joseniHref: lang.joseniHref,
        borzontHref: lang.borzontHref,
        privacyHref: lang.privacyHref,
        appLang: lang.code,
        pageKey: page.key,
        sections
      });
      writeFile(output, html);
    });
  });
}

function buildPrivacyPages() {
  languages.forEach((lang) => {
    const output = buildPath(lang, 'privacy-policy', 'index.html');
    const assetBase = computeAssetBase(output);
    const html = render(templates.privacy, {
      langAttr: lang.langAttr,
      assetBase,
      homeHref: lang.homeHref,
      joseniHref: lang.joseniHref,
      borzontHref: lang.borzontHref,
      privacyHref: lang.privacyHref,
      appLang: lang.code
    });
    writeFile(output, html);
  });
}

buildHomePages();
buildLocationPages();
buildPrivacyPages();
