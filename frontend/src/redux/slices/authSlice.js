import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_URL } from 'src/config/domainLinks'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const ApiUrl = '/v1/signin'
const userApi = '/v1/api/userdetails'

const initialState = {
  authUser: null,
  lookupData: null,
  entities: [],
  loginLoading: false,
  currentRequestId: undefined,
  loginValidationErrors: {
    loginID: '',
    password: '',
  },
  userRecoverd: null,
  recoveringFgtPswd: false,
  recoverFgtPswdReqId: undefined,
  forgotPswdErrors: {
    loginID: '',
  },
  error: null,
  fetchingUser: false,
  fetchUserReqId: undefined,
}

const fetchUserDetails = createAsyncThunk('auth/fetchUserDetails', async (_, thunkAPI) => {
  try {
    const res = await api().get(`${userApi}`, {
      withCredentials: true,
    })

    console.log(res)
    if (res.data && res.data.statusCode === 200) {
      Cookies.set('utx_', res.data.userDetails.uuid)
    }

    return thunkAPI.fulfillWithValue(res.data)
  } catch (error) {
    console.log('error', error)
    // if (!err.response) {
    //   throw err
    // }
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

const recoverForgotPassword = createAsyncThunk(
  'auth/recoverForgotPassword',
  async (field, thunkAPI) => {
    const { recoverFgtPswdReqId, recoveringFgtPswd } = thunkAPI.getState().auth
    if (!recoveringFgtPswd || thunkAPI.requestId !== recoverFgtPswdReqId) {
      return false
    }
    try {
      const res = await api().post(`${ApiUrl}/forgot_password`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const fetchUserById = createAsyncThunk(
  'auth/fetchUserById',
  async (loginData, { getState, requestId, rejectWithValue, fulfillWithValue }) => {
    const { currentRequestId, loginLoading } = getState().auth
    if (!loginLoading || requestId !== currentRequestId) {
      return
    }
    const { loginID, ...fields } = loginData
    try {
      const res = await axios.post(`${API_URL + ApiUrl}/lookup/${loginID}`, fields, {
        withCredentials: true,
      })
      return fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        return rejectWithValue(
          JSON.stringify({ code: err.status ? err.status : 500, errors: err.message }),
        )
      }

      return rejectWithValue(err.response.data)
    }
  },
)

const checkUserPassword = createAsyncThunk(
  'auth/checkUserPassword',
  async (loginData, { getState, requestId, rejectWithValue, fulfillWithValue }) => {
    const { currentRequestId, loginLoading } = getState().auth
    if (!loginLoading || requestId !== currentRequestId) {
      return
    }
    try {
      const res = await axios.post(
        `${API_URL + ApiUrl}/primary/${loginData.identifier}`,
        loginData,
        {
          withCredentials: true,
        },
      )

      console.log(`res.data`, res.data)

      return fulfillWithValue(res.data)
    } catch (err) {
      console.log(`res.err`, err)

      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  },
)

const showCommonError = createAsyncThunk(
  'auth/showCommonError',
  (field, { getState, fulfillWithValue }) => {
    return fulfillWithValue(field)
  },
)

const clearCommonError = createAsyncThunk(
  'auth/clearCommonError',
  (field, { fulfillWithValue }) => {
    return fulfillWithValue(field)
  },
)

const checkUserAuthenticated = createAsyncThunk(
  'auth/checkUserAuthenticated',
  async (field, { fulfillWithValue, rejectWithValue }) => {
    const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
    const ApiUrl = `/v1/adminapi/orgs/${utxId}/checkUser`
    try {
      const res = await api().post(`${ApiUrl}`, field)
      return fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  },
)

const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (field, { fulfillWithValue, rejectWithValue, getState }) => {
    const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
    const ApiUrl = `/v1/adminapi/orgs/${utxId}/logout`
    try {
      const res = await api().post(`${ApiUrl}`, field)
      return fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return rejectWithValue(err.response.data)
    }
  },
)

const clearLookupData = createAsyncThunk(
  'auth/clearLookupData',
  async (field, { fulfillWithValue }) => {
    return fulfillWithValue(field)
  },
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    [clearLookupData.fulfilled]: (state) => {
      state.lookupData = null
    },
    [fetchUserById.pending]: (state, action) => {
      if (state.loginLoading === false) {
        state.loginLoading = true
        state.currentRequestId = action.meta.requestId
      }
    },
    [fetchUserById.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.loginLoading === true && state.currentRequestId === requestId) {
        state.loginLoading = false
        state.currentRequestId = undefined
      }

      if (action.payload && action.payload.code === 200) {
        state.lookupData = action.payload
      }
    },
    [fetchUserById.rejected]: (state, action) => {
      const { requestId } = action.meta
      if (state.loginLoading && state.currentRequestId === requestId) {
        state.loginLoading = false
        state.currentRequestId = undefined
      }
      if (action.payload) {
        if (action.payload.statusCode === 400) {
          state.loginValidationErrors.loginID = action.payload.localizedMessage
        }
      }
    },
    [showCommonError.pending]: (state, action) => {
      if (!state.loginLoading) {
        state.loginLoading = true
        state.currentRequestId = action.meta.requestId
      }
    },
    [checkUserAuthenticated.fulfilled]: (state, action) => {
      if (action.payload) {
        state.authUser = action.payload
      }
    },
    [fetchUserDetails.pending]: (state, action) => {
      if (!state.fetchingUser) {
        state.fetchingUser = true
        state.fetchUserReqId = action.meta.requestId
      }
    },
    [fetchUserDetails.fulfilled]: (state, action) => {
      if (action.payload && action.payload.statusCode === 200) {
        state.authUser = action.payload.userDetails
      }
    },
    [fetchUserDetails.rejected]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingUser && state.fetchUserReqId === requestId) {
        state.fetchingUser = false
        state.fetchUserReqId = undefined
      }
    },
    [showCommonError.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.loginLoading && state.currentRequestId === requestId) {
        state.loginLoading = false
        state.currentRequestId = undefined
      }
      switch (action.payload.errorType) {
        case 'enterEmailOrMobile':
          if (action.payload.type === 'loginID') {
            state.loginValidationErrors.loginID = 'Please enter your email address or mobile number'
          } else if (action.payload.type === 'password') {
            state.loginValidationErrors.password = 'Please enter your password'
          }
          return

        case 'enterFgtPswd':
          if (action.payload.type === 'loginID') {
            state.forgotPswdErrors.loginID = 'Please enter your email, mobile number or username'
          }
          return

        default:
          break
      }
    },
    [showCommonError.rejected]: (state, action) => {
      if (!state.loginLoading) {
        state.loginLoading = true
        state.currentRequestId = action.meta.requestId
      }
    },
    [clearCommonError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'enterFgtPswd') {
        state.forgotPswdErrors = {
          ...state.forgotPswdErrors,
          [action.payload.type]: '',
        }
      } else {
        state.loginValidationErrors = {
          ...state.loginValidationErrors,
          [action.payload.type]: '',
        }
      }
    },
    [checkUserPassword.pending]: (state, action) => {
      if (state.loginLoading === false) {
        state.loginLoading = true
        state.currentRequestId = action.meta.requestId
      }
    },
    [checkUserPassword.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.loginLoading === true && state.currentRequestId === requestId) {
        state.loginLoading = false
        state.currentRequestId = undefined
      }
      if (action.payload && action.payload.statusCode === 500) {
        state.loginValidationErrors.password = action.payload.localizedMessage
      }
    },
    [checkUserPassword.rejected]: (state, action) => {
      const { requestId } = action.meta
      if (state.loginLoading && state.currentRequestId === requestId) {
        state.loginLoading = false
        state.currentRequestId = undefined
      }
    },
    [recoverForgotPassword.pending]: (state, action) => {
      if (!state.recoveringFgtPswd) {
        state.recoveringFgtPswd = true
        state.recoverFgtPswdReqId = action.meta.requestId
      }
    },
    [recoverForgotPassword.fulfilled]: (state, action) => {
      if (state.recoveringFgtPswd && state.recoverFgtPswdReqId === action.meta.requestId) {
        state.recoveringFgtPswd = false
        state.recoverFgtPswdReqId = undefined
      }
      if (action.payload) {
        state.userRecoverd = action.payload
      }
    },
    [recoverForgotPassword.rejected]: (state, action) => {
      if (state.recoveringFgtPswd) {
        state.recoveringFgtPswd = false
        state.recoverFgtPswdReqId = action.meta.requestId
      }

      console.log(action.payload)

      if (action.payload && action.payload.errors) {
        for (const [key, value] of Object.entries(action.payload.errors)) {
          state.forgotPswdErrors = {
            ...state.forgotPswdErrors,
            [key]: value,
          }
        }
      }
    },
  },
})

export {
  logoutUser,
  fetchUserDetails,
  fetchUserById,
  showCommonError,
  clearCommonError,
  checkUserPassword,
  checkUserAuthenticated,
  clearLookupData,
  recoverForgotPassword,
}
export default authSlice.reducer
