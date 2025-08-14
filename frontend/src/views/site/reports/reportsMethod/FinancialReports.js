import React, { useEffect } from 'react'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CCard } from '@coreui/react'
import { Link, useHistory } from 'react-router-dom'

const FinancialReports = () => {
  const history = useHistory()

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  useEffect(() => {
    document.title = 'Reports'
  }, [])

  return (
    <div className="reports-wrapper">
      <div className="pageContainer">
        <div className="container-fluid">
          <div className="d-block"></div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="rprt-header">
                <h4 className="report-Title">Financial Reports</h4>
                <CDropdown>
                  <CDropdownToggle color="dark" className="btn-clean btn-icon btn-xs" caret={false}>
                    <i className="fas fa-caret-down icon-lg" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => toLink(e, '/reports/home?group_type=logistics')}
                    >
                      Logistics Reports
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => toLink(e, '/reports/home?group_type=financor')}
                    >
                      Financial Reports
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => toLink(e, '/reports/home?group_type=fleet')}
                    >
                      Fleet Reports
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => toLink(e, '/reports/home?group_type=deport')}
                    >
                      Warehouse Reports
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => toLink(e, '/reports/home?group_type=network')}
                    >
                      Sales &amp; CRM Reports
                    </CDropdownItem>
                    <CDropdownItem
                      href="#"
                      onClick={(e) => toLink(e, '/reports/home?group_type=user')}
                    >
                      User Reports
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header">
                      <div className="card-title">
                        <h6 className="card-label font-weight-bolder">
                          Financial Transaction Reports
                        </h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?filter=all_invoices%3D%3Etrue&amp;nlmsFile=nlmsList&amp;req=Financor&amp;model=Invoicelist&amp;title=Invoices+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-file-invoice"></i>
                              </span>
                              <span className="card-icon-text">Invoices List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?list_partial_file=mdl_report_list&amp;model=Involine&amp;title=Invoice+Items+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-poll-h"></i>
                              </span>
                              <span className="card-icon-text">Invoice Items List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?model=PayTerm&amp;title=Bank+Loans-Police+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-money-check"></i>
                              </span>
                              <span className="card-icon-text">Bank Loans-Police List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?model=Findoc&amp;title=Financial+Documents+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-file-invoice-dollar"></i>
                              </span>
                              <span className="card-icon-text">Financial Documents List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?model=PayTermLine&amp;title=Bank+Loans-Polices+Installment+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-th-list"></i>
                              </span>
                              <span className="card-icon-text">
                                Bank Loans-Polices Installment List
                              </span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/payments/new?list_title=Cash+Flow+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-donate"></i>
                              </span>
                              <span className="card-icon-text">Cash Flow Report</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link className="card-icon-link" to="/agings/new">
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-coins"></i>
                              </span>
                              <span className="card-icon-text">Debts-Credits Aging Report</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?class_method=detailed_cashflow&amp;filter=credit+%3D%3E+1%2C+cheque+%3D%3E+1%2C+pmnote+%3D%3E+1%2C+estimated+%3D%3E+1%2C+partner_input+%3D%3E+consolide&amp;list_partial_file=mdl_list_cashflow_details&amp;model=Financor%3A%3APayTerm&amp;orientation=portrait&amp;search_form=financor%2Fpay_terms%2Fforms%2Fmdl_form_cashflow_details_search&amp;title=Cash+Flow+Details+Report&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-hand-holding-usd"></i>
                              </span>
                              <span className="card-icon-text">Cash Flow Details Report</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="card-icon-link"
                              to="/nlms/searches/new?class_method=avg_due&amp;filter=fiscal_year+%3D%3E+2022&amp;list_partial_file=mdl_list_avg_due&amp;model=LedgerEntry&amp;orientation=portrait&amp;search_form=financor%2Fledger_entries%2Fforms%2Fmdl_form_due_days&amp;title=Avg.+Due+Report&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-hand-holding-usd"></i>
                              </span>
                              <span className="card-icon-text">Avg. Due Report</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CCard>
                </div>

                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header">
                      <div className="card-title">
                        <h6 className="card-label font-weight-bolder">Extract Reports</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=entries_extract&amp;model=Financor%3A%3ALedgerEntry&amp;orientation=portrait&amp;parent_type=Financor%3A%3ACashPoint&amp;title=Cash+Point+Statement"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-comments-dollar"></i>
                              </span>
                              <span className="card-icon-text">Cash Point Statements</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=entries_extract&amp;model=Financor%3A%3ALedgerEntry&amp;orientation=portrait&amp;parent_type=Financor%3A%3ABankAccount&amp;title=Bank+Account+Statement"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-university"></i>
                              </span>
                              <span className="card-icon-text">Bank Account Statements</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=entries_extract&amp;req=Financor&amp;model=Financor%3A%3ACompanyEntry&amp;orientation=portrait&amp;parent_type=Network%3A%3ACompany&amp;search_form=financor%2Fledger_entries%2Fforms%2Fmdl_form_search&amp;title=Company+Statement"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-building"></i>
                              </span>
                              <span className="card-icon-text">Company Statements</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=entries_extract&amp;model=Financor%3A%3ALedgerEntry&amp;orientation=portrait&amp;parent_type=Hr%3A%3APerson&amp;title=Personel+Statements"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-user"></i>
                              </span>
                              <span className="card-icon-text">Personel Statements</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=entries_extract&amp;model=Financor%3A%3ALedgerEntry&amp;orientation=portrait&amp;parent_type=Fleet%3A%3ADriver&amp;title=Driver+Statement"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-dharmachakra" />
                              </span>
                              <span className="card-icon-text">Driver Statements</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?list_partial_file=mdl_list_entries&amp;model=Financor%3A%3ALedgerEntry&amp;orientation=portrait&amp;search_form=financor%2Fledger_entries%2Fforms%2Fmdl_payment_collections_form&amp;title=Payments-Collections+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-cash-register"></i>
                              </span>
                              <span className="card-icon-text">Payments-Collections List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=people_extracts&amp;list_partial_file=mdl_list_people_extracts&amp;model=Financor%3A%3ALedgerEntry&amp;orientation=portrait&amp;parent_type%5B%5D=Hr%3A%3APerson&amp;search_form=financor%2Fledger_entries%2Fforms%2Fmdl_form_people_extracts&amp;title=People%2FDriver+Balances"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-chalkboard-teacher"></i>
                              </span>
                              <span className="card-icon-text">People/Driver Balances</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=company_debit_credit&amp;list_partial_file=mdl_list_company_debit_credit&amp;model=Financor%3A%3ALedgerEntry&amp;parent_type=Network%3A%3ACompany&amp;title=Company+Debit%2FCredit+Report&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-building"></i>
                              </span>
                              <span className="card-icon-text">Company Debit/Credit Report</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              to="/nlms/searches/new?class_method=unclosed_entries&amp;list_partial_file=mdl_list_unclosed&amp;model=Financor%3A%3ALedgerEntry&amp;search_form=financor%2Fledger_entries%2Fforms%2Fmdl_form_unclosed&amp;title=Unpaid+Invoices"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-money-bill-wave"></i>
                              </span>
                              <span className="card-icon-text">Unpaid Invoices</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CCard>
                </div>

                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header">
                      <div className="card-title">
                        <h6 className="card-label font-weight-bolder">Ledger Reports</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=muavin&amp;list_partial_file=mdl_muavin_head&amp;model=Financor%3A%3ALedgerline&amp;orientation=portrait&amp;title=Ledger+Book&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-sliders-h"></i>
                              </span>
                              <span className="card-icon-text">Ledger Book</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=mizan&amp;model=Financor%3A%3ALedgerSum&amp;orientation=portrait&amp;title=Trial+Balance&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-slideshare"></i>
                              </span>
                              <span className="card-icon-text">Trial Balance</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?model=Financor%3A%3AProfitCenterline&amp;perpage=5&amp;search_form=financor%2Fprofit_centerlines%2Fforms%2Fmdl_gm_muavin_form&amp;title=Profit+Center+Ledger+Book"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-sliders-v-square"></i>
                              </span>
                              <span className="card-icon-text">Profit Center Ledger Book</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=gm_mizan&amp;model=Financor%3A%3AProfitCenterSum&amp;title=Profit+Center+Trial+Balance"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-sliders-v"></i>
                              </span>
                              <span className="card-icon-text">Profit Center Trial Balance</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=debit_credit_list&amp;filter=ledger_date1+%3D%3E+-01-01-2022%2C+ledger_date2+%3D%3E+-25-02-2022&amp;list_partial_file=mdl_debit_credit_list&amp;model=Financor%3A%3ALedgerline&amp;search_form=financor%2Fledgerlines%2Fforms%2Fmdl_ledger_debits_credits_form&amp;title=Debtors+Creditors+List&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-exchange-alt"></i>
                              </span>
                              <span className="card-icon-text">Debtors Creditors List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=ledger_control&amp;filter=ledger_date1+%3D%3E+-25-02-2022%2C+ledger_date2+%3D%3E+-25-02-2022&amp;list_partial_file=mdl_list_ledger_control&amp;model=Financor%3A%3ALedger&amp;orientation=portrait&amp;search_form=financor%2Fledgers%2Fforms%2Fmdl_form_ledger_control&amp;title=Ledger+Transactions&amp;will_paginate=false"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-receipt"></i>
                              </span>
                              <span className="card-icon-text">Ledger Transactions</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=vat_search&amp;list_partial_file=mdl_vat_list&amp;model=Financor%3A%3AInvoice&amp;search_form=financor%2Finvoices%2Fforms%2Fmdl_vat_form&amp;title=VAT+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-percent"></i>
                              </span>
                              <span className="card-icon-text">VAT List</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=vat_search&amp;list_partial_file=mdl_vat_table_list&amp;model=Financor%3A%3AInvoline&amp;search_form=financor%2Finvolines%2Fforms%2Fmdl_vat_table_form&amp;title=VAT+Summary+Table"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-table"></i>
                              </span>
                              <span className="card-icon-text">VAT Summary Table</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?class_method=&amp;list_partial_file=&amp;model=Financor%3A%3AInvoiceDetail&amp;orientation=portrait&amp;page_title=f&amp;title=Invoices+with+Zero+VAT"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-clipboard-list"></i>
                              </span>
                              <span className="card-icon-text">Invoices with Zero VAT</span>
                            </Link>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <Link
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              to="/nlms/searches/new?model=Financor%3A%3AAccount"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-project-diagram"></i>
                              </span>
                              <span className="card-icon-text">Accounting Integrations</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CCard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialReports
