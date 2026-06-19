import api from './axiosConfig';

const unwrapApiData = (data) => data?.data ?? data;
const notifyCartChanged = () => window.dispatchEvent(new Event('cart-changed'));

export const getCart = async () => {
  const { data } = await api.get('/carts');
  return unwrapApiData(data);
};

export const addCartItem = async ({ productId, colorSelected, quantity }) => {
  const { data } = await api.post('/carts/items', {
    productId,
    colorSelected,
    quantity,
  });
  notifyCartChanged();
  return unwrapApiData(data);
};

export const updateCartItem = async (itemId, quantity) => {
  const { data } = await api.patch(`/carts/items/${itemId}`, {
    quantity,
  });
  notifyCartChanged();
  return unwrapApiData(data);
};

export const removeCartItem = async (itemId) => {
  const { data } = await api.delete(`/carts/items/${itemId}`);
  notifyCartChanged();
  return unwrapApiData(data);
};

export const clearCart = async () => {
  const { data } = await api.delete('/carts');
  notifyCartChanged();
  return unwrapApiData(data);
};
