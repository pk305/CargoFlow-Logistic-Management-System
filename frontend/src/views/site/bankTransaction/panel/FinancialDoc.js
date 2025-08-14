import React, { useEffect } from 'react'
import { CCard, CCardBody, CButtonGroup, CButton, CRow, CCol } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { capitalize, toUpper } from 'lodash'
import { formatMoney } from 'src/config/helpers'
import { findFindoc } from 'src/redux/slices/findocSlice'
import PropTypes from 'prop-types'

const FinancialDoc = ({ findocInfo, closeFindocModal }) => {
  const dispatch = useDispatch()
  const { showFindoc, findingFindoc } = useSelector((state) => state.findoc)

  const handleEditUser = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    // console.log(findocInfo)
    if (findocInfo) {
      async function findFindocData() {
        await dispatch(findFindoc(findocInfo.id)).unwrap()
      }

      findFindocData()
    }
  }, [findocInfo, dispatch])

  if (findingFindoc) return null

  return (
    <div className="slidePanel-inner-section">
      <div className="">
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
                      <span className="minbarTitle">{toUpper(showFindoc && showFindoc.code)}</span>
                      <div className="minbarSubtitle">
                        <h4 className="font-size-h4 text-dark-g">
                          {showFindoc && showFindoc.account && showFindoc.account.name}
                        </h4>
                        <span className="sub"></span>
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
                        {showFindoc && showFindoc.createdBy && showFindoc.createdBy.name}
                      </span>
                    </div>
                    <div className="minItem">
                      <i className="fa fa-map-marker-alt icon-rt" />
                      <span className="minItem-text">
                        {showFindoc && showFindoc.branch && showFindoc.branch.name}
                      </span>
                    </div>
                    <div className="minItem">
                      <i className="fa fa-flag icon-rt" />
                      <span className="minItem-text">
                        {showFindoc && capitalize(showFindoc.status)}
                      </span>
                    </div>
                    <div className="minItem">
                      <i className="fa fa-calendar-alt icon-rt" />
                      <span className="minItem-text">
                        {moment(showFindoc && showFindoc.createdAt).format('DD/MM/YYYY HH:m:s')}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap align-items-center mt-3">
                    <div className="text-light my-2">
                      <i className="fas fa-bars mr-2"></i>
                      <span className="font-weight-bolder">{showFindoc && showFindoc.notes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CCard>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
            <CCard className="cardCustom gutter-b">
              <div className="card-header">
                <div className="toolBarContainer">
                  <div className="customHeaderContainer">
                    <div className="customHeaderContainer-footer">
                      <div className="card-title">
                        <h3 className="card-label font-weight-bolder text-dark-g">
                          Document Lines
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CCardBody>
                <div className="pageContainer-wrapper">
                  <CRow className="pageBoxSizing-container">
                    <CCol md={12} sm={12} lg={12} xl={12}>
                      <CCard className="cardCustom b-shadow ">
                        <CCardBody className="p-0">
                          <div id="involines_list">
                            <div className="table-responsive table-truncate mt-3 min-h-300px">
                              <table id="findoc_details" className="table table-vertical-center">
                                <thead>
                                  <tr className="text-dark text-uppercase">
                                    <th>Account</th>
                                    <th>Notes</th>
                                    <th>Profit Center</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                    <th>Doc Amount</th>
                                  </tr>
                                </thead>
                                <tbody id="findoclines_table_body">
                                  {showFindoc &&
                                  showFindoc.findocItems &&
                                  showFindoc.findocItems.length > 0 ? (
                                    showFindoc.findocItems.map((item) => (
                                      <tr
                                        key={item.id}
                                        className="bg-hover-light-warning row-hover"
                                        id={`findocline_${item.id}`}
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
                                          {formatMoney(item.unitNumber && item.unitNumber, 1)}{' '}
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
                                  ) : (
                                    <tr
                                      className="bg-hover-light-warning row-hover"
                                      id="findocline_864837_div"
                                    >
                                      <td>
                                        <i className="fas fa-th-large"></i> JOHN DOE
                                        <br />
                                        <i className="far fa-bookmark"></i> 1000
                                      </td>
                                      <td>Joes EQUITY</td>
                                      <td>B00-BALANCE ACCOUNT</td>
                                      <td className="text-right">200.00 USD</td>
                                      <td className="text-right">2.00 </td>
                                      <td className="text-right">200.00 USD</td>
                                    </tr>
                                  )}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colSpan="4"></td>
                                    <td className="font-weight-bolder text-right">
                                      <span>Total</span>
                                    </td>
                                    <td className="font-weight-bolder text-right">
                                      <nobr>200.00 USD</nobr>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                          {/* <div className="row">
                                <div
                                  className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
                                  id={`invoice_${showFindoc.id}`}
                                >
                                  <div className="table-responsive">
                                    <table className="table debit-findoc">
                                      <tbody>
                                        <tr>
                                          <td className="font-weight-bolder">Due date</td>
                                          <td>
                                            {showFindoc &&
                                              moment(showFindoc.dueDate).format('DD/MM/YYYY')}
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
                                            {showFindoc.invoiceCurr && showFindoc.invoiceCurr.code}{' '}
                                            ({formatMoney(showFindoc.invoiceCurrRate, 1)})
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Notes</td>
                                          <td>
                                            <a
                                              data-remote="true"
                                              href="/invoice_corrections/new?form_scope=notes&amp;invoice_id=1433813"
                                            >
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
                                            {formatMoney(showFindoc.subTotal)}{' '}
                                            {showFindoc &&
                                              showFindoc.invoiceCurr &&
                                              showFindoc.invoiceCurr.code}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">VAT Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showFindoc.vatTotal)}{' '}
                                            {showFindoc &&
                                              showFindoc.invoiceCurr &&
                                              showFindoc.invoiceCurr.code}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Net Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showFindoc.netTotal)}{' '}
                                            {showFindoc &&
                                              showFindoc.invoiceCurr &&
                                              showFindoc.invoiceCurr.code}
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
                                            {formatMoney(showFindoc.rateSubtotalAmount)}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">VAT Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showFindoc.rateVatAmount)}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="font-weight-bolder">Net Total</td>
                                          <td className="font-weight-bolder text-right">
                                            {formatMoney(showFindoc.rateNetAmount)}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div> */}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    </div>
  )
}

FinancialDoc.propTypes = {
  findocInfo: PropTypes.object,
  closeFindocModal: PropTypes.func,
}

export default FinancialDoc
