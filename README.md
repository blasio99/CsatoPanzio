# WEBSITE for Csató Panzió - Pensiunea Csató

![GitHub repo size](https://img.shields.io/github/repo-size/scottydocs/README-template.md)

## Check it out: www.csatopanzio.ro

The property is in Joseni, Harghita county, Romania.
For reservations call the phone numbers listed on the webpage, or search for us on Booking.com\
\
2021, Spring

## Development workflow

All language variants of every page (home, Joseni, Borzont, and the privacy policy) are generated from shared templates and JSON translation files:

1. Update the locale files under `assets/i18n/texts.<lang>.json` (`en`, `hu`, `ro`). Every string the site uses has a key, so change the value once per language and the templates will pick it up automatically.
2. Adjust markup by editing the templates in `src/templates/` (`home.html`, `location.html`, `privacy.html`). Bind text nodes to translation keys with `data-i18n` / `data-i18n-html` attributes so the runtime can inject the right copy.
3. Run `node scripts/build-pages.js` to regenerate all static HTML files (home + subpages for each language). The script injects correct asset paths, page metadata, and language codes.

This workflow removes the need to hand-edit duplicated HTML and keeps both structure and copy in sync across locales.

## **Contributing**

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.  

- Fork the Project  
- Create your Feature Branch ( **`git checkout -b feature/AmazingFeature`** )
- Commit your Changes ( **`git commit -m 'Add some AmazingFeature'`** )
- Push to the Branch ( **`git push origin feature/AmazingFeature`** )
- Open a Pull Request  

## **Contact**

- Benedek Balázs - [LinkedIn Profile](https://www.linkedin.com/in/balazs-benedek-009322183/)
- E-mail: benedekbalazs1999@gmail.com
- Project Link: [GitHub - Csató Panzió](https://github.com/blasio99/CsatoPanzio)
- WEBSITE: [Csató](http://csatopanzio.ro/)
