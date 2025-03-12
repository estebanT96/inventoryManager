import React, { useState } from "react";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import useStore from "../store";

export default function BasicTable() {
  const { products, toggleChecked, addProduct } = useStore();
  const [open, setOpen] = useState(false);
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

  const isSaveDisabled =
    !newProduct.name ||
    !newProduct.category ||
    !newProduct.price ||
    !newProduct.stock ||
    (newProduct.category === "Food" && !newProduct.expiration);

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        onClick={handleOpen}
        sx={{ marginBottom: 2, width: 170, fontSize: "1.1rem" }}
      >
        New Product
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
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{
                  bgcolor: "#181f26",
                  textDecoration: product.checked ? "line-through" : "none",
                  fontSize: "1.2rem",
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
                    color: "white",
                    borderBottom: "2px solid rgba(130, 150, 170, .5)",
                    fontSize: "1rem",
                  }}
                >
                  {product.category}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    borderBottom: "2px solid rgba(130, 150, 170, .5)",
                    fontSize: "1rem",
                  }}
                >
                  {product.name}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    borderBottom: "2px solid rgba(130, 150, 170, .5)",
                    fontSize: "1rem",
                  }}
                >
                  {product.price}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    borderBottom: "2px solid rgba(130, 150, 170, .5)",
                    fontSize: "1rem",
                  }}
                >
                  {product.expiration}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    borderBottom: "2px solid rgba(130, 150, 170, .5)",
                    fontSize: "1rem",
                  }}
                >
                  {product.stock}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "white",
                    borderBottom: "2px solid rgba(130, 150, 170, .5)",
                    fontSize: "1rem",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
