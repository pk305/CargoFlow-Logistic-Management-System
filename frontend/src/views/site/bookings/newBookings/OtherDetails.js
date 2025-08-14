import React from 'react'
import {
  CCol,
  CFormCheck,
  CFormInput,
  CRow,
  CFormFeedback,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { isEmpty, isNull } from 'lodash'
import CurrencyList from 'currency-list'
import { useDispatch, useSelector } from 'react-redux'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import Select from 'react-select'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'

const OtherDetails = ({ handleChangeForm, bookingData, handleSelectFocus }) => {
  const dispatch = useDispatch()

  const { bookingErrors } = useSelector((state) => state.booking)

  const handleSelectForm = (c, val) => {
    const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
    handleChangeForm(e)
  }

  const currencyList = Object.entries(CurrencyList.getAll('en_US'))

  return (
    <>
      <CCol sm={6} md={6} lg={12} xl={6}>
        <h4 className="bkPageTitle">Other Details</h4>
      </CCol>
      <CCol sm={12} md={12} lg={12} xl={12}>
        <CRow>
          <CCol sm={4} md={2} lg={2} xl={2}>
            <div className="form-group decimal loading_freight_price">
              <label className="control-label decimal" htmlFor="loading_freight_price">
                Freight Price
              </label>
              <CFormInput
                className="form-control-cst"
                type="text"
                name="freightPrice"
                id="loading_freight_price"
                value={bookingData.freightPrice}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'freightPrice', errorType: 'errBooking' }))
                }
                invalid={bookingErrors && !isEmpty(bookingErrors.freightPrice) ? true : false}
              />
              <CFormFeedback
                invalid={bookingErrors && !isEmpty(bookingErrors.freightPrice) ? true : false}
                className="fieldError-cst"
              >
                {bookingErrors.freightPrice}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={4} md={2} lg={2} xl={2}>
            <div className="form-group select loading_freight_curr">
              <label className="control-label select" htmlFor="loading_freight_curr">
                Currency
              </label>
              <div className="input-group">
                <Select
                  className={classNames('form-control form-control-cst pageCstSelect ', {
                    'is-invalid': bookingErrors && !isEmpty(bookingErrors.freightCurr),
                  })}
                  classNamePrefix="cstSelect"
                  isClearable
                  placeholder
                  isSearchable
                  id="loading_freight_curr"
                  menuPlacement="auto"
                  options={
                    currencyList && currencyList.length > 0
                      ? currencyList.map((item) => ({
                          value: item[0],
                          label: item[0],
                        }))
                      : []
                  }
                  noOptionsMessage={() => 'No results found'}
                  isLoading={currencyList && !currencyList.length > 0 ? true : false}
                  onChange={(e) => handleSelectForm('freightCurr', e)}
                  onFocus={(e) => handleSelectFocus('freightCurr', e)}
                />
                <CFormFeedback
                  invalid={bookingErrors && !isEmpty(bookingErrors.freightCurr) ? true : false}
                  className="fieldError-cst"
                >
                  {bookingErrors.freightCurr}
                </CFormFeedback>
              </div>
            </div>
          </CCol>
          <CCol sm={4} md={2} lg={2} xl={2}>
            <div className="form-group select loading_incoterm">
              <label className="control-label select" htmlFor="loading_incoterm">
                Incoterm
              </label>
              <CFormSelect
                className="form-control-cst"
                name="incoterm"
                id="loading_incoterm"
                value={bookingData.incoterm}
                invalid={bookingErrors && !isEmpty(bookingErrors.incoterm) ? true : false}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'incoterm', errorType: 'errBooking' }))
                }
              >
                <option value=""></option>
                <option value="CFR">CFR</option>
                <option value="CIF">CIF</option>
                <option value="CIP">CIP</option>
                <option value="CPT">CPT</option>
                <option value="DAP">DAP</option>
                <option value="DPU">DPU</option>
                <option value="DDP">DDP</option>
                <option value="EXW">EXW</option>
                <option value="FAS">FAS</option>
                <option value="FCA">FCA</option>
                <option value="FOB">FOB</option>
                <option value="FOT">FOT</option>
                <option value="FOR">FOR</option>
              </CFormSelect>
              <CFormFeedback
                invalid={bookingErrors && !isEmpty(bookingErrors.incoterm) ? true : false}
                className="fieldError-cst"
              >
                {bookingErrors.incoterm}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={4} md={2} lg={2} xl={2}>
            <div className="form-group select loading_ppcc">
              <label className="control-label select" htmlFor="loading_ppcc">
                Payment Term
              </label>
              <CFormSelect
                className="form-control-cst"
                name="ppcc"
                id="loading_ppcc"
                value={bookingData.ppcc}
                invalid={bookingErrors && !isEmpty(bookingErrors.ppcc) ? true : false}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'ppcc', errorType: 'errBooking' }))
                }
              >
                <option value=""></option>
                <option value="pp">Prepaid</option>
                <option value="cc">Collect</option>
              </CFormSelect>
              <CFormFeedback
                invalid={bookingErrors && !isEmpty(bookingErrors.incoterm) ? true : false}
                className="fieldError-cst"
              >
                {bookingErrors.incoterm}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={2} md={1} lg={1} xl={1}>
            <div className="form-group">
              <label className="control-label" htmlFor="letterOfCredit">
                Letter Of Credit
              </label>
              <div className="checkbox-custom checkbox-primary">
                <CFormCheck
                  type="checkbox"
                  id="letterOfCredit"
                  className="form-control-cst"
                  name="letterOfCredit"
                  checked={bookingData.letterOfCredit ? true : false}
                  // invalid={bookingErrors && !isEmpty(bookingErrors.letterOfCredit) ? true : false}
                  onChange={(e) => handleChangeForm(e)}
                  onFocus={() =>
                    dispatch(clearBookingError({ type: 'letterOfCredit', errorType: 'errBooking' }))
                  }
                />
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group text loading_notes">
              <label className="control-label text" htmlFor="loading_notes">
                Notes
              </label>
              <CFormTextarea
                className="form-control-cst text"
                rows="1"
                name="notes"
                id="loading_notes"
                value={bookingData.notes}
                invalid={bookingErrors && !isEmpty(bookingErrors.notes) ? true : false}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'notes', errorType: 'errBooking' }))
                }
              ></CFormTextarea>
              <CFormFeedback
                invalid={bookingErrors && !isEmpty(bookingErrors.notes) ? true : false}
                className="fieldError-cst"
              >
                {bookingErrors.notes}
              </CFormFeedback>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} md={12} lg={12} xl={12}>
            <div className="separator "></div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group company loading_agent_id">
              <label className="control-label company" htmlFor="loading_agent_id">
                Agent Company
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.agentId),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    id="loading_agent_id"
                    menuPlacement="auto"
                    options={[]}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('agentId', e)}
                    onFocus={(e) => handleSelectFocus('agentId', e)}
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.agentId) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.agentId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group string loading_agent_ref">
              <label className="control-label string" htmlFor="loading_agent_ref">
                Agent Reference
              </label>
              <CFormInput
                className="form-control string"
                type="text"
                name="agentRef"
                id="loading_agent_ref"
                value={bookingData.agentRef}
                invalid={bookingErrors && !isEmpty(bookingErrors.agentRef) ? true : false}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'agentRef', errorType: 'errBooking' }))
                }
              />
              <CFormFeedback
                invalid={bookingErrors && !isEmpty(bookingErrors.agentRef) ? true : false}
                className="fieldError-cst"
              >
                {bookingErrors.agentRef}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group company loading_notify1_id">
              <label className="control-label company" htmlFor="loading_notify1_id">
                Notify Company
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.notify1Id),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    id="loading_notify1_id"
                    menuPlacement="auto"
                    options={[]}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('notify1Id', e)}
                    onFocus={(e) => handleSelectFocus('notify1Id', e)}
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.notify1Id) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.notify1Id}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group company loading_notify2_id">
              <label className="control-label company" htmlFor="loading_notify2_id">
                Notify Company2
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.notify2Id),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    id="loading_notify2_id"
                    menuPlacement="auto"
                    options={[]}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('notify2Id', e)}
                    onFocus={(e) => handleSelectFocus('notify2Id', e)}
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.notify2Id) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.notify2Id}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group select loading_service_type_id">
              <label className="control-label select" htmlFor="loading_service_type_id">
                Service Type
              </label>
              <div className="input-group">
                <Select
                  className={classNames('form-control form-control-cst pageCstSelect ', {
                    'is-invalid': bookingErrors && !isEmpty(bookingErrors.serviceTypeId),
                  })}
                  classNamePrefix="cstSelect"
                  isClearable
                  placeholder
                  isSearchable
                  id="loading_service_type_id"
                  menuPlacement="auto"
                  options={[]}
                  noOptionsMessage={() => 'No results found'}
                  onChange={(e) => handleSelectForm('serviceTypeId', e)}
                  onFocus={(e) => handleSelectFocus('serviceTypeId', e)}
                />
                <CFormFeedback
                  invalid={bookingErrors && !isEmpty(bookingErrors.serviceTypeId) ? true : false}
                  className="fieldError-cst"
                >
                  {bookingErrors.serviceTypeId}
                </CFormFeedback>
              </div>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={4} md={3} lg={3} xl={3}>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group decimal loading_product_price">
                  <label className="control-label decimal" htmlFor="loading_product_price">
                    Product Price
                  </label>
                  <CFormInput
                    className="form-control numeric decimal text-align-right"
                    type="number"
                    step="any"
                    name="productPrice"
                    id="loading_product_price"
                    value={bookingData.productPrice}
                    invalid={bookingErrors && !isEmpty(bookingErrors.productPrice) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'productPrice', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.productPrice) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.productPrice}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group select loading_product_curr">
                  <label className="control-label select" htmlFor="loading_product_curr">
                    Currency
                  </label>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': bookingErrors && !isEmpty(bookingErrors.productCurr),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isSearchable
                      id="product_curr"
                      menuPlacement="auto"
                      options={
                        currencyList && currencyList.length > 0
                          ? [{ label: '', value: '' }, ...currencyList].map((item) => ({
                              value: item[0],
                              label: item[0],
                            }))
                          : []
                      }
                      noOptionsMessage={() => 'No results found'}
                      isLoading={currencyList && !currencyList.length > 0 ? true : false}
                      onChange={(e) => handleSelectForm('productCurr', e)}
                      onFocus={(e) => handleSelectFocus('productCurr', e)}
                    />
                    <CFormFeedback
                      invalid={bookingErrors && !isEmpty(bookingErrors.productCurr) ? true : false}
                      className="fieldError-cst"
                    >
                      {bookingErrors.productCurr}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={4} md={2} lg={2} xl={2}>
            <div className="form-group select loading_channel">
              <label className="control-label select" htmlFor="loading_channel">
                Channel
              </label>
              <CFormSelect
                className="form-control-cst"
                name="channel"
                id="loading_check_unload_customofficer"
                value={bookingData.channel}
                invalid={bookingErrors && !isEmpty(bookingErrors.channel) ? true : false}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'channel', errorType: 'errBooking' }))
                }
              >
                <option value=""></option>
                <option value="ourload">Our Load</option>
                <option value="agent">Agent</option>
                <option value="partner">Partner</option>
              </CFormSelect>
              <CFormFeedback
                invalid={bookingErrors && !isEmpty(bookingErrors.channel) ? true : false}
                className="fieldError-cst"
              >
                {bookingErrors.channel}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group datetime_picker loading_document_date">
              <label className="control-label datetime_picker" htmlFor="loading_document_date">
                Document Date
              </label>
              <DatePicker
                selected={bookingData.documentDate}
                onChange={(e) => handleSelectForm('documentDate', e)}
                showTimeSelect
                className="form-control form-control-cst"
                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                dateFormat="MMMM d, yyyy h:mm"
                id="loading_document_date"
              />
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.documentDate}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group project loading_project_id">
              <label className="control-label project" htmlFor="loading_project_id">
                Logistics Project
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.projectId),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    id="loading_project_id"
                    menuPlacement="auto"
                    options={[]}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('projectId', e)}
                    onFocus={(e) => handleSelectFocus('projectId', e)}
                  />
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.projectId) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.projectId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
      </CCol>
    </>
  )
}

OtherDetails.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
  bookingData: PropTypes.object,
}

export default OtherDetails
