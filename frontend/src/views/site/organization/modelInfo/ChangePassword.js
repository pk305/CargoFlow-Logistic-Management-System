import { CButton, CFormFeedback, CFormInput } from '@coreui/react'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserError, createUser, showUserError } from 'src/redux/slices/userSlice'
import $ from 'jquery'
import Noty from 'noty'
import PropTypes from 'prop-types'

const ChangePassword = ({ closeSmtpModal }) => {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    currentPassword: '',
    password_confirmation: '',
    password: '',
  })
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
      currentPassword: '',
      password_confirmation: '',
      password: '',
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
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <div className="form-group">
              <label className="control-label" htmlFor="user_current_password">
                Current Password
              </label>
              <CFormInput
                className="form-control-cst"
                autoComplete="off"
                type="password"
                name="currentPassword"
                id="user_current_password"
                onChange={(e) => handleChangeForm(e)}
                value={userData.currentPassword}
                invalid={userErrors && !isEmpty(userErrors.currentPassword) ? true : false}
                onFocus={() =>
                  dispatch(
                    clearUserError({
                      type: 'currentPassword',
                      errorType: 'errUser',
                    }),
                  )
                }
              />
              <CFormFeedback invalid className="fieldError-cst">
                {userErrors.currentPassword}
              </CFormFeedback>
            </div>
          </div>
        </div>
        <div className="separator"></div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <div className="form-group user_password">
              <label className="control-label" htmlFor="user_password">
                New Password
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
          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
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

ChangePassword.propTypes = {
  closeSmtpModal: PropTypes.func,
}

export default ChangePassword
