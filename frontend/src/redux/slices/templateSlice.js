import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/config/api'
import Cookies from 'js-cookie'
import { isUndefined } from 'lodash'

const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
const ApiUrl = `/v1/adminapi/orgs/${utxId}/templates`

const initialState = {
  findingTemplate: false,
  findReqId: undefined,
  showTemplate: [],
}

const findTemplate = createAsyncThunk(
  'templates/findTemplate',
  async ({ Id, ...field }, thunkAPI) => {
    const { findReqId, findingTemplate } = thunkAPI.getState().template
    if (!findingTemplate || thunkAPI.requestId !== findReqId) {
      return
    }
    try {
      const res = await api().post(`${ApiUrl}/${Id}`, field)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (err) {
      if (!err.response) {
        throw err
      }
      return thunkAPI.rejectWithValue(err.response.data)
    }
  },
)

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {},
  extraReducers: {
    [findTemplate.pending]: (state, action) => {
      if (!state.findingTemplate) {
        state.findingTemplate = true
        state.findReqId = action.meta.requestId
      }
    },
    [findTemplate.fulfilled]: (state, action) => {
      if (state.findingTemplate && state.findReqId === action.meta.requestId) {
        state.findingTemplate = false
        state.findReqId = undefined
      }
      if (action.payload) {
        state.showTemplate = action.payload
      }
    },
    [findTemplate.rejected]: (state, action) => {
      if (state.findingTemplate) {
        state.findingTemplate = false
        state.findReqId = action.meta.requestId
      }
    },
  },
})

export { findTemplate }
export default templateSlice.reducer
