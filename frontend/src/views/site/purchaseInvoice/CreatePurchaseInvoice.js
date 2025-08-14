import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CButton,
  CFormFeedback,
  CCallout,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { AppBreadcrumb } from 'src/components'
import { Link, useHistory } from 'react-router-dom'
import Select from 'react-select'
import { isNull, isEmpty } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import $ from 'jquery'
import {
  checkInvoiceCompany,
  clearInvoiceError,
  showInvoiceError,
} from 'src/redux/slices/invoiceSlice'
import Cookies from 'js-cookie'

const CreatePurchaseInvoice = () => {
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit', active: true },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const history = useHistory()
  const dispatch = useDispatch()
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: 'credit',
    invoiceCompanyId: '',
    invoiceUseAccount: false,
  })
  const { checkingCompanyInvoice, invoiceErrors, errorCalloutText } = useSelector(
    (state) => state.invoice,
  )
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const [calloutInfo, setCalloutInfo] = useState(false)
  const [financialModal, setFinancialModal] = useState(false)
  const [companyLinkId, setCompanyLinkId] = useState('')

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    })
  }

  const handleSelectForm = (c, val) => {
    if (c === 'invoiceCompanyId') {
      setCompanyLinkId(val ? val.value.linkId : '')

      const e = { target: { name: c, value: !isNull(val) ? val.value.id : '' } }
      handleChangeForm(e)
    } else {
      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const handleCheckboxForm = (e) => {
    const { name, checked } = e.target
    setInvoiceData({
      ...invoiceData,
      [name]: checked ? true : false,
    })
  }

  const closeCallout = (e) => {
    e.preventDefault()
    $('.cstCalloutInfo').addClass('animate__animated animate__fadeOut')
    setCalloutInfo(!calloutInfo)
  }

  const continuePurchaseInvoice = async (e) => {
    e.preventDefault()
    const form = $('#newInvoice')
    if (form.length > 0) {
      if (invoiceData.invoiceCompanyId === '') {
        dispatch(showInvoiceError({ type: 'invoiceCompanyId', errorType: 'errInvoice' }))
        return false
      }
    }

    try {
      const resData = await dispatch(checkInvoiceCompany(invoiceData)).unwrap()
      if (resData) {
        Cookies.set(
          'ss',
          JSON.stringify({
            ssId: `${resData.id}`,
            inv: `${invoiceData.invoiceUseAccount}`,
            invoiceType: 'credit',
          }),
        )
        history.push('/invoices/start')
      }
    } catch (error) {
      if (error && error.error400) {
        setCalloutInfo(true)
      }
    }
  }

  const handleModalCompany = (e) => {
    e.preventDefault()
  }

  const noOptionCompany = (e) => {
    // const val = e.inputValue
    return (
      <>
        <div>No results found</div>
        <div>
          {/* eslint-disable-next-line */}
          <a href="#" className="text-right" onClick={(e) => handleModalCompany(e)}>
            Add New Item
          </a>
        </div>
      </>
    )
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearInvoiceError({ type: c, errorType: 'errInvoice' }))
    if (c === 'invoiceCompanyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    }
  }

  const closeFinModal = () => {
    setFinancialModal(false)
  }

  const handelEditFinDetail = (e) => {
    e.preventDefault()
    // console.log(invoiceData.invoiceCompanyId)
    setFinancialModal(true)
  }

  const handleChangeFinancials = (e) => {
    // const { name, value } = e.target
    // setInvoiceData({
    //   ...invoiceData,
    //   [name]: value,
    // })
  }

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <CForm
              acceptCharset="UTF-8"
              noValidate="novalidate"
              id="newInvoice"
              action="/invoice/start"
              method="post"
              onSubmit={(e) => continuePurchaseInvoice(e)}
            >
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4" id="company_id">
                        <div className="form-group company optional invoice_company_id">
                          <label
                            className="control-label company optional"
                            htmlFor="invoice_company_id"
                          >
                            Company
                            {companyLinkId !== '' && (
                              <Link
                                to={`/companies/${companyLinkId}`}
                                target="_blank"
                                className="float-right profile-link"
                              >
                                Profile
                              </Link>
                            )}
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="loading_load_place_id"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingCompanies ? true : false}
                                isSearchable
                                name="invoiceCompanyId"
                                autoFocus={false}
                                options={
                                  companies && !fetchingCompanies && companies.length > 0
                                    ? companies.map((itm) => ({
                                        label: `${itm.name} ${
                                          itm.eoriCode ? '- ' + itm.eoriCode : ''
                                        }`,
                                        value: itm,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      invoiceErrors && !isEmpty(invoiceErrors.invoiceCompanyId),
                                  },
                                )}
                                noOptionsMessage={(e) => noOptionCompany(e)}
                                onChange={(e) => handleSelectForm('invoiceCompanyId', e)}
                                onMenuOpen={(e) => handleSelectFocus('invoiceCompanyId', e)}
                              />
                              <CFormFeedback
                                invalid={
                                  invoiceErrors && !isEmpty(invoiceErrors.invoiceCompanyId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {invoiceErrors.invoiceCompanyId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group boolean optional invoice_use_account">
                          <label className="boolean optional" htmlFor="invoice_use_account">
                            Use Ledger Accounts
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="invoiceUseAccount"
                              id="invoice_use_account"
                              checked={invoiceData.invoiceUseAccount ? true : false}
                              onChange={(e) => handleCheckboxForm(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {calloutInfo && (
                      <>
                        <CCard className="cardCustom">
                          <div className="card-header">
                            <div className="toolBarContainer">
                              <div className="customHeaderContainer">
                                <div className="customHeaderContainer-body">
                                  <div className="symbolWrapper">
                                    <span className="symbol-label">
                                      <i className="fa fa-store icon-20"></i>
                                    </span>
                                  </div>
                                </div>
                                <div className="customHeaderContainer-footer">
                                  <div className="card-title">
                                    <h3 className="card-label">Company Finance Details</h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <CCallout
                              color="danger"
                              className={classNames(
                                'bg-white  cstCalloutInfo animate__animated animate__fadeIn ',
                                {
                                  'animate__animated animate__fadeOut hide': !calloutInfo,
                                },
                              )}
                            >
                              <div>
                                <span className="mr-2 text-danger">{errorCalloutText}</span>
                              </div>
                              <div>
                                <button
                                  className="btn btn-close"
                                  aria-label="Close"
                                  style={{ verticalAlign: 'initial' }}
                                  onClick={(e) => closeCallout(e)}
                                ></button>
                              </div>
                            </CCallout>
                            {/* eslint-disable-next-line */}
                            <a
                              className="btn btn-primary"
                              data-remote="true"
                              href="#"
                              onClick={(e) => handelEditFinDetail(e)}
                            >
                              Edit Company Finance Details
                            </a>
                          </div>
                        </CCard>
                      </>
                    )}
                    <div className="separator"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div>
                          <CButton
                            type="submit"
                            color="success"
                            className="btn-default btn btn-success"
                            disabled={checkingCompanyInvoice ? true : false}
                          >
                            {checkingCompanyInvoice ? (
                              'Processing...'
                            ) : (
                              <span>
                                Continue{' '}
                                <i
                                  className="fa fa-arrow-right"
                                  style={{ verticalAlign: 'middle', marginLeft: '0.2rem' }}
                                />
                              </span>
                            )}
                          </CButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CForm>
          </CCard>
        </div>
      </div>

      {/* financial modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        size="xl"
        transition={false}
        visible={financialModal}
        onClose={() => closeFinModal()}
      >
        <CModalHeader>
          <CModalTitle>Financials</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-4">
              <div className="form-group string optional company_title">
                <label className="control-label string optional" htmlFor="company_title">
                  Invoice Title
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  value="Bellas Scholl aLIAS"
                  name="company[title]"
                  id="company_title"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group string optional company_taxno">
                <label className="control-label string optional" htmlFor="company_taxno">
                  Tax No
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  value=""
                  name="company[taxno]"
                  id="company_taxno"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group string optional company_taxoffice">
                <label className="control-label string optional" htmlFor="company_taxoffice">
                  Deferment Acc. No
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  value=""
                  name="company[taxoffice]"
                  id="company_taxoffice"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group string optional company_company_no">
                <label className="control-label string optional" htmlFor="company_company_no">
                  Company No
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  name="company[company_no]"
                  id="company_company_no"
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-4">
              <div className="form-group string optional company_address has-error is-invalid">
                <label className="control-label string optional" htmlFor="company_address">
                  Address
                </label>
                <input
                  className="form-control is-invalid string optional"
                  aria-invalid="true"
                  type="text"
                  value=""
                  name="company[address]"
                  id="company_address"
                  onChange={(e) => handleChangeFinancials(e)}
                />
                <span className="help-block text-danger invalid-feedback">can not be blank</span>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group string optional company_postcode">
                <label className="control-label string optional" htmlFor="company_postcode">
                  Postcode
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  value=""
                  name="company[postcode]"
                  id="company_postcode"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group string optional company_district">
                <label className="control-label string optional" htmlFor="company_district">
                  County
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  value="D"
                  name="company[district]"
                  id="company_district"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group string optional company_city_name">
                <label className="control-label string optional" htmlFor="company_city_name">
                  City
                </label>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-2">
              <div className="form-group select optional company_country_id">
                <label className="control-label select optional" htmlFor="company_country_id">
                  Country
                </label>
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="select2"
                  name="company[country_id]"
                  id="company_country_id"
                  tabIndex="-1"
                  aria-hidden="true"
                  data-select2-id="company_country_id"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value=""></option>
                  <option value="+3">+3-CIBUTI</option>
                  <option value="AA">AA-N/A</option>
                  <option value="AD">AD-ANDORRA</option>
                  <option value="AE">AE-UNITED ARAB EMIRATES</option>
                  <option value="ZM">ZM-ZAMBIA</option>
                  <option value="ZW">ZW-ZIMBABWE</option>
                  <option value="ZZ">ZZ-NAHÇIVAN</option>
                </select>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group email optional company_financial_email">
                <label className="control-label email optional" htmlFor="company_financial_email">
                  Financial Emails
                </label>
                <input
                  className="form-control string email optional"
                  type="email"
                  name="company[financial_email]"
                  id="company_financial_email"
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group select optional company_financor_id">
                <label className="control-label select optional" htmlFor="company_financor_id">
                  Financial Follower
                </label>
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="select2"
                  name="company[financor_id]"
                  id="company_financor_id"
                  tabIndex="-1"
                  aria-hidden="true"
                  data-select2-id="company_financor_id"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value="" data-select2-id="537"></option>
                  <option value="3835">Kennedy Peter</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group string optional company_payment_notes">
                <label className="control-label string optional" htmlFor="company_payment_notes">
                  Payment Notes
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  name="company[payment_notes]"
                  id="company_payment_notes"
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group email optional company_information_email">
                <label className="control-label email optional" htmlFor="company_information_email">
                  Company Information Mail
                </label>
                <input
                  className="form-control string email optional"
                  type="email"
                  name="company[information_email]"
                  id="company_information_email"
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-6">
              <div className="form-group text optional company_invoice_notes">
                <label className="control-label text optional" htmlFor="company_invoice_notes">
                  Invoice Note
                </label>
                <textarea
                  className="form-control text optional"
                  name="company[invoice_notes]"
                  id="company_invoice_notes"
                ></textarea>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group integer optional company_due_days">
                <label className="control-label integer optional" htmlFor="company_due_days">
                  Payment Terms
                </label>
                <input
                  className="form-control numeric integer optional"
                  type="number"
                  step="1"
                  value="0"
                  name="company[due_days]"
                  id="company_due_days"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
              <div className="form-group select optional company_curr">
                <label className="control-label select optional" htmlFor="company_curr">
                  Currency
                </label>
                <select
                  className="form-control select optional"
                  name="company[curr]"
                  id="company_curr"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value=""></option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="CHF">CHF</option>
                  <option value="CAD">CAD</option>
                  <option value="CZK">CZK</option>
                  <option value="SEK">SEK</option>
                  <option value="PLN">PLN</option>
                  <option value="NOK">NOK</option>
                  <option value="AUD">AUD</option>
                  <option value="DKK">DKK</option>
                  <option value="KWD">KWD</option>
                  <option value="SAR">SAR</option>
                  <option value="RON">RON</option>
                  <option value="BGN">BGN</option>
                  <option value="RUB">RUB</option>
                  <option value="PKR">PKR</option>
                  <option value="CNY">CNY</option>
                  <option value="IRR">IRR</option>
                  <option value="JPY">JPY</option>
                  <option value="SGD">SGD</option>
                  <option value="AZN">AZN</option>
                  <option value="AED">AED</option>
                  <option value="HKD">HKD</option>
                  <option value="HUF">HUF</option>
                  <option value="MKD">MKD</option>
                  <option value="MYR">MYR</option>
                  <option value="KRW">KRW</option>
                  <option value="INR">INR</option>
                  <option value="XAU">XAU</option>
                  <option value="XAG">XAG</option>
                  <option value="XPT">XPT</option>
                  <option value="ZAR">ZAR</option>
                  <option value="VND">VND</option>
                  <option value="GEL">GEL</option>
                  <option value="GBP">GBP</option>
                  <option value="TRY">TRY</option>
                </select>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group select optional company_credit_limit_control">
                <label
                  className="control-label select optional"
                  htmlFor="company_credit_limit_control"
                >
                  Company Limit Control
                </label>
                <select
                  className="form-control select optional credit_limit_control"
                  name="company[credit_limit_control]"
                  id="company_credit_limit_control"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value="ignore"></option>
                  <option value="warn">Alert if limit is exceeded</option>
                  <option value="block">Block if limit is exceeded</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 company-limit-fields">
              <div className="form-group decimal optional company_credit_limit">
                <label className="control-label decimal optional" htmlFor="company_credit_limit">
                  Company Limit
                </label>
                <input
                  className="form-control numeric decimal optional"
                  type="number"
                  step="any"
                  value="0.0"
                  name="company[credit_limit]"
                  id="company_credit_limit"
                  onChange={(e) => handleChangeFinancials(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 company-limit-fields">
              <div className="form-group select optional company_credit_limit_curr">
                <label
                  className="control-label select optional"
                  htmlFor="company_credit_limit_curr"
                >
                  Company Limit Currency
                </label>
                <select
                  className="form-control select optional"
                  name="company[credit_limit_curr]"
                  id="company_credit_limit_curr"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value=""></option>
                  <option value=""></option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group select optional company_financial_status">
                <label className="control-label select optional" htmlFor="company_financial_status">
                  Financial Status
                </label>
                <select
                  className="form-control select optional"
                  name="company[financial_status]"
                  id="company_financial_status"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value=""></option>
                  <option value="active">Active</option>
                  <option value="financial_problem">Has financial problems</option>
                  <option value="banned">Banned</option>
                  <option value="closed">Company Closed</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
              <div className="form-group select optional company_remind_payment">
                <label className="control-label select optional" htmlFor="company_remind_payment">
                  Debt Notification Mail
                </label>
                <select
                  className="form-control select optional"
                  name="company[remind_payment]"
                  id="company_remind_payment"
                  onChange={(e) => handleChangeFinancials(e)}
                >
                  <option value="none">None</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-6">
              <div className="form-group text optional company_financial_notes">
                <label className="control-label text optional" htmlFor="company_financial_notes">
                  Financial Note
                </label>
                <textarea
                  className="form-control text optional"
                  rows="1"
                  name="company[financial_notes]"
                  id="company_financial_notes"
                ></textarea>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => closeFinModal()}>
            Cancel
          </CButton>
          <CButton color="primary" type="submit">
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CreatePurchaseInvoice
