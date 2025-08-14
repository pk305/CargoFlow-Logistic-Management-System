import React, { useState } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormFeedback,
  CFormSelect,
  CModalFooter,
  CModalHeader,
  CModal,
  CModalTitle,
  CModalBody,
  CButton,
} from '@coreui/react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { isEmpty, isNull } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import NewContact from '../modelInfo/NewContact'
import Noty from 'noty'
import $ from 'jquery'
import { createContact, showContactError } from 'src/redux/slices/contactSlice'

const GeneralInformation = ({
  handleChangeForm,
  bookingData,
  handleSelectFocus,
  handleNextBooking,
}) => {
  const dispatch = useDispatch()
  const [operationOption, setOperationOption] = useState('road')
  const { creatingBooking, bookingErrors } = useSelector((state) => state.booking)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { fetchingUsers, users } = useSelector((state) => state.user)
  const { authUser } = useSelector((state) => state.auth)
  const [companyLinkId, setCompanyLinkId] = useState('')
  const [companyContacts, setCompanyContacts] = useState([])
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const { creatingContact } = useSelector((state) => state.contact)
  const [unLoadDateTime, setUnLoadDateTime] = useState('')
  const [contactModal, setContactModal] = useState(false)
  const [contactData, setContactData] = useState({
    contactName: '',
    contactEmail: '',
    companyId: `${companyLinkId}`,
    jobTitle: '',
    gsm: '',
    skype: '',
    tel: '',
    operationId: '',
    roadNotify: '1',
    seaNotify: '1',
    airNotify: '1',
    railNotify: '1',
    customNotify: '0',
    depotNotify: '1',
    financeNotify: '0',
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  })

  const handleSelectForm = (c, val) => {
    if (c === 'customerCompany') {
      setCompanyLinkId(val ? val.value.linkId : null)
      setCompanyContacts(val ? val.value.contacts : null)
      const e = { target: { name: c, value: !isNull(val) ? val.value.id : '' } }
      handleChangeForm(e)
    } else if (c === 'operationId') {
      setOperationOption(val ? val.value.transMethod : 'road')
      const e = { target: { name: c, value: !isNull(val) ? val.value.id : '' } }
      handleChangeForm(e)
    } else {
      const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
      handleChangeForm(e)
    }
  }

  const closeContModal = () => {}

  const handleDateTime = (c, date) => {
    if (c === 'hblDate') {
      setUnLoadDateTime(date)
    }
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleModalContact = (e) => {
    e.preventDefault()
    setContactModal(true)
  }

  const noOptionContact = (e) => {
    return (
      <>
        <div>No results found</div>
        <div>
          {/* eslint-disable-next-line */}
          <a href="#" className="text-r" onClick={(e) => handleModalContact(e)}>
            Add New Item
          </a>
        </div>
      </>
    )
  }

  const clearCityData = () => {
    setContactData({
      contactName: '',
      contactEmail: '',
      companyId: `${companyLinkId}`,
      jobTitle: '',
      gsm: '',
      skype: '',
      tel: '',
      operationId: '',
      roadNotify: '1',
      seaNotify: '1',
      airNotify: '1',
      railNotify: '1',
      customNotify: '0',
      depotNotify: '1',
      financeNotify: '0',
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
    })
  }

  const handleSubmitContact = async (e) => {
    e.preventDefault()
    const form = $('#new_contact')
    if (form.length > 0) {
      if (contactData.contactName === '') {
        dispatch(showContactError({ type: 'contactName', errorType: 'errContact' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(contactData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(createContact(formData)).unwrap()
    if (resData) {
      clearCityData()
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `aler-${resData.id}`,
        text: `
          <span>
            <i className="fa fa-check"></i> Contact has been created succesfully
          </span>`,
      }).show()
      setContactModal(false)
    }
  }

  return (
    <div className="">
      <form
        className="simple_form horizontal-form"
        id="new_loading"
        onSubmit={(e) => handleNextBooking(e, '2')}
      >
        <h4 className="cstPageTitle">General Information</h4>
        <h6 className="subTitleHeading">Step: 1/5</h6>
        <div className="separator"></div>
        <div className="row">
          <div className="col">
            <CRow>
              <CCol sm={4} md={3} lg={3} xl={3}>
                <div className="form-group company">
                  <CFormLabel className="control-label company " htmlFor="loading_company_id">
                    Customer
                    {companyLinkId !== '' && (
                      <Link
                        to={`/companies/${companyLinkId}`}
                        target="_blank"
                        className="float-right profile-link"
                      >
                        Profile
                      </Link>
                    )}
                  </CFormLabel>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable={true}
                        placeholder
                        isLoading={fetchingCompanies ? true : false}
                        isSearchable
                        autoFocus={false}
                        name="customerCompany"
                        options={
                          companies && !fetchingCompanies && companies.length > 0
                            ? companies.map((itm) => ({
                                label: itm.name,
                                value: itm,
                              }))
                            : []
                        }
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.customerCompany),
                        })}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('customerCompany', e)}
                        onMenuOpen={() => handleSelectFocus('customerCompany')}
                      />
                      <CFormFeedback
                        invalid={
                          bookingErrors && !isEmpty(bookingErrors.customerCompany) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {bookingErrors.customerCompany}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol sm={4} md={3} lg={3} xl={3}>
                <div className="form-group contact  loading_contact_id" data-select2-id="79">
                  <label className="control-label contact " htmlFor="loading_contact_id">
                    Contact
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable
                        isSearchable
                        placeholder
                        name="contactId"
                        options={
                          companyContacts && companyContacts.length > 0
                            ? companyContacts.map((itm) => ({
                                label: itm.name,
                                value: itm.id,
                              }))
                            : []
                        }
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.contactId),
                        })}
                        noOptionsMessage={() => noOptionContact()}
                        onChange={(e) => handleSelectForm('contactId', e)}
                        onMenuOpen={() => handleSelectFocus('contactId')}
                      />
                      <CFormFeedback
                        invalid={bookingErrors && !isEmpty(bookingErrors.contactId) ? true : false}
                        className="fieldError-cst"
                      >
                        {bookingErrors.contactId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol sm={4} md={3} lg={3} xl={3}>
                <div className="form-group string  loading_customer_ref">
                  <CFormLabel className="control-label string " htmlFor="loading_customer_ref">
                    Customer Reference
                  </CFormLabel>
                  <CFormInput
                    className="form-control-cst string "
                    type="text"
                    name="customerRef"
                    id="loading_customer_ref"
                    value={bookingData.customerRef}
                    invalid={bookingErrors && !isEmpty(bookingErrors.customerRef) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'customerRef', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.customerRef) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.customerRef}
                  </CFormFeedback>
                </div>
              </CCol>
              <CCol sm={4} md={3} lg={3} xl={3}>
                <div className="form-group   loading_saler_id">
                  <label className="control-label  " htmlFor="loading_saler_id">
                    Representative
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        id="salerId"
                        name="salerId"
                        defaultValue={{ label: `${authUser.name}`, value: `${authUser.uiid}` }}
                        options={
                          users && !fetchingUsers && users.length > 0
                            ? users.map((itm) => ({
                                label: itm.name,
                                value: itm.uuid,
                              }))
                            : []
                        }
                        isLoading={fetchingUsers ? true : false}
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.salerId),
                        })}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('salerId', e)}
                        onMenuOpen={(e) => handleSelectFocus('salerId', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.salerId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={4} md={3} lg={3} xl={3}>
                <div className="form-group select  loading_operation_id">
                  <label className="control-label select " htmlFor="loading_operation_id">
                    Operation
                  </label>
                  <div className="input-group">
                    <Select
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      id="operationId"
                      defaultValue={
                        authUser && authUser.operation
                          ? {
                              label: `${authUser.operation.name}`,
                              value: `${authUser.operation.id}`,
                            }
                          : null
                      }
                      options={
                        operations && !fetchingOperations && operations.length > 0
                          ? operations.map((itm) => ({
                              label: itm.name,
                              value: itm,
                            }))
                          : []
                      }
                      isLoading={fetchingOperations ? true : false}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('operationId', e)}
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': bookingErrors && !isEmpty(bookingErrors.operationId),
                      })}
                      onMenuOpen={(e) => handleSelectFocus('operationId', e)}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.operationId}
                    </CFormFeedback>
                  </div>
                </div>
              </CCol>
              <CCol sm={4} md={3} lg={3} xl={3}>
                <div className="form-group select  loading_branch_id">
                  <label className="control-label select " htmlFor="loading_branch_id">
                    Branch
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        id="branchId"
                        options={
                          branches && !fetchingBranches && branches.length > 0
                            ? branches.map((itm) => ({
                                label: itm.name,
                                value: itm.id,
                              }))
                            : []
                        }
                        defaultValue={
                          authUser && authUser.branch
                            ? {
                                label: `${authUser.branch.name}`,
                                value: `${authUser.branch.id}`,
                              }
                            : null
                        }
                        isLoading={fetchingBranches ? true : false}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('branchId', e)}
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.branchId),
                        })}
                        onMenuOpen={(e) => handleSelectFocus('branchId', e)}
                      />
                      <CFormFeedback
                        invalid={bookingErrors && !isEmpty(bookingErrors.branchId) ? true : false}
                        className="fieldError-cst"
                      >
                        {bookingErrors.branchId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol
                sm={4}
                md={3}
                lg={3}
                xl={3}
                id="loadingType"
                style={{
                  display:
                    operationOption === 'road' ||
                    operationOption === 'sea' ||
                    operationOption === 'warehouse'
                      ? 'block'
                      : 'none',
                }}
              >
                <div className="form-group select">
                  <label className="control-label select " htmlFor="loading_load_type">
                    Full/Groupage
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadType),
                        })}
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        id="loadType"
                        isSearchable
                        options={[
                          { label: '', value: '' },
                          { label: 'Full Cargo', value: 'K' },
                          { label: 'Groupage Cargo', value: 'P' },
                          { label: 'Groupage in one unit', value: 'KP' },
                        ]}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('loadType', e)}
                        onMenuOpen={(e) => handleSelectFocus('loadType', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.loadType}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol
                sm={4}
                md={3}
                lg={3}
                xl={3}
                style={{
                  display:
                    operationOption === 'air' || operationOption === 'sea' ? 'block' : 'none',
                }}
              >
                <div className="form-group">
                  <label
                    className="control-label"
                    htmlFor="loading_vagon_no"
                    style={{
                      display: operationOption === 'air' ? 'block' : 'none',
                    }}
                  >
                    HAWB No
                  </label>
                  <label
                    className="control-label"
                    htmlFor="loading_vagon_no"
                    style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
                  >
                    HBL No
                  </label>
                  <CFormInput
                    className="form-control-cst string "
                    type="text"
                    name="vagonNo"
                    id="loading_vagon_no"
                    value={bookingData.vagonNo}
                    invalid={bookingErrors && !isEmpty(bookingErrors.vagonNo) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'vagonNo', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.vagonNo}
                  </CFormFeedback>
                </div>
              </CCol>
              <CCol
                sm={4}
                md={3}
                lg={3}
                xl={3}
                style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
              >
                <div className="form-group date_picker  hblDate">
                  <label className="control-label date_picker " htmlFor="hblDate">
                    HBL Date
                  </label>
                  <DatePicker
                    selected={unLoadDateTime}
                    onChange={(date) => handleDateTime('hblDate', date)}
                    className="form-control form-control-cst"
                    style={{ paddingLeft: '2px', paddingRight: '2px' }}
                    dateFormat="MMMM d, yyyy h:mm"
                    id="loading_unload_date"
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'hblDate', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.hblDate) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.hblDate}
                  </CFormFeedback>
                </div>
              </CCol>
              <CCol
                sm={4}
                md={3}
                lg={3}
                xl={3}
                style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
              >
                <div
                  className="form-group select"
                  style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
                >
                  <label className="control-label select " htmlFor="telex">
                    Waybill Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="telex"
                    id="telex"
                    style={{
                      paddingRight: '23px',
                    }}
                    value={bookingData.telex}
                    invalid={bookingErrors && !isEmpty(bookingErrors.telex) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'telex', errorType: 'errBooking' }))
                    }
                  >
                    <option value=""></option>
                    <option value="original">Original B/L</option>
                    <option value="express">Express Release (Telex)</option>
                    <option value="sea_waybill">Sea Waybill</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.telex}
                  </CFormFeedback>
                </div>
              </CCol>
              <CCol
                sm={4}
                md={3}
                lg={3}
                xl={3}
                style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
              >
                <div
                  className="form-group integer"
                  style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
                >
                  <label className="control-label integer " htmlFor="freeTime">
                    Free Time
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="number"
                    step="1"
                    name="freeTime"
                    id="freeTime"
                    value={bookingData.freeTime}
                    invalid={bookingErrors && !isEmpty(bookingErrors.freeTime) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'freeTime', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.freeTime}
                  </CFormFeedback>
                </div>
              </CCol>
            </CRow>
            <div className="separator"></div>
            <CRow id="booking_form_buttons">
              <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton
                  type="submit"
                  color="info"
                  className="float-right"
                  disabled={creatingBooking ? true : false}
                >
                  {creatingBooking ? (
                    'Processing...'
                  ) : (
                    <span>
                      Next <i className="fa fa-arrow-right ml-2" />
                    </span>
                  )}
                </CButton>
              </div>
            </CRow>
          </div>
        </div>
      </form>

      {/* contact modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        size="lg"
        transition={false}
        visible={contactModal}
        onClose={() => closeContModal()}
      >
        <CModalHeader>
          <CModalTitle>New Contact</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form id="new_contact">
            <NewContact contactData={contactData} setContactData={setContactData} />
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="btn-default btn btn-success float-right"
            disabled={creatingContact ? true : false}
            onClick={(e) => handleSubmitContact(e)}
          >
            {creatingContact ? (
              'Processing...'
            ) : (
              <span>
                Save <i className="fa fa-check" />
              </span>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

GeneralInformation.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  bookingData: PropTypes.object.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
  handleNextBooking: PropTypes.func,
}

export default GeneralInformation
