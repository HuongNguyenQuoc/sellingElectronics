import api from './axiosConfig';

const unwrapApiData = (data) => data?.data ?? data;

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return unwrapApiData(data);
};

export const getProducts = async (tag) => {
  const { data } = await api.get('/products', {
    params: tag ? { tag } : undefined,
  });

  const products = unwrapApiData(data);
  return Array.isArray(products) ? products : [];
};
