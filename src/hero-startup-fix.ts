import heroUrl from './assets/hero.png';

// Preload the local hero image so the storefront is stable from the first paint.
const preload = new Image();
preload.src = heroUrl;

const fixStartupImages = () => {
  document.querySelectorAll<HTMLImageElement>('.x-hero img').forEach((img) => {
    if (img.src !== heroUrl) img.src = heroUrl;
  });

  // Avoid the solar artwork appearing as a large flash before the category layout settles.
  document.querySelectorAll<HTMLImageElement>('.x-cats img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (
      src.includes('ecran-solaire-teinte-spf-50-osrah') ||
      src.includes('huile-bronzage-pailletee-osrah')
    ) {
      img.src = heroUrl;
    }
  });
};

const observer = new MutationObserver(fixStartupImages);
observer.observe(document.documentElement, { childList: true, subtree: true });
fixStartupImages();
