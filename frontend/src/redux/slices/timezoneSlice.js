import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/timezones`

const initialState = {
  timezones: [],
  fetchingTimezones: false,
  fetchTmzReqId: undefined,
}

const fetchTimezones = createAsyncThunk('timezones/fetchTimezones', async (_, thunkAPI) => {
  const { fetchTmzReqId, fetchingTimezones } = thunkAPI.getState().timezone
  if (!fetchingTimezones || thunkAPI.requestId !== fetchTmzReqId) {
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

export const timezoneSlice = createSlice({
  name: 'timezone',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTimezones.pending]: (state, action) => {
      if (!state.fetchingTimezones) {
        state.fetchingTimezones = true
        state.fetchTmzReqId = action.meta.requestId
      }
    },
    [fetchTimezones.fulfilled]: (state, action) => {
      if (state.fetchingTimezones && state.fetchTmzReqId === action.meta.requestId) {
        state.fetchingTimezones = false
        state.fetchTmzReqId = undefined
      }
      if (action.payload) {
        state.timezones = action.payload
      }
    },
    [fetchTimezones.rejected]: (state, action) => {
      if (state.fetchingTimezones) {
        state.fetchingTimezones = false
        state.fetchTmzReqId = action.meta.requestId
      }
    },
  },
})

export { fetchTimezones }
export default timezoneSlice.reducer
