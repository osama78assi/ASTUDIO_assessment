import { configureStore } from "@reduxjs/toolkit";
import products from "./stateSlices/products";
import users from "./stateSlices/users";

const store = configureStore({
  reducer: { users, products },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
