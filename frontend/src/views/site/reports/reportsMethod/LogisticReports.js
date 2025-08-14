import React, { useEffect } from 'react'
import { CCard, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { useHistory } from 'react-router-dom'

const LogisticReports = () => {
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
                <h4 className="report-Title">Logistics Reports</h4>
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
                          Logistics Analysis Reports
                        </h6>
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
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header">
                      <div className="card-title">
                        <h6 className="card-label font-weight-bolder">Logistics Operation Lists</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=..%2Fpositions%2Fmdl_full_list_road&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fmdl_form_search_road&amp;title=Road+Freight&amp;trans_method=road"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-truck-moving"></i>
                              </span>
                              <span className="card-icon-text">Road Freight</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=..%2Fpositions%2Fmdl_full_list_air&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fmdl_form_search_air&amp;title=Air+Freight&amp;trans_method=air"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-plane-departure"></i>
                              </span>
                              <span className="card-icon-text">Air Freight</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=..%2Fpositions%2Fmdl_full_list_sea&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fmdl_form_search_sea&amp;title=Sea+Freight&amp;trans_method=sea"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-ship"></i>
                              </span>
                              <span className="card-icon-text">Sea Freight</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?filter=trans_method+%3D%3E+sea&amp;list_partial_file=..%2Fpositions%2Fmdl_full_list_sea_report&amp;model=Logistics%3A%3ALoading&amp;title=Sea+Position+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-ship-alt"></i>
                              </span>
                              <span className="card-icon-text">Sea Position Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=..%2Fpositions%2Fmdl_full_list_rail&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fmdl_form_search_rail&amp;title=Rail+Freight&amp;trans_method=rail"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-train"></i>
                              </span>
                              <span className="card-icon-text">Rail Freight</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=mdl_search_list&amp;model=Logistics%3A%3ATransport&amp;title=Deliveries+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-sort-size-up"></i>
                              </span>
                              <span className="card-icon-text">Deliveries List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=mdl_search_list&amp;model=Logistics%3A%3AWaybillStockLine&amp;title=Air+Waybill+Stocks"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-poll-h"></i>
                              </span>
                              <span className="card-icon-text">Air Waybill Stocks</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=mdl_list&amp;model=Logistics%3A%3ALoading&amp;title=Loadings+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-truck-loading"></i>
                              </span>
                              <span className="card-icon-text">Loadings List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?class_method=uninvoiced_search&amp;filter=trans_method+%3D%3E+road%2C+loading_invoice_status+%3D%3E+not_invoiced%2C+load_date1+%3D%3E+-01-01-2022%2C+load_date2+%3D%3E+-25-02-2022%2C+invoice_control_type+%3D%3E+loading%2C+transfin_status+%3D%3E+not_processed&amp;list_partial_file=mdl_uninvoiced_list&amp;model=Logistics%3A%3ALoading&amp;title=Uninvoiced+Loadings+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-receipt"></i>
                              </span>
                              <span className="card-icon-text">Uninvoiced Loadings List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=mdl_arrival_list&amp;model=Logistics%3A%3ATransport&amp;search_form=logistics%2Floadings%2Fforms%2Fmdl_form_search&amp;title=Arrivals+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-street-view"></i>
                              </span>
                              <span className="card-icon-text">Arrivals List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=mdl_list_rented_positions&amp;model=Financor%3A%3AInvoiceDetail&amp;orientation=portrait&amp;page_title=f&amp;title=Rental+Position+List&amp;will_paginate=false"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-business-time"></i>
                              </span>
                              <span className="card-icon-text">Rental Position List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?class_method=invoices_of_positions&amp;list_partial_file=mdl_list_invoice_report_by_position&amp;model=Logistics%3A%3APosition&amp;orientation=portrait&amp;page_title=f&amp;search_form=logistics%2Fpositions%2Fforms%2Fmdl_invoice_report_by_position_form&amp;title=Position+Based+Invoice+Status+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-send-back"></i>
                              </span>
                              <span className="card-icon-text">
                                Position Based Invoice Status Report
                              </span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?class_method=cmr_search&amp;list_partial_file=mdl_list_cmr&amp;model=Logistics%3A%3ALoading&amp;orientation=portrait&amp;page_title=f&amp;title=CMR+Tracking"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-ramp-loading"></i>
                              </span>
                              <span className="card-icon-text">CMR Tracking</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=mdl_search_transport_list&amp;model=Logistics%3A%3ATransport&amp;title=Transport+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-clipboard-list"></i>
                              </span>
                              <span className="card-icon-text">Transport List</span>
                            </a>
                          </div>
                        </div>
                        {/* <!--div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
        </div>
        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
        </div--> */}
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?class_method=ameta_report&amp;list_partial_file=..%2Fpositions%2Fmdl_ameta_report&amp;model=Logistics%3A%3APosition&amp;search_form=logistics%2Fpositions%2Fmdl_form_search_road&amp;title=Ameta+Report&amp;trans_method=road"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-truck-moving"></i>
                              </span>
                              <span className="card-icon-text">Ameta Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?class_method=rorotruck_report&amp;list_partial_file=..%2Frorotrucks%2Fmdl_rorotruck_report&amp;model=Logistics%3A%3ARorotruck&amp;search_form=logistics%2Frorotrucks%2Fforms%2Fmdl_form_search&amp;title=Rorotruck+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-leaf"></i>
                              </span>
                              <span className="card-icon-text">Rorotruck Report</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-minicon"
                              href="/roster/searches/new?list_partial_file=..%2Fcontainer_movements%2Fmdl_list&amp;model=Logistics%3A%3AContainerMovement&amp;search_form=logistics%2Fcontainer_movements%2Fforms%2Fmdl_form_search&amp;title=Container+Movement+Report"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-warehouse"></i>
                              </span>
                              <span className="card-icon-text">Container Movement Report</span>
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

export default LogisticReports
