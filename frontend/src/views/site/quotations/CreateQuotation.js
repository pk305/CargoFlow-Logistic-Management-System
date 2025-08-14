import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CCardFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormFeedback,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { fetchCompanies } from 'src/redux/slices/companySlice'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import classNames from 'classnames'
import Select from 'react-select'
import { isEmpty, isNull } from 'lodash'
import { clearQuoteError, createQuotation, showQuoteError } from 'src/redux/slices/quotationSlice'
import { Link, useHistory } from 'react-router-dom'
import { fetchUsers } from 'src/redux/slices/userSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { nanoid } from 'nanoid'
import $ from 'jquery'
import Noty from 'noty'

const CreateQuotation = () => {
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies' },
    { name: 'Contacts', pathname: '/contacts' },
    { name: 'Quotations', pathname: '/leads', active: true },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const [containerData] = useState([
    { name: '20 Dry', value: '20DC' },
    { name: '20 Flat Rack', value: '20FT' },
    { name: '20 Iso Tank', value: '20ISOTANK' },
    { name: '20 Open Top', value: '20OT' },
    { name: '20 Reefer', value: '20RF' },
    { name: '30 Sc', value: '30SC' },
    { name: '40 Cellular Palette', value: '40CELLPALET' },
    { name: '40 Dry', value: '40DC' },
    { name: '40 Flat Rack', value: '40FR' },
    { name: '40 High Cube Palette Wide', value: '40HIGHCUBEPALET' },
    { name: '40 High Cube Dry', value: '40HQ' },
    { name: '40 Open Top', value: '40OT' },
    { name: '40 Platform', value: '40PF' },
    { name: '40 Reefer', value: '40RF' },
    { name: '45 High Cube Dry', value: '45HQ' },
    { name: '45 Swap Body', value: '45SWAPBODY' },
    { name: 'Trailer', value: 'trailer' },
    { name: 'Truck', value: 'truck' },
    { name: 'Lorry', value: 'lorry' },
    { name: 'Van', value: 'van' },
    { name: 'Forklift', value: 'forklift' },
    { name: 'Bus', value: 'bus' },
    { name: 'Otomobile', value: 'car' },
    { name: 'Tanker', value: 'tanker' },
    { name: 'Tractor', value: 'tractor' },
    { name: 'Römork', value: 'romork' },
    { name: 'Crane', value: 'crane' },
    { name: 'Motorcycle', value: 'motorcycle' },
    { name: 'Container', value: 'container' },
    { name: 'Wagon', value: 'wagon' },
    { name: 'Swapbody', value: 'swapbody' },
    { name: 'Minivan', value: 'minivan' },
    { name: 'Frigo', value: 'frigo' },
    { name: 'Flatbed Trailer', value: 'flatbed' },
    { name: 'Tarpaulin Truck', value: 'tarpaulin_truck' },
    { name: "45'FT HCPW Box Container", value: 'box_container' },
    { name: 'Trailer Truck', value: 'trailer_truck' },
  ])
  const [leadVehicles, setLeadVehicles] = useState([
    {
      id: nanoid(10),
      vehicleType: '',
      vehicleUnit: '',
    },
  ])
  const [packageLine, setPackageLine] = useState([
    {
      id: nanoid(10),
      total: '',
      packCode: '',
      dimUnit: '',
      innerQuantity: '',
      brutwg: '',
      dimension1: '',
      dimension2: '',
      dimension3: '',
      volume: '',
    },
  ])
  const [fullContainer, setFullContainer] = useState('')
  const [quoteData, setQuoteData] = useState({
    contactId: '',
    companyId: '',
    leadOperation: '',
    dueDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    salerId: `${authUser && authUser.uuid}`,
    branchId: `${authUser && authUser.branch.id}`,
    serviceType: '',
    leadType: '',
    incoterm: '',
    vehicleType: '',
    leadClass: '',
    // leadOperation: '',
  })
  const [operationOption, setOperationOption] = useState('')
  // const [searchCollection, setSearchCollection] = useState(false)
  // const [searchDelivery, setSearchDelivery] = useState(false)
  const { fetchingCompanies, companies } = useSelector((state) => state.company)
  const { branches, fetchingBranches } = useSelector((state) => state.branch)
  const { creatingQuotation, quotationErrors } = useSelector((state) => state.quotation)
  const { users, fetchingUsers } = useSelector((state) => state.user)
  const [companyContacts, setCompanyContacts] = useState([])
  const [companyLinkId, setCompanyLinkId] = useState('')
  const { fetchingOperations, operations } = useSelector((state) => state.operation)
  const [expireDate, setExpireDate] = useState(new Date())

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setQuoteData({
      ...quoteData,
      [name]: value,
    })

    if (name === 'leadType') {
      setFullContainer(value)
    }
  }

  const handleDateTime = (c, date) => {
    setExpireDate(date)
    const e = {
      target: {
        name: c,
        value: !isNull(date) ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }
    handleChangeForm(e)
  }

  const handleChangeOperation = (e) => {
    handleChangeForm(e)

    const transMethod = $('#lead_lead_operation option:selected').attr('trans_method')
    if (transMethod) {
      if (transMethod === 'air') {
        setQuoteData({
          ...quoteData,
          leadType: 'lcl',
        })
        setFullContainer('lcl')
      }
      setOperationOption(transMethod)
    }
  }

  const handleSelectForm = (c, val) => {
    if (c === 'companyId') {
      if (val) {
        setCompanyContacts(val.value.contacts)
        setCompanyLinkId(val.value.linkId)
      }
      const e = { target: { name: c, value: !isNull(val) ? val.value.id : '' } }
      handleChangeForm(e)
    } else {
      const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
      handleChangeForm(e)
    }
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearQuoteError({ type: c, errorType: 'errQuote' }))
    if (c === 'companyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    } else if (c === 'salerId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    }
  }

  const handleSubmitQuote = async (e) => {
    e.preventDefault()
    const form = $('#new_lead')
    if (form.length > 0) {
      if (quoteData.companyId === '') {
        dispatch(showQuoteError({ type: 'companyId', errorType: 'errQuote' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    //form data
    let arrForm = Object.entries(quoteData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }
    const resData = await dispatch(createQuotation(formData)).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topCenter',
        id: 'nqwueu',
        text: 'Quotation has been created succesfully',
      }).show()
      history.push(`/leads/${resData.linkId}`)
    }
  }

  const closeCallout = (e) => {
    e.preventDefault()
    dispatch(clearBookingError({ type: 'msgCallout', errorType: 'calloutErr' }))
  }

  const handleAddVehicleCont = (e) => {
    e.preventDefault()
    let item = {
      id: nanoid(10),
      vehicleType: '',
      vehicleUnit: '',
    }
    setLeadVehicles([...leadVehicles, item])
  }

  const handleAddPackage = (e) => {
    e.preventDefault()
    let item = {
      id: nanoid(10),
      total: '',
      packCode: '',
      dimUnit: '',
      innerQuantity: '',
      brutwg: '',
      dimension1: '',
      dimension2: '',
      dimension3: '',
      volume: '',
    }
    setPackageLine([...packageLine, item])
  }

  useEffect(() => {
    document.title = 'Quotations'
  }, [])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer newBookings">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-user icon-24"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="card-label">New Quotation</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CForm id="new_lead" onSubmit={(e) => handleSubmitQuote(e)}>
              <CCardBody className="p-0">
                <div className="pageContainer-wrapper">
                  <div className="pageBoxSizing-container">
                    <div className="row mb-4">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <div className="form-group company  lead_company_id">
                          <label className="control-label" htmlFor="lead_company_id">
                            Client
                            {companyLinkId !== '' && (
                              <Link
                                to={`/companies/${companyLinkId}`}
                                target="_blank"
                                className="float-right profile-link"
                              >
                                Profile
                              </Link>
                            )}
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="lead_company_id"
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
                                        value: itm,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      quotationErrors && !isEmpty(quotationErrors.companyId),
                                  },
                                )}
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('companyId', e)}
                                onMenuOpen={(e) => handleSelectFocus('companyId')}
                              />
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.companyId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.companyId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                        <div className="form-group contact  lead_contact_id">
                          <label className="control-label contact " htmlFor="lead_contact_id">
                            Contact
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                classNamePrefix="cstSelect"
                                id="lead_contact_id"
                                isClearable
                                isSearchable
                                placeholder
                                name="contactId"
                                options={
                                  companyContacts && companyContacts.length > 0
                                    ? companyContacts.map((itm) => ({
                                        label: itm.name,
                                        value: itm.id,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      quotationErrors && !isEmpty(quotationErrors.contactId),
                                  },
                                )}
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('contactId', e)}
                                onMenuOpen={() => handleSelectFocus('contactId')}
                              />
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.contactId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.contactId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                        <div className="form-group select  lead_saler_id">
                          <label className="control-label select " htmlFor="lead_saler_id">
                            Sales Rep.
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="lead_saler_id"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingUsers ? true : false}
                                defaultValue={{
                                  label: `${authUser && authUser.name}`,
                                  value: `${authUser && authUser.uuid}`,
                                }}
                                isSearchable
                                name="salerId"
                                autoFocus={false}
                                options={
                                  users && !fetchingUsers && users.length > 0
                                    ? users.map((itm) => ({
                                        label: itm.name,
                                        value: itm,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      quotationErrors && !isEmpty(quotationErrors.salerId),
                                  },
                                )}
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('salerId', e)}
                                onMenuOpen={(e) => handleSelectFocus('salerId')}
                              />
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.salerId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.salerId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                        <div className="form-group select  lead_branch_id">
                          <label className="control-label select " htmlFor="lead_branch_id">
                            Branch
                          </label>
                          <div>
                            <div className="input-group">
                              <Select
                                id="lead_branch_id"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingBranches ? true : false}
                                defaultValue={{
                                  label: `${authUser && authUser.branch.name}`,
                                  value: `${authUser && authUser.branch.id}`,
                                }}
                                isSearchable
                                name="branchId"
                                autoFocus={false}
                                options={
                                  branches && !fetchingBranches && branches.length > 0
                                    ? branches.map((itm) => ({
                                        label: itm.name,
                                        value: itm,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid':
                                      quotationErrors && !isEmpty(quotationErrors.branchId),
                                  },
                                )}
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('branchId', e)}
                                onMenuOpen={(e) => handleSelectFocus('branchId')}
                              />
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.branchId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.branchId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group date_picker  lead_due_date">
                              <label className="control-label date_picker " htmlFor="lead_due_date">
                                Expiration Date
                              </label>
                              <DatePicker
                                id="lead_due_date"
                                selected={expireDate}
                                onChange={(date) => handleDateTime('dueDate', date)}
                                className="form-control form-control-cst"
                                style={{ paddingLeft: '2px', paddingRight: '2px' }}
                                dateFormat="Y-M-d"
                              />
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.senderId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.senderId}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group select">
                              <label className="control-label select " htmlFor="lead_lead_type">
                                FLC/LCL
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst select "
                                    name="leadType"
                                    id="lead_lead_type"
                                    invalid={
                                      quotationErrors && !isEmpty(quotationErrors.leadType)
                                        ? true
                                        : false
                                    }
                                    value={quoteData.leadType}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value=""></option>
                                    <option value="fcl">Full</option>
                                    <option value="lcl">Groupage</option>
                                  </CFormSelect>
                                  <CFormFeedback
                                    invalid={
                                      quotationErrors && !isEmpty(quotationErrors.leadType)
                                        ? true
                                        : false
                                    }
                                    className="fieldError-cst"
                                  >
                                    {quotationErrors.leadType}
                                  </CFormFeedback>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                        <span
                          id="company_financial_details"
                          className="label label-lg label-inline label-warning"
                        ></span>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                        <div className="form-group select  lead_lead_operation">
                          <label className="control-label select " htmlFor="lead_lead_operation">
                            Operation Type
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className={classNames('form-control-cst  operation-select', {
                                  'is-invalid':
                                    quotationErrors && !isEmpty(quotationErrors.operationId),
                                })}
                                name="leadOperation"
                                id="lead_lead_operation"
                                value={quoteData.leadOperation}
                                onChange={(e) => handleChangeOperation(e)}
                                onFocus={(e) => handleSelectFocus('leadOperation', e)}
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
                                ) : null}
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.leadOperation)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.leadOperation}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                        <div className="form-group select  lead_service_type">
                          <label className="control-label select " htmlFor="lead_service_type">
                            Service Type
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst select  service-type-select"
                                name="serviceType"
                                id="lead_service_type"
                                value={quoteData.serviceType}
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                                <option service_type="d2d" value="d2d">
                                  Door-To-Door
                                </option>
                                <option service_type="p2p" value="p2p">
                                  Port-To-Port
                                </option>
                                <option service_type="d2p" value="d2p">
                                  Door-To-Port
                                </option>
                                <option service_type="p2d" value="p2d">
                                  Port-To-Door
                                </option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.serviceType)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.serviceType}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                        <div className="form-group select  lead_incoterm">
                          <label className="control-label select " htmlFor="lead_incoterm">
                            Incoterm
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst select "
                                name="incoterm"
                                id="lead_incoterm"
                                value={quoteData.incoterm}
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                                <option value="CFR">CFR</option>
                                <option value="CIF">CIF</option>
                                <option value="CIP">CIP</option>
                                <option value="CPT">CPT</option>
                                <option value="DAP">DAP</option>
                                <option value="DPU">DPU</option>
                                <option value="DDP">DDP</option>
                                <option value="EXW">EXW</option>
                                <option value="FAS">FAS</option>
                                <option value="FCA">FCA</option>
                                <option value="FOB">FOB</option>
                                <option value="FOT">FOT</option>
                                <option value="FOR">FOR</option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.incoterm)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.incoterm}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3"></div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-3"></div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group text  lead_conditions">
                          <label className="control-label text " htmlFor="lead_conditions">
                            Commodity
                          </label>
                          <CFormTextarea
                            className="form-control-cst text "
                            rows="1"
                            placeholder="Add Information About Conditions..."
                            name="conditions"
                            id="lead_conditions"
                            value={quoteData.conditions}
                            onChange={(e) => handleChangeForm(e)}
                          ></CFormTextarea>
                          <CFormFeedback
                            invalid={
                              quotationErrors && !isEmpty(quotationErrors.conditions) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {quotationErrors.conditions}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group text  lead_notes">
                          <label className="control-label text " htmlFor="lead_notes">
                            Notes
                          </label>
                          <CFormTextarea
                            className="form-control-cst text "
                            rows="1"
                            placeholder="Quote Notes..."
                            name="notes"
                            id="lead_notes"
                            value={quoteData.notes}
                            onChange={(e) => handleChangeForm(e)}
                          ></CFormTextarea>
                          <CFormFeedback
                            invalid={
                              quotationErrors && !isEmpty(quotationErrors.notes) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {quotationErrors.notes}
                          </CFormFeedback>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                        <div className="form-group select  lead_leadtext_id">
                          <label className="control-label select " htmlFor="lead_leadtext_id">
                            Quotes Conditions
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst select "
                                name="leadtextId"
                                id="lead_leadtext_id"
                                value={quoteData.leadtextId}
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value=""></option>
                              </CFormSelect>
                              <CFormFeedback
                                invalid={
                                  quotationErrors && !isEmpty(quotationErrors.leadtextId)
                                    ? true
                                    : false
                                }
                                className="fieldError-cst"
                              >
                                {quotationErrors.leadtextId}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3"></div>
                    </div>
                    <div
                      className="row"
                      id="nonroad_place_details"
                      style={{
                        display: operationOption !== 'road' && operationOption !== '' ? '' : 'none',
                      }}
                    >
                      <div className="col-lg-3 col-xl-3"></div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group place  lead_origin_place_id">
                              <label
                                className="control-label place "
                                htmlFor="lead_origin_place_id"
                              >
                                Collection Point
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst chosen_input place_select"
                                    name="lead[origin_place_id]"
                                    id="lead_origin_place_id"
                                    data-select2-id="lead_origin_place_id"
                                    tabIndex="-1"
                                    value={quoteData.leadtextId}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="26"></option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group select  lead_origin_place_country_id">
                              <label
                                className="control-label select "
                                htmlFor="lead_origin_place_country_id"
                              >
                                Collection Country
                              </label>
                              <CFormSelect
                                className="form-control-cst select "
                                data-plugin="select2"
                                name="lead[origin_place_country_id]"
                                id="lead_origin_place_country_id"
                                data-select2-id="lead_origin_place_country_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="8"></option>
                                <option value="+3">+3-CIBUTI</option>
                                <option value="AA">AA-N/A</option>
                                <option value="ZM">ZM-ZAMBIA</option>
                                <option value="ZW">ZW-ZIMBABWE</option>
                                <option value="ZZ">ZZ-NAHÇIVAN</option>
                              </CFormSelect>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group place  lead_destination_place_id">
                              <label
                                className="control-label place "
                                htmlFor="lead_destination_place_id"
                              >
                                Delivery Point
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst chosen_input place_select"
                                    name="lead[destination_place_id]"
                                    id="lead_destination_place_id"
                                    data-select2-id="lead_destination_place_id"
                                    tabIndex="-1"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="28"></option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group select  lead_destination_place_country_id">
                              <label
                                className="control-label select "
                                htmlFor="lead_destination_place_country_id"
                              >
                                Delivery Country
                              </label>
                              <CFormSelect
                                className="form-control-cst select "
                                data-plugin="select2"
                                name="lead[destination_place_country_id]"
                                id="lead_destination_place_country_id"
                                data-select2-id="lead_destination_place_country_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="10"></option>
                                <option value="+3">+3-CIBUTI</option>
                                <option value="AA">AA-N/A</option>
                                <option value="AD">AD-ANDORRA</option>
                                <option value="AE">AE-UNITED ARAB EMIRATES</option>
                                <option value="AF">AF-AFGHANISTAN</option>
                                <option value="ZW">ZW-ZIMBABWE</option>
                                <option value="ZZ">ZZ-NAHÇIVAN</option>
                              </CFormSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row"
                      id="road_place_details"
                      style={{
                        display: operationOption !== 'road' ? 'none' : '',
                      }}
                    >
                      <div className="col-lg-2 col-xl-2">
                        {/* eslint-disable-next-line */}
                        <a
                          href="#"
                          data-href="#common-origin-div"
                          className="btn btn-link toggle_and_hide_button pl-0 hide"
                        >
                          Search collection addresses
                        </a>
                        <div
                          id="common-origin-div"
                          className="slidingDiv hide"
                          // style={{ display: !searchCollection ? 'none' : '' }}
                        >
                          <div className="form-group place  lead_common_origin_id">
                            <label className="control-label place " htmlFor="lead_common_origin_id">
                              Common origin
                            </label>
                            <div>
                              <div className="input-group">
                                <CFormSelect
                                  className="form-control-cst chosen_input place_select"
                                  name="lead[common_origin_id]"
                                  id="lead_common_origin_id"
                                  onChange={(e) => handleChangeForm(e)}
                                >
                                  <option value=""></option>
                                </CFormSelect>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-1 col-xl-1 justify-content-center align-self-center">
                        <div data-role="sender_locations" className="float-right"></div>
                      </div>
                      <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                        <div className="form-group string  lead_origin_address">
                          <label className="control-label string " htmlFor="lead_origin_address">
                            Collection Address
                          </label>
                          <CFormInput
                            className="form-control-cst string "
                            data-address-role="origin_address"
                            type="text"
                            name="lead[origin_address]"
                            id="lead_origin_address"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2">
                        <div className="form-group string  lead_origin_postcode">
                          <label className="control-label string " htmlFor="lead_origin_postcode">
                            Postcode
                          </label>
                          <CFormInput
                            className="form-control-cst string "
                            data-address-role="origin_postcode"
                            type="text"
                            name="lead[origin_postcode]"
                            id="lead_origin_postcode"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2">
                        <div className="form-group city  lead_origin_city_id">
                          <label className="control-label city " htmlFor="lead_origin_city_id">
                            Collection City
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst chosen_input city-select"
                                name="lead[origin_city_id]"
                                id="lead_origin_city_id"
                                data-select2-id="lead_origin_city_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="32"></option>
                              </CFormSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2">
                        <div className="form-group select  lead_origin_country_id">
                          <label className="control-label select " htmlFor="lead_origin_country_id">
                            Collection Country
                          </label>
                          <CFormSelect
                            className="form-control-cst select "
                            data-plugin="select2"
                            data-address-role="origin_country_id"
                            name="lead[origin_country_id]"
                            id="lead_origin_country_id"
                            data-select2-id="lead_origin_country_id"
                            tabIndex="-1"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="12"></option>
                            <option value="+3">+3-CIBUTI</option>
                            <option value="AA">AA-N/A</option>
                            <option value="AD">AD-ANDORRA</option>
                            <option value="AE">AE-UNITED ARAB EMIRATES</option>
                            <option value="AF">AF-AFGHANISTAN</option>
                            <option value="ZZ">ZZ-NAHÇIVAN</option>
                          </CFormSelect>
                        </div>
                      </div>
                      <div className="col-lg-2 col-xl-2">
                        {/* eslint-disable-next-line */}
                        <a
                          href="#"
                          data-href="#common-destination-div"
                          className="btn btn-link toggle_and_hide_button pl-0 hide"
                        >
                          Search delivery addresses
                        </a>
                        <div
                          id="common-destination-div"
                          className="slidingDiv"
                          style={{ display: 'none' }}
                        >
                          <div className="form-group place  lead_common_destination_id">
                            <label
                              className="control-label place "
                              htmlFor="lead_common_destination_id"
                            >
                              Common destination
                            </label>
                            <div>
                              <div className="input-group">
                                <CFormSelect
                                  className="form-control-cst chosen_input place_select"
                                  name="lead[common_destination_id]"
                                  id="lead_common_destination_id"
                                  data-select2-id="lead_common_destination_id"
                                  tabIndex="-1"
                                  onChange={(e) => handleChangeForm(e)}
                                >
                                  <option value="" data-select2-id="34"></option>
                                </CFormSelect>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-1 col-xl-1 justify-content-center align-self-center">
                        <div data-role="consignee_locations" className="float-right"></div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                        <div className="form-group string  lead_destination_address">
                          <label
                            className="control-label string "
                            htmlFor="lead_destination_address"
                          >
                            Delivery Address
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormInput
                                className="form-control-cst string "
                                data-address-role="destination_address"
                                type="text"
                                name="lead[destination_address]"
                                id="lead_destination_address"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2">
                        <div className="form-group string  lead_destination_postcode">
                          <label
                            className="control-label string "
                            htmlFor="lead_destination_postcode"
                          >
                            Postcode
                          </label>
                          <CFormInput
                            className="form-control-cst string "
                            data-address-role="destination_postcode"
                            type="text"
                            name="lead[destination_postcode]"
                            id="lead_destination_postcode"
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2">
                        <div className="form-group city  lead_destination_city_id">
                          <label className="control-label city " htmlFor="lead_destination_city_id">
                            Delivery City
                          </label>
                          <div>
                            <div className="input-group">
                              <CFormSelect
                                className="form-control-cst chosen_input city-select"
                                name="lead[destination_city_id]"
                                id="lead_destination_city_id"
                                data-select2-id="lead_destination_city_id"
                                tabIndex="-1"
                                onChange={(e) => handleChangeForm(e)}
                              >
                                <option value="" data-select2-id="36"></option>
                              </CFormSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-2">
                        <div className="form-group select  lead_destination_country_id">
                          <label
                            className="control-label select "
                            htmlFor="lead_destination_country_id"
                          >
                            Delivery Country
                          </label>
                          <CFormSelect
                            className="form-control-cst select "
                            data-plugin="select2"
                            data-address-role="destination_country_id"
                            name="lead[destination_country_id]"
                            id="lead_destination_country_id"
                            onChange={(e) => handleChangeForm(e)}
                          >
                            <option value="" data-select2-id="14"></option>
                            <option value="+3">+3-CIBUTI</option>
                            <option value="YT">YT-MAYOTTE</option>
                            <option value="ZA">ZA-SOUTH AFRICA</option>
                            <option value="ZM">ZM-ZAMBIA</option>
                            <option value="ZW">ZW-ZIMBABWE</option>
                            <option value="ZZ">ZZ-NAHÇIVAN</option>
                          </CFormSelect>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row"
                      id="lead_vehicles_fields"
                      style={{ display: fullContainer === 'fcl' ? '' : 'none' }}
                    >
                      <div className="col-12">
                        <div className="separator"></div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Container/Vehicle Type</th>
                              <th>Number of Units</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leadVehicles.length > 0 &&
                              leadVehicles.map((item) => (
                                <tr key={item.id}>
                                  <td>
                                    <div className="input-group">
                                      <Select
                                        id="lead_lead_vehicles_attributes_0_vehicle_type"
                                        classNamePrefix="cstSelect"
                                        isClearable={true}
                                        placeholder
                                        isSearchable
                                        name="vehicleType"
                                        autoFocus={false}
                                        options={
                                          containerData &&
                                          !fetchingBranches &&
                                          containerData.length > 0
                                            ? containerData.map((itm) => ({
                                                label: itm.name,
                                                value: itm.value,
                                              }))
                                            : []
                                        }
                                        className={classNames(
                                          'form-control form-control-cst pageCstSelect ',
                                          {
                                            'is-invalid':
                                              quotationErrors &&
                                              !isEmpty(quotationErrors.vehicleType),
                                          },
                                        )}
                                        noOptionsMessage={() => 'No results found'}
                                        onChange={(e) => handleSelectForm('vehicleType', e)}
                                        onMenuOpen={(e) => handleSelectFocus('vehicleType')}
                                      />
                                      <CFormFeedback
                                        invalid={
                                          quotationErrors && !isEmpty(quotationErrors.vehicleType)
                                            ? true
                                            : false
                                        }
                                        className="fieldError-cst"
                                      >
                                        {quotationErrors.vehicleType}
                                      </CFormFeedback>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="form-group">
                                      <CFormInput
                                        className="form-control-cst"
                                        type="number"
                                        step="1"
                                        value="0"
                                        name="lead[lead_vehicles_attributes][0][vehicle_unit]"
                                        id="lead_lead_vehicles_attributes_0_vehicle_unit"
                                        onChange={(e) => handleChangeForm(e)}
                                      />
                                    </div>
                                  </td>
                                  <td className="recover-doc-line hide">
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid   */}
                                    <a className="btn btn-icon btn-sm btn-secondary mb-3" href="#">
                                      <i className="fa fa-undo recover-doc-link"></i>
                                    </a>
                                  </td>
                                  <td>
                                    {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid   */}
                                    {/* <a className="btn btn-outline-danger btn-icon btn-sm mb-3" href="#">
                                  <i className="fa fa-times remove-doc-link"></i>
                                </a> */}
                                    <button
                                      className="btn btn-close remove-doc-link"
                                      aria-label="Close"
                                      style={{ verticalAlign: '-6px' }}
                                      // onClick={(e) => handleRemoveItem(e, `container-field-${item.id}`)}
                                    ></button>
                                  </td>
                                </tr>
                              ))}
                            <tr className="new_record_button">
                              <td colSpan="4">
                                <span className="pull-left">
                                  {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                  <a
                                    href="#"
                                    className="btn btn-primary add_nested_fields_btn"
                                    onClick={(e) => handleAddVehicleCont(e)}
                                  >
                                    <i className="fa fa-plus mr-2"></i>Add Container/Vehicle Line
                                  </a>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-12">
                        <div className="separator"></div>
                      </div>
                    </div>
                    <div
                      id="lead_package_fields"
                      style={{ display: fullContainer === 'lcl' ? '' : 'none' }}
                    >
                      <div className="row" id="pack_details">
                        <div className="col-12">
                          <div className="separator"></div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                          <div className="row">
                            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              Package Quantity
                            </div>
                            <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              Package Type
                            </div>
                          </div>
                        </div>
                        <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2">Stackable</div>
                        <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1">Pieces</div>
                        <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1">Gross Wg.</div>
                        <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                          <div className="row">
                            <div className="col-6 col-sm-6 col-md-9 col-lg-9 col-xl-9">
                              Dimensions (Ln/Wd/Hg (cm))
                            </div>
                            <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">Volume</div>
                          </div>
                        </div>

                        {packageLine.length > 0 &&
                          packageLine.map((item) => (
                            <div
                              className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                              key={item.id}
                            >
                              <div className="row package-field package-line">
                                <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                                  <div className="row">
                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <div className="form-group integer required lead_packages_total">
                                        <CFormInput
                                          className="form-control-cst numeric integer required change-total pack-total text-right"
                                          type="number"
                                          step="1"
                                          value="0"
                                          name="lead[packages_attributes][0][total]"
                                          id="lead_packages_attributes_0_total"
                                          onChange={(e) => handleChangeForm(e)}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                      <div className="form-group lead_packages_pack_code">
                                        <div>
                                          <div className="input-group">
                                            <CFormSelect
                                              className="form-control-cst package-type-code"
                                              data-plugin="select2"
                                              name="lead[packages_attributes][0][pack_code]"
                                              id="lead_packages_attributes_0_pack_code"
                                              onChange={(e) => handleChangeForm(e)}
                                            >
                                              <option value=""></option>
                                              <option value="AE">AE-AEROSOL</option>

                                              <option value="PL">PL-Pail</option>
                                              <option value="PX">PX-Pallet</option>
                                              <option value="RO">RO-Roll</option>
                                              <option value="SA">SA-Sack</option>
                                            </CFormSelect>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                  <div className="form-group select  lead_packages_dim_unit">
                                    <CFormSelect
                                      className="form-control-cst select  change-total pack-stackable"
                                      name="lead[packages_attributes][0][dim_unit]"
                                      id="lead_packages_attributes_0_dim_unit"
                                      onChange={(e) => handleChangeForm(e)}
                                    >
                                      <option value=""></option>
                                      <option value="not_stackable">Non-Stackable</option>
                                      <option value="stackable">Stackable</option>
                                      <option value="stackable2">2 Tier Stackable</option>
                                      <option value="stackable3">3 Tier Stackable</option>
                                      <option value="stackable4">4 Tier Stackable</option>
                                      <option value="stackable5">5 Tier Stackable</option>
                                      <option value="stackable6">6 Tier Stackable</option>
                                      <option value="stackable7">7 Tier Stackable</option>
                                      <option value="stackable8">8 Tier Stackable</option>
                                      <option value="stackable9">9 Tier Stackable</option>
                                      <option value="stackable10">10+ Tier Stackable</option>
                                      <option value="top_stackable">Top-Stackable</option>
                                    </CFormSelect>
                                  </div>
                                </div>
                                <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1">
                                  <div className="form-group decimal  lead_packages_inner_quantity">
                                    <CFormInput
                                      className="form-control-cst numeric decimal  text-right"
                                      type="number"
                                      step="any"
                                      name="lead[packages_attributes][0][inner_quantity]"
                                      id="lead_packages_attributes_0_inner_quantity"
                                      onChange={(e) => handleChangeForm(e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1 p-1">
                                  <div className="form-group float  lead_packages_brutwg">
                                    <CFormInput
                                      className="form-control-cst numeric float  change-total pack-brutwg text-right"
                                      type="number"
                                      step="any"
                                      value="0.0"
                                      name="lead[packages_attributes][0][brutwg]"
                                      id="lead_packages_attributes_0_brutwg"
                                      onChange={(e) => handleChangeForm(e)}
                                    />
                                  </div>
                                </div>
                                <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                                  <div className="row">
                                    <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                      <div className="form-group integer  lead_packages_dimension1">
                                        <CFormInput
                                          className="form-control-cst numeric integer  change-total pack-dimension1 text-right"
                                          type="number"
                                          step="1"
                                          name="lead[packages_attributes][0][dimension1]"
                                          id="lead_packages_attributes_0_dimension1"
                                          onChange={(e) => handleChangeForm(e)}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                      <div className="form-group integer  lead_packages_dimension2">
                                        <CFormInput
                                          className="form-control-cst numeric integer  change-total pack-dimension2 text-right"
                                          type="number"
                                          step="1"
                                          name="lead[packages_attributes][0][dimension2]"
                                          id="lead_packages_attributes_0_dimension2"
                                          onChange={(e) => handleChangeForm(e)}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                      <div className="form-group integer  lead_packages_dimension3">
                                        <CFormInput
                                          className="form-control-cst numeric integer  change-total pack-dimension3 text-right"
                                          type="number"
                                          step="1"
                                          name="lead[packages_attributes][0][dimension3]"
                                          id="lead_packages_attributes_0_dimension3"
                                          onChange={(e) => handleChangeForm(e)}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                      <div className="form-group float  lead_packages_volume">
                                        <CFormInput
                                          className="form-control-cst numeric float  pack-volume change-total"
                                          type="number"
                                          step="any"
                                          value="0.0"
                                          name="lead[packages_attributes][0][volume]"
                                          id="lead_packages_attributes_0_volume"
                                          onChange={(e) => handleChangeForm(e)}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-group hidelead_packages_dimension_unit">
                                      <CFormInput
                                        className="form-control-cst hidden"
                                        value="cm"
                                        type="hidden"
                                        name="lead[packages_attributes][0][dimension_unit]"
                                        id="lead_packages_attributes_0_dimension_unit"
                                        onChange={(e) => handleChangeForm(e)}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1">
                                  <button
                                    className="btn btn-close"
                                    aria-label="Close"
                                    style={{ verticalAlign: '-6px' }}
                                    onClick={(e) => closeCallout(e)}
                                  ></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                          <div className="new_record_button">
                            <CButton size="sm" color="primary" onClick={(e) => handleAddPackage(e)}>
                              Add Package Line
                            </CButton>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="separator"></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row mt-4"
                      id="lcl_fields"
                      style={{ display: fullContainer === 'lcl' ? '' : 'none' }}
                    >
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group float  lead_total_weight">
                              <label className="control-label float " htmlFor="lead_total_weight">
                                Weight
                              </label>
                              <CFormInput
                                className="form-control-cst numeric float  text-right total-brut-weight"
                                type="number"
                                step="any"
                                value="0.0"
                                name="lead[total_weight]"
                                id="lead_total_weight"
                                onChange={(e) => handleChangeForm(e)}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group float  lead_total_volume">
                              <label className="control-label float " htmlFor="lead_total_volume">
                                Total Volume
                              </label>
                              <CFormInput
                                className="form-control-cst numeric float  text-right total-volume"
                                type="number"
                                step="any"
                                value="0.0"
                                name="lead[total_volume]"
                                id="lead_total_volume"
                                onChange={(e) => handleChangeForm(e)}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group float  lead_ladameter">
                              <label className="control-label float " htmlFor="lead_ladameter">
                                Loading Meters
                              </label>
                              <CFormInput
                                className="form-control-cst numeric float  text-right total-ladameter"
                                type="number"
                                step="any"
                                value="0.0"
                                name="lead[ladameter]"
                                id="lead_ladameter"
                                onChange={(e) => handleChangeForm(e)}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group float  lead_chargeable_weight">
                              <label
                                className="control-label float "
                                htmlFor="lead_chargeable_weight"
                              >
                                Volumetric Weight
                              </label>
                              <CFormInput
                                className="form-control-cst numeric float  text-right total-chargable-weight"
                                type="number"
                                step="any"
                                value="0.0"
                                name="lead[chargeable_weight]"
                                id="lead_chargeable_weight"
                                onChange={(e) => handleChangeForm(e)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                            <div className="form-group select  lead_lead_class">
                              <label className="control-label select " htmlFor="lead_lead_class">
                                Cargo Type
                              </label>
                              <div>
                                <div className="input-group">
                                  <CFormSelect
                                    className="form-control-cst select  lead-className-select"
                                    name="leadClass"
                                    id="lead_lead_class"
                                    value={quoteData.leadClass}
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option lead_class="standard" value="standard">
                                      Dry Cargo (Freight all kinds)
                                    </option>
                                    <option lead_class="adr" value="adr">
                                      Dangerous Cargo
                                    </option>
                                    <option lead_class="perishable" value="perishable">
                                      Perishable Cargo
                                    </option>
                                    <option lead_class="pharma" value="pharma">
                                      Pharmaceuticals
                                    </option>
                                  </CFormSelect>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="adr"
                            className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6"
                            style={{ display: quoteData.leadClass !== 'adr' ? 'none' : '' }}
                          >
                            <div className="row">
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <div className="form-group select  lead_imo_class">
                                  <label className="control-label select " htmlFor="lead_imo_class">
                                    IMO Class
                                  </label>
                                  <CFormSelect
                                    className="form-control-cst select "
                                    data-plugin="select2"
                                    name="lead[imo_class]"
                                    id="lead_imo_class"
                                    onChange={(e) => handleChangeForm(e)}
                                  >
                                    <option value="" data-select2-id="20"></option>
                                    <option value="1.1">
                                      (1.1) Substances and articles which have a mass explosion
                                      hazard
                                    </option>
                                    <option value="1.2">
                                      (1.2) Substances and articles which have a projection hazard
                                      but not a mass explosion hazard
                                    </option>
                                    <option value="1.3">
                                      (1.3) Substances and articles which have a fire hazard and
                                      either a minor blast hazard or a minor projection hazard or
                                      both, but not a mass explosion hazard
                                    </option>
                                    <option value="1.4">
                                      (1.4) Substances and articles which present no significant
                                      hazard
                                    </option>
                                    <option value="1.6">
                                      (1.6) Extremely insensitive articles which do not have a mass
                                      explosion hazard
                                    </option>
                                    <option value="2.1">(2.1) Flammable gases</option>
                                    <option value="2.2">
                                      (2.2) Non-flammable, non-toxic gases
                                    </option>
                                    <option value="2.3">(2.3) Toxic gases</option>
                                    <option value="3">(3) Flammable liquids</option>
                                    <option value="4.1">
                                      (4.1) Flammable solids, self-reactive substances and solid
                                      desensitized explosives
                                    </option>
                                    <option value="4.2">
                                      (4.2) Substances liable to spontaneous combustion
                                    </option>
                                    <option value="4.3">
                                      (4.3) Substances which, in contact with water, emit flammable
                                      gases
                                    </option>
                                    <option value="5.1">(5.1) Oxidizing substances</option>
                                    <option value="5.2">(5.2) Organic peroxides</option>
                                    <option value="6.1">(6.1) Toxic substances</option>
                                    <option value="7">(7) Radioactive material</option>
                                    <option value="8">(8) Corrosive substances</option>
                                    <option value="9">
                                      (9) Miscellaneous dangerous substances and articles
                                    </option>
                                  </CFormSelect>
                                </div>
                              </div>
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <div className="form-group string  lead_imo_no">
                                  <label className="control-label string " htmlFor="lead_imo_no">
                                    IMO No
                                  </label>
                                  <CFormInput
                                    className="form-control-cst string "
                                    type="text"
                                    name="lead[imo_no]"
                                    id="lead_imo_no"
                                    onChange={(e) => handleChangeForm(e)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id="perishable"
                            className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                            style={{ display: quoteData.leadClass !== 'standard' ? '' : 'none' }}
                          >
                            <div className="form-group string  lead_temperature">
                              <label className="control-label string " htmlFor="lead_temperature">
                                Temperature
                              </label>
                              <CFormInput
                                className="form-control-cst string  text-right"
                                type="text"
                                name="lead[temperature]"
                                id="lead_temperature"
                                onChange={(e) => handleChangeForm(e)}
                              />
                            </div>
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
                    type="submit"
                    color="success"
                    className="btn-default btn btn-success"
                    disabled={creatingQuotation ? true : false}
                  >
                    {creatingQuotation ? (
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

export default CreateQuotation
