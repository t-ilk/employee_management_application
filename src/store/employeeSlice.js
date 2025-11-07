import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
  error: null
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.list = action.payload;
    }
  }
});

export const { setEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;