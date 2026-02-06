(() => {
  const banner = document.getElementById("cookieConsent");
  const acceptButton = document.getElementById("acceptCookies");
  const STORAGE_KEY = "cookiesAccepted";

  if (!banner || !acceptButton) {
    return;
  }

  const getStoredConsent = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return null;
    }
  };

  const hasConsent = () => getStoredConsent() === "true" || document.cookie.includes("cookiesAccepted=true");

  if (!hasConsent()) {
    banner.style.display = "block";
  } else {
    banner.style.display = "none";
  }

  acceptButton.addEventListener("click", function () {
    document.cookie = "cookiesAccepted=true; max-age=" + 60 * 60 * 24 * 30 + "; path=/";
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (_) {
      // Ignore write failures (private mode, etc.)
    }
    banner.style.display = "none";
    initializeGoogleAnalytics();
  });

  function initializeGoogleAnalytics() {
    if (!document.cookie.includes("cookiesAccepted=true") || window.__gaInitialized) {
      return;
    }

    window.__gaInitialized = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-C62ZHL5CT3";
    document.head.appendChild(script);

    script.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-C62ZHL5CT3");
    };
  }

  if (hasConsent()) {
    initializeGoogleAnalytics();
  }
})();
