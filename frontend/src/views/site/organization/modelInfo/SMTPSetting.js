import { CButton, CFormFeedback, CFormInput } from '@coreui/react'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserError, createUser, showUserError } from 'src/redux/slices/userSlice'
import $ from 'jquery'
import Noty from 'noty'
import PropTypes from 'prop-types'

const SMTPSetting = ({ closeSmtpModal }) => {
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
  const [checkIsAdmin] = useState(true)
  let [formData] = useState(new FormData())
  const { userErrors, creatingUser } = useSelector((state) => state.user)

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

  // const handleSelectFocus = (c, _) => {
  //   dispatch(clearUserError({ type: c, errorType: 'errUser' }))
  //   if (c === 'timezoneId') {
  //     dispatch(fetchTimezones())
  //   }
  // }

  // const handleSelectForm = (c, val) => {
  //   const e = {
  //     target: {
  //       name: c,
  //       value: !isNull(val) ? val.value : '',
  //     },
  //   }
  //   handleChangeForm(e)
  // }

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
      closeSmtpModal()
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
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
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
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
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
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
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
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
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
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
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

SMTPSetting.propTypes = {
  closeSmtpModal: PropTypes.func,
}

export default SMTPSetting
