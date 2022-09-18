/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Product } from '../../app/models/Product';
import { CardHeader, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import { LoadingButton } from "@mui/lab"; 
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const [loading , setLoading] = useState(false);
  const { setBasket } = useStoreContext();

  function handleAddItem(productId: number) { 
    setLoading(true); 
    agent.Basket.addItem(productId) 
      .then((basket) => setBasket(basket))
      .catch((error) => console.log(error)) 
      .finally(() => setLoading(false)); 
  } 

  return (
    <React.Fragment>
      <Card sx={{ maxWidth: "100%" }} >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {product.name.at(0)?.toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={product.pictureUrl}
          subheader={product.name}
        />
        <CardMedia
          component="img"
          alt="green iguana"
          height="70%"
          sx={{ backgroundColor: "pink" }}
          image={product.pictureUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton  size="small" loading={loading} onClick={()=>handleAddItem(product.id)}>Add To Cart</LoadingButton>
          <Button size="small" component={Link} to={`/catalog/${product.id}`}  >View</Button>
        </CardActions>
      </Card>
    </React.Fragment>
  )
}

export default ProductCard;