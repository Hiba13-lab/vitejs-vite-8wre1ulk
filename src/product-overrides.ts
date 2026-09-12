const originalFetch = window.fetch.bind(window);

const normalizeName = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const COFFRET_IMAGE = 'https://osrahcosmetics.ma/cdn/shop/products/DSC00552-01.jpg?v=1768311390';
const HAREEM_IMAGE = 'https://osrahcosmetics.ma/cdn/shop/products/prod01_9399cc11-85e7-4472-9858-eb98c44326f0.jpg?v=1644221233';

window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
  const response = await originalFetch(...args);
  const requestUrl = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';

  if (!requestUrl.includes('localhost:5000/api/products') || !response.ok) {
    return response;
  }

  try {
    const products = await response.clone().json();
    if (!Array.isArray(products)) return response;

    const updated = products.map((product: any) => {
      const key = normalizeName(String(product?.name || ''));

      if (key.includes('eau de parfum elegance')) {
        return {
          ...product,
          name: "Coffret parfum Terre d'Arômes & Hareem",
          description: "Coffret parfum OSRAH avec Terre d'Arômes, Hareem et format sac.",
          price: 660,
          category: 'Parfums',
          image_url: COFFRET_IMAGE,
        };
      }

      if (key.includes('brume corps fleurie')) {
        return {
          ...product,
          name: 'HAREEM - Eau de Parfum 50ml',
          description: 'Eau de parfum Hareem 50 ml, élégante et raffinée.',
          price: 315,
          category: 'Parfums',
          image_url: HAREEM_IMAGE,
        };
      }

      return product;
    });

    const headers = new Headers(response.headers);
    headers.set('content-type', 'application/json');

    return new Response(JSON.stringify(updated), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return response;
  }
};

export {};
