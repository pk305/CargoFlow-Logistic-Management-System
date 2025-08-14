import React, { useState } from 'react'
import {
  CButton,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import PropTypes from 'prop-types'

const NewProfitCenter = ({ closeProfCenterModal }) => {
  const [profitCenterData, setProfitCenterData] = useState({
    parentId: '',
    name: '',
    notes: '',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setProfitCenterData({
      ...profitCenterData,
      [name]: value,
    })
  }

  const handleSubmitAccPlan = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <form className="simple_form horizontal-form" id="new_ledger_account">
        <CModalBody>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group select optional profit_center_parent_id">
                <label className="control-label select optional" htmlFor="profit_center_parent_id">
                  Parent
                </label>
                <CFormSelect
                  className="form-control-cst select optional"
                  name="parentId"
                  id="profit_center_parent_id"
                  value={profitCenterData.parentId}
                  onChange={(e) => handleChangeForm(e)}
                >
                  <option value=""></option>
                  <option value="18297">B-BALANCE ACCOUNTS</option>
                  <option value="18399">KE-Individual Processing</option>
                </CFormSelect>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group profit_center_name">
                <label className="control-label" htmlFor="profit_center_name">
                  Account
                </label>
                <CFormInput
                  className="form-control-cst"
                  type="text"
                  name="name"
                  id="profit_center_name"
                  value={profitCenterData.name}
                  onChange={(e) => handleChangeForm(e)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group profit_center_notes">
                <label className="control-label" htmlFor="profit_center_notes">
                  Notes
                </label>
                <CFormTextarea
                  className="form-control-cst"
                  name="notes"
                  id="profit_center_notes"
                  value={profitCenterData.notes}
                  onChange={(e) => handleChangeForm(e)}
                ></CFormTextarea>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => closeProfCenterModal()}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSubmitAccPlan()}>
            {/* {creatingFinancial ? 'Processing...' : 'Save'} */}
            Save
          </CButton>
        </CModalFooter>
      </form>
    </div>
  )
}

NewProfitCenter.propTypes = {
  closeProfCenterModal: PropTypes.func,
}
export default NewProfitCenter
