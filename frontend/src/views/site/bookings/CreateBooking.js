import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCardFooter,
  CButton,
  CCallout,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CCol,
  CFormFeedback,
  CFormSelect,
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import {
  GeneralInformation,
  PackageDetails,
  CollectionPoints,
  DeliveryPoints,
  OtherDetails,
} from './newBookings'
import { useDispatch, useSelector } from 'react-redux'
import { showBookingError } from 'src/redux/slices/bookingSlice'
import { AppBreadcrumb } from 'src/components'
import { useHistory, useLocation } from 'react-router-dom'
import moment from 'moment'
import { isEmpty, isNull } from 'lodash'
import { fetchContacts } from 'src/redux/slices/contactSlice'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import { fetchLocations } from 'src/redux/slices/locationSlice'
import classNames from 'classnames'
import $ from 'jquery'
import { fetchUsers } from 'src/redux/slices/userSlice'
import Noty from 'noty'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { clearLocationError } from 'src/redux/slices/locationSlice'
import { clearCityError, createCity, fetchCities } from 'src/redux/slices/citySlice'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import BookingSteps from './BookingSteps'

const CreateBooking = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const [breadcrumbList] = useState([
    { name: 'Bookings', pathname: '/loadings', active: true },
    { name: 'Planning', pathname: '/transports' },
    { name: 'Road Freight', pathname: '/positions?trans_method=road' },
    { name: 'Air Freight', pathname: '/positions?trans_method=air' },
    { name: 'Sea Freight', pathname: '/positions?trans_method=sea' },
    { name: 'Rail Freight', pathname: '/positions?trans_method=rail' },
    { name: 'Courier Freight', pathname: '/positions?trans_method=courier' },
    { name: 'Tarifs', pathname: '/tariffs' },
  ])
  const [bookFormOptions, setBookFormOptions] = useState('default')
  const { bookingErrors } = useSelector((state) => state.booking)
  const [cityData, setCityData] = useState({
    cityName: '',
    code: '',
    countryId: '',
    telCode: '',
    statesCode: '',
  })
  const [defCountry, setDefCountry] = useState(null)
  const [bookingData, setBookingData] = useState({
    authenticityToken: '',
    customerCompany: '',
    loadType: '',
    loadingCountry: '',
    branchId: '1',
    salerId: `${authUser.uuid}`,
    operationId: '',
    inContainer: 'out_of_container',
    unLoadingCountry: '',
    vagonNo: '',
    hblDate: '',
    telex: '',
    freeTime: '',
    packCode: '',
    total: '0',
    totalPack: '0.0',
    customerRef: '',
    loadDate: `${moment().format('YYYY-MM-DD HH:mm:ss')}`,
    senderId: '',
    loadPlace: '',
    contactId: '',
    containerAttr: [],
    packageAttr: [],
    commodity: '',
    brutWg: '0.00',
    tagNames: '',
    gtpId: '',
    optimumTemperature: '',
    addrUnno: '',
    priceWg: '0.00',
    commodityType: '0.00',
    htsNo: '0.00',
    ladameter: '0.00',
    volume: '0.00',
    loadCityId: '',
    loaderId: '',
    loadPlaceType: 'other',
    loadCenterId: '',
    loadCustomOfficerId: '',
    loadCustomId: '',
    checkLoadCustomOfficer: '',
    placeEmail: '',
    placeTel: '',
    contactName: '',
    openingInfo: '',
    placeLat: '',
    placeLng: '',
    placeCountryId: '',
    placeCityId: '',
    postcode: '',
    placeAddres: '',
    placeCode: '',
    placeName: '',
    depZipCode: '',
    consigneeId: '',
    deliveryId: '',
    unLoadPlaceType: '',
    unLoadPlaceId: '',
    arvZipCode: '',
    unLoadCityId: '',
    unLoadCustomId: '',
    unLoadCustomOfficerId: '',
    unloadCustomerOfficer: '',
    unloadPlace: '',
    freightPrice: '0.0',
    projectId: '',
    documentDate: '',
    channel: '',
    freightCurr: '',
    incoterm: '',
    agentId: '',
    ppcc: '',
    letterOfCredit: false,
    notes: '',
    agentRef: '',
    notify1Id: '',
    notify2Id: '',
    productPrice: '0.0',
    serviceTypeId: '',
    productCurr: '',
    unloadDate: '',
    terminDate: '',
  })
  const { creatingBooking, errorCallout, errorCalloutText } = useSelector((state) => state.booking)
  const { companies } = useSelector((state) => state.company)
  const { contacts } = useSelector((state) => state.contact)
  const { locations } = useSelector((state) => state.location)
  const { users } = useSelector((state) => state.user)
  const { branches } = useSelector((state) => state.branch)
  const [modalCity, setModalCity] = useState(false)
  const { cities, creatingCity, fetchingCities, cityErrors } = useSelector((state) => state.city)
  const [showGeoPosition, setShowGeoPosition] = useState(false)
  const [locationData, setLocationData] = useState({ placeName: '' })
  const [modalLocation, setModalLocation] = useState(false)
  const [isDefaultOption, setIsDefaultOption] = useState(false)

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setBookingData({
      ...bookingData,
      [name]: value,
    })
  }

  const handleSetDefault = (e) => {
    e.preventDefault()
    setIsDefaultOption(!isDefaultOption)
  }

  const handleChangeCity = (e) => {
    const { name, value } = e.target
    setCityData({
      ...cityData,
      [name]: value,
    })
  }

  const toLink = (e, h) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    history.push(h)
  }

  const handleSelectForm = (c, val) => {
    if (c === 'placeCityId') {
      const f = val.value
      const countryData = countryList().getLabel(f.country)
      setDefCountry({ label: `${f.country}-${countryData}`, value: f.country })
      setBookingData((state) => ({
        ...state,
        placeCityId: !isNull(f) ? f.id : '',
        placeCountryId: !isNull(f) ? f.country : '',
      }))
    } else {
      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    const form = $('#new_loading')
    if (form.length > 0) {
      if (bookingData.customerCompany === '') {
        dispatch(showBookingError({ type: 'customerCompany', errorType: 'errBooking' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(bookingData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    console.log(bookingData)
    // const resData = await dispatch(createBooking(formData)).unwrap()
    // if (resData) {
    //   new Noty({
    //     type: 'alert',
    //     layout: 'topRight',
    //     id: `succ${resData.id}`,
    //     text: 'Booking has been created succesfully',
    //   }).show()
    //   history.push(`/loadings/${resData.linkId}`)
    // }
  }

  const handleCityFocus = (c, _) => {
    dispatch(clearCityError({ type: c, errorType: 'errCity' }))
  }

  const handleCitySelect = (c, val) => {
    const e = {
      target: {
        name: c,
        value: !isNull(val) ? val.value : '',
      },
    }
    handleChangeCity(e)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearBookingError({ type: c, errorType: 'errBooking' }))

    if (c === 'customerCompany' || c === 'senderId' || c === 'loaderId' || c === 'consigneeId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    } else if (c === 'contactId') {
      if (isEmpty(contacts)) {
        dispatch(fetchContacts())
      }
    } else if (
      c === 'loadPlaceId' ||
      c === 'unLoadPlaceId' ||
      c === 'unloadCenterId' ||
      c === 'loadCenterId'
    ) {
      if (isEmpty(locations)) {
        dispatch(fetchLocations())
      }
    } else if (c === 'salerId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    } else if (c === 'placeCityId' || c === 'loadCityId' || c === 'unLoadCityId') {
      if (isEmpty(cities)) {
        dispatch(fetchCities())
      }
    }
  }

  const clearCityData = () => {
    setCityData({
      cityName: '',
      code: '',
      countryId: '',
      telCode: '',
      statesCode: '',
    })
  }

  const handleSubmitCity = async (e) => {
    e.preventDefault()
    //form data
    let arrForm = Object.entries(cityData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(createCity(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'City has been created succesfully',
      }).show()
      clearCityData()
      setModalCity(false)
    }
  }

  const handleModalLocation = (e) => {
    e.preventDefault()
    setModalLocation(!modalLocation)
  }

  const handleModalCity = (e) => {
    e.preventDefault()
    setModalCity(true)
  }

  const closeModalCity = () => {
    setModalCity(false)
  }

  const closeModalLocation = () => {
    setModalLocation(false)
  }

  const closeCallout = (e) => {
    e.preventDefault()
    dispatch(clearBookingError({ type: 'msgCallout', errorType: 'calloutErr' }))
  }

  const toggleHideShowGeo = (e) => {
    e.preventDefault()
    setShowGeoPosition(!showGeoPosition)
  }

  const handleChangeLocation = (e) => {
    const { name, value } = e.target
    setLocationData({
      ...locationData,
      [name]: value,
    })
  }

  const handleSubmitLocation = (e) => {
    e.preventDefault()
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

  const initMethods = useCallback(() => {
    if (query.get('form_scope') === 'step') {
      setBookFormOptions('steps')
    } else {
      setBookFormOptions('default')
    }
  }, [query])

  useEffect(() => {
    document.title = 'Bookings'
    //
    initMethods()
  }, [initMethods])

  const countryData = countryList().data

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCallout
            color="danger"
            className={classNames('bg-light cstCalloutInfo animate__animated animate__fadeIn ', {
              'animate__animated animate__fadeOut': !errorCallout,
            })}
            style={{ display: !errorCallout ? 'none' : '' }}
          >
            <div style={{ width: '100%' }}>
              <ul className="cstUl">
                <li>{errorCalloutText}</li>
              </ul>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeCallout(e)}
              ></button>
            </div>
          </CCallout>
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
                  {isDefaultOption ? (
                    <CButton
                      color="link"
                      style={{ textDecoration: 'none' }}
                      onClick={(e) => handleSetDefault(e)}
                    >
                      Set as Default
                    </CButton>
                  ) : null}

                  <CButtonGroup>
                    <CDropdown>
                      <CDropdownToggle color="primary" className="drop" caret={false}>
                        Booking Form Options
                      </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem
                          href="#"
                          onClick={(e) => toLink(e, '/loadings/new?form_scope=step&step=1')}
                        >
                          Booking Form with Steps
                        </CDropdownItem>
                        <CDropdownItem href="#" onClick={(e) => toLink(e, '/loadings/new')}>
                          Default Booking Form
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CButtonGroup>
                </div>
              </div>
            </div>
          </CCard>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              {bookFormOptions === 'default' ? (
                <CCard className="cardCustom gutter-b">
                  <form id="new_loading" onSubmit={(e) => handleSubmitBooking(e)}>
                    <CCardBody className="p-0">
                      <div className="pageContainer-wrapper">
                        <CRow className="pageBoxSizing-container">
                          <GeneralInformation
                            handleChangeForm={handleChangeForm}
                            bookingData={bookingData}
                            handleSelectFocus={handleSelectFocus}
                          />
                          <PackageDetails
                            handleChangeForm={handleChangeForm}
                            bookingData={bookingData}
                            handleSelectFocus={handleSelectFocus}
                          />
                          <CollectionPoints
                            handleChangeForm={handleChangeForm}
                            bookingData={bookingData}
                            handleSelectFocus={handleSelectFocus}
                            handleModalLocation={handleModalLocation}
                            handleModalCity={handleModalCity}
                          />
                          <DeliveryPoints
                            handleChangeForm={handleChangeForm}
                            bookingData={bookingData}
                            handleSelectFocus={handleSelectFocus}
                            handleModalCity={handleModalCity}
                          />
                          <OtherDetails
                            handleChangeForm={handleChangeForm}
                            bookingData={bookingData}
                            handleSelectFocus={handleSelectFocus}
                          />
                        </CRow>
                      </div>
                    </CCardBody>
                    <CCardFooter className="cardCustom-footer">
                      <div>
                        <CButton
                          type="submit"
                          color="success"
                          className="btn-default btn btn-success float-right"
                          disabled={creatingBooking ? true : false}
                        >
                          {creatingBooking ? (
                            'Processing...'
                          ) : (
                            <span>
                              Save <i className="fa fa-check" />
                            </span>
                          )}
                        </CButton>
                      </div>
                    </CCardFooter>
                  </form>
                </CCard>
              ) : (
                <BookingSteps />
              )}
            </CCol>
          </CRow>
        </div>
      </div>

      {/* location modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        size="lg"
        visible={modalLocation}
        onClose={() => closeModalLocation()}
      >
        <form id="new_place" onSubmit={(e) => handleSubmitLocation(e)}>
          <CModalHeader>
            <CModalTitle>Locations</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div>
              <CRow>
                <CCol sm={6} md={4} xl={4} lg={4}>
                  <div className="form-group string required">
                    <label className="control-label string required" htmlFor="place_name">
                      Address Name<span>*</span>
                    </label>
                    <CFormInput
                      className="form-control-cst string required"
                      placeholder="Ex: Invoice Address, Warehouse Address etc."
                      type="text"
                      name="placeName"
                      id="place_name"
                      value={locationData.placeName}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'placeName', errorType: 'errBooking' }))
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeName) ? true : false}
                    />
                    <CFormFeedback
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeName) ? true : false}
                      className="fieldError-cst"
                    >
                      {bookingErrors.placeName}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={2} xl={2} lg={2}>
                  <div className="form-group  place_code">
                    <label className="control-label " htmlFor="place_code">
                      Code
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="placeCode"
                      id="place_code"
                      value={locationData.placeCode}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'placeCode', errorType: 'errBooking' }))
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeCode) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.placeCode}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={3} xl={3} lg={3}></CCol>
                <CCol sm={12} md={4} xl={3} lg={3}>
                  <div className="form-group select required place_place_type">
                    <label className="control-label select required" htmlFor="place_place_type">
                      Location Type<span>*</span>
                    </label>
                    <CFormSelect
                      className="form-control-cst select required"
                      name="placeType"
                      id="place_place_type"
                      value={locationData.placeType}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'placeType', errorType: 'errBooking' }))
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeType) ? true : false}
                    >
                      <option value="customer">Company Location</option>
                      <option value="sea">Seaport</option>
                      <option value="air">Airport</option>
                      <option value="rail">Station</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="custom">Customs Offices</option>
                      <option value="supervising">Supervising Office</option>
                      <option value="plant">Facilities</option>
                      <option value="border">Border Gate</option>
                      <option value="other">Other</option>
                    </CFormSelect>
                    <CFormFeedback
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeType) ? true : false}
                      className="fieldError-cst"
                    >
                      {bookingErrors.placeType}
                    </CFormFeedback>
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={6} md={4} lg={4} xl={4}>
                  <div className="form-group  place_address">
                    <label className="control-label " htmlFor="place_address">
                      Address
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="placeAddres"
                      id="place_address"
                      value={locationData.placeAddres}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(
                          clearLocationError({ type: 'placeAddres', errorType: 'errBooking' }),
                        )
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeAddres) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.placeAddres}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={2} lg={2} xl={2}>
                  <div className="form-group  place_post_code">
                    <label className="control-label " htmlFor="place_post_code">
                      Post Code
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="postcode"
                      id="place_post_code"
                      value={locationData.postcode}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'postcode', errorType: 'errBooking' }))
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.postcode) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.postcode}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group city optional place_city_id">
                    <label className="control-label city optional" htmlFor="place_city_id">
                      City
                    </label>
                    <div className="input-group">
                      <Select
                        id="place_city_id"
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isLoading={fetchingCities ? true : false}
                        isSearchable
                        name="placeCityId"
                        autoFocus={false}
                        options={
                          cities && !fetchingCities && cities.length > 0
                            ? cities.map((itm) => ({
                                label: itm.name,
                                value: itm,
                              }))
                            : []
                        }
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.placeCityId),
                        })}
                        noOptionsMessage={(e) => noOptionCity(e)}
                        onChange={(e) => handleSelectForm('placeCityId', e)}
                        onMenuOpen={() => handleSelectFocus('placeCityId')}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.placeCityId}
                      </CFormFeedback>
                    </div>
                  </div>
                </CCol>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group select required place_country_id">
                    <label className="control-label select required" htmlFor="place_country_id">
                      Country <span>*</span>
                    </label>
                    <div className="input-group">
                      <Select
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.placeCountryId),
                        })}
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        value={defCountry}
                        isLoading={countryData && !countryData.length > 0 ? true : false}
                        id="place_country_id"
                        options={
                          countryData && countryData.length > 0
                            ? countryData.map((item) => ({
                                value: item.value,
                                label: `${item.value ? item.value + '-' : ''}${item.label}`,
                              }))
                            : []
                        }
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('placeCountryId', e)}
                        onMenuOpen={(e) => handleSelectFocus('placeCountryId', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.placeCountryId}
                      </CFormFeedback>
                    </div>
                  </div>
                </CCol>
                {!showGeoPosition && (
                  <>
                    {/* eslint-disable-next-line */}
                    <a
                      href="#"
                      data-href="#lng_lat_section"
                      className="toggle_and_hide_button"
                      onClick={(e) => toggleHideShowGeo(e)}
                    >
                      Click to Enter Longitude and Latitude Values
                    </a>
                  </>
                )}
              </CRow>
              <div
                className="row animate__animated animate_fadeIn"
                style={{ display: !showGeoPosition ? 'none' : '' }}
              >
                <CCol sm={5} md={3} lg={3} xl={3}>
                  <div className="form-group decimal optional place_lng">
                    <label className="control-label decimal optional" htmlFor="place_lng">
                      Longitude
                    </label>
                    <CFormInput
                      className="form-control-cst numeric decimal optional"
                      type="number"
                      step="any"
                      name="placeLng"
                      id="place_lng"
                      value={locationData.placeLng}
                      onChange={(e) => handleChangeLocation(e)}
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeLng) ? true : false}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'placeLng', errorType: 'errBooking' }))
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.placeLng}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group decimal optional place_lat">
                    <label className="control-label decimal optional" htmlFor="place_lat">
                      Latitude
                    </label>
                    <CFormInput
                      className="form-control-cst numeric decimal optional"
                      type="number"
                      step="any"
                      name="placeLat"
                      id="place_lat"
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeLat) ? true : false}
                      value={locationData.placeLat}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'placeLat', errorType: 'errBooking' }))
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.placeLat}
                    </CFormFeedback>
                  </div>
                </CCol>
              </div>
              <div className="separator"></div>
              <CRow>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group  place_opening_info">
                    <label className="control-label " htmlFor="place_opening_info">
                      Working hours
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="openingInfo"
                      id="place_opening_info"
                      value={locationData.openingInfo}
                      onChange={(e) => handleChangeLocation(e)}
                      invalid={bookingErrors && !isEmpty(bookingErrors.openingInfo) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearLocationError({ type: 'openingInfo', errorType: 'errBooking' }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.openingInfo}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group  place_contact_name">
                    <label className="control-label " htmlFor="place_contact_name">
                      Contact name
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="contactName"
                      id="place_contact_name"
                      value={locationData.contactName}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(
                          clearLocationError({ type: 'contactName', errorType: 'errBooking' }),
                        )
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.contactName) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.contactName}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group  place_tel">
                    <label className="control-label " htmlFor="place_tel">
                      Phone
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="placeTel"
                      id="place_tel"
                      value={locationData.placeTel}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(clearLocationError({ type: 'placeTel', errorType: 'errBooking' }))
                      }
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeTel) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.placeTel}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={6} md={3} lg={3} xl={3}>
                  <div className="form-group email place_email">
                    <label className="control-label email" htmlFor="place_email">
                      E-Mail
                    </label>
                    <CFormInput
                      className="form-control-cst string email"
                      type="email"
                      name="placeEmail"
                      id="place_email"
                      invalid={bookingErrors && !isEmpty(bookingErrors.placeEmail) ? true : false}
                      value={locationData.placeEmail}
                      onChange={(e) => handleChangeLocation(e)}
                      onFocus={() =>
                        dispatch(
                          clearLocationError({ type: 'placeEmail', errorType: 'errBooking' }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.placeEmail}
                    </CFormFeedback>
                  </div>
                </CCol>
              </CRow>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              color="success"
              className="btn-default btn btn-success float-right"
              disabled={creatingCity ? true : false}
            >
              {creatingCity ? (
                'Processing...'
              ) : (
                <span>
                  Save <i className="fa fa-check" />
                </span>
              )}
            </CButton>
          </CModalFooter>
        </form>
      </CModal>

      {/* city modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        visible={modalCity}
        onClose={() => closeModalCity()}
      >
        <form id="new_city" onSubmit={(e) => handleSubmitCity(e)}>
          <CModalHeader>
            <CModalTitle>New City</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div className="form-group select required city_country_id">
                    <label className="control-label select required" htmlFor="city_country_id">
                      Country <span title="required">*</span>
                    </label>
                    <div className="input-group">
                      <Select
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': cityErrors && !isEmpty(cityErrors.loadingCountry),
                        })}
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        isLoading={countryData && !countryData.length > 0 ? true : false}
                        id="countryId"
                        options={
                          countryData && countryData.length > 0
                            ? countryData.map((item) => ({
                                value: item.value,
                                label: `${item.value ? item.value + '-' : ''}${item.label}`,
                              }))
                            : []
                        }
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleCitySelect('countryId', e)}
                        onMenuOpen={(e) => handleCityFocus('countryId', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {cityErrors.countryId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div className="form-group string required city_name">
                    <label className="control-label string required" htmlFor="city_name">
                      City Name <span title="required">*</span>
                    </label>
                    <CFormInput
                      className="form-control string required"
                      type="text"
                      id="city_name"
                      name="cityName"
                      value={cityData.cityName}
                      onChange={(e) => handleChangeCity(e)}
                      onFocus={() =>
                        dispatch(clearCityError({ type: 'cityName', errorType: 'errCity' }))
                      }
                      invalid={cityErrors && !isEmpty(cityErrors.cityName) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {cityErrors.cityName}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div className="form-group string optional city_code">
                    <label className="control-label string optional" htmlFor="city_code">
                      City Code
                    </label>
                    <CFormInput
                      className="form-control string optional"
                      type="text"
                      name="code"
                      id="city_code"
                      value={cityData.code}
                      onChange={(e) => handleChangeCity(e)}
                      onFocus={() =>
                        dispatch(clearCityError({ type: 'code', errorType: 'errCity' }))
                      }
                      invalid={cityErrors && !isEmpty(cityErrors.code) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {cityErrors.code}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div className="form-group string optional city_tel_code">
                    <label className="control-label string optional" htmlFor="city_tel_code">
                      Telephone Code
                    </label>
                    <CFormInput
                      className="form-control string optional"
                      type="text"
                      name="telCode"
                      id="city_tel_code"
                      value={cityData.telCode}
                      onChange={(e) => handleChangeCity(e)}
                      onFocus={() =>
                        dispatch(clearCityError({ type: 'telCode', errorType: 'errCity' }))
                      }
                      invalid={cityErrors && !isEmpty(cityErrors.telCode) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {cityErrors.telCode}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div className="form-group string optional city_states_code">
                    <label className="control-label string optional" htmlFor="city_states_code">
                      States Code
                    </label>
                    <CFormInput
                      className="form-control string optional"
                      type="text"
                      name="statesCode"
                      id="city_states_code"
                      value={cityData.statesCode}
                      onChange={(e) => handleChangeCity(e)}
                      onFocus={() =>
                        dispatch(clearCityError({ type: 'statesCode', errorType: 'errCity' }))
                      }
                      invalid={cityErrors && !isEmpty(cityErrors.statesCode) ? true : false}
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {cityErrors.statesCode}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              color="success"
              className="btn-default btn btn-success float-right"
              disabled={creatingCity ? true : false}
            >
              {creatingCity ? (
                'Processing...'
              ) : (
                <span>
                  Save <i className="fa fa-check" />
                </span>
              )}
            </CButton>
          </CModalFooter>
        </form>
      </CModal>
    </div>
  )
}

export default CreateBooking
