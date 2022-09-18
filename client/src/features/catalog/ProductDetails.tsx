/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { LoadingButton } from '@mui/lab';
import { Grid, Typography, Divider, TableContainer, Table, TableBody, TableRow, TableCell, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
import NotFound from '../../app/errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/Product';

const ProductDetails = () => {
  const { id } = useParams<{id :any}>(); //อ่ำนค่ำจำกพำรำมิเตอรท์ส่ี่งมำตำมพำท (URL Parameters) 
  const [product , setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  

  const { basket, setBasket, removeItem } = useStoreContext();
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // เพื่อ check ว่าซื้อไปแล้วกี่ชิ้น
  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(()=>{
   if(item) setQuantity(item.quantity);
   agent.Catalog.details(parseInt(id)).then((respons)=>{
      setProduct(respons)
   }).catch((error) => { console.log(error) }).finally(() => { setLoading(false) });
  },[ id , item ]);

  function handleInputChange(event: any) {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  };

  function handleUpdateCart() {
    setSubmitting(true);
    // ถ้าสินค้าไม่มีหรือจำนวนที่ใส่เข้าไปไหม่มากกว่าของเก่า
    if (!item || quantity > item.quantity) {
      // ถ้ามันมี
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      agent.Basket.addItem(product?.id!, updatedQuantity)
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setSubmitting(false));
    } else {
      const updatedQuantity = item.quantity - quantity;
      agent.Basket.removeItem(product?.id!, updatedQuantity)
        .then(() => removeItem(product?.id!, updatedQuantity))
        .catch((error) => console.log(error))
        .finally(() => setSubmitting(false));
    }
  };

  if(loading) return <LoadingComponent message="Loading Products....." />

  if(!product) return <NotFound/>
  
  return ( 
    <Grid container spacing={6}> 
      <Grid item xs={6}> 
        <img src={product.pictureUrl} style={{ width: "100%" }} /> 
      </Grid> 
          <Grid item xs={6}> 
        <Typography variant="h3">{product.name}</Typography> 
        <Divider sx={{ mb: 2 }} /> 
        <Typography variant="h3" color="secondary"> 
          ${(product.price / 100).toFixed(2)} 
        </Typography> 
              <TableContainer> 
          <Table> 
            <TableBody> 
              <TableRow> 
                <TableCell>Name</TableCell> 
                <TableCell>{product.name}</TableCell> 
              </TableRow> 
              <TableRow> 
                <TableCell>Description</TableCell> 
                <TableCell>{product.description}</TableCell> 
              </TableRow> 
              <TableRow> 
                <TableCell>Type</TableCell> 
                <TableCell>{product.type}</TableCell> 
              </TableRow> 
              <TableRow> 
                <TableCell>Brand</TableCell> 
                <TableCell>{product.brand}</TableCell> 
              </TableRow> 
              <TableRow> 
                <TableCell>Quantitiy in stock</TableCell> 
                <TableCell>{product.quantityInStock}</TableCell> 
              </TableRow> 
            </TableBody> 
          </Table> 
        </TableContainer> 

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              loading={submitting}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>


      </Grid> 
    </Grid> 
  ); 
}

export default ProductDetails;