import React, { useEffect } from 'react'
import { CCard, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { useHistory } from 'react-router-dom'

const FleetReports = () => {
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
                <h4 className="report-Title">Fleet Reports</h4>
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
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <CCard className="cardCustom gutter-b">
                        <div className="card-header">
                          <div className="card-title">
                            <h6 className="card-label font-weight-bolder">Driver Report</h6>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="card-icon-link"
                                  href="/roster/searches/new?model=Fleet%3A%3ADriver&amp;title=Driver+Report"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-steering-wheel"></i>
                                  </span>
                                  <span className="card-icon-text">Driver Report</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="card-icon-link"
                                  href="/roster/searches/new?class_method=driver_status_search&amp;list_partial_file=..%2Fdrivers%2Fmdl_list_status&amp;model=Fleet%3A%3ADriver&amp;search_form=fleet%2Fdrivers%2Fforms%2Fmdl_driver_status_form&amp;title=Driver+Km%2C+Advance+%26+Expense+Report"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-road"></i>
                                  </span>
                                  <span className="card-icon-text">
                                    Driver Km, Advance &amp; Expense Report
                                  </span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="card-icon-link"
                                  href="/roster/searches/new?class_method=involine_report_by_finitem&amp;list_partial_file=mdl_involine_report_by_finitem&amp;model=Financor%3A%3AInvoline&amp;search_form=financor%2Finvolines%2Fforms%2Fmdl_form_finitem&amp;title=Driver+Cost+Report&amp;will_paginate=f"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-clipboard-list"></i>
                                  </span>
                                  <span className="card-icon-text">Driver Cost Report</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="card-icon-link"
                                  href="/roster/searches/new?filter=parent_type+%3D%3E+Fleet%3A%3ADriver&amp;model=Hr%3A%3ABehavior&amp;title=Person+Behavior+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-user-tie"></i>
                                  </span>
                                  <span className="card-icon-text">Person Behavior List</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="card-icon-link"
                                  href="/roster/searches/new?class_method=revenue_search&amp;list_partial_file=..%2Froad_voyages%2Fmdl_revenue_list&amp;model=Logistics%3A%3ARoadVoyage&amp;search_form=&amp;title=Trucks+Revenue+List&amp;will_paginate=f"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-chart-line"></i>
                                  </span>
                                  <span className="card-icon-text">Trucks Revenue List</span>
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
                            <h6 className="card-label font-weight-bolder">Vehicle Report</h6>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                                  href="/roster/searches/new?model=Fleet%3A%3AVehicle&amp;title=Vehicle+Report"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-truck-container"></i>
                                  </span>
                                  <span className="card-icon-text">Vehicle Report</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                                  href="/roster/searches/new?class_method=vehicle_status_search&amp;list_partial_file=..%2Fvehicles%2Fmdl_list_status&amp;model=Fleet%3A%3AVehicle&amp;search_form=fleet%2Fvehicles%2Fforms%2Fmdl_vehicle_status_form&amp;title=Vehicle+Status+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-garage-open"></i>
                                  </span>
                                  <span className="card-icon-text">Vehicle Status List</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                                  href="/roster/searches/new?list_partial_file=mdl_detailed_vehicles_list&amp;model=Fleet%3A%3AVehicle&amp;title=Detailed+Vehicle+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-list-alt"></i>
                                  </span>
                                  <span className="card-icon-text">Detailed Vehicle List</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                                  href="/roster/searches/new?class_method=vehicle_stat_search&amp;list_partial_file=mdl_vehicle_stat_list&amp;model=Fleet%3A%3AVehicleStat&amp;search_form=fleet%2Fvehicle_stats%2Fforms%2Fmdl_vehicle_stat_form&amp;title=Driver+Odemeter+Report"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-tachometer-alt-slow"></i>
                                  </span>
                                  <span className="card-icon-text">Driver Odemeter Report</span>
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
                            <h6 className="card-label font-weight-bolder">Fuel Report</h6>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                                  href="/roster/searches/new?class_method=monthly_fuel_report&amp;list_partial_file=mdl_monthly_fuel_report&amp;model=Fleet%3A%3AFuellog&amp;search_form=fleet%2Ffuellogs%2Fforms%2Fmdl_monthly_fuel_report_form&amp;title=Monthly+Vehicle+Fuel+Report"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-car-mechanic"></i>
                                  </span>
                                  <span className="card-icon-text">
                                    Monthly Vehicle Fuel Report
                                  </span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                                  href="/roster/searches/new?model=Fleet%3A%3AFuellog&amp;title=Fuel+Report"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-gas-pump"></i>
                                  </span>
                                  <span className="card-icon-text">Fuel Report</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                                  href="/roster/searches/new?class_method=fuel_tank_analysis&amp;list_partial_file=mdl_fuel_tank_analysis&amp;model=Fleet%3A%3AFuellog&amp;search_form=fleet%2Ffuellogs%2Fforms%2Fmdl_form_fuel_tank&amp;title=Fuel+Tank+Analysis+Report&amp;will_paginate=f"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-charging-station"></i>
                                  </span>
                                  <span className="card-icon-text">Fuel Tank Analysis Report</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                                  href="/roster/searches/new?class_method=fuel_vendor_report&amp;list_partial_file=mdl_fuel_vendor_analysis&amp;model=Fleet%3A%3AFuellog&amp;search_form=fleet%2Ffuellogs%2Fforms%2Fmdl_form_fuel_tank&amp;title=Supplier+Based+Fuel+Report&amp;will_paginate=f"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-file-chart-pie"></i>
                                  </span>
                                  <span className="card-icon-text">Supplier Based Fuel Report</span>
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
                            <h6 className="card-label font-weight-bolder">Other Report</h6>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                                  href="/roster/searches/new?model=Fleet%3A%3APeriodoc&amp;title=Periodic+Documents+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-sort-numeric-down"></i>
                                  </span>
                                  <span className="card-icon-text">Periodic Documents List</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                                  href="/roster/searches/new?class_method=&amp;list_partial_file=&amp;model=Fleet%3A%3ATransdoc&amp;title=Roro+Tickets+ve+Tir+Carnet"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-ticket-alt"></i>
                                  </span>
                                  <span className="card-icon-text">Roro Tickets ve Tir Carnet</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                                  href="/roster/searches/new?model=Fleet%3A%3AServicelog&amp;title=Service+Logs+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-car-mechanic"></i>
                                  </span>
                                  <span className="card-icon-text">Service Logs List</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                                  href="/roster/searches/new?model=Fleet%3A%3AServicelogline&amp;title=Service+Parts+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-dolly"></i>
                                  </span>
                                  <span className="card-icon-text">Service Parts List</span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                                  href="/roster/searches/new?class_method=part_stocks&amp;list_partial_file=mdl_list_stock&amp;model=Fleet%3A%3APartStockline&amp;title=Part+Stock+%28Vehicle%2F+Location%29&amp;will_paginate=f"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-person-carry"></i>
                                  </span>
                                  <span className="card-icon-text">
                                    Part Stock (Vehicle/ Location)
                                  </span>
                                </a>
                              </div>
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                              <div className="card-icon">
                                <a
                                  className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger"
                                  href="/roster/searches/new?list_partial_file=mdl_list_line_based&amp;model=Fleet%3A%3APartStockline&amp;title=Equipment+Movements+List"
                                >
                                  <span className="card-icon-icon">
                                    <i className="icon-2x fa fa-conveyor-belt-alt"></i>
                                  </span>
                                  <span className="card-icon-text">Equipment Movements List</span>
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
      </div>
    </div>
  )
}

export default FleetReports
