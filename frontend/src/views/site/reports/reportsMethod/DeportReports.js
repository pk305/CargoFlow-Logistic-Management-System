import React, { useEffect } from 'react'
import { CCard, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { useHistory } from 'react-router-dom'

const DeportReports = () => {
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
                <h4 className="report-Title">Warehouse Reports</h4>
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
                        <h6 className="card-label font-weight-bolder">Loose Warehouse Reports</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?model=Depot%3A%3AProductStock&amp;title=Product+Stock+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-boxes-alt"></i>
                              </span>
                              <span className="card-icon-text">Product Stock List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?model=Depot%3A%3AMotion&amp;title=Stock+Movements+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-th-list"></i>
                              </span>
                              <span className="card-icon-text">Stock Movements List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?model=Depot%3A%3AOrder"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-clipboard-list-check"></i>
                              </span>
                              <span className="card-icon-text">Order Actions</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=cwh_motionline_sum&amp;list_partial_file=mdl_cwh_motionline_sumlist&amp;model=Depot%3A%3AMotionline&amp;title=Total+Input%2FOutput+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-wave-square"></i>
                              </span>
                              <span className="card-icon-text">Total Input/Output</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=product_stock&amp;list_partial_file=mdl_productstocklist&amp;model=Depot%3A%3AMotionline&amp;perpage=25&amp;title=Product+Stock+List&amp;will_paginate=f"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-pallet-alt"></i>
                              </span>
                              <span className="card-icon-text">Product Stock List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=iolist&amp;list_partial_file=mdl_iolist&amp;model=Depot%3A%3AMotionline&amp;title=Warehouse+I%2FO+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-warehouse-alt"></i>
                              </span>
                              <span className="card-icon-text">Warehouse I/O List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=io_totals&amp;list_partial_file=mdl_io_totals&amp;model=Depot%3A%3AProduct&amp;search_form=depot%2Fproducts%2Fforms%2Fmdl_product_totals_form&amp;title=Total+Product+Motions"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-person-dolly"></i>
                              </span>
                              <span className="card-icon-text">Total Product Motions</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=product_aging&amp;list_partial_file=mdl_product_aging&amp;model=Depot%3A%3AProduct&amp;search_form=depot%2Fproducts%2Fforms%2Fmdl_product_totals_form&amp;title=Product+Aging+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-hand-holding-box"></i>
                              </span>
                              <span className="card-icon-text">Product Aging List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=productionlist&amp;list_partial_file=mdl_productionlist&amp;model=Depot%3A%3AMotionline&amp;title=Production+Cost+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-exchange-alt"></i>
                              </span>
                              <span className="card-icon-text">Production Cost List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="card-icon-link"
                              href="/roster/searches/new?class_method=stock_movements&amp;list_partial_file=mdl_stock_movements_list&amp;model=Depot%3A%3AMotionline&amp;title=Stock+Movements+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-exchange-alt"></i>
                              </span>
                              <span className="card-icon-text">Stock Movements List</span>
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
                        <h6 className="card-label font-weight-bolder">Warehouse Reports</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              href="/roster/searches/new?list_partial_file=mdl_stocklist&amp;model=Depot%3A%3ACwhMotion&amp;title=Warehouse+Stock+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-list-alt"></i>
                              </span>
                              <span className="card-icon-text">Warehouse Stock List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              href="/roster/searches/new?list_partial_file=mdl_iolist&amp;model=Depot%3A%3AMotionline&amp;title=Input%2FOutput+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-exchange-alt"></i>
                              </span>
                              <span className="card-icon-text">Input/Output List</span>
                            </a>
                          </div>
                        </div>

                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              href="/roster/searches/new?class_method=product&amp;list_partial_file=mdl_handlinginlist&amp;model=Depot%3A%3ACwhMotion&amp;title=Handling+In%2FOut"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-dolly-flatbed"></i>
                              </span>
                              <span className="card-icon-text">Handling In/Out</span>
                            </a>
                          </div>
                        </div>

                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              href="/roster/searches/new?class_method=customs_stock_book&amp;list_partial_file=mdl_list_stock_book&amp;model=Depot%3A%3ACwhBook&amp;title=Bounded+Warehouse+Stock+Book"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-box-up"></i>
                              </span>
                              <span className="card-icon-text">Bounded Warehouse Stock Book</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-success text-success"
                              href="/roster/searches/new?class_method=product&amp;list_partial_file=mdl_handlinginlist&amp;model=Depot%3A%3AMotionline&amp;title=Handling+In%2FOut+%28New%29"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-dolly-flatbed-alt"></i>
                              </span>
                              <span className="card-icon-text">Handling In/Out (New)</span>
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
                        <h6 className="card-label font-weight-bolder">Public Reports</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              href="/roster/searches/new?list_partial_file=mdl_shelf_stock_list&amp;model=Depot%3A%3AShelf&amp;title=Shelf+Occupancy+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-inventory"></i>
                              </span>
                              <span className="card-icon-text">Shelf Occupancy List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              href="/roster/searches/new?filter=debit_credit+%3D%3E+debit&amp;model=Financor%3A%3AInvoice&amp;search_form=financor%2Finvoices%2Fforms%2Fmdl_form_depot&amp;title=Depot+Invoices+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-receipt"></i>
                              </span>
                              <span className="card-icon-text">Depot Invoices List</span>
                            </a>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-2">
                          <div className="card-icon">
                            <a
                              className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning"
                              href="/roster/searches/new?class_method=invoice_control&amp;list_partial_file=mdl_invoice_control_list&amp;model=Depot%3A%3AFreeMotion&amp;search_form=depot%2Ffree_motions%2Fforms%2Fmdl_form_motion&amp;title=Uninvoiced+Loadings+List"
                            >
                              <span className="card-icon-icon">
                                <i className="icon-2x fa fa-receipt"></i>
                              </span>
                              <span className="card-icon-text">Uninvoiced Loadings List</span>
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

export default DeportReports
