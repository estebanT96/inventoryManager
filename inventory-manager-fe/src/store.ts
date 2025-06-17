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
  totalProducts: number;
  currentPage: number;
  checkedState: Map<number, { checked: boolean; stock: number }>;
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
  checkedState: new Map<number, { checked: boolean; stock: number }>(), // ✅ Stores checked + stock

  fetchProducts: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`http://localhost:9090/inventory/products?page=${page}&size=${size}`);
      
      const fetchedProducts = response.data.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.unitPrice ?? null,
        expiration: product.expirationDate ?? null,
        stock: product.quantityInStock ?? null,
      }));
  
      // Merge state updates to prevent overwriting changes
      set((state) => {
        const existingProducts = new Map(state.products.map((p) => [p.id, p]));
  
        const updatedProducts = fetchedProducts.map((product:any) =>
          existingProducts.has(product.id) ? { ...existingProducts.get(product.id), ...product } : product
        );
  
        return {
          products: updatedProducts,
          totalPages: response.data.totalPages,
          totalProducts: response.data.totalProducts,
          currentPage: page,
        };
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  
  

  toggleChecked: (id) => set((state) => {
    const prevState = state.checkedState.get(id) || { checked: false, stock: 10 }; // Default state

    const newChecked = !prevState.checked; // ✅ Toggle state
    const newStock = newChecked ? 0 : 10;  // ✅ Correct stock update

    const updatedProducts = state.products.map((product) => 
      product.id === id ? { ...product, checked: newChecked, stock: newStock } : product
    );

    return {
      products: updatedProducts,
      checkedState: new Map(state.checkedState).set(id, { checked: newChecked, stock: newStock }), // ✅ Persist state
    };
  }),

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
    isSearchTriggered: !state.isSearchTriggered,
  })),

  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: Date.now(), checked: false }],
  })),

  editProduct: async (id, updatedProduct) => {
    try {
        const formattedProduct = {
            ...updatedProduct,
            unitPrice: updatedProduct.price, // ✅ Fix naming issue
            quantityInStock: updatedProduct.stock // ✅ Fix naming issue
        };

        console.log(`🔄 Sending update request for product ID ${id}`, formattedProduct);

        const response = await axios.put(`http://localhost:9090/inventory/products/${id}`, formattedProduct);

        if (response.status === 200) {
            console.log("✅ Edit successful, updating Zustand state");

            set((state) => ({
                products: state.products.map((product) =>
                    product.id === id ? { ...product, ...updatedProduct } : product
                ),
            }));

            console.log("📥 Fetching latest products after update...");
            await get().fetchProducts(); // ✅ Ensure latest data is fetched
        } else {
            console.error("❌ Edit failed with status:", response.status);
        }
    } catch (error) {
        console.error("❌ Error editing product:", error);
        get().fetchProducts(); // ✅ Restore latest backend state if error
    }
},

  
  
deleteProduct: async (id) => {
  try {
    console.log(`🗑️ Sending delete request for product ID ${id}`);

    const response = await axios.delete(`http://localhost:9090/inventory/products/${id}`);

    if (response.status === 200 || response.status === 204) { 
      console.log("✅ Delete successful, updating Zustand state");

      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));

      console.log("📥 Fetching latest products after delete...");
      await get().fetchProducts(); // ✅ Ensure latest data is fetched
    } else {
      console.error("❌ Delete failed with status:", response.status);
    }
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    get().fetchProducts(); // ✅ Restore latest backend state if error
  }
},
  
  

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
