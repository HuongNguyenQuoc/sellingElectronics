export const ACCESSORY_TAGS = [
  "headphone",
  "mouse",
  "keyboard",
  "powerbank",
  "webcam",
  "smartwatch",
  "accessory",
];

export const getProductId = (product) => {
  if (typeof product === "string") return product;
  return product?._id || product?.id;
};

export const hasTag = (product, tag) => {
  return Array.isArray(product?.tags) && product.tags.includes(tag);
};

export const hasAnyTag = (product, tags) => {
  return tags.some((tag) => hasTag(product, tag));
};

export const isAccessoryProduct = (product) => {
  if (hasAnyTag(product, ACCESSORY_TAGS)) return true;
  return !hasTag(product, "smartphone") && !hasTag(product, "laptop");
};

export const getProductCategory = (product) => {
  if (hasTag(product, "smartphone")) return "smartphone";
  if (hasTag(product, "laptop")) return "laptop";
  return "accessory";
};

export const getUniqueBrands = (products) => {
  return [
    ...new Set(
      products
        .map((product) => product.brandName)
        .filter(Boolean),
    ),
  ];
};

export const sortByPrice = (products, sortOrder) => {
  return [...products].sort((a, b) => {
    if (sortOrder === "desc") return (b.price || 0) - (a.price || 0);
    return (a.price || 0) - (b.price || 0);
  });
};

export const getOriginalPrice = (price = 0, discountPercentage = 0) => {
  if (!discountPercentage) return price;
  return price / (1 - discountPercentage / 100);
};

export const isDiscountedProduct = (product) => {
  return Number(product?.discountPercentage || 0) > 0;
};

export const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};
