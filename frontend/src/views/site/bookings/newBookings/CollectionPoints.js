import React, { useState } from 'react'
import { CCol, CFormFeedback, CFormInput, CFormSelect, CRow, CFormLabel } from '@coreui/react'
import PropTypes from 'prop-types'
import { isEmpty, isNull } from 'lodash'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import { Link } from 'react-router-dom'

const CollectionPoints = ({
  handleChangeForm,
  bookingData,
  handleSelectFocus,
  handleModalLocation,
  handleModalCity,
}) => {
  const dispatch = useDispatch()
  const { bookingErrors } = useSelector((state) => state.booking)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { locations, fetchingLocations } = useSelector((state) => state.location)
  const [loadDateTime, setLoadDateTime] = useState(new Date())
  const [loadingPlaceOption, setLoadingPlaceOption] = useState({
    other: false,
  })
  const [companyLinkId, setCompanyLinkId] = useState('')
  const [loaderCompLinkId, setLoaderCompLinkId] = useState('')
  const { cities, fetchingCities } = useSelector((state) => state.city)
  const [loadDataValue, setloadDataValue] = useState({
    loadCountry: '',
    loadCity: '',
  })
  const [changeForm, setChangeForm] = useState({
    loadPlace: `${bookingData.loadPlace}`,
    depZipCode: `${bookingData.depZipCode}`,
  })

  const handleSelectForm = (c, val) => {
    const f = val ? val.value : null
    const countryData = f && f.city ? countryList().getLabel(f.city.country) : null

    if (c === 'senderId') {
      setCompanyLinkId(f ? f.linkId : '')
      setChangeForm((state) => ({
        ...state,
        depZipCode: f.postcode ? f.postcode : '',
        loadPlace: f.address ? f.address : '',
      }))
      setloadDataValue((state) => ({
        ...state,
        loadCity: f && f.city ? { label: f.city.name, value: f.city.id } : '',
        loadCountry: countryData
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
      setLoaderCompLinkId(f.linkId)
      setChangeForm((state) => ({
        ...state,
        depZipCode: f.postcode ? f.postcode : '',
        loadPlace: f.address ? f.address : '',
      }))
      setloadDataValue((state) => ({
        ...state,
        loadCity: f && f.city ? { label: f.city.name, value: f.city.id } : '',
        loadCountry: countryData
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
        loadCity: g ? { label: g.name, value: g.id } : '',
        loadCountry: countryData ? { label: `${g.country}-${countryData}`, value: g.country } : '',
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
          loadCountry: val ? { label: val.label, value: val.value } : '',
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

  const handleSetChange = (e) => {
    handleChangeForm(e)
    const { name, value } = e.target
    setChangeForm({
      ...changeForm,
      [name]: value,
    })
  }

  const handleDateTime = (c, date) => {
    setLoadDateTime(date)
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleChangeLoadingPlace = (e) => {
    const { name, value } = e.target
    if (name === 'loadPlaceType') {
      if (value !== 'other') {
        setLoadingPlaceOption({
          other: true,
        })
      } else {
        setLoadingPlaceOption({
          other: false,
        })
      }
    }
    handleChangeForm(e)
  }

  const isWeekday = (date) => {
    const day = moment(date).format('D')
    return day !== 0 && day !== 6
  }

  const noOptionLocation = (e) => {
    // const val = e.inputValue

    return (
      <>
        <div>No results found</div>
        <div>
          {/* eslint-disable-next-line */}
          <a href="#" className="text-r" onClick={(e) => handleModalLocation(e)}>
            Add New Item
          </a>
        </div>
      </>
    )
  }

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

  const countryData = countryList().data

  return (
    <>
      <CCol sm={6} md={6} lg={12} xl={6}>
        <h4 className="bkPageTitle">Collection Points:-</h4>
      </CCol>
      <CCol sm={12} md={12} lg={12} xl={12}>
        <CRow>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group datetime_picker optional loading_load_date">
              <label className="control-label datetime_picker optional" htmlFor="loading_load_date">
                Loading Date
              </label>
              <DatePicker
                selected={loadDateTime}
                onChange={(date) => handleDateTime('loadDate', date)}
                showTimeSelect
                filterDate={isWeekday}
                className="form-control form-control-cst"
                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                dateFormat="yyyy-MM-dd  hh:mm"
              />
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.loadDate}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={5} md={3} lg={3} xl={3}>
            <div className="form-group">
              <CFormLabel className="control-label" htmlFor="senderId">
                Consignor
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
                    id="senderId"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder
                    isLoading={fetchingCompanies ? true : false}
                    isSearchable
                    name="senderId"
                    options={
                      companies && !fetchingCompanies && companies.length > 0
                        ? companies.map((itm) => ({
                            label: itm.name,
                            value: itm,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.senderId),
                    })}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('senderId', e)}
                    onMenuOpen={(e) => handleSelectFocus('senderId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.senderId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol md={1} sm={1} xs={2}>
            <div className="float-left"></div>
            {/* <div className="dropdown dropdown-inline mr-4 mt-6">
              <button
                type="button"
                title="Select Company Addresses"
                className="btn btn-sm btn-outline-secondary"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fad fa-search-location"></i>
              </button>
              <div className="dropdown-menu" id="sender_locations_address_list">
                <CFormInput
                  type="text"
                  className="form-control"
                  placeholder="Search.."
                  id="sender_locations_filter_input"
                  // onkeYup="KTApp.filterDropdownList('sender_locations_filter_input','sender_locations_address_list');"
                />
                <a className="dropdown-item" href="/">
                  Headquarters
                </a>
              </div>
            </div> */}
          </CCol>
          <CCol sm={5} md={3} lg={3} xl={3}>
            <div className="form-group">
              <label className="control-label" htmlFor="loading_loader_id">
                Loader Company
                {loaderCompLinkId !== '' && (
                  <Link
                    to={`/companies/${loaderCompLinkId}`}
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
                    id="loading_loader_id"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder
                    isLoading={fetchingCompanies ? true : false}
                    isSearchable
                    name="loaderId"
                    autoFocus={false}
                    options={
                      companies && !fetchingCompanies && companies.length > 0
                        ? companies.map((itm) => ({
                            label: itm.name,
                            value: itm,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loaderId),
                    })}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('loaderId', e)}
                    onMenuOpen={(e) => handleSelectFocus('loaderId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loaderId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={6} md={2} lg={2} xl={2}>
            <div className="form-group select loading_load_place_type">
              <label className="control-label select" htmlFor="loading_load_place_type">
                Loading Place
              </label>
              <div className="input-group">
                <CFormSelect
                  className="form-control-cst"
                  name="loadPlaceType"
                  id="loading_load_place_type"
                  value={bookingData.loadPlaceType}
                  invalid={bookingErrors && !isEmpty(bookingErrors.loadPlaceType) ? true : false}
                  onChange={(e) => handleChangeLoadingPlace(e)}
                  onFocus={() =>
                    dispatch(clearBookingError({ type: 'loadPlaceType', errorType: 'errBooking' }))
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
                  {bookingErrors.loadPlaceType}
                </CFormFeedback>
              </div>
            </div>
          </CCol>
          <CCol
            sm={6}
            md={3}
            lg={3}
            xl={3}
            style={{ display: loadingPlaceOption.other ? 'none' : '' }}
          >
            <div className="form-group string loading_load_place">
              <label className="control-label string" htmlFor="loading_load_place">
                Collection Address
              </label>
              <div>
                <div className="input-group">
                  <CFormInput
                    className="form-control-cst "
                    type="text"
                    name="loadPlace"
                    id="loading_load_place"
                    value={changeForm.loadPlace}
                    invalid={bookingErrors && !isEmpty(bookingErrors.loadPlace) ? true : false}
                    onChange={(e) => handleSetChange(e)}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'loadPlace', errorType: 'errBooking' }))
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadPlace}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol
            sm={6}
            md={3}
            lg={3}
            xl={3}
            style={{ display: loadingPlaceOption.other ? '' : 'none' }}
          >
            <div className="form-group place">
              <label className="control-label place" htmlFor="loading_load_place_id">
                Loading Port
              </label>
              <div>
                <div className="input-group">
                  <Select
                    id="loading_load_place_id"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder="-Select-"
                    isLoading={fetchingLocations ? true : false}
                    isSearchable
                    name="loadPlaceId"
                    options={
                      locations && !fetchingLocations && locations.length > 0
                        ? locations.map((itm) => ({
                            label: itm.text,
                            value: itm.id,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadPlaceId),
                    })}
                    noOptionsMessage={(e) => noOptionLocation(e)}
                    onChange={(e) => handleSelectForm('loadPlaceId', e)}
                    onMenuOpen={() => handleSelectFocus('loadPlaceId')}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadPlaceId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol
            sm={6}
            md={2}
            lg={2}
            xl={2}
            style={{ display: loadingPlaceOption.other ? 'none' : '' }}
          >
            <div className="form-group string loading_dep_zipcode">
              <label className="control-label string" htmlFor="loading_dep_zipcode">
                Loading Postcode
              </label>
              <CFormInput
                className="form-control-cst"
                type="text"
                name="depZipCode"
                id="loading_dep_zipcode"
                value={changeForm.depZipCode}
                invalid={bookingErrors && !isEmpty(bookingErrors.depZipCode) ? true : false}
                onChange={(e) => handleSetChange(e)}
                onFocus={() =>
                  dispatch(clearBookingError({ type: 'depZipCode', errorType: 'errBooking' }))
                }
              />
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.depZipCode}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol
            sm={6}
            md={2}
            lg={2}
            xl={2}
            style={{ display: loadingPlaceOption.other ? 'none' : '' }}
          >
            <div className="form-group city loading_load_city_id">
              <label className="control-label city" htmlFor="loading_load_city_id">
                Loading City
              </label>
              <div>
                <div className="input-group">
                  <Select
                    id="loading_load_city_id"
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isLoading={fetchingCities ? true : false}
                    isSearchable
                    name="loadCityId"
                    value={loadDataValue.loadCity}
                    options={
                      cities && !fetchingCities && cities.length > 0
                        ? cities.map((itm) => ({
                            label: itm.name,
                            value: itm,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadCityId),
                    })}
                    noOptionsMessage={() => noOptionCity()}
                    onChange={(e) => handleSelectForm('loadCityId', e)}
                    onMenuOpen={(e) => handleSelectFocus('loadCityId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadCityId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group select loading_load_coun">
              <label className="control-label select" htmlFor="loadingCountry">
                Loading Country
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadingCountry),
                    })}
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder="-Select-"
                    isSearchable
                    value={loadDataValue.loadCountry}
                    isLoading={countryData && !countryData.length > 0 ? true : false}
                    id="loadingCountry"
                    options={
                      countryData && countryData.length > 0
                        ? countryData.map((item) => ({
                            value: item.value,
                            label: `${item.value ? item.value + '-' : ''}${item.label}`,
                          }))
                        : []
                    }
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('loadingCountry', e)}
                    onMenuOpen={(e) => handleSelectFocus('loadingCountry', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadingCountry}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group place loading_load_custom_id">
              <label className="control-label place" htmlFor="loading_load_custom_id">
                Load Customs *
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadCustomId),
                    })}
                    id="loading_load_custom_id"
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    isLoading={countryData && !countryData.length > 0 ? true : false}
                    options={
                      countryData && countryData.length > 0
                        ? countryData.map((item) => ({
                            value: item.value,
                            label: `${item.value ? item.value + '-' : ''}${item.label}`,
                          }))
                        : []
                    }
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('loadCustomId', e)}
                    onMenuOpen={(e) => handleSelectFocus('loadCustomId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadCustomId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group company ">
              <label className="control-label company" htmlFor="load_customofficer_id">
                Customs Broker
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadCustomOfficerId),
                    })}
                    id="load_customofficer_id"
                    classNamePrefix="cstSelect"
                    isClearable
                    placeholder
                    isSearchable
                    options={[]}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('loadCustomOfficerId', e)}
                    onMenuOpen={(e) => handleSelectFocus('loadCustomOfficerId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadCustomOfficerId}
                  </CFormFeedback>
                </div>
              </div>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group select">
              <label
                className="control-label select optional"
                htmlFor="loading_check_load_customofficer"
              >
                Will visit customs broker ?
              </label>
              <CFormSelect
                className="form-control-cst"
                name="checkLoadCustomOfficer"
                id="check_load_customofficer"
                value={bookingData.checkLoadCustomOfficer}
                invalid={
                  bookingErrors && !isEmpty(bookingErrors.checkLoadCustomOfficer) ? true : false
                }
                onChange={(e) => handleChangeForm(e)}
                onFocus={() =>
                  dispatch(
                    clearBookingError({ type: 'checkLoadCustomOfficer', errorType: 'errBooking' }),
                  )
                }
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </CFormSelect>
              <CFormFeedback invalid className="fieldError-cst">
                {bookingErrors.checkLoadCustomOfficer}
              </CFormFeedback>
            </div>
          </CCol>
          <CCol sm={6} md={3} lg={3} xl={3}>
            <div className="form-group place optional loading_load_center_id">
              <label className="control-label place optional" htmlFor="loading_load_center_id">
                Load Center
              </label>
              <div>
                <div className="input-group">
                  <Select
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': bookingErrors && !isEmpty(bookingErrors.loadCenterId),
                    })}
                    id="loading_load_center_id"
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
                    onChange={(e) => handleSelectForm('loadCenterId', e)}
                    onFocus={(e) => handleSelectFocus('loadCenterId', e)}
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.loadCenterId}
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

CollectionPoints.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  handleModalLocation: PropTypes.func.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
  bookingData: PropTypes.object,
  handleModalCity: PropTypes.func.isRequired,
}

export default CollectionPoints
