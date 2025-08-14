import React from 'react'
import { CFormSelect, CFormInput, CButton } from '@coreui/react'
import PropTypes from 'prop-types'

const ContactInfoModal = ({
  contactInfoData,
  handleChangeLocation,
  defCountry,
  handleSelectForm,
  handleSelectFocus,
  noOptionCity,
  showGeoPosition,
  toggleHideShowGeo,
}) => {
  return (
    <div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group string optional company_tel">
            <label className="control-label string optional" htmlFor="company_tel">
              Phone
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              value="07123456789"
              name="company[tel]"
              id="company_tel"
            />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
          <div className="form-group string optional company_fax">
            <label className="control-label string optional" htmlFor="company_fax">
              Fax
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              value="485004"
              name="company[fax]"
              id="company_fax"
            />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <div className="form-group email optional company_email">
            <label className="control-label email optional" htmlFor="company_email">
              Email
            </label>
            <CFormInput
              className="form-control-cst string email optional"
              type="email"
              value="info@example.com"
              name="company[email]"
              id="company_email"
            />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <div className="form-group string optional company_website">
            <label className="control-label string optional" htmlFor="company_website">
              Web Site
            </label>
            <CFormInput
              className="form-control-cst string optional"
              type="text"
              value=""
              name="company[website]"
              id="company_website"
            />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-12 col-xl-12"></div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div className="comminfos-field package-line">
            <div className="separator separator-solid mb-6"></div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group company_comminfos_comm_type">
                  <label
                    className="control-label"
                    htmlFor="company_comminfos_attributes_1652513840267_comm_type"
                  >
                    Contact Type
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="company[comminfos_attributes][1652513840267][comm_type]"
                    id="company_comminfos_attributes_1652513840267_comm_type"
                  >
                    <option value="mobile_phone">mobile_phone</option>
                    <option value="home_phone">home_phone</option>
                    <option value="work_phone">work_phone</option>
                    <option value="email">email</option>
                    <option value="twitter">twitter</option>
                    <option value="facebook">facebook</option>
                    <option value="instagram">instagram</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-4">
                <div className="form-group string optional company_comminfos_comm_text">
                  <label
                    className="control-label string optional"
                    htmlFor="company_comminfos_attributes_1652513840267_comm_text"
                  >
                    Contact No/Address
                  </label>
                  <CFormInput
                    className="form-control-cst string optional"
                    type="text"
                    name="company[comminfos_attributes][1652513840267][comm_text]"
                    id="company_comminfos_attributes_1652513840267_comm_text"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div className="form-group company_comminfos_status">
                  <label
                    className="control-label"
                    htmlFor="company_comminfos_attributes_1652513840267_status"
                  >
                    Status
                  </label>
                  <CFormSelect
                    className="form-control-cst"
                    name="company[comminfos_attributes][1652513840267][status]"
                    id="company_comminfos_attributes_1652513840267_status"
                  >
                    <option value=""></option>
                    <option selected="selected" value="active">
                      Active
                    </option>
                    <option value="disabled">Disabled</option>
                  </CFormSelect>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-2 col-xl-2 align-self-center">
                <button
                  className="btn btn-close"
                  aria-label="Close"
                  // onClick={(e) => handleRemoveContainer(e, item)}
                ></button>
              </div>
            </div>
          </div>

          <div className="new_record_button">
            <CButton color="primary">
              <i className="fa fa-plus"></i> Add New Contact Info
            </CButton>
          </div>
        </div>
      </div>
    </div>
  )
}

ContactInfoModal.propTypes = {
  contactInfoData: PropTypes.object,
  handleChangeLocation: PropTypes.func,
  defCountry: PropTypes.object,
  handleSelectForm: PropTypes.func,
  handleSelectFocus: PropTypes.func,
  noOptionCity: PropTypes.func,
  showGeoPosition: PropTypes.bool,
  toggleHideShowGeo: PropTypes.func,
}

export default ContactInfoModal
