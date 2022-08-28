import React from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard';
import { Product } from '../../app/models/Product';

interface Props {
  products :  Product[]
}

const ProductList = ({products} : Props) => {
  return (
    <React.Fragment>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {products.map((product) => (
          <Grid item xs={4} sm={4} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  )
}

export default ProductList;