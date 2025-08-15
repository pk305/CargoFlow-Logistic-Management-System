import React, { useEffect, useState } from 'react'
import {
  CCard,
  CRow,
  CListGroup,
  CListGroupItem,
  CButton,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CFormTextarea,
  CFormInput,
  CModalFooter,
} from '@coreui/react'
import searchResultImage from 'src/assets/images/dashboard/search-result.png'
import { useSelector } from 'react-redux'
import defaultAvatar from 'src/assets/images/avatars/defaultAvatar.png'
import { isNull } from 'lodash'

const Reminders = () => {
  const { authUser } = useSelector((state) => state.auth)
  const [reminderMd, setReminderMd] = useState(false)
  const [showDescArea, setShowDescArea] = useState(false)
  // const [activeNav, setActiveNav] = useState([
  //   true,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  // ])

  // const [reminderData] = useState({
  //   remindfor_type: '',
  //   remindfor_id: '',
  //   group_id: '',
  // })

  const toggleShowDesc = (e) => {
    e.preventDefault()
    setShowDescArea(!showDescArea)
  }

  const closeReminderMd = () => {
    setReminderMd(false)
  }

  const newReminder = (e) => {
    e.preventDefault()

    setReminderMd(true)
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
                        <a className="active" href="#pending">
                          <div className="truncate">
                            <span className="nav-icon">
                              <i className="far fa-clock"></i>
                            </span>
                            <span className="nav-text font-weight-bolder ml-2">Reminder</span>
                          </div>
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
                              <h6 className="card-label">Reminders</h6>
                            </div>
                          </div>
                        </div>
                        <div className="customHeaderToolbar">
                          <CButton color="primary" variant="ghost" onClick={(e) => newReminder(e)}>
                            <i className="fa fa-plus"></i> New Reminder
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
                      </div>
                    </div>
                  </CCard>
                </div>
              </div>
            </CRow>
          </div>
        </div>
      </div>

      {/* reminder modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        visible={reminderMd}
        onClose={(e) => closeReminderMd(e)}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">New Reminder</CModalTitle>
        </CModalHeader>
        <CModalBody className="bg-white">
          <div>
            <div className="row">
              <div className="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                <div className="form-group string required reminder_title">
                  <label className="control-label string required" htmlFor="reminder_title">
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
              <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group date_picker required reminder_start_date">
                  <label
                    className="control-label date_picker required"
                    htmlFor="reminder_start_date"
                  >
                    Date <span title="required">*</span>
                  </label>

                  <CFormInput className="form-control-cst" placeholder="" type="text" />
                </div>
              </div>
            </div>

            {!showDescArea && (
              <>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href="#"
                  className="toggle_and_hide_button btn btn-sm btn-outline-primary"
                  onClick={(e) => toggleShowDesc(e)}
                >
                  Add Description
                </a>
              </>
            )}
            <div
              id="reminder-notes-fields"
              className="row slidingDiv"
              style={{ display: !showDescArea ? 'none' : '' }}
            >
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
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="success" type="submit">
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Reminders
