import React, { useState } from 'react'
import { CButton, CForm, CFormFeedback, CFormInput } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import {
  storeCurrencyList,
  clearFinitemError,
  showFinitemError,
} from 'src/redux/slices/currencySlice'
import $ from 'jquery'
import Noty from 'noty'
import PropTypes from 'prop-types'

const NewCurrency = ({ setToggleTransPanel }) => {
  const [currencyData, setCurrencyData] = useState({
    currencyCode: '',
    currencyName: '',
    currencySymbol: '',
    multiplier: '1',
  })
  const { creatingCurrList, currencyListErrors } = useSelector((state) => state.currency)
  const dispatch = useDispatch()

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setCurrencyData({
      ...currencyData,
      [name]: value,
    })
  }

  const handleSubmitCurrencyList = async (e) => {
    e.preventDefault()
    const form = $('#newCurrency')
    if (form.length > 0) {
      const bd = 'html, body'
      if (currencyData.currencyCode === '') {
        dispatch(showFinitemError({ type: 'currencyCode', errorType: 'errCurrList' }))
        $(bd).animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(currencyData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(storeCurrencyList(formData)).unwrap()
    if (resData) {
      clearCurrencyData()
      setToggleTransPanel(false)
      new Noty({
        type: 'alert',
        text: ' Currency has been created succesfully',
        timeout: 3000,
      }).show()
    }
  }

  const clearCurrencyData = () => {
    setCurrencyData({
      ...currencyData,
      currencyCode: '',
      currencyName: '',
      currencySymbol: '',
      multiplier: '1',
    })
  }

  return (
    <CForm
      className="simple_form horizontal-form"
      id="newCurrency"
      action="/currencies"
      acceptCharset="UTF-8"
      data-remote="true"
      method="post"
      onSubmit={(e) => handleSubmitCurrencyList(e)}
    >
      <div className="row">
        <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group currency_code">
            <label className="control-label" htmlFor="currency_code">
              Code <span>*</span>
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              name="currencyCode"
              id="currency_code"
              value={currencyData.currencyCode}
              onChange={(e) => handleChangeForm(e)}
              invalid={
                currencyListErrors && !isEmpty(currencyListErrors.currencyCode) ? true : false
              }
              onFocus={() =>
                dispatch(
                  clearFinitemError({
                    type: 'currencyCode',
                    errorType: 'errCurrList',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={
                currencyListErrors && !isEmpty(currencyListErrors.currencyCode) ? true : false
              }
              className="fieldError-cst"
            >
              {currencyListErrors.currencyCode}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group currency_name">
            <label className="control-label" htmlFor="currency_name">
              Name <span>*</span>
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              name="currencyName"
              id="currency_name"
              value={currencyData.currencyName}
              onChange={(e) => handleChangeForm(e)}
              invalid={
                currencyListErrors && !isEmpty(currencyListErrors.currencyName) ? true : false
              }
              onFocus={() =>
                dispatch(
                  clearFinitemError({
                    type: 'currencyName',
                    errorType: 'errCurrList',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={
                currencyListErrors && !isEmpty(currencyListErrors.currencyName) ? true : false
              }
              className="fieldError-cst"
            >
              {currencyListErrors.currencyName}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group string optional currency_symbol">
            <label className="control-label string optional" htmlFor="currency_symbol">
              Symbol
            </label>
            <CFormInput
              className="form-control-cst"
              type="text"
              step={1}
              name="currencySymbol"
              id="currency_symbol"
              value={currencyData.currencySymbol}
              onChange={(e) => handleChangeForm(e)}
              invalid={
                currencyListErrors && !isEmpty(currencyListErrors.currencySymbol) ? true : false
              }
              onFocus={() =>
                dispatch(
                  clearFinitemError({
                    type: 'currencySymbol',
                    errorType: 'errCurrList',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={
                currencyListErrors && !isEmpty(currencyListErrors.currencySymbol) ? true : false
              }
              className="fieldError-cst"
            >
              {currencyListErrors.currencySymbol}
            </CFormFeedback>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <div className="form-group decimal optional currency_multiplier">
            <label className="control-label decimal optional" htmlFor="currency_multiplier">
              Multiplier
            </label>
            <CFormInput
              className="form-control-cst"
              type="number"
              step="any"
              name="multiplier"
              id="currency_multiplier"
              value={currencyData.multiplier}
              onChange={(e) => handleChangeForm(e)}
              invalid={currencyListErrors && !isEmpty(currencyListErrors.multiplier) ? true : false}
              onFocus={() =>
                dispatch(
                  clearFinitemError({
                    type: 'multiplier',
                    errorType: 'errCurrList',
                  }),
                )
              }
            />
            <CFormFeedback
              invalid={currencyListErrors && !isEmpty(currencyListErrors.multiplier) ? true : false}
              className="fieldError-cst"
            >
              {currencyListErrors.multiplier}
            </CFormFeedback>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <CButton type="submit" color="success" disabled={creatingCurrList ? true : false}>
            {creatingCurrList ? (
              'Processing...'
            ) : (
              <span>
                Save <i className="fa fa-check"></i>
              </span>
            )}
          </CButton>
        </div>
      </div>
    </CForm>
  )
}

NewCurrency.propTypes = {
  setToggleTransPanel: PropTypes.func,
}
export default NewCurrency
