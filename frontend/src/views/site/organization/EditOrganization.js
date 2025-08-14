import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CCardFooter,
  CButton,
  CCallout,
  CFormInput,
  CFormSelect,
  CFormFeedback,
  CFormTextarea,
  CModalFooter,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CImage,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { updateCompany, clearCompanyError, findCompany } from 'src/redux/slices/companySlice'
import classNames from 'classnames'
import { isEmpty, isNull } from 'lodash'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { clearCityError, createCity, fetchCities } from 'src/redux/slices/citySlice'
import Noty from 'noty'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'
import XhrApi from 'src/config/XhrApi '

const EditOrganization = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { companyId } = useParams()
  const [companyData, setCompanyData] = useState({
    companyId: null,
    companyName: '',
    cityId: '',
    countryId: '',
    district: '',
    address: '',
    postcode: '',
    eoriCode: '',
    taxOffice: '',
    taxNo: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    companyWebsite: '',
    companySalerId: '',
    branchId: '',
    companyGroup: '',
    companyType: '',
    companySector: '',
    tagNames: '',
    notes: '',
    contactsAttrName: '',
    contactsAttrJobTitle: '',
    contactsAttrTel: '',
    contactsAttrEmail: '',
    logoUrl: '',
  })
  const { errorCallout, errorCalloutText } = useSelector((state) => state.booking)
  const { showCompany, findingCompany, updatingCompany, companyErrors } = useSelector(
    (state) => state.company,
  )
  const { cities, creatingCity, fetchingCities, cityErrors } = useSelector((state) => state.city)
  const [loadDataValue, setloadDataValue] = useState({
    loadCity: '',
    loadCountry: '',
  })
  const [modalCity, setModalCity] = useState(false)
  const [cityData, setCityData] = useState({
    cityName: '',
    code: '',
    countryId: '',
    telCode: '',
    statesCode: '',
  })
  const { authUser } = useSelector((state) => state.auth)
  const { logoData } = useSelector((state) => state.system)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setCompanyData({
      ...companyData,
      [name]: value,
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearCompanyError({ type: c, errorType: 'errCompany' }))

    if (c === 'cityId') {
      if (isEmpty(cities)) {
        dispatch(fetchCities())
      }
    }
  }

  const handleSelectForm = (c, val) => {
    const f = val ? val.value : null

    if (c === 'cityId') {
      const countryData = f ? countryList().getLabel(f.country) : null
      setloadDataValue((state) => ({
        ...state,
        loadCity: f ? { label: f.name, value: f.id } : '',
        loadCountry: countryData ? { label: `${f.country}-${countryData}`, value: f.country } : '',
      }))

      setCompanyData((state) => ({
        ...state,
        cityId: !isNull(f) ? f.id : '',
        countryId: !isNull(f) ? f.country : '',
      }))
    } else {
      if (c === 'countryId') {
        setloadDataValue((state) => ({
          ...state,
          loadCountry: { label: val.label, value: val.value },
        }))
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

  // const clearCompanyData = () => {
  //   setCompanyData({
  //     companyId: null,
  //     companyName: '',
  //     cityId: '',
  //     countryId: '',
  //     district: '',
  //     address: '',
  //     postcode: '',
  //     eoriCode: '',
  //     taxOffice: '',
  //     taxNo: '',
  //     companyTel: '',
  //     companyFax: '',
  //     companyEmail: '',
  //     companyWebsite: '',
  //     companySalerId: '',
  //     branchId: '',
  //     companyGroup: '',
  //     companyType: '',
  //     companySector: '',
  //     tagNames: '',
  //     notes: '',
  //     contactsAttrName: '',
  //     contactsAttrJobTitle: '',
  //     contactsAttrTel: '',
  //     contactsAttrEmail: '',
  //   })
  // }

  const handleSubmitCompany = async (e) => {
    e.preventDefault()
    // form data
    const resData = await dispatch(
      updateCompany({ Id: companyData.companyId, ...companyData }),
    ).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `updateItem${resData.id}`,
        text: 'Company updated succesfully',
        timeout: 4000,
      }).show()
      history.push('/organization')
    }
  }

  const closeCallout = (e) => {
    e.preventDefault()
  }

  const handleChangeCity = (e) => {
    const { name, value } = e.target
    setCityData({
      ...cityData,
      [name]: value,
    })
  }

  const handleModalCity = (e) => {
    e.preventDefault()
    setModalCity(true)
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

  const closeModalCity = () => {
    setModalCity(false)
  }

  const uppy = useMemo(() => {
    return new Uppy({
      autoProceed: true,
      debug: true,
      restrictions: {
        maxFileSize: 1000000,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ['image/*'],
      },
    })
      .on('file-added', (file) => {
        uppy.setFileMeta(file.id, {
          userId: authUser.uuid,
          companyId,
          mediaType: 'logo',
        })
      })
      .use(XHRUpload, XhrApi())
      .on('complete', (result) => {
        if (result.successful) {
          if (result.successful.length > 0) {
            for (let i = 0; i < result.successful.length; i++) {
              const e = result.successful[i]
              setCompanyData((state) => ({
                ...state,
                logoUrl: e.response.body.url,
              }))
            }
          }
        }
      })
  }, [authUser.uuid, companyId])

  const findCompanyData = useCallback(async () => {
    if (companyId) {
      const resData = await dispatch(findCompany(companyId)).unwrap()
      if (resData) {
        document.title = resData.name
        const c = resData

        setCompanyData((state) => ({
          ...state,
          companyId: c.id ? c.id : '',
          companyName: c.name ? c.name : '',
          cityId: c.city && c.city.id ? c.city.id : '',
          countryId: c.countryId ? c.countryId : '',
          district: c.district ? c.district : '',
          address: c.address ? c.address : '',
          postcode: c.postcode ? c.postcode : '',
          eoriCode: c.eoriCode ? c.eoriCode : '',
          taxOffice: c.taxOffice ? c.taxOffice : '',
          taxNo: c.taxno ? c.taxno : '',
          companyTel: c.phone ? c.phone : '',
          companyFax: c.fax ? c.fax : '',
          companyEmail: c.email ? c.email : '',
          companyWebsite: c.website ? c.website : '',
          companySalerId: c.saler ? c.saler.id : '',
          branchId: c.branch ? c.branch.id : '',
          companyGroup: c.companyGroup ? c.companyGroup : '',
          companyType: c.companyType ? c.companyType : '',
          companySector: c.companySector ? c.companySector : '',
          tagNames: c.tagNames ? c.tagNames : '',
          notes: c.notes ? c.notes : '',
          contactsAttrName: c.contact && c.contact.name ? c.contact.name : '',
          contactsAttrJobTitle: c.contact && c.contact.jobTitle ? c.contact.jobTitle : '',
          contactsAttrTel: c.contact && c.contact.phone ? c.contact.phone : '',
          contactsAttrEmail: c.contact && c.contact.email ? c.contact.email : '',
        }))

        if (logoData) {
          setCompanyData((state) => ({
            ...state,
            logoUrl: logoData.logoUrl ? logoData.logoUrl : '',
          }))
        }
      }
    }
  }, [companyId, logoData, dispatch])

  useEffect(() => {
    findCompanyData()
  }, [findCompanyData])

  useEffect(() => {
    return () => uppy.close({ reason: 'unmount' })
  }, [uppy])

  const countryData = countryList().data

  if (findingCompany) return null

  return (
    <div className="rawWrapper-container">
      <div className="pageContainer">
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
                        <i className="fa fa-store icon-2x"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">{showCompany && showCompany.name}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CForm
              id={`edit_company_${showCompany && showCompany.id}`}
              onSubmit={(e) => handleSubmitCompany(e)}
            >
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <h4 className="titleHeading">General Information</h4>
                          </div>
                        </div>
                        <div className="row">
                          <div className="co-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="form-group company_name">
                              <label className="control-label" htmlFor="company_name">
                                Name
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                placeholder="Short name"
                                type="text"
                                name="companyName"
                                id="company_name"
                                value={companyData.companyName}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyName)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyName',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyName)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyName}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                            <div className="form-group text company_address">
                              <label className="control-label text" htmlFor="company_address">
                                Address
                              </label>
                              <CFormTextarea
                                className="form-control-cst text"
                                rows="1"
                                name="address"
                                id="company_address"
                                value={companyData.address}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.address) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'address',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              ></CFormTextarea>
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.address) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.address}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group company_postcode">
                              <label className="control-label" htmlFor="company_postcode">
                                Postcode
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="postcode"
                                id="company_postcode"
                                value={companyData.postcode}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.postcode) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'postcode',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {companyErrors.postcode}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group company_city_name">
                              <label className="control-label" htmlFor="company_city_name">
                                City
                              </label>
                              <div className="input-group">
                                <Select
                                  id="company_city_name"
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder
                                  isLoading={fetchingCities ? true : false}
                                  isSearchable
                                  name="cityId"
                                  value={loadDataValue.loadCity}
                                  options={
                                    cities && !fetchingCities && cities.length > 0
                                      ? cities.map((itm) => ({
                                          label: itm.name,
                                          value: itm,
                                        }))
                                      : []
                                  }
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                    {
                                      'is-invalid': companyErrors && !isEmpty(companyErrors.cityId),
                                    },
                                  )}
                                  noOptionsMessage={() => noOptionCity()}
                                  onChange={(e) => handleSelectForm('cityId', e)}
                                  onMenuOpen={(e) => handleSelectFocus('cityId', e)}
                                />
                                <CFormFeedback
                                  invalid={
                                    companyErrors && !isEmpty(companyErrors.cityId) ? true : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {companyErrors.cityId}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group company_district">
                              <label className="control-label" htmlFor="company_district">
                                County
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="district"
                                id="company_district"
                                value={companyData.district}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.district) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'district',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {companyErrors.district}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group select company_country_id">
                              <label className="control-label select" htmlFor="company_country_id">
                                Country
                              </label>
                              <div className="input-group">
                                <Select
                                  key={'cstSelect-countryId'}
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                    {
                                      'is-invalid':
                                        companyErrors && !isEmpty(companyErrors.countryId),
                                    },
                                  )}
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder="-Select-"
                                  isSearchable
                                  value={loadDataValue.loadCountry}
                                  isLoading={countryData && !countryData.length > 0 ? true : false}
                                  id="company_country_id"
                                  options={
                                    countryData && countryData.length > 0
                                      ? countryData.map((item) => ({
                                          value: item.value,
                                          label: `${item.value ? item.value + '-' : ''}${
                                            item.label
                                          }`,
                                        }))
                                      : []
                                  }
                                  noOptionsMessage={() => 'No results found'}
                                  onChange={(val) => handleSelectForm('countryId', val)}
                                  onFocus={(e) => handleSelectFocus('countryId', e)}
                                />
                                <CFormFeedback invalid className="fieldError-cst">
                                  {companyErrors.countryId}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group company_eori_code">
                              <label className="control-label" htmlFor="company_eori_code">
                                EORI No
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="eoriCode"
                                id="company_eori_code"
                                value={companyData.eoriCode}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.eoriCode) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'eoriCode',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {companyErrors.eoriCode}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group company_taxoffice">
                              <label className="control-label" htmlFor="company_taxoffice">
                                Deferment Acc. No
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="taxOffice"
                                id="company_taxoffice"
                                value={companyData.taxOffice}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.taxOffice) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'taxOffice',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {companyErrors.taxOffice}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group company_taxno">
                              <label className="control-label" htmlFor="company_taxno">
                                Tax No
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="taxNo"
                                id="company_taxno"
                                value={companyData.taxNo}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.taxNo) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'taxNo',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.taxNo) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.taxNo}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <h4 className="titleHeading">Contact information</h4>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group">
                              <label className="control-label" htmlFor="company_tel">
                                Phone
                              </label>
                              <CFormInput
                                className="form-control-cst mask_phone"
                                type="text"
                                name="companyTel"
                                id="company_tel"
                                value={companyData.companyTel}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyTel) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyTel',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyTel) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyTel}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group company_fax">
                              <label className="control-label" htmlFor="company_fax">
                                Fax
                              </label>
                              <CFormInput
                                className="form-control-cst mask_phone"
                                type="text"
                                name="companyFax"
                                id="company_fax"
                                value={companyData.companyFax}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyFax) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyFax',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyFax) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyFax}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group email company_email">
                              <label className="control-label email" htmlFor="company_email">
                                Email
                              </label>
                              <CFormInput
                                className="form-control-cst string email"
                                type="email"
                                name="companyEmail"
                                id="company_email"
                                value={companyData.companyEmail}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyEmail)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyEmail',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyEmail)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyEmail}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group company_website">
                              <label className="control-label" htmlFor="company_website">
                                Web Site
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="companyWebsite"
                                id="company_website"
                                value={companyData.companyWebsite}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyWebsite)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyWebsite',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              />
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyWebsite)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyWebsite}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select company_saler_id">
                              <label className="control-label select" htmlFor="company_saler_id">
                                A/C Rep.
                              </label>
                              <div className="input-group">
                                <Select
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                  )}
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder
                                  isSearchable
                                  id="company_sector"
                                  options={[{ label: 'Kennedy Peter', value: '1234' }]}
                                  menuPlacement="auto"
                                  noOptionsMessage={() => 'No results found'}
                                  onChange={(e) => handleSelectForm('companySalerId', e)}
                                  onFocus={(e) => handleSelectFocus('companySalerId', e)}
                                />
                                <CFormFeedback
                                  invalid={
                                    companyErrors && !isEmpty(companyErrors.companySalerId)
                                      ? true
                                      : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {companyErrors.companySalerId}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select company_branch_id">
                              <label className="control-label select" htmlFor="company_branch_id">
                                Branch
                              </label>
                              <CFormSelect
                                className="form-control-cst select"
                                name="branchId"
                                id="company_branch_id"
                                value={companyData.branchId}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.branchId) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'branchId',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              >
                                <option value="1380">Head Office</option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.branchId) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.branchId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <h4 className="titleHeading">Other Information</h4>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group select company_company_group">
                              <label
                                className="control-label select"
                                htmlFor="company_company_group"
                              >
                                Company Group
                              </label>
                              <CFormSelect
                                className="form-control-cst select"
                                name="companyGroup"
                                id="company_company_group"
                                value={companyData.companyGroup}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyGroup)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyGroup',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              >
                                <option value=""></option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyGroup)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyGroup}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group select company_company_type">
                              <label
                                className="control-label select"
                                htmlFor="company_company_type"
                              >
                                Company Type
                              </label>
                              <CFormSelect
                                className="form-control-cst select"
                                name="companyType"
                                id="company_company_type"
                                value={companyData.companyType}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyType)
                                    ? true
                                    : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyType',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              >
                                <option value=""></option>
                                <option value="carrier">Carier (Fleet Owner)</option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.companyType)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.companyType}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group select company_sector">
                              <label className="control-label select" htmlFor="company_sector">
                                Industry
                              </label>
                              <div className="input-group">
                                <Select
                                  className={classNames(
                                    'form-control form-control-cst pageCstSelect ',
                                  )}
                                  classNamePrefix="cstSelect"
                                  isClearable
                                  placeholder
                                  isSearchable
                                  id="company_sector"
                                  options={[
                                    { label: '', value: '' },
                                    { label: 'Aerospace, Defense Industry', value: 'Aerospace' },
                                    { label: 'Agriculture', value: 'Agriculture' },
                                    { label: 'Air Transport', value: 'Air Transport' },
                                    { label: 'Alcohol Beverages', value: 'Alcohol' },
                                    { label: 'Automotive, Car Manufacturing', value: 'Automotive' },
                                    {
                                      label: 'Chemical & Related Manufacturig',
                                      value: 'Chemical',
                                    },
                                    {
                                      label: 'Construction, Building Materials & Equipment',
                                      value: 'Construction',
                                    },
                                    {
                                      label: 'Electronics Manufacturing & Equipment',
                                      value: 'Electronics',
                                    },
                                    { label: 'Energy Production & Services', value: 'Energy' },
                                    {
                                      label: 'Newspaper, Magazine & Book Publishing',
                                      value: 'Publishing',
                                    },
                                    {
                                      label: 'Food & Beverage & Bars & Restaurants',
                                      value: 'Food',
                                    },
                                    { label: 'Gas & Oil', value: 'Gas&amp;Oil' },
                                    {
                                      label:
                                        ' Pharmaceuticals / Health Products & Medical Supplies',
                                      value: 'Pharmaceuticals',
                                    },
                                    { label: 'Road Transport', value: 'Road Transport' },
                                    { label: 'Sea Transport', value: 'Sea Transport' },
                                    { label: 'Textile', value: 'Textile, Clothing Manufacturing' },
                                    { label: 'Tobacco', value: 'Tobacco Products' },
                                    { label: 'Transportation', value: 'Transportation' },
                                  ]}
                                  menuPlacement="auto"
                                  noOptionsMessage={() => 'No results found'}
                                  onChange={(e) => handleSelectForm('companySector', e)}
                                  onFocus={(e) => handleSelectFocus('companySector', e)}
                                />
                                <CFormFeedback
                                  invalid={
                                    companyErrors && !isEmpty(companyErrors.companySector)
                                      ? true
                                      : false
                                  }
                                  className="fieldError-cst"
                                >
                                  {companyErrors.companySector}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-4">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select company_tag_names">
                              <label className="control-label select" htmlFor="company_tag_names">
                                Tags
                              </label>
                              <CFormSelect
                                className="form-control-cst"
                                data-plugin="tag_select"
                                multiple=""
                                name="tagNames"
                                id="company_tag_names"
                                value={companyData.tagNames}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.tagNames) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyType',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              >
                                <option value="" disabled></option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.tagNames) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.tagNames}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group text company_notes">
                              <label className="control-label text" htmlFor="company_notes">
                                Notes
                              </label>
                              <CFormTextarea
                                className="form-control-cst text"
                                rows="1"
                                name="notes"
                                id="company_notes"
                                value={companyData.notes}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.notes) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'companyType',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              ></CFormTextarea>
                              <CFormFeedback
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.notes) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {companyErrors.notes}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <h4 className="titleHeading">Logo</h4>
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                            style={{ paddingLeft: '1.25rem' }}
                          >
                            <Dashboard
                              uppy={uppy}
                              id={'file_attachment'}
                              width={398}
                              height={198}
                              showLinkToFileUploadResult={false}
                              showProgressDetails={true}
                              hideUploadButton={true}
                              proudlyDisplayPoweredByUppy={false}
                              hidePauseResumeButton={true}
                              hideProgressAfterFinish={true}
                              showRemoveButtonAfterComplete={true}
                            />
                          </div>
                          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div className="image-thumbnail">
                              {companyData.logoUrl ? (
                                <CImage
                                  src={companyData.logoUrl}
                                  thumbnail
                                  style={{ height: '198px' }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter className="cardCustom-footer">
                <div>
                  <CButton
                    type="submit"
                    color="success"
                    className="btn-default btn btn-success"
                    disabled={updatingCompany ? true : false}
                  >
                    {updatingCompany ? (
                      'Processing...'
                    ) : (
                      <span>
                        Save <i className="fa fa-check" />
                      </span>
                    )}
                  </CButton>
                </div>
              </CCardFooter>
            </CForm>
          </CCard>
        </div>
      </div>

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
                          'is-invalid': cityErrors && !isEmpty(cityErrors.countryId),
                        })}
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isSearchable
                        isLoading={countryData && !countryData.length > 0 ? true : false}
                        id="city_country_id"
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

export default EditOrganization
