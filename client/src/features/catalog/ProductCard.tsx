import React from 'react';
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

interface Props {
  product :  Product
}

const ProductCard = ({product} : Props) => {
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
     sx={{ backgroundColor:"pink" }}
     image={product.pictureUrl}
   />
   <CardContent>
     <Typography gutterBottom variant="h5" component="div">
       {(product.price/100).toFixed(2)}
     </Typography>
     <Typography variant="body2" color="text.secondary">
     {product.brand} / {product.type} 
     </Typography>
   </CardContent>
   <CardActions>
     <Button size="small">Add To Cart</Button>
     <Button size="small" component={Link} to={`/catalog/${product.id}`}  >View</Button>
   </CardActions>
   </Card>
    </React.Fragment>
  )
}

export default ProductCard;