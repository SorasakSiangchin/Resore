/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { counterSlice } from '../../features/contact/counterSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { testSlice } from '../../features/contact/testSlice';
import { homeSlice } from '../../features/home/homeSlice';
import  basketSlice  from '../../features/basket/basketSlice';
import catalogSlice from '../../features/catalog/catalogSlice';
import { accountSlice } from '../../features/account/accountSlice';
export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        test : testSlice.reducer ,
        home : homeSlice.reducer ,
        basket : basketSlice ,
        catalog : catalogSlice ,
        account : accountSlice.reducer
    } ,
    
  });


//เป็นค่า Default ที่มีอยู่ใน store คือ store.getState, store.dispatch (ใช้ตามรูปแบบเขาเลย)
export type RootState = ReturnType<typeof store.getState>// อ่าน state ; ค่าของ state ทั้งหมด
export type AppDispatch = typeof store.dispatch;			// dispatch สำหรับเรียก action

//สำหรับเรียกใข้ dispatch และ state (ใช้ตามรูปแบบเขาเลย)
export const useAppDispatch = ()=>useDispatch<AppDispatch>()
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;

