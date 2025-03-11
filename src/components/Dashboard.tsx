import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Pagination,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import SearchFilters from "./SearchFilters";
import ProductDialog from "./ProductDialog";
import InventoryTable from "./InventoryTable";
import InventoryMetrics from "./InventoryMetrics";

interface Product {
  id: number;
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
    id: Date.now(),
    name: "",
    category: "",
    stock: "",
    price: "",
    expiration: "",
  });
  const [inventoryData, setInventoryData] = useState<Product[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    category: "",
    availability: "",
  });
  const [paginatedData, setPaginatedData] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [primarySortField, setPrimarySortField] = useState<keyof Product | "">(
    ""
  );
  const [secondarySortField, setSecondarySortField] = useState<
    keyof Product | ""
  >("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    applySortingAndPagination();
  }, [
    inventoryData,
    currentPage,
    primarySortField,
    secondarySortField,
    sortOrder,
  ]);

  const applySortingAndPagination = () => {
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
          product.stock > 0 === (searchFilters.availability === "Available")
      );
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (primarySortField && a[primarySortField] < b[primarySortField])
        return sortOrder === "asc" ? -1 : 1;
      if (primarySortField && a[primarySortField] > b[primarySortField])
        return sortOrder === "asc" ? 1 : -1;
      if (secondarySortField && a[secondarySortField] < b[secondarySortField])
        return sortOrder === "asc" ? -1 : 1;
      if (secondarySortField && a[secondarySortField] > b[secondarySortField])
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    setPaginatedData(paginatedData);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));

    // Ensure the current page is within the valid range
    if (currentPage > Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditIndex(null);
    setNewProduct({
      id: Date.now(),
      name: "",
      category: "",
      stock: "",
      price: "",
      expiration: "",
    });
  };

  const handleSave = () => {
    const newProductParsed = {
      ...newProduct,
      id: Date.now(),
      stock: parseInt(newProduct.stock, 10),
      price: parseFloat(newProduct.price),
      checked: false,
      expiration: newProduct.category === "Food" ? newProduct.expiration : "",
    };

    if (editMode && editIndex !== null) {
      setInventoryData((prevData) =>
        prevData.map((item) => (item.id === editIndex ? newProductParsed : item))
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

  const updateSearchFilters = (field: string, value: string | string[]) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    applySortingAndPagination();
  };

  const handleClearSearch = () => {
    setSearchFilters({ name: "", category: "", availability: "" });
    setCurrentPage(1);
    applySortingAndPagination();
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    applySortingAndPagination();
  };

  const handleCheckboxChange = (id: number) => {
    setInventoryData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked, stock: item.checked ? 10 : 0 }
          : item
      )
    );
  };

  const handleEdit = (id: number) => {
    const productToEdit = inventoryData.find((item) => item.id === id);
    if (productToEdit) {
      setNewProduct({
        id: productToEdit.id,
        name: productToEdit.name,
        category: productToEdit.category,
        stock: productToEdit.stock.toString(),
        price: productToEdit.price.toString(),
        expiration: productToEdit.expiration,
      });
      setEditMode(true);
      setEditIndex(id);
      setOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setInventoryData((prevData) => prevData.filter((item) => item.id !== id));
    applySortingAndPagination();
  };

  const getRowBackground = (expiration: string | null) => {
    if (!expiration) return { color: "transparent", daysUntilExpiration: null };
    const expDate = new Date(expiration);
    const currentDate = new Date();
    const diffInDays = Math.floor(
      (expDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffInDays < 7)
      return { color: "#FF6961", daysUntilExpiration: diffInDays };
    if (diffInDays >= 7 && diffInDays <= 14)
      return { color: "#FFFB29", daysUntilExpiration: diffInDays };
    if (diffInDays > 14)
      return { color: "#77DD77", daysUntilExpiration: diffInDays };
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

  const handlePrimarySortChange = (
    event: SelectChangeEvent<keyof Product | "">
  ) => {
    setPrimarySortField(event.target.value as keyof Product);
  };

  const handleSecondarySortChange = (
    event: SelectChangeEvent<keyof Product | "">
  ) => {
    setSecondarySortField(event.target.value as keyof Product);
  };

  const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
    setSortOrder(event.target.value as SortOrder);
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
        overflowY: "auto", // Enable scrolling in the main area
        position: "relative",
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

        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "#fff",
            pb: 1,
            borderBottom: "1px solid #ccc",
          }}
        >
          <SearchFilters
            searchFilters={searchFilters}
            updateSearchFilters={updateSearchFilters}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mr: 2, color: "text.secondary" }}
            >
              Sort By:
            </Typography>
            <Select
              value={primarySortField}
              onChange={handlePrimarySortChange}
              displayEmpty
              sx={{ mr: 3, color: "text.secondary", fontSize: "0.875rem" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="expiration">Expiration Date</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
            </Select>
            <Typography
              variant="subtitle2"
              sx={{ mr: 2, color: "text.secondary" }}
            >
              And:
            </Typography>
            <Select
              value={secondarySortField}
              onChange={handleSecondarySortChange}
              displayEmpty
              sx={{ mr: 3, color: "text.secondary", fontSize: "0.875rem" }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="expiration">Expiration Date</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
            </Select>
            <Typography
              variant="subtitle2"
              sx={{ mr: 2, color: "text.secondary" }}
            >
              Order:
            </Typography>
            <Select
              value={sortOrder}
              onChange={handleSortOrderChange}
              displayEmpty
              sx={{ mr: 3, color: "text.secondary", fontSize: "0.875rem" }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </Box>

          <Button
            variant="contained"
            sx={{
              mb: 1,
              backgroundColor: "green",
              fontWeight: "bold",
              fontSize: "0.875rem",
            }}
            onClick={handleOpen}
          >
            New Product
          </Button>
        </Box>

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
          sortOrder={sortOrder}
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
            count={totalPages}
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