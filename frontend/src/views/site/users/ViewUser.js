import React, { useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CButtonGroup,
  CButton,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { isNull } from 'lodash'
import { findUser } from 'src/redux/slices/userSlice'
import { useHistory, useParams } from 'react-router-dom'
import defaultAvatar from 'src/assets/images/avatars/defaultAvatar.png'

const ViewUser = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { showUser, findingUser } = useSelector((state) => state.user)
  const { userId } = useParams()

  const handleEditUser = (e) => {
    e.preventDefault()
    history.push(`/users/edit/${showUser.uuid}-${showUser.slug}`)
  }

  useEffect(() => {
    if (userId) {
      if (!showUser) {
        dispatch(findUser(userId))
      }
    }
  }, [userId, dispatch, showUser])

  if (findingUser) return null

  return (
    <div className="rawWrapper-container">
      {/* {JSON.stringify(showUser)} */}
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="customHeaderContainer">
                <div className="customHeaderContainer-body">
                  <div className="symbolWrapper">
                    <div className="symbol-label">
                      {showUser && !isNull(showUser.avatar) ? (
                        <img
                          className="avatar"
                          title={showUser.name}
                          src={showUser.avatar}
                          alt=""
                        />
                      ) : (
                        <img className="avatar" src={defaultAvatar} alt="" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="customHeaderContainer-footer">
                  <div className="customMiniBar-wrapper">
                    <div className="customMiniBar-header">
                      <div className="minibar-left">
                        <span className="minbarTitle">Users</span>
                        <div className="minbarSubtitle">
                          <h4>{showUser && showUser.name}</h4>
                          <span className="sub"></span>
                        </div>
                      </div>
                      <div className="minibar-right">
                        <CButtonGroup role="group">
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={(e) => handleEditUser(e)}
                          >
                            <i className="fa fa-pen"></i> Edit
                          </CButton>
                          <CButton color="secondary" variant="outline">
                            <i className="fa fa-ellipsis-h"></i>
                          </CButton>
                        </CButtonGroup>
                      </div>
                    </div>
                    <div className="customMiniBar-body">
                      <div className="minItem">
                        <i className="fa fa-map-marker-alt icon-rt" />
                        <span className="minItem-text">Head Office</span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-calendar-alt icon-rt" />
                        <span className="minItem-text">2022-01-21 00:25:08 +0300</span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-flag icon-rt" />
                        <span className="minItem-text">Active</span>
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
                <div className="card-header cstHeaderTabs-line">
                  <div className="cstHeaderNav">
                    <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                      <CNavItem>
                        <CNavLink href="#details" active>
                          <span className="nav-icon">
                            <i className="fa fa-layer-group ico"></i>
                          </span>
                          <span className="nav-text">Overview</span>
                        </CNavLink>
                      </CNavItem>
                      {/* <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-icon">
                            <i className="fa fa-file-invoice-dollar ico"></i>
                          </span>
                          <span className="nav-text">Leave Overview</span>
                        </CNavLink>
                      </CNavItem> */}
                    </CNav>
                  </div>
                </div>
                <CCardBody className="p-3">
                  <div className="tab-content  cstTabContent">
                    <div className="tab-pane fade show active" role="tabpanel">
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id="details"
                          role="tabpanel"
                          aria-labelledby="details"
                        >
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                              <div
                                className="d-block bg-white p-4 rounded"
                                id="person_details_4121_tab"
                              >
                                <div className="row">
                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex flex-column gutter-b">
                                      <h4 className="cstPageTitle">Office Information</h4>
                                      <div className="d-block">
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-map-marker-alt text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="far fa-building text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-laptop text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-ticket text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-user-tag text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex flex-column">
                                      <h4 className="cstPageTitle">Contact Information</h4>
                                      <div className="d-block">
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-phone-rotary text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3">
                                            {' '}
                                            - Ext:{' '}
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-phone-rotary text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-envelope text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <hr />
                                <div className="row">
                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex flex-column gutter-b">
                                      <h4 className="cstPageTitle">General Information</h4>
                                      <div className="d-block">
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Person No:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Birth Date:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Marital Status:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Hire Date:
                                          </span>
                                          <span className="text text-success label-inline font-weight-bold mt-1"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex flex-column">
                                      <h4 className="cstPageTitle">Address Information</h4>
                                      <div className="d-block">
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Home Phone:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            E-mail Address:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Country:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">City:</span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Postcode:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <span className="text-light font-weight-bold">
                                            Address:
                                          </span>
                                          <span className="font-weight-bold text-dark-g ml-3"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
          </CRow>
        </div>
      </div>
    </div>
  )
}

export default ViewUser
