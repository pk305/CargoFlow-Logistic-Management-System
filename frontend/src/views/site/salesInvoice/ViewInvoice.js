import React, { useEffect, useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CButtonGroup,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { confirmInvoiceStatus, findInvoice } from 'src/redux/slices/invoiceSlice'
import moment from 'moment'
import { capitalize, toUpper } from 'lodash'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { findTemplate } from 'src/redux/slices/templateSlice'
import { TempModalInfo } from 'src/views/templates'
import { AppBreadcrumb } from 'src/components'
import { formatMoney } from 'src/config/helpers'
import countryList from 'react-select-country-list'

const ViewInvoice = () => {
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const { showInvoice, findingInvoice } = useSelector((state) => state.invoice)
  const { invId } = useParams()
  const { findingTemplate } = useSelector((state) => state.template)
  const [printModal, viewPrintModal] = useState(false)
  const [tempInvoiceId, setTempInvoiceId] = useState(null)
  const [invConfirm, setInvConfirm] = useState(false)

  const handleEditUser = (e) => {
    e.preventDefault()
  }

  const handleConfirmInvoice = async (e) => {
    e.preventDefault()
    if (showInvoice) {
      let invIds = [showInvoice.id]
      const resData = await dispatch(
        confirmInvoiceStatus({ invIds: JSON.stringify(invIds), status: 'confirmed' }),
      ).unwrap()
      if (resData) {
        setInvConfirm(false)
      }
    }
  }

  const handleModalPrint = useCallback(
    (e) => {
      e.preventDefault()
      dispatch(findTemplate({ Id: showInvoice.id, type: 'invoice' }))
      setTempInvoiceId(showInvoice.invoiceRefId)
      viewPrintModal(!printModal)
    },
    [printModal, dispatch, showInvoice],
  )

  const closeModalPrint = () => {
    viewPrintModal(false)
    setTempInvoiceId(null)
  }

  useEffect(() => {
    if (invId) {
      async function findInvoiceData() {
        const resData = await dispatch(findInvoice(invId)).unwrap()
        if (resData) {
          document.title = toUpper(resData.invoiceName)
          console.log(resData)
          if (resData.status !== 'confirmed') {
            setInvConfirm(true)
          } else {
            setInvConfirm(false)
          }
        }
      }

      findInvoiceData()
    }
  }, [invId, dispatch])

  if (findingInvoice) return null

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>

      <div className="rawWrapper-container">
        <div className="pageContainer">
          <div className="container-fluid h-100">
            <div className="d-block"></div>
            <CCard className="cardCustom gutter-b">
              <div className="card-header">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <div className="symbol-label">
                        <i className="fas fa-file-invoice-dollar fa-3x"></i>
                      </div>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="customMiniBar-wrapper">
                      <div className="customMiniBar-header">
                        <div className="minibar-left">
                          <span className="minbarTitle">
                            {toUpper(showInvoice.invoiceName)} -{' '}
                            {moment(showInvoice.createdAt).format('DD/MM/YYYY')}
                          </span>
                          <div className="minbarSubtitle">
                            <h4>
                              {showInvoice &&
                                showInvoice.invoicedCompany &&
                                showInvoice.invoicedCompany.name}
                            </h4>
                            <span className="sub">
                              <a
                                href={`/companies/${
                                  showInvoice.invoicedCompany && showInvoice.invoicedCompany.linkId
                                }`}
                              >
                                <i className="fas fa-search fa-1x"></i>
                              </a>
                            </span>
                          </div>
                        </div>
                        <div className="minibar-right">
                          <CButtonGroup role="group">
                            <CButton
                              color="secondary"
                              variant="outline"
                              onClick={(e) => handleEditUser(e)}
                            >
                              <i className="fa fa-pen"></i> Edit
                            </CButton>
                            <CButton
                              color="secondary"
                              variant="outline"
                              onClick={(e) => handleModalPrint(e)}
                            >
                              <i className="fa fa-print"></i> Print
                            </CButton>
                            <CButton color="secondary" variant="outline">
                              <i className="fa fa-ellipsis-h"></i>
                            </CButton>
                          </CButtonGroup>
                        </div>
                      </div>
                      <div className="customMiniBar-body">
                        <div className="minItem">
                          <i className="fa fa-user icon-rt" />
                          <span className="minItem-text">
                            {showInvoice && showInvoice.createdBy && showInvoice.createdBy.name}
                          </span>
                        </div>
                        <div className="minItem">
                          <i className="fa fa-map-marker-alt icon-rt" />
                          <span className="minItem-text">Head Office</span>
                        </div>
                        <div className="minItem">
                          <i className="fa fa-flag icon-rt" />
                          <span className="minItem-text">
                            {showInvoice && capitalize(showInvoice.status)}
                          </span>
                        </div>
                        <div className="minItem">
                          <i className="fa fa-calendar-alt icon-rt" />
                          <span className="minItem-text">
                            {moment(showInvoice.createdAt).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CCard>
            {/*  */}
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                <CCard className="cardCustom gutter-b">
                  <div className="card-header">
                    <div className="toolBarContainer">
                      <div className="customHeaderContainer">
                        <div className="customHeaderContainer-footer">
                          <div className="card-title">
                            <h3 className="cstCardbodyHeaderTitle">Invoice Items</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CCardBody className="p-0">
                    <div className="pageContainer-wrapper">
                      <CRow className="pageBoxSizing-container">
                        <CCol md={12} sm={12} lg={12} xl={12}>
                          <CCard className="cardCustom b-shadow ">
                            <CCardBody className="p-0">
                              <div id="involines_list">
                                <div className="multiple-checkbox-selection table-responsive table-truncate mt-8">
                                  <table
                                    id="involines_list_table"
                                    className="table table-vertical-top"
                                  >
                                    <thead>
                                      <tr className="text-dark text-uppercase">
                                        <th>Invoice Item Title</th>
                                        <th>Profit Center</th>
                                        <th className="text-right">Unit price</th>
                                        <th className="text-right">Total</th>
                                        <th className="text-right">Tax</th>
                                        <th className="text-right">Invoice Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody id="involines_list_tbody">
                                      {showInvoice.invoicedCharges &&
                                      showInvoice.invoicedCharges.length > 0
                                        ? showInvoice.invoicedCharges.map((item) => (
                                            <tr
                                              key={item.id}
                                              className="bg-hover-light-warning row-hover"
                                              id={`involine_${item.id}`}
                                            >
                                              <td className="max-w-200px">
                                                {item.finitem && item.finitem.code}
                                                <span className="text-muted ml-2">
                                                  {item.finitem && item.finitem.name} ()
                                                </span>
                                                <br />
                                              </td>
                                              <td className="max-w-100px">
                                                {item.profitCenter && item.profitCenter.name}
                                              </td>
                                              <td className="text-right">
                                                {formatMoney(item.unitPrice && item.unitPrice)}{' '}
                                                {item.currency && item.currency.code}
                                                <br />
                                                {formatMoney(
                                                  item.unitNumber && item.unitNumber,
                                                  1,
                                                )}{' '}
                                                Number
                                              </td>
                                              <td className="text-right">
                                                {formatMoney(item && item.amountWithoutVat)}{' '}
                                                {item.currency && item.currency.code}
                                                <br />
                                              </td>
                                              <td className="text-right">
                                                {formatMoney(item && item.vatAmount)}{' '}
                                                {item.currency && item.currency.code}
                                                <br />% {formatMoney(item.vat && item.vat.rate, 1)}
                                              </td>
                                              <td className="text-right">
                                                <div className="d-flex flex-column">
                                                  {formatMoney(item && item.amountWithoutVat)}{' '}
                                                  {item.currency && item.currency.code}
                                                  <br />
                                                  {formatMoney(item && item.vatAmount)}{' '}
                                                  {item.currency && item.currency.code}
                                                </div>
                                              </td>
                                            </tr>
                                          ))
                                        : null}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
                                  id={`invoice_${showInvoice.id}`}
                                >
                                  <div className="table-responsive">
                                    <table className="table debit-findoc">
                                      <tbody>
                                        <tr>
                                          <td className="font-weight-bolder">Due date</td>
                                          <td>
                                            {showInvoice &&
                                              moment(showInvoice.dueDate).format('DD/MM/YYYY')}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Received At</td>
                                          <td>
                                            &nbsp;&nbsp;
                                            <a href="/invoice_corrections/new?form_scope=received&amp;invoice_id=1433813">
                                              Change
                                            </a>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Currency</td>
                                          <td>
                                            {showInvoice.invoiceCurr &&
                                              showInvoice.invoiceCurr.code}{' '}
                                            ({formatMoney(showInvoice.invoiceCurrRate, 1)})
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Notes</td>
                                          <td>
                                            <a href="/invoice_corrections/new?form_scope=notes&amp;invoice_id=1433813">
                                              Change
                                            </a>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td colSpan="2" className="font-weight-bolder">
                                            <ul></ul>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2"></div>
                                <div
                                  id="invoice_1433813_totals"
                                  className="col-12 col-sm-3 col-md-3 col-lg-4 col-xl-4"
                                >
                                  <div className="table-responsive">
                                    <table className="table debit-findoc" id="involines_list_table">
                                      <tbody>
                                        <tr>
                                          <td className="font-weight-bolder">Sub Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showInvoice.subTotal)}{' '}
                                            {showInvoice &&
                                              showInvoice.invoiceCurr &&
                                              showInvoice.invoiceCurr.code}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">VAT Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showInvoice.vatTotal)}{' '}
                                            {showInvoice &&
                                              showInvoice.invoiceCurr &&
                                              showInvoice.invoiceCurr.code}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Net Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showInvoice.netTotal)}{' '}
                                            {showInvoice &&
                                              showInvoice.invoiceCurr &&
                                              showInvoice.invoiceCurr.code}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="table-responsive">
                                    <table className="table debit-findoc" id="involines_list_table">
                                      <tbody>
                                        <tr>
                                          <td className="font-weight-bolder" colSpan="2">
                                            {' '}
                                            Values
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Sub Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showInvoice.rateSubtotalAmount)}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">VAT Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showInvoice.rateVatAmount)}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Net Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showInvoice.rateNetAmount)}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="row hide">
                                <div
                                  className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                                  id={`invoice_${showInvoice.id}_curr_rates"`}
                                >
                                  <div className="table-responsive">
                                    <table className="table debit-findoc">
                                      <tbody>
                                        <tr>
                                          <td colSpan="3" className="font-weight-bolder">
                                            Currency Invoice
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="/invoice_corrections/new?auth_proc_code=760&amp;curr=USD&amp;curr_rate=2.0&amp;form_scope=rate&amp;invoice_id=1638285">
                                              Change
                                            </a>{' '}
                                          </td>
                                          <td>USD </td>
                                          <td>2.0 </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="/invoice_corrections/new?auth_proc_code=760&amp;curr=CZK&amp;curr_rate=1.0&amp;form_scope=rate&amp;invoice_id=1638285">
                                              Change
                                            </a>{' '}
                                          </td>
                                          <td>CZK </td>
                                          <td>1.0 </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            <a href="/invoice_corrections/new?auth_proc_code=760&amp;curr=EUR&amp;curr_rate=1.0&amp;form_scope=rate&amp;invoice_id=1638285">
                                              Change
                                            </a>{' '}
                                          </td>
                                          <td>EUR </td>
                                          <td>1.0 </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              {invConfirm ? (
                                <div id="inv_confirm">
                                  <CButton
                                    color="primary"
                                    className="pull-right"
                                    onClick={(e) => handleConfirmInvoice(e)}
                                  >
                                    Confirm
                                  </CButton>
                                </div>
                              ) : null}
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            </div>
            <div className="row" id="invoice_details">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                <CCard className="cardCustom gutter-b">
                  <div className="card-header">
                    <div className="card-title">
                      <h6 className="card-label">Invoice Details</h6>
                    </div>
                  </div>
                  <div className="card-body">
                    {/* <pre> {JSON.stringify(showInvoice, 2, null)}</pre> */}
                    <div id="invoice_details1610270_list">
                      <div className="table-responsive">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="font-weight-bolder">Invoice Type</td>
                              <td>Other Invoices</td>
                              <td className="font-weight-bolder">Invoice Type</td>
                              <td>
                                <span className="badge badge-default">SALES INVOICE</span>
                              </td>
                              <td className="font-weight-bolder">Due date</td>
                              <td>
                                <span className=" badge-info">
                                  {showInvoice && moment(showInvoice.dueDate).format('LL')}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bolder">Profit Center</td>
                              <td>
                                {showInvoice &&
                                  showInvoice.dueDate &&
                                  showInvoice.profitCenter.name}
                              </td>
                              <td className="font-weight-bolder">Operation</td>
                              <td>
                                {showInvoice && showInvoice.operation && showInvoice.operation.name}
                              </td>
                              <td className="font-weight-bolder">Invoiced</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td className="font-weight-bolder">Company</td>
                              <td colSpan="5">
                                {showInvoice &&
                                  showInvoice.invoicedCompany &&
                                  showInvoice.invoicedCompany.name}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bolder">Tax No</td>
                              <td>
                                {showInvoice &&
                                  showInvoice.invoicedCompany &&
                                  showInvoice.invoicedCompany.taxno}
                              </td>
                              <td className="font-weight-bolder">City</td>
                              <td>
                                {/* {{showInvoice &&
                                  showInvoice.invoicedCompany &&
                                  showInvoice.invoicedCompany.taxno} */}
                              </td>
                              <td className="font-weight-bolder">Country</td>
                              <td>
                                {showInvoice &&
                                  showInvoice.invoicedCompany &&
                                  countryList().getLabel(showInvoice.invoicedCompany.countryId)}
                              </td>
                            </tr>
                            <tr>
                              <td className="font-weight-bolder">Tax Office</td>
                              <td>
                                {showInvoice &&
                                  showInvoice.invoicedCompany &&
                                  showInvoice.invoicedCompany.taxOffice}
                              </td>
                              <td className="font-weight-bolder">Invoice Address</td>
                              <td colSpan="3">{showInvoice && showInvoice.invoiceAddress}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CCard>
              </div>
            </div>
            {/*  */}
          </div>
        </div>

        {/* print modal */}
        <CModal
          className="animate__animated animate__fadeIn"
          backdrop={'static'}
          keyboard={false}
          portal={false}
          transition={false}
          scrollable
          size="lg"
          visible={printModal}
          onClose={() => closeModalPrint()}
        >
          <CModalHeader>
            <CModalTitle className="ml-2">Print</CModalTitle>
          </CModalHeader>
          <CModalBody className="p-2 bg-white">
            <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
              {findingTemplate ? (
                <div>
                  <div className="loader-center">
                    <div className="mt-3">
                      <img src={loaderLg} alt="" />
                    </div>
                  </div>
                </div>
              ) : (
                <TempModalInfo findingTemplate={findingTemplate} tempInvoiceId={tempInvoiceId} />
              )}
            </CCard>
          </CModalBody>
        </CModal>
      </div>
    </div>
  )
}

export default ViewInvoice
