/* eslint-disable jsx-a11y/alt-text */

import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStoreContext } from '../../app/context/StoreContext';
import { Box } from '@mui/system';
import { currencyFormat } from '../../app/util/util';
import { LoadingButton } from '@mui/lab';
import { Add, Delete, Remove } from '@mui/icons-material';
import agent from '../../app/api/agent';
import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import BasketSummary from './BasketSummary';


export default function BasketPage() {

  //name ใช้ควบคุม LoadingButton ให้หมุนเพียงจุดเดียว ณ เวลาใดเวลาหนึ่ง
  const [status, setStatus] = useState({
    loading: false,
    name: "",
  });

  const { basket, setBasket, removeItem } = useStoreContext();

  function handleAddItem(productId: number, name: string) {
    setStatus({ loading: true, name });
    agent.Basket.addItem(productId)
      .then((basket) => setBasket(basket))
      .catch((error) => console.log(error))
      .finally(() => setStatus({ loading: false, name: "" }));
  }


  function handleRemoveItem(productId: number, quantity = 1, name: string) {
    setStatus({ ...status, loading: true, name });
    agent.Basket.removeItem(productId, quantity)
      .then(() => removeItem(productId, quantity))
      .catch((error) => console.log(error))
      .finally(() => setStatus({ loading: false, name: "" }));
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell >Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* ? check ว่าเป็น null หรือป่าว */}
            {basket?.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center" >
                    <img src={item.pictureUrl} width={100} height={100} alt={item.name} />
                    {item.name}
                  </Box>
                </TableCell>
                <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                <TableCell align="center">
                  <LoadingButton loading={status.loading && status.name === "rem" + item.productId.toString()} onClick={() => handleRemoveItem(item.productId, 1, "rem" + item.productId.toString())} >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton loading={status.loading && status.name === "add" + item.productId.toString()} onClick={() => handleAddItem(item.productId, "add" + item.productId.toString())} >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                <TableCell align="right">
                  <LoadingButton loading={status.loading && status.name === "del" + item.productId.toString()} onClick={() => handleRemoveItem(item.productId, item.quantity, "del" + item.productId.toString())} >
                    <Delete color='error' />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
