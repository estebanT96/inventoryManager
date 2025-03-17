import { create } from 'zustand';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  expiration: string;
  stock: number;
  checked: boolean;
}

interface StoreState {
  products: Product[];
  totalPages: number;
  totalProducts: number;  // ✅ ADD THIS
  currentPage: number;
  fetchProducts: (page?: number, size?: number) => Promise<void>;
  searchFilters: {
    name: string;
    category: string;
    availability: string;
  };
  isSearchTriggered: boolean;
  setSearchFilters: (filters: Partial<StoreState["searchFilters"]>) => void;
  clearSearchFilters: () => void;
  toggleSearchTriggered: () => void;
  toggleChecked: (id: number) => void;
  addProduct: (product: Omit<Product, "id" | "checked">) => void;
  editProduct: (id: number, updatedProduct: Omit<Product, "id" | "checked">) => void;
  deleteProduct: (id: number) => void;
  getTotalProductsInStock: (category: string) => number;
  getTotalValueInStock: (category: string) => number;
  getAveragePriceInStock: (category: string) => number;
}

const useStore = create<StoreState>((set, get) => ({
  products: [],
  totalPages: 1,
  totalProducts: 0,
  currentPage: 0,

  fetchProducts: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`http://localhost:9090/inventory/products?page=${page}&size=${size}`);
  
      // 🔥 Ensure we extract the correct structure
      const fetchedProducts = response.data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.unitPrice ?? null,  // Ensure default values
        expiration: product.expirationDate ?? null,
        stock: product.quantityInStock ?? null,  // Ensure correct stock field
        checked: false, // Default unchecked
      }));
  
      set({
        products: fetchedProducts,  // ✅ Assign correct values from backend
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
        currentPage: page,
      });
  
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },


  searchFilters: {
    name: '',
    category: '',
    availability: '',
  },

  isSearchTriggered: false,
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters },
  })),
  
  clearSearchFilters: () => set(() => ({
    searchFilters: {
      name: '',
      category: '',
      availability: '',
    },
    isSearchTriggered: false,
  })),

  toggleSearchTriggered: () => set((state) => ({
    isSearchTriggered: !state.isSearchTriggered, // Still a boolean, but will always trigger an update
  })),
  

  toggleChecked: (id) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id
        ? { ...product, checked: !product.checked, stock: product.checked ? 10 : 0 }
        : product
    ),
  })),

  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now(), checked: false }],
  })),

  editProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    ),
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((product) => product.id !== id),
  })),

  getTotalProductsInStock: (category: string) => {
    const products = get().products.filter(
      (product: Product) => category === "Overall" || product.category === category
    );
    return products.reduce((total: number, product: Product) => total + product.stock, 0);
  },
  
  getTotalValueInStock: (category: string) => {
    const products = get().products.filter(
      (product: Product) => category === "Overall" || product.category === category
    );
    return products.reduce((total: number, product: Product) => total + product.price * product.stock, 0);
  },
  

  getAveragePriceInStock: (category: string) => {
    const products = get().products.filter(
      (product: Product) => category === "Overall" || product.category === category
    );
    const totalValue = products.reduce(
      (total: number, product: Product) => total + product.price * product.stock,
      0
    );
    const totalStock = products.reduce(
      (total: number, product: Product) => total + product.stock,
      0
    );
    return totalStock ? totalValue / totalStock : 0;
  },
}));

export default useStore;