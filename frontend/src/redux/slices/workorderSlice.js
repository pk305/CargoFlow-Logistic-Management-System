import { createSlice } from '@reduxjs/toolkit'
// import api from 'src/config/api'
// import Cookies from 'js-cookie'
// import { isUndefined } from 'lodash'

// const utxId = !isUndefined(Cookies.get('utx_')) ? Cookies.get('utx_') : null
// const ApiUrl = `/v1/adminapi/orgs/${utxId}/setups`

const initialState = {
  workorders: [],
}

export const workorderSlice = createSlice({
  name: 'workorder',
  initialState,
  reducers: {},
  extraReducers: {},
})

// export {  }
export default workorderSlice.reducer
