import React from 'react'
import { CCard, CCardBody } from '@coreui/react'

const EditUser = () => {
  return (
    <div className="rawWrapper-container">
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-user-edit icon-2x"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">Edit User</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper">
                <div className="pageBoxSizing-container">
                  <form className="simple_form edit_user" id="edit_user_4121" autoComplete="off">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group string required user_name">
                          <label className="control-label string required" htmlFor="user_name">
                            <span title="required">*</span> User Full Name
                          </label>
                          <input
                            className="form-control string required"
                            type="text"
                            value="James"
                            name="user[name]"
                            id="user_name"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional user_gsm">
                          <label className="control-label string optional" htmlFor="user_gsm">
                            Mobile Phone
                          </label>
                          <input
                            className="form-control string optional"
                            type="text"
                            name="user[gsm]"
                            id="user_gsm"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group string optional user_office_tel">
                          <label
                            className="control-label string optional"
                            htmlFor="user_office_tel"
                          >
                            Office Phone
                          </label>
                          <input
                            className="form-control string optional"
                            autoComplete="off"
                            type="text"
                            name="user[office_tel]"
                            id="user_office_tel"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select optional user_language">
                          <label className="control-label select optional" htmlFor="user_language">
                            Language
                          </label>
                          <select
                            className="form-control select optional"
                            name="user[language]"
                            id="user_language"
                          >
                            <option selected="selected" value="en">
                              en
                            </option>
                            <option value="tr">tr</option>
                            <option value="de">de</option>
                            <option value="fr">fr</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group time_zone optional user_time_zone">
                          <label
                            className="control-label time_zone optional"
                            htmlFor="user_time_zone"
                          >
                            Time zone
                          </label>
                          <select
                            className="form-control time_zone optional select2-hidden-accessible"
                            data-plugin="select2"
                            name="user[time_zone]"
                            id="user_time_zone"
                            aria-hidden="true"
                          >
                            <option value="International Date Line West">
                              (GMT-12:00) International Date Line West
                            </option>
                            <option value="American Samoa">(GMT-11:00) American Samoa</option>

                            <option value="Kamchatka">(GMT+12:00) Kamchatka</option>
                            <option value="Marshall Is.">(GMT+12:00) Marshall Is.</option>
                            <option value="Wellington">(GMT+12:00) Wellington</option>
                            <option value="Chatham Is.">(GMT+12:45) Chatham Is.</option>
                            <option value="Samoa">(GMT+13:00) Samoa</option>
                            <option value="Tokelau Is.">(GMT+13:00) Tokelau Is.</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="separator separator-dashed my-4"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group password optional user_password">
                          <label
                            className="control-label password optional"
                            htmlFor="user_password"
                          >
                            Password
                          </label>
                          <input
                            className="form-control password optional"
                            autoComplete="off"
                            type="password"
                            name="user[password]"
                            id="user_password"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                        <div className="form-group password optional user_password_confirmation">
                          <label
                            className="control-label password optional"
                            htmlFor="user_password_confirmation"
                          >
                            Confirm Password
                          </label>
                          <input
                            className="form-control password optional"
                            autoComplete="off"
                            type="password"
                            name="user[password_confirmation]"
                            id="user_password_confirmation"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="form-group hidden user_avatar_cache">
                          <input
                            className="form-control hidden"
                            type="hidden"
                            name="user[avatar_cache]"
                            id="user_avatar_cache"
                          />
                        </div>
                        <div className="form-group file optional user_avatar">
                          <label className="control-label file optional" htmlFor="user_avatar">
                            Profile Picture
                          </label>
                          <input
                            className="form-control file optional"
                            type="file"
                            name="user[avatar]"
                            id="user_avatar"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="separator separator-dashed my-4"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="form-group boolean optional user_smtp_enabled">
                              <label className="boolean optional" htmlFor="user_smtp_enabled">
                                Smtp Enabled
                              </label>
                              <div className="checkbox-custom checkbox-primary">
                                <input
                                  className="boolean optional"
                                  type="checkbox"
                                  value="1"
                                  name="user[smtp_enabled]"
                                  id="user_smtp_enabled"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id="smtp_inputs" style={{ display: 'none' }}>
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                              <div className="form-group string optional user_smtp_address">
                                <label
                                  className="control-label string optional"
                                  htmlFor="user_smtp_address"
                                >
                                  Smtp address
                                </label>
                                <input
                                  className="form-control string optional"
                                  type="text"
                                  name="user[smtp_address]"
                                  id="user_smtp_address"
                                />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                              <div className="form-group string optional user_smtp_domain">
                                <label
                                  className="control-label string optional"
                                  htmlFor="user_smtp_domain"
                                >
                                  Smtp domain
                                </label>
                                <input
                                  className="form-control string optional"
                                  type="text"
                                  name="user[smtp_domain]"
                                  id="user_smtp_domain"
                                />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                              <div className="form-group integer optional user_smtp_port">
                                <label
                                  className="control-label integer optional"
                                  htmlFor="user_smtp_port"
                                >
                                  Smtp port
                                </label>
                                <input
                                  className="form-control numeric integer optional"
                                  type="number"
                                  step="1"
                                  value="587"
                                  name="user[smtp_port]"
                                  id="user_smtp_port"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                              <div className="form-group string optional user_smtp_user_name">
                                <label
                                  className="control-label string optional"
                                  htmlFor="user_smtp_user_name"
                                >
                                  SMTP User Name (E-Mail Addr.)
                                </label>
                                <input
                                  className="form-control string optional"
                                  type="text"
                                  name="user[smtp_user_name]"
                                  id="user_smtp_user_name"
                                />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                              <div className="form-group password optional user_smtp_user_password">
                                <label
                                  className="control-label password optional"
                                  htmlFor="user_smtp_user_password"
                                >
                                  SMTP Password
                                </label>
                                <input
                                  className="form-control password optional"
                                  type="password"
                                  name="user[smtp_user_password]"
                                  id="user_smtp_user_password"
                                />
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="separator"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <input
                          type="submit"
                          name="commit"
                          value="Save"
                          className="btn btn-default btn btn-success"
                          data-disable-with="Save"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default EditUser
