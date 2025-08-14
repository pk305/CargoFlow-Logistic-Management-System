import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CForm,
  CCardFooter,
  CButton,
} from '@coreui/react'
import $ from 'jquery'
import { useDispatch } from 'react-redux'
import { createBooking, showBookingError } from 'src/redux/slices/bookingSlice'
import { isEmpty } from 'lodash'
import { Prompt } from 'react-router-dom'

const CreatePosition = () => {
  // const history = useHistory()
  const dispatch = useDispatch()

  const [bookingData, setBookingData] = useState({
    authenticityToken: '',
    customerCompany: '',
    loadType: '',
    loadingCountry: '',
    branchId: '1',
    salerId: '1',
    operationId: '1',
    unLoadingCountry: '',
  })
  // const { showingError } = useSelector((state) => state.booking)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setBookingData({
      ...bookingData,
      [name]: value,
    })
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    const form = $('#newLoading')
    if (form.length > 0) {
      if (bookingData.customerCompany === '') {
        dispatch(showBookingError({ type: 'customerCompany', errorType: 'errBooking' }))
        return false
      }
      if (bookingData.salerId === '') {
        dispatch(showBookingError({ type: 'salerId', errorType: 'errBooking' }))
        return false
      }
      if (bookingData.branchId === '') {
        dispatch(showBookingError({ type: 'branchId', errorType: 'errBooking' }))
        return false
      }
      if (bookingData.operationId === '') {
        dispatch(showBookingError({ type: 'operationId', errorType: 'errBooking' }))
        return false
      }
      if (bookingData.loadType === '') {
        dispatch(showBookingError({ type: 'loadType', errorType: 'errBooking' }))
        return false
      }
      if (bookingData.loadingCountry === '') {
        dispatch(showBookingError({ type: 'loadingCountry', errorType: 'errBooking' }))
        return false
      }
      if (bookingData.unLoadingCountry === '') {
        dispatch(showBookingError({ type: 'unLoadingCountry', errorType: 'errBooking' }))
        return false
      }
    }
    const {
      authenticityToken,
      customerCompany,
      loadType,
      loadingCountry,
      branchId,
      salerId,
      operationId,
      unLoadingCountry,
    } = bookingData

    const formData = new FormData()
    formData.append('authenticityToken', authenticityToken)
    formData.append('customerCompany', customerCompany)
    formData.append('loadType', loadType)
    formData.append('branchId', branchId)
    formData.append('loadingCountry', loadingCountry)
    formData.append('salerId', salerId)
    formData.append('operationId', operationId)
    formData.append('unLoadingCountry', unLoadingCountry)

    const resData = await dispatch(createBooking(formData)).unwrap()
    if (resData) {
      console.log(resData)
    }
  }
  const alertUser = (e) => {
    e.preventDefault()
    e.returnValue = ''
  }

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])

  return (
    <div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-box-open icon-2x"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">New Booking</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CDropdown>
                    <CDropdownToggle color="secondary">Booking Form options </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#">Domestic Booking Form</CDropdownItem>
                      <CDropdownItem href="#">Domestic Booking Form-2</CDropdownItem>
                      <CDropdownItem href="#">Courier Booking Form</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </div>
              </div>
            </div>
            <CForm
              acceptCharset="UTF-8"
              noValidate="novalidate"
              id="newLoading"
              action="/loadings"
              method="post"
              onSubmit={(e) => handleSubmitBooking(e)}
            >
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <CRow className="pageBoxSizing-container">dd</CRow>
                </div>
              </CCardBody>
              <CCardFooter className="cardCustom-footer">
                <div>
                  <CButton
                    type="submit"
                    color="success"
                    className="btn-default btn btn-success float-right"
                    // disabled={showingError ? true : false}
                  >
                    {/* {showingError ? (
                      <span>Processing...</span>
                    ) : ( */}
                    Save <i className="fa fa-check" />
                    {/* )} */}
                  </CButton>
                </div>
              </CCardFooter>
            </CForm>
          </CCard>
        </div>
      </div>

      {/* <Prompt message="Are you sure you want to leave?" /> */}
    </div>
  )
}

export default CreatePosition
