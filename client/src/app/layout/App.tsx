import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useEffect, useState } from 'react'
import Header from './Header'
import Catalog from '../../features/catalog/Catalog';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ContactPage from '../../features/contact/ContactPage';
import AboutPage from '../../features/about/AboutPage';
import ProductDetails from '../../features/catalog/ProductDetails';
import NotFound from '../errors/NotFound';
import ServerError from '../errors/ServerError';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from '../util/util';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import BasketPage from '../../features/basket/BasketPage';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAppDispatch, useAppSelector } from '../store/configureStore';
import { setBasket } from '../../features/basket/basketSlice';

const App = () => {
  //const { setBasket } = useStoreContext(); //ควบคุมสเตทด้วย React context to Centralize
  const dispatch = useAppDispatch();
  const {fullScreen} = useAppSelector(state => state.home);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.get()
         // ค้นหาข้อมูลในตะกร้า
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, [dispatch ]);

  const [mode, setMode] = React.useState(true);

  const displayMode = !mode ? 'dark' : 'light';

  const handleMode = () => {
    setMode(!mode);
  };

  const darkTheme = createTheme({
    palette: {
      mode: displayMode,
    },
  });

  if (loading) return <LoadingComponent message="Initilize App....." />;

  return (
    <React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          theme="colored"
        />
        <CssBaseline />
        <Header handleMode={handleMode} />
        { !fullScreen ? <>{mainRoute}</> : <Container sx={{ marginTop:"30px"}}>{mainRoute}</Container>}
      </ThemeProvider>
    </React.Fragment>
  )
}

const mainRoute = (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/catalog" element={<Catalog />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/basket" element={<BasketPage />} />
    <Route path="/server-error" element={<ServerError />} />
    <Route path="/catalog/:id" element={<ProductDetails />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
);

export default App