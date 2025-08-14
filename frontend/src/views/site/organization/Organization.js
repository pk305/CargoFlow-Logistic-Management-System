import React, { useEffect, useState, useMemo } from 'react'
import {
  CCard,
  CButtonGroup,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import moment from 'moment'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { fetchCompanyOrganization } from 'src/redux/slices/systemSlice'
import TabDocs from './TabDocs'
import GeneralInfo from './GeneralInfo'
import GeneralUsers from './GeneralUsers'
import GeneralBranches from './GeneralBranches'
import { capitalize, isNull } from 'lodash'
import Noty from 'noty'
import $ from 'jquery'

const Organization = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { findingTemplate } = useSelector((state) => state.template)
  const [setTempInvoiceId] = useState(null)
  const { authUser } = useSelector((state) => state.auth)
  const { company, fetchingCompOrganization } = useSelector((state) => state.system)
  const [delOrgMOdal, setDelOrgMOdal] = useState(false)

  const handleEditUser = (e) => {
    e.preventDefault()
    if (company) {
      history.push(`/organization/edit/${company.linkId}`)
    }
  }

  const handleNavLink = (e, x) => {
    e.preventDefault()
    history.push(`/organization${x}`)
  }

  const handleDeleteOrg = (e) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    var n = new Noty({
      text: 'The entire company record will be deleted, do you want to continue ? ',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      closeWith: 'button',
      buttons: [
        Noty.button(
          'Yes,Proceed',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          function () {
            setDelOrgMOdal(true)
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

  const closeModalOrg = () => {
    setDelOrgMOdal(false)
  }

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  const SwitchQuery = () => {
    if (query.get('scope')) {
      switch (query.get('scope')) {
        case 'general_info':
          return <GeneralInfo company={company} />

        case 'users':
          return <GeneralUsers company={company} />

        case 'branches':
          return <GeneralBranches company={company} />

        default:
          return <GeneralInfo company={company} />
      }
    }

    return <GeneralInfo company={company} />
  }

  useEffect(() => {
    if (authUser) {
      // fetch operations
      if (isNull(company)) {
        dispatch(fetchCompanyOrganization(authUser.uuid))
      }
    }
  }, [dispatch, authUser, company])

  if (fetchingCompOrganization) return null

  return (
    <div className="rawWrapper-container">
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom mb-2">
            <div className="card-header">
              <div className="customHeaderContainer">
                <div className="customHeaderContainer-body">
                  <div className="symbolWrapper">
                    <div className="symbol-label">
                      <i className="fa fa-map-marker-alt fa-3x"></i>
                    </div>
                  </div>
                </div>
                <div className="customHeaderContainer-footer">
                  <div className="customMiniBar-wrapper">
                    <div className="customMiniBar-header">
                      <div className="minibar-left">
                        <span className="minbarTitle">Company</span>
                        <div className="minbarSubtitle">
                          <h4>{company && company.name}</h4>
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
                          <CDropdown>
                            <CDropdownToggle
                              color="secondary"
                              variant="outline"
                              caret={false}
                              className="drop"
                            >
                              <i className="fa fa-ellipsis-h"></i>
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={(e) => handleEditUser(e)}>
                                <i className="fa fa-edit" />
                                <span className="ml-2">Edit</span>
                              </CDropdownItem>
                              <CDropdownItem>
                                <i className="fa fa-random" />
                                <span className="ml-2">Create Demos</span>
                              </CDropdownItem>
                              <CDropdownItem>
                                <i className="fa fa-ban" />
                                <span className="ml-2">Disable</span>
                              </CDropdownItem>
                              <CDropdownItem onClick={(e) => handleDeleteOrg(e)}>
                                <i className="fa fa-trash" />
                                <span className="ml-2">Delete</span>
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CButtonGroup>
                      </div>
                    </div>
                    <div className="customMiniBar-body">
                      <div className="minItem">
                        <i className="fa fa-calendar-alt icon-rt" />
                        <span className="minItem-text">
                          {moment(company && company.createdAt).format('DD MMM HH:mm A')}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-flag icon-rt" />
                        <span className="minItem-text">
                          {company && company.status && capitalize(company.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCard>
          <CCard className="cardCustom gutter-b ">
            <TabDocs handleNavLink={handleNavLink} query={query} visible={true}>
              <SwitchQuery />
            </TabDocs>
          </CCard>
        </div>
      </div>

      {/* print modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        visible={delOrgMOdal}
        onClose={() => closeModalOrg()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Print</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2 bg-white">
          <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
            {findingTemplate ? (
              <div>
                <div className="loader-center">
                  <div className="mt-3">
                    <img src={loaderLg} alt="" />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <CFormInput className="form-control-cst" />
              </div>
            )}
          </CCard>
        </CModalBody>
      </CModal>
    </div>
  )
}

export default Organization
