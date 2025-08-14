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
  CDropdownDivider,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { useCallback } from 'react'
import SlidingPane from 'react-sliding-pane'
import { useDispatch, useSelector } from 'react-redux'
import { findBooking, updateLoadStatus } from 'src/redux/slices/bookingSlice'
import { toUpper } from 'lodash'
import NewTruckTrans from './panels/NewTruckTrans'

const ViewBooking = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings', active: true },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const [calloutInfo] = useState(true)
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const { showBooking } = useSelector((state) => state.booking)

  const successCreatedNotif = useCallback(() => {
    const { id } = params
    if (id) {
      async function checkBooking() {
        dispatch(findBooking(id))
      }
      checkBooking()
    }
  }, [params, dispatch])

  const handleStartPlaning = (e) => {
    e.preventDefault()
    setToggleTransPanel(true)
  }

  const closeTransPanel = (e) => {
    e.preventDefault()
    setToggleTransPanel(false)
    dispatch(updateLoadStatus({ bookingId: params.id, calloutInfo }))
  }

  useEffect(() => {
    successCreatedNotif()
  }, [successCreatedNotif])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="customHeaderContainer">
                <div className="customHeaderContainer-body">
                  <div className="symbolWrapper">
                    <span className="symbol-label">
                      <i className="fa fa-box-open icon-2x"></i>
                    </span>
                  </div>
                </div>
                <div className="customHeaderContainer-footer">
                  <div className="customMiniBar-wrapper">
                    <div className="customMiniBar-header">
                      <div className="minibar-left">
                        <span className="minbarTitle">Bookings</span>
                        <div className="minbarSubtitle">
                          <h4>{showBooking && toUpper(showBooking.receiptNo)}</h4>
                          <span className="sub"></span>
                        </div>
                      </div>
                      <div className="minibar-right">
                        <CButtonGroup role="group">
                          <CButton color="secondary" variant="outline">
                            <i className="fa fa-pen"></i> Edit
                          </CButton>
                          <CButton color="secondary" variant="outline">
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
                      <div className="minItem">
                        <i className="fa fa-info-circle icon-rt" />
                        <span className="minItem-text">Planning</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCard>
          <CRow>
            <CCol sm={12} md={12} lg={7} xl={8}>
              <CCard className="cardCustom gutter-b">
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
                  <div className="tab-content  cstTabContent">
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
                                        <CCard className="cardCustom mb-2">
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
                                                        Goods Delivered
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
                                <CCol sm={12} md={12} lg={12} xl={12}>
                                  <CCard className="cardCustom card-stretch gutter-b">
                                    <div className="card-header">
                                      <div className="toolBarContainer">
                                        <div className="card-title">
                                          <h6 className="card-label">General Information</h6>
                                        </div>
                                        <div className="card-toolbar">
                                          <CButton type="button" size="sm" color="secondary">
                                            <i className="fas fa-edit"></i>
                                          </CButton>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="card-body p-0">
                                      <div className="table-responsive">
                                        <table className="table">
                                          <tbody>
                                            <tr>
                                              <td className="font-weight-bolder">Customer</td>
                                              <td>
                                                Nueklabs
                                                <a
                                                  data-remote="true"
                                                  href="/companies/890189-nueklabs"
                                                >
                                                  <i className="fas fa-search"></i>{' '}
                                                </a>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Branch</td>
                                              <td>Head Office</td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Representative</td>
                                              <td>Kennedy Peter</td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Operation</td>
                                              <td>Road Transports Team</td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Freight Price</td>
                                              <td>
                                                0.00
                                                <span className="badge badge-default"></span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="font-weight-bolder">Product Price</td>
                                              <td>0.00</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </CCard>
                                </CCol>
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
              {showBooking && showBooking.status === 'planning' && (
                <CCard className="cardCustom gutter-b">
                  <div className="card-body p-0">
                    <div className="cardRounded bg-warning">
                      <p className="text-heading">The booking is waiting for planning</p>

                      <CButton
                        color="danger"
                        className="font-weight-bold py-2 text-white"
                        onClick={(e) => handleStartPlaning(e)}
                      >
                        Enter Haulier/Vehicle Details
                      </CButton>
                      <CDropdown>
                        <CDropdownToggle
                          color="danger"
                          className="ml-2 py-2 text-white"
                          caret={false}
                        >
                          <i className="fa fa-ellipsis-h" />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem href="#">Create new Booking</CDropdownItem>
                          <CDropdownItem href="#">Copy Booking</CDropdownItem>
                          <CDropdownDivider />
                          <CDropdownItem href="#">Go to the planning page</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>
                  </div>
                </CCard>
              )}

              <CCard className="cardCustom gutter-b">
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
                      <CNavItem>
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
                      </CNavItem>
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
                            <CButton type="submit" color="info" size="sm">
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
                        <a
                          className="btn btn-sm btn-info"
                          data-remote="true"
                          href="/s3files/new?group_id=6525502"
                        >
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
                          <a
                            className="btn btn-sm btn-info"
                            data-remote="true"
                            href="/helpdesk/todos/new?form_scope=internal&amp;group_id=6525502&amp;parent_id=921867&amp;parent_type=Logistics%3A%3ALoading"
                          >
                            New Tasks
                          </a>{' '}
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
                          <a
                            className="btn btn-sm btn-info"
                            data-remote="true"
                            href="/emails/new?group_id=6525502&amp;parent_id=921867&amp;parent_type=Logistics%3A%3ALoading"
                          >
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
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeTransPanel(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewTruckTrans setToggleTransPanel={setToggleTransPanel} loadingId={params.id} />
        </div>
      </SlidingPane>
    </div>
  )
}

export default ViewBooking
