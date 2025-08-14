/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { CCard } from '@coreui/react'
import { Link } from 'react-router-dom'
import { fetchInvoiceInsights } from 'src/redux/slices/invoiceSlice'
import { useDispatch, useSelector } from 'react-redux'

const FinanceDashboard = () => {
  const dispatch = useDispatch()
  const { insights } = useSelector((state) => state.invoice)

  useEffect(() => {
    dispatch(fetchInvoiceInsights({ invoiceType: 'credit' }))
  }, [dispatch])

  return (
    <div className="mt-3">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
          <CCard className="cardCustom mb-2">
            <div className="card-header">
              <div className="card-title">
                <h6 className="card-label font-weight-bolder text-dark">Finance Management</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                  <div className="d-flex flex-grow-1 flex-shrink-0 py-3 h-100">
                    <Link
                      className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                      to="/financor/debit"
                    >
                      <span className="py-2 w-auto">
                        <i className="icon-2x fa fa-file-invoice"></i>
                      </span>
                      <span className="font-size-md text-center font-weight-bolder text-wrap">
                        Sales Invoices
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                  <div className="d-flex flex-grow-1 flex-shrink-0 py-3 h-100">
                    <Link
                      className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-primary text-primary"
                      to="/financor/credit"
                    >
                      <span className="py-2 w-auto">
                        <i className="icon-2x fa fa-file-alt"></i>
                      </span>
                      <span className="font-size-md text-center font-weight-bolder text-wrap">
                        Purchase Invoices
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                  <div className="d-flex flex-grow-1 flex-shrink-0 py-3 h-100">
                    <Link
                      className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                      to="/financor/cash_trans"
                    >
                      <span className="py-2 w-auto">
                        <i className="icon-2x fa fa-coins"></i>
                      </span>
                      <span className="font-size-md text-center font-weight-bolder text-wrap">
                        Cash Transactions
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                  <div className="d-flex flex-grow-1 flex-shrink-0 py-3 h-100">
                    <Link
                      className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-info text-info"
                      to="/financor/bank_trans"
                    >
                      <span className="py-2 w-auto">
                        <i className="icon-2x fa fa-university"></i>
                      </span>
                      <span className="font-size-md text-center font-weight-bolder text-wrap">
                        Bank Transactions
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                  <div className="d-flex flex-grow-1 flex-shrink-0 py-3 h-100">
                    <Link
                      className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                      to="/financor/pay_terms"
                    >
                      <span className="py-2 w-auto">
                        <i className="icon-2x fa fa-money-bill-wave"></i>
                      </span>
                      <span className="font-size-md text-center font-weight-bolder text-wrap">
                        Credit, Policies
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                  <div className="d-flex flex-grow-1 flex-shrink-0 py-3 h-100">
                    <Link
                      className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-primary text-primary"
                      to="/financor/driver_trans"
                    >
                      <span className="py-2 w-auto">
                        <i className="icon-2x fa fa-id-card-alt"></i>
                      </span>
                      <span className="font-size-md text-center font-weight-bolder text-wrap">
                        Driver Transactions
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CCard>

          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="card-title">
                <h6 className="card-label font-weight-bolder text-dark">Invoices</h6>
              </div>
            </div>
            <div className="card-body invoice-dashboard">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Pending Approval</th>
                      <th>Not-Ledgered</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <Link className="text-dark-g text-hover-primary" to="/financor/debit">
                            Sales Invoices
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <Link
                            className="text-dark-g text-hover-primary"
                            to="/financor/debit&amp;status=draft&amp;work_type%5B%5D=SATIS&amp;work_type%5B%5D=TEVKIFAT&amp;work_type%5B%5D=IADE&amp;work_type%5B%5D=IC_DEKONT"
                          >
                            {insights ? insights.salesInvoices.pending : 0}
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <Link
                            className="text-dark-g text-hover-primary"
                            to="/financor/debit&amp;ledger_status=notledgered&amp;status=confirmed&amp;work_type%5B%5D=SATIS&amp;work_type%5B%5D=TEVKIFAT&amp;work_type%5B%5D=IADE&amp;work_type%5B%5D=IC_DEKONT"
                          >
                            {insights ? insights.salesInvoices.notLedgered : 0}
                          </Link>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <Link className="text-dark-g text-hover-primary" to="/financor/credit">
                            Purchase Invoices
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/financor/credit&amp;status=draft&amp;work_type%5B%5D=ALIS&amp;work_type%5B%5D=TEVKIFAT&amp;work_type%5B%5D=IADE&amp;work_type%5B%5D=IC_DEKONT"
                          >
                            {insights ? insights.purchaseInvoices.pending : 0}
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <Link
                            className="text-dark-g text-hover-primary"
                            to="/financor/credit&amp;ledger_status=notledgered&amp;status=confirmed&amp;work_type%5B%5D=ALIS&amp;work_type%5B%5D=TEVKIFAT&amp;work_type%5B%5D=IADE&amp;work_type%5B%5D=IC_DEKONT"
                          >
                            {insights ? insights.purchaseInvoices.notLedgered : 0}
                          </Link>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <Link className="text-dark-g text-hover-primary" to="/financor/debit">
                            Debit Note
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <Link
                            className="text-dark-g text-hover-primary"
                            to="/financor/debit&amp;status=draft&amp;work_type=DEBIT_NOTE"
                          >
                            0
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <Link
                            className="text-dark-g text-hover-primary"
                            to="/financor/debit&amp;ledger_status=notledgered&amp;status=confirmed&amp;work_type=DEBIT_NOTE"
                          >
                            0
                          </Link>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <Link className="text-dark-g text-hover-primary" to="/financor/credit">
                            Credit Note
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/financor/credit&amp;status=draft&amp;work_type=CREDIT_NOTE"
                          >
                            0
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/financor/credit&amp;ledger_status=notledgered&amp;status=confirmed&amp;work_type=CREDIT_NOTE"
                          >
                            0
                          </a>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CCard>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="card-title">
                <h6 className="card-label font-weight-bolder text-dark">Side Links</h6>
              </div>
            </div>
            <div className="card-body">
              <ul className="navi navi-link-rounded">
                <li className="navi-item">
                  <Link className="navi-link" to="/ledgers?auth_proc_code=742">
                    <span className="navi-icon">
                      <i className="fa fa-file-alt icon-lg text-info"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Ledger Transactions</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/gldocs">
                    <span className="navi-icon">
                      <i className="fa fa-pen-square icon-lg text-success"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Ledger Entries</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link
                    className="navi-link"
                    to="/costforms/home?person_type=person&amp;scope=advance"
                  >
                    <span className="navi-icon">
                      <i className="fa fa-money-bill-alt icon-lg text-danger"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Person Advance &amp; Expense</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/estimated_payments">
                    <span className="navi-icon">
                      <i className="fa fa-money-bill icon-lg text-primary"></i>
                    </span>
                    <span className="navi-text font-weight-bold">
                      Estimated Payments &amp; Collections
                    </span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/agreement_periods">
                    <span className="navi-icon">
                      <i className="fa fa-handshake icon-lg text-info"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Agreements</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/financor/setting_period?auth_proc_code=775">
                    <span className="navi-icon">
                      <i className="fa fa-calendar-check icon-lg text-success"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Periodic Process</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/mappings">
                    <span className="navi-icon">
                      <i className="fa fa-retweet icon-lg text-info"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Payment - Collection Mapping</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/reports/home?group_type=financor">
                    <span className="navi-icon">
                      <i className="fa fa-file icon-lg text-warning"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Reports</span>
                  </Link>
                </li>
                <li className="navi-item">
                  <Link className="navi-link" to="/financor/settings">
                    <span className="navi-icon">
                      <i className="fa fa-cog icon-lg text-danger"></i>
                    </span>
                    <span className="navi-text font-weight-bold">Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </CCard>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="card-title">
                <h6 className="card-label font-weight-bolder text-dark">Financial Documents</h6>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Pending Approval</th>
                      <th>Not-Ledgered</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <Link className="text-dark-g text-hover-primary" to="/costforms/home">
                            Driver Operations (Advances)
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=debit&amp;person_type=driver&amp;scope=advance&amp;status=draft"
                          >
                            0
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=debit&amp;ledgered=false&amp;person_type=driver&amp;scope=advance&amp;status=confirmed"
                          >
                            0
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?scope=expense"
                          >
                            Driver Operations (Costs)
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=credit&amp;person_type=driver&amp;scope=expense&amp;status=draft"
                          >
                            0
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=credit&amp;ledger_status=notledgered&amp;person_type=driver&amp;scope=expense&amp;status=confirmed"
                          >
                            0
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <Link className="text-dark-g text-hover-primary" to="/costforms/home">
                            Personel Operations (Advances)
                          </Link>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=debit&amp;person_type=person&amp;scope=advance&amp;status=draft"
                          >
                            0
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=debit&amp;ledgered=false&amp;person_type=person&amp;scope=advance&amp;status=confirmed"
                          >
                            0
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?scope=expense"
                          >
                            Personel Operations (Costs)
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=credit&amp;person_type=person&amp;scope=expense&amp;status=draft"
                          >
                            0
                          </a>
                        </span>
                      </td>
                      <td>
                        <span className="font-weight-bold">
                          <a
                            className="text-dark-g text-hover-primary"
                            to="/costforms/home?dc=credit&amp;ledger_status=notledgered&amp;person_type=person&amp;scope=expense&amp;status=confirmed"
                          >
                            0
                          </a>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CCard>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 hide">
          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="card-title">
                <h6 className="card-label font-weight-bolder text-dark">Currency Rates</h6>
              </div>
            </div>
            <div className="card-body">
              <div id="quick_search_form">
                <form className="simple_form new_search" id="new_search" method="post">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1">
                      <div className="form-group date_picker required search_filter_rate_date">
                        <input
                          className="form-control string date_picker required dont_focus"
                          type="text"
                          data-plugin="datepicker"
                          name="search[filter][rate_date]"
                          id="search_filter_rate_date"
                        />
                      </div>
                    </div>
                    <div className="ml-3 mb-6">
                      <input
                        type="submit"
                        name="commit"
                        value="Search"
                        className="btn btn-default btn btn-secondary"
                        data-disable-with="Search"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div id="currency_rates_list" className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Curr Date</th>
                      <th>Curr</th>
                      <th>Buying</th>
                      <th>Selling</th>
                      <th>Currency Buying</th>
                      <th>Currency Selling</th>
                    </tr>
                  </thead>
                  <tbody id="currency_rates_list_tbody">
                    <tr>
                      <td>
                        <span className="font-weight-bold text-dark-g">14/02/2022</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">CHF</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">14.5144</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">14.6076</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">14.4927</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">14.6295</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold text-dark-g">14/02/2022</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">EUR</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">15.3674</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">15.3951</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">15.3567</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">15.4182</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold text-dark-g">14/02/2022</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">GBP</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">18.2544</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">18.3495</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">18.2416</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">18.3771</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold text-dark-g">14/02/2022</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">RON</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">3.0908</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">3.1312</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">3.0908</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">3.1312</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="font-weight-bold text-dark-g">14/02/2022</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">USD</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">13.4933</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">13.5176</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">13.4839</span>
                      </td>
                      <td>
                        <span className="font-weight-bold text-dark-g">13.5379</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default FinanceDashboard
