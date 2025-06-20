import { createSlice } from '@reduxjs/toolkit';

const initialState={
    userType:null,
}
const userTypeSlice = createSlice({
  name:'userType',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      const { userType } = action.payload;
      state.userType=userType;
    },
  },
});

export const { setUserType } = userTypeSlice.actions;
export default userTypeSlice.reducer;