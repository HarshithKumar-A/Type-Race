import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    myProgress: 0,
    bootProgress: 0
  },
  reducers: {
    currentSpeedProgress: (state, action) => {
      state.bootProgress = action.payload
    },
    currentProgressOwn: (state, action) => {
      state.myProgress = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { currentSpeedProgress, currentProgressOwn } = counterSlice.actions

export default counterSlice.reducer