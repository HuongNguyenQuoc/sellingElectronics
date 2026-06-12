import { useEffect, useState } from "react";
import { getProducts } from "../api/productService";
import { getErrorMessage } from "../utils/productUtils";

export const useProducts = (tag) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    void Promise.resolve().then(async () => {
      try {
        const productsFromApi = await getProducts(tag);
        if (isMounted) {
          setProducts(productsFromApi);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Không tải được danh sách sản phẩm."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [tag]);

  return { products, isLoading, error };
};
