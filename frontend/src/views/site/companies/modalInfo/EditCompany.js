import React from 'react'
import {
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CFormFeedback,
  CFormTextarea,
  CImage,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCompanyError } from 'src/redux/slices/companySlice'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import PropTypes from 'prop-types'
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'
import XhrApi from 'src/config/XhrApi '

const EditCompany = ({
  handleChangeForm,
  handleSelectForm,
  companyData,
  handleSelectFocus,
  defaultSelect,
  setCompanyData,
}) => {
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const { companyErrors } = useSelector((state) => state.company)
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const { timezones, fetchingTimezones } = useSelector((state) => state.timezone)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const { cities, fetchingCities } = useSelector((state) => state.city)

  const uppy = new Uppy({
    autoProceed: true,
    debug: false,
    restrictions: {
      maxFileSize: 1000000,
      maxNumberOfFiles: 1,
      minNumberOfFiles: 1,
      allowedFileTypes: ['image/*'],
    },
  })

  uppy.use(XHRUpload, XhrApi('company/logo'))

  uppy.on('file-added', (file) => {
    uppy.setFileMeta(file.id, {
      userId: authUser.uuid,
      companyId: companyData.linkId,
    })
  })

  uppy.on('complete', (result) => {
    if (result.successful) {
      if (result.successful[0] && result.successful[0].response.body) {
        const resData = result.successful[0].response.body

        setCompanyData((state) => ({
          ...state,
          logoUrl: resData.logoUrl,
        }))
      }
    }
  })

  const countryData = countryList().data

  return (
    <div>
      <CForm id="editCompany">
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
                            companyErrors && !isEmpty(companyErrors.companyName) ? true : false
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
                            companyErrors && !isEmpty(companyErrors.companyName) ? true : false
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
                          invalid={companyErrors && !isEmpty(companyErrors.address) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.address) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.postcode) ? true : false}
                          onFocus={() =>
                            dispatch(
                              clearCompanyError({
                                type: 'postcode',
                                errorType: 'errCompany',
                              }),
                            )
                          }
                        />
                        <CFormFeedback
                          invalid={companyErrors && !isEmpty(companyErrors.postcode) ? true : false}
                          className="fieldError-cst"
                        >
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
                            value={defaultSelect.loadCity}
                            options={
                              cities && !fetchingCities && cities.length > 0
                                ? cities.map((itm) => ({
                                    label: itm.name,
                                    value: itm,
                                  }))
                                : []
                            }
                            className={classNames('form-control form-control-cst pageCstSelect ', {
                              'is-invalid': companyErrors && !isEmpty(companyErrors.cityId),
                            })}
                            noOptionsMessage={() => 'No results found'}
                            onChange={(e) => handleSelectForm('cityId', e)}
                            onMenuOpen={(e) => handleSelectFocus('cityId', e)}
                          />
                          <CFormFeedback
                            invalid={companyErrors && !isEmpty(companyErrors.cityId) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.district) ? true : false}
                          onFocus={() =>
                            dispatch(
                              clearCompanyError({
                                type: 'district',
                                errorType: 'errCompany',
                              }),
                            )
                          }
                        />
                        <CFormFeedback
                          invalid={companyErrors && !isEmpty(companyErrors.district) ? true : false}
                          className="fieldError-cst"
                        >
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
                            className={classNames('form-control form-control-cst pageCstSelect ', {
                              'is-invalid': companyErrors && !isEmpty(companyErrors.countryId),
                            })}
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder="-Select-"
                            isSearchable
                            value={defaultSelect.loadCountry}
                            isLoading={countryData && !countryData.length > 0 ? true : false}
                            id="company_country_id"
                            options={
                              countryData && countryData.length > 0
                                ? countryData.map((item) => ({
                                    value: item.value,
                                    label: `${item.value ? item.value + '-' : ''}${item.label}`,
                                  }))
                                : []
                            }
                            maxMenuHeight={200}
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
                          invalid={companyErrors && !isEmpty(companyErrors.eoriCode) ? true : false}
                          onFocus={() =>
                            dispatch(
                              clearCompanyError({
                                type: 'eoriCode',
                                errorType: 'errCompany',
                              }),
                            )
                          }
                        />
                        <CFormFeedback
                          invalid={companyErrors && !isEmpty(companyErrors.eoriCode) ? true : false}
                          className="fieldError-cst"
                        >
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
                        <CFormFeedback
                          invalid={
                            companyErrors && !isEmpty(companyErrors.taxOffice) ? true : false
                          }
                          className="fieldError-cst"
                        >
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
                          invalid={companyErrors && !isEmpty(companyErrors.taxNo) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.taxNo) ? true : false}
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
                            companyErrors && !isEmpty(companyErrors.companyEmail) ? true : false
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
                            companyErrors && !isEmpty(companyErrors.companyEmail) ? true : false
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
                            companyErrors && !isEmpty(companyErrors.companyWebsite) ? true : false
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
                            companyErrors && !isEmpty(companyErrors.companyWebsite) ? true : false
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
                          A/C Representative
                        </label>
                        <div className="input-group">
                          <Select
                            className={classNames('form-control form-control-cst pageCstSelect ')}
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder
                            isSearchable
                            id="company_sector"
                            isLoading={fetchingUsers ? true : false}
                            value={defaultSelect.companySalerId}
                            options={
                              users && users.length > 0
                                ? users.map((item) => ({
                                    value: item,
                                    label: item.name,
                                  }))
                                : []
                            }
                            menuPlacement="auto"
                            maxMenuHeight={240}
                            noOptionsMessage={() => 'No results found'}
                            onChange={(e) => handleSelectForm('companySalerId', e)}
                            onMenuOpen={(e) => handleSelectFocus('companySalerId', e)}
                          />
                          <CFormFeedback
                            invalid={
                              companyErrors && !isEmpty(companyErrors.companySalerId) ? true : false
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
                        <div>
                          <div className="input-group">
                            <Select
                              id="company_branch_id"
                              classNamePrefix="cstSelect"
                              isClearable={true}
                              placeholder
                              isLoading={fetchingBranches ? true : false}
                              value={defaultSelect.branchId}
                              isSearchable
                              name="branchId"
                              autoFocus={false}
                              options={
                                branches && !fetchingBranches && branches.length > 0
                                  ? branches.map((itm) => ({
                                      label: itm.name,
                                      value: itm,
                                    }))
                                  : []
                              }
                              className={classNames(
                                'form-control form-control-cst pageCstSelect ',
                                {
                                  'is-invalid': companyErrors && !isEmpty(companyErrors.branchId),
                                },
                              )}
                              noOptionsMessage={() => 'No results found'}
                              onChange={(e) => handleSelectForm('branchId', e)}
                              onMenuOpen={(e) => handleSelectFocus('branchId')}
                            />
                            <CFormFeedback invalid className="fieldError-cst">
                              {companyErrors.branchId}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group select">
                        <label className="control-label select" htmlFor="timezone">
                          Timezone
                        </label>
                        <div className="input-group">
                          <Select
                            className={classNames('form-control form-control-cst pageCstSelect ', {
                              'is-invalid': companyErrors && !isEmpty(companyErrors.countryId),
                            })}
                            maxMenuHeight={200}
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder="-Select-"
                            isSearchable
                            id="setup_time_zone"
                            isLoading={fetchingTimezones ? true : false}
                            value={defaultSelect.timezoneId}
                            options={
                              timezones && timezones.length > 0
                                ? timezones.map((item) => ({
                                    value: item,
                                    label: `${item.code ? item.code + ' ' : ''}  ${item.name}`,
                                  }))
                                : []
                            }
                            noOptionsMessage={() => 'No results found'}
                            onChange={(val) => handleSelectForm('timezoneId', val)}
                            onMenuOpen={(e) => handleSelectFocus('timezoneId', e)}
                          />
                          <CFormFeedback
                            invalid={
                              companyErrors && !isEmpty(companyErrors.timezoneId) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {companyErrors.timezoneId}
                          </CFormFeedback>
                        </div>
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
                        <label className="control-label select" htmlFor="company_company_group">
                          Company Group
                        </label>
                        <CFormSelect
                          className="form-control-cst select"
                          name="companyGroup"
                          id="company_company_group"
                          value={companyData.companyGroup}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyGroup) ? true : false
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
                            companyErrors && !isEmpty(companyErrors.companyGroup) ? true : false
                          }
                          className="fieldError-cst"
                        >
                          {companyErrors.companyGroup}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group select company_company_type">
                        <label className="control-label select" htmlFor="company_company_type">
                          Company Type
                        </label>
                        <CFormSelect
                          className="form-control-cst select"
                          name="companyType"
                          id="company_company_type"
                          value={companyData.companyType}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyType) ? true : false
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
                          <option value="Agent">Agent</option>
                          <option value="Airline">Airline</option>
                          <option value="Competitor">Competitor</option>
                          <option value="Customer">Customer</option>
                          <option value="Customs Officer">Customs Officer</option>
                          <option value="Partner">Partner</option>
                          <option value="Shipowner">Shipowner</option>
                          <option value="Supplier">Supplier</option>
                          <option value="Trader">Trader(Exporter/Importer)</option>
                        </CFormSelect>
                        <CFormFeedback
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyType) ? true : false
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
                            className={classNames('form-control form-control-cst pageCstSelect ')}
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
                                label: ' Pharmaceuticals / Health Products & Medical Supplies',
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
                              companyErrors && !isEmpty(companyErrors.companySector) ? true : false
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
                          invalid={companyErrors && !isEmpty(companyErrors.tagNames) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.tagNames) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.notes) ? true : false}
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
                          invalid={companyErrors && !isEmpty(companyErrors.notes) ? true : false}
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
                          <CImage src={companyData.logoUrl} thumbnail style={{ height: '198px' }} />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CCardBody>
      </CForm>
    </div>
  )
}

EditCompany.propTypes = {
  handleSelectFocus: PropTypes.func,
  companyData: PropTypes.object,
  closeEditCompMd: PropTypes.func,
  handleChangeForm: PropTypes.func,
  handleSelectForm: PropTypes.func,
  defaultSelect: PropTypes.object,
  setCompanyData: PropTypes.func,
}

export default EditCompany
