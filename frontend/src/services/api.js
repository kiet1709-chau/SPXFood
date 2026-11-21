const API_URL = "http://localhost:5001/api";cd

export async function fetchFoods({ q = '', category = '', restaurantId = '', popular = '' } = {}) {
  const params = new URLSearchParams({ q, category, restaurantId, popular });
  const res = await fetch(`${API_URL}/foods?${params.toString()}`);
  return res.json();
}

export async function fetchRestaurants({ q = '', category = '' } = {}) {
  const params = new URLSearchParams({ q, category });
  const res = await fetch(`${API_URL}/restaurants?${params.toString()}`);
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${API_URL}/cart`);
  return res.json();
}

export async function addToCartApi(foodId, quantity = 1) {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foodId, quantity })
  });
  return res.json();
}

export async function updateCartItemApi(foodId, quantity) {
  const res = await fetch(`${API_URL}/cart/items/${foodId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  return res.json();
}

export async function createOrderApi(payload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}