const ORDERS_API = 'http://localhost:5000/api/orders';

const CART_KEY = 'osrah_cart_preview';
const LOCAL_ORDERS_KEY = 'osrah_client_orders';

function num(text: string) {
  return (
    Number(
      (text || '')
        .replace(/[^0-9.,]/g, '')
        .replace(',', '.')
    ) || 0
  );
}

function readMirrorCart() {
  try {
    return JSON.parse(
      sessionStorage.getItem(CART_KEY) || '[]'
    );
  } catch {
    return [];
  }
}

function getDeliveryInputs() {
  return Array.from(
    document.querySelectorAll<HTMLInputElement>(
      '.delivery-fields input'
    )
  );
}

function field(name: string) {
  const inputs = getDeliveryInputs();

  const values: Record<string, string> = {
    fullName: inputs[0]?.value?.trim() || '',
    phone: inputs[1]?.value?.trim() || '',
    address: inputs[2]?.value?.trim() || '',
    city: inputs[3]?.value?.trim() || ''
  };

  return values[name] || '';
}

function payItems() {
  const rows = Array.from(
    document.querySelectorAll(
      '.x-pay main > section article'
    )
  );

  return rows
    .map(row => {
      const name =
        row.querySelector('h3')
          ?.textContent
          ?.trim() || '';

      const category =
        row.querySelector('small')
          ?.textContent
          ?.trim() || '';

      const price =
        num(
          row.querySelector('b')
            ?.textContent || ''
        );

      const image =
        (
          row.querySelector('img') as
            HTMLImageElement | null
        )?.src || '';

      return {
        name,
        category,
        price,
        image,
        qty: 1
      };
    })
    .filter(item => item.name);
}

function readLocalOrders() {
  try {
    return JSON.parse(
      localStorage.getItem(
        LOCAL_ORDERS_KEY
      ) || '[]'
    );
  } catch {
    return [];
  }
}

function writeLocalOrders(
  orders: any[]
) {
  localStorage.setItem(
    LOCAL_ORDERS_KEY,
    JSON.stringify(orders)
  );
}

function getPaymentMethod() {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      '.x-pay aside > button'
    )
  );

  const active =
    buttons.find(button =>
      button.classList.contains('active')
    );

  return (
    active?.textContent?.trim() ||
    'Carte bancaire'
  );
}

function getTotals() {
  const rows = Array.from(
    document.querySelectorAll(
      '.x-pay aside p'
    )
  );

  const subtotalRow =
    rows.find(row =>
      row.textContent?.includes(
        'Sous-total'
      )
    );

  const shippingRow =
    rows.find(row =>
      row.textContent?.includes(
        'Livraison'
      )
    );

  const totalRow =
    document.querySelector(
      '.x-pay aside .total'
    );

  const subtotal =
    num(
      subtotalRow?.textContent || ''
    );

  const shippingText =
    shippingRow?.textContent || '';

  const shipping =
    shippingText
      .toLowerCase()
      .includes('gratuite')
      ? 0
      : num(shippingText);

  const total =
    num(totalRow?.textContent || '') ||
    subtotal + shipping;

  return {
    subtotal,
    shipping,
    total
  };
}

let saving = false;

async function saveOrder() {
  if (saving) return;

  const paymentPage =
    document.querySelector('.x-pay');

  if (!paymentPage) return;

  let items = payItems();

  if (!items.length) {
    const fallback =
      readMirrorCart();

    items = fallback.map(
      (product: any) => ({
        name:
          product.name || 'Produit',

        price:
          Number(
            product.price || 0
          ),

        qty:
          Number(
            product.qty || 1
          ),

        image:
          product.image || '',

        category:
          product.category || ''
      })
    );
  }

  if (!items.length) {
    console.log(
      'Aucun produit trouvé'
    );

    return;
  }

  const customer = {
    name:
      field('fullName') ||
      'Client OSRAH',

    phone:
      field('phone'),

    address:
      field('address'),

    city:
      field('city'),

    email:
      'client@osrah.ma'
  };

  const payment_method =
    getPaymentMethod();

  const {
    subtotal,
    shipping,
    total
  } = getTotals();

  const clientKey =
    `LOCAL-${Date.now()}`;

  const localOrder = {
    id:
      Date.now(),

    reference:
      clientKey,

    client_key:
      clientKey,

    customer,

    items,

    payment_method,

    subtotal,

    shipping,

    total,

    status:
      'Nouvelle',

    created_at:
      new Date().toISOString(),

    local_only:
      true
  };

  saving = true;

  try {
    const localOrders =
      readLocalOrders();

    localOrders.unshift(
      localOrder
    );

    writeLocalOrders(
      localOrders
    );

    sessionStorage.setItem(
      'osrah_last_order_saved',
      '1'
    );

    const response =
      await fetch(
        ORDERS_API,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            customer,
            items,
            payment_method,
            subtotal,
            shipping,
            total
          })
        }
      );

    if (!response.ok) {
      console.error(
        'Erreur backend:',
        response.status
      );

      return;
    }

    const data =
      await response.json();

    const orders =
      readLocalOrders();

    const index =
      orders.findIndex(
        (order: any) =>
          order.client_key ===
          clientKey
      );

    if (index >= 0) {
      orders[index] = {
        ...orders[index],

        ...(data.order || {}),

        client_key:
          clientKey,

        local_only:
          false
      };

      writeLocalOrders(
        orders
      );
    }

    sessionStorage.removeItem(
      CART_KEY
    );

    console.log(
      'Commande enregistrée',
      data.order
    );

  } catch (error) {
    console.error(
      'Erreur commande:',
      error
    );
  } finally {
    saving = false;
  }
}

document.addEventListener(
  'click',
  event => {
    const target =
      event.target as
        HTMLElement | null;

    const confirm =
      target?.closest(
        '.x-pay .confirm'
      ) as
        HTMLButtonElement | null;

    if (!confirm) return;

    if (confirm.disabled) return;

    void saveOrder();
  },
  true
);

export {};