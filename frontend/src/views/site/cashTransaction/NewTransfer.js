import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import { isEmpty, isNull } from 'lodash'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrencies } from 'src/redux/slices/currencySlice'
import { clearFindocError, createFindoc } from 'src/redux/slices/findocSlice'
import classNames from 'classnames'
import Noty from 'noty'
import PropTypes from 'prop-types'

const NewTransfer = ({ closeTransPanel }) => {
  const dispatch = useDispatch()
  const [loadDateTime, setLoadDateTime] = useState(new Date())
  const [findocData, setFindocData] = useState({
    code: '',
    docType: 'transfer',
    docDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
    findocCurr: '',
    accountType: '',
    currRate: '1.0',
    credit: '0.0',
    transferCurrRate: '1.0',
    accountId: '',
    currType: '',
    relatedAccountType: '',
    relatedAccountId: '',
    branchId: '',
    operationId: '',
    profitCenterId: '',
    notes: '',
    confirm: '0',
    accounted: '0',
    transferCurr: '',
    transferAmount: '0.0',
  })
  const { currencies, fetchingCurrencies } = useSelector((state) => state.currency)
  const { creatingFindoc, findocErrors } = useSelector((state) => state.findoc)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setFindocData({
      ...findocData,
      [name]: value,
    })
  }

  // const handleSelectForm = (c, val) => {
  //   const e = {
  //     target: {
  //       name: c,
  //       value: !isNull(val) ? val.value : '',
  //     },
  //   }
  //   handleChangeForm(e)
  // }

  const handleDateTime = (c, date) => {
    setLoadDateTime(date)
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearFindocError({ type: c, errorType: 'errFindoc' }))

    if (c === 'findocCurr') {
      if (isEmpty(currencies)) {
        dispatch(fetchCurrencies())
      }
    }
  }

  const submitCashTransfer = async (e) => {
    e.preventDefault()
    //form data
    let arrForm = Object.entries(findocData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createFindoc(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Cash Tranfer has been created succesfully',
      }).show()
      clearFindocData()
      closeTransPanel()
    }
  }

  const clearFindocData = () => {
    setFindocData({
      code: '',
      docDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
      findocCurr: '',
      accountType: '',
      currRate: '1.0',
      credit: '0.0',
      transferCurrRate: '1.0',
      accountId: '',
      currType: '',
      relatedAccountType: '',
      relatedAccountId: '',
      branchId: '',
      operationId: '',
      profitCenterId: '',
      notes: '',
      confirm: '0',
      accounted: '0',
      transferCurr: '',
      transferAmount: '0.0',
    })
  }

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <div className="card-body">
          <form
            className="simple_form horizontal-form"
            id="new_findoc"
            onSubmit={(e) => submitCashTransfer(e)}
          >
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="form-group date_picker findoc_doc_date">
                  <label className="control-label date_picker" htmlFor="findoc_doc_date">
                    Document Date
                  </label>
                  <DatePicker
                    id="findoc_doc_date"
                    selected={loadDateTime}
                    onChange={(date) => handleDateTime('docDate', date)}
                    style={{ paddingLeft: '2px', paddingRight: '2px' }}
                    dateFormat="yyyy-MM-dd"
                    className={classNames('form-control form-control-cst ', {
                      'is-invalid': findocErrors && !isEmpty(findocErrors.docDate),
                    })}
                    onFocus={() =>
                      dispatch(clearFindocError({ type: 'docDate', errorType: 'errFindoc' }))
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst" style={{ display: 'block' }}>
                    {findocErrors.docDate}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <div className="form-group">
                  <CFormLabel className="control-label" htmlFor="findoc_code">
                    Reference No
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="findoc_code"
                    name="code"
                    value={findocData.code}
                    onChange={(e) => handleChangeForm(e)}
                    className="form-control-cst "
                    invalid={findocErrors && !isEmpty(findocErrors.code) ? true : false}
                    onFocus={() =>
                      dispatch(clearFindocError({ type: 'code', errorType: 'errFindoc' }))
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {findocErrors.code}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="separator"></div>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                <div className="form-group  findoc_account_type">
                  <label className="control-label " htmlFor="findoc_account_type">
                    Sender Acc. Type
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst  related_account_type"
                        id="findoc_account_type"
                        name="accountType"
                        value={findocData.accountType}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={findocErrors && !isEmpty(findocErrors.accountType) ? true : false}
                        onFocus={() =>
                          dispatch(
                            clearFindocError({ type: 'accountType', errorType: 'errFindoc' }),
                          )
                        }
                      >
                        <option value="Financor::BankAccount">Bank Account</option>
                        <option value="Financor::CashPoint">Cash Account</option>
                        <option value="Financor::CreditCard">Credit Card</option>
                        <option value="Network::Company">Company</option>
                        <option value="Hr::Person">Employee</option>
                        <option value="Fleet::Driver">Driver</option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.accountType}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group account findoc_account_id">
                  <label className="control-label account" htmlFor="findoc_account_id">
                    Sender Account
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst account_select select2-hidden-accessible"
                        name="findoc[account_id]"
                        id="findoc_account_id"
                        onChange={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                <div className="row">
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group decimal findoc_credit">
                      <label className="control-label decimal" htmlFor="findoc_credit">
                        Amount
                      </label>
                      <CFormInput
                        className="form-control-cst numeric decimal credit-amount transfer_credit text-right"
                        type="number"
                        step="any"
                        id="findoc_credit"
                        name="credit"
                        value={findocData.credit}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={findocErrors && !isEmpty(findocErrors.credit) ? true : false}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.credit}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-2 col-xs-12">
                    <div className="form-group  findoc_curr">
                      <label className="control-label " htmlFor="findoc_curr">
                        Currency
                      </label>
                      <CFormSelect
                        className="form-control-cst"
                        name="findocCurr"
                        id="findoc_curr"
                        value={findocData.findocCurr}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('findocCurr', e)}
                        invalid={findocErrors && !isEmpty(findocErrors.findocCurr) ? true : false}
                      >
                        <option value=""></option>
                        {!fetchingCurrencies ? (
                          currencies && currencies.length > 0 ? (
                            <>
                              {currencies.map((itm) => (
                                <option key={itm.id} value={itm.id}>
                                  {itm.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option disabled>No results found.</option>
                          )
                        ) : (
                          <option disabled>Loading...</option>
                        )}
                      </CFormSelect>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group decimal findoc_curr_rate">
                      <label className="control-label decimal" htmlFor="findoc_curr_rate">
                        Currency Rate
                      </label>
                      <CFormInput
                        className="form-control-cst numeric decimal doc-curr-rate transfer-curr-rate text-right"
                        type="number"
                        step="any"
                        id="findoc_curr_rate"
                        name="currRate"
                        value={findocData.currRate}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={findocErrors && !isEmpty(findocErrors.currRate) ? true : false}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.currRate}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="form-group  findoc_curr_type">
                      <label className="control-label " htmlFor="findoc_curr_type">
                        Currency Type
                      </label>
                      <CFormSelect
                        className="form-control-cst  doc-curr-type line-curr-type"
                        id="findoc_curr_type"
                        name="currType"
                        value={findocData.currType}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={findocErrors && !isEmpty(findocErrors.currType) ? true : false}
                      >
                        <option value=""></option>
                        <option value="buying">Buying</option>
                        <option value="selling">Selling</option>
                        <option value="banknote_buying">Banknote Buying</option>
                        <option value="banknote_selling">Banknote Selling</option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.currType}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                <div className="form-group  findoc_related_account_type">
                  <label className="control-label " htmlFor="findoc_related_account_type">
                    Recipient Acc. Type
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst  related_account_type"
                        name="findoc[related_account_type]"
                        id="findoc_related_account_type"
                        onChange={(e) => handleChangeForm(e)}
                      >
                        <option value="Financor::BankAccount">Bank Account</option>
                        <option value="Financor::CashPoint">Cash Account</option>
                        <option value="Financor::CreditCard">Credit Card</option>
                        <option value="Network::Company">Company</option>
                        <option value="Hr::Person">Employee</option>
                        <option value="Fleet::Driver">Driver</option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group account findoc_related_account_id">
                  <label className="control-label account" htmlFor="findoc_related_account_id">
                    Recipient Account
                  </label>
                  <div>
                    <div className="input-group">
                      <CFormSelect
                        className="form-control-cst account_select select2-hidden-accessible"
                        name="findoc[related_account_id]"
                        id="findoc_related_account_id"
                        data-select2-id="findoc_related_account_id"
                        onChange={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                      </CFormSelect>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                <div className="row" id="transfer_div" style={{ display: 'none' }}>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group decimal findoc_transfer_amount">
                      <label className="control-label decimal" htmlFor="findoc_transfer_amount">
                        Transfer Amount
                      </label>
                      <CFormInput
                        className="form-control-cst numeric decimal transfer_amount transfer_debit text-right"
                        type="number"
                        step="any"
                        name="transferAmount"
                        id="findoc_transfer_amount"
                        onChange={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group  findoc_transfer_curr">
                      <label className="control-label " htmlFor="findoc_related_curr">
                        Transfer Curr
                      </label>
                      <CFormSelect
                        className="form-control-cst  line-curr"
                        id="findoc_related_curr"
                        name="transferCurr"
                        value={findocData.transferCurr}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={(e) => handleSelectFocus('transferCurr', e)}
                        invalid={findocErrors && !isEmpty(findocErrors.transferCurr) ? true : false}
                      >
                        {!fetchingCurrencies ? (
                          currencies && currencies.length > 0 ? (
                            <>
                              <option value=""></option>
                              {currencies.map((itm, i) => (
                                <option key={i} value={itm.id} trans_method={itm.slug}>
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
                        {findocErrors.transferCurr}
                      </CFormFeedback>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <div className="form-group decimal findoc_transfer_curr_rate">
                      <label className="control-label decimal" htmlFor="findoc_transfer_curr_rate">
                        Transfer Currency
                      </label>
                      <CFormInput
                        className="form-control-cst numeric decimal line-curr-rate text-right"
                        type="number"
                        step="any"
                        id="findoc_transfer_curr_rate"
                        name="transferCurrRate"
                        value={findocData.transferCurrRate}
                        onChange={(e) => handleChangeForm(e)}
                        invalid={
                          findocErrors && !isEmpty(findocErrors.transferCurrRate) ? true : false
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {findocErrors.transferCurrRate}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href="#"
                  id="details-link"
                  data-href="#details-form"
                  className="toggle_and_hide_button btn btn-outline-primary"
                >
                  Add Profit center or description
                </a>
                <div id="details-form" className="slidingDiv" style={{ display: 'none' }}>
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                      <div className="form-group  findoc_branch_id">
                        <label className="control-label " htmlFor="findoc_branch_id">
                          Branch
                        </label>
                        <CFormSelect
                          className="form-control-cst "
                          name="findoc[branch_id]"
                          id="findoc_branch_id"
                          onChange={(e) => handleChangeForm(e)}
                        >
                          <option value="1380">Head Office</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                      <div className="form-group  findoc_operation_id">
                        <label className="control-label " htmlFor="findoc_operation_id">
                          Operation
                        </label>
                        <CFormSelect
                          className="form-control-cst "
                          name="findoc[operation_id]"
                          id="findoc_operation_id"
                          onChange={(e) => handleChangeForm(e)}
                        >
                          <option value=""></option>
                          <option value="6641">Air Transports Team</option>
                          <option value="6639">Fleet Management Team</option>
                          <option value="6642">Ocean Transports Team</option>
                          <option value="6638">Road Transports Team</option>
                          <option value="6640">Sales Team</option>
                          <option value="6643">Warehouse</option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                      <div className="form-group profit_center findoc_profit_center_id">
                        <label
                          className="control-label profit_center"
                          htmlFor="findoc_profit_center_id"
                        >
                          Profit Center
                        </label>
                        <CFormSelect
                          className="form-control-cst profit_center_select select2-hidden-accessible"
                          data-url="/roster/autocompletes.json?model=Financor::ProfitCenter"
                          id="findoc_related_profit_center_id"
                          name="findoc[profit_center_id]"
                          onChange={(e) => handleChangeForm(e)}
                        >
                          <option value="" data-select2-id="84"></option>
                          <option value="17540" data-select2-id="85">
                            BALANCE ACCOUNT
                          </option>
                        </CFormSelect>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-6 col-xl-6">
                      <div className="form-group text findoc_notes">
                        <label className="control-label text" htmlFor="findoc_notes">
                          Notes
                        </label>
                        <CFormTextarea
                          className="form-control-cst"
                          rows="1"
                          name="findoc[notes]"
                          id="findoc_notes"
                        ></CFormTextarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="separator"></div>
            <br />
            <br />
            <div className="row">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-2 col-sm-6 col-xs-12">
                    <div className="d-flex">
                      <span>
                        <div className="form-group boolean findoc_confirm">
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean pull-left"
                              type="checkbox"
                              // value="true"
                              name="findoc[confirm]"
                              id="findoc_confirm"
                            />
                          </div>
                        </div>
                      </span>
                      <span
                        style={{ verticalAlign: 'middle', paddingTop: '0px', paddingLeft: '3px' }}
                      >
                        <label className="" htmlFor="findoc_Confirm">
                          Confirm
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-6 col-xs-12">
                    <div className="d-flex">
                      <span>
                        <div className="form-group boolean findoc_accounted">
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean pull-left"
                              type="checkbox"
                              // value="true"
                              name="findoc[accounted]"
                              id="findoc_accounted"
                            />
                          </div>
                        </div>
                      </span>
                      <span
                        style={{ verticalAlign: 'middle', paddingTop: '0px', paddingLeft: '3px' }}
                      >
                        <label className="" htmlFor="findoc_Accounted">
                          Accounted
                        </label>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-md-4 checkbox-custom checkbox-primary pull-right"
                style={{ display: 'inline' }}
              >
                <div className="form-group">
                  <input
                    className="boolean"
                    type="checkbox"
                    name="add_new_record"
                    id="add_new_record_button"
                  />
                  <span style={{ verticalAlign: 'middle', paddingTop: '0px', paddingLeft: '3px' }}>
                    After saving open form new record
                  </span>
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton
                  type="submit"
                  color="success"
                  className="btn-default btn btn-success"
                  disabled={creatingFindoc ? true : false}
                >
                  {creatingFindoc ? (
                    'Processing...'
                  ) : (
                    <span>
                      Save <i className="fa fa-check" />
                    </span>
                  )}
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </CCard>
    </div>
  )
}

NewTransfer.propTypes = {
  closeTransPanel: PropTypes.func,
}

export default NewTransfer
