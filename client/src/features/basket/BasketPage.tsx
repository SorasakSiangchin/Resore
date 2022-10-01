/* eslint-disable jsx-a11y/alt-text */

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { currencyFormat } from '../../app/util/util';
import { LoadingButton } from '@mui/lab';
import { Add, Delete, Remove } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import BasketSummary from './BasketSummary';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { addBasketItemAsync, removeBasketItemAsync } from './basketSlice';


export default function BasketPage() {
  const dispatch = useAppDispatch();
  //name ใช้ควบคุม LoadingButton ให้หมุนเพียงจุดเดียว ณ เวลาใดเวลาหนึ่ง
  // const [status, setStatus] = useState({
  //   loading: false,
  //   name: "",
  // });

  const { basket, status } = useAppSelector(state => state.basket);
  
  // const { removeItem } = useStoreContext();

  // function handleAddItem(productId: number, name: string) {
  //   //setStatus({ loading: true, name });
  //   agent.Basket.addItem(productId)
  //     .then((basket) => dispatch(setBasket(basket)))
  //     .catch((error) => console.log(error))
  //     .finally(() => setTimeout(() => {
  //       //setStatus({ loading: false, name: "" })
  //     }, 1000));
  // };

  // function handleRemoveItem(productId: number, quantity = 1, name: string) {
  //   setStatus({ ...status, loading: true, name });
  //   agent.Basket.removeItem(productId, quantity)
  //   .then(() => dispatch(removeItem({ productId, quantity })))
  //   .catch((error) => console.log(error))
  //   .finally(() => setTimeout(() => {
  //     setStatus({ loading: false, name: "" })
  //   }, 1000));
  // };

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
                  <LoadingButton
                    loading={
                      status === "pendingRemoveItem" + item.productId + "rem"
                    }
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: 1,
                          name: "rem",
                        })
                      )
                    }
                    color="error"
                  >
                    <Remove />
                  </LoadingButton>

                  {item.quantity}
                  <LoadingButton
                    loading={status === "pendingAddItem" + item.productId}
                    onClick={() =>
                      dispatch(
                        addBasketItemAsync({ productId: item.productId })
                      )
                    }
                    color="error"
                  >
                    <Add />
                  </LoadingButton>

                </TableCell>
                <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                <TableCell align="right">
                <LoadingButton
                    loading={status.includes(
                      "pendingRemoveItem" + item.productId + "del"
                    )}
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                          name: "del",
                        })
                      )
                    }
                    color="error"
                  >
                    <Delete />
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
