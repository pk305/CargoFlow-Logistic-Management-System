import React from 'react'
import { CRow, CCol, CFormSelect, CFormInput, CFormFeedback } from '@coreui/react'
import { clearLocationError } from 'src/redux/slices/locationSlice'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import classNames from 'classnames'
import countryList from 'react-select-country-list'

const LocationModal = ({
  locationData,
  handleChangeLocation,
  defCountry,
  handleSelectForm,
  handleSelectFocus,
  noOptionCity,
  showGeoPosition,
  toggleHideShowGeo,
}) => {
  const dispatch = useDispatch()
  const { locationErrors } = useSelector((state) => state.location)
  const { cities, fetchingCities } = useSelector((state) => state.city)

  const countryData = countryList().data

  return (
    <div>
      <CRow>
        <CCol sm={6} md={4} xl={4} lg={4}>
          <div className="form-group">
            <label className="control-label" htmlFor="place_name">
              Address Name <span>*</span>
            </label>
            <CFormInput
              className="form-control-cst"
              placeholder="Ex: Invoice Address, Warehouse Address etc."
              type="text"
              name="placeName"
              id="place_name"
              value={locationData.placeName}
              onChange={(e) => handleChangeLocation(e)}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'placeName', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.placeName) ? true : false}
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.placeName}
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
              name="code"
              id="place_code"
              value={locationData.code}
              onChange={(e) => handleChangeLocation(e)}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'code', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.code) ? true : false}
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.code}
            </CFormFeedback>
          </div>
        </CCol>
        <CCol sm={6} md={3} xl={3} lg={3}></CCol>
        <CCol sm={12} md={4} xl={3} lg={3}>
          <div className="form-group place_place_type">
            <label className="control-label" htmlFor="place_place_type">
              Location Type <span>*</span>
            </label>
            <CFormSelect
              className="form-control-cst"
              name="placeType"
              id="place_place_type"
              value={locationData.placeType}
              onChange={(e) => handleChangeLocation(e)}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'placeType', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.placeType) ? true : false}
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
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.placeType}
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
              name="address"
              id="place_address"
              value={locationData.address}
              onChange={(e) => handleChangeLocation(e)}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'address', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.address) ? true : false}
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.address}
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
                dispatch(clearLocationError({ type: 'postcode', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.postcode) ? true : false}
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.postcode}
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
                name="cityId"
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
                  'is-invalid': locationErrors && !isEmpty(locationErrors.cityId),
                })}
                noOptionsMessage={(e) => noOptionCity(e)}
                onChange={(e) => handleSelectForm('cityId', e)}
                onMenuOpen={() => handleSelectFocus('cityId')}
              />
              <CFormFeedback invalid className="fieldError-cst">
                {locationErrors.cityId}
              </CFormFeedback>
            </div>
          </div>
        </CCol>
        <CCol sm={6} md={3} lg={3} xl={3}>
          <div className="form-group place_country_id">
            <label className="control-label" htmlFor="place_country_id">
              Country <span>*</span>
            </label>
            <div className="input-group">
              <Select
                className={classNames('form-control form-control-cst pageCstSelect ', {
                  'is-invalid': locationErrors && !isEmpty(locationErrors.countryId),
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
                onChange={(e) => handleSelectForm('countryId', e)}
                onMenuOpen={(e) => handleSelectFocus('countryId', e)}
              />
              <CFormFeedback invalid className="fieldError-cst">
                {locationErrors.countryId}
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
              invalid={locationErrors && !isEmpty(locationErrors.placeLng) ? true : false}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'placeLng', errorType: 'errLocation' }))
              }
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.placeLng}
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
              invalid={locationErrors && !isEmpty(locationErrors.placeLat) ? true : false}
              value={locationData.placeLat}
              onChange={(e) => handleChangeLocation(e)}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'placeLat', errorType: 'errLocation' }))
              }
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.placeLat}
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
              invalid={locationErrors && !isEmpty(locationErrors.openingInfo) ? true : false}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'openingInfo', errorType: 'errLocation' }))
              }
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.openingInfo}
            </CFormFeedback>
          </div>
        </CCol>
        <CCol sm={6} md={3} lg={3} xl={3}>
          <div className="form-group">
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
                dispatch(clearLocationError({ type: 'contactName', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.contactName) ? true : false}
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.contactName}
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
                dispatch(clearLocationError({ type: 'placeTel', errorType: 'errLocation' }))
              }
              invalid={locationErrors && !isEmpty(locationErrors.placeTel) ? true : false}
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.placeTel}
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
              invalid={locationErrors && !isEmpty(locationErrors.placeEmail) ? true : false}
              value={locationData.placeEmail}
              onChange={(e) => handleChangeLocation(e)}
              onFocus={() =>
                dispatch(clearLocationError({ type: 'placeEmail', errorType: 'errLocation' }))
              }
            />
            <CFormFeedback invalid className="fieldError-cst">
              {locationErrors.placeEmail}
            </CFormFeedback>
          </div>
        </CCol>
      </CRow>
    </div>
  )
}

LocationModal.propTypes = {
  locationData: PropTypes.object,
  handleChangeLocation: PropTypes.func,
  defCountry: PropTypes.object,
  handleSelectForm: PropTypes.func,
  handleSelectFocus: PropTypes.func,
  noOptionCity: PropTypes.func,
  showGeoPosition: PropTypes.bool,
  toggleHideShowGeo: PropTypes.func,
}

export default LocationModal
