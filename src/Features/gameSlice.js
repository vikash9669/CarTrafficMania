import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  guestSignInApi,
  deleteEmailAccountApi,
  deleteGuestAccountApi,
  gameOverApi,
  emailSignInApi,
  updateGuestUserNameApi
} from "../Api/Api";

export const signInAsGuest = createAsyncThunk(
  "guest/signInAsGuest",
  async (body, thunkAPI) => {
    try {
      const response = await guestSignInApi(body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  "guest/signInWithEmail",
  async (body, thunkAPI) => {
    try {
      const response = await emailSignInApi(body);
      console.log(body);
      console.log(response);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const submitScore = createAsyncThunk(
  "guest/submitScore",
  async (body, thunkAPI) => {
    try {
      console.log("submit Score: " + body)
      const response = await gameOverApi(body);
      console.log("response submit Score: " + response.score)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const deleteGuestAccount = createAsyncThunk(
  "guest/deleteGuestAccount",
  async (body, thunkAPI) => {
    try {
      console.log("account delete" + body)
      const response = await deleteGuestAccountApi(body);
      console.log("response delete: " + response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const deleteEmailAccount = createAsyncThunk(
  "auth/deleteEmailAccount",
  async (body, thunkAPI) => {
    try {
      const response = await deleteEmailAccountApi(body);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);

export const updateGuestUserName = createAsyncThunk(
  "guest/updateGuestUserName",
  async (body, thunkAPI) => {
    try {
      console.log("updateGuestUserName called", body);
      const response = await updateGuestUserNameApi(body);
      console.log("response updateGuestUserName: " + response)
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  }
);



const initialState = {
  guests: [],
  emails: [],
  guestSignInData: {},
  guestSignInLoading: false,
  guestSignInSuccess: null,
  guestSignInError: null,
  emailSignInData: {},
  emailSignInLoading: false,
  emailSignInSuccess: null,
  emailSignInError: null,
  gameOverData: {},
  gameOverLoading: false,
  gameOverSuccess: null,
  gameOverError: null,
  deleteGuestAccountData: {},
  deleteGuestAccountLoading: false,
  deleteGuestAccountSuccess: null,
  deleteGuestAccountError: null,
  deleteEmailAccountData: {},
  deleteEmailAccountLoading: false,
  deleteEmailAccountSuccess: null,
  deleteEmailAccountError: null,
  updateGuestNameData: {},
  updateGuestNameLoading: false,
  updateGuestNameSuccess: null,
  updateGuestNameError: null,
 
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addGuest: (state, action) => {
      state.guests.push(action.payload);
    },
    addEmail: (state, action) => {
      state.emails.push(action.payload);
    },
    addUserScore: (state, action) => {
      state.score = action.payload;
    },
    deleteGuest: (state, action) => {
      state.guestDelete = action.payload;
      // Implement the logic to delete a guest
    },
    deleteEmail: (state, action) => {
      // Implement the logic to delete an email
      state.emailDelete = action.payload;
    },
    updateGuestName: (state, action) => {
      state.guestUserName = action.payload;
    },
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsGuest.pending, (state) => {
        state.guestSignInLoading = true;
        state.guestSignInSuccess = false;

      })
      .addCase(signInAsGuest.fulfilled, (state, action) => {
        state.guestSignInLoading = false;
        state.guestSignInData = action.payload;
        state.guestSignInSuccess = true;
      })
      .addCase(signInAsGuest.rejected, (state, action) => {
        state.guestSignInLoading = false;
        state.guestSignInError = action.error;
        state.guestSignInSuccess = false;

      })

      .addCase(signInWithEmail.pending, (state) => {
        state.emailSignInLoading = true;
        state.emailSignInSuccess = false;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.emailSignInLoading = false;
        state.emailSignInData = action.payload;
        state.emailSignInSuccess = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.emailSignInLoading = false;
        state.emailSignInError = action.error;
        state.emailSignInSuccess = false;
      })

      .addCase(submitScore.pending, (state) => {
        state.gameOverLoading = true;
        state.gameOverSuccess = false;
      })
      .addCase(submitScore.fulfilled, (state, action) => {
        state.gameOverLoading = false;
        state.gameOverData = action.payload;
        state.gameOverSuccess = true;
      })
      .addCase(submitScore.rejected, (state, action) => {
        state.gameOverLoading = false;
        state.gameOverError = action.error;
        state.gameOverSuccess = false;
      })

      .addCase(deleteGuestAccount.pending, (state) => {
        state.deleteGuestAccountLoading = true;
        state.deleteGuestAccountSuccess = false;
      })
      .addCase(deleteGuestAccount.fulfilled, (state, action) => {
        state.deleteGuestAccountLoading = false;
        state.deleteGuestAccountData = action.payload;
        state.deleteGuestAccountSuccess = true;
      })
      .addCase(deleteGuestAccount.rejected, (state, action) => {
        state.deleteGuestAccountLoading = false;
        state.deleteGuestAccountError = action.error;
        state.deleteGuestAccountSuccess = false;
      })

      .addCase(deleteEmailAccount.pending, (state) => {
        state.deleteEmailAccountLoading = true;
        state.deleteEmailAccountSuccess = false;
      })
      .addCase(deleteEmailAccount.fulfilled, (state, action) => {
        state.deleteEmailAccountLoading = false;
        state.deleteEmailAccountData = action.payload;
        state.deleteEmailAccountSuccess = true;
      })
      .addCase(deleteEmailAccount.rejected, (state, action) => {
        state.deleteEmailAccountLoading = false;
        state.deleteEmailAccountError = action.error;
        state.deleteEmailAccountSuccess = false;
      })
     
      .addCase(updateGuestUserName.pending, (state) => {
        state.updateGuestNameLoading = true;
        state.updateGuestNameSuccess = false;
      })
      .addCase(updateGuestUserName.fulfilled, (state, action) => {
        state.updateGuestNameLoading = false;
        state.updateGuestNameData = action.payload;
        state.updateGuestNameSuccess = true;
      })
      .addCase(updateGuestUserName.rejected, (state, action) => {
        state.updateGuestNameLoading = false;
        state.updateGuestNameError = action.error;
        state.updateGuestNameSuccess = false;
      });
  },
});

export const { addGuest, addEmail, addUserScore, deleteGuest, deleteEmail, updateGuestName } = gameSlice.actions;

export default gameSlice.reducer;
