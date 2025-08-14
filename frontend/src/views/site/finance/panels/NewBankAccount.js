import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import $ from 'jquery'
import Noty from 'noty'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import {
  clearFinpointError,
  createFinpoint,
  showFinpointError,
} from 'src/redux/slices/finpointSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchUsers } from 'src/redux/slices/userSlice'

const NewBankAccount = ({ handleCancelSlide }) => {
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const [finpointData, setFinpointData] = useState({
    title: '',
    pointType: 'cash_point',
    curr: '',
    reference: '',
    bank: '',
    useOnInvoice: '',
    accountType: '',
    bankOfficial: '',
    status: 'active',
    bankDefinitionId: '',
    branchId: `${authUser && authUser.branch && authUser.branch.id}`,
    managerId: `${authUser && authUser.uuid}`,
  })
  const [intergrateAcc, setIntergrateAcc] = useState(false)
  const { creatingFinpoint, finpointErrors } = useSelector((state) => state.finpoint)
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setFinpointData({
      ...finpointData,
      [name]: value,
    })
  }

  const handleIntergrateAcc = (e) => {
    e.preventDefault()
    setIntergrateAcc(!intergrateAcc)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearFinpointError({ type: c, errorType: 'errFinpoint' }))

    if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'curr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    } else if (c === 'managerId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    }
  }

  const handleSubmitFinpoint = async (e) => {
    e.preventDefault()
    const form = $('#new_finpoint')
    if (form.length > 0) {
      if (finpointData.title === '') {
        dispatch(showFinpointError({ type: 'title', errorType: 'errFinpoint' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(finpointData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createFinpoint(formData)).unwrap()
    if (resData) {
      clearFinpData()
      handleCancelSlide()
      new Noty({
        type: 'alert',
        text: 'Bank Account has been created succesfully',
        timeout: 3000,
      }).show()
    }
  }

  const clearFinpData = () => {
    setFinpointData({
      ...finpointData,
      title: '',
      pointType: 'cash_point',
      curr: '',
      reference: '',
      bank: '',
      useOnInvoice: '',
      accountType: '',
      bankOfficial: '',
      status: 'active',
      bankDefinitionId: '',
      branchId: `${authUser && authUser.branch && authUser.branch.id}`,
      managerId: `${authUser && authUser.uuid}`,
    })
  }

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-body">
          <CForm
            className="simple_form horizontal-form"
            id="new_finpoint"
            onSubmit={(e) => handleSubmitFinpoint(e)}
          >
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group finpoint_title">
                  <label className="control-label" htmlFor="finpoint_title">
                    Bank-Cash Point Name <span className="required">*</span>
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="title"
                    id="finpoint_title"
                    value={finpointData.title}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('title', e)}
                    invalid={finpointErrors && !isEmpty(finpointErrors.title) ? true : false}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {finpointErrors.title}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group required finpoint_point_type">
                  <label className="control-label required" htmlFor="finpoint_point_type">
                    Point Type <span className="required">*</span>
                  </label>
                  <CFormSelect
                    className="form-control-cst required"
                    name="pointType"
                    id="finpoint_point_type"
                    value={finpointData.pointType}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('pointType', e)}
                  >
                    <option value="cash_point">Cash Account</option>
                    <option value="bank_account">Bank Account</option>
                  </CFormSelect>
                  <CFormFeedback className="fieldError-cst">
                    {finpointErrors.pointType}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group finpoint_curr">
                  <label className="control-label select" htmlFor="finpoint_curr">
                    Currency
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="curr"
                    id="finpoint_curr"
                    value={finpointData.curr}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('curr', e)}
                    invalid={finpointErrors && !isEmpty(finpointErrors.curr) ? true : false}
                  >
                    {!fetchingCurrencies ? (
                      currencies && currencies.length > 0 ? (
                        <>
                          <option value=""></option>
                          {currencies.map((itm, i) => (
                            <option key={i} value={itm.id}>
                              {itm.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option value=""></option>
                          <option disabled>No results found.</option>
                        </>
                      )
                    ) : (
                      <>
                        <option value=""></option>
                        <option>Loading...</option>
                      </>
                    )}
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {finpointErrors.curr}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group required finpoint_branch_id">
                  <label className="control-label required" htmlFor="finpoint_branch_id">
                    Branch <span className="required">*</span>
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="branchId"
                    id="finpoint_branch_id"
                    value={finpointData.branchId}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('branchId', e)}
                    invalid={finpointErrors && !isEmpty(finpointErrors.branchId) ? true : false}
                  >
                    {!fetchingBranches ? (
                      branches && branches.length > 0 ? (
                        <>
                          <option value=""></option>
                          {branches.map((itm, i) => (
                            <option key={i} value={itm.id}>
                              {itm.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option value=""></option>
                          <option disabled>No results found.</option>
                        </>
                      )
                    ) : (
                      <>
                        <option value=""></option>
                        <option>Loading...</option>
                      </>
                    )}
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {finpointErrors.branchId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group finpoint_reference">
                  <label className="control-label" htmlFor="finpoint_reference">
                    IBAN No
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    placeholder="Account No, Iban, C.Card No ..."
                    type="text"
                    name="reference"
                    id="finpoint_reference"
                    value={finpointData.reference}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('reference', e)}
                    invalid={finpointErrors && !isEmpty(finpointErrors.reference) ? true : false}
                  />
                  <CFormFeedback className="fieldError-cst">
                    {finpointErrors.reference}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group finpoint_bank">
                  <label className="control-label" htmlFor="finpoint_bank">
                    Bank Name
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="bank"
                    id="finpoint_bank"
                    value={finpointData.bank}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('bank', e)}
                    invalid={finpointErrors && !isEmpty(finpointErrors.bank) ? true : false}
                  />
                  <CFormFeedback className="fieldError-cst">{finpointErrors.bank}</CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group finpoint_manager_id">
                  <label className="control-label select" htmlFor="finpoint_manager_id">
                    Person in Charge
                  </label>
                  <CFormSelect
                    className="form-control-cst select"
                    name="managerId"
                    id="finpoint_manager_id"
                    value={finpointData.managerId}
                    // defaultValue=/{authUser && authUser.name}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('managerId', e)}
                  >
                    {!fetchingUsers ? (
                      users && users.length > 0 ? (
                        <>
                          <option value=""></option>
                          {users.map((itm, i) => (
                            <option key={i} value={itm.uuid}>
                              {itm.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option value=""></option>
                          <option disabled>No results found.</option>
                        </>
                      )
                    ) : (
                      <>
                        <option value=""></option>
                        <option>Loading...</option>
                      </>
                    )}
                  </CFormSelect>
                  <CFormFeedback className="fieldError-cst">{finpointErrors.bank}</CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group boolean finpoint_use_on_invoice">
                  <label className="boolean" htmlFor="finpoint_use_on_invoice">
                    Print on Invoices / Payment Requests
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <input type="checkbox" name="useOnInvoice" id="finpoint_use_on_invoice" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group finpoint_bank_official">
                  <label className="control-label" htmlFor="finpoint_bank_official">
                    Bank Official
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="bankOfficial"
                    id="finpoint_bank_official"
                    value={finpointData.bankOfficial}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={(e) => handleSelectFocus('bankOfficial', e)}
                    invalid={finpointErrors && !isEmpty(finpointErrors.bankOfficial) ? true : false}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {finpointErrors.bankOfficial}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group finpoint_account_type">
                      <label className="control-label select" htmlFor="finpoint_account_type">
                        Account Type
                      </label>
                      <CFormSelect
                        className="form-control-cst public-private-selection"
                        name="accountType"
                        id="finpoint_account_type"
                        value={finpointData.accountType}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('accountType', e)}
                        invalid={
                          finpointErrors && !isEmpty(finpointErrors.accountType) ? true : false
                        }
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {finpointErrors.accountType}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group finpoint_status">
                      <label className="control-label select" htmlFor="finpoint_status">
                        Status
                      </label>
                      <CFormSelect
                        className="form-control-cst select"
                        name="status"
                        id="finpoint_status"
                        value={finpointData.status}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('status', e)}
                        invalid={finpointErrors && !isEmpty(finpointErrors.status) ? true : false}
                      >
                        <option value="active">Active</option>
                        <option value="passive">Passive</option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {finpointErrors.status}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 private-user-ids"
                style={{ display: 'none' }}
              >
                <div className="form-group finpoint_user_ids">
                  <label className="control-label select" htmlFor="finpoint_user_ids">
                    Related Users
                  </label>
                  <CFormInput name="finpoint[user_ids][]" type="hidden" />
                  <CFormSelect
                    className="form-control-cst select"
                    data-plugin="select2"
                    multiple=""
                    name="finpoint[user_ids][]"
                    id="finpoint_user_ids"
                    data-select2-id="finpoint_user_ids"
                    aria-hidden="true"
                  >
                    <option value="3835">Kennedy Peter</option>
                  </CFormSelect>
                </div>
              </div>
            </div>
            {!intergrateAcc && (
              <div className="row">
                <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    href="#"
                    className="btn btn-outline btn-info toggle_and_hide_button pull-left"
                    onClick={(e) => handleIntergrateAcc(e)}
                  >
                    <i className="fas fa-link"></i> Integration Service
                  </a>
                </div>
              </div>
            )}

            <div
              className="SlidingDiv"
              id="integration_details"
              style={{ display: !intergrateAcc ? 'none' : '' }}
            >
              <hr />
              <h5>Integration Service </h5>
              <div className="row">
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_bank_definition_id">
                    <label className="control-label select" htmlFor="finpoint_bank_definition_id">
                      Bank Name
                    </label>
                    <CFormSelect
                      className="form-control-cst select"
                      data-plugin="select2"
                      name="finpoint[bank_definition_id]"
                      id="finpoint_bank_definition_id"
                      data-select2-id="finpoint_bank_definition_id"
                      aria-hidden="true"
                    >
                      <option data-select2-id="3"></option>
                    </CFormSelect>
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_branch_code">
                    <label className="control-label" htmlFor="finpoint_branch_code">
                      Branch Code
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="finpoint[branch_code]"
                      id="finpoint_branch_code"
                    />
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_account_code">
                    <label className="control-label" htmlFor="finpoint_account_code">
                      Account Code
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="finpoint[account_code]"
                      id="finpoint_account_code"
                    />
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_company_code">
                    <label className="control-label" htmlFor="finpoint_company_code">
                      Company Code
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="finpoint[company_code]"
                      id="finpoint_company_code"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_uname">
                    <label className="control-label" htmlFor="finpoint_uname">
                      Username
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="finpoint[uname]"
                      id="finpoint_uname"
                    />
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_upass">
                    <label className="control-label" htmlFor="finpoint_upass">
                      Password
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="finpoint[upass]"
                      id="finpoint_upass"
                    />
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_vpos_id">
                    <label className="control-label select" htmlFor="finpoint_vpos_id">
                      Virtual Pos
                    </label>
                    <CFormSelect
                      className="form-control-cst select"
                      name="finpoint[vpos_id]"
                      id="finpoint_vpos_id"
                    >
                      <option></option>
                    </CFormSelect>
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group finpoint_swift_code">
                    <label className="control-label" htmlFor="finpoint_swift_code">
                      Swift Code
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="finpoint[swift_code]"
                      id="finpoint_swift_code"
                    />
                  </div>
                </div>
              </div>
              <hr />
              <h5> Cost Account </h5>
              <div className="row">
                <div className="col-12 col-xs-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group finpoint_cost_account_type">
                    <label className="control-label select" htmlFor="finpoint_cost_account_type">
                      Account Type
                    </label>
                    <div>
                      <div className="input-group">
                        <CFormSelect
                          className="form-control-cst account_type"
                          data-plugin="select2"
                          name="finpoint[cost_account_type]"
                          id="finpoint_cost_account_type"
                        >
                          <option value="Financor::LedgerAccount">Ledger Account</option>
                          <option value="Network::Company">Company</option>
                          <option value="Financor::BankAccount">Bank Account</option>
                          <option value="Financor::CashPoint">Cash Account</option>
                          <option value="Financor::CreditCard">Credit Card</option>
                          <option value="Hr::Person">Employee</option>
                          <option value="Fleet::Driver">Driver</option>
                        </CFormSelect>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-4 col-md-5 col-lg-5 col-xl-5">
                  <div className="form-group account finpoint_cost_account_id">
                    <label className="control-label account" htmlFor="finpoint_cost_account_id">
                      Cost Account
                    </label>
                    <div>
                      <div className="input-group">
                        <CFormSelect
                          className="form-control-cst account_select"
                          data-url="/roster/autocompletes.json?model=Financor::Account&amp;parent_type="
                          data-plugin="lookup"
                          data-minimuminputlength="0"
                          data-placeholder=""
                          data-parent-type2=""
                          name="finpoint[cost_account_id]"
                          id="finpoint_cost_account_id"
                          data-select2-id="finpoint_cost_account_id"
                          aria-hidden="true"
                        >
                          <option data-select2-id="8"></option>
                        </CFormSelect>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xs-12 col-sm-4 col-md-5 col-lg-5 col-xl-5">
                  <div className="form-group profit_center finpoint_cost_profit_center_id">
                    <label
                      className="control-label profit_center"
                      htmlFor="finpoint_cost_profit_center_id"
                    >
                      Profit Center
                    </label>
                    <div>
                      <div className="input-group">
                        <CFormSelect
                          className="form-control-cst profit_center_select"
                          data-url="/roster/autocompletes.json?model=Financor::ProfitCenter"
                          data-placeholder=""
                          data-status=""
                          data-plugin="lookup"
                          name="finpoint[cost_profit_center_id]"
                          id="finpoint_cost_profit_center_id"
                          data-select2-id="finpoint_cost_profit_center_id"
                          aria-hidden="true"
                        >
                          <option data-select2-id="10"></option>
                        </CFormSelect>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="form-group finpoint_cost_keywords">
                    <label className="control-label" htmlFor="finpoint_cost_keywords">
                      Keywords
                    </label>
                    <CFormTextarea
                      className="form-control-cst"
                      placeholder="#BSMV, #SWIFT"
                      name="finpoint[cost_keywords]"
                      id="finpoint_cost_keywords"
                    ></CFormTextarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton type="submit" color="success" disabled={creatingFinpoint ? true : false}>
                  {creatingFinpoint ? (
                    'Processing...'
                  ) : (
                    <span>
                      Save <i className="fa fa-check"></i>
                    </span>
                  )}
                </CButton>
              </div>
            </div>
          </CForm>
        </div>
      </CCard>
    </div>
  )
}

NewBankAccount.propTypes = {
  handleCancelSlide: PropTypes.func,
}
export default NewBankAccount
