import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CForm,
  CButtonGroup,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CFormTextarea,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCollapse,
} from '@coreui/react'
import { useHistory, useParams } from 'react-router-dom'
import { AppBreadcrumb } from 'src/components'
import SlidingPane from 'react-sliding-pane'
import { useDispatch, useSelector } from 'react-redux'
import { findCompany } from 'src/redux/slices/companySlice'
import { isEmpty, isNull } from 'lodash'
import countryList from 'react-select-country-list'
import { clearCityError, createCity, fetchCities } from 'src/redux/slices/citySlice'
import Noty from 'noty'
import { CompanyFinancials, ContactInfoModal, LocationModal, NewCityModal } from './modalInfo'
import {
  clearLocationError,
  createLocation,
  destroyLocation,
  updateLocation,
} from 'src/redux/slices/locationSlice'
import $ from 'jquery'
import { NewIbanPanel } from './panel'
import moment from 'moment'

const ViewCompany = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies', active: true },
    { name: 'Contacts', pathname: '/contacts' },
    { name: 'Quotations', pathname: '/leads' },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const [ibanModal, setIbanModal] = useState(false)
  const { showCompany, fetchingCompanies } = useSelector((state) => state.company)
  const { creatingLocation, updatingLocation } = useSelector((state) => state.location)
  const [locationData, setLocationData] = useState({
    id: null,
    placeName: '',
    code: '',
    placeType: 'customer',
    address: '',
    postcode: '',
    cityId: '',
    countryId: '',
    placeLng: '',
    placeLat: '',
    openingInfo: '',
    contactName: '',
    placeTel: '',
    placeEmail: '',
  })
  // const [contactInfoData, setContactInfoData] = useState({
  //   id: null,
  //   placeName: '',
  //   code: '',
  //   placeType: 'customer',
  //   address: '',
  //   postcode: '',
  //   cityId: '',
  //   countryId: '',
  //   placeLng: '',
  //   placeLat: '',
  //   openingInfo: '',
  //   contactName: '',
  //   placeTel: '',
  //   placeEmail: '',
  // })
  const [modalLocation, setModalLocation] = useState(false)
  const [showGeoPosition, setShowGeoPosition] = useState(false)
  const { cities, creatingCity } = useSelector((state) => state.city)
  const [defCountry, setDefCountry] = useState(null)
  const [modalCity, setModalCity] = useState(false)
  const [cityData, setCityData] = useState({
    cityName: '',
    code: '',
    countryId: '',
    telCode: '',
    statesCode: '',
  })
  const [setVisibleAddress] = useState([])
  const [newContactModal, setNewContactModal] = useState(false)
  const [financialModal, setFinancialModal] = useState(false)
  const [financialData, setFinancialData] = useState({
    financialId: '',
    companyName: '',
    taxNo: '',
    taxOffice: '',
    companyNo: '',
    address: '',
    postcode: '',
    district: '',
    cityName: '',
    countryId: '',
    financialEmail: '',
    companyFinancorId: '',
    paymentNotes: '',
    informationEmail: '',
    creditLimit: '0.0',
    dueDays: '0',
    invoiceNotes: '',
    creditLimitControl: '',
    companyCurr: '',
    companyCreditLimitCurr: '',
    financialStatus: '',
    companyRemindPayment: '',
    financialNotes: '',
  })
  const [otherInfoModal, setOtherInfoModal] = useState(false)
  const [companyCodesModal, setCompanyCodesModal] = useState(false)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setLocationData({ ...locationData, [name]: value })
  }

  const closeIbanModal = () => {
    setIbanModal(false)
  }

  const handleIbanModal = (e) => {
    e.preventDefault()
    setIbanModal(true)
  }

  const handleModalCity = (e) => {
    e.preventDefault()
    setModalLocation(false)
    setModalCity(true)
  }

  const handleChangeFinancials = (e) => {
    const { name, value } = e.target
    setFinancialData({
      ...financialData,
      [name]: value,
    })
  }

  const changeVisibleAddress = (e, location) => {
    e.preventDefault()
    const p = []
    setVisibleAddress([...p, location.id])
  }

  const closeCompanyCodes = () => {
    setCompanyCodesModal(false)
  }

  const handleCompanyCodes = (e) => {
    e.preventDefault()
    setCompanyCodesModal(true)
  }

  const closeInfoModal = () => {
    setOtherInfoModal(false)
  }

  const handleInfoModal = (e) => {
    e.preventDefault()
    setOtherInfoModal(true)
  }

  const closeFinModal = () => {
    setFinancialModal(false)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearLocationError({ type: c, errorType: 'errLocation' }))

    if (c === 'cityId') {
      if (isEmpty(cities)) {
        dispatch(fetchCities())
      }
    }
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

  const handleChangeCity = (e) => {
    const { name, value } = e.target
    setCityData({
      ...cityData,
      [name]: value,
    })
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

  const clearLocationData = () => {
    setLocationData({
      id: null,
      placeName: '',
      code: '',
      placeType: 'customer',
      address: '',
      postcode: '',
      cityId: '',
      countryId: '',
      placeLng: '',
      placeLat: '',
      openingInfo: '',
      contactName: '',
      placeTel: '',
      placeEmail: '',
    })
  }

  const handleSubmitLocation = async (e) => {
    e.preventDefault()
    //form data
    let arrForm = Object.entries(locationData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    formData.append('companyId', showCompany && showCompany.id)

    const resData = await dispatch(createLocation(formData)).unwrap()
    if (resData) {
      setModalLocation(false)
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `succ${resData.id}`,
        text: 'Location has been created succesfully',
      }).show()
      clearLocationData()
    }
  }

  const handleChangeLocation = (e) => {
    const { name, value } = e.target
    setLocationData({
      ...locationData,
      [name]: value,
    })
  }

  const handleModalLocation = (e) => {
    e.preventDefault()
    setModalLocation(true)
  }

  const toggleHideShowGeo = (e) => {
    e.preventDefault()
    setShowGeoPosition(!showGeoPosition)
  }

  const closeModalLocation = () => {
    setModalLocation(false)
  }

  const handleSelectForm = (c, val) => {
    if (c === 'cityId') {
      const f = val.value
      const countryData = countryList().getLabel(f.country)
      if (f) {
        setDefCountry({ label: `${f.country}-${countryData}`, value: f.country })
      }
      setLocationData((state) => ({
        ...state,
        cityId: !isNull(f) ? f.id : '',
        countryId: !isNull(f) ? f.country : '',
      }))
    } else {
      if (c === 'countryId') {
        if (val) {
          setDefCountry({ label: val.label, value: val.value })
        }
      }

      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const closeModalCity = () => {
    setModalCity(false)
    clearCityData()
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

  const addNewContactInfo = (e) => {
    e.preventDefault()
    setNewContactModal(true)
  }

  const closeContactModal = () => {
    setNewContactModal(false)
  }

  const handelEditFinDetail = async (e) => {
    e.preventDefault()
    //  const resData = await dispatch(findFinancial(invoiceData.invoiceCompanyId)).unwrap()
    //  if (resData) {
    //    setFinancialData({
    //      ...financialData,
    //      financialId:
    //        resData.financial && !isNull(resData.financial.id) ? resData.financial.id : '',
    //      address: !isNull(resData.address) ? resData.address : '',
    //      companyName:
    //        resData.financial && !isNull(resData.financial.companyTitle)
    //          ? resData.financial.companyTitle
    //          : '',
    //    })
    //  }
    setFinancialModal(true)
  }

  const editLocation = (e, l) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setLocationData((state) => ({
      ...state,
      id: l.id ? l.id : null,
      placeName: l.name ? l.name : '',
      code: l.code ? l.code : '',
      placeType: l.placeType ? l.placeType : '',
      address: l.address ? l.address : '',
      postcode: l.id ? l.id : '',
      cityId: l.cityId ? l.cityId : '',
      countryId: l.countryId ? l.countryId : '',
      placeLng: l.lng ? l.lng : '',
      placeLat: l.lat ? l.lat : '',
      openingInfo: l.openingInfo ? l.openingInfo : '',
      contactName: l.id ? l.id : '',
      placeTel: l.telephone ? l.telephone : '',
      placeEmail: l.email ? l.email : '',
    }))

    setModalLocation(true)
  }

  const handleUpdateCompany = async (e) => {
    e.preventDefault()
    // form data
    const resData = await dispatch(
      updateLocation({ Id: locationData.id, ...locationData }),
    ).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `updateItem${resData.id}`,
        text: 'Location updated succesfully',
        timeout: 5000,
      }).show()
      setModalLocation(false)
      clearLocationData()
    }
  }

  const toLink = (e, h) => {
    e.preventDefault()
    history.push(h)
  }

  const handleDeleteLocation = (e, item) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    var n = new Noty({
      text: 'The record will be deleted, do you want to continue ?',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      closeWith: 'button',
      buttons: [
        Noty.button(
          'Delete',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          async function () {
            const resData = await dispatch(destroyLocation(item.id)).unwrap()
            if (resData) {
              new Noty({
                text: 'Location has been deleted succesfully',
                layout: 'topRight',
                progressBar: false,
                timeout: 3000,
                type: 'alert',
              }).show()
            }
            n.close()
          },
          { id: `delItem${item.id}` },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }

  const initMethods = useCallback(() => {
    const { id } = params
    if (id) {
      async function checkCompany() {
        const resData = await dispatch(findCompany(id)).unwrap()
        if (resData) {
          document.title = resData.name
        }
      }
      checkCompany()
    }
  }, [params, dispatch])

  useEffect(() => {
    initMethods()
  }, [initMethods])

  if (fetchingCompanies) return false

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom gutter-b">
            <div className="card-header">
              <div className="customHeaderContainer">
                <div className="customHeaderContainer-body">
                  <div className="symbolWrapper">
                    <span className="symbol-label">
                      <i className="fa fa-box-open icon-2x"></i>
                    </span>
                  </div>
                </div>
                <div className="customHeaderContainer-footer">
                  <div className="customMiniBar-wrapper">
                    <div className="customMiniBar-header">
                      <div className="minibar-left">
                        <span className="minbarTitle">Companies</span>
                        <div className="minbarSubtitle">
                          <h4>{showCompany && showCompany.name}</h4>
                          <span className="sub"></span>
                        </div>
                      </div>
                      <div className="minibar-right">
                        <CButtonGroup role="group">
                          <CButton
                            color="secondary"
                            variant="outline"
                            onClick={(e) => toLink(e, `/companies/edit/${showCompany.linkId}`)}
                          >
                            <i className="fa fa-pen"></i> Edit
                          </CButton>
                          <CButton color="secondary" variant="outline">
                            <i className="fa fa-ellipsis-h"></i>
                          </CButton>
                        </CButtonGroup>
                      </div>
                    </div>
                    <div className="customMiniBar-body">
                      <div className="minItem">
                        <i className="fa fa-users icon-rt" />
                        <span className="minItem-text">
                          {showCompany && showCompany.branch && showCompany.branch.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-map-marker-alt icon-rt" />
                        <span className="minItem-text">
                          {showCompany && showCompany.branch && showCompany.branch.name}
                        </span>
                      </div>
                      <div className="minItem">
                        <i className="fa fa-calendar-alt icon-rt" />
                        <span className="minItem-text">
                          {showCompany &&
                            showCompany.createdAt &&
                            moment(showCompany.createdAt).format('LLL')}
                        </span>
                      </div>
                      {/* <div className="minItem">
                        <i className="fa fa-info-circle icon-rt" />
                        <span className="minItem-text">Planning</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CCard>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <CCard className="cardCustom gutter-b">
                <div className="card-header cstHeaderTabs-line">
                  <div className="cstHeaderNav">
                    <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                      <CNavItem>
                        <CNavLink active>
                          <span className="nav-icon">
                            <i className="fa fa-layer-group ico"></i>
                          </span>
                          <span className="nav-text">General Information</span>
                        </CNavLink>
                      </CNavItem>
                      {/* <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-icon">
                            <i className="fa fa-file-invoice-dollar ico"></i>
                          </span>
                          <span className="nav-text">Financials</span>
                        </CNavLink>
                      </CNavItem> */}
                    </CNav>
                  </div>
                </div>
                <CCardBody className="p-3">
                  <div className="tab-content cstTabContent">
                    <div className="tab-pane fade show active" role="tabpanel">
                      <div className="tab-content" id="myTabContent">
                        <div
                          className="tab-pane fade show active"
                          id={`profile_content_${showCompany && showCompany.id}`}
                        >
                          <div className="d-block bg-white p-3 rounded">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <div className="row">
                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex flex-column gutter-b">
                                      <h4 className="cstPageTitle">Company Addresses</h4>
                                      <div className="d-block">
                                        <div className="d-flex align-items-center mb-2">
                                          <i className="fa fa-map-marker-alt text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-3">
                                            {showCompany && showCompany.address}
                                          </span>
                                        </div>
                                        {/*  */}
                                        {showCompany &&
                                        showCompany.locations &&
                                        showCompany.locations.length
                                          ? showCompany.locations.map((l) => (
                                              <div
                                                className="d-flex align-items-top mb-2"
                                                key={l.id}
                                              >
                                                <div className="dropdown">
                                                  <CDropdown id={`drop-${l.id}`}>
                                                    <CDropdownToggle
                                                      color="link"
                                                      className="p-0 m-0 fs-h4 text-dark-g"
                                                      caret={false}
                                                    >
                                                      <i className="fa fa-cog pt-1"></i>
                                                    </CDropdownToggle>
                                                    <CDropdownMenu>
                                                      <CDropdownItem
                                                        onClick={(e) => editLocation(e, l)}
                                                      >
                                                        Edit
                                                      </CDropdownItem>
                                                      <CDropdownItem
                                                        onClick={(e) => handleDeleteLocation(e, l)}
                                                      >
                                                        Delete
                                                      </CDropdownItem>
                                                    </CDropdownMenu>
                                                  </CDropdown>
                                                </div>
                                                <div className="ml-2">
                                                  <div>
                                                    <span className="badge badge-pill badge-secondary font-weight-bolder truncate">
                                                      {l.name}
                                                    </span>
                                                  </div>
                                                  <div className="d-flex align-items-center pt-1">
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                    <a
                                                      href="#"
                                                      onClick={(e) => changeVisibleAddress(e, l)}
                                                    >
                                                      <i
                                                        className="fa fa-caret-down text-primary"
                                                        style={{
                                                          width: '12px',
                                                          marginLeft: '-12px',
                                                        }}
                                                      ></i>
                                                    </a>
                                                    <i
                                                      className="fa fa-map-marker-alt text-dark-g text-center"
                                                      style={{ width: '28px' }}
                                                    ></i>
                                                    <p
                                                      className="font-weight-bold text-dark-g mb-0"
                                                      style={{ pointerEvents: 'none' }}
                                                    >
                                                      {l.address}
                                                    </p>
                                                  </div>
                                                  {/*  */}
                                                  <CCollapse
                                                    id={`moreCollapse_${l.id}`}
                                                    // visible={
                                                    //   visibleAddress[location.id] ? true : false
                                                    // }
                                                  >
                                                    <div className="d-flex align-items-center mt-3">
                                                      <i
                                                        className="fa fa-phone-rotary text-light text-center"
                                                        style={{ width: '28px' }}
                                                      ></i>
                                                      <span className="font-weight-bold text-dark-g">
                                                        38930
                                                      </span>
                                                    </div>
                                                    <div className="d-flex align-items-center mt-3">
                                                      <i
                                                        className="fa fa-envelope text-light text-center"
                                                        style={{ width: '28px' }}
                                                      ></i>
                                                      <span className="font-weight-bold text-dark-g">
                                                        info@gmail.com
                                                      </span>
                                                    </div>
                                                  </CCollapse>
                                                </div>
                                              </div>
                                            ))
                                          : null}

                                        {/*  */}
                                        <div className="d-flex align-items-center mb-2">
                                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                          <a
                                            className="p-0"
                                            href="#"
                                            onClick={(e) => handleModalLocation(e)}
                                          >
                                            <span className="font-weight-bolder">
                                              Add New Address
                                            </span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div className="d-flex flex-column">
                                      <h4 className="cstPageTitle">Contact information</h4>
                                      <div className="d-block">
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-phone text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-2"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-fax text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-2"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          <i className="fa fa-envelope text-light"></i>
                                          <span className="font-weight-bold text-dark-g ml-2"></span>
                                        </div>
                                        <div className="d-flex align-items-center mb-3">
                                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                          <a href="#" onClick={(e) => addNewContactInfo(e)}>
                                            <span className="font-weight-bolder">
                                              Add New Contact Info
                                            </span>
                                          </a>{' '}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                                <div className="d-flex flex-column gutter-b">
                                  <h4 className="font-weight-bolder fs-h4 mb-3">Financials</h4>
                                  <div className="d-block">
                                    <div className="d-flex align-items-center mb-3">
                                      <i className="fa fa-building text-light"></i>
                                      <span className="font-weight-bold text-dark-g ml-3">
                                        Bilstop Logistics
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      <i className="fa fa-calendar-day label-icon"></i>
                                      <span className="font-weight-bold text-dark-g ml-3">
                                        Upfront&nbsp;
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      <i className="fa fa-info-circle text-light"></i>
                                      <span className="font-weight-bold text-dark-g ml-3">
                                        Active
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                      <a href="#" onClick={(e) => handelEditFinDetail(e)}>
                                        <span className="font-weight-bolder">Edit</span>
                                      </a>
                                    </div>
                                    {showCompany.ibans && showCompany.ibans.length > 0 ? (
                                      <div className="d-flex flex-column mb-3">
                                        {showCompany.ibans.map((itm) => (
                                          <div key={itm.id} className="d-flex mb-3">
                                            <i className="fa fa-university text-dark-50"></i>
                                            <div className="d-flex flex-column ml-3">
                                              <span className="font-weight-bold text-dark-75">
                                                {itm.ibanNo}
                                              </span>
                                              <span>
                                                {itm.bankName}{' '}
                                                {itm.curr && itm.curr.name
                                                  ? '/ ' + itm.curr.name
                                                  : null}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                        <div className="d-flex mb-3">
                                          <i className="fa fa-university text-dark-50"></i>
                                          <div className="d-flex flex-column ml-3">
                                            <span className="font-weight-bold text-dark-75">
                                              12332333
                                            </span>
                                            <span>EQUITY Bank / EUR</span>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="d-flex flex-column mb-3"></div>
                                    )}

                                    <div className="d-flex align-items-center mb-3">
                                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                      <a title="IBAN" href="#" onClick={(e) => handleIbanModal(e)}>
                                        <span className="font-weight-bolder">Add New Iban</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                                <div className="d-flex flex-column gutter-b">
                                  <h4 className="font-weight-bolder fs-h4 mb-3">
                                    Other Information
                                  </h4>
                                  <div className="d-block">
                                    <div className="d-flex align-items-center mb-3">
                                      <span className="text-lightfont-weight-bold">
                                        Company Group:
                                      </span>
                                      <span className="font-weight-bold text-dark-g ml-3"></span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      <span className="text-lightfont-weight-bold">
                                        Company Type:
                                      </span>
                                      <span className="font-weight-bold text-dark-g ml-3"></span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      <span className="text-lightfont-weight-bold">Industry:</span>
                                      <span className="font-weight-bold text-dark-g ml-3"></span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      <span className="text-lightfont-weight-bold">Notes:</span>
                                      <span className="font-weight-bold text-dark-g ml-3"></span>
                                    </div>
                                    <div className="d-flex align-items-center mb-3">
                                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                      <a href="#" onClick={(e) => handleInfoModal(e)}>
                                        <span className="font-weight-bolder">Edit</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                                <div className="d-flex flex-column gutter-b">
                                  <h4 className="font-weight-bolder fs-h4 mb-3">Company Codes</h4>
                                  <div className="d-block">
                                    <div className="d-block">
                                      <div className="d-flex align-items-center mb-3">
                                        <span className="text-light font-weight-bold">
                                          Eori No:
                                        </span>
                                        <span className="font-weight-bold text-dark-g ml-3">
                                          929-2
                                        </span>
                                      </div>
                                      <div className="d-flex align-items-center mb-3">
                                        <span className="text-light font-weight-bold">
                                          DUNS Number:
                                        </span>
                                        <span className="font-weight-bold text-dark-g ml-3">
                                          2-2
                                        </span>
                                      </div>
                                      <div className="d-flex align-items-center mb-3">
                                        <span className="text-light font-weight-bold">
                                          Carrier Code:
                                        </span>
                                        <span className="font-weight-bold text-dark-g ml-3">
                                          9208020
                                        </span>
                                      </div>
                                      <div className="d-flex align-items-center mb-3">
                                        <span className="text-light font-weight-bold">
                                          EDI Code:
                                        </span>
                                        <span className="font-weight-bold text-dark-g ml-3">
                                          29729
                                        </span>
                                      </div>
                                      <div className="d-flex align-items-center mb-3">
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#" onClick={(e) => handleCompanyCodes(e)}>
                                          <span className="font-weight-bolder">Edit</span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade show"
                          id="loading_financial"
                          role="tabpanel"
                          aria-labelledby="loading_financial"
                        >
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-slide-12">
                              ddd
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm={12} md={12} lg={5} xl={4} className="hide">
              <CCard className="cardCustom gutter-b">
                <div className="card-header cstHeaderTabs-line">
                  <div className="cstHeaderNav">
                    <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
                      <CNavItem>
                        <CNavLink href="#loading_details" active>
                          <span className="nav-icon">
                            <i className="fa fa-share-alt ico"></i>
                          </span>
                          <span className="nav-text">Share</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-icon">
                            <i className="far fa-copy ico"></i>
                          </span>
                          <span className="nav-text">Documents</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-icon">
                            <i className="fa fa-tasks ico"></i>
                          </span>
                          <span className="nav-text">Tasks</span>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink href="#loading_financial">
                          <span className="nav-icon">
                            <i className="far fa-envelope ico"></i>
                          </span>
                          <span className="nav-text">Mails</span>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                  </div>
                </div>
                <CCardBody>
                  <div className="card-scroll tab-content " id="group_6525502_content">
                    <div
                      className="tab-pane fade show active"
                      id="group_timeline_6525502"
                      role="tabpanel"
                      aria-labelledby="group_timeline"
                    >
                      <div id="new_group_post" className="border-bottom">
                        <CForm
                          className="simple_form new_post"
                          id="new_post"
                          noValidate="novalidate"
                          action="/posts"
                          acceptCharset="UTF-8"
                          data-remote="true"
                          method="post"
                        >
                          <div className="form-group text required post_message">
                            <CFormTextarea
                              className="form-control-cst user-share-input"
                              data-behavior="mentions"
                              placeholder="Share notes with your teammates about this record"
                              name="post[message]"
                              id="post_message"
                              style={{ minHeight: '36px' }}
                            ></CFormTextarea>
                          </div>
                          <div className="form-group hidden post_group_id">
                            <CFormInput
                              className="form-control-cst hidden"
                              value="6525502"
                              type="hidden"
                              name="post[group_id]"
                              id="post_group_id"
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="form-group post_is_private">
                              <CFormSelect
                                className="form-control-cst"
                                name="post[is_private]"
                                id="post_is_private"
                                style={{
                                  textAlign: 'start',
                                  marginRight: '21px',
                                  paddingRight: '9px',
                                  paddingLeft: '9px',
                                }}
                              >
                                <option value="public">Everybody</option>
                                <option value="private">Only Me</option>
                                <option value="team">Only My Team</option>
                              </CFormSelect>
                            </div>
                            <CButton type="submit" color="info" size="sm">
                              Share
                            </CButton>
                          </div>
                        </CForm>
                      </div>
                      <div id="user_3835_posts"></div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="group_documents_6525502"
                      role="tabpanel"
                      aria-labelledby="group_documents"
                    >
                      <div className="mb-4">
                        <a
                          className="btn btn-sm btn-info"
                          data-remote="true"
                          href="/s3files/new?group_id=6525502"
                        >
                          Add Document
                        </a>
                      </div>
                      <div id="group_6525502_documents_list">
                        <div id="nimbos-group_6525502_docfiles"></div>
                        <div id="group_6525502_s3files" className="s3files_list"></div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="group_todos_6525502"
                      role="tabpanel"
                      aria-labelledby="group_todos"
                    >
                      <div id="group_6525502_todos_list">
                        <div className="mb-4">
                          <a
                            className="btn btn-sm btn-info"
                            data-remote="true"
                            href="/helpdesk/todos/new?form_scope=internal&amp;group_id=6525502&amp;parent_id=921867&amp;parent_type=Logistics%3A%3ALoading"
                          >
                            New Tasks
                          </a>{' '}
                        </div>
                        <div id="group_6525502_todos" className="table-responsive">
                          <div className="table-responsive mb-2">
                            <table id="todos_list_table" className="table">
                              <tbody id="todos_list_tbody"></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="group_emails_6525502"
                      role="tabpanel"
                      aria-labelledby="group_emails"
                    >
                      <div id="group_6525502_emails_list">
                        <div className="mb-4">
                          <a
                            className="btn btn-sm btn-info"
                            data-remote="true"
                            href="/emails/new?group_id=6525502&amp;parent_id=921867&amp;parent_type=Logistics%3A%3ALoading"
                          >
                            New Mail
                          </a>{' '}
                        </div>
                        <div id="group_6525502_emails" className="table-responsive">
                          <div className="table-responsive table-truncate">
                            <table className="table table-vertical-center">
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>

      {/* location modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        size="lg"
        transition={false}
        visible={modalLocation}
        onClose={() => closeModalLocation()}
      >
        <CModalHeader>
          <CModalTitle>Locations</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form id="new_place">
            <LocationModal
              locationData={locationData}
              handleChangeLocation={handleChangeLocation}
              defCountry={defCountry}
              handleSelectForm={handleSelectForm}
              handleSelectFocus={handleSelectFocus}
              noOptionCity={noOptionCity}
              toggleHideShowGeo={toggleHideShowGeo}
              showGeoPosition={showGeoPosition}
            />
          </form>
        </CModalBody>
        <CModalFooter>
          {locationData.id ? (
            <CButton
              color="success"
              className="btn-default btn btn-success float-right"
              disabled={updatingLocation ? true : false}
              onClick={(e) => handleUpdateCompany(e)}
            >
              {updatingLocation ? (
                'Processing...'
              ) : (
                <span>
                  Save <i className="fa fa-check" />
                </span>
              )}
            </CButton>
          ) : (
            <CButton
              color="success"
              className="btn-default btn btn-success float-right"
              disabled={creatingLocation ? true : false}
              onClick={(e) => handleSubmitLocation(e)}
            >
              {creatingLocation ? (
                'Processing...'
              ) : (
                <span>
                  Save <i className="fa fa-check" />
                </span>
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>

      {/* city modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        visible={modalCity}
        onClose={() => closeModalCity()}
      >
        <CModalHeader>
          <CModalTitle>New City</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form id="new_city">
            <NewCityModal
              handleCitySelect={handleCitySelect}
              cityData={cityData}
              handleChangeCity={handleChangeCity}
              handleCityFocus={handleCityFocus}
            />
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="btn-default btn btn-success float-right"
            disabled={creatingCity ? true : false}
            onClick={(e) => handleSubmitCity(e)}
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
      </CModal>

      {/* new contact info modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        size="lg"
        transition={false}
        visible={newContactModal}
        onClose={() => closeContactModal()}
      >
        <CModalHeader>
          <CModalTitle>Contact Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form id={`edit_company_${showCompany && showCompany.id}`}>
            <ContactInfoModal
              locationData={locationData}
              handleChangeLocation={handleChangeLocation}
              defCountry={defCountry}
              handleSelectForm={handleSelectForm}
              handleSelectFocus={handleSelectFocus}
              noOptionCity={noOptionCity}
              toggleHideShowGeo={toggleHideShowGeo}
              showGeoPosition={showGeoPosition}
            />
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            color="success"
            className="btn-default btn btn-success float-right"
            disabled={creatingCity ? true : false}
            onClick={(e) => handleSubmitCity(e)}
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
      </CModal>

      {/* financial modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        size="xl"
        transition={false}
        visible={financialModal}
        onClose={() => closeFinModal()}
      >
        <CModalHeader>
          <CModalTitle>Financials</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CompanyFinancials
            financialData={financialData}
            handleChangeFinancials={handleChangeFinancials}
          />
        </CModalBody>
        <CModalFooter>
          {/* <CButton color="secondary" variant="ghost" onClick={() => closeFinModal()}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => handleSubmitFinancial()}>
            {creatingFinancial ? 'Processing...' : 'Save'}
          </CButton> */}
        </CModalFooter>
      </CModal>

      {/* other info modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        size="lg"
        transition={false}
        visible={otherInfoModal}
        onClose={() => closeInfoModal()}
      >
        <CModalHeader>
          <CModalTitle>Other Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <CompanyFinancials
            financialData={financialData}
            handleChangeFinancials={handleChangeFinancials}
          /> */}
        </CModalBody>
        <CModalFooter>
          {/* <CButton color="secondary" variant="ghost" onClick={() => closeFinModal()}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => handleSubmitFinancial()}>
            {creatingFinancial ? 'Processing...' : 'Save'}
          </CButton> */}
        </CModalFooter>
      </CModal>

      {/* company codes modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        size="lg"
        transition={false}
        visible={companyCodesModal}
        onClose={() => closeCompanyCodes()}
      >
        <CModalHeader>
          <CModalTitle>Company Codes</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* <CompanyFinancials
            financialData={financialData}
            handleChangeFinancials={handleChangeFinancials}
          /> */}
        </CModalBody>
        <CModalFooter>
          {/* <CButton color="secondary" variant="ghost" onClick={() => closeFinModal()}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => handleSubmitFinancial()}>
            {creatingFinancial ? 'Processing...' : 'Save'}
          </CButton> */}
        </CModalFooter>
      </CModal>

      {/* new iban modal*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={ibanModal}
        title={
          <div className="space">
            <div>
              <span>Add New Iban</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeIbanModal(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <NewIbanPanel closeIbanPanel={closeIbanModal} showCompany={showCompany} />
        </div>
      </SlidingPane>
    </div>
  )
}

export default ViewCompany
