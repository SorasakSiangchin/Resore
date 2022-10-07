import React , { useState , useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import { useAppDispatch } from '../../app/store/configureStore';
import CheckoutPage from './CheckoutPage';
import { setBasket } from '../basket/basketSlice';
import agent from '../../app/api/agent';
import LoadingComponent from '../../app/layout/LoadingComponent';

//public key from stripe
const stripePromise = loadStripe('pk_test_51Lq9toJbmwzPTzM5DrF3O1L8CYXbmzfNXSVpTwES0CZQwQB8UkFWmmLRo68jmeNzZZJmd3E6JtCa0Ts75RWjG4vv00uCxxUKbI');

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    
    //สร้างหรืออัพเดทใบสั่งซื้อส่งไปยัง Stripe (incomplete)
    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);
  
    if (loading) return <LoadingComponent message='Loading checkout...' />
  
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}
