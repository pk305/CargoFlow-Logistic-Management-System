import React from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButtonGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from '@coreui/react'
import Noty from 'noty'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { destroyContact, findContact } from 'src/redux/slices/contactSlice'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

const ContactPanel = ({ contactId, closeContactPanel, handleSetProfile }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { showContact } = useSelector((state) => state.contact)

  const successCreatedNotif = useCallback(() => {
    if (contactId) {
      async function checkContact() {
        dispatch(findContact(contactId)).unwrap()
      }

      checkContact()
    }
  }, [contactId, dispatch])

  const handleEditContact = (e) => {
    e.preventDefault()
    history.push(`/contacts/edit/${showContact.linkId}`)
  }

  const toLink = (e, h) => {
    e.preventDefault()
    history.push(h)
  }

  const handleSocialMedia = (e, item) => {
    e.preventDefault()
    closeContactPanel(true)
    handleSetProfile(e, item)
  }

  const handleDeleteContact = (e, item) => {
    e.preventDefault()
    var n = new Noty({
      text: 'The record will be deleted, do you want to continue ?',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      closeWith: 'button',
      buttons: [
        Noty.button(
          'Delete',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          async function () {
            const resData = await dispatch(destroyContact(item.id)).unwrap()
            if (resData) {
              new Noty({
                type: 'alert',
                layout: 'topCenter',
                id: 'sjsios1',
                text: 'Contact has been deleted succesfully',
              }).show()
              history.push('/contacts')
            }
            n.close()
          },
          { id: 'deltItm' },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }

  useEffect(() => {
    successCreatedNotif()
  }, [successCreatedNotif])

  return (
    <div>
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
                        <span className="minbarTitle">Contacts</span>
                        <div className="minbarSubtitle">
                          <h4>{showContact && showContact.name}</h4>
                          <span className="sub"></span>
                        </div>
                      </div>
                      <div className="minibar-right">
                        <CButtonGroup role="group">
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={(e) => handleEditContact(e)}
                          >
                            <i className="fa fa-pen"></i> Edit
                          </CButton>
                          <CDropdown className="dashboard-btn-group">
                            <CDropdownToggle color="secondary" variant="outline" caret={false}>
                              <i className="fa fa-ellipsis-h"></i>
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                href="#"
                                onClick={(e) =>
                                  toLink(e, `/contacts/${showContact && showContact.linkId}`)
                                }
                              >
                                Edit
                              </CDropdownItem>
                              <CDropdownItem
                                href="#"
                                onClick={(e) => handleSocialMedia(e, showContact)}
                              >
                                Social Media
                              </CDropdownItem>
                              <CDropdownDivider />
                              <CDropdownItem
                                href="#"
                                onClick={(e) => handleDeleteContact(e, showContact)}
                              >
                                Delete
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CButtonGroup>
                      </div>
                    </div>
                    <div className="customMiniBar-body">
                      <div className="minItem">
                        <i className="fa fa-user-plus icon-rt" />
                        <span className="minItem-text">
                          {showContact && showContact.createdBy && showContact.createdBy.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-building icon-rt" />
                        <span className="minItem-text">
                          {showContact && showContact.company && showContact.company.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-calendar-alt icon-rt" />
                        <span className="minItem-text">
                          {showContact && moment(showContact.createdAt).format('LLL')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCard>

          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <CCard className="cardCustom gutter-b">
                <div className="card-header">
                  <div className="card-title">
                    <h3 className="card-label">Contact Information</h3>
                  </div>
                </div>
                <CCardBody className="p-3">
                  {/* {JSON.stringify(showContact)} */}
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="font-weight-bolder">Phone</td>
                          <td> {showContact && showContact.telephone}</td>
                          <td className="font-weight-bolder">Mail</td>
                          <td>
                            <a href={`mailto:${showContact && showContact.email}`}>
                              {showContact && showContact.email}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bolder">Mobile Phone</td>
                          <td> {showContact && showContact.gsm}</td>
                          <td className="font-weight-bolder">Skype</td>
                          <td> {showContact && showContact.skype}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  )
}

ContactPanel.propTypes = {
  contactId: PropTypes.string,
  closeContactPanel: PropTypes.func,
  setContactId: PropTypes.func,
  handleSetProfile: PropTypes.func,
}

export default ContactPanel
