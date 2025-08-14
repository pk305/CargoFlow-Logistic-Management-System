import React, { useState } from 'react'
import { CCard } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { GeneralInformation } from './newBookings'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import moment from 'moment'

const EditBooking = () => {
  // const history = useHistory()
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)

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

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setBookingData({
      ...bookingData,
      [name]: value,
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearBookingError({ type: c, errorType: 'errBooking' }))

    // if (c === 'customerCompany' || c === 'senderId' || c === 'loaderId' || c === 'consigneeId') {
    //   if (isEmpty(companies)) {
    //     dispatch(fetchCompanies())
    //   }
    // } else if (c === 'contactId') {
    //   if (isEmpty(contacts)) {
    //     dispatch(fetchContacts())
    //   }
    // } else if (
    //   c === 'loadPlaceId' ||
    //   c === 'unLoadPlaceId' ||
    //   c === 'unloadCenterId' ||
    //   c === 'loadCenterId'
    // ) {
    //   if (isEmpty(locations)) {
    //     dispatch(fetchLocations())
    //   }
    // } else if (c === 'salerId') {
    //   if (isEmpty(users)) {
    //     dispatch(fetchUsers())
    //   }
    // } else if (c === 'branchId') {
    //   if (isEmpty(branches)) {
    //     dispatch(fetchBranches())
    //   }
    // } else if (c === 'placeCityId' || c === 'loadCityId' || c === 'unLoadCityId') {
    //   if (isEmpty(cities)) {
    //     dispatch(fetchCities())
    //   }
    // }
  }

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom gutter-b">
        <form id="edit_loading">
          <GeneralInformation
            handleChangeForm={handleChangeForm}
            bookingData={bookingData}
            handleSelectFocus={handleSelectFocus}
          />
        </form>
      </CCard>
    </div>
  )
}

export default EditBooking
