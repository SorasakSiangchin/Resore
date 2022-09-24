/* eslint-disable @typescript-eslint/no-unused-vars */
import  React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { incremented , decremented} from './counterSlice';

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const {num} = useAppSelector(state => state.counter);
  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button onClick={()=>dispatch(decremented(5))} >-</Button>
      <Button>{num}</Button>
      <Button onClick={()=>dispatch(incremented(5))}>+</Button>
    </ButtonGroup>
  );
}