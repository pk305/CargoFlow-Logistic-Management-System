import React, { useEffect } from 'react'
import { CCard, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { useHistory } from 'react-router-dom'

const UserReports = () => {
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
                <h4 className="report-Title">User Reports</h4>
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
                        <h6 className="card-label font-weight-bolder">User Analysis Reports</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=positions_months_stats&amp;list_partial_file=..%2Fpositions%2Fmdl_positions_months_stats_list&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fforms%2Fmdl_positions_months_stats_form&amp;title=Positions+Months+Stats"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-project-diagram"></i>
                              </span>
                              <span className="card-icon-text">Positions Months Stats</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=positions_country_stats&amp;list_partial_file=mdl_positions_country_stats_list&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fforms%2Fmdl_positions_country_stats_form&amp;title=Positions+Country+Stats"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-globe-americas"></i>
                              </span>
                              <span className="card-icon-text">Positions Country Stats</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=cass_search&amp;list_partial_file=..%2Fair_positions%2Fmdl_list_cass&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fforms%2Fmdl_air_cass_positions&amp;title=Cass+Report&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-list"></i>
                              </span>
                              <span className="card-icon-text">Cass Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=revenue_search_new&amp;list_partial_file=..%2Fair_positions%2Fmdl_revenue_list_new&amp;model=Logistics%3A%3ATransport&amp;search_form=logistics%2Fpositions%2Fforms%2Fmdl_revenue_form&amp;title=Position+Revenue+List&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-bars"></i>
                              </span>
                              <span className="card-icon-text">Position Revenue List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=vehicle_based_export_report&amp;list_partial_file=..%2Froad_positions%2Fmdl_list_export&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fforms%2Fmdl_export_positions&amp;title=Load+Statistics+by+Countries"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-chart-network"></i>
                              </span>
                              <span className="card-icon-text">Load Statistics by Countries</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=container_report&amp;list_partial_file=..%2Fcontainers%2Fmdl_list_report&amp;model=Logistics%3A%3AContainer&amp;search_form=logistics%2Fcontainers%2Fforms%2Fmdl_form_report&amp;title=Container+Reports"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-warehouse"></i>
                              </span>
                              <span className="card-icon-text">Container Reports</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=detailed_container_report&amp;list_partial_file=mdl_detailed_container_report&amp;model=Logistics%3A%3AContainer&amp;search_form=logistics%2Fcontainers%2Fforms%2Fmdl_form_report&amp;title=Container+FreeTime+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-warehouse"></i>
                              </span>
                              <span className="card-icon-text">Container FreeTime Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=&amp;list_partial_file=..%2Ftransports%2Fmdl_list_transport&amp;model=Logistics%3A%3ATransport&amp;title=Export+-+Import+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-analytics"></i>
                              </span>
                              <span className="card-icon-text">Export - Import Report</span>
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

export default UserReports
