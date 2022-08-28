import { Grid, Typography, Divider, TableContainer, Table, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../../app/models/Product';

const ProductDetails = () => {
  const { id } = useParams(); //อ่ำนค่ำจำกพำรำมิเตอรท์ส่ี่งมำตำมพำท (URL Parameters) 
  const [product , setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    axios.get(`http://localhost:5000/api/Products/GetProduct/${id}`).then((respons)=>{
        setProduct(respons.data)
    }).catch((error)=>{ console.log(error) }).finally(()=>{setLoading(false)});
  },[ id ]);
  if(loading) return <h1>Loading...</h1>
  if(!product) return <h1>Product Nut Found...</h1>
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
      </Grid> 
    </Grid> 
  ); 
}

export default ProductDetails;