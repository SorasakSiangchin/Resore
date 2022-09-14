import axios from 'axios';
import React, { useEffect, useState } from 'react';
import agent from '../../app/api/agent';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/Product';
import ProductList from './ProductList';

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.Catalog.list()
      .then((response: any) => setProducts(response)).catch((error) => { console.log(error) }).finally(() =>  setLoading(false));
    //จะทำงานเป็นระดับสุดท้าย
  }, []);
  if (loading) return <LoadingComponent message="Loading Products....." />;
  return (
    <React.Fragment>
      <ProductList products={products} />
    </React.Fragment>
  )
};

export default Catalog;