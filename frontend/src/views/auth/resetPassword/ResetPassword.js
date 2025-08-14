import React, { useCallback, useEffect, useState } from 'react'
import { CButton, CFormFeedback, CFormInput, CSpinner } from '@coreui/react'
import logoBrand from 'src/assets/brand/truck-logo.png'
import Noty from 'noty'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCommonError,
  recoverForgotPassword,
  showCommonError,
} from 'src/redux/slices/authSlice'
import { isEmpty } from 'lodash'
import classNames from 'classnames'

Noty.overrideDefaults({
  layout: 'topCenter',
  theme: 'nest',
  timeout: 5000,
  progressBar: false,
})

const ResetPassword = () => {
  const dispatch = useDispatch()
  const [forgotPswdData, setForgotPswdData] = useState({
    loginID: '',
  })
  const { forgotPswdErrors, recoveringFgtPswd } = useSelector((state) => state.auth)
  let [timerOtp, setTimerOtp] = useState(0)

  // const resetForm = () => {
  //   $('#confirm_otp_div').css('display', 'none')
  //   $('#lookupDiv').css('display', 'block')
  //   setForgotPswdData({
  //     ...forgotPswdData,
  //     loginID: '',
  //   })
  //   dispatch(clearCommonError({ type: 'loginID', errorType: 'enterFgtPswd' }))
  // }

  useEffect(() => {
    if (timerOtp > 0) {
      const timerId = setInterval(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        timerOtp -= 1
        if (timerOtp < 0) {
          clearInterval(timerId)
        } else {
          setTimerOtp(timerOtp)
        }
      }, 1000)

      return () => {
        clearInterval(timerId)
      }
    }
  }, [timerOtp])

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setForgotPswdData({
      ...forgotPswdData,
      [name]: value,
    })
  }

  // const changeCountryCode = (e) => {
  //   e.preventDefault()
  // }

  const handleSubmitNext = async (e) => {
    e.preventDefault()
    const form = $('#login_id_container')
    if (form.length > 0) {
      if (forgotPswdData.loginID === '') {
        dispatch(showCommonError({ type: 'loginID', errorType: 'enterFgtPswd' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(forgotPswdData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(recoverForgotPassword(formData)).unwrap()
    if (resData) {
      if (resData.success.status === 200) {
        new Noty({
          text: `✅ ${resData.success.message}`,
          type: 'alert',
          layout: 'topCenter',
        }).show()

        setTimerOtp(35)
        $('#confirm_otp_div').css('display', 'block')
        $('#lookupDiv').css('display', 'none')
      }
    }
  }

  // const handleVerifyOTP = (e) => {
  //   e.preventDefault()

  //   const vfCode = [...document.querySelectorAll('input.confirm_otp_otp.customOtp')]
  //     .filter(({ name }) => name)
  //     .map(({ value }) => value)
  //     .join('')
  //   if (/[^0-9\-/]/.test(vfCode)) {
  //     // showCommonError('confirm_otp', I18N.get('IAM.SIGNIN.ERROR.INVALID.VERIFICATION.CODE')) //No I18N
  //     return false
  //   }
  //   // .map(({ value }) => value)
  //   // .join('')
  //   console.log('vfCode')
  // }

  const initMethod = useCallback(() => {
    $('body').addClass('forgot-password-wrapper')
    //
    $('#confirm_otp').on('click', function () {
      $(this).addClass('hidePlaceHolder')
      const hj = 'input.confirm_otp_otp.customOtp'
      $(hj).each(function () {
        $(this).css('opacity', 1)
      })
    })
    //add all elements we want to include in our selection
    const inptEl = [...document.querySelectorAll('input.confirm_otp_otp.customOtp')]
    inptEl.forEach((ele, index) => {
      ele.addEventListener('keydown', (e) => {
        // if the keycode is backspace & the current field is empty
        // focus the input before the current. Then the event happens
        // which will clear the "before" input box.
        if (e.keyCode === 8 && e.target.value === '') inptEl[Math.max(0, index - 1)].focus()
      })
      ele.addEventListener('input', (e) => {
        // take the first character of the input
        // this actually breaks if you input an emoji like 👨‍👩‍👧‍👦....
        // but I'm willing to overlook insane security code practices.
        const [first, ...rest] = e.target.value
        e.target.value = first ?? '' // first will be undefined when backspace was entered, so set the input to ""
        const lastInputBox = index === inptEl.length - 1
        const insertedContent = first !== undefined
        if (insertedContent && !lastInputBox) {
          // continue to input the rest of the string
          inptEl[index + 1].focus()
          inptEl[index + 1].value = rest.join('')
          inptEl[index + 1].dispatchEvent(new Event('input'))
        }
      })
    })
  }, [])

  useEffect(() => {
    document.title = 'Reset Password'

    initMethod()
    return () => initMethod()
  }, [initMethod])

  return (
    <div className="accountsWrapper">
      <div className="bg_main-wrapper"></div>
      <div className="forgotPswdContainer ">
        <div className="loaderDefault" style={{ display: 'none' }}>
          <CSpinner color="info" />
        </div>
        <div id="forgotPswdFormWrap" className="forgotPswdBox">
          {/* logo */}
          <div className="logoWrap">
            <div
              className="logoDefault"
              style={{
                background: `url('${logoBrand}') no-repeat transparent`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
              }}
            ></div>
          </div>
          <div id="lookupDiv" className="recoverySections" style={{ display: 'block' }}>
            <div className="infoHeader">
              <span id="headTitle">Create New Password</span>
              <div className="headerInfo">
                Enter a unique and strong password that is easy to remember so that you won&apos;t
                forget it the next time.
              </div>
            </div>
            <div className="fieldContainer">
              <form name="login_id_container">
                <div className="searchparent" id="change_password_container">
                  <div className="textboxWrapper">
                    <CFormInput
                      id="change_password"
                      placeholder="New Password"
                      type="email"
                      name="loginID"
                      className="textboxInpt"
                      required
                      autoCapitalize="off"
                      autoComplete="on"
                      autoCorrect="off"
                      tabIndex="1"
                      invalid={
                        forgotPswdErrors && !isEmpty(forgotPswdErrors.loginID) ? true : false
                      }
                      value={forgotPswdData.loginID}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={() =>
                        dispatch(clearCommonError({ type: 'loginID', errorType: 'enterFgtPswd' }))
                      }
                    />
                    <CFormFeedback invalid className="fieldError">
                      {forgotPswdErrors.loginID}
                    </CFormFeedback>
                  </div>
                </div>
                <div className="searchparent" id="reneter_password_container">
                  <div className="textboxWrapper">
                    <CFormInput
                      id="reneter_password"
                      placeholder="Confirm New Password"
                      type="password"
                      name="reneterPassword"
                      className="textboxInpt"
                      required
                      autoCapitalize="off"
                      autoComplete="on"
                      autoCorrect="off"
                      tabIndex="1"
                      invalid={
                        forgotPswdErrors && !isEmpty(forgotPswdErrors.loginID) ? true : false
                      }
                      value={forgotPswdData.loginID}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={() =>
                        dispatch(clearCommonError({ type: 'loginID', errorType: 'enterFgtPswd' }))
                      }
                    />
                    <CFormFeedback invalid className="fieldError">
                      {forgotPswdErrors.loginID}
                    </CFormFeedback>
                  </div>
                </div>
                <CButton
                  className={classNames('blue block ', { btnLoading: recoveringFgtPswd })}
                  size="lg"
                  id="nextBtn"
                  tabIndex="2"
                  onClick={(e) => handleSubmitNext(e)}
                  disabled={forgotPswdData.loginID === '' || recoveringFgtPswd ? true : false}
                >
                  <span className={classNames({ zeroHeight: recoveringFgtPswd })}>
                    Change Password
                  </span>
                </CButton>
              </form>
            </div>
          </div>
        </div>
      </div>
      <footer id="footer" className="forgotPswdFooter">
        <div style={{ fontSize: '14px', textAlign: 'center' }}>
          <span>
            © {new Date().getFullYear()}, {/* eslint-disable-next-line */}
            <a
              href="/"
              target="_blank"
              style={{ fontSize: '14px', cursor: 'pointer', textDecoration: 'none' }}
            >
              Nueklabs Tech. Ltd.
            </a>{' '}
            All Rights Reserved.{' '}
          </span>
        </div>
      </footer>
    </div>
  )
}

export default ResetPassword
