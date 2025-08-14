import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearLedgerAccError,
  createLedger,
  showLedgerAccountError,
} from 'src/redux/slices/ledgerAccountSlice'
import { isEmpty } from 'lodash'
import $ from 'jquery'
import PropTypes from 'prop-types'
import Noty from 'noty'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'

const NewLedgerAccount = ({ closeLedgerAccMd }) => {
  const dispatch = useDispatch()
  const [ledgerData, setLedgerData] = useState({
    code: '',
    ledgerName: '',
    ledgerable: '1',
    englishName: '',
    partnerAccountCode: '',
    isPartner: '1',
    curr: '',
    accountType: 'public',
    status: 'active',
    mappingType: 'auto',
    notes: '',
  })
  const { creatingLedger, ledgerAcountErrors } = useSelector((state) => state.ledger)
  const { fetchingCurrencies, currencies } = useSelector((state) => state.currency)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setLedgerData({
      ...ledgerData,
      [name]: value,
    })
  }

  const clearLedgerData = () => {
    setLedgerData({
      code: '',
      ledgerName: '',
      ledgerable: '1',
      englishName: '',
      partnerAccountCode: '',
      isPartner: '1',
      curr: '',
      accountType: 'public',
      status: 'active',
      mappingType: 'auto',
      notes: '',
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearLedgerAccError({ type: c, errorType: 'errLedger' }))

    if (c === 'curr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    }
  }

  const handleSubmitLedger = async (e) => {
    e.preventDefault()
    const form = $('#new_contact')
    if (form.length > 0) {
      if (ledgerData.ledgerName === '') {
        dispatch(showLedgerAccountError({ type: 'ledgerName', errorType: 'errLedger' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(ledgerData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(createLedger(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `createItem${resData.id}`,
        text: 'Ledger Account has been created succesfully',
      }).show()
      clearLedgerData()
      closeLedgerAccMd()
    }
  }

  return (
    <CCard className="card cardCustom">
      <CCardBody>
        <div className="pageContainer-wrapper">
          <CForm
            className="simple_form horizontal-form mt-2"
            id="new_ledger_account"
            onSubmit={(e) => handleSubmitLedger(e)}
          >
            <div
              className="alert dark alert-danger alert-dismissible"
              role="alert"
              style={{ display: 'inline', padding: '0.25rem' }}
            >
              Please enter only the main accounts here. Child accounts next to the account Add Sub
              Account Click on the button to enter! ..
            </div>
            <div className="row mt-3">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group ledger_account_code">
                  <label className="control-label" htmlFor="ledger_account_code">
                    Account Code
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="code"
                    id="ledger_account_code"
                    value={ledgerData.code}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={ledgerAcountErrors && !isEmpty(ledgerAcountErrors.code) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'code',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  />
                  <CFormFeedback
                    invalid={ledgerAcountErrors && !isEmpty(ledgerAcountErrors.code) ? true : false}
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.code}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group string required ledger_account_name">
                  <label className="control-label string required" htmlFor="ledger_account_name">
                    Account <span title="required">*</span>
                  </label>
                  <CFormInput
                    className="form-control-cst string required"
                    type="text"
                    name="ledgerName"
                    id="ledger_account_name"
                    value={ledgerData.ledgerName}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.ledgerName) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'ledgerName',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  />
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.ledgerName) ? true : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.ledgerName}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group ledger_account_partner_account_code">
                  <label className="control-label" htmlFor="ledger_account_partner_account_code">
                    Abroad Account Code
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="partnerAccountCode"
                    id="ledger_account_partner_account_code"
                    value={ledgerData.partnerAccountCode}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.partnerAccountCode)
                        ? true
                        : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'partnerAccountCode',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  />
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.partnerAccountCode)
                        ? true
                        : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.partnerAccountCode}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group ledger_account_english_name">
                  <label className="control-label" htmlFor="ledger_account_english_name">
                    Abroad Account Name
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="englishName"
                    id="ledger_account_english_name"
                    value={ledgerData.englishName}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.englishName) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'englishName',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  />
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.englishName) ? true : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.englishName}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group  ledger_account_ledgerable">
                  <label className="" htmlFor="ledger_account_ledgerable">
                    Ledgerable ?
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <input
                      type="checkbox"
                      name="ledgerable"
                      id="ledger_account_ledgerable"
                      value={ledgerData.ledgerable}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={() =>
                        dispatch(
                          clearLedgerAccError({
                            type: 'ledgerable',
                            errorType: 'errLedger',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        ledgerAcountErrors && !isEmpty(ledgerAcountErrors.ledgerable) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {ledgerAcountErrors.ledgerable}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group  ledger_account_is_partner">
                  <label className="" htmlFor="ledger_account_is_partner">
                    Partner Account
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <input
                      type="checkbox"
                      name="isPartner"
                      id="ledger_account_is_partner"
                      value={ledgerData.isPartner}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={() =>
                        dispatch(
                          clearLedgerAccError({
                            type: 'isPartner',
                            errorType: 'errLedger',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        ledgerAcountErrors && !isEmpty(ledgerAcountErrors.isPartner) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {ledgerAcountErrors.isPartner}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group ledger_account_curr">
                  <label className="control-label" htmlFor="ledger_account_curr">
                    Currency
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="curr"
                    id="ledger_account_curr"
                    value={ledgerData.curr}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={ledgerAcountErrors && !isEmpty(ledgerAcountErrors.curr) ? true : false}
                    onFocus={(e) => handleSelectFocus('curr', e)}
                  >
                    <option value=""></option>
                    {!fetchingCurrencies ? (
                      currencies && currencies.length > 0 ? (
                        <>
                          {currencies.map((itm, i) => (
                            <option key={i} value={itm.id}>
                              {itm.name}
                            </option>
                          ))}
                        </>
                      ) : (
                        <>
                          <option disabled>No results found.</option>
                        </>
                      )
                    ) : (
                      <>
                        <option disabled>Loading...</option>
                      </>
                    )}
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {ledgerAcountErrors.curr}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group ledger_account_account_type">
                  <label className="control-label" htmlFor="ledger_account_account_type">
                    Account Type
                  </label>
                  <CFormSelect
                    className="form-control-cst public-private-selection"
                    name="accountType"
                    id="ledger_account_account_type"
                    value={ledgerData.accountType}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.accountType) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'code',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </CFormSelect>
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.accountType) ? true : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.accountType}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group ledger_account_status">
                  <label className="control-label" htmlFor="ledger_account_status">
                    Status
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="status"
                    id="ledger_account_status"
                    value={ledgerData.status}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.status) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'status',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  >
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </CFormSelect>
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.status) ? true : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.status}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group ledger_account_mapping_type">
                  <label className="control-label" htmlFor="ledger_account_mapping_type">
                    Mapping type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="mappingType"
                    id="ledger_account_mapping_type"
                    value={ledgerData.mappingType}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.mappingType) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'mappingType',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  >
                    <option value="auto">auto</option>
                    <option value="manual">manual</option>
                  </CFormSelect>
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.mappingType) ? true : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.mappingType}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"></div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group ledger_account_notes">
                  <label className="control-label" htmlFor="ledger_account_notes">
                    Notes
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="notes"
                    id="ledger_account_notes"
                    value={ledgerData.notes}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.notes) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'notes',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  />
                  <CFormFeedback
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.notes) ? true : false
                    }
                    className="fieldError-cst"
                  >
                    {ledgerAcountErrors.notes}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 private-user-ids"
                style={{ display: 'none' }}
              >
                <div className="form-group ledger_account_user_ids">
                  <label className="control-label" htmlFor="users">
                    Related Users
                  </label>
                  <CFormSelect
                    className="form-control-cst user_ids"
                    multiple=""
                    id="users"
                    name="userIds"
                    value={ledgerData.userIds}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={
                      ledgerAcountErrors && !isEmpty(ledgerAcountErrors.userIds) ? true : false
                    }
                    onFocus={() =>
                      dispatch(
                        clearLedgerAccError({
                          type: 'userIds',
                          errorType: 'errLedger',
                        }),
                      )
                    }
                  >
                    <option value="3835">Kennedy Peter</option>
                  </CFormSelect>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton
                  color="success"
                  type="submit"
                  className="mr-2"
                  disabled={creatingLedger ? true : false}
                >
                  {creatingLedger ? (
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
      </CCardBody>
    </CCard>
  )
}

NewLedgerAccount.propTypes = {
  closeLedgerAccMd: PropTypes.func,
}

export default NewLedgerAccount
