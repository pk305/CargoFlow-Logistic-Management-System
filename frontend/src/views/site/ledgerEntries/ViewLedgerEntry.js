import React, { useState } from 'react'
import {
  CCard,
  CButtonGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { useHistory, useParams } from 'react-router-dom'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import { useCallback } from 'react'
import SlidingPane from 'react-sliding-pane'
import { useDispatch, useSelector } from 'react-redux'
import { capitalize } from 'lodash'
import { destroyGldoc, findGldoc } from 'src/redux/slices/gldocSlice'
import moment from 'moment'
import $ from 'jquery'
import Noty from 'noty'

const ViewLedgerEntry = () => {
  const params = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const [toggleTransPanel, setToggleTransPanel] = useState(false)
  const { showGldoc, deletingGldoc } = useSelector((state) => state.gldoc)

  const initMethods = useCallback(() => {
    const { id } = params
    if (id) {
      async function checkLedgerEntry() {
        dispatch(findGldoc(id))
      }
      checkLedgerEntry()
    }
  }, [params, dispatch])

  const closeTransPanel = (e) => {
    e.preventDefault()
    setToggleTransPanel(false)
  }

  const handleEditLedger = (e) => {
    e.preventDefault()
    if (showGldoc) {
      history.push(`/gldocs/edit/${showGldoc.linkId}`)
    }
  }

  const handleDeleteGldoc = (e, item) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
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
            const resData = await dispatch(destroyGldoc(item.id)).unwrap()
            if (resData) {
              new Noty({
                type: 'alert',
                layout: 'topRight',
                id: `del${resData.id}`,
                text: 'Ledger Entry has been deleted succesfully',
              }).show()
              history.push('/gldocs')
            }
            n.close()
          },
          { id: `deltItm${item.id}` },
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
                      <i className="fa fa-pen-square icon-2x"></i>
                    </span>
                  </div>
                </div>
                <div className="customHeaderContainer-footer">
                  <div className="customMiniBar-wrapper">
                    <div className="customMiniBar-header">
                      <div className="minibar-left">
                        <span className="minbarTitle">Ledger Entries</span>
                        <div className="minbarSubtitle">
                          <h4>{showGldoc && showGldoc.title}</h4>
                          <span className="sub"></span>
                        </div>
                      </div>
                      <div className="minibar-right">
                        <CButtonGroup role="group">
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={(e) => handleEditLedger(e)}
                          >
                            <i className="fa fa-pen"></i> Edit
                          </CButton>
                          <CDropdown>
                            <CDropdownToggle
                              color="secondary"
                              variant="outline"
                              className="drop"
                              caret={false}
                            >
                              <i className="fa fa-ellipsis-h" />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem href="#">Copy</CDropdownItem>
                              <CDropdownItem href="#">Reverse Copy</CDropdownItem>
                              <CDropdownItem href="#">Send to Accounting</CDropdownItem>
                              <CDropdownItem href="#">Create Entries</CDropdownItem>
                              <CDropdownItem href="#">Export Excel</CDropdownItem>
                              <CDropdownItem
                                onClick={(e) => handleDeleteGldoc(e, showGldoc)}
                                disabled={deletingGldoc ? true : false}
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
                        <i className="fa fa-map-marker-alt icon-rt" />
                        <span className="minItem-text">
                          {showGldoc && showGldoc.branch && showGldoc.branch.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-book icon-rt" />
                        <span className="minItem-text">
                          {showGldoc && capitalize(showGldoc.ledgerType)}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-user-plus icon-rt" />
                        <span className="minItem-text">
                          {showGldoc && showGldoc.createdBy && showGldoc.createdBy.name}r
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-calendar-alt icon-rt" />
                        <span className="minItem-text">
                          {showGldoc && showGldoc.createdAt
                            ? moment(showGldoc.createdAt).format('DD.MM.YYYY HH:mm')
                            : null}
                        </span>
                      </div>
                      <div className="minItem">
                        {showGldoc && showGldoc.status === 'draft' ? (
                          <>
                            <i className="fa fa-info-circle icon-rt" />
                            <span className="minItem-text">Draft</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCard>
          {/*  */}
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
          {/* <NewTruckTrans setToggleTransPanel={setToggleTransPanel} loadingId={params.id} /> */}
        </div>
      </SlidingPane>
    </div>
  )
}

export default ViewLedgerEntry
