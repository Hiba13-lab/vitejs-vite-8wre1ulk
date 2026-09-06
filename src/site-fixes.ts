const SOLAR_FALLBACK = '/spf50.svg';

function fixSolarImages() {
  document.querySelectorAll<HTMLImageElement>('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    const alt = (img.getAttribute('alt') || '').toLowerCase();
    const parentText = (img.closest('button, article, section')?.textContent || '').toLowerCase();
    const isSolar = src.includes('ecran_solaire') || alt.includes('solaire') || parentText.includes('spf 50') || parentText.includes('spf50');
    if (!isSolar) return;

    img.addEventListener('error', () => {
      if (!img.src.endsWith('/spf50.svg')) img.src = SOLAR_FALLBACK;
    }, { once: true });

    if (img.complete && img.naturalWidth === 0) img.src = SOLAR_FALLBACK;
  });

  document.querySelectorAll<HTMLButtonElement>('.x-cats button').forEach(button => {
    if (button.textContent?.trim().toLowerCase() !== 'solaire') return;
    const img = button.querySelector<HTMLImageElement>('img');
    if (img) img.src = SOLAR_FALLBACK;
  });
}

const observer = new MutationObserver(fixSolarImages);
observer.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', fixSolarImages);
window.setTimeout(fixSolarImages, 100);
window.setTimeout(fixSolarImages, 700);
