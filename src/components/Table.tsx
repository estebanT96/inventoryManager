import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import useStore from "../store";
import { differenceInDays, parseISO } from "date-fns";
import SearchFilters from "./SearchFilters";

export default function BasicTable() {
  const {
    products,
    searchFilters,
    toggleChecked,
    addProduct,
    editProduct,
    deleteProduct,
  } = useStore();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortCriteria, setSortCriteria] = useState(""); // Default sorting by none
  const [secondarySortCriteria, setSecondarySortCriteria] = useState(""); // Default secondary sorting by none
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order ascending

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default: 10 rows per page

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(searchFilters.name.toLowerCase());
      const matchesCategory = searchFilters.category
        ? product.category === searchFilters.category
        : true;
      const matchesAvailability =
        searchFilters.availability === "Available"
          ? product.stock > 0
          : searchFilters.availability === "Out of Stock"
            ? product.stock === 0
            : true;
      return matchesName && matchesCategory && matchesAvailability;
    });

    const sorted = filtered.sort((a, b) => {
      let comparison = 0;
      if (sortCriteria) {
        if (sortCriteria === "category") {
          comparison = a.category.localeCompare(b.category);
        } else if (sortCriteria === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortCriteria === "price") {
          comparison = a.price - b.price;
        } else if (sortCriteria === "expiration") {
          comparison =
            new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
        } else if (sortCriteria === "stock") {
          comparison = a.stock - b.stock;
        }
      }

      if (comparison === 0 && secondarySortCriteria) {
        if (secondarySortCriteria === "category") {
          comparison = a.category.localeCompare(b.category);
        } else if (secondarySortCriteria === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (secondarySortCriteria === "price") {
          comparison = a.price - b.price;
        } else if (secondarySortCriteria === "expiration") {
          comparison =
            new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
        } else if (secondarySortCriteria === "stock") {
          comparison = a.stock - b.stock;
        }
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredProducts(sorted);

    // Ensure the page remains valid after filtering and sorting
    const maxPage = Math.max(0, Math.ceil(sorted.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [
    products,
    searchFilters,
    sortCriteria,
    secondarySortCriteria,
    sortOrder,
    rowsPerPage,
    page,
  ]);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<{
    id: number;
    name: string;
    category: string;
    price: number;
    stock: string;
    expiration: string;
    checked: boolean;
  } | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    expiration: "",
  });
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      expiration: "",
    });
  };

  const handleEditOpen = (product: {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    expiration: string;
    checked: boolean;
  }) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock.toString(),
      expiration: product.expiration,
      checked: product.checked,
    });
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      expiration: product.expiration,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentProduct(null);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      expiration: "",
    });
  };

  const handleDeleteOpen = (product: {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    expiration: string;
    checked: boolean;
  }) => {
    setCurrentProduct({
      ...product,
      stock: product.stock.toString(),
    });
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setCurrentProduct(null);
  };

  const handleSave = () => {
    addProduct({
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      expiration: newProduct.category === "Food" ? newProduct.expiration : "",
      stock: parseInt(newProduct.stock, 10),
    });
    handleClose();
  };

  const handleEditSave = () => {
    if (currentProduct) {
      editProduct(currentProduct.id, {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        expiration: newProduct.category === "Food" ? newProduct.expiration : "",
        stock: parseInt(newProduct.stock, 10),
      });
    }
    handleEditClose();
  };

  const handleDelete = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id);
    }
    handleDeleteClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setNewProduct((prev) => ({ ...prev, category: value }));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSaveDisabled =
    !newProduct.name ||
    !newProduct.category ||
    !newProduct.price ||
    !newProduct.stock ||
    (newProduct.category === "Food" && !newProduct.expiration);

  const getExpirationColor = (expiration: string) => {
    if (!expiration) return "transparent"; // No background color for no expiration date
    const daysUntilExpiration = differenceInDays(
      parseISO(expiration),
      new Date()
    );
    if (daysUntilExpiration < 7) return "rgba(235, 21, 21, 0.9)"; // Red for less than 1 week
    if (daysUntilExpiration <= 14) return "rgba(235, 235, 35, 0.86)"; // Yellow for 1-2 weeks
    return "rgb(29, 174, 29)"; // Green for more than 2 weeks
  };

  const getDaysLeftText = (expiration: string) => {
    if (!expiration) return "";
    const daysLeft = differenceInDays(parseISO(expiration), new Date());
    return `(${daysLeft} days left to expire)`;
  };

  const getStockCellColor = (stock: number) => {
    if (stock < 5) return "rgb(248, 54, 54)"; // Red
    if (stock >= 5 && stock <= 10) return "rgb(241, 162, 43)"; // Yellow
    return "transparent"; // Green
  };

  return (
    <>
      <SearchFilters />

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl variant="outlined" sx={{ width: "200px" }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            label="Sort By"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
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
        </FormControl>
        <FormControl variant="outlined" sx={{ width: "200px" }}>
          <InputLabel>And</InputLabel>
          <Select
            label="And"
            value={secondarySortCriteria}
            onChange={(e) => setSecondarySortCriteria(e.target.value)}
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
        </FormControl>
        <FormControl variant="outlined" sx={{ width: "200px" }}>
          <InputLabel>Order</InputLabel>
          <Select
            label="Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button
        variant="contained"
        color="warning"
        onClick={handleOpen}
        sx={{ marginBottom: 2, width: 170, fontSize: "1rem" }}
      >
        Add Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontSize: "1.2rem" }}>Add New Product</DialogTitle>
        <DialogContent>
          <Select
            value={newProduct.category}
            onChange={handleSelectChange}
            displayEmpty
            sx={{ marginBottom: 2, fontSize: "1rem" }}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
          </Select>
          <TextField
            autoFocus
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newProduct.name}
            onChange={handleChange}
            sx={{ marginBottom: 2, fontSize: "1.2rem" }}
          />

          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={handleChange}
            sx={{ marginBottom: 2, fontSize: "1.2rem" }}
          />

          {newProduct.category === "Food" && (
            <TextField
              name="expiration"
              label="Expiration Date"
              type="date"
              fullWidth
              value={newProduct.expiration}
              onChange={handleChange}
              sx={{ marginBottom: 2, fontSize: "1.2rem" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={newProduct.stock}
            onChange={handleChange}
            sx={{ fontSize: "1.2rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            color="primary"
            disabled={isSaveDisabled}
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle sx={{ fontSize: "1.2rem" }}>Edit Product</DialogTitle>
        <DialogContent>
          <Select
            value={newProduct.category}
            onChange={handleSelectChange}
            displayEmpty
            sx={{ marginBottom: 2, fontSize: "1rem" }}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
          </Select>
          <TextField
            autoFocus
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newProduct.name}
            onChange={handleChange}
            sx={{ marginBottom: 2, fontSize: "1.2rem" }}
          />

          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={handleChange}
            sx={{ marginBottom: 2, fontSize: "1.2rem" }}
          />

          {newProduct.category === "Food" && (
            <TextField
              name="expiration"
              label="Expiration Date"
              type="date"
              fullWidth
              value={newProduct.expiration}
              onChange={handleChange}
              sx={{ marginBottom: 2, fontSize: "1.2rem" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={newProduct.stock}
            onChange={handleChange}
            sx={{ fontSize: "1.2rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            color="secondary"
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            color="primary"
            disabled={isSaveDisabled}
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle sx={{ fontSize: "1.2rem" }}>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            color="secondary"
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            color="error"
            sx={{ fontSize: "1rem", marginRight: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ margin: "auto" }}>
        <Table
          sx={{ minWidth: 600, bgcolor: "rgba(130, 150, 170, .5)" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Select
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Category
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Name
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Price
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Expiration Date
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Stock
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  color: "white",
                  borderBottom: "2px solid rgba(130, 150, 170, .5)",
                  fontSize: "1.2rem",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow
                  key={product.id}
                  sx={{
                    textDecoration: product.checked ? "line-through" : "none",
                    fontSize: "1rem",
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1.2rem",
                    }}
                  >
                    <Checkbox
                      checked={product.checked}
                      onChange={() => toggleChecked(product.id)}
                      aria-label="controlled"
                    />
                  </TableCell>
                  <TableCell
                    align="left"
                    component="th"
                    scope="row"
                    sx={{
                      backgroundColor:
                        product.category === "Food"
                          ? getExpirationColor(product.expiration)
                          : "transparent",
                      color: "white",
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1rem",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {product.category}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      backgroundColor:
                        product.category === "Food"
                          ? getExpirationColor(product.expiration)
                          : "transparent",
                      color: "white",
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1rem",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {product.name}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      backgroundColor:
                        product.category === "Food"
                          ? getExpirationColor(product.expiration)
                          : "transparent",
                      color: "white",
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1rem",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price)}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      backgroundColor:
                        product.category === "Food"
                          ? getExpirationColor(product.expiration)
                          : "transparent",
                      color: "white",
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1rem",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {product.expiration}{" "}
                    {product.category === "Food" && (
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{
                          fontStyle: "italic",
                          fontSize: "0.8rem",
                          color: "rgb(37, 20, 20)",
                        }}
                      >
                        {getDaysLeftText(product.expiration)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      backgroundColor: getStockCellColor(product.stock),
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      borderLeft: "2px solid rgba(130, 150, 170, .5)",
                      borderRight: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1rem",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {product.stock}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      borderBottom: "2px solid rgba(130, 150, 170, .5)",
                      fontSize: "1rem",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditOpen(product)}
                      sx={{
                        marginRight: 1,
                        bgcolor: "rgba(24, 190, 41, 0.9)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(24, 190, 41, 0.7)", // Slightly darker on hover
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ color: "black" }}
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteOpen(product)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          sx={{
            bgcolor: "rgba(106, 123, 139, 0.5)",
            "& .MuiTablePagination-displayedRows": {
              fontSize: "1.1rem",
              fontWeight: "bold",
            },
          }}
          rowsPerPageOptions={[10]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({
            count,
            page,
          }: {
            count: number;
            page: number;
          }) => `${page + 1} of ${Math.ceil(count / rowsPerPage)}`}
          labelRowsPerPage=""
        />
      </TableContainer>
    </>
  );
}
