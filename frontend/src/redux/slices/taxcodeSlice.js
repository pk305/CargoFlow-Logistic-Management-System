import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/taxcodes`

const initialState = {
  taxcodes: [],
  taxcode: null,
  creatingTaxcode: false,
  createTaxReqId: undefined,
  findingTaxcode: false,
  findTaxReqId: undefined,
  updatingTaxcode: false,
  updateTempReqId: undefined,
  fetchingTaxcodes: false,
  fetchTaxcodeReqId: undefined,
}

const fetchTaxcodes = createAsyncThunk('taxcodes/fetchTaxcodes', async (_, thunkAPI) => {
  const { fetchTaxcodeReqId, fetchingTaxcodes } = thunkAPI.getState().taxcode
  if (!fetchingTaxcodes || thunkAPI.requestId !== fetchTaxcodeReqId) {
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

const createTaxcode = createAsyncThunk('taxcodes/createTaxcode', async (field, thunkAPI) => {
  const { createTaxReqId, creatingTaxcode } = thunkAPI.getState().taxcode
  if (!creatingTaxcode || thunkAPI.requestId !== createTaxReqId) {
    return
  }
  try {
    const res = await api().post(`${ApiUrl}`, field)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

const updateTaxcode = createAsyncThunk(
  'taxcodes/updateTaxcode',
  async ({ Id, ...field }, thunkAPI) => {
    try {
      const res = await api().put(`${ApiUrl}/${Id}`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const findTaxcode = createAsyncThunk('taxcodes/findTaxcode', async (field, thunkAPI) => {
  const { findTaxReqId, findingTaxcode } = thunkAPI.getState().taxcode
  if (!findingTaxcode || thunkAPI.requestId !== findTaxReqId) {
    return
  }
  try {
    const res = await api().get(`${ApiUrl}/${field}`)
    return thunkAPI.fulfillWithValue(res.data)
  } catch (err) {
    if (!err.response) {
      throw err
    }
    return thunkAPI.rejectWithValue(err.response.data)
  }
})

export const taxcodeSlice = createSlice({
  name: 'taxcode',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTaxcodes.pending]: (state, action) => {
      if (!state.fetchingTaxcodes) {
        state.fetchingTaxcodes = true
        state.fetchTaxcodeReqId = action.meta.requestId
      }
    },
    [fetchTaxcodes.fulfilled]: (state, action) => {
      if (state.fetchingTaxcodes && state.fetchTaxcodeReqId === action.meta.requestId) {
        state.fetchingTaxcodes = false
        state.fetchTaxcodeReqId = undefined
      }
      if (action.payload) {
        state.taxcodes = action.payload
      }
    },
    [fetchTaxcodes.rejected]: (state, action) => {
      if (state.fetchingTaxcodes) {
        state.fetchingTaxcodes = false
        state.fetchTaxcodeReqId = action.meta.requestId
      }
    },
    [createTaxcode.pending]: (state, action) => {
      if (!state.creatingTaxcode) {
        state.creatingTaxcode = true
        state.createTaxReqId = action.meta.requestId
      }
    },
    [createTaxcode.fulfilled]: (state, action) => {
      if (state.creatingTaxcode && state.createTaxReqId === action.meta.requestId) {
        state.creatingTaxcode = false
        state.createTaxReqId = undefined
      }
      if (action.payload) {
        state.taxcode = action.payload
      }
    },
    [createTaxcode.rejected]: (state, action) => {
      if (state.creatingTaxcode) {
        state.creatingTaxcode = false
        state.createTaxReqId = action.meta.requestId
      }
    },
    [findTaxcode.pending]: (state, action) => {
      if (!state.findingTaxcode) {
        state.findingTaxcode = true
        state.findTaxReqId = action.meta.requestId
      }
    },
    [findTaxcode.fulfilled]: (state, action) => {
      if (state.findingTaxcode && state.findTaxReqId === action.meta.requestId) {
        state.findingTaxcode = false
        state.findTaxReqId = undefined
      }
      if (action.payload) {
        state.taxcode = action.payload
      }
    },
    [findTaxcode.rejected]: (state, action) => {
      if (state.findingTaxcode) {
        state.findingTaxcode = false
        state.findTaxReqId = action.meta.requestId
      }
    },
  },
})

export { fetchTaxcodes, updateTaxcode, findTaxcode, createTaxcode }
export default taxcodeSlice.reducer
