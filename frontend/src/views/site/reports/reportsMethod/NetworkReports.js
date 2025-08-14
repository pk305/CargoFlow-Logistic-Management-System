import React, { useEffect } from 'react'
import { CCard, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { useHistory } from 'react-router-dom'

const NetworkReports = () => {
  const history = useHistory()
  // const dispatch = useDispatch()

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  // const fetchCompanyData = useCallback(() => dispatch(fetchCompanies()), [dispatch])

  useEffect(() => {
    // fetchCompanyData()
  }, [])

  return (
    <div className="reports-wrapper">
      <div className="pageContainer">
        <div className="container-fluid">
          <div className="d-block"></div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="rprt-header">
                <h4 className="report-Title">Sales &amp; CRM Reports</h4>
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
                          Sales &amp; CRM Analysis Reports
                        </h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?model=Network%3A%3ALead&amp;title=Leads+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-file-spreadsheet"></i>
                              </span>
                              <span className="card-icon-text">Leads List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?list_partial_file=mdl_list_details&amp;model=Network%3A%3ANotice&amp;orientation=portrait&amp;title=Company+Notes+List&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-sticky-note"></i>
                              </span>
                              <span className="card-icon-text">Company Notes List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=company_financial_debts&amp;list_partial_file=mdl_list_company_financial_debts&amp;model=Network%3A%3ACompany&amp;orientation=portrait&amp;title=Company+Financial+Debts+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-chart-pie-alt"></i>
                              </span>
                              <span className="card-icon-text">Company Financial Debts Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=loading_based_country_report&amp;list_partial_file=mdl_loading_based_country_report&amp;model=Logistics%3A%3ALoading&amp;search_form=logistics%2Floadings%2Fforms%2Fmdl_form_loading_search&amp;title=Loadings+Reports+by+Country&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-globe-europe"></i>
                              </span>
                              <span className="card-icon-text">Loadings Reports by Country</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=lost_company_analysis&amp;list_partial_file=mdl_list_lost_company&amp;model=Network%3A%3ACompany&amp;orientation=portrait&amp;title=Company+Analysis+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-user-times"></i>
                              </span>
                              <span className="card-icon-text">Company Analysis Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/management_reports/lead_analysis"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-file-spreadsheet"></i>
                              </span>
                              <span className="card-icon-text">Quote Analysis Report</span>
                            </a>
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

export default NetworkReports
