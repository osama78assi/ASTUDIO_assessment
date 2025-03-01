import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { User } from "../types/APIsResponseTypes";
import { UsersState } from "../types/GlobalStateTypes";
import { API_BASE_URL } from "../util/constant";

const initialState: UsersState = {
  currentPage: 1,
  totalUsers: 0,
  users: null,
  isLoading: true,
  error: null,
  recordsPerPage: 5,
  searchValue: "",
  filterField: "",
  filterValue: "",
};

export const setUsers = createAsyncThunk<User[], void, { state: RootState }>(
  "users/setUsers",
  async function (_, thunkAPI) {
    try {
      const limit = thunkAPI.getState().users.recordsPerPage;
      const skip = (thunkAPI.getState().users.currentPage - 1) * limit; // same as recordsPerPage

      const res = await axios.get<{ users: User[]; total: number }>(
        `${API_BASE_URL}/users?limit=${limit}&skip=${skip}&select=id,firstName,maidenName,lastName,role,gender,email,username,bloodGroup,eyeColor,phone,birthDate,university`
      );

      thunkAPI.dispatch(setUsersCount(res.data.total));

      return res.data.users;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
      throw err;
    }
  }
);

// Server side filtering
export const setFilteredUsers = createAsyncThunk<
  User[],
  void,
  { state: RootState }
>("users/setFilteredUsers", async function (_, thunkAPI) {
  try {
    // Skip and limit are also found in case where there is a filter
    const {
      filterField,
      filterValue,
      recordsPerPage: limit,
    } = thunkAPI.getState().users;
    const skip = (thunkAPI.getState().users.currentPage - 1) * limit;

    const res = await axios.get<{ users: User[]; total: number }>(
      `${API_BASE_URL}/users/filter?limit=${limit}&skip=${skip}&key=${filterField}&value=${filterValue}&select=id,firstName,maidenName,lastName,age,gender,email,username,bloodGroup,eyeColor,phone,birthDate,university`
    );

    thunkAPI.dispatch(setUsersCount(res.data.total));

    return res.data.users;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    throw err;
  }
});

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    setRecordsPerPage(state, action) {
      state.recordsPerPage = action.payload;
    },

    setUsersCount(state, action) {
      state.totalUsers = action.payload;
    },

    setFilter(state, { payload: { filterField, filterValue } }) {
      state.filterField = filterField;
      state.filterValue = filterValue;
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    // In case of getting users without filters
    builder.addCase(setUsers.pending, function (state) {
      state.error = null; // In case if there is a reload
      state.isLoading = true;
    });
    builder.addCase(setUsers.fulfilled, function (state, action) {
      state.users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(setUsers.rejected, function (state, action) {
      state.error = action.error as Error;
      state.isLoading = false;
    });

    // In case of getting filtered users
    builder.addCase(setFilteredUsers.pending, function (state) {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(setFilteredUsers.fulfilled, function (state, action) {
      state.users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(setFilteredUsers.rejected, function (state, action) {
      state.error = action.error as Error;
      state.isLoading = false;
    });
  },
});

export const {
  setSearchValue,
  setUsersCount,
  setCurrentPage,
  setRecordsPerPage,
  setFilter,
  clearError
} = slice.actions;
export default slice.reducer;
