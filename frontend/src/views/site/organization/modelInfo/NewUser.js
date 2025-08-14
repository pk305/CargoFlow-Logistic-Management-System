import { CButton, CFormFeedback, CFormInput, CFormSelect } from '@coreui/react'
import { isEmpty, isNull } from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserError, createUser, showUserError } from 'src/redux/slices/userSlice'
import $ from 'jquery'
import Noty from 'noty'
import Select from 'react-select'
import classNames from 'classnames'
import { fetchTimezones } from 'src/redux/slices/timezoneSlice'
import PropTypes from 'prop-types'

const NewUser = ({ closeUserModal }) => {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    userName: '',
    gsm: '',
    email: '',
    officeTel: '',
    language: 'en',
    password_confirmation: '',
    password: '',
    timeZone: '',
    avatar: '',
    smtpDomain: '',
    smtpPort: '',
    smtpAddress: '',
    smtpUserName: '',
    smtpUserPassword: '',
    smtpEnabled: '0',
    branchId: '',
    operationId: '',
    status: 'passive',
  })
  const [checkIsAdmin] = useState(false)
  let [formData] = useState(new FormData())
  const { timezones, fetchingTimezones } = useSelector((state) => state.timezone)
  const { userErrors, creatingUser } = useSelector((state) => state.user)
  const { branches } = useSelector((state) => state.branch)
  const { operations, fetchingOperations } = useSelector((state) => state.branch)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    if (name === 'avatar') {
      const file = e.target.files[0]
      formData.append('attachFile[]', file)
      setUserData({
        ...userData,
        avatar: file['name'],
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
    if (c === 'timezoneId') {
      dispatch(fetchTimezones())
    }
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
    const form = $('#new_user')
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
        type: 'alert',
        layout: 'topRight',
        id: `dWxZ0Ps${resData.id}`,
        text: 'User has been created succesfully',
      }).show()
      clearUserData()
      closeUserModal()
    }
  }

  const clearUserData = () => {
    setUserData({
      userName: '',
      gsm: '',
      email: '',
      officeTel: '',
      language: '',
      password_confirmation: '',
      password: '',
      timeZone: '',
      avatar: '',
      smtpDomain: '',
      smtpPort: '',
      smtpAddress: '',
      smtpUserName: '',
      smtpUserPassword: '',
      smtpEnabled: '',
      branchId: '',
      operationId: '',
      status: '',
    })
    // setFormData(new FormData().delete)
  }

  return (
    <div>
      <form
        className="simple_form edit_user"
        id="new_user"
        autoComplete="off"
        onSubmit={(e) => handleSubmitUser(e)}
      >
        <div className="row">
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group">
              <label className="control-label" htmlFor="user_name">
                User Full Name <span title="required">*</span>
              </label>
              <CFormInput
                className="form-control-cst"
                type="text"
                name="userName"
                id="user_name"
                onChange={(e) => handleChangeForm(e)}
                value={userData.userName}
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
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.userName}
              </CFormFeedback>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group user_gsm">
              <label className="control-label" htmlFor="user_gsm">
                Mobile Phone
              </label>
              <CFormInput
                className="form-control-cst"
                type="text"
                name="gsm"
                id="user_gsm"
                onChange={(e) => handleChangeForm(e)}
                value={userData.gsm}
                invalid={userErrors && !isEmpty(userErrors.gsm) ? true : false}
                onFocus={() =>
                  dispatch(
                    clearUserError({
                      type: 'gsm',
                      errorType: 'errUser',
                    }),
                  )
                }
              />
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.gsm}
              </CFormFeedback>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group user_office_tel">
              <label className="control-label" htmlFor="user_office_tel">
                Office Phone
              </label>
              <CFormInput
                className="form-control-cst"
                autoComplete="off"
                type="text"
                name="officeTel"
                id="user_office_tel"
                onChange={(e) => handleChangeForm(e)}
                value={userData.officeTel}
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
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.officeTel}
              </CFormFeedback>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group select user_language">
              <label className="control-label select" htmlFor="user_language">
                Language
              </label>
              <CFormSelect
                className="form-control-cst select"
                name="language"
                id="user_language"
                onChange={(e) => handleChangeForm(e)}
                value={userData.language}
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
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.officeTel}
              </CFormFeedback>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
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
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.email}
              </CFormFeedback>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group user_email">
              <label className="control-label" htmlFor="user_branch">
                Branch
              </label>
              <div className="input-group">
                <Select
                  className={classNames('form-control form-control-cst pageCstSelect ', {
                    'is-invalid': userErrors && !isEmpty(userErrors.branchId),
                  })}
                  classNamePrefix="cstSelect"
                  isClearable
                  placeholder="-Select-"
                  isSearchable
                  id="user_branch"
                  options={
                    branches && branches.length > 0
                      ? branches.map((item) => ({
                          value: item.value,
                          label: item.name,
                        }))
                      : []
                  }
                  noOptionsMessage={() => 'No results found'}
                  onChange={(val) => handleSelectForm('branchId', val)}
                  onFocus={(e) => handleSelectFocus('branchId', e)}
                />
                <CFormFeedback
                  invalid={userErrors && !isEmpty(userErrors.branchId) ? true : false}
                  className="fieldError-cst"
                >
                  {userErrors.branchId}
                </CFormFeedback>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group">
              <label className="control-label" htmlFor="user_operation_team">
                Operation Team
              </label>
              <div className="input-group">
                <Select
                  className={classNames('form-control form-control-cst pageCstSelect ', {
                    'is-invalid': userErrors && !isEmpty(userErrors.operationId),
                  })}
                  classNamePrefix="cstSelect"
                  isClearable
                  placeholder="-Select-"
                  isSearchable
                  isLoading={fetchingOperations ? true : false}
                  id="user_operation_team"
                  options={
                    operations && !fetchingOperations && operations.length > 0
                      ? operations.map((item) => ({
                          value: item.value,
                          label: item.name,
                        }))
                      : []
                  }
                  noOptionsMessage={() => 'No results found'}
                  onChange={(val) => handleSelectForm('operationId', val)}
                  onFocus={(e) => handleSelectFocus('operationId', e)}
                />
                <CFormFeedback
                  invalid={userErrors && !isEmpty(userErrors.operationId) ? true : false}
                  className="fieldError-cst"
                >
                  {userErrors.operationId}
                </CFormFeedback>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group time_zone user_time_zone">
              <label className="control-label time_zone" htmlFor="user_time_zone">
                Time zone
              </label>
              <div className="input-group">
                <Select
                  className={classNames('form-control form-control-cst pageCstSelect ', {
                    'is-invalid': userErrors && !isEmpty(userErrors.timezoneId),
                  })}
                  maxMenuHeight={200}
                  classNamePrefix="cstSelect"
                  isClearable
                  placeholder="-Select-"
                  isSearchable
                  id="setup_time_zone"
                  isLoading={fetchingTimezones ? true : false}
                  // defaultValue={defaultSelect.timezoneId}
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
                  onMenuOpen={(e) => handleSelectFocus('timezoneId', e)}
                />
                <CFormFeedback
                  invalid={userErrors && !isEmpty(userErrors.timezoneId) ? true : false}
                  className="fieldError-cst"
                >
                  {userErrors.timezoneId}
                </CFormFeedback>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group">
              <label className="control-label" htmlFor="user_status">
                Status
              </label>
              <CFormSelect
                className="form-control-cst select"
                name="status"
                id="user_language"
                onChange={(e) => handleChangeForm(e)}
                value={userData.status}
                invalid={userErrors && !isEmpty(userErrors.status) ? true : false}
                onFocus={() =>
                  dispatch(
                    clearUserError({
                      type: 'language',
                      errorType: 'errUser',
                    }),
                  )
                }
              >
                <option value="active">Active</option>
                <option value="passive">Passive</option>
              </CFormSelect>
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.status}
              </CFormFeedback>
            </div>
          </div>
        </div>
        <div className="separator"></div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group user_password">
              <label className="control-label" htmlFor="user_password">
                Password
              </label>
              <CFormInput
                className="form-control-cst"
                autoComplete="off"
                type="password"
                name="password"
                id="user_password"
                onChange={(e) => handleChangeForm(e)}
                value={userData.password}
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
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.password}
              </CFormFeedback>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <div className="form-group user_password_confirmation">
              <label className="control-label" htmlFor="user_password_confirmation">
                Confirm Password
              </label>
              <CFormInput
                className="form-control-cst"
                autoComplete="off"
                type="password"
                name="password_confirmation"
                id="user_password_confirmation"
                onChange={(e) => handleChangeForm(e)}
                value={userData.password_confirmation}
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
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.password_confirmation}
              </CFormFeedback>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <div className="form-group file user_avatar">
              <label className="control-label file" htmlFor="user_avatar">
                Profile Picture
              </label>
              <CFormInput
                className="form-control-cst file"
                type="file"
                name="avatar"
                accept="image/*"
                id="user_avatar"
                onChange={(e) => handleChangeForm(e)}
                invalid={userErrors && !isEmpty(userErrors.avatar) ? true : false}
                onFocus={() =>
                  dispatch(
                    clearUserError({
                      type: 'avatar',
                      errorType: 'errUser',
                    }),
                  )
                }
              />
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.avatar}
              </CFormFeedback>
            </div>
          </div>
        </div>
        <div className="separator"></div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="form-group  user_smtp_enabled">
                  <label htmlFor="user_smtp_enabled">Smtp Enabled</label>
                  <div className="checkbox-custom checkbox-primary">
                    <input
                      name="smtpEnabled"
                      type="checkbox"
                      onChange={(e) => handleChangeForm(e)}
                      value={userData.smtpEnabled}
                      onFocus={() =>
                        dispatch(
                          clearUserError({
                            type: 'smtpEnabled',
                            errorType: 'errUser',
                          }),
                        )
                      }
                    />
                    <CFormFeedback
                      invalid={userErrors && !isEmpty(userErrors.smtpEnabled) ? true : false}
                      className="fieldError-cst"
                    >
                      {userErrors.smtpEnabled}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
            </div>
            <div id="smtp_inputs" style={{ display: !checkIsAdmin ? 'none' : '' }}>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                  <div className="form-group user_smtp_address">
                    <label className="control-label" htmlFor="user_smtp_address">
                      Smtp address
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="smtpAddress"
                      id="user_smtp_address"
                      onChange={(e) => handleChangeForm(e)}
                      value={userData.smtpAddress}
                      invalid={userErrors && !isEmpty(userErrors.smtpAddress) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearUserError({
                            type: 'smtpAddress',
                            errorType: 'errUser',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {userErrors.smtpAddress}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                  <div className="form-group user_smtp_domain">
                    <label className="control-label" htmlFor="user_smtp_domain">
                      Smtp domain
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="smtpDomain"
                      id="user_smtp_domain"
                      onChange={(e) => handleChangeForm(e)}
                      value={userData.smtpDomain}
                      invalid={userErrors && !isEmpty(userErrors.smtpDomain) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearUserError({
                            type: 'smtpDomain',
                            errorType: 'errUser',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {userErrors.smtpDomain}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                  <div className="form-group integer user_smtp_port">
                    <label className="control-label integer" htmlFor="user_smtp_port">
                      Smtp port
                    </label>
                    <CFormInput
                      className="form-control-cst numeric integer"
                      type="number"
                      step="1"
                      name="smtpPort"
                      id="user_smtp_port"
                      onChange={(e) => handleChangeForm(e)}
                      value={userData.smtpPort}
                      invalid={userErrors && !isEmpty(userErrors.smtpPort) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearUserError({
                            type: 'smtpPort',
                            errorType: 'errUser',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {userErrors.smtpPort}
                    </CFormFeedback>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                  <div className="form-group user_smtp_user_name">
                    <label className="control-label" htmlFor="user_smtp_user_name">
                      SMTP User Name (E-Mail Addr.)
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="smtpUserName"
                      id="user_smtp_user_name"
                      onChange={(e) => handleChangeForm(e)}
                      value={userData.smtpUserName}
                      invalid={userErrors && !isEmpty(userErrors.smtpUserName) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearUserError({
                            type: 'smtpUserName',
                            errorType: 'errUser',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {userErrors.smtpUserName}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
                  <div className="form-group user_smtp_user_password">
                    <label className="control-label" htmlFor="user_smtp_user_password">
                      SMTP Password
                    </label>
                    <CFormInput
                      className="form-control-cst"
                      type="password"
                      name="smtpUserPassword"
                      id="user_smtp_user_password"
                      onChange={(e) => handleChangeForm(e)}
                      value={userData.smtpUserPassword}
                      invalid={userErrors && !isEmpty(userErrors.smtpUserPassword) ? true : false}
                      onFocus={() =>
                        dispatch(
                          clearUserError({
                            type: 'smtpUserPassword',
                            errorType: 'errUser',
                          }),
                        )
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {userErrors.smtpUserPassword}
                    </CFormFeedback>
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
            <CButton color="success" type="submit" disabled={creatingUser ? true : false}>
              {creatingUser ? (
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
  )
}

NewUser.propTypes = {
  closeUserModal: PropTypes.func,
}

export default NewUser
