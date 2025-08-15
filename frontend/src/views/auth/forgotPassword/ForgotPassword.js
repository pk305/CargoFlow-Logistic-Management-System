import React, { useCallback, useEffect, useState } from 'react'
import {
  CButton,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
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

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const [forgotPswdData, setForgotPswdData] = useState({
    loginID: '',
  })
  const { forgotPswdErrors, recoveringFgtPswd } = useSelector((state) => state.auth)
  let [timerOtp, setTimerOtp] = useState(0)

  const resetForm = () => {
    $('#confirm_otp_div').css('display', 'none')
    $('#lookupDiv').css('display', 'block')
    setForgotPswdData({
      ...forgotPswdData,
      loginID: '',
    })
    dispatch(clearCommonError({ type: 'loginID', errorType: 'enterFgtPswd' }))
  }

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

  const changeCountryCode = (e) => {
    e.preventDefault()
  }

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

  const handleVerifyOTP = (e) => {
    e.preventDefault()

    const vfCode = [...document.querySelectorAll('input.confirm_otp_otp.customOtp')]
      .filter(({ name }) => name)
      .map(({ value }) => value)
      .join('')
    if (/[^0-9\-/]/.test(vfCode)) {
      // showCommonError('confirm_otp', I18N.get('IAM.SIGNIN.ERROR.INVALID.VERIFICATION.CODE')) //No I18N
      return false
    }
    // .map(({ value }) => value)
    // .join('')
    console.log('vfCode')
  }

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
    document.title = 'Forgot Password'
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
        <div className="blur_elem blur" style={{ display: 'none' }}></div>
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
              <span id="headTitle">Forgot Password</span>
              <div className="headerInfo">
                Enter your registered email address, mobile number, or username to change your
                CargoFlow TMS account password.
              </div>
            </div>
            <div className="fieldContainer">
              <form name="login_id_container">
                <div className="searchparent" id="login_id_container">
                  <div className="textboxWrapper">
                    <CFormLabel
                      htmlFor="country_code_select"
                      className="select_country_code"
                      style={{ display: 'none' }}
                    >
                      +254
                    </CFormLabel>
                    <CFormSelect
                      id="country_code_select"
                      onChange={(e) => changeCountryCode(e)}
                      tabIndex="-1"
                      style={{ display: 'none' }}
                      className="select2-hidden-accessible"
                      aria-hidden="true"
                    >
                      <option data-num="AF" value="+93" id="AF">
                        Afghanistan (93)
                      </option>

                      <option data-num="ZW" value="+263" id="ZW">
                        Zimbabwe (263)
                      </option>
                    </CFormSelect>
                    <span
                      className="select2 select2-container select2-container--default"
                      dir="ltr"
                      style={{ width: '50px', display: 'none' }}
                    >
                      <span className="selection">
                        <span
                          className="select2-selection select2-selection--single"
                          aria-haspopup="true"
                          aria-expanded="false"
                          role="combobox"
                          aria-controls=""
                          tabIndex="-1"
                          aria-labelledby="select2-country_code_select-container"
                        >
                          <span
                            className="select2-selection__rendered"
                            id="select2-country_code_select-container"
                            title="Kenya (254)"
                          >
                            +254
                          </span>
                          <span className="select2-selection__arrow" role="presentation">
                            <b role="presentation"></b>
                          </span>
                        </span>
                      </span>
                      <span className="dropdown-wrapper" aria-hidden="true"></span>
                    </span>
                    <CFormInput
                      id="loginID"
                      placeholder="Email, mobile, or username"
                      type="email"
                      name="loginID"
                      className="textboxInpt"
                      required=""
                      // onKeyPress="clearCommonError('loginID')"
                      // onKeyUp="checking()"
                      // onKeyDown="checking()"
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
                  <span className={classNames({ zeroHeight: recoveringFgtPswd })}>Next</span>
                </CButton>
              </form>
            </div>
          </div>
          <div id="confirm_otp_div" className="recover_sections" style={{ display: 'none' }}>
            <div className="info_head">
              <div className="cstWelcome" id="recovery_user_info" onClick={(e) => resetForm(e)}>
                <div className="cstTitle">{forgotPswdData.loginID}</div>
                <span className="subCstTitle">Change</span>
              </div>
              <div className="infoHeader">
                <span id="headTitle">Forgot Password</span>
                <div className="headerInfo">
                  Enter the one-time password sent to your email address.
                </div>
              </div>
            </div>
            <div className="fieldcontainer">
              <form name="confirm_otp_container">
                <div className="searchparent" id="confirm_otp_container">
                  <div className="textboxWrapper">
                    <div id="confirm_otp" className="otp_container " placeholder="Enter OTP">
                      <input
                        type="hidden"
                        className="confirm_otp_full_value"
                        id="confirm_otp_full_value"
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                      <input
                        type="number"
                        tabIndex="0"
                        placeholder="●"
                        className="confirm_otp_otp customOtp"
                        autoComplete="one-time-code"
                        name="vcode"
                        style={{ opacity: 0 }}
                      />
                    </div>
                    <input type="hidden" className="hide" id="username_mdigest" value="" />
                    <div className="textbox_actions">
                      {parseInt(timerOtp) > 0 ? (
                        <span id="otp_resend" className="resendotp">
                          Resend in <span>{timerOtp}</span>s
                        </span>
                      ) : (
                        <span
                          id="otp_resend"
                          className="bluetext_action resendotp"
                          // onClick="call_recusernameScreen()"
                        >
                          Resend OTP
                        </span>
                      )}

                      <div
                        className="resend_text otp_sent"
                        id="otp_sent"
                        style={{ display: 'none' }}
                      >
                        OTP sent
                      </div>
                    </div>
                    <div className="fielderror"></div>
                  </div>
                </div>
                <CButton
                  className={classNames('blue block ', { btnLoading: false })}
                  size="lg"
                  id="nextBtn"
                  tabIndex="2"
                  onClick={(e) => handleVerifyOTP(e)}
                  // disabled={forgotPswdData.loginID === '' || false ? true : false}
                >
                  <span className={classNames({ zeroHeight: false })}>Verify</span>
                </CButton>
              </form>

              {/* <div className="bottom_line_opt">
                <div
                  className="bottom_option rec_modes_other_options"
                  onClick="show_other_options()"
                  style={{ display: 'none' }}
                >
                  View all options
                </div>
              </div>

              <div className="bottom_line_opt">
                <div
                  className="bottom_option rec_modes_contact_support hide"
                  onClick="show_contactsupport()"
                  style={{ display: 'block' }}
                >
                  Contact Support{' '}
                </div>
              </div> */}
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

export default ForgotPassword
