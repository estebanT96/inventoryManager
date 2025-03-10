import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Pagination, SelectChangeEvent } from '@mui/material';
import SearchFilters from './searchFilters';
import ProductDialog from './productDialog';
import InventoryTable from './InventoryTable';
import InventoryMetrics from './inventoryMetrics';

interface Product {
  name: string;
  category: string;
  stock: number;
  price: number;
  expiration: string;
  checked: boolean;
}

type SortOrder = "asc" | "desc";

const Dashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    expiration: ""
  });
  const [inventoryData, setInventoryData] = useState<Product[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    category: "",
    availability: "",
  });
  const [paginatedData, setPaginatedData] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<keyof Product>("category");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPaginatedData(inventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
  }, [inventoryData, currentPage]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditIndex(null);
    setNewProduct({
      name: "",
      category: "",
      stock: "",
      price: "",
      expiration: ""
    });
  };

  const handleSave = () => {
    const newProductParsed = {
      ...newProduct,
      stock: parseInt(newProduct.stock, 10),
      price: parseFloat(newProduct.price),
      checked: false,
      expiration: newProduct.category === "Food" ? newProduct.expiration : "",
    };
    if (editMode && editIndex !== null) {
      setInventoryData((prevData) =>
        prevData.map((item, index) =>
          index === editIndex ? newProductParsed : item
        )
      );
    } else {
      setInventoryData((prevData) => [...prevData, newProductParsed]);
    }
    handleClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name!]: value }));
  };

  const updateSearchFilters = (field: string, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    let filteredData = inventoryData;
    if (searchFilters.name) {
      filteredData = filteredData.filter((product) =>
        product.name.toLowerCase().includes(searchFilters.name.toLowerCase())
      );
    }
    if (searchFilters.category) {
      filteredData = filteredData.filter(
        (product) => product.category === searchFilters.category
      );
    }
    if (searchFilters.availability) {
      filteredData = filteredData.filter(
        (product) =>
          product.stock > 0 ===
          (searchFilters.availability === "Available")
      );
    }
    setPaginatedData(filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
  };

  const handleClearSearch = () => {
    setSearchFilters({ name: "", category: "", availability: "" });
    setPaginatedData(inventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
  };

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    const sortedData = [...paginatedData].sort((a, b) => {
      if (a[field] !== undefined && b[field] !== undefined) {
        if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
        if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
    setPaginatedData(sortedData);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    setPaginatedData(inventoryData.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  };

  const handleCheckboxChange = (index: number) => {
    setInventoryData((prevData) =>
      prevData.map((item, i) =>
        i === index
          ? { ...item, checked: !item.checked, stock: !item.checked ? 0 : 10 }
          : item
      )
    );
  };

  const handleEdit = (index: number) => {
    const productToEdit = inventoryData[index];
    setNewProduct({
      name: productToEdit.name,
      category: productToEdit.category,
      stock: productToEdit.stock.toString(),
      price: productToEdit.price.toString(),
      expiration: productToEdit.expiration,
    });
    setEditMode(true);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    setInventoryData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const getRowBackground = (expiration: string | null) => {
    if (!expiration) return { color: "transparent", daysUntilExpiration: null };
    const expDate = new Date(expiration);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (expDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays < 7) return { color: "#FF6961", daysUntilExpiration: diffInDays };
    if (diffInDays >= 7 && diffInDays <= 14) return { color: "#FFFB29", daysUntilExpiration: diffInDays };
    if (diffInDays > 14) return { color: "#77DD77", daysUntilExpiration: diffInDays };
    return { color: "transparent", daysUntilExpiration: null };
  };

  const getStockCellColor = (stock: number) => {
    if (stock < 5) return "rgba(255, 0, 0, 0.3)";
    if (stock >= 5 && stock <= 10) return "rgba(241, 154, 24, 0.65)";
    return "transparent";
  };

  const calculateMetrics = () => {
    const categories = ["Food", "Clothing", "Electronics", "Overall"];
    return categories.map((category) => {
      const filteredItems =
        category === "Overall"
          ? inventoryData
          : inventoryData.filter((item) => item.category === category);

      const totalStock = filteredItems.reduce(
        (acc, item) => acc + item.stock,
        0
      );
      const totalValue = filteredItems.reduce(
        (acc, item) => acc + item.price * item.stock,
        0
      );
      const avgPrice = totalStock > 0 ? totalValue / totalStock : 0;

      return {
        category,
        totalStock,
        totalValue,
        avgPrice,
      };
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f5f5f5",
        overflowY: "auto",
        marginTop: "20px",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 4,
          minHeight: "80vh",
        }}
      >
        <Typography
          variant="h4"
          color="black"
          sx={{ mt: 2, mb: 4, fontWeight: "600", textDecoration: "underline" }}
        >
          Inventory Dashboard
        </Typography>

        <SearchFilters
          searchFilters={searchFilters}
          updateSearchFilters={updateSearchFilters}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
        />

        <Button
          variant="contained"
          sx={{ mb: 2, backgroundColor: "green", fontWeight: "bold" }}
          onClick={handleOpen}
        >
          New Product
        </Button>

        <ProductDialog
          open={open}
          handleClose={handleClose}
          handleSave={handleSave}
          newProduct={newProduct}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />

        <InventoryTable
          paginatedData={paginatedData}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          handleCheckboxChange={handleCheckboxChange}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          getRowBackground={getRowBackground}
          getStockCellColor={getStockCellColor}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(inventoryData.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        <InventoryMetrics calculateMetrics={calculateMetrics} />
      </Container>
    </Box>
  );
};

export default Dashboard;