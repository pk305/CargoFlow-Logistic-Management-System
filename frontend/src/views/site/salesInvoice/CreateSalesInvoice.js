import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CButton,
  CFormFeedback,
  CCallout,
  CModal,
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
import CompanyFinancials from './modalInfo/CompanyFinancials'
import { findFinancial } from 'src/redux/slices/financialSlice'

const CreateSalesInvoice = () => {
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit', active: true },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const history = useHistory()
  const dispatch = useDispatch()
  const [invoiceData, setInvoiceData] = useState({
    invoiceType: 'debit',
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
  const [itemInfo, setItemInfo] = useState(null)

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

  const continueSalesInvoice = async (e) => {
    e.preventDefault()
    const form = $('#new_invoice')
    if (form.length > 0) {
      if (invoiceData.invoiceCompanyId === '') {
        dispatch(showInvoiceError({ type: 'invoiceCompanyId', errorType: 'errInvoice' }))
        $('html,body').animate({ scrollTop: 0 }, 300)
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
            invoiceType: 'debit',
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
    setCalloutInfo(false)
  }

  const handelEditFinDetail = async (e) => {
    e.preventDefault()
    const resData = await dispatch(findFinancial(invoiceData.invoiceCompanyId)).unwrap()
    if (resData) {
      setItemInfo(resData)
    }
    setFinancialModal(true)
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
            <CForm id="new_invoice" onSubmit={(e) => continueSalesInvoice(e)}>
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
                          <div className="input-group">
                            <Select
                              id="loading_load_place_id"
                              classNamePrefix="cstSelect"
                              isClearable
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
        <CompanyFinancials itemInfo={itemInfo} closeFinModal={closeFinModal} />
      </CModal>
    </div>
  )
}

export default CreateSalesInvoice
