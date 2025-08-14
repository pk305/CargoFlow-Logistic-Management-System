import React, { useState, useEffect } from 'react'
import { CForm, CButton, CFormInput, CRow, CCol, CFormFeedback } from '@coreui/react'
import { useHistory } from 'react-router-dom'
import { isEmpty, isNull } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { clearSetupErrors, updateSetup, showSetupError } from 'src/redux/slices/setupSlice'
import Select from 'react-select'
import classNames from 'classnames'
import countryList from 'react-select-country-list'
import $ from 'jquery'
import { fetchTimezones } from 'src/redux/slices/timezoneSlice'
import { fetchCities } from 'src/redux/slices/citySlice'

const CompanyInfo = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { setupErrors, updatingSetup } = useSelector((state) => state.setup)
  const { company } = useSelector((state) => state.system)
  const { authUser } = useSelector((state) => state.auth)
  const { cities, fetchingCities } = useSelector((state) => state.city)
  const { timezones, fetchingTimezones } = useSelector((state) => state.timezone)
  const [loadDataValue, setloadDataValue] = useState({
    loadCity: '',
    loadCountry: '',
  })

  const [setupData, setSetupData] = useState({
    companyId: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyTel: '',
    companyWebsite: '',
    cityId: '',
    countryId: '',
    postcode: '',
    taxNo: '',
    timezoneId: `${authUser && authUser.timezone ? authUser.timezone.id : ''}`,
    steps: '2',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setSetupData({
      ...setupData,
      [name]: value,
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearSetupErrors({ type: c, errorType: 'errSetup' }))

    if (c === 'companyInfo.timezoneId') {
      if (isEmpty(timezones)) {
        dispatch(fetchTimezones())
      }
    } else if (c === 'companyInfo.cityId') {
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

      setSetupData((state) => ({
        ...state,
        cityId: !isNull(f) ? f.id : '',
        countryId: !isNull(f) ? f.country : '',
      }))
    } else {
      if (c === 'countryId') {
        setloadDataValue((state) => ({
          ...state,
          loadCountry: !isNull(val) ? { label: val.label, value: val.value } : null,
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

  const handleSubmitSetup = async (e) => {
    e.preventDefault()
    const form = $('#new_setup')
    if (form.length > 0) {
      if (setupData.companyName === '') {
        dispatch(showSetupError({ type: 'companyInfo.companyName', errorType: 'errSetup' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }

    const resData = await dispatch(
      updateSetup({ companyId: company.id, companyInfo: setupData }),
    ).unwrap()
    if (resData) {
      if (resData.new) {
        window.location.href = `/setups/new?step=${resData.steps}`
      } else {
        history.push(`/setups/new?step=${resData.steps}`)
      }
    }
  }

  const handleModalCity = (e) => {
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

  useEffect(() => {
    if (company) {
      setSetupData((state) => ({
        ...state,
        companyId: company.id ? company.id : '',
        companyName: company.name ? company.name : '',
        companyAddress: company.address ? company.address : '',
        companyEmail: company.email ? company.email : '',
        companyTel: company.phone ? company.phone : '',
        companyWebsite: company.website ? company.website : '',
        cityId: company.city ? company.city.id : '',
        countryId: company.countryId ? company.countryId : '',
        postcode: company.postcode ? company.postcode : '',
        taxNo: company.taxno ? company.taxno : '',
      }))

      const countryData = company.countryId ? countryList().getLabel(company.countryId) : null
      setloadDataValue((state) => ({
        ...state,
        loadCity: company.city ? { label: company.city.name, value: company.city.id } : '',
        loadCountry: countryData
          ? { label: `${company.countryId}-${countryData}`, value: company.countryId }
          : '',
      }))
    }
  }, [company])

  const countryData = countryList().data

  if (!authUser) return null

  return (
    <div>
      <div className="pageContainer-wrapper">
        <div className="pageBoxSizing-container">
          <div
            className="setupProccessWrapper spw-1"
            id="cstProcessWiz"
            data-stepstate="first"
            data-stepclickable="false"
          >
            <div className="setupProccess-nav">
              <div className="setupProccess-steps">
                <div className="setupProccess-step" data-stepstate="current">
                  <div className="setupProccess-label">
                    <i className="fa fa-building icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Information</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step">
                  <div className="setupProccess-label">
                    <i className="fa fa-users icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Personnel</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="pending">
                  <div className="setupProccess-label">
                    <i className="fa fa-eye icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Company Logo</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="pending">
                  <div className="setupProccess-label">
                    <i className="fa fa-sitemap icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Branch Information</h3>
                  </div>
                  <span className="setupProccess-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
                <div className="setupProccess-step" data-stepstate="pending">
                  <div className="setupProccess-label">
                    <i className="fa fa-users icon-xl setupProccess-icon"></i>
                    <h3 className="setupProccess-title">Operations</h3>
                  </div>
                  <span className="setupProccess-arrow last">
                    <i className="fa fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pageContainer-body">
        <CForm className="setupProccessForm" id="new_setup" onSubmit={(e) => handleSubmitSetup(e)}>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <h4 className="titleHeading">Company Information</h4>
            </CCol>
          </CRow>
          <h6 className="subTitleHeading">Step: 1/6</h6>
          <CRow>
            <CCol sm={12} md={6} lg={6} xl={6}>
              <CRow>
                <CCol sm={12} md={12} lg={12} xl={12}>
                  <div className="form-group  setup_company_name">
                    <label className="control-label " htmlFor="setup_company_name">
                      Company Name
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="companyName"
                      id="setup_company_name"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.companyName}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyName) ? true : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.companyName',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {setupErrors.companyInfo.companyName}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={12} md={12} lg={12} xl={12}>
                  <div className="form-group  setup_address">
                    <label className="control-label " htmlFor="setup_address">
                      Address
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="companyAddress"
                      id="setup_address"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.companyAddress}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyAddress)
                          ? true
                          : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.companyAddress',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyAddress)
                          ? true
                          : false
                      }
                      className="fieldError-cst"
                    >
                      {setupErrors.companyInfo.companyAddress}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={12} md={4} lg={4} xl={4}>
                  <div className="form-group  setup_city_name">
                    <label className="control-label " htmlFor="setup_city_name">
                      City
                    </label>
                    <div className="input-group">
                      <Select
                        id="setup_city_name"
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        isLoading={fetchingCities ? true : false}
                        isSearchable
                        name="cityId"
                        menuPlacement="auto"
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
                          'is-invalid': setupErrors && !isEmpty(setupErrors.companyInfo.cityId),
                        })}
                        noOptionsMessage={() => noOptionCity()}
                        onChange={(e) => handleSelectForm('cityId', e)}
                        onMenuOpen={(e) => handleSelectFocus('companyInfo.cityId', e)}
                      />
                      <CFormFeedback
                        invalid={
                          setupErrors && !isEmpty(setupErrors.companyInfo.cityId) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {setupErrors.companyInfo.cityId}
                      </CFormFeedback>
                    </div>
                  </div>
                </CCol>
                <CCol sm={12} md={4} lg={4} xl={4}>
                  <div className="form-group select">
                    <label className="control-label select optional" htmlFor="setup_country_id">
                      Country
                    </label>
                    <div className="input-group">
                      <Select
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': setupErrors && !isEmpty(setupErrors.companyInfo.countryId),
                        })}
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder="-Select-"
                        isSearchable
                        menuPlacement="auto"
                        value={loadDataValue.loadCountry}
                        isLoading={countryData && !countryData.length > 0 ? true : false}
                        id="setup_country_id"
                        options={
                          countryData && countryData.length > 0
                            ? countryData.map((item) => ({
                                value: item.value,
                                label: `${item.value ? item.value + '-' : ''}${item.label}`,
                              }))
                            : []
                        }
                        noOptionsMessage={() => 'No results found'}
                        onChange={(val) => handleSelectForm('countryId', val)}
                        onMenuOpen={(e) => handleSelectFocus('companyInfo.countryId', e)}
                      />
                      <CFormFeedback
                        invalid={
                          setupErrors && !isEmpty(setupErrors.companyInfo.countryId) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {setupErrors.companyInfo.countryId}
                      </CFormFeedback>
                    </div>
                  </div>
                </CCol>
                <CCol sm={12} md={4} lg={4} xl={4}>
                  <div className="form-group  setup_postcode">
                    <label className="control-label " htmlFor="setup_postcode">
                      Postcode
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="postcode"
                      id="setup_postcode"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.postcode}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.postcode) ? true : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.postcode',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.postcode) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {setupErrors.companyInfo.postcode}
                    </CFormFeedback>
                  </div>
                </CCol>
              </CRow>
            </CCol>
            <CCol sm={12} md={6} lg={6} xl={6}>
              <CRow>
                <CCol sm={12} md={6} lg={6} xl={6}>
                  <div className="form-group  setup_tel">
                    <label className="control-label " htmlFor="setup_tel">
                      Phone Number
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="companyTel"
                      id="setup_tel"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.companyTel}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyTel) ? true : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.companyTel',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyTel) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {setupErrors.companyInfo.companyTel}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={12} md={6} lg={6} xl={6}>
                  <div className="form-group  setup_tax_no">
                    <label className="control-label " htmlFor="setup_tax_no">
                      Tax No
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="taxNo"
                      id="setup_tax_no"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.taxNo}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.taxNo) ? true : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.taxNo',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.taxNo) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {setupErrors.companyInfo.taxNo}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={12} md={6} lg={6} xl={6}>
                  <div className="form-group email optional setup_email">
                    <label className="control-label email optional" htmlFor="setup_email">
                      Email
                    </label>
                    <CFormInput
                      className="form-control-cst string email optional"
                      type="email"
                      name="companyEmail"
                      id="setup_email"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.companyEmail}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyEmail) ? true : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.companyEmail',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyEmail) ? true : false
                      }
                      className="fieldError-cst"
                    >
                      {setupErrors.companyInfo.companyEmail}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={12} md={6} lg={6} xl={6}></CCol>
                <CCol sm={12} md={6} lg={6} xl={6}>
                  <div className="form-group  setup_website">
                    <label className="control-label " htmlFor="setup_website">
                      Website
                    </label>
                    <CFormInput
                      className="form-control-cst "
                      type="text"
                      name="companyWebsite"
                      id="setup_website"
                      onChange={(e) => handleChangeForm(e)}
                      value={setupData.companyWebsite}
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyWebsite)
                          ? true
                          : false
                      }
                      onFocus={() =>
                        dispatch(
                          clearSetupErrors({
                            type: 'companyInfo.companyWebsite',
                            errorType: 'errSetup',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={
                        setupErrors && !isEmpty(setupErrors.companyInfo.companyWebsite)
                          ? true
                          : false
                      }
                      className="fieldError-cst"
                    >
                      {setupErrors.companyInfo.companyWebsite}
                    </CFormFeedback>
                  </div>
                </CCol>
                <CCol sm={12} md={6} lg={6} xl={6}>
                  <div className="form-group">
                    <label className="control-label" htmlFor="setup_time_zone">
                      Time Zone
                    </label>
                    <div className="input-group lg">
                      {/* {JSON.stringify(authUser)} */}
                      <Select
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': setupErrors && !isEmpty(setupErrors.companyInfo.timezoneId),
                        })}
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder="-Select-"
                        isSearchable
                        id="setup_time_zone"
                        isLoading={fetchingTimezones ? true : false}
                        defaultValue={
                          authUser && authUser.timezone
                            ? {
                                value: authUser.timezone.id,
                                label: `${
                                  authUser.timezone.code ? authUser.timezone.code + ' ' : ''
                                }  ${authUser.timezone.name}`,
                              }
                            : null
                        }
                        options={
                          timezones && timezones.length > 0
                            ? timezones.map((item) => ({
                                value: item.id,
                                label: `${item.code ? item.code + ' ' : ''}  ${item.name}`,
                              }))
                            : []
                        }
                        noOptionsMessage={() => 'No results found'}
                        onChange={(val) => handleSelectForm('timezoneId', val)}
                        onMenuOpen={(e) => handleSelectFocus('companyInfo.timezoneId', e)}
                      />
                      <CFormFeedback
                        invalid={
                          setupErrors && !isEmpty(setupErrors.companyInfo.timezoneId) ? true : false
                        }
                        className="fieldError-cst"
                      >
                        {setupErrors.companyInfo.timezoneId}
                      </CFormFeedback>
                    </div>
                  </div>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <div className="separator"></div>
          <CRow>
            <CCol sm={12} md={12} lg={12} xl={12}>
              <a className="btn btn-info disabled mr-2" href="/setups/new?step=1">
                Previous
              </a>
              <CButton type="submit" color="primary" disabled={updatingSetup ? true : false}>
                {updatingSetup ? 'Processing...' : 'Next'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}

export default CompanyInfo
