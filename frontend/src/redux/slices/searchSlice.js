import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/searches`

const initialState = {
  searches: [],
  searchModels: [],
  searchTable: null,
}

const findSearchRecords = createAsyncThunk(
  'searches/findSearchRecords',
  async (field, thunkAPI) => {
    // const { fetchProfitReqId, fetchingProfitCenters } = thunkAPI.getState().search
    // if (!fetchingProfitCenters || thunkAPI.requestId !== fetchProfitReqId) {
    //   return
    // }
    try {
      const res = await api().post(`${ApiUrl}/models`, field)

      console.log(res.data)
      // return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

const clearSearchRecords = createAsyncThunk('reports/clearSearchRecords', (_, thunkAPI) => {
  return thunkAPI.rejectWithValue([])
})

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: {
    [findSearchRecords.pending]: (state, action) => {
      if (!state.findingSearchReport) {
        state.findingSearchReport = true
        state.findSearchReqId = action.meta.requestId
      }
    },
    [findSearchRecords.fulfilled]: (state, action) => {
      if (state.findingSearchReport && state.findSearchReqId === action.meta.requestId) {
        state.findingSearchReport = false
        state.findSearchReqId = undefined
      }
      if (action.payload) {
        state.reports = action.payload.filterd
        state.totalReport = action.payload.total
      }
    },
    [findSearchRecords.rejected]: (state, action) => {
      if (state.findingSearchReport) {
        state.findingSearchReport = false
        state.findSearchReqId = action.meta.requestId
      }
    },

    [clearSearchRecords.rejected]: (state, action) => {
      if (action.payload) {
        state.searchTable = null
        state.searchModels = []
      }
    },
  },
})

export { findSearchRecords }
export default searchSlice.reducer
