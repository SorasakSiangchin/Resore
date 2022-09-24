import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
    myName : "Sorasak"
}

export const testSlice = createSlice({
  name: 'testRTX',
  initialState ,
  reducers: {
    showName: state => { state.myName = state.myName + "Siangchin" },
  }
})

export const { showName } = testSlice.actions ;