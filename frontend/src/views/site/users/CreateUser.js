import React, { useState } from 'react'
import { CButton, CForm, CFormInput, CFormSelect, CFormFeedback } from '@coreui/react'
import Select from 'react-select'
import classNames from 'classnames'
import { isEmpty, isNull } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserError, showUserError, createUser } from 'src/redux/slices/userSlice'
import $ from 'jquery'
import PropTypes from 'prop-types'
import Noty from 'noty'

const CreateUser = ({ handleCancelSlide }) => {
  const [checkIsAdmin] = useState(false)
  let [formData] = useState(new FormData())
  const [userData, setUserData] = useState({
    userName: '',
    phone: '',
    officeTel: '',
    extTel: '',
    email: '',
    language: 'en',
    password: '',
    userAvatar: '',
    userTimeZone: '',
    password_confirmation: '',
  })
  const dispatch = useDispatch()
  const [timeZones] = useState([
    { name: '(GMT-12:00) International Date Line West', value: 'International Date Line West' },
    { name: '(GMT-11:00) American Samoa', value: 'American Samoa' },
    { name: '(GMT-11:00) Midway Island', value: 'Midway Island' },
    { name: '(GMT-10:00) Hawaii', value: 'Hawaii' },
    { name: '(GMT-09:00) Alaska', value: 'Alaska' },
    { name: '(GMT-08:00) Pacific Time (US &amp; Canada)', value: 'Pacific Time (US &amp; Canada)' },
    { name: '(GMT-08:00) Tijuana', value: 'Tijuana' },
  ])

  const { userErrors, creatingUser } = useSelector((state) => state.user)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    if (name === 'userAvatar') {
      const file = e.target.files[0]
      formData.append('attachFile[]', file)
      setUserData({
        ...userData,
        userAvatar: file['name'],
      })
    } else {
      setUserData({
        ...userData,
        [name]: value,
      })
    }
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearUserError({ type: c, errorType: 'errUser' }))
  }

  const handleSelectForm = (c, val) => {
    const e = {
      target: {
        name: c,
        value: !isNull(val) ? val.value : '',
      },
    }
    handleChangeForm(e)
  }

  const handleSubmitUser = async (e) => {
    e.preventDefault()
    const form = $('#createUser')
    if (form.length > 0) {
      if (userData.userName === '') {
        dispatch(showUserError({ type: 'userName', errorType: 'errUser' }))
        $('.slide-pane__content').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(userData)
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createUser(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'success',
        layout: 'topCenter',
        id: 'dWxZ0Ps',
        text: 'User has been created succesfully',
      }).show()
      clearUserData()
      handleCancelSlide()
    }
  }

  const clearUserData = () => {
    setUserData({
      userName: '',
      phone: '',
      officeTel: '',
      extTel: '',
      email: '',
      language: 'en',
      password: '',
      userAvatar: '',
      userTimeZone: '',
      password_confirmation: '',
    })
    // setFormData(new FormData().delete)
  }

  return (
    <CForm
      className="simple_form"
      acceptCharset="UTF-8"
      noValidate="novalidate"
      id="createUser"
      action="/users"
      method="post"
      onSubmit={(e) => handleSubmitUser(e)}
    >
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group user_name">
            <label className="control-label" htmlFor="user_name">
              Full Name <span className="required">*</span>
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              name="userName"
              id="user_name"
              value={userData.userName}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.userName) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'userName',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.userName) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.userName}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group user_email">
            <label className="control-label" htmlFor="user_email">
              Email <span className="required">*</span>
            </label>
            <CFormInput
              className="form-control-cst"
              type="email"
              name="email"
              id="user_email"
              value={userData.email}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.email) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'email',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.email) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.email}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group user_gsm">
            <label className="control-label" htmlFor="user_gsm">
              Phone
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              name="phone"
              id="user_gsm"
              value={userData.phone}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.phone) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'phone',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.phone) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.phone}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group user_office_tel">
            <label className="control-label" htmlFor="user_office_tel">
              Office Telephone
            </label>
            <CFormInput
              className="form-control-cst"
              autoComplete="off"
              type="text"
              name="officeTel"
              id="user_office_tel"
              value={userData.officeTel}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.officeTel) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'officeTel',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.officeTel) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.officeTel}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group user_ext_tel">
            <label className="control-label" htmlFor="user_ext_tel">
              Ext tel
            </label>
            <CFormInput
              className="form-control-cst"
              autoComplete="off"
              type="text"
              name="extTel"
              id="user_ext_tel"
              value={userData.extTel}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.extTel) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'extTel',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.extTel) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.extTel}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group select user_language">
            <label className="control-label " htmlFor="user_language">
              Language
            </label>
            <CFormSelect
              className="form-control-cst "
              name="language"
              id="user_language"
              value={userData.language}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.language) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'language',
                    errorType: 'errUser',
                  }),
                )
              }
            >
              <option value="en">en</option>
              <option value="tr">tr</option>
              <option value="de">de</option>
              <option value="fr">fr</option>
            </CFormSelect>
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.language) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.language}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="form-group time_zone user_time_zone">
            <label className="control-label time_zone optional" htmlFor="user_time_zone">
              Time zone
            </label>
            <div className="input-group">
              <Select
                key={'cstSelect-userTimeZone'}
                className={classNames('form-control form-control-cst pageCstSelect ', {
                  'is-invalid': userErrors && !isEmpty(userErrors.userTimeZone),
                })}
                classNamePrefix="cstSelect"
                isClearable
                placeholder="-Select-"
                isSearchable
                id="user_time_zone"
                options={
                  timeZones && timeZones.length > 0
                    ? [{ label: '', value: '' }, ...timeZones].map((item) => ({
                        value: item.value,
                        label: item.name,
                      }))
                    : []
                }
                noOptionsMessage={() => 'No results found'}
                onChange={(val) => handleSelectForm('userTimeZone', val)}
                onFocus={(e) => handleSelectFocus('userTimeZone', e)}
              />
              <CFormFeedback
                invalid={userErrors && !isEmpty(userErrors.userTimeZone) ? true : false}
                className="fieldError-cst"
              >
                {userErrors.userTimeZone}
              </CFormFeedback>
            </div>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <div className="form-group password user_password">
            <label className="control-label password optional" htmlFor="user_password">
              Password
            </label>
            <CFormInput
              className="form-control-cst password optional"
              autoComplete="off"
              type="password"
              name="password"
              id="user_password"
              value={userData.password}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.password) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'password',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.password) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.password}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <div className="form-group password user_password_confirmation">
            <label className="control-label password optional" htmlFor="user_password_confirmation">
              Confirm Password
            </label>
            <CFormInput
              className="form-control-cst password optional"
              autoComplete="off"
              type="password"
              name="password_confirmation"
              id="user_password_confirmation"
              value={userData.password_confirmation}
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.password_confirmation) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'password_confirmation',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.password_confirmation) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.password_confirmation}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <div className="form-group file user_avatar">
            <label className="control-label" htmlFor="user_avatar">
              Profile Picture
            </label>
            <CFormInput
              className="form-control-cst"
              type="file"
              accept="image/*"
              name="userAvatar"
              id="user_avatar"
              onChange={(e) => handleChangeForm(e)}
              invalid={userErrors && !isEmpty(userErrors.userAvatar) ? true : false}
              onFocus={() =>
                dispatch(
                  clearUserError({
                    type: 'userAvatar',
                    errorType: 'errUser',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={userErrors && !isEmpty(userErrors.userAvatar) ? true : false}
              className="fieldError-cst"
            >
              {userErrors.userAvatar}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      {checkIsAdmin && (
        <>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <div className="form-group boolean user_smtp_enabled">
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
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group user_smtp_address">
                      <label className="control-label" htmlFor="user_smtp_address">
                        Smtp address
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        value=""
                        name="user[smtp_address]"
                        id="user_smtp_address"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group user_smtp_domain">
                      <label className="control-label" htmlFor="user_smtp_domain">
                        Smtp domain
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        value=""
                        name="user[smtp_domain]"
                        id="user_smtp_domain"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group integer user_smtp_port">
                      <label className="control-label integer optional" htmlFor="user_smtp_port">
                        Smtp port
                      </label>
                      <CFormInput
                        className="form-control-cst numeric integer optional"
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
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group user_smtp_user_name">
                      <label className="control-label" htmlFor="user_smtp_user_name">
                        SMTP User Name (E-Mail Addr.)
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        value=""
                        name="user[smtp_user_name]"
                        id="user_smtp_user_name"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div className="form-group password user_smtp_user_password">
                      <label
                        className="control-label password optional"
                        htmlFor="user_smtp_user_password"
                      >
                        SMTP Password
                      </label>
                      <CFormInput
                        className="form-control-cst password optional"
                        type="password"
                        name="user[smtp_user_password]"
                        id="user_smtp_user_password"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="separator"></div>
        </>
      )}
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <CButton
            color="primary"
            type="submit"
            className="mr-2"
            disabled={creatingUser ? true : false}
          >
            {creatingUser ? 'Processing...' : 'Save'}
          </CButton>
        </div>
      </div>
    </CForm>
  )
}

CreateUser.propTypes = {
  handleCancelSlide: PropTypes.func,
}

export default CreateUser
