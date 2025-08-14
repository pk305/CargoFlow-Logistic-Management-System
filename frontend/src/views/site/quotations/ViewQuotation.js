import React, { useState } from 'react'
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
  CBadge,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from '@coreui/react'
import { useParams } from 'react-router-dom'
import { AppBreadcrumb } from 'src/components'
import Noty from 'noty'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { destroyQuotation, findQuotation } from 'src/redux/slices/quotationSlice'
import { capitalize, toUpper } from 'lodash'

const ViewQuotation = () => {
  const params = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies' },
    { name: 'Contacts', pathname: '/contacts' },
    { name: 'Quotations', pathname: '/leads', active: true },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const { showQuotation } = useSelector((state) => state.quotation)
  const [printModal, viewPrintModal] = useState(false)

  const handleModalPrint = (e, item) => {
    e.preventDefault()
    // dispatch(findTemplate({ Id: item.id, type: 'invoice' }))
    // setTempInvoiceId(item.invoiceRefId)
    viewPrintModal(!printModal)
  }

  const initMethods = useCallback(() => {
    const { id } = params
    if (id) {
      async function checkQuote() {
        const resData = await dispatch(findQuotation(id)).unwrap()
        if (resData) {
          document.title = toUpper(resData.refNo)
        }
      }

      checkQuote()
    }
  }, [params, dispatch])

  const handleEditQuotation = (e) => {
    e.preventDefault()
    history.push(`/leads/edit/${showQuotation.linkId}`)
  }

  const closeModalPrint = () => {
    viewPrintModal(false)
    // setTempInvoiceId(null)
  }

  const toLink = (e, h) => {
    e.preventDefault()
    history.push(h)
  }

  const handleDeleteQuotation = (e, item) => {
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
            const resData = await dispatch(destroyQuotation(item.id)).unwrap()
            if (resData) {
              new Noty({
                type: 'alert',
                layout: 'topCenter',
                id: 'sjsios1',
                text: 'Quotation has been deleted succesfully',
              }).show()
              history.push('/leads')
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
    initMethods()
  }, [initMethods])

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
                        <span className="minbarTitle">Quotations</span>
                        <div className="minbarSubtitle">
                          <h4 className="mr-2">{showQuotation && toUpper(showQuotation.refNo)}</h4>
                          <CBadge color="primary">
                            {showQuotation && capitalize(showQuotation.status)}
                          </CBadge>
                        </div>
                      </div>
                      <div className="minibar-right">
                        <CButtonGroup role="group">
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={(e) => handleEditQuotation(e)}
                          >
                            <i className="fa fa-pen"></i> Edit
                          </CButton>
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={(e) => handleModalPrint(e)}
                          >
                            <i className="fa fa-print" /> Print
                          </CButton>
                          <CDropdown className="dashboard-btn-group" placement="right-end">
                            <CDropdownToggle color="secondary" variant="outline" caret={false}>
                              <i className="fa fa-ellipsis-h"></i>
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                href="#"
                                onClick={(e) =>
                                  toLink(e, `/contacts/${showQuotation && showQuotation.linkId}`)
                                }
                              >
                                Edit
                              </CDropdownItem>
                              <CDropdownItem onClick={(e) => handleModalPrint(e)}>
                                Print
                              </CDropdownItem>
                              <CDropdownItem
                                href="#"
                                onClick={(e) => toLink(e, '/positions/new?trans_method=sea')}
                              >
                                Copy
                              </CDropdownItem>
                              <CDropdownDivider />
                              <CDropdownItem
                                href="#"
                                onClick={(e) => handleDeleteQuotation(e, showQuotation)}
                              >
                                Delete
                              </CDropdownItem>
                              <CDropdownDivider />
                              <CDropdownItem
                                href="#"
                                onClick={(e) => toLink(e, '/positions/new?trans_method=sea')}
                              >
                                Set as Sent
                              </CDropdownItem>
                              <CDropdownItem
                                href="#"
                                onClick={(e) => toLink(e, '/positions/new?trans_method=sea')}
                              >
                                Set as Accepted
                              </CDropdownItem>
                              <CDropdownItem
                                href="#"
                                onClick={(e) => toLink(e, '/positions/new?trans_method=sea')}
                              >
                                Set as Denied
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
                          {showQuotation && showQuotation.createdBy && showQuotation.createdBy.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-map-marker-alt icon-rt" />
                        <span className="minItem-text">
                          {showQuotation && showQuotation.branch && showQuotation.branch.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-calendar-alt icon-rt" />
                        <span className="minItem-text">
                          {showQuotation && moment(showQuotation.createdAt).format('LLL')}
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
                  {/* {JSON.stringify(showQuotation)} */}
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="font-weight-bolder">Phone</td>
                          <td> {showQuotation && showQuotation.telephone}</td>
                          <td className="font-weight-bolder">Mail</td>
                          <td>
                            <a href={`mailto:${showQuotation && showQuotation.email}`}>
                              {showQuotation && showQuotation.email}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-weight-bolder">Mobile Phone</td>
                          <td> {showQuotation && showQuotation.gsm}</td>
                          <td className="font-weight-bolder">Skype</td>
                          <td> {showQuotation && showQuotation.skype}</td>
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

      {/* print modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={printModal}
        onClose={() => closeModalPrint()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Print</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2 bg-white">
          <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
            {/* {findingTemplate ? (
              <div>
                <div className="loader-center">
                  <div className="mt-3">
                    <img src={loaderLg} alt="" />
                  </div>
                </div>
              </div>
            ) : (
              <TempModalInfo findingTemplate={findingTemplate} tempInvoiceId={tempInvoiceId} />
            )} */}
          </CCard>
        </CModalBody>
        <CModalFooter>
          <div className="p-2"></div>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ViewQuotation
