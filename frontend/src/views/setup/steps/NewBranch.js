import React, { useState } from 'react'
import { CButton, CCard, CFormFeedback, CFormInput } from '@coreui/react'
import Select from 'react-select'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, isNull } from 'lodash'
import countryList from 'react-select-country-list'
import $ from 'jquery'
import { clearBranchError, showBranchError } from 'src/redux/slices/branchSlice'
import { fetchUsers } from 'src/redux/slices/userSlice'

const NewBranch = () => {
  const dispatch = useDispatch()
  const { cities, fetchingCities } = useSelector((state) => state.city)
  const { branchErrors, fetchingBranches } = useSelector((state) => state.branch)
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const [branchData, setBranchData] = useState({
    branchName: '',
    tel: '',
    email: '',
    managerId: '',
  })
  const [loadDataValue, setloadDataValue] = useState({
    loadCity: '',
    loadCountry: '',
  })

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setBranchData({
      ...branchData,
      [name]: value,
    })
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearBranchError({ type: c, errorType: 'errBranch' }))
    if (c === 'managerId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
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

      setBranchData((state) => ({
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

  const handleSubmitBranch = async (e) => {
    e.preventDefault()
    const form = $('#new_branch')
    if (form.length > 0) {
      if (branchData.branchName === '') {
        dispatch(showBranchError({ type: 'branchName', errorType: 'errBranch' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }

    // const resData = await dispatch(
    //   updateSetup({ companyId: company.id,  branchData }),
    // ).unwrap()
    // if (resData) {
    //   if (resData.new) {
    //     window.location.href = `/setups/new?step=${resData.steps}`
    //   } else {
    //     history.push(`/setups/new?step=${resData.steps}`)
    //   }
    // }
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

  const countryData = countryList().data

  return (
    <div className="slidePanel-inner-section">
      <CCard className="cardCustom">
        <div className="card-body p-6">
          <form
            className="simple_form horizontal-form"
            id="new_branch"
            onSubmit={(e) => handleSubmitBranch(e)}
          >
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group string required branch_name">
                  <label className="control-label string required" htmlFor="branch_name">
                    Branch Name <span title="required">*</span>
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="branchName"
                    id="branch_name"
                    onChange={(e) => handleChangeForm(e)}
                    value={branchData.branchName}
                    invalid={branchErrors && !isEmpty(branchErrors.branchName) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearBranchError({
                          type: 'branchName',
                          errorType: 'errBranch',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {branchErrors.branchName}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group select optional branch_manager_id">
                  <label className="control-label select optional" htmlFor="branch_manager_id">
                    Manager
                  </label>
                  <div className="input-group">
                    <Select
                      id="branch_manager_id"
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder
                      isLoading={fetchingUsers ? true : false}
                      isSearchable
                      name="cityId"
                      menuPlacement="auto"
                      options={
                        users && !fetchingUsers && users.length > 0
                          ? users.map((itm) => ({
                              label: itm.name,
                              value: itm,
                            }))
                          : []
                      }
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': branchErrors && !isEmpty(branchErrors.managerId),
                      })}
                      noOptionsMessage={() => noOptionCity()}
                      onChange={(e) => handleSelectForm('managerId', e)}
                      onMenuOpen={(e) => handleSelectFocus('managerId', e)}
                    />
                    <CFormFeedback
                      invalid={branchErrors && !isEmpty(branchErrors.managerId) ? true : false}
                      className="fieldError-cst"
                    >
                      {branchErrors.managerId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group branch_tel">
                  <label className="control-label" htmlFor="branch_tel">
                    Telephone
                  </label>
                  <CFormInput
                    className="form-control-cst mask_phone"
                    type="text"
                    name="tel"
                    id="branch_tel"
                    onChange={(e) => handleChangeForm(e)}
                    value={branchData.tel}
                    invalid={branchErrors && !isEmpty(branchErrors.tel) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearBranchError({
                          type: 'tel',
                          errorType: 'errBranch',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {branchErrors.tel}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group email optional branch_email">
                  <label className="control-label email optional" htmlFor="branch_email">
                    E-Mail
                  </label>
                  <CFormInput
                    className="form-control-cst string email optional"
                    type="email"
                    name="email"
                    id="branch_email"
                    onChange={(e) => handleChangeForm(e)}
                    value={branchData.email}
                    invalid={branchErrors && !isEmpty(branchErrors.email) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearBranchError({
                          type: 'email',
                          errorType: 'errBranch',
                        }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {branchErrors.email}
                  </CFormFeedback>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group select required branch_country_id">
                  <label className="control-label select required" htmlFor="branch_country_id">
                    Country <span title="required">*</span>
                  </label>
                  <div className="input-group">
                    <Select
                      className={classNames('form-control form-control-cst pageCstSelect ', {
                        'is-invalid': branchErrors && !isEmpty(branchErrors.countryId),
                      })}
                      classNamePrefix="cstSelect"
                      isClearable
                      placeholder="-Select-"
                      isSearchable
                      menuPlacement="auto"
                      value={loadDataValue.loadCountry}
                      isLoading={countryData && !countryData.length > 0 ? true : false}
                      id="branch_country_id"
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
                      onMenuOpen={(e) => handleSelectFocus('countryId', e)}
                    />
                    <CFormFeedback
                      invalid={branchErrors && !isEmpty(branchErrors.countryId) ? true : false}
                      className="fieldError-cst"
                    >
                      {branchErrors.countryId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <div className="form-group">
                  <label className="control-label" htmlFor="branch_city_name">
                    City
                  </label>
                  <div className="input-group">
                    <Select
                      id="branch_city_name"
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
                        'is-invalid': branchErrors && !isEmpty(branchErrors.cityId),
                      })}
                      noOptionsMessage={() => noOptionCity()}
                      onChange={(e) => handleSelectForm('cityId', e)}
                      onMenuOpen={(e) => handleSelectFocus('cityId', e)}
                    />
                    <CFormFeedback
                      invalid={branchErrors && !isEmpty(branchErrors.cityId) ? true : false}
                      className="fieldError-cst"
                    >
                      {branchErrors.cityId}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <div className="form-group branch_postcode">
                  <label className="control-label" htmlFor="branch_postcode">
                    Postcode
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="branch[postcode]"
                    id="branch_postcode"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-5 col-xl-5">
                <div className="form-group branch_address">
                  <label className="control-label" htmlFor="branch_address">
                    Address
                  </label>
                  <textarea
                    className="form-control-cst"
                    rows="1"
                    name="branch[address]"
                    id="branch_address"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="separator"></div>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group branch_ledger_account_code">
                  <label className="control-label" htmlFor="branch_ledger_account_code">
                    Account Code
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="branch[ledger_account_code]"
                    id="branch_ledger_account_code"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group branch_profit_center_code">
                  <label className="control-label" htmlFor="branch_profit_center_code">
                    Profit Center Code
                  </label>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="branch[profit_center_code]"
                    id="branch_profit_center_code"
                  />
                </div>
              </div>
            </div>
            <div className="separator"></div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton type="submit" color="success" disabled={fetchingBranches ? true : false}>
                  {fetchingBranches ? (
                    'Processing...'
                  ) : (
                    <span>
                      Save <i className="fa fa-check"></i>
                    </span>
                  )}
                </CButton>
              </div>
            </div>
          </form>
        </div>
      </CCard>
    </div>
  )
}

export default NewBranch
