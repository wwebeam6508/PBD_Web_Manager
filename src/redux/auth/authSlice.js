import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    prePermission: null,
  },
  reducers: {
    setAuth(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setUserProfile(state, action) {
      state.prePermission = action.payload.prePermission;
      state.user.userProfile = action.payload.userData;
    },
    setLogout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUserAfterEdit(state, action) {
      let user = state.user;
      user.userProfile = action.payload;
    },
    setUserToken(state, action) {
      state.user.accessToken = action.payload.accessToken;
    },
  },
});

export const {
  setAuth,
  setLogout,
  setUserAfterEdit,
  setUserToken,
  setUserProfile,
} = authSlice.actions;
