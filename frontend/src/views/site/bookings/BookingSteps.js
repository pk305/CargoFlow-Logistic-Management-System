import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CCard, CRow, CListGroup, CListGroupItem } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import $ from 'jquery'
import GeneralInformation from './stepsModel/GeneralInformation'
import moment from 'moment'
import {
  clearBookingError,
  clearShowBooking,
  createBookingOption,
  findBooking,
  updateBooking,
} from 'src/redux/slices/bookingSlice'
import { isEmpty, toLower } from 'lodash'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { fetchContacts } from 'src/redux/slices/contactSlice'
import { fetchLocations } from 'src/redux/slices/locationSlice'
import { fetchUsers } from 'src/redux/slices/userSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchCities } from 'src/redux/slices/citySlice'
import { useHistory, useLocation } from 'react-router-dom'
import PackageDetails from './stepsModel/PackageDetails'
import qs from 'query-string'
import classNames from 'classnames'
import { fetchHscodes } from 'src/redux/slices/hscodeSlice'
import { nanoid } from 'nanoid'
import CollectionPoints from './stepsModel/CollectionPoints'
import DeliveryPoints from './stepsModel/DeliveryPoints'
import OtherDetails from './stepsModel/OtherDetails'
import Noty from 'noty'

const BookingSteps = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const [bookingData, setBookingData] = useState({
    authenticityToken: '',
    customerCompany: '',
    loadType: '',
    loadingCountry: '',
    branchId: `${authUser && authUser.operation && authUser.operation.id}`,
    salerId: `${authUser.uuid}`,
    operationId: `${authUser && authUser.operation && authUser.operation.id}`,
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
  const { companies } = useSelector((state) => state.company)
  const { contacts } = useSelector((state) => state.contact)
  const { locations } = useSelector((state) => state.location)
  const { hscodes } = useSelector((state) => state.hscode)
  const { users } = useSelector((state) => state.user)
  const { branches } = useSelector((state) => state.branch)
  const { cities } = useSelector((state) => state.city)
  const { showBooking } = useSelector((state) => state.booking)
  const [packageInput, setPackageInput] = useState([
    {
      id: nanoid(10),
      total: '0',
      packCode: '',
      dimUnit: '',
      innerQuantity: '',
      brutWg: '0.0',
      packDimension1: '',
      packDimension2: '',
      packDimension3: '',
      packVolume: '0.0',
    },
  ])
  const [containerInput, setContainerInput] = useState([
    {
      id: nanoid(10),
      containerName: '',
      containerType: '',
      sealNo: '',
      packTotal: '0.0',
      packCode: '',
      weight: '0.0',
      volume: '0.0',
    },
  ])
  // const [setModalCity] = useState(false)
  const [modalLocation, setModalLocation] = useState(false)

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

  const handleModalLocation = (e) => {
    e.preventDefault()
    setModalLocation(!modalLocation)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearBookingError({ type: c, errorType: 'errBooking' }))

    if (
      c === 'customerCompany' ||
      c === 'senderId' ||
      c === 'loaderId' ||
      c === 'consigneeId' ||
      c === 'loadCustomOfficerId'
    ) {
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
      c === 'loadCenterId' ||
      c === 'loadCustomId'
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
    } else if (c === 'gtpId') {
      if (isEmpty(hscodes)) {
        dispatch(fetchHscodes())
      }
    }
  }

  const toLink = (e, h) => {
    e.preventDefault()
    if (query.get('step') === h) {
      if (query.get('step') === '1') {
        history.push(
          `/loadings/new?${qs.stringify({
            form_scope: 'step',
            step: '1',
          })}`,
        )
        dispatch(clearShowBooking())
      }

      if (showBooking) {
        history.push(
          `/loadings/new?${qs.stringify({
            form_scope: 'step',
            step: h,
            vw: toLower(showBooking.linkId),
          })}`,
        )
      }
    }
  }

  const clearBookingData = () => {
    setBookingData({
      authenticityToken: '',
      customerCompany: '',
      loadType: '',
      loadingCountry: '',
      branchId: `${authUser && authUser.branch.id}`,
      salerId: `${authUser.uuid}`,
      operationId: `${authUser && authUser.operation.id}`,
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
  }

  const handleNextBooking = async (e, l) => {
    e.preventDefault()
    //form data
    let arrForm = Object.entries(bookingData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    formData.append('step', l)
    const resData = await dispatch(createBookingOption(formData)).unwrap()
    if (resData) {
      history.push(
        `/loadings/new?${qs.stringify({
          form_scope: 'step',
          step: resData.step,
          vw: toLower(resData.loading.linkId),
        })}`,
      )
    }
  }

  const handleUpdateBooking = async (e, l) => {
    e.preventDefault()
    bookingData.step = l
    if (bookingData.inContainer === 'out_of_container') {
      bookingData.packageAttr = JSON.stringify(packageInput)
    }
    if (bookingData.inContainer === 'at_container') {
      bookingData.containerAttr = JSON.stringify(containerInput)
    }
    const resData = await dispatch(
      updateBooking({ Id: showBooking ? showBooking.linkId : null, ...bookingData }),
    ).unwrap()
    if (resData) {
      history.push(
        `/loadings/new?${qs.stringify({
          form_scope: 'step',
          step: resData.step,
          vw: toLower(resData.loading.linkId),
        })}`,
      )
    }
  }

  const handleCollectionBooking = async (e, l) => {
    e.preventDefault()
    bookingData.step = l
    const resData = await dispatch(
      updateBooking({
        Id: showBooking ? showBooking.linkId : null,
        ...bookingData,
        point: 'collection',
      }),
    ).unwrap()
    if (resData) {
      history.push(
        `/loadings/new?${qs.stringify({
          form_scope: 'step',
          step: resData.step,
          vw: toLower(resData.loading.linkId),
        })}`,
      )
    }
  }

  const handleDeliveryBooking = async (e, l) => {
    e.preventDefault()
    bookingData.step = l
    const resData = await dispatch(
      updateBooking({
        Id: showBooking ? showBooking.linkId : null,
        ...bookingData,
        point: 'delivery',
      }),
    ).unwrap()
    if (resData) {
      history.push(
        `/loadings/new?${qs.stringify({
          form_scope: 'step',
          step: resData.step,
          vw: toLower(resData.loading.linkId),
        })}`,
      )
    }
  }

  const handleOtherDetailsBooking = async (e, l) => {
    e.preventDefault()
    bookingData.step = l
    const resData = await dispatch(
      updateBooking({
        Id: showBooking ? showBooking.linkId : null,
        ...bookingData,
        point: 'otherDetails',
      }),
    ).unwrap()
    if (resData) {
      clearBookingData()
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Booking has been created succesfully',
      }).show()
      history.push(`/loadings/${resData.linkId}`)
    }
  }

  const handleModalCity = (e) => {
    e.preventDefault()
    // setModalCity(true)
  }

  const findBookingData = useCallback(async () => {
    if (query.get('vw')) {
      const resData = await dispatch(findBooking(query.get('vw'))).unwrap()
      if (resData) {
        $('.list-group-item .rlg-link.line_1').addClass('disabled')
        $(`.list-group-item .rlg-link.line_${query.get('step')}`).removeClass('disabled')
      }
    }
  }, [query, dispatch])

  useEffect(() => {
    document.title = 'Booking'
    //
    findBookingData()
  }, [findBookingData])

  return (
    <div className="mt-2">
      <CRow>
        <div className="col-12 col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <CCard className="cardCustom gutter-b">
            <div className="card-body">
              <CListGroup className="nav-rlg">
                <CListGroupItem className="bk-active">
                  <a
                    className={classNames('rlg-link line_1 ', {
                      active: query.get('step') === '1',
                    })}
                    href="#general-information"
                    onClick={(e) => toLink(e, '1')}
                  >
                    <div className="truncate">
                      1-{' '}
                      <span className="nav-icon">
                        <i className="fas fa-truck icon-md wizard-icon"></i>
                      </span>
                      <span className="nav-text font-weight-bold ml-2"> General Information</span>
                    </div>
                  </a>
                </CListGroupItem>
                <div className="separator"></div>
                <CListGroupItem>
                  <a
                    href="#packaging-details"
                    className={classNames('rlg-link line_2 disabled', {
                      active: query.get('step') === '2',
                    })}
                    onClick={(e) => toLink(e, '2')}
                  >
                    <div className="truncate">
                      2-{' '}
                      <span className="nav-icon">
                        <i className="fas fa-box icon-md wizard-icon"></i>
                      </span>
                      <span className="nav-text font-weight-bold ml-2"> Package Details</span>
                    </div>
                  </a>
                </CListGroupItem>
                <div className="separator"></div>
                <CListGroupItem>
                  <a
                    href="#collection-points"
                    className={classNames('rlg-link line_3 disabled', {
                      active: query.get('step') === '3',
                    })}
                    onClick={(e) => toLink(e, '3')}
                  >
                    <div className="truncate">
                      3-{' '}
                      <span className="nav-icon">
                        <i className="fas fa-truck-loading icon-md wizard-icon"></i>
                      </span>
                      <span className="nav-text font-weight-bold ml-2"> Collection Points</span>
                    </div>
                  </a>
                </CListGroupItem>
                <div className="separator"></div>
                <CListGroupItem>
                  <a
                    href="#dellivery-points"
                    className={classNames('rlg-link line_4 disabled', {
                      active: query.get('step') === '4',
                    })}
                    onClick={(e) => toLink(e, '4')}
                  >
                    <div className="truncate">
                      4-{' '}
                      <span className="nav-icon">
                        <i className="fas fa-box-open icon-md wizard-icon"></i>
                      </span>
                      <span className="nav-text font-weight-bold ml-2"> Delivery Points</span>
                    </div>
                  </a>
                </CListGroupItem>
                <div className="separator"></div>
                <CListGroupItem>
                  <a
                    href="#other-details"
                    className={classNames('rlg-link line_5 disabled', {
                      active: query.get('step') === '5',
                    })}
                    onClick={(e) => toLink(e, '5')}
                  >
                    <div className="truncate">
                      5-{' '}
                      <span className="nav-icon">
                        <i className="fas fa-list-alt icon-md wizard-icon"></i>
                      </span>
                      <span className="nav-text font-weight-bold ml-2"> Other Details</span>
                    </div>
                  </a>
                </CListGroupItem>
              </CListGroup>
            </div>
          </CCard>
        </div>
        <div className="col-12 col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
          <div id="booking_form_div">
            <CCard className="cardCustom">
              <div className="card-body p-3">
                {query.get('step') === '1' && (
                  <GeneralInformation
                    handleChangeForm={handleChangeForm}
                    bookingData={bookingData}
                    handleSelectFocus={handleSelectFocus}
                    handleNextBooking={handleNextBooking}
                  />
                )}
                {query.get('step') === '2' && (
                  <PackageDetails
                    handleChangeForm={handleChangeForm}
                    bookingData={bookingData}
                    packageInput={packageInput}
                    setPackageInput={setPackageInput}
                    handleSelectFocus={handleSelectFocus}
                    handleUpdateBooking={handleUpdateBooking}
                    containerInput={containerInput}
                    setContainerInput={setContainerInput}
                  />
                )}
                {query.get('step') === '3' && (
                  <CollectionPoints
                    handleChangeForm={handleChangeForm}
                    bookingData={bookingData}
                    handleSelectFocus={handleSelectFocus}
                    handleModalLocation={handleModalLocation}
                    handleModalCity={handleModalCity}
                    handleCollectionBooking={handleCollectionBooking}
                  />
                )}
                {query.get('step') === '4' && (
                  <DeliveryPoints
                    handleChangeForm={handleChangeForm}
                    bookingData={bookingData}
                    handleSelectFocus={handleSelectFocus}
                    handleModalLocation={handleModalLocation}
                    handleModalCity={handleModalCity}
                    handleDeliveryBooking={handleDeliveryBooking}
                  />
                )}
                {query.get('step') === '5' && (
                  <OtherDetails
                    handleChangeForm={handleChangeForm}
                    bookingData={bookingData}
                    handleSelectFocus={handleSelectFocus}
                    handleModalLocation={handleModalLocation}
                    handleModalCity={handleModalCity}
                    handleOtherDetailsBooking={handleOtherDetailsBooking}
                  />
                )}
              </div>
            </CCard>
          </div>
        </div>
      </CRow>
    </div>
  )
}

export default BookingSteps
