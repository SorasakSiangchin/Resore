/* eslint-disable jsx-a11y/alt-text */


import { Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import BasketSummary from './BasketSummary';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import BasketTable from './BasketTable';


export default function BasketPage() {
  const { basket } = useAppSelector(state => state.basket);
  //name ใช้ควบคุม LoadingButton ให้หมุนเพียงจุดเดียว ณ เวลาใดเวลาหนึ่ง
  // const [status, setStatus] = useState({
  //   loading: false,
  //   name: "",
  // });
  
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
  if (!basket)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <BasketTable items={basket.items} isBasket={true} />
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
