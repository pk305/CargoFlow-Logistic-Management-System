import React from 'react'
import { CFormInput, CFormFeedback } from '@coreui/react'
import classNames from 'classnames'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import countryList from 'react-select-country-list'
import PropTypes from 'prop-types'
import { clearCityError } from 'src/redux/slices/citySlice'

const NewCityModal = ({ handleCitySelect, handleCityFocus, cityData, handleChangeCity }) => {
  const dispatch = useDispatch()
  const { cityErrors } = useSelector((state) => state.city)

  const countryData = countryList().data

  return (
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
            className="form-control-cst string required"
            type="text"
            id="city_name"
            name="cityName"
            value={cityData.cityName}
            onChange={(e) => handleChangeCity(e)}
            onFocus={() => dispatch(clearCityError({ type: 'cityName', errorType: 'errCity' }))}
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
            className="form-control-cst string optional"
            type="text"
            name="code"
            id="city_code"
            value={cityData.code}
            onChange={(e) => handleChangeCity(e)}
            onFocus={() => dispatch(clearCityError({ type: 'code', errorType: 'errCity' }))}
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
            className="form-control-cst string optional"
            type="text"
            name="telCode"
            id="city_tel_code"
            value={cityData.telCode}
            onChange={(e) => handleChangeCity(e)}
            onFocus={() => dispatch(clearCityError({ type: 'telCode', errorType: 'errCity' }))}
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
            className="form-control-cst string optional"
            type="text"
            name="statesCode"
            id="city_states_code"
            value={cityData.statesCode}
            onChange={(e) => handleChangeCity(e)}
            onFocus={() => dispatch(clearCityError({ type: 'statesCode', errorType: 'errCity' }))}
            invalid={cityErrors && !isEmpty(cityErrors.statesCode) ? true : false}
          />
          <CFormFeedback invalid className="fieldError-cst">
            {cityErrors.statesCode}
          </CFormFeedback>
        </div>
      </div>
    </div>
  )
}

NewCityModal.propTypes = {
  handleCitySelect: PropTypes.func,
  cityData: PropTypes.object,
  handleChangeCity: PropTypes.func,
  handleCityFocus: PropTypes.func,
}

export default NewCityModal
