import { createSlice, configureStore } from '@reduxjs/toolkit'

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    fullScreen: true
  },
  reducers: {
    setScreen: state => { state.fullScreen = !state.fullScreen  },
  }
})

export const { setScreen } = homeSlice.actions ;