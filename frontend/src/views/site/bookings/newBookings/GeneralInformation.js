import React, { useState } from 'react'
import { CRow, CCol, CFormInput, CFormLabel, CFormFeedback, CFormSelect } from '@coreui/react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { isEmpty, isNull } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import { Link } from 'react-router-dom'

const GeneralInformation = ({ handleChangeForm, bookingData, handleSelectFocus }) => {
  const dispatch = useDispatch()
  const [operationOption, setOperationOption] = useState('road')
  const { bookingErrors } = useSelector((state) => state.booking)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { fetchingUsers, users } = useSelector((state) => state.user)
  const { authUser } = useSelector((state) => state.auth)
  const [companyLinkId, setCompanyLinkId] = useState('')
  const [companyContacts, setCompanyContacts] = useState([])
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)

  const handleSelectForm = (c, val) => {
    if (c === 'customerCompany') {
      setCompanyLinkId(val ? val.value.linkId : '')
      setCompanyContacts(val ? val.value.contacts : '')

      const e = { target: { name: c, value: !isNull(val) ? val.value.id : '' } }
      handleChangeForm(e)
    } else if (c === 'operationId') {
      const op = val.value
      setOperationOption(op ? op.slug : 'road')

      const e = { target: { name: c, value: !isNull(val) ? op.id : '' } }
      handleChangeForm(e)
    } else {
      const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
      handleChangeForm(e)
    }
  }

  return (
    <>
      <CCol sm={6} md={6} lg={12} xl={6}>
        <h4 className="bkPageTitle mt-0">General Information:-</h4>
      </CCol>
      <CCol sm={12} md={12} lg={12} xl={12}>
        <div>
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
                      noOptionsMessage={() => 'No results found'}
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
            <CCol sm={4} md={2} lg={2} xl={2}>
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
            <CCol sm={10} md={2} lg={2} xl={2}>
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
            <CCol sm={4} md={2} lg={2} xl={2}>
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
                      defaultValue={{
                        label: `${authUser && authUser.branch.name}`,
                        value: `${authUser && authUser.branch.id}`,
                      }}
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
            <CCol sm={12} md={12} lg={12} xl={12}>
              <span id="company_financial_details"></span>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={4} md={4} lg={2} xl={2}>
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
            <CCol
              sm={4}
              md={2}
              lg={2}
              xl={2}
              className="pl-0 pr-0"
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
            <CCol
              sm={2}
              md={2}
              lg={2}
              xl={2}
              style={{
                display: operationOption === 'air' || operationOption === 'sea' ? 'block' : 'none',
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
              sm={2}
              md={2}
              lg={2}
              xl={2}
              style={{ display: operationOption === 'sea' ? 'block' : 'none' }}
            >
              <div className="form-group date_picker  hblDate">
                <label className="control-label date_picker " htmlFor="hblDate">
                  HBL Date
                </label>
                <CFormInput
                  className="form-control-cst string date_picker  flatpickr-input"
                  placeholder=""
                  tabIndex="0"
                  type="text"
                  name="hblDate"
                  id="hblDate"
                  value={bookingData.hblDate}
                  invalid={bookingErrors && !isEmpty(bookingErrors.hblDate) ? true : false}
                  onChange={(e) => handleChangeForm(e)}
                  onFocus={() =>
                    dispatch(clearBookingError({ type: 'hblDate', errorType: 'errBooking' }))
                  }
                />
                <CFormFeedback invalid className="fieldError-cst">
                  {bookingErrors.hblDate}
                </CFormFeedback>
              </div>
            </CCol>
            <CCol
              sm={2}
              md={2}
              lg={2}
              xl={2}
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
              sm={2}
              md={2}
              lg={2}
              xl={2}
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
        </div>
      </CCol>
    </>
  )
}

GeneralInformation.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  bookingData: PropTypes.object.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
}

export default GeneralInformation
