import React from 'react';
import Grid from '@mui/material/Grid';
import ProductCard from './ProductCard';
import { Product } from '../../app/models/Product';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useAppSelector } from '../../app/store/configureStore';

interface Props {
  products :  Product[]
}

const ProductList = ({products} : Props) => {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  return (
    <React.Fragment>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {products.map((product) => (
          <Grid item xs={4} sm={4} md={4} key={product.id}>
                      {!productsLoaded ? (
              <ProductCardSkeleton />
            ) : (
              <ProductCard product={product} />
            )}

          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  )
}

export default ProductList;