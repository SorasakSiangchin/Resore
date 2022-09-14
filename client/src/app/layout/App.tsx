import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react'
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


const App = () => {
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
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  )

}

export default App