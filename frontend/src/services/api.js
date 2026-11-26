const API_URL = "http://localhost:5001/api";

async function parseResponse(res) {
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  return {
    ok: res.ok,
    status: res.status,
    ...data
  };
}

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
  const res = await fetch(`${API_URL}/cart`, {
    credentials: 'include'
  });
  return parseResponse(res);
}

export async function addToCartApi(foodId, quantity = 1) {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ foodId, quantity })
  });
  return parseResponse(res);
}

export async function updateCartItemApi(foodId, quantity) {
  const res = await fetch(`${API_URL}/cart/items/${foodId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ quantity })
  });
  return parseResponse(res);
}

export async function createOrderApi(payload) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function loginApi(payload) {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function registerApi(payload) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function logoutApi() {
  const res = await fetch(`${API_URL}/auth/signout`, {
    method: 'POST',
    credentials: 'include'
  });
  return parseResponse(res);
}