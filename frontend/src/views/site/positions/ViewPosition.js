import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CForm,
  CButtonGroup,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CFormTextarea,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
// import { useLocation } from 'react-router-dom'
import { AppBreadcrumb } from 'src/components'
// import Noty from 'noty'
// import { useEffect } from 'react'
// import { isUndefined } from 'lodash'
// import { useCallback } from 'react'
import SlidingPane from 'react-sliding-pane'

const ViewPosition = () => {
  // const params = useParams()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings' },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road', active: true },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  // const [calloutInfo, setCalloutInfo] = useState(true)
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const [transportData, setTransportData] = useState({})

  // const successCreatedNotif = useCallback(() => {
  //   const { id } = params
  //   if (id) {
  //     const checkNotif = !isUndefined(localStorage.getItem('notif'))
  //       ? id === JSON.parse(localStorage.getItem('notif'))
  //         ? id
  //         : localStorage.setItem('notif', JSON.stringify(id))
  //       : null

  //     if (!checkNotif) {
  //       new Noty({
  //         type: 'alert',
  //         layout: 'topCenter',
  //         id: '3e-3er',
  //         text: 'Company has been created succesfully',
  //         timeout: false,
  //       }).show()
  //     }
  //   }
  // }, [params])

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setTransportData({ ...transportData, [name]: value })
  }

  // const useQuery = () => {
  //   const { pathname } = useLocation()
  //   return pathname
  //   // return useMemo(() => new URLSearchParams(search), [search])
  // }

  // let query = useQuery()

  //   useEffect(() => {
  //     // if (query) {
  //     //   return (
  //     //     <Redirect
  //     //       to={{
  //     //         pathname: '/login',
  //     //         search: '?utm=your+face',
  //     //         state: { referrer: query },
  //     //       }}
  //     //     />
  //     //   )
  //     // }
  //   }, [query])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <CCard className="cardCustom gutter-b">
                <div className="card-header">
                  <div className="customHeaderContainer">
                    <div className="customHeaderContainer-body">
                      <div className="symbolWrapper">
                        <span className="symbol-label">
                          <i className="fa fa-truck icon-2x"></i>
                        </span>
                      </div>
                    </div>
                    <div className="customHeaderContainer-footer">
                      <div className="customMiniBar-wrapper">
                        <div className="customMiniBar-header">
                          <div className="minibar-left">
                            <span className="minbarTitle">Road Freight</span>
                            <div className="minbarSubtitle">
                              <h4>TPS220000003</h4>
                              <span className="sub"></span>
                            </div>
                          </div>
                          <div className="minibar-right">
                            <CButtonGroup role="group">
                              <CButton color="secondary" variant="outline">
                                <i className="fa fa-pen"></i> Edit
                              </CButton>
                              <CButton color="secondary" variant="outline">
                                <i className="fa fa-copy"></i> Copy
                              </CButton>
                              <CButton color="secondary" variant="outline">
                                <i className="fa fa-print"></i> Print
                              </CButton>
                              <CDropdown variant="btn-group" placement="right-start">
                                <CDropdownToggle
                                  color="secondary"
                                  variant="outline"
                                  className="drop"
                                  caret={false}
                                >
                                  <i className="fa fa-ellipsis-h"></i>
                                </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem href="#">Edit</CDropdownItem>
                                  <CDropdownItem href="#">Change Status</CDropdownItem>
                                  <CDropdownItem href="#">Print</CDropdownItem>
                                  <CDropdownItem href="#">Copy</CDropdownItem>
                                  <CDropdownItem href="#">Delete</CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </CButtonGroup>
                          </div>
                        </div>
                        <div className="customMiniBar-body">
                          <div className="minItem">
                            <i className="fa fa-info-circle icon-rt" />
                            <span className="minItem-text">Planning</span>
                          </div>
                          <div className="minItem">
                            <i className="fa fa-users icon-rt" />
                            <span className="minItem-text">Kennedy Peter</span>
                          </div>
                          <div className="minItem">
                            <i className="fa fa-map-marker-alt icon-rt" />
                            <span className="minItem-text">Head Office</span>
                          </div>
                          <div className="minItem">
                            <i className="fa fa-calendar-alt icon-rt" />
                            <span className="minItem-text">29.01.2022 17:19</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CCardBody className="p-0">
                  <div className="pageContainer-wrapper">
                    {/* <CRow className="pageBoxSizing-container">
                    d
                  </CRow> */}
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </div>
          <CRow>
            <CCol sm={12} md={12} lg={7} xl={8}>
              <CCard className="cardCustom gutter-b cardStretch">
                <div className="card-header cstHeaderTabs-line">
                  <div className="cstHeaderNav">
                    <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                      <CNavItem>
                        <CNavLink href="#loading_details" active>
                          <span className="nav-icon">
                            <i className="fa fa-layer-group ico"></i>
                          </span>
                          <span className="nav-text">Overview</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-icon">
                            <i className="fa fa-file-invoice-dollar ico"></i>
                          </span>
                          <span className="nav-text">Financials</span>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  </div>
                </div>
                <CCardBody className="p-3">
                  <div className="tab-content cstTabContent">
                    <div className="tab-pane fade show active" role="tabpanel">
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="loading_details"
                          role="tabpanel"
                          aria-labelledby="loading_details"
                        >
                          <CRow>
                            <CCol sm={12} md={12} lg={12} xl={12}>
                              <div
                                id="position_details"
                                className="tab-pane active"
                                role="tabpanel"
                              >
                                <div
                                  className="panel panel-transparent"
                                  style={{ marginBottom: '0px' }}
                                >
                                  <div className="panel-body">
                                    <CRow>
                                      <CCol sm={12} md={12} lg={12} xl={12}>
                                        <CCard className="cardCustom mb-3">
                                          <div className="card-body p-0">
                                            <div
                                              className="wizard wizard-1"
                                              id="kt_wizard"
                                              data-wizard-state="first"
                                              data-wizard-clickable="false"
                                            >
                                              <div className="wizard-nav">
                                                <div className="wizard-steps p-2">
                                                  <div
                                                    className="wizard-step"
                                                    data-wizard-type="step"
                                                    data-wizard-state="current"
                                                  >
                                                    <div className="wizard-label">
                                                      <i className="far fa-clock icon-md wizard-icon"></i>
                                                      <h3 className="wizard-title">Planning</h3>
                                                      <span className="text-dark-25"></span>
                                                    </div>
                                                    <span className="wizard-arrow">
                                                      <i className="fa fa-arrow-right"></i>
                                                    </span>
                                                  </div>
                                                  <div
                                                    className="wizard-step"
                                                    data-wizard-type="step"
                                                    data-wizard-state="disabled"
                                                  >
                                                    <div className="wizard-label">
                                                      <i className="fa fa-truck icon-md wizard-icon"></i>
                                                      <h3 className="wizard-title">In Transit</h3>
                                                      <span className="text-dark-25"></span>
                                                    </div>
                                                    <span className="wizard-arrow">
                                                      <i className="fa fa-arrow-right"></i>
                                                    </span>
                                                  </div>
                                                  <div
                                                    className="wizard-step"
                                                    data-wizard-type="step"
                                                    data-wizard-state="disabled"
                                                  >
                                                    <div className="wizard-label">
                                                      <i className="far fa-check-circle icon-md wizard-icon"></i>
                                                      <h3 className="wizard-title">
                                                        Completed / Delivered
                                                      </h3>
                                                      <span className="text-dark-25"></span>
                                                    </div>
                                                    <span className="wizard-arrow">
                                                      <i className="fa fa-arrow-right"></i>
                                                    </span>
                                                  </div>
                                                  <div
                                                    className="wizard-step"
                                                    data-wizard-type="step"
                                                    data-wizard-state="disabled"
                                                  >
                                                    <div className="wizard-label">
                                                      <i className="fa fa-trash icon-md wizard-icon"></i>
                                                      <h3 className="wizard-title">Cancelled</h3>
                                                      <span className="text-dark-25"></span>
                                                    </div>
                                                    <span className="wizard-arrow">
                                                      <i className="fa fa-arrow-right"></i>
                                                    </span>
                                                  </div>
                                                  <div
                                                    className="wizard-step"
                                                    data-wizard-type="step"
                                                    data-wizard-state="disabled"
                                                  >
                                                    <div className="wizard-label">
                                                      <i className="fa fa-clipboard-list icon-md wizard-icon"></i>
                                                      <h3 className="wizard-title">Archived</h3>
                                                      <span className="text-dark-25"></span>
                                                    </div>
                                                    <span className="wizard-arrow">
                                                      <i className="fa fa-arrow-right"></i>
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </CCard>
                                      </CCol>
                                    </CRow>
                                  </div>
                                </div>
                              </div>
                            </CCol>
                            <CCol sm={12} md={12} lg={12} xl={12}>
                              <CRow>
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-slide-6">
                                  <CCard className="cardCustom  cardStretch">
                                    <div className="card-header py-1">
                                      <div className="card-title">
                                        <h6 className="card-label font-weight-bolder text-dark">
                                          General Information
                                        </h6>
                                      </div>
                                    </div>
                                    <div className="card-body">
                                      <div className="table-responsive">
                                        <table className="table">
                                          <tbody>
                                            <tr>
                                              <td className="font-weight-bolder">
                                                Truck &amp; Romork No
                                              </td>
                                              <td>
                                                FR434HU{' '}
                                                <a href="/vehicles/14777" data-remote="true">
                                                  <i className="fa fa-search"></i>
                                                </a>
                                                <span className="badge badge-default">
                                                  Contracted Vehicle
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Operation</td>
                                              <td>Road Transports Team</td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Operator</td>
                                              <td>Kennedy Peter</td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Booking Ref.</td>
                                              <td>
                                                <span>
                                                  REF-74949
                                                  <button
                                                    type="button"
                                                    className="btn copy_text_button"
                                                  >
                                                    <i className="fas fa-copy"></i>
                                                  </button>
                                                </span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">
                                                Supplier Company
                                              </td>
                                              <td>Nueklabs Logistics</td>
                                            </tr>
                                          </tbody>
                                          {/* <tfoot>
                                            <tr>
                                              <td colSpan="2"></td>
                                            </tr>
                                          </tfoot> */}
                                        </table>
                                      </div>
                                    </div>
                                  </CCard>
                                </div>
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-slide-6">
                                  <CCard className="cardCustom  cardStretch">
                                    <div className="card-header py-1">
                                      <div className="card-title">
                                        <h6 className="card-label font-weight-bolder text-dark">
                                          Collection Points
                                        </h6>
                                      </div>
                                    </div>
                                    <div className="card-body">
                                      <div className="table-responsive">
                                        <table className="table">
                                          <tbody>
                                            <tr>
                                              <td className="font-weight-bolder">Departure</td>
                                              <td> / Andorra</td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Load Customs</td>
                                              <td>
                                                <a
                                                  data-remote="true"
                                                  href="/positions/697077-tps220000004/edit?scope=transit"
                                                >
                                                  Change
                                                </a>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Arrival</td>
                                              <td> / Antigua and Barbuda</td>
                                            </tr>
                                            <tr>
                                              <td style={{ width: '150px' }}>
                                                <strong>Unload Customs</strong>
                                              </td>
                                              <td>
                                                <a
                                                  data-remote="true"
                                                  href="/positions/697077-tps220000004/edit?scope=untransit"
                                                >
                                                  Change
                                                </a>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Tags</td>
                                              <td></td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Customs Border</td>
                                              <td></td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Border Date</td>
                                              <td></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </CCard>
                                </div>

                                {/*  */}
                              </CRow>
                            </CCol>
                          </CRow>
                        </div>
                        <div
                          className="tab-pane fade show"
                          id="loading_financial"
                          role="tabpanel"
                          aria-labelledby="loading_financial"
                        >
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                              ddd
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={12} md={12} lg={5} xl={4}>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                  <CCard className="cardCustom gutter-b cardStretch">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="cstHeaderNav">
                        <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                          <CNavItem>
                            <CNavLink href="#loading_details" active>
                              <span className="nav-icon">
                                <i className="fa fa-share-alt ico"></i>
                              </span>
                              <span className="nav-text">Share</span>
                            </CNavLink>
                          </CNavItem>
                          {/* <CNavItem>
                            <CNavLink href="#loading_financial">
                              <span className="nav-icon">
                                <i className="far fa-copy ico"></i>
                              </span>
                              <span className="nav-text">Documents</span>
                            </CNavLink>
                          </CNavItem>
                          <CNavItem>
                            <CNavLink href="#loading_financial">
                              <span className="nav-icon">
                                <i className="fa fa-tasks ico"></i>
                              </span>
                              <span className="nav-text">Tasks</span>
                            </CNavLink>
                          </CNavItem>
                          <CNavItem>
                            <CNavLink href="#loading_financial">
                              <span className="nav-icon">
                                <i className="far fa-envelope ico"></i>
                              </span>
                              <span className="nav-text">Mails</span>
                            </CNavLink>
                          </CNavItem> */}
                        </CNav>
                      </div>
                    </div>
                    <CCardBody>
                      <div className="card-scroll tab-content " id="group_6525502_content">
                        <div
                          className="tab-pane fade show active"
                          id="group_timeline_6525502"
                          role="tabpanel"
                          aria-labelledby="group_timeline"
                        >
                          <div id="new_group_post" className="border-bottom">
                            <CForm
                              className="simple_form new_post"
                              id="new_post"
                              noValidate="novalidate"
                              action="/posts"
                              acceptCharset="UTF-8"
                              data-remote="true"
                              method="post"
                            >
                              <div className="form-group text required post_message">
                                <CFormTextarea
                                  className="form-control-cst user-share-input"
                                  data-behavior="mentions"
                                  placeholder="Share notes with your teammates about this record"
                                  name="post[message]"
                                  id="post_message"
                                  style={{ minHeight: '36px' }}
                                ></CFormTextarea>
                              </div>
                              <div className="form-group hidden post_group_id">
                                <input
                                  className="form-control hidden"
                                  value="6525502"
                                  type="hidden"
                                  name="post[group_id]"
                                  id="post_group_id"
                                />
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="form-group select optional post_is_private">
                                  <CFormSelect
                                    className="form-control-cst"
                                    name="post[is_private]"
                                    id="post_is_private"
                                    style={{
                                      textAlign: 'start',
                                      marginRight: '21px',
                                      paddingRight: '9px',
                                      paddingLeft: '9px',
                                    }}
                                  >
                                    <option value="public">Everybody</option>
                                    <option value="private">Only Me</option>
                                    <option value="team">Only My Team</option>
                                  </CFormSelect>
                                </div>

                                <CButton
                                  type="button"
                                  color="info"
                                  size="sm"
                                  className="text-white"
                                >
                                  Share
                                </CButton>
                              </div>
                            </CForm>
                          </div>
                          <div id="user_3835_posts"></div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="group_documents_6525502"
                          role="tabpanel"
                          aria-labelledby="group_documents"
                        >
                          <div className="mb-4">
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className="btn btn-sm btn-info" data-remote="true" href="#">
                              Add Document
                            </a>
                          </div>
                          <div id="group_6525502_documents_list">
                            <div id="nimbos-group_6525502_docfiles"></div>
                            <div id="group_6525502_s3files" className="s3files_list"></div>
                          </div>
                        </div>

                        <div
                          className="tab-pane fade"
                          id="group_todos_6525502"
                          role="tabpanel"
                          aria-labelledby="group_todos"
                        >
                          <div id="group_6525502_todos_list">
                            <div className="mb-4">
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a className="btn btn-sm btn-info" href="#">
                                New Tasks
                              </a>
                            </div>
                            <div id="group_6525502_todos" className="table-responsive">
                              <div className="table-responsive mb-2">
                                <table id="todos_list_table" className="table">
                                  <tbody id="todos_list_tbody"></tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="group_emails_6525502"
                          role="tabpanel"
                          aria-labelledby="group_emails"
                        >
                          <div id="group_6525502_emails_list">
                            <div className="mb-4">
                              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                              <a className="btn btn-sm btn-info" data-remote="true" href="#">
                                New Mail
                              </a>{' '}
                            </div>
                            <div id="group_6525502_emails" className="table-responsive">
                              <div className="table-responsive table-truncate">
                                <table className="table table-vertical-center">
                                  <tbody></tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                  <CCard className="cardCustom gutter-b cardStretch compact">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Timeline</h6>
                            </div>
                          </div>
                        </div>
                        <div className="customHeaderToolbar">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            className="btn btn-icon btn-sm btn-success"
                            data-remote="true"
                            href="#"
                          >
                            <i className="fa fa-plus"></i>
                          </a>
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            className="btn btn-icon btn-sm btn-info ml-2"
                            data-remote="true"
                            href="#"
                          >
                            <i className="fa fa-share-alt"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body  min-h-300px">
                      <div className="card-scroll timeline timeline-5 ">
                        <div id="timelines_list" className="timeline-items"></div>
                      </div>
                    </div>
                  </CCard>
                </div>
              </div>
            </CCol>
          </CRow>
        </div>
      </div>
      {/* */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={toggleTransPanel}
        title={
          <div className="space">
            <div>
              <span>Truck Transport</span>
            </div>
            <div>
              {/* eslint-disable-next-line */}
              <a href="#" onClick={() => setToggleTransPanel(false)}>
                x
              </a>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <div className="card cardCustom gutter-b">
            <div className="card-body p-6">
              <form
                className="simple_form horizontal-form"
                id="new_position"
                noValidate="novalidate"
                action="/positions"
                acceptCharset="UTF-8"
                data-remote="true"
                method="post"
              >
                <div className="row">
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_contract_type">
                      <label
                        className="control-label select optional"
                        htmlFor="position_contract_type"
                      >
                        Contract
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[contract_type]"
                        id="position_contract_type"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="owned">Our Own Vehicle</option>
                        <option value="rented">Contracted Vehicle</option>
                        <option value="unknown">Vehicle Not-Specified</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group string optional position_extref">
                      <label className="control-label string optional" htmlFor="position_extref">
                        Booking Ref.
                      </label>
                      <input
                        className="form-control string optional"
                        type="text"
                        name="position[extref]"
                        id="position_extref"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group boolean optional position_empty_truck">
                      <label className="boolean optional" htmlFor="position_empty_truck">
                        Empty Trailer ?
                      </label>
                      <div className="checkbox-custom checkbox-primary">
                        <input name="position[empty_truck]" type="hidden" value="0" />
                        <input
                          className="boolean optional"
                          type="checkbox"
                          value="1"
                          name="position[empty_truck]"
                          id="position_empty_truck"
                          onClick={(e) => handleChangeForm(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_operation_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_operation_id"
                      >
                        Operation
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[operation_id]"
                        id="position_operation_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="6638">Road Transports Team</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_operator_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_operator_id"
                      >
                        Operator
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control is-valid select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[operator_id]"
                            id="position_operator_id"
                            data-select2-id="position_operator_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="3835" data-select2-id="2">
                              Kennedy Peter
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_branch_id">
                      <label className="control-label select optional" htmlFor="position_branch_id">
                        Branch
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[branch_id]"
                        id="position_branch_id"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="1380">Head Office</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="rented hide">
                  <div className="row">
                    <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_vessel_code">
                        <label
                          className="control-label string optional"
                          htmlFor="position_vessel_code"
                        >
                          Trailer
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[vessel_code]"
                          id="position_vessel_code"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_truck_code">
                        <label
                          className="control-label string optional"
                          htmlFor="position_truck_code"
                        >
                          2.Transport Means
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[truck_code]"
                          id="position_truck_code"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select optional position_truck_type">
                        <label
                          className="control-label select optional"
                          htmlFor="position_truck_type"
                        >
                          Truck Type
                        </label>
                        <select
                          className="form-control select optional"
                          name="position[truck_type]"
                          id="position_truck_type"
                          onClick={(e) => handleChangeForm(e)}
                        >
                          <option value=""></option>
                          <option value="trailer">Trailer</option>
                          <option value="truck">Truck</option>
                          <option value="lorry">Lorry</option>
                          <option value="van">Van</option>
                          <option value="forklift">Forklift</option>
                          <option value="bus">Bus</option>
                          <option value="car">Otomobile</option>
                          <option value="tanker">Tanker</option>
                          <option value="tractor">Tractor</option>
                          <option value="romork">Römork</option>
                          <option value="crane">Crane</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="container">Container</option>
                          <option value="wagon">Wagon</option>
                          <option value="swapbody">swapbody</option>
                          <option value="minivan">Minivan</option>
                          <option value="frigo">Frigo</option>
                          <option value="flatbed">flatbed</option>
                          <option value="tarpaulin_truck">tarpaulin_truck</option>
                          <option value="box_container">box_container</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_driver_name">
                        <label
                          className="control-label string optional"
                          htmlFor="position_driver_name"
                        >
                          Driver Name
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[driver_name]"
                          id="position_driver_name"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group string optional position_driver_tel">
                        <label
                          className="control-label string optional"
                          htmlFor="position_driver_tel"
                        >
                          Driver Phone
                        </label>
                        <input
                          className="form-control string optional"
                          type="text"
                          name="position[driver_tel]"
                          id="position_driver_tel"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group company optional position_supplier_id">
                        <label
                          className="control-label company optional"
                          htmlFor="position_supplier_id"
                        >
                          Supplier Company
                        </label>
                        <div>
                          <div className="input-group">
                            <select
                              className="form-control company-select select2-hidden-accessible"
                              name="position[supplier_id]"
                              id="position_supplier_id"
                              data-select2-id="position_supplier_id"
                              tabIndex="-1"
                              aria-hidden="true"
                              onClick={(e) => handleChangeForm(e)}
                            >
                              <option value="" data-select2-id="17"></option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group decimal optional position_freight_price">
                        <label
                          className="control-label decimal optional"
                          htmlFor="position_freight_price"
                        >
                          Freight Price
                        </label>
                        <input
                          className="form-control numeric decimal optional"
                          type="number"
                          step="any"
                          value="0.0"
                          name="position[freight_price]"
                          id="position_freight_price"
                          onClick={(e) => handleChangeForm(e)}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                      <div className="form-group select optional position_freight_curr">
                        <label
                          className="control-label select optional"
                          htmlFor="position_freight_curr"
                        >
                          Currency
                        </label>
                        <select
                          className="form-control select optional"
                          name="position[freight_curr]"
                          id="position_freight_curr"
                          onClick={(e) => handleChangeForm(e)}
                        >
                          <option value=""></option>
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="CHF">CHF</option>
                          <option value="CAD">CAD</option>
                          <option value="CZK">CZK</option>
                          <option value="SEK">SEK</option>
                          <option value="PLN">PLN</option>
                          <option value="NOK">NOK</option>
                          <option value="AUD">AUD</option>
                          <option value="DKK">DKK</option>
                          <option value="KWD">KWD</option>
                          <option value="SAR">SAR</option>
                          <option value="RON">RON</option>
                          <option value="BGN">BGN</option>
                          <option value="RUB">RUB</option>
                          <option value="PKR">PKR</option>
                          <option value="CNY">CNY</option>
                          <option value="IRR">IRR</option>
                          <option value="JPY">JPY</option>
                          <option value="SGD">SGD</option>
                          <option value="AZN">AZN</option>
                          <option value="AED">AED</option>
                          <option value="HKD">HKD</option>
                          <option value="HUF">HUF</option>
                          <option value="MKD">MKD</option>
                          <option value="MYR">MYR</option>
                          <option value="KRW">KRW</option>
                          <option value="INR">INR</option>
                          <option value="XAU">XAU</option>
                          <option value="XAG">XAG</option>
                          <option value="XPT">XPT</option>
                          <option value="ZAR">ZAR</option>
                          <option value="VND">VND</option>
                          <option value="GEL">GEL</option>
                          <option value="GBP">GBP</option>
                          <option value="TRY">TRY</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="owned row">
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group vehicle optional position_vessel_id">
                      <label
                        className="control-label vehicle optional"
                        htmlFor="position_vessel_id"
                      >
                        Trailer
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control vehicle-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Fleet::Vehicle&amp;truck_type=vessel"
                            data-newurl="/vehicles/new"
                            name="position[vessel_id]"
                            id="position_vessel_id"
                            data-select2-id="position_vessel_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="19"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group vehicle optional position_truck_id">
                      <label className="control-label vehicle optional" htmlFor="position_truck_id">
                        Tractor Unit
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control vehicle-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Fleet::Vehicle&amp;truck_type=truck"
                            name="position[truck_id]"
                            id="position_truck_id"
                            data-select2-id="position_truck_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="21"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group driver optional position_driver_id">
                      <label className="control-label driver optional" htmlFor="position_driver_id">
                        Driver
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control driver-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Fleet::Driver"
                            name="position[driver_id]"
                            id="position_driver_id"
                            data-select2-id="position_driver_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="23"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group integer optional position_dep_odemeter">
                          <label
                            className="control-label integer optional"
                            htmlFor="position_dep_odemeter"
                          >
                            Departure Km
                          </label>
                          <input
                            className="form-control numeric integer optional"
                            type="number"
                            step="1"
                            value="0"
                            name="position[dep_odemeter]"
                            id="position_dep_odemeter"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group integer optional position_arv_odemeter">
                          <label
                            className="control-label integer optional"
                            htmlFor="position_arv_odemeter"
                          >
                            Arrival Km
                          </label>
                          <input
                            className="form-control numeric integer optional"
                            type="number"
                            step="1"
                            value="0"
                            name="position[arv_odemeter]"
                            id="position_arv_odemeter"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group decimal optional position_total_fuel">
                          <label
                            className="control-label decimal optional"
                            htmlFor="position_total_fuel"
                          >
                            Total Fuel
                          </label>
                          <input
                            className="form-control numeric decimal optional"
                            type="number"
                            step="any"
                            value="0.0"
                            name="position[total_fuel]"
                            id="position_total_fuel"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group decimal optional position_driver_payment">
                          <label
                            className="control-label decimal optional"
                            htmlFor="position_driver_payment"
                          >
                            Travel Payment
                          </label>
                          <input
                            className="form-control numeric decimal optional"
                            type="number"
                            step="any"
                            value="0.0"
                            name="position[driver_payment]"
                            id="position_driver_payment"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_status">
                      <label className="control-label select optional" htmlFor="position_status">
                        Status
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[status]"
                        id="position_status"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="planning">Planning</option>
                        <option value="active">In Transit</option>
                        <option value="delivered">Completed / Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_waybill_type">
                      <label
                        className="control-label select optional"
                        htmlFor="position_waybill_type"
                      >
                        Transit Type
                      </label>
                      <select
                        className="form-control select optional"
                        name="position[waybill_type]"
                        id="position_waybill_type"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                        <option value="t1">T1/T2</option>
                        <option value="tir_karnesi">Truck Report Card</option>
                        <option value="irsaliye">Waybill</option>
                        <option value="ata_belgesi">ATA Certificate</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group string optional position_waybill_no">
                      <label
                        className="control-label string optional"
                        htmlFor="position_waybill_no"
                      >
                        Transit Doc. No
                      </label>
                      <input
                        className="form-control string optional"
                        type="text"
                        name="position[waybill_no]"
                        id="position_waybill_no"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group date_picker optional position_waybill_date">
                      <label
                        className="control-label date_picker optional"
                        htmlFor="position_waybill_date"
                      >
                        Transit Doc. Date
                      </label>
                      <input
                        className="form-control string date_picker optional flatpickr-input"
                        type="hidden"
                        data-plugin="datepicker"
                        name="position[waybill_date]"
                        id="position_waybill_date"
                      />
                      <input
                        className="form-control string date_picker optional form-control input"
                        placeholder=""
                        tabIndex="0"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2"></div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_project_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_project_id"
                      >
                        Project
                      </label>
                      <select
                        className="form-control select optional select2-hidden-accessible"
                        data-plugin="select2"
                        name="position[project_id]"
                        id="position_project_id"
                        data-select2-id="position_project_id"
                        tabIndex="-1"
                        aria-hidden="true"
                        onClick={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="5"></option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group hidden position_loading_id">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    name="position[loading_id]"
                    id="position_loading_id"
                  />
                </div>
                <div className="form-group hidden position_loading_ids">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    value="869649"
                    name="position[loading_ids]"
                    id="position_loading_ids"
                    onClick={(e) => handleChangeForm(e)}
                  />
                </div>
                <div className="form-group hidden position_trans_method">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    value="road"
                    name="position[trans_method]"
                    id="position_trans_method"
                  />
                </div>
                <div className="form-group hidden position_ref_position_id">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    name="position[ref_position_id]"
                    id="position_ref_position_id"
                  />
                </div>
                <div className="form-group hidden position_ref_loading_ids">
                  <input
                    className="form-control hidden"
                    type="hidden"
                    name="position[ref_loading_ids]"
                    id="position_ref_loading_ids"
                  />
                </div>

                <hr />
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
                      Departure &amp; Arrival Ports
                    </h4>
                  </div>
                </div>
                <div className="row" id="departure_partial">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group datetime_picker optional position_departure_date">
                      <label
                        className="control-label datetime_picker optional"
                        htmlFor="position_departure_date"
                      >
                        Departure Date
                      </label>
                      <input
                        className="form-control string datetime_picker optional flatpickr-input"
                        type="hidden"
                        data-plugin="datetimepicker"
                        value="2022-02-03 00:00"
                        name="position[departure_date]"
                        id="position_departure_date"
                        onClick={(e) => handleChangeForm(e)}
                      />
                      <input
                        className="form-control string datetime_picker optional form-control input"
                        placeholder=""
                        tabIndex="0"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group string optional position_dep_place_name">
                      <label
                        className="control-label string optional"
                        htmlFor="position_dep_place_name"
                      >
                        Departure Place
                      </label>
                      <div>
                        <div className="input-group">
                          <input
                            className="form-control string optional"
                            onClick={(e) => handleChangeForm(e)}
                            value=""
                            name="position[dep_place_name]"
                            id="position_dep_place_name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                    <div className="form-group city optional position_dep_city_id">
                      <label className="control-label city optional" htmlFor="position_dep_city_id">
                        Departure City
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control chosen_input city-select select2-hidden-accessible"
                            onClick={(e) => handleChangeForm(e)}
                            name="position[dep_city_id]"
                            id="position_dep_city_id"
                            data-select2-id="position_dep_city_id"
                            tabIndex="-1"
                            aria-hidden="true"
                          >
                            <option value="0" data-select2-id="25"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_dep_country_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_dep_country_id"
                      >
                        Collection Country
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control is-valid select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[dep_country_id]"
                            id="position_dep_country_id"
                            data-select2-id="position_dep_country_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="+3">+3-CIBUTI</option>

                            <option value="ZZ">ZZ-NAHÇIVAN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row" id="arrival_partial">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group datetime_picker optional position_arrival_date">
                      <label
                        className="control-label datetime_picker optional"
                        htmlFor="position_arrival_date"
                      >
                        Arrival Date
                      </label>
                      <input
                        className="form-control string datetime_picker optional flatpickr-input"
                        type="hidden"
                        data-plugin="datetimepicker"
                        value="2022-02-13 00:00"
                        name="position[arrival_date]"
                        id="position_arrival_date"
                        onClick={(e) => handleChangeForm(e)}
                      />
                      <input
                        className="form-control string datetime_picker optional form-control input"
                        placeholder=""
                        tabIndex="0"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group string optional position_arv_place_name">
                      <label
                        className="control-label string optional"
                        htmlFor="position_arv_place_name"
                      >
                        Arrival Place
                      </label>
                      <div>
                        <div className="input-group">
                          <input
                            className="form-control is-valid string optional"
                            data-place-city="#position_arv_city"
                            data-place-country="#position_arv_country_id"
                            data-place-type="#position_arv_place_type"
                            data-place-id="#position_arv_place_id"
                            data-plugin="typeahead-place"
                            type="text"
                            value="w"
                            name="position[arv_place_name]"
                            id="position_arv_place_name"
                            onClick={(e) => handleChangeForm(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                    <div className="form-group city optional position_arv_city_id">
                      <label className="control-label city optional" htmlFor="position_arv_city_id">
                        Arrival City
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control chosen_input city-select select2-hidden-accessible"
                            data-url="/roster/autocompletes.json?model=Nimbos::City"
                            data-newurl="/cities/new"
                            data-placeholder=""
                            data-country_id="position_arv_country_id"
                            data-address-role=""
                            data-plugin="lookup"
                            name="position[arv_city_id]"
                            id="position_arv_city_id"
                            data-select2-id="position_arv_city_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="28"></option>
                            <option value="27386" data-select2-id="29">
                              MOMBASA
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_arv_country_id">
                      <label
                        className="control-label select optional"
                        htmlFor="position_arv_country_id"
                      >
                        Delivery Country
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control is-valid select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[arv_country_id]"
                            id="position_arv_country_id"
                            data-select2-id="position_arv_country_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value=""></option>
                            <option value="+3">+3-CIBUTI</option>
                            <option value="AA">AA-N/A</option>
                            <option value="AD">AD-ANDORRA</option>
                            <option value="YT">YT-MAYOTTE</option>
                            <option value="ZA">ZA-SOUTH AFRICA</option>
                            <option value="ZM">ZM-ZAMBIA</option>
                            <option value="ZW">ZW-ZIMBABWE</option>
                            <option value="ZZ">ZZ-NAHÇIVAN</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group select optional position_route_id">
                      <label className="control-label select optional" htmlFor="position_route_id">
                        Route
                      </label>
                      <div>
                        <div className="input-group">
                          <select
                            className="form-control select optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="position[route_id]"
                            id="position_route_id"
                            data-select2-id="position_route_id"
                            tabIndex="-1"
                            aria-hidden="true"
                            onClick={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="14"></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group string optional position_route_notes">
                      <label
                        className="control-label string optional"
                        htmlFor="position_route_notes"
                      >
                        Route Notes
                      </label>
                      <input
                        className="form-control string optional"
                        type="text"
                        name="position[route_notes]"
                        id="position_route_notes"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                    <div className="form-group decimal optional position_route_km">
                      <label className="control-label decimal optional" htmlFor="position_route_km">
                        Route Km
                      </label>
                      <input
                        className="form-control numeric decimal optional"
                        type="number"
                        step="any"
                        value="0.0"
                        name="position[route_km]"
                        id="position_route_km"
                        onClick={(e) => handleChangeForm(e)}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group text optional position_notes">
                      <label className="control-label text optional" htmlFor="position_notes">
                        Notes
                      </label>
                      <textarea
                        className="form-control text optional"
                        rows="1"
                        name="position[notes]"
                        id="position_notes"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="slide-pane__footer">
          <div className="float-right">
            <CButton color="primary" className="mr-2">
              Save
            </CButton>
          </div>
        </div>
      </SlidingPane>
    </div>
  )
}

export default ViewPosition
