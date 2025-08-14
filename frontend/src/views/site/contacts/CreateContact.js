import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CCardFooter,
  CButton,
  CCallout,
  CFormInput,
  CFormSelect,
  CFormFeedback,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { clearContactError, createContact, showContactError } from 'src/redux/slices/contactSlice'
import classNames from 'classnames'
import Select from 'react-select'
import { isEmpty, isNull } from 'lodash'
import $ from 'jquery'
import { useHistory } from 'react-router-dom'
import Noty from 'noty'

const CreateContact = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies' },
    { name: 'Contacts', pathname: '/contacts', active: true },
    { name: 'Quotations', pathname: '/leads' },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const [contactData, setContactData] = useState({
    contactName: '',
    contactEmail: '',
    companyId: '',
    jobTitle: '',
    gsm: '',
    skype: '',
    tel: '',
    operationId: '',
    roadNotify: '1',
    seaNotify: '1',
    airNotify: '1',
    railNotify: '1',
    customNotify: '0',
    depotNotify: '1',
    financeNotify: '0',
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  })
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { errorCallout, errorCalloutText } = useSelector((state) => state.booking)
  const { creatingContact, contactErrors } = useSelector((state) => state.contact)
  const { fetchingOperations, operations } = useSelector((state) => state.operation)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setContactData({
      ...contactData,
      [name]: value,
    })

    if (name === 'roadNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          roadNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          roadNotify: '1',
        })
      }
    }

    if (name === 'roadNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          roadNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          roadNotify: '1',
        })
      }
    }

    if (name === 'seaNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          seaNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          seaNotify: '1',
        })
      }
    }

    if (name === 'airNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          airNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          airNotify: '1',
        })
      }
    }

    if (name === 'railNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          railNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          railNotify: '1',
        })
      }
    }

    if (name === 'customNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          customNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          customNotify: '1',
        })
      }
    }

    if (name === 'depotNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          depotNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          depotNotify: '1',
        })
      }
    }
    if (name === 'financeNotify') {
      if (value === '1') {
        setContactData({
          ...contactData,
          financeNotify: '0',
        })
      } else {
        setContactData({
          ...contactData,
          financeNotify: '1',
        })
      }
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

  const handleSelectFocus = (c, _) => {
    dispatch(clearContactError({ type: c, errorType: 'errContact' }))

    if (c === 'companyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    }
  }

  const handleSubmitContact = async (e) => {
    e.preventDefault()
    const form = $('#new_contact')
    if (form.length > 0) {
      if (contactData.contactName === '') {
        dispatch(showContactError({ type: 'contactName', errorType: 'errContact' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(contactData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(createContact(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topCenter',
        id: 'sjsios1',
        text: 'Contact has been created succesfully',
      }).show()
      history.push(`/contacts/${resData.linkId}`)
    }
  }

  const closeCallout = (e) => {
    e.preventDefault()
    dispatch(clearContactError({ type: 'msgCallout', errorType: 'calloutErr' }))
  }

  useEffect(() => {
    document.title = 'Contacts'
  }, [])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <div className="d-block"></div>
          <CCallout
            color="danger"
            className={classNames('bg-light cstCalloutInfo animate__animated animate__fadeIn ', {
              'animate__animated animate__fadeOut': !errorCallout,
            })}
            style={{ display: !errorCallout ? 'none' : '' }}
          >
            <div style={{ width: '100%' }}>
              <ul className="cstUl">
                <li>{errorCalloutText}</li>
              </ul>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeCallout(e)}
              ></button>
            </div>
          </CCallout>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-user icon-20"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="card-label">New Contact</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CForm id="new_contact">
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group contact_name">
                          <label className="control-label" htmlFor="contact_name">
                            Full Name <span>*</span>
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="contactName"
                            id="contact_name"
                            value={contactData.contactName}
                            onChange={(e) => handleChangeForm(e)}
                            invalid={
                              contactErrors && !isEmpty(contactErrors.contactName) ? true : false
                            }
                            onFocus={() =>
                              dispatch(
                                clearContactError({
                                  type: 'contactName',
                                  errorType: 'errContact',
                                }),
                              )
                            }
                          />
                          <CFormFeedback
                            invalid={
                              contactErrors && !isEmpty(contactErrors.contactName) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {contactErrors.contactName}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group contact_email">
                          <label className="control-label" htmlFor="contact_email">
                            Mail
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="email"
                            name="contactEmail"
                            id="contact_email"
                            required
                            value={contactData.contactEmail}
                            onChange={(e) => handleChangeForm(e)}
                            invalid={
                              contactErrors && !isEmpty(contactErrors.contactEmail) ? true : false
                            }
                          />
                          <CFormFeedback
                            invalid={
                              contactErrors && !isEmpty(contactErrors.contactEmail) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {contactErrors.contactEmail}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group company optional contact_company_id">
                          <label
                            className="control-label company optional"
                            htmlFor="contact_company_id"
                          >
                            Company
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="contact_company_id"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingCompanies ? true : false}
                                isSearchable
                                name="companyId"
                                autoFocus={false}
                                options={
                                  companies && !fetchingCompanies && companies.length > 0
                                    ? companies.map((itm) => ({
                                        label: itm.name,
                                        value: itm.id,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      contactErrors && !isEmpty(contactErrors.companyId),
                                  },
                                )}
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('companyId', e)}
                                onFocus={(e) => handleSelectFocus('companyId', e)}
                              />
                              <CFormFeedback
                                invalid={
                                  contactErrors && !isEmpty(contactErrors.companyId) ? true : false
                                }
                                className="fieldError-cst"
                              >
                                {contactErrors.companyId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_jobtitle">
                          <label className="control-label optional" htmlFor="contact_jobtitle">
                            Job Title
                          </label>
                          <CFormInput
                            className="form-control-cst optional"
                            placeholder="Position"
                            type="text"
                            name="jobTitle"
                            id="contact_jobtitle"
                            value={contactData.jobTitle}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              contactErrors && !isEmpty(contactErrors.jobTitle) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {contactErrors.jobTitle}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_tel">
                          <label className="control-label optional" htmlFor="contact_tel">
                            Phone
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="tel"
                            id="contact_tel"
                            value={contactData.tel}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={contactErrors && !isEmpty(contactErrors.tel) ? true : false}
                            className="fieldError-cst"
                          >
                            {contactErrors.tel}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_gsm">
                          <label className="control-label optional" htmlFor="contact_gsm">
                            Mobile Phone
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="gsm"
                            id="contact_gsm"
                            value={contactData.gsm}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={contactErrors && !isEmpty(contactErrors.gsm) ? true : false}
                            className="fieldError-cst"
                          >
                            {contactErrors.gsm}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_skype">
                          <label className="control-label optional" htmlFor="contact_skype">
                            Skype
                          </label>
                          <CFormInput
                            className="form-control-cst"
                            type="text"
                            name="skype"
                            id="contact_skype"
                            value={contactData.skype}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={contactErrors && !isEmpty(contactErrors.skype) ? true : false}
                            className="fieldError-cst"
                          >
                            {contactErrors.skype}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group select optional contact_operation_id">
                          <label
                            className="control-label select optional"
                            htmlFor="contact_operation_id"
                          >
                            Operation
                          </label>
                          <CFormSelect
                            className={classNames('form-control-cst  operation-select', {
                              'is-invalid': contactErrors && !isEmpty(contactErrors.operationId),
                            })}
                            name="operationId"
                            id="operationId"
                            value={contactData.operationId}
                            onChange={(e) => handleChangeForm(e)}
                            onFocus={(e) => handleSelectFocus('operationId', e)}
                          >
                            {!fetchingOperations ? (
                              operations && operations.length > 0 ? (
                                <>
                                  <option value=""></option>
                                  {operations.map((itm, i) => (
                                    <option key={i} value={itm.id} trans_method={itm.slug}>
                                      {itm.name}
                                    </option>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <option value=""></option>
                                  <option disabled>No results found.</option>
                                </>
                              )
                            ) : (
                              <option>Loading...</option>
                            )}
                          </CFormSelect>
                          <CFormFeedback
                            invalid={
                              contactErrors && !isEmpty(contactErrors.operationId) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {contactErrors.operationId}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                    <div className="separator separator-solid my-4"></div>
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <h5 className="font-size-h5 font-weight-bold text-dark">
                          Select the Department to send the Mail.
                        </h5>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_road_notify">
                          <label className="boolean optional" htmlFor="contact_road_notify">
                            Road
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="roadNotify"
                              checked={contactData.roadNotify === '1' ? true : false}
                              id="contact_road_notify"
                              value={contactData.roadNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.roadNotify) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.roadNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_sea_notify">
                          <label className="boolean optional" htmlFor="contact_sea_notify">
                            Sea
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="seaNotify"
                              id="contact_sea_notify"
                              checked={contactData.seaNotify === '1' ? true : false}
                              value={contactData.seaNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.seaNotify) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.seaNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_air_notify">
                          <label className="boolean optional" htmlFor="contact_air_notify">
                            Air
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="airNotify"
                              id="contact_air_notify"
                              checked={contactData.airNotify === '1' ? true : false}
                              value={contactData.airNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.airNotify) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.airNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_rail_notify">
                          <label className="boolean optional" htmlFor="contact_rail_notify">
                            Rail
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="railNotify"
                              id="contact_rail_notify"
                              checked={contactData.railNotify === '1' ? true : false}
                              value={contactData.railNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.railNotify) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.railNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_custom_notify">
                          <label className="boolean optional" htmlFor="contact_custom_notify">
                            Custom
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="customNotify"
                              id="contact_custom_notify"
                              checked={contactData.customNotify === '1' ? true : false}
                              value={contactData.customNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.customNotify) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.customNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_depot_notify">
                          <label className="boolean optional" htmlFor="contact_depot_notify">
                            Depot
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="depotNotify"
                              id="contact_depot_notify"
                              checked={contactData.depotNotify === '1' ? true : false}
                              value={contactData.depotNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.depotNotify) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.depotNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-1">
                        <div className="form-group boolean optional contact_finance_notify">
                          <label className="boolean optional" htmlFor="contact_finance_notify">
                            Finance
                          </label>
                          <div className="checkbox-custom checkbox-primary">
                            <input
                              className="boolean optional"
                              type="checkbox"
                              name="financeNotify"
                              id="contact_finance_notify"
                              checked={contactData.financeNotify === '1' ? true : false}
                              value={contactData.financeNotify}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.financeNotify)
                                  ? true
                                  : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.financeNotify}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="separator separator-solid my-4"></div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_twitter">
                          <label className="control-label optional" htmlFor="contact_twitter">
                            Twitter
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">@</span>
                            </div>
                            <CFormInput
                              className="form-control-cst"
                              type="text"
                              name="twitter"
                              id="contact_twitter"
                              value={contactData.twitter}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.twitter) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.twitter}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_linkedin">
                          <label className="control-label optional" htmlFor="contact_linkedin">
                            Linkedin
                          </label>
                          <CFormInput
                            className="form-control-cst optional"
                            placeholder="Link of linkedin profile"
                            type="text"
                            name="linkedin"
                            id="contact_linkedin"
                            value={contactData.linkedin}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              contactErrors && !isEmpty(contactErrors.linkedin) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {contactErrors.linkedin}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_facebook">
                          <label className="control-label optional" htmlFor="contact_facebook">
                            Facebook
                          </label>
                          <CFormInput
                            className="form-control-cst optional"
                            placeholder="Link of facebook profile"
                            type="text"
                            name="facebook"
                            id="contact_facebook"
                            value={contactData.facebook}
                            onChange={(e) => handleChangeForm(e)}
                          />
                          <CFormFeedback
                            invalid={
                              contactErrors && !isEmpty(contactErrors.facebook) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {contactErrors.facebook}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group optional contact_instagram">
                          <label className="control-label optional" htmlFor="contact_instagram">
                            Instagram
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">@</span>
                            </div>
                            <CFormInput
                              className="form-control-cst"
                              type="text"
                              name="instagram"
                              id="contact_instagram"
                              value={contactData.instagram}
                              onChange={(e) => handleChangeForm(e)}
                            />
                            <CFormFeedback
                              invalid={
                                contactErrors && !isEmpty(contactErrors.instagram) ? true : false
                              }
                              className="fieldError-cst"
                            >
                              {contactErrors.instagram}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter className="cardCustom-footer">
                <div>
                  <CButton
                    color="success"
                    className="btn-default btn btn-success"
                    disabled={creatingContact ? true : false}
                    onClick={(e) => handleSubmitContact(e)}
                  >
                    {creatingContact ? (
                      'Processing...'
                    ) : (
                      <span>
                        Save <i className="fa fa-check" />
                      </span>
                    )}
                  </CButton>
                </div>
              </CCardFooter>
            </CForm>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default CreateContact
