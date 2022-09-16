import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/raceSlice';

export default configureStore({
  reducer: {
    race: counterReducer
  }
})