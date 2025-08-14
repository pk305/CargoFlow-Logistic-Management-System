import React, { useState } from 'react'
import { CCol, CFormFeedback, CFormInput, CRow, CFormSelect } from '@coreui/react'
import PropTypes from 'prop-types'
import { isEmpty, isNull } from 'lodash'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useDispatch, useSelector } from 'react-redux'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Link } from 'react-router-dom'

const DeliveryPoints = ({ handleChangeForm, bookingData, handleSelectFocus, handleModalCity }) => {
  const dispatch = useDispatch()
  const { bookingErrors } = useSelector((state) => state.booking)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { locations, fetchingLocations } = useSelector((state) => state.location)
  const [deliveryPlaceOption, setDeliveryPlaceOption] = useState({
    other: true,
  })
  const [unLoadDateTime, setUnLoadDateTime] = useState('')
  const [terminDateTime, setTerminDateTime] = useState('')
  const [companyLinkId, setCompanyLinkId] = useState('')
  const [loadDataValue, setloadDataValue] = useState({
    unLoadingCountry: '',
    unLoadCity: '',
  })
  // const [changeForm, setChangeForm] = useState({
  //   loadPlace: `${bookingData.loadPlace}`,
  //   depZipCode: `${bookingData.depZipCode}`,
  // })
  // const [loaderCompLinkId, setLoaderCompLinkId] = useState('')
  const { cities, fetchingCities } = useSelector((state) => state.city)

  const noOptionCity = (e) => {
    return (
      <>
        <div>No results found</div>
        <div>
          {/* eslint-disable-next-line */}
          <a href="#" className="text-r" onClick={(e) => handleModalCity(e)}>
            Add New Item
          </a>
        </div>
      </>
    )
  }

  const handleSelectForm = (c, val) => {
    const f = val ? val.value : null
    const countryData = f && f.city ? countryList().getLabel(f.city.country) : null

    if (c === 'consigneeId') {
      setCompanyLinkId(f ? f.linkId : '')
      // setChangeForm((state) => ({
      //   ...state,
      //   depZipCode: f.postcode ? f.postcode : '',
      //   loadPlace: f.address ? f.address : '',
      // }))
      setloadDataValue((state) => ({
        ...state,
        unLoadCity: f && f.city ? { label: f.city.name, value: f.city.id } : '',
        unLoadingCountry: countryData
          ? { label: `${f.city.country}-${countryData}`, value: f.city.country }
          : '',
      }))
      const e = {
        target: {
          name: c,
          value: f ? f.id : '',
        },
      }
      handleChangeForm(e)
    } else if (c === 'loaderId') {
      // setLoaderCompLinkId(f.linkId)
      // setChangeForm((state) => ({
      //   ...state,
      //   depZipCode: f.postcode ? f.postcode : '',
      //   loadPlace: f.address ? f.address : '',
      // }))
      setloadDataValue((state) => ({
        ...state,
        unLoadCity: f && f.city ? { label: f.city.name, value: f.city.id } : '',
        unLoadingCountry: countryData
          ? { label: `${f.city.country}-${countryData}`, value: f.city.country }
          : '',
      }))
      const e = {
        target: {
          name: c,
          value: f ? f.id : '',
        },
      }
      handleChangeForm(e)
    } else if (c === 'loadCityId') {
      const g = val ? val.value : null
      const countryData = g ? countryList().getLabel(g.country) : null
      setloadDataValue((state) => ({
        ...state,
        unLoadCity: g ? { label: g.name, value: g.id } : '',
        unLoadingCountry: countryData
          ? { label: `${g.country}-${countryData}`, value: g.country }
          : '',
      }))
      const e = {
        target: {
          name: c,
          value: g ? g.id : '',
        },
      }
      handleChangeForm(e)
    } else {
      if (c === 'loadingCountry') {
        setloadDataValue((state) => ({
          ...state,
          unLoadingCountry: val ? { label: val.label, value: val.value } : '',
        }))
      }
      const e = {
        target: {
          name: c,
          value: val ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const handleChangeDeliveryPlace = (e) => {
    handleChangeForm(e)
    if (e.target.value === 'other') {
      setDeliveryPlaceOption({
        other: true,
      })
    } else {
      setDeliveryPlaceOption({
        other: false,
      })
    }
  }

  const handleDateTime = (c, date) => {
    if (c === 'unloadDate') {
      setUnLoadDateTime(date)
    } else if (c === 'terminDate') {
      setTerminDateTime(date)
    }

    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const countryData = countryList().data

  return (
    <>
      <CCol sm={6} md={6} lg={12} xl={6}>
        <h4 className="bkPageTitle">Delivery Points</h4>
      </CCol>
      <CCol sm={12} md={12} lg={12} xl={12}>
        <CRow>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group datetime_picker optional loading_unload_date">
              <label
                className="control-label datetime_picker optional"
                htmlFor="loading_unload_date"
              >
                Unloading Date
              </label>
              <DatePicker
                selected={unLoadDateTime}
                onChange={(date) => handleDateTime('unloadDate', date)}
                showTimeSelect
                className="form-control form-control-cst"
                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                dateFormat="MMMM d, yyyy h:mm"
                id="loading_unload_date"
              />
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.unloadDate}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group company optional loading_consignee_id">
              <label className="control-label company optional" htmlFor="loading_consignee_id">
                Consignee
                {companyLinkId !== '' && (
                  <Link
                    to={`/companies/${companyLinkId}`}
                    target="_blank"
                    className="float-right profile-link"
                  >
                    Profile
                  </Link>
                )}
              </label>
              <div>
                <div className="input-group">
                  <Select
                    id="loading_consignee_id"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder
                    isLoading={fetchingCompanies ? true : false}
                    isSearchable
                    name="consigneeId"
                    options={
                      companies && !fetchingCompanies && companies.length > 0
                        ? companies.map((itm) => ({
                            label: itm.name,
                            value: itm,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.consigneeId),
                    })}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('consigneeId', e)}
                    onMenuOpen={(e) => handleSelectFocus('consigneeId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.consigneeId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={1} md={1} xs={2} className="justify-content-center align-self-center">
            <div data-role="consignee_locations" className="float-left"></div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group company optional loading_delivery_id" data-select2-id="2471">
              <label className="control-label company optional" htmlFor="loading_delivery_id">
                Delivery Company
              </label>
              <div>
                <div className="input-group">
                  <Select
                    id="deliveryId"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder
                    isLoading={fetchingCompanies ? true : false}
                    isSearchable
                    name="deliveryId"
                    options={
                      companies && !fetchingCompanies && companies.length > 0
                        ? companies.map((itm) => ({
                            label: itm.name,
                            value: itm.id,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.deliveryId),
                    })}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('deliveryId', e)}
                    onMenuOpen={(e) => handleSelectFocus('deliveryId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.deliveryId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={1} md={1} xs={2} className="justify-content-center align-self-center">
            <div data-role="delivery_locations" className="float-left"></div>
          </CCol>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group datetime_picker optional loading_termin_date">
              <label
                className="control-label datetime_picker optional"
                htmlFor="loading_termin_date"
              >
                ETA
              </label>
              <DatePicker
                selected={terminDateTime}
                onChange={(date) => handleDateTime('terminDate', date)}
                showTimeSelect
                className="form-control form-control-cst"
                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                dateFormat="MMMM d, yyyy h:mm"
                id="loading_termin_date"
              />
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.terminDate}
              </CFormFeedback>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group select">
              <label className="control-label select optional" htmlFor="loading_unload_place_type">
                Delivery Place
              </label>
              <CFormSelect
                className="form-control-cst"
                name="unLoadPlaceType"
                id="loading_unload_place_type"
                value={bookingData.unLoadPlaceType}
                invalid={bookingErrors && !isEmpty(bookingErrors.unLoadPlaceType) ? true : false}
                onChange={(e) => handleChangeDeliveryPlace(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'unLoadPlaceType', errorType: 'errBooking' }))
                }
              >
                <option value="other">Other</option>
                <option value="sea">Seaport</option>
                <option value="air">Airport</option>
                <option value="rail">Station</option>
                <option value="warehouse">Warehouse</option>
                <option value="custom">Customs Offices</option>
                <option value="customer">Company Location</option>
              </CFormSelect>
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.unLoadPlaceType}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={6} md={3} xs={12} style={{ display: !deliveryPlaceOption.other ? 'none' : '' }}>
            <div className="form-group string optional loading_unload_place">
              <label className="control-label string optional" htmlFor="loading_unload_place">
                Delivery Address
              </label>
              <div>
                <div className="input-group">
                  <CFormInput
                    className="form-control string optional"
                    data-address-role="destination_address"
                    type="text"
                    name="unloadPlace"
                    id="loading_unload_place"
                    value={bookingData.unloadPlace}
                    invalid={bookingErrors && !isEmpty(bookingErrors.unloadPlace) ? true : false}
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'unloadPlace', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.unloadPlace}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} xs={12} style={{ display: deliveryPlaceOption.other ? 'none' : '' }}>
            <div className="form-group">
              <label className="control-label" htmlFor="loading_unload_place_id">
                Unloading Port
              </label>
              <div>
                <div className="input-group">
                  <div className="input-group">
                    <Select
                      id="loading_load_place_id"
                      classNamePrefix="cstSelect"
                      isClearable={true}
                      placeholder
                      isLoading={fetchingCompanies ? true : false}
                      isSearchable
                      name="unLoadPlaceId"
                      autoFocus={false}
                      options={
                        locations && !fetchingLocations && locations.length > 0
                          ? locations.map((itm) => ({
                              label: itm.text,
                              value: itm.id,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': bookingErrors && !isEmpty(bookingErrors.unLoadPlaceId),
                      })}
                      noOptionsMessage={() => 'No results found'}
                      onChange={(e) => handleSelectForm('unLoadPlaceId', e)}
                      onMenuOpen={() => handleSelectFocus('unLoadPlaceId')}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.unLoadPlaceId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </CCol>
          <CCol
            sm={6}
            md={2}
            lg={2}
            xl={2}
            style={{ display: !deliveryPlaceOption.other ? 'none' : '' }}
          >
            <div className="form-group string optional loading_arv_zipcode">
              <label className="control-label string optional" htmlFor="loading_arv_zipcode">
                Delivery Postcode
              </label>
              <CFormInput
                className="form-control-cst string "
                type="text"
                name="arvZipCode"
                id="loading_arv_zipcode"
                value={bookingData.arvZipCode}
                invalid={bookingErrors && !isEmpty(bookingErrors.arvZipCode) ? true : false}
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'arvZipCode', errorType: 'errBooking' }))
                }
              />
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.arvZipCode}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol
            sm={6}
            md={2}
            lg={2}
            xl={2}
            style={{ display: !deliveryPlaceOption.other ? 'none' : '' }}
          >
            <div className="form-group city optional loading_unload_city_id">
              <label className="control-label city optional" htmlFor="loading_unload_city_id">
                Delivery City
              </label>
              <div>
                <div className="input-group">
                  <Select
                    id="loading_unload_city_id"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder
                    isSearchable
                    name="unLoadCityId"
                    value={loadDataValue.unLoadCity}
                    options={
                      cities && !fetchingCities && cities.length > 0
                        ? cities.map((itm) => ({
                            label: itm.name,
                            value: itm,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.unLoadCityId),
                    })}
                    noOptionsMessage={() => noOptionCity()}
                    onChange={(e) => handleSelectForm('unLoadCityId', e)}
                    onMenuOpen={(e) => handleSelectFocus('unLoadCityId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.unLoadCityId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol md={3} sm={6} xs={12}>
            <div className="form-group select optional  ">
              <label className="control-label select optional" htmlFor="loading_unload_coun">
                Arrival Country
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.unLoadingCountry),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder="-Select-"
                    isSearchable
                    id="unLoadingCountry"
                    options={
                      countryData && countryData.length > 0
                        ? countryData.map((item) => ({
                            value: item.value,
                            label: `${item.value ? item.value + '-' : ''}${item.label}`,
                          }))
                        : []
                    }
                    noOptionsMessage={() => 'No results found'}
                    isLoading={countryData && !countryData.length > 0 ? true : false}
                    onChange={(e) => handleSelectForm('unLoadingCountry', e)}
                    onMenuOpen={(e) => handleSelectFocus('unLoadingCountry', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.unLoadingCountry}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} xs={12}></CCol>
        </CRow>
        <CRow>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group">
              <label className="control-label place optional" htmlFor="loading_unload_custom_id">
                Unload Customs <span>*</span>
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.unLoadCustomId),
                    })}
                    id="loading_unload_custom_id"
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    isLoading={fetchingLocations ? true : false}
                    options={
                      locations && !fetchingLocations && locations.length > 0
                        ? locations.map((itm) => ({
                            label: itm.text,
                            value: itm.id,
                          }))
                        : []
                    }
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('unLoadCustomId', e)}
                    onMenuOpen={(e) => handleSelectFocus('unLoadCustomId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.unLoadCustomId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group company optional loading_unload_customofficer_id">
              <label
                className="control-label company optional"
                htmlFor="loading_unload_customofficer_id"
              >
                Customs Broker
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.unLoadCustomOfficerId),
                    })}
                    id="loading_unload_customofficer_id"
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    isLoading={countryData && !countryData.length > 0 ? true : false}
                    options={[]}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('unLoadCustomOfficerId', e)}
                    onMenuOpen={(e) => handleSelectFocus('unLoadCustomOfficerId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.unLoadCustomOfficerId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group select optional loading_check_unload_customofficer">
              <label
                className="control-label select optional"
                htmlFor="loading_check_unload_customofficer"
              >
                Will visit customs broker ?
              </label>
              <CFormSelect
                className="form-control-cst"
                name="unloadCustomerOfficer"
                id="loading_check_unload_customofficer"
                value={bookingData.unloadCustomerOfficer}
                invalid={
                  bookingErrors && !isEmpty(bookingErrors.unloadCustomerOfficer) ? true : false
                }
                onChange={(e) => handleChangeDeliveryPlace(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'unLoadPlaceType', errorType: 'errBooking' }))
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </CFormSelect>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group place optional loading_unload_center_id">
              <label className="control-label place optional" htmlFor="loading_unload_center_id">
                Unload Center
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.unloadCenterId),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    id="loading_unload_center_id"
                    isLoading={fetchingLocations ? true : false}
                    options={
                      locations && !fetchingLocations && locations.length > 0
                        ? locations.map((itm) => ({
                            label: itm.text,
                            value: itm.id,
                          }))
                        : []
                    }
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('unloadCenterId', e)}
                    onMenuOpen={(e) => handleSelectFocus('unloadCenterId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.unloadCenterId}
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

DeliveryPoints.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  bookingData: PropTypes.object.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
  handleModalCity: PropTypes.func.isRequired,
}

export default DeliveryPoints
