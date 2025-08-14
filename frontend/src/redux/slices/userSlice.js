import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/users`

const initialState = {
  users: [],
  userErrors: {
    userName: '',
    phone: '',
    email: '',
    officeTel: '',
    extTel: '',
    language: '',
    password: '',
    userAvatar: '',
    userTimeZone: '',
    password_confirmation: '',
  },
  creatingUser: false,
  storeUserReqId: undefined,
  showUser: null,
  findingUser: false,
  findUserReqId: undefined,
  showingUserError: false,
  fetchUserReqId: undefined,
  fetchingUsers: false,
  sendingEmailActivation: false,
  sendActiveReqId: undefined,
  activatedUser: null,
}

const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, thunkAPI) => {
  const { fetchUserReqId, fetchingUsers } = thunkAPI.getState().user
  if (!fetchingUsers || thunkAPI.requestId !== fetchUserReqId) {
    return
  }
  try {
    const res = await api().get(`${ApiUrl}`)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const createUser = createAsyncThunk('user/createUser', async (field, thunk) => {
  const { storeUserReqId, creatingUser } = thunk.getState().user
  if (!creatingUser || thunk.requestId !== storeUserReqId) {
    return false
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const findUser = createAsyncThunk('user/findUser', async (Id, thunk) => {
  const { findUserReqId, findingUser } = thunk.getState().user
  if (!findingUser || thunk.requestId !== findUserReqId) {
    return false
  }
  try {
    const res = await api().get(`${ApiUrl}/${Id}`)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const destroyUser = createAsyncThunk('user/destroyUser', async (Id, thunk) => {
  const { destroyingUserReqId, destroyingUser } = thunk.getState().user
  if (!destroyingUser || thunk.requestId !== destroyingUserReqId) {
    return false
  }
  try {
    const res = await api().delete(`${ApiUrl}/${Id}`)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const sendActivationEmail = createAsyncThunk('user/sendActivationEmail', async (field, thunk) => {
  const { sendActiveReqId, sendingEmailActivation } = thunk.getState().user
  if (!sendingEmailActivation || thunk.requestId !== sendActiveReqId) {
    return
  }
  try {
    const res = await api().post(`${ApiUrl}/activate_user`, field)
    return thunk.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunk.rejectWithValue(err.response.data)
  }
})

const showUserError = createAsyncThunk('user/showUserError', async (field, thunk) => {
  const { showUserReqId, showingUserError } = thunk.getState().user
  if (!showingUserError || thunk.requestId !== showUserReqId) {
    return false
  }

  return thunk.fulfillWithValue(field)
})

const clearUserError = createAsyncThunk('user/clearUserError', async (err, thunk) => {
  return thunk.fulfillWithValue(err)
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUsers.pending]: (state, action) => {
      if (!state.fetchingUsers) {
        state.fetchingUsers = true
        state.fetchUserReqId = action.meta.requestId
      }
    },
    [fetchUsers.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.fetchingUsers && state.fetchUserReqId === requestId) {
        state.fetchingUsers = false
        state.fetchUserReqId = undefined
      }

      state.users = action.payload
    },
    [fetchUsers.rejected]: (state, action) => {
      if (!state.fetchingUsers) {
        state.fetchingUsers = false
        state.fetchUserReqId = action.meta.requestId
      }
    },
    [createUser.pending]: (state, action) => {
      if (!state.creatingUser) {
        state.creatingUser = true
        state.storeUserReqId = action.meta.requestId
      }
    },
    [createUser.fulfilled]: (state, action) => {
      if (state.creatingUser && state.storeUserReqId === action.meta.requestId) {
        state.creatingUser = false
        state.storeUserReqId = undefined
      }
      if (action.payload) {
        state.users = [...state.users, action.payload]
      }
    },
    [createUser.rejected]: (state, action) => {
      if (state.creatingUser) {
        state.creatingUser = false
        state.storeUserReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.userErrors = {
              ...state.userErrors,
              [key]: value,
            }
          }
        }
      }
    },
    [destroyUser.pending]: (state, action) => {
      if (!state.destroyingUser) {
        state.destroyingUser = true
        state.destroyingUserReqId = action.meta.requestId
      }
    },
    [destroyUser.fulfilled]: (state, action) => {
      if (state.destroyingUser && state.destroyingUserReqId === action.meta.requestId) {
        state.destroyingUser = false
        state.destroyingUserReqId = undefined
      }
      if (action.payload) {
        action.payload.map((item) => {
          return (state.users = state.users.filter((x) => x.uuid !== item.uuid))
        })
      }
    },
    [destroyUser.rejected]: (state, action) => {
      if (state.destroyingUser) {
        state.destroyingUser = false
        state.destroyingUserReqId = action.meta.requestId
      }
      if (action.payload) {
        if (action.payload.errors) {
          for (const [key, value] of Object.entries(action.payload.errors)) {
            state.userErrors = {
              ...state.userErrors,
              [key]: value,
            }
          }
        }
      }
    },
    [showUserError.pending]: (state, action) => {
      if (!state.showingUserError) {
        state.showingUserError = true
        state.showUserReqId = action.meta.requestId
      }
    },
    [showUserError.fulfilled]: (state, action) => {
      if (state.showingUserError && state.showUserReqId === action.meta.requestId) {
        state.showingUserError = false
        state.showUserReqId = undefined
      }
      if (action.payload) {
        switch (action.payload.errorType) {
          case 'errUser':
            state.userErrors = {
              ...state.userErrors,
              [action.payload.type]: 'This field is required.',
            }
            return state
          default:
            return state
        }
      }
    },
    [showUserError.rejected]: (state, action) => {
      if (!state.showingUserError) {
        state.showingUserError = false
        state.showUserReqId = action.meta.requestId
      }
    },
    [findUser.pending]: (state, action) => {
      if (!state.findingUser) {
        state.findingUser = true
        state.findUserReqId = action.meta.requestId
      }
    },
    [findUser.fulfilled]: (state, action) => {
      if (state.findingUser && state.findUserReqId === action.meta.requestId) {
        state.findingUser = false
        state.findUserReqId = undefined
      }
      if (action.payload) {
        state.showUser = action.payload
      }
    },
    [findUser.rejected]: (state, action) => {
      if (state.findingUser) {
        state.findingUser = false
        state.findUserReqId = action.meta.requestId
      }
    },
    [clearUserError.fulfilled]: (state, action) => {
      if (action.payload.errorType === 'errUser') {
        state.userErrors = {
          ...state.userErrors,
          [action.payload.type]: '',
        }
      }
    },
    [sendActivationEmail.pending]: (state, action) => {
      if (!state.sendingEmailActivation) {
        state.sendingEmailActivation = true
        state.sendActiveReqId = action.meta.requestId
      }
    },
    [sendActivationEmail.fulfilled]: (state, action) => {
      const { requestId } = action.meta
      if (state.sendingEmailActivation && state.sendActiveReqId === requestId) {
        state.sendingEmailActivation = false
        state.sendActiveReqId = undefined
      }
      if (action.payload) {
        state.activatedUser = action.payload
      }
    },
    [sendActivationEmail.rejected]: (state, action) => {
      if (!state.sendingEmailActivation) {
        state.sendingEmailActivation = false
        state.sendActiveReqId = action.meta.requestId
      }
    },
  },
})

export {
  findUser,
  fetchUsers,
  createUser,
  destroyUser,
  clearUserError,
  showUserError,
  sendActivationEmail,
}
export default userSlice.reducer
