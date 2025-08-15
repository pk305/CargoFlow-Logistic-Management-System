import React, { useEffect, useState } from 'react'
import {
  CCard,
  CRow,
  CListGroup,
  CListGroupItem,
  CBadge,
  CButton,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModal,
} from '@coreui/react'
import searchResultImage from 'src/assets/images/dashboard/search-result.png'
import { useSelector } from 'react-redux'
import defaultAvatar from 'src/assets/images/avatars/defaultAvatar.png'
import { isNull } from 'lodash'

const Tickets = () => {
  const { authUser } = useSelector((state) => state.auth)
  const [ticketModal, setTicketModal] = useState(false)

  const closeTicketModal = () => {
    setTicketModal(false)
  }

  const handleSubmitTicket = (e) => {
    e.preventDefault()
    setTicketModal(false)
  }

  const handleSetTicket = (e) => {
    e.preventDefault()
    setTicketModal(true)
  }

  useEffect(() => {
    document.title = 'CargoFlow TMS'
  }, [])

  return (
    <div>
      <div className="rawWrapper-container mt-3">
        <div className="pageContainer">
          <div className="container-fluid">
            <div className="d-block"></div>
            <CRow>
              <div className="col-12 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-3">
                <CCard className="cardCustom gutter-b">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="symbol-wrap s-40">
                          {/* authUser */}
                          {authUser && !isNull(authUser.avatar) ? (
                            <img
                              width="30"
                              height="30"
                              className="object-cover"
                              title={authUser.name}
                              alt=""
                              src={authUser.avatar}
                            />
                          ) : (
                            <img className="object-cover" src={defaultAvatar} alt="" />
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <span
                          className="text-dark font-weight-bolder"
                          style={{ fontSize: '1.08rem', marginLeft: '.3rem' }}
                        >
                          {authUser && authUser.name}
                        </span>
                        <span className="text-muted font-weight-bold"></span>
                      </div>
                    </div>
                    <CListGroup className="nav-tickets">
                      <div className="separator"></div>
                      <CListGroupItem>
                        <a className="" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="far fa-clock"></i>
                            </span>
                            <span className="nav-text font-weight-bolder ml-2">Pending Todos</span>
                          </div>
                          <CBadge color="secondary" shape="rounded-pill">
                            0
                          </CBadge>
                        </a>
                      </CListGroupItem>
                      <CListGroupItem>
                        <a className="" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="fa fa-ruler"></i>
                            </span>
                            <span className="nav-text font-weight-bolder  ml-2">Testing Todos</span>
                          </div>
                          <CBadge color="secondary" shape="rounded-pill">
                            0
                          </CBadge>
                        </a>
                      </CListGroupItem>
                      <CListGroupItem>
                        <a className="" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="far fa-question-circle"></i>
                            </span>
                            <span className="nav-text font-weight-bolder ml-2">Backlog Todos</span>
                          </div>
                          <CBadge color="secondary" shape="rounded-pill">
                            1
                          </CBadge>
                        </a>
                      </CListGroupItem>
                      <CListGroupItem>
                        <a className="" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="far fa-square"></i>
                            </span>
                            <span className="nav-text font-weight-bolder ml-2">
                              Waiting Detailed Analysis Todos
                            </span>
                          </div>
                          <CBadge color="secondary" shape="rounded-pill">
                            1
                          </CBadge>
                        </a>
                      </CListGroupItem>
                      <CListGroupItem>
                        <a className="" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="far fa-check-circle"></i>
                            </span>
                            <span className="nav-text font-weight-bolder ml-2">Closed Todos</span>
                          </div>
                          <CBadge color="secondary" shape="rounded-pill">
                            1
                          </CBadge>
                        </a>
                      </CListGroupItem>
                      <CListGroupItem>
                        <a className="" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="far fa-times-circle"></i>
                            </span>
                            <span className="nav-text font-weight-bolder ml-2">Rejected Todos</span>
                          </div>
                          <CBadge color="secondary" shape="rounded-pill">
                            1
                          </CBadge>
                        </a>
                      </CListGroupItem>
                    </CListGroup>
                  </div>
                </CCard>
              </div>
              <div className="col-12 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-9">
                <div className="tickets-menu-container">
                  <CCard className="cardCustom h-100">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer p-2">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              {/* <h6 className="card-label"></h6> */}
                            </div>
                          </div>
                        </div>
                        <div className="customHeaderToolbar">
                          <CButton
                            color="primary"
                            variant="ghost"
                            onClick={(e) => handleSetTicket(e)}
                          >
                            <i className="fa fa-plus"></i> New Ticket
                          </CButton>
                        </div>
                      </div>
                    </div>
                    <div className="card-body h-100">
                      <div className="tab-content">
                        <div
                          className="tab-pane fade active show"
                          id="pending"
                          role="tabpanel"
                          aria-labelledby="pending"
                        >
                          <div className="table-responsive">
                            <div className="no-results">
                              <img src={searchResultImage} alt="" />
                              <div className="no-results-text">
                                <h6 className="no-results-title">
                                  You don&apos;t have any pending requests.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>

                        {/*  */}
                        <div
                          className="tab-pane fade"
                          id="testable"
                          role="tabpanel"
                          aria-labelledby="testable"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img src={searchResultImage} alt="" />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  You have no request during the test phase.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="backlog"
                          role="tabpanel"
                          aria-labelledby="backlog"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img src={searchResultImage} alt="" />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  You do not have any suspended request.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="waitlist"
                          role="tabpanel"
                          aria-labelledby="waitlist"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img src={searchResultImage} alt="" />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  You have no requests to analyze.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="closed"
                          role="tabpanel"
                          aria-labelledby="closed"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img src={searchResultImage} alt="" />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  You have no requests to closed.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="rejected"
                          role="tabpanel"
                          aria-labelledby="rejected"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img src={searchResultImage} alt="" />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  You have no requests to completed.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="blog"
                          role="tabpanel"
                          aria-labelledby="blog"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img
                                src="https://res.cloudinary.com/nimbo/image/upload/v1608627379/modaltrans/marketing/announcements-result.png"
                                alt=""
                              />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  You have no published blog posts.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="lean_coffee"
                          role="tabpanel"
                          aria-labelledby="lean_coffee"
                        >
                          <div className="table-responsive">
                            <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                              <img
                                src="https://res.cloudinary.com/nimbo/image/upload/v1608627165/modaltrans/marketing/meeting-result.png"
                                alt=""
                              />
                              <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                                <h6 className="text-dark text-center font-size-h5 mb-3">
                                  you have never organized a meeting.
                                </h6>
                              </div>
                            </div>
                            <table className="table">
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CCard>
                </div>
              </div>
            </CRow>
          </div>
        </div>
      </div>

      {/* task modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        size="lg"
        transition={false}
        visible={ticketModal}
        onClose={() => closeTicketModal()}
      >
        <CModalHeader>
          <CModalTitle>New Ticket</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="form-group todo_todo_text">
                <label className="control-label" htmlFor="todo_todo_text">
                  Ticket Description <span title="required">*</span>
                </label>
                <CFormTextarea
                  className="form-control-cst-cst"
                  rows="5"
                  name="todo[todo_text]"
                  id="todo_todo_text"
                ></CFormTextarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <div className="form-group select optional todo_assigned_id">
                <label className="control-label select optional" htmlFor="todo_assigned_id">
                  Assign User
                </label>
                <CFormSelect
                  className="form-control-cst-cst select optional select2-hidden-accessible"
                  name="todo[assigned_id]"
                  id="todo_assigned_id"
                >
                  <option value="" data-select2-id="12"></option>
                  <option value="3835">Kennedy Peter</option>
                </CFormSelect>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
              <div className="form-group date_picker optional todo_due_date">
                <label className="control-label date_picker optional" htmlFor="todo_due_date">
                  Due Date
                </label>

                <CFormInput
                  className="form-control-cst-cst string date_picker optional form-control-cst-cst input"
                  placeholder=""
                  type="text"
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <div className="form-group select optional todo_project_id">
                <label className="control-label select optional" htmlFor="todo_project_id">
                  Project
                </label>
                <CFormSelect
                  className="form-control-cst-cst select optional select2-hidden-accessible"
                  name="todo[project_id]"
                  id="todo_project_id"
                >
                  <option value="" data-select2-id="14"></option>
                </CFormSelect>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12" id="uppy_dashboard">
              <div className="form-group file optional todo_img">
                <CFormInput
                  className="form-control-cst-cst file optional upload-file"
                  data-multiple-upload="true"
                  data-auto-process="true"
                  type="file"
                  name="todo[img]"
                  id="todo_img"
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <img className="upload-preview" width="100%" height="100%" alt="" />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={(e) => handleSubmitTicket(e)}>
            {/* {creatingFinancial ? 'Processing...' : 'Save'} */}
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Tickets
