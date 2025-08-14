import React, { useState } from 'react'
import {
  CCol,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CRow,
  CFormLabel,
  CButton,
  CDropdownToggle,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownItemPlain,
} from '@coreui/react'
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
import $ from 'jquery'

const CollectionPoints = ({
  handleChangeForm,
  bookingData,
  handleSelectFocus,
  handleModalLocation,
  handleModalCity,
  handleCollectionBooking,
}) => {
  const dispatch = useDispatch()
  const { updatingBooking, bookingErrors } = useSelector((state) => state.booking)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { locations, fetchingLocations } = useSelector((state) => state.location)
  const [loadDateTime, setLoadDateTime] = useState(new Date())
  const [loadingPlaceOption, setLoadingPlaceOption] = useState({
    other: false,
  })
  const [companyLink, setCompanyLink] = useState('')
  const [loaderCompLink, setLoaderCompLink] = useState('')
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
      setCompanyLink(f ? f : '')
      setChangeForm((state) => ({
        ...state,
        depZipCode: f && f.postcode ? f.postcode : '',
        loadPlace: f && f.address ? f.address : '',
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
      setLoaderCompLink(f ? f : '')
      setChangeForm((state) => ({
        ...state,
        depZipCode: f && f.postcode ? f.postcode : '',
        loadPlace: f && f.address ? f.address : '',
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

  const handleConsignorLocation = (e, l) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')

    // console.log(l)
  }

  const handleLoaderLocation = (e, l) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')

    // console.log(l)
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
    <div>
      <form
        className="simple_form horizontal-form"
        id="new_loading"
        onSubmit={(e) => handleCollectionBooking(e, '3')}
      >
        <h4 className="cstPageTitle">Collection Point</h4>
        <h6 className="subTitleHeading">Step: 3/5</h6>
        <div className="separator"></div>
        <div className="row">
          <CCol sm={12} md={12} lg={12} xl={12}>
            <CRow>
              <CCol sm={6} md={2} lg={2} xl={2}>
                <div className="form-group datetime_picker optional loading_load_date">
                  <label
                    className="control-label datetime_picker optional"
                    htmlFor="loading_load_date"
                  >
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
                    {companyLink !== '' && (
                      <Link
                        to={`/companies/${companyLink.linkId}`}
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
              {/* {JSON.stringify(companyLink.locations)} */}
              {companyLink !== '' && (
                <CCol md={1} sm={1} xs={2} id="sender_locations" className="slidingDiv">
                  <CDropdown style={{ marginTop: '21px' }}>
                    <CDropdownToggle
                      color="secondary"
                      variant="outline"
                      caret={false}
                      title="Select Company Addresses"
                    >
                      <i className="fa fa-search-location"></i>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItemPlain className="p-0 pb-2">
                        <CFormInput
                          type="text"
                          placeholder="Search..."
                          id="sender_locations_filter_input"
                        />
                      </CDropdownItemPlain>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => handleConsignorLocation(e, companyLink)}
                      >
                        Headquaters
                      </CDropdownItem>
                      {companyLink && companyLink.locations && companyLink.locations.length > 0
                        ? companyLink.locations.map((l) => (
                            <CDropdownItem
                              key={l.id}
                              href="#"
                              onClick={(e) => handleConsignorLocation(e, l)}
                            >
                              {l.code} {l.name}
                            </CDropdownItem>
                          ))
                        : null}
                    </CDropdownMenu>
                  </CDropdown>
                  <div className="dropdown dropdown-inline mr-4 mt-6 hide">
                    <div
                      className="dropdown-menu show"
                      id="sender_locations_address_list"
                      // style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, -209px, 0px);"
                      x-placement="top-start"
                    >
                      {/* <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','0','Bilstop Logistics', 'other', '', '3973', 'WASHINGTON', 'US', '', '', '')"
                      >
                        Headquarters
                      </a>
                      <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','17167','Company Address', 'customer', '444 Alaska Avenue Suite #BFJ931 Torrance, CA 90503 USA 444 Alaska Avenue Suite #BFJ931 Torrance, CA 90503 USA', '19171', 'AABYBRO', 'DK', '474893', '33.843929', '-118.334119')"
                      >
                        080 Company Address
                      </a>
                      <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','17168','JDDL Address', 'customer', 'JDDL', '30120', '1 DECEMBRIE', 'RO', '', '', '')"
                      >
                        900 JDDL Address
                      </a>
                      <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','17175','Invoice Address', 'customer', 'Ma', '31571', '1360 VRHNIKA', 'SI', '', '45.966583', '14.297387')"
                      >
                        09 Invoice Address
                      </a> */}
                    </div>
                  </div>
                </CCol>
              )}
              <CCol sm={5} md={3} lg={3} xl={3}>
                <div className="form-group">
                  <label className="control-label" htmlFor="loading_loader_id">
                    Loader Company
                    {loaderCompLink !== '' && (
                      <Link
                        to={`/companies/${loaderCompLink.linkId}`}
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
              {loaderCompLink !== '' && (
                <CCol md={1} sm={1} xs={2} id="sender_locations" className="slidingDiv">
                  <CDropdown style={{ marginTop: '21px' }}>
                    <CDropdownToggle
                      color="secondary"
                      variant="outline"
                      caret={false}
                      title="Select Company Addresses"
                    >
                      <i className="fa fa-search-location"></i>
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItemPlain className="p-0 pb-2">
                        <CFormInput
                          type="text"
                          placeholder="Search..."
                          id="sender_locations_filter_input"
                        />
                      </CDropdownItemPlain>
                      <CDropdownItem
                        href="#"
                        onClick={(e) => handleLoaderLocation(e, loaderCompLink)}
                      >
                        Headquaters
                      </CDropdownItem>
                      {loaderCompLink &&
                      loaderCompLink.locations &&
                      loaderCompLink.locations.length > 0
                        ? loaderCompLink.locations.map((l) => (
                            <CDropdownItem
                              key={l.id}
                              href="#"
                              onClick={(e) => handleLoaderLocation(e, l)}
                            >
                              {l.code} {l.name}
                            </CDropdownItem>
                          ))
                        : null}
                    </CDropdownMenu>
                  </CDropdown>
                  <div className="dropdown dropdown-inline mr-4 mt-6 hide">
                    <div
                      className="dropdown-menu show"
                      id="sender_locations_address_list"
                      // style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, -209px, 0px);"
                      x-placement="top-start"
                    >
                      {/* <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','0','Bilstop Logistics', 'other', '', '3973', 'WASHINGTON', 'US', '', '', '')"
                      >
                        Headquarters
                      </a>
                      <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','17167','Company Address', 'customer', '444 Alaska Avenue Suite #BFJ931 Torrance, CA 90503 USA 444 Alaska Avenue Suite #BFJ931 Torrance, CA 90503 USA', '19171', 'AABYBRO', 'DK', '474893', '33.843929', '-118.334119')"
                      >
                        080 Company Address
                      </a>
                      <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','17168','JDDL Address', 'customer', 'JDDL', '30120', '1 DECEMBRIE', 'RO', '', '', '')"
                      >
                        900 JDDL Address
                      </a>
                      <a
                        className="dropdown-item"
                        href="javascript:Loading.set_place_address('sender_locations','17175','Invoice Address', 'customer', 'Ma', '31571', '1360 VRHNIKA', 'SI', '', '45.966583', '14.297387')"
                      >
                        09 Invoice Address
                      </a> */}
                    </div>
                  </div>
                </CCol>
              )}
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
                      invalid={
                        bookingErrors && !isEmpty(bookingErrors.loadPlaceType) ? true : false
                      }
                      onChange={(e) => handleChangeLoadingPlace(e)}
                      onFocus={() =>
                        dispatch(
                          clearBookingError({ type: 'loadPlaceType', errorType: 'errBooking' }),
                        )
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
                          dispatch(
                            clearBookingError({ type: 'loadPlace', errorType: 'errBooking' }),
                          )
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
                            ? locations
                                .filter((x) => x.placeType === bookingData.loadPlaceType)
                                .map((itm) => ({
                                  label: `${itm.code ? itm.code : ''} ${itm.address}`,
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
                        isLoading={fetchingLocations ? true : false}
                        options={
                          locations && !fetchingLocations && locations.length > 0
                            ? locations
                                .filter((x) => x.placeType === 'custom')
                                .map((itm) => ({
                                  label: `${itm.code ? itm.code : ''} ${itm.address}`,
                                  value: itm.id,
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
                          'is-invalid':
                            bookingErrors && !isEmpty(bookingErrors.loadCustomOfficerId),
                        })}
                        id="load_customofficer_id"
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        isLoading={fetchingCompanies ? true : false}
                        options={
                          companies && !fetchingCompanies && companies.length > 0
                            ? companies.map((itm) => ({
                                label: itm.name,
                                value: itm,
                              }))
                            : []
                        }
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
                        clearBookingError({
                          type: 'checkLoadCustomOfficer',
                          errorType: 'errBooking',
                        }),
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
                        placeholder="-Select-"
                        isSearchable
                        isLoading={fetchingLocations ? true : false}
                        options={
                          locations && !fetchingLocations && locations.length > 0
                            ? locations.map((itm) => ({
                                label: `${itm.code ? itm.code : ''} ${itm.address}`,
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
            <div className="separator"></div>
            <CRow id="booking_form_buttons">
              <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton
                  type="submit"
                  color="info"
                  className="float-right"
                  disabled={updatingBooking ? true : false}
                >
                  {updatingBooking ? (
                    'Processing...'
                  ) : (
                    <span>
                      Next <i className="fa fa-arrow-right ml-2" />
                    </span>
                  )}{' '}
                </CButton>
              </div>
            </CRow>
          </CCol>
        </div>
      </form>
    </div>
  )
}

CollectionPoints.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  handleModalLocation: PropTypes.func.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
  bookingData: PropTypes.object,
  handleModalCity: PropTypes.func.isRequired,
  handleCollectionBooking: PropTypes.func.isRequired,
}

export default CollectionPoints
