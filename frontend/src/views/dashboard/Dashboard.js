import React, { useState } from 'react'
import {
  CCard,
  CRow,
  CCol,
  CCardBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'
import { Link, useHistory } from 'react-router-dom'
import searchResultImage from 'src/assets/images/dashboard/search-result.png'
import SlidingPane from 'react-sliding-pane'

const Dashboard = () => {
  const history = useHistory()

  const [ticketModal, setTicketModal] = useState(false)
  const [reminderPanel, setReminderPanel] = useState(false)

  const toLink = (e, h) => {
    e.preventDefault()
    history.push(h)
  }

  const closeReminderPanel = (e) => {
    e.preventDefault()
    setReminderPanel(false)
  }

  const handleSetReminder = (e) => {
    e.preventDefault()
    setReminderPanel(true)
  }

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

  return (
    <div>
      <div className="d-flex flex-column flex-column-fluid mt-3 p-2">
        <div className="h-100">
          <div className="d-block"></div>
          <CRow className="gutter-b">
            <CCol sm={12} md={12} lg={12}>
              <CCard className="cardCustom ">
                <div className="card-header">
                  <div className="card-title">
                    <h6 className="card-label font-weight-bolder">Quick Links</h6>
                  </div>
                </div>
                <CCardBody>
                  <CRow className="row-paddingless">
                    <CCol sm={6} xs={6} md={4} lg={2}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning mr-3"
                          to="/loadings"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-cubes"></i>
                          </span>
                          <span className="titleCustom">Bookings</span>
                        </Link>
                      </div>
                    </CCol>
                    <CCol sm={6} xs={6} md={4} lg={2}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger mr-3"
                          to="/leads"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-user-edit"></i>
                          </span>
                          <span className="titleCustom">Quotations</span>
                        </Link>
                      </div>
                    </CCol>
                    {/* <CCol sm={6} xs={6} md={4} lg={1}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-primary text-primary mr-3"
                          to="/depot/depot/home"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-qrcode"></i>
                          </span>
                          <span className="titleCustom">Warehouse Mngt</span>
                        </Link>
                      </div>
                    </CCol> */}
                    {/* <CCol sm={6} xs={6} md={4} lg={1}>
                      <div className="customBoxContainer">
                        <Link className="customBoxLink" to="/companies">
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-building"></i>
                          </span>
                          <span className="titleCustom">Companies</span>
                        </Link>
                      </div>
                    </CCol> */}
                    <CCol sm={6} xs={6} md={4} lg={2}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-warning text-warning mr-3"
                          to="/vehicles"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-truck"></i>
                          </span>
                          <span className="titleCustom">Fleet Management</span>
                        </Link>
                      </div>
                    </CCol>
                    <CCol sm={6} xs={6} md={4} lg={2}>
                      <div className="customBoxContainer">
                        <Link className="customBoxLink" to="/financor/home">
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-university"></i>
                          </span>
                          <span className="titleCustom">Finance Management</span>
                        </Link>
                      </div>
                    </CCol>
                    <CCol sm={6} xs={6} md={4} lg={2}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-primary text-primary mr-3"
                          to="/financor/debit"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-users"></i>
                          </span>
                          <span className="titleCustom">Sales Invoice</span>
                        </Link>
                      </div>
                    </CCol>
                    <CCol sm={6} xs={6} md={4} lg={2}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger mr-3"
                          to="/reports/home?group_type=logistics"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-list-alt"></i>
                          </span>
                          <span className="titleCustom">Reports</span>
                        </Link>
                      </div>
                    </CCol>
                    {/* <CCol sm={6} xs={6} md={4} lg={1}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-primary text-primary mr-3"
                          to="/hr/home"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-users"></i>
                          </span>
                          <span className="titleCustom">Human Resources</span>
                        </Link>
                      </div>
                    </CCol>
                    <CCol sm={6} xs={6} md={4} lg={1}>
                      <div className="customBoxContainer">
                        <Link
                          className="p-2 d-flex flex-grow-1 rounded flex-column align-items-center border bg-hover-light-danger text-danger mr-3"
                          to="/assetim/wares"
                        >
                          <span className="iconCustom">
                            <i className="icon-2x fa fa-list-alt"></i>
                          </span>
                          <span className="titleCustom">Inventories</span>
                        </Link>
                      </div>
                    </CCol> */}
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="gutter-b">
            <CCol sm={12} xs={12} md={12} lg={12}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <h6 className="dashTitle" id="active-dashboard-title">
                    Logistics Dashboard
                  </h6>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <CDropdown className="dashboard-btn-group">
                    <CDropdownToggle
                      color="secondary"
                      caret={false}
                      className="bg-white btn-icon-secondary btn-icon btn-pill"
                    >
                      <i className="fa fa-plus"></i>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#" onClick={(e) => toLink(e, '/loadings/new')}>
                        Create Booking
                      </CDropdownItem>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => toLink(e, '/positions/new?trans_method=sea')}
                      >
                        Create Ocean Master BL
                      </CDropdownItem>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => toLink(e, '/positions/new?trans_method=air')}
                      >
                        Create Air Master BL
                      </CDropdownItem>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => toLink(e, '/positions/new?trans_method=road')}
                      >
                        Create Road Transport
                      </CDropdownItem>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => toLink(e, '/positions/new?trans_method=rail')}
                      >
                        Create Rail Transport
                      </CDropdownItem>
                      <CDropdownItem href="#" onClick={(e) => toLink(e, '/leads/new')}>
                        Create Quotation
                      </CDropdownItem>
                      <CDropdownItem href="#" onClick={(e) => toLink(e, '/companies/new')}>
                        Create Company
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol
              id="mdl_databoard_content"
              sm={12}
              xs={12}
              md={12}
              lg={8}
              className="dashboardCustom"
            >
              <div className="row">
                {/* <div className="col-12 col-md-4 mb-6 mb-lg-0">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Ongoing Transport</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CChartDoughnut
                      id="chart-1"
                      style={{
                        height: '350px',
                        width: '100%',
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '14px',
                        fontFamily:
                          "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif",
                      }}
                      customTooltips={true}
                      data={{
                        datasets: [
                          {
                            backgroundColor: ['#41B883'],
                            data: [40],
                          },
                        ],
                        labels: ['Transit'],
                      }}
                    />
                  </CCard>
                </div> */}
                <div className="col-12 col-md-4 mb-6 mb-lg-0">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Ongoing Transport</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Add a wrapper div with fixed height */}
                    <div style={{ height: '350px', padding: '20px' }}>
                      <CChartDoughnut
                        id="chart-1"
                        style={{
                          height: '100%',
                          width: '100%',
                        }}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                        data={{
                          datasets: [
                            {
                              backgroundColor: ['#41B883'],
                              data: [40],
                            },
                          ],
                          labels: ['Transit'],
                        }}
                      />
                    </div>
                  </CCard>
                </div>
                <div className="col-12 col-md-4 mb-6 mb-lg-0">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Planned Transport</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="chart_6" className="card-body">
                      <div
                        id="chart-2"
                        style={{
                          height: '350px',
                          width: '100%',
                          textAlign: 'center',
                          color: '#999',
                          lineHeight: '350px',
                          fontSize: '14px',
                          fontFamily:
                            "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif",
                        }}
                      >
                        No data
                      </div>
                    </div>
                  </CCard>
                </div>
                <div className="col-12 col-md-4 mb-6 mb-lg-0">
                  <CCard className="cardCustom gutter-b">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Pending Bookings</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="chart_7" className="card-body">
                      <div
                        id="chart-3"
                        style={{
                          height: '350px',
                          width: '100%',
                          textAlign: 'center',
                          color: '#999',
                          lineHeight: '350px',
                          fontSize: '14px',
                          fontFamily:
                            "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif",
                        }}
                      >
                        No data
                      </div>
                    </div>
                  </CCard>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-xs-12 col-md-12 col-lg-12">
                  <div id="mdl_tlist_ongoing_positions" className="card cardCustom gutter-b">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Ongoing Positions</h6>
                            </div>
                          </div>
                        </div>
                        <div className="customHeaderToolbar">
                          <Link
                            className="btn btn-sm btn-light-warning ml-2"
                            to="/helpdesk/projects/3835-kennedy-peter?show_type=user"
                          >
                            See All
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0 min-h-250px max-h-500px overflow-auto">
                      <div className="table-responsive p-2">
                        <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                          <img src={searchResultImage} alt="" />
                          <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                            <h6 className="text-dark text-center font-size-h5 mb-3">
                              You don&apos;t have any ongoing transport.
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CCol>

            <CCol sm={12} xs={12} md={12} lg={4}>
              <div className="row">
                <div className="col-12 col-xs-12 col-md-6 col-lg-12">
                  <CCard className="cardCustom gutter-b" id="mdl_todo_list">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Tasks</h6>
                            </div>
                          </div>
                        </div>
                        <div className="customHeaderToolbar">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            className="btn btn-sm btn-icon ml-2"
                            data-remote="true"
                            href="#"
                            onClick={(e) => handleSetTicket(e)}
                          >
                            <i className="fa fa-plus"></i>
                          </a>
                          <Link
                            className="btn btn-sm ml-2"
                            to="/tickets/3835-kennedy-peter?show_type=user"
                          >
                            See All
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="card-body overflow-auto">
                      <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                        <img src={searchResultImage} alt="" />
                        <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                          <h6 className="text-dark text-center font-size-h5 mb-3">
                            No task is assigned to you.
                          </h6>
                          <a
                            className="btn btn-sm btn-warning"
                            href="/helpdesk/todos/new?form_scope=mdl_modal_form"
                            onClick={(e) => handleSetTicket(e)}
                          >
                            Create Task
                          </a>
                        </div>
                      </div>
                    </div>
                  </CCard>
                </div>

                <div className="col-12 col-xs-12 col-md-6 col-lg-12">
                  <div id="mdl_reminder_list" className="card cardCustom gutter-b">
                    <div className="card-header cstHeaderTabs-line">
                      <div className="toolBarContainer">
                        <div className="customHeaderContainer">
                          <div className="customHeaderContainer-footer">
                            <div className="card-title">
                              <h6 className="card-label">Reminders</h6>
                            </div>
                          </div>
                        </div>
                        <div className="customHeaderToolbar">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            className="btn btn-sm btn-icon btn-light-warning ml-2"
                            href="#"
                            onClick={(e) => handleSetReminder(e)}
                          >
                            <i className="fa fa-plus"></i>
                          </a>
                          <Link className="btn btn-sm btn-light-warning ml-2" to="/reminders">
                            See All
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="card-body overflow-auto">
                      <div className="table-responsive">
                        <table
                          id="reminders_list_table"
                          className="table table-borderless table-vertical-center"
                        >
                          <tbody id="reminders_list_tbody"></tbody>
                        </table>
                      </div>
                      <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                        <img src={searchResultImage} alt="" />
                        <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                          <h6 className="text-dark text-center font-size-h5 mb-3">
                            You have not add any reminder for yourself.
                          </h6>
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            className="btn btn-sm btn-info"
                            href="#"
                            onClick={(e) => handleSetReminder(e)}
                          >
                            Create Reminder
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-12 col-xs-12 col-md-6 col-lg-12">
                  <div id="mdl_ping_list" className="card cardCustom">
                    <div className="card-header py-1">
                      <div className="card-title">
                        <h6 className="card-label font-weight-bolder text-dark">Pings</h6>
                        <span className="label label-pill label-primary font-weight-bolder"></span>
                      </div>
                      <div className="card-toolbar">
                        <Link
                          className="btn btn-sm btn-light-primary ml-2"
                          data-remote="true"
                          to="/pings"
                        >
                          See All
                        </Link>
                      </div>
                    </div>
                    <div className="card-body overflow-auto">
                      <div className="d-flex flex-column align-items-center justify-content-center w-full py-6">
                        <img src={searchResultImage} alt="" />
                        <div className="mt-6 d-flex flex-column align-items-center justify-content-center">
                          <h6 className="text-dark text-center font-size-h5 mb-3">
                            You do not have any pings, hope always goes like this.
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </CCol>
          </CRow>
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

      {/* reminder pane */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={reminderPanel}
        title={
          <div className="space">
            <div>
              <span>New Reminder</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeReminderPanel(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc={true}
        backdrop="static"
      >
        <div>
          <form className="simple_form horizontal-form" id="new_reminder">
            <div className="d-block">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="form-group reminder_title">
                    <label className="control-label" htmlFor="reminder_title">
                      Title <span title="required">*</span>
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="reminder[title]"
                      id="reminder_title"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group date_picker required reminder_start_date">
                    <label
                      className="control-label date_picker required"
                      htmlFor="reminder_start_date"
                    >
                      Starting Date <span title="required">*</span>
                    </label>

                    <CFormInput
                      className="form-control-cst string date_picker required input"
                      placeholder=""
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                  <div className="form-group time_picker optional reminder_start_hour">
                    <label
                      className="control-label time_picker optional"
                      htmlFor="reminder_start_hour"
                    >
                      Start Time
                    </label>
                    <CFormInput
                      className="form-control-cst string time_picker optional flatpickr-input"
                      type="text"
                      autoComplete="off"
                      data-plugin="timepicker"
                      value="17:10"
                      name="reminder[start_hour]"
                      id="reminder_start_hour"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <div className="form-group date_picker required reminder_finish_date">
                    <label
                      className="control-label date_picker required"
                      htmlFor="reminder_finish_date"
                    >
                      Due Date <span title="required">*</span>
                    </label>

                    <CFormInput
                      className="form-control-cst string date_picker required form-control-cst input"
                      placeholder=""
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                  <div className="form-group time_picker optional reminder_finish_hour">
                    <label
                      className="control-label time_picker optional"
                      htmlFor="reminder_finish_hour"
                    >
                      End Time
                    </label>
                    <CFormInput
                      className="form-control-cst string time_picker optional flatpickr-input"
                      type="text"
                      autoComplete="off"
                      data-plugin="timepicker"
                      name="reminder[finish_hour]"
                      id="reminder_finish_hour"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="form-group text optional reminder_description">
                    <label className="control-label text optional" htmlFor="reminder_description">
                      Additional Notes
                    </label>
                    <CFormTextarea
                      className="form-control-cst text optional"
                      rows="3"
                      name="reminder[description]"
                      id="reminder_description"
                    ></CFormTextarea>
                  </div>
                  <div className="form-group hidden reminder_remindfor_type">
                    <CFormInput
                      className="form-control-cst hidden"
                      type="hidden"
                      name="reminder[remindfor_type]"
                      id="reminder_remindfor_type"
                    />
                  </div>
                  <div className="form-group hidden reminder_remindfor_id">
                    <CFormInput
                      className="form-control-cst hidden"
                      type="hidden"
                      name="reminder[remindfor_id]"
                      id="reminder_remindfor_id"
                    />
                  </div>
                  <div className="form-group hidden reminder_group_id">
                    <CFormInput
                      className="form-control-cst hidden"
                      type="hidden"
                      name="reminder[group_id]"
                      id="reminder_group_id"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <CButton
                    type="submit"
                    color="success"
                    //  disabled={creatingCurrList ? true : false}
                  >
                    {/* {creatingCurrList ? ( */}
                    {/* 'Processing...' */}
                    {/* ) : ( */}
                    <span>
                      Save <i className="fa fa-check"></i>
                    </span>
                    {/* )} */}
                  </CButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </SlidingPane>
    </div>
  )
}

export default Dashboard
