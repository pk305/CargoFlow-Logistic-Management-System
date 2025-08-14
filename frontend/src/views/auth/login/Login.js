import React, { useEffect, useState } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CFormFeedback,
  CSpinner,
} from '@coreui/react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCommonError,
  fetchUserById,
  showCommonError,
  checkUserPassword,
  clearLookupData,
} from 'src/redux/slices/authSlice'
import classNames from 'classnames'
import { isNull } from 'lodash'
import $ from 'jquery'
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import logoBrand from 'src/assets/brand/truck-logo.png'

const Login = ({ fallbackLoading }) => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const [loginData, setLoginData] = useState({
    loginID: '',
    password: '',
  })
  const [initiateLoadnig, setInitiateLoadnig] = useState(fallbackLoading || true)
  const [passwordField, setPasswordField] = useState(false)
  const { loginLoading, loginValidationErrors, lookupData } = useSelector((state) => state.auth)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  const goToForgotPassword = (e) => {
    e.preventDefault()
    history.push('/account/recovery')
  }

  const submitSignin = async (e) => {
    e.preventDefault()
    const form = $('#loginForm')
    $('#passwordContainer').removeClass('zeroHeight')
    if (form.length > 0) {
      if (loginData.loginID === '') {
        dispatch(showCommonError({ type: 'loginID', errorType: 'enterEmailOrMobile' }))
        return false
      }
    }
    //
    const data = {
      loginID: loginData.loginID,
      mode: 'primary',
      cliTime: new Date().valueOf(),
      serviceName: 'LMSHome',
      serviceUrl: '',
      signupUrl: '',
    }

    if (isNull(lookupData)) {
      try {
        await dispatch(fetchUserById(data)).unwrap()
      } catch (error) {
        if (error) {
          const err = !error.statusCode ? JSON.parse(error) : null
          if (err) {
            if (err.code === 500) {
              if (err.errors === 'Network Error') {
                history.push('/505')
              }
            }
          }
        }
      }
    } else {
      if (form.length > 0) {
        if (loginData.password === '') {
          dispatch(showCommonError({ type: 'password', errorType: 'enterEmailOrMobile' }))
          return false
        }
      }
      const paswdData = {
        df: lookupData.lookup.df,
        identifier: lookupData.lookup.identifier,
        password: loginData.password,
        cliTime: new Date().valueOf(),
        serviceName: 'LMSHome',
        serviceUrl: '',
      }

      const resData = await dispatch(checkUserPassword(paswdData)).unwrap()
      if (resData) {
        if (resData.statusCode === 200) {
          clearLoginData()
          redirectHome()
        }
      }
    }
  }

  const redirectHome = () => {
    let { from } = location.state || { from: { pathname: '/' } }
    if (from.pathname === '/' || from.pathname === '/login') {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/'
    }
  }

  const showHidePassword = (e) => {
    e.preventDefault()
    setPasswordField(!passwordField)
  }

  const clearLoginData = () => {
    setLoginData({
      loginID: '',
      password: '',
    })
    setPasswordField(false)
  }

  const handleKeyUpLogin = (e) => {
    e.preventDefault()
    if (e.keyCode === 13) {
      submitSignin(e)
    }
  }

  const resetForm = () => {
    $('#loginIdContainer').slideDown(200)
    $('#passwordContainer').addClass('zeroHeight')
    setLoginData({
      ...loginData,
      password: '',
    })
    setPasswordField(!passwordField)
    dispatch(clearLookupData())
  }

  const defaultMethods = useCallback(() => {
    if (initiateLoadnig) {
      setInitiateLoadnig(false)
    }
  }, [initiateLoadnig])

  useEffect(() => {
    document.title = 'Login'

    defaultMethods()
  }, [defaultMethods])

  return (
    <div className="accountsWrapper">
      <div className="bg_main-wrapper"></div>
      <div className="signinContainer">
        <div className="loaderDefault" style={{ display: initiateLoadnig ? 'block' : 'none' }}>
          <CSpinner color="info" />
        </div>
        <div
          className="blur_elem blur"
          style={{ display: initiateLoadnig ? 'block' : 'none' }}
        ></div>
        {/* Login  */}
        <div className="signinBox" id="signinBoxAcc" style={{ marginTop: '-23px' }}>
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
          {/* form content */}
          <div id="signinFormWrap">
            <CForm name="login" id="loginForm" onSubmit={(e) => e.preventDefault()}>
              <div className="signinHeader">
                <span id="headerTitle">Sign in</span>
                <div className="serviceName">
                  to access <span>Nueklabs TMS</span>
                </div>
                <div className="fieldError"></div>
              </div>
              <div className="fieldContainer">
                <div
                  className="searchparent"
                  id="loginIdContainer"
                  style={{ display: !isNull(lookupData) ? 'none' : '' }}
                >
                  <div className="textboxWrapper" id="getusername">
                    <span>
                      <CFormLabel
                        htmlFor="countryCodeSelect"
                        className="selectCountryCode"
                        style={{ display: 'none' }}
                      >
                        +254
                      </CFormLabel>
                      <CFormSelect
                        id="countryCodeSelect"
                        //   onChange="changeCountryCode();"
                        tabIndex="-1"
                        style={{ display: 'none' }}
                        className="select2-hidden-accessible"
                        aria-hidden="true"
                      >
                        <option data-num="AF" value="+93" id="AF">
                          Afghanistan (93)
                        </option>
                      </CFormSelect>
                      {/* <Select options={options} value={value} onChange={changeHandler} /> */}
                      <CFormInput
                        id="loginID"
                        placeholder="Email address or mobile number"
                        value={loginData.loginID}
                        type="text"
                        name="loginID"
                        className="textboxInpt "
                        required=""
                        onKeyPress={() => dispatch(clearCommonError({ type: 'loginID' }))}
                        // onKeyUp={(e) => checkingInpt(e)}
                        onKeyUp={(e) => handleKeyUpLogin(e)}
                        onChange={(e) => handleChangeForm(e)}
                        autoCapitalize="off"
                        autoComplete="on"
                        autoCorrect="off"
                        tabIndex="1"
                        invalid={loginValidationErrors.loginID !== '' ? true : false}
                      />
                      <CFormFeedback
                        invalid={loginValidationErrors.loginID !== '' ? true : false}
                        className="fieldError"
                      >
                        {loginValidationErrors.loginID}
                      </CFormFeedback>
                    </span>
                  </div>
                </div>
                <div
                  className="getPassword"
                  id="passwordContainer"
                  style={{ display: !isNull(lookupData) ? '' : 'none' }}
                >
                  <div className="cstWelcome">
                    <div className="cstTitle">{lookupData && lookupData.lookup.loginId}</div>
                    <span className="subCstTitle" onClick={(e) => resetForm()}>
                      Change
                    </span>
                  </div>
                  <div className="textboxWrapper">
                    <CFormInput
                      id="password"
                      placeholder="Enter password"
                      name="password"
                      type={!passwordField ? 'password' : 'text'}
                      className="textboxInpt"
                      required=""
                      autoCapitalize="off"
                      autoComplete="password"
                      autoCorrect="off"
                      maxLength="250"
                      onKeyUp={(e) => handleKeyUpLogin(e)}
                      onKeyPress={() => dispatch(clearCommonError({ type: 'password' }))}
                      onChange={(e) => handleChangeForm(e)}
                      invalid={loginValidationErrors.password !== '' ? true : false}
                    />
                    <CFormFeedback
                      invalid={loginValidationErrors.password !== '' ? true : false}
                      className="fieldError"
                    >
                      {loginValidationErrors.password}
                    </CFormFeedback>
                    <CButton
                      color="link"
                      className="icon-hide showHidePassword"
                      onClick={(e) => showHidePassword(e)}
                    >
                      <i className="fa fa-eye-slash"></i>
                    </CButton>
                    <div className="textboxAction" id="cstTools">
                      <span
                        className="txtActionSub txtActionSub-rt"
                        id="frgtPswd"
                        onClick={(e) => goToForgotPassword(e)}
                      >
                        Forgot Password?
                      </span>
                    </div>
                  </div>
                </div>
                <div className="textboxWrapper" id="mfa_device_container">
                  <div className="devices">
                    <select
                      className="secondary_devices"
                      // onChange="changeSecDevice(this);"
                    ></select>
                    <div className="deviceparent">
                      <span className="deviceinfo icon-device"></span>
                      <span className="devicetext"></span>
                    </div>
                  </div>
                  <div className="rnd_container">
                    <div id="rnd_num"></div>
                    <div
                      className="bluetext_action rnd_resend resendotp"
                      // onClick="javascript:return submitsignin($('#login'));"
                    >
                      Resend Push
                    </div>
                  </div>
                </div>
                <div id="otp_container">
                  <div className="hellouser">
                    <div className="username"></div>
                    <span className="Notyou bluetext">Change</span>
                  </div>
                  <div className="textboxWrapper">
                    <input
                      id="otp"
                      placeholder="Enter OTP"
                      type="text"
                      name="OTP"
                      className="textboxInpt"
                      required=""
                      // onKeyPress="clearCommonError('otp')"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                    <div className="fieldError"></div>
                    <div className="textbox_actions otp_actions">
                      <span
                        className="bluetext_action"
                        id="signinwithpass"
                        // onClick="showPassword()"
                      >
                        Sign in using password
                      </span>
                      {/* <span className="bluetext_action signinwithsaml" onClick="enableSamlAuth();">
                        Sign in using SAML
                      </span> */}
                      {/* eslint-disable-next-line */}
                      <a href="" className="bluetext_action signinwithjwt">
                        Sign in using JWT
                      </a>
                      <span
                        className="bluetext_action showmoresigininoption"
                        // onClick="showmoresigininoption()"
                      >
                        Sign in another way
                      </span>
                      <span
                        className="bluetext_action bluetext_action_right resendotp"
                        // onClick="generateOTP(true)"
                      >
                        Resend OTP
                      </span>
                    </div>
                  </div>
                </div>
                <div className="textboxWrapper" id="mfa_otp_container">
                  <input
                    id="mfa_otp"
                    placeholder="Enter OTP"
                    type="text"
                    name="MFAOTP"
                    className="textboxInpt"
                    required=""
                    // onKeyPress="clearCommonError('mfa_otp')"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                  <div className="fieldError"></div>
                  <div className="textbox_actions">
                    <span
                      className="bluetext_action bluetext_action_right resendotp"
                      // onClick="generateOTP(true)"
                    >
                      Resend OTP
                    </span>
                  </div>
                  Name{' '}
                </div>
                <div className="textboxWrapper" id="mfa_totp_container">
                  <input
                    id="mfa_totp"
                    placeholder="Enter TOTP"
                    type="text"
                    name="TOTP"
                    className="textboxInpt"
                    required=""
                    // onKeyPress="clearCommonError('mfa_totp')"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                  <div className="fieldError"></div>
                  Name{' '}
                </div>

                <div className="qrcodecontainer" id="mfa_scanqr_container">
                  <span className="qr_before"></span>
                  <img id="qrimg" src="" alt="" />
                  <span className="qr_after"></span>
                </div>
                <div className="textboxWrapper" id="captcha_container">
                  <input
                    id="captcha"
                    placeholder="Enter CAPTCHA"
                    type="text"
                    name="captcha"
                    className="textboxInpt"
                    required=""
                    // onKeyPress="clearCommonError('captcha')"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    maxLength="8"
                  />
                  <div id="captcha_img" name="captcha" className="textboxInpt"></div>
                  {/* <span className="reloadcaptcha" onClick="changeHip()">
                    {' '}
                  </span> */}
                  <div className="fieldError"></div>
                  Name{' '}
                </div>
                <div id="yubikey_container">
                  <div className="fieldError"></div>
                </div>
                <button className="btn blue waitbtn" id="waitbtn">
                  <span className="loadwithbtn"></span>
                  <span className="waittext">Waiting for approval</span>
                </button>
              </div>

              {/*  */}
              <div className="textbox_actions_more" id="enablemore">
                <span
                  className="bluetext_action showmoresigininoption"
                  // onClick="showmoresigininoption()"
                >
                  Sign in another way
                </span>
                <span
                  className="bluetext_action bluetext_action_right blueforgotpassword"
                  id="blueforgotpassword"
                  onClick={(e) => goToForgotPassword(e)}
                >
                  Forgot Password?
                </span>
                <span
                  className="bluetext_action bluetext_action_right resendotp"
                  id="resendotp"
                  // onClick="generateOTP(true)"
                >
                  Resend OTP
                </span>
              </div>
              <div className="addaptivetfalist">
                <div className="signinHeader verify_title">Sign in another way</div>
                <div
                  className="optionstry optionmod"
                  id="trytotp"
                  //  onClick="tryAnotherway('totp')"
                >
                  <div className="img_option_try img_option icon-totp"></div>
                  <div className="option_details_try">
                    <div className="option_title_try">Offline TOTP verification</div>
                    <div className="option_description try_option_desc">
                      Open OneAuth, tap&nbsp;<span className="trydesc">Sign in another way</span>
                      ,&nbsp;and enter it here to verify your sign-in.
                    </div>
                  </div>
                  <div className="mfa_totp_verify verify_totp" id="verify_totp_container">
                    <input
                      id="verify_totp"
                      placeholder="Enter OTP"
                      type="number"
                      name="MFATOTP"
                      className="textboxInpt"
                      required=""
                      // onKeyPress="clearCommonError('verify_totp')"
                      autoCapitalize="off"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                    <button className="btn blue" id="totpverifybtn" tabIndex="2">
                      <span className="loadwithbtn"></span>
                      <span className="waittext">Verify</span>
                    </button>
                    <div className="fieldError"></div>
                  </div>
                </div>
                <div
                  className="optionstry optionmod"
                  id="tryscanqr"
                  //  onClick="tryAnotherway('qr')"
                >
                  <div className="img_option_try img_option icon-qr"></div>
                  <div className="option_details_try">
                    <div className="option_title_try">Scan QR verification</div>
                    <div className="option_description try_option_desc">
                      Open OneAuth and tap&nbsp;
                      <span className="trydesc">Sign in another way</span>. Tap&nbsp;
                      <span className="trydesc">Scan QR instead</span> to open code scanner. Scan
                      the below code to verify sign-in.
                    </div>
                  </div>
                  <div className="verify_qr" id="verify_qr_container">
                    <div className="qrcodecontainer">
                      <div>
                        <span className="qr_before"></span>
                        <img id="verify_qrimg" src="" alt="" />
                        <span className="qr_after"></span>
                        <div className="loader" style={{ display: 'none' }}></div>
                        <div className="blur_elem blur" style={{ display: 'none' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className="close_icon error_icon"
                  // onClick="hideTryanotherWay()"
                ></span>
                <div
                  className="textTools nomargin"
                  id="recoverybtn_mob"
                  // onClick="showCantAccessDevice()"
                >
                  Cant access your mobile device?
                </div>
                <div
                  className="textTools nomargin"
                  id="problemsignin_mob"
                  // onClick="showproblemsignin()"
                >
                  Problem signing in?
                </div>
              </div>
              <div id="problemsigninui"></div>
              {/* submit btn*/}
              <CButton
                className={classNames('blue block ', { btnLoading: loginLoading })}
                size="lg"
                id="nextbtn"
                tabIndex="2"
                disabled={loginLoading || loginData.loginID === '' ? true : false}
                onClick={(e) => submitSignin(e)}
              >
                {lookupData && lookupData.code === 200 ? (
                  <span className={classNames({ zeroHeight: loginLoading })}>Sign In</span>
                ) : (
                  <span className={classNames({ zeroHeight: loginLoading })}>Next</span>
                )}
              </CButton>
              <div
                className="btn borderless"
                // onClick="hideBackupOptions()"
              >
                Back
              </div>
              {/* <div className="textTools nomargin" id="recoverybtn" onClick="showCantAccessDevice()">
                Cant access your mobile device?
              </div>
              <div className="textTools nomargin" id="problemsignin" onClick="showproblemsignin()">
                Problem signing in?
              </div>
              <div className="tryanother text16" onClick="showTryanotherWay()">
                Sign in another way
              </div> */}
              <div
                className={classNames('frgPswdTxtContainer ', { hide: !isNull(lookupData) })}
                id="forgotpassword"
              >
                {/* eslint-disable-next-line */}
                <a className="textTools" onClick={(e) => goToForgotPassword(e)}>
                  Forgot Password?
                </a>
              </div>
            </CForm>
            <div className="ExUserContainer"></div>
            <button
              className="btn blue"
              id="continueBtn"
              //   onClick="handleLookupDetails(JSON.stringify(deviceauthdetails),true);return false"
            >
              <span>Continue</span>
            </button>
          </div>
        </div>
      </div>
      <footer id="footer" className="signInFooter">
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
        </div>{' '}
      </footer>
    </div>
  )
}

Login.propTypes = {
  fallbackLoading: PropTypes.bool.isRequired,
}

export default Login
