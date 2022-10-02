
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
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { BasketItem } from '../../app/models/Basket';
import { addBasketItemAsync, removeBasketItemAsync } from './basketSlice';

interface Props {
    items: BasketItem[];
    isBasket?: boolean;
}

const BasketTable = ({ items, isBasket = true }: Props) => {
    const dispatch = useAppDispatch();
    const { basket, status } = useAppSelector(state => state.basket);
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
                            {isBasket && <TableCell align="right"></TableCell>}
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
                                    {isBasket && (<LoadingButton
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
                                    </LoadingButton>)}
                                    {item.quantity}
                                    {isBasket && (<LoadingButton
                                        loading={status === "pendingAddItem" + item.productId}
                                        onClick={() =>
                                            dispatch(
                                                addBasketItemAsync({ productId: item.productId })
                                            )
                                        }
                                        color="error"
                                    >
                                        <Add />
                                    </LoadingButton>)}
                                </TableCell>
                                <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                                {isBasket && (
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
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default BasketTable