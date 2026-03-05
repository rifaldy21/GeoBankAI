import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import territorialReducer from './slices/territorialSlice';
import marketReducer from './slices/marketSlice';
import performanceReducer from './slices/performanceSlice';
import campaignReducer from './slices/campaignSlice';
import dataReducer from './slices/dataSlice';

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    territorial: territorialReducer,
    market: marketReducer,
    performance: performanceReducer,
    campaign: campaignReducer,
    data: dataReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
