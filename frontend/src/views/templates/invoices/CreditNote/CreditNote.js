import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import countryList from 'react-select-country-list'
import { isEmpty, isNull } from 'lodash'
import moment from 'moment'
import { useLocation, useHistory } from 'react-router-dom'
import { createTempdoc } from 'src/redux/slices/tempdocSlice'
import $ from 'jquery'
import ChargeTableRow from './ChargeTableRow'
import { formatMoney } from 'src/config/helpers'
import { fetchCompanyLogoDataUrl } from 'src/redux/slices/systemSlice'

const CreditNote = ({ invoiceData }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const [tempdocData, setTempdocData] = useState({
    templateId: '',
    invoiceId: '',
    imgLogoUrl: '',
    companyTitle: `${
      authUser && authUser.company && authUser.company.name ? authUser.company.name : ''
    }`,
    companyTitle2: `${
      authUser && authUser.company && authUser.company.name ? authUser.company.name : ''
    }`,
    companyAddress: `${
      authUser && authUser.company && authUser.company.address
        ? authUser.company.address + ' / ' + countryList().getLabel(authUser.company.countryId)
        : ''
    }`,
    companyAddress2: `${
      authUser && authUser.company && authUser.company.address
        ? authUser.company.address + ' / ' + countryList().getLabel(authUser.company.countryId)
        : ''
    }`,
    companyTel: `${authUser.company.phone ? authUser.company.phone : ''}`,
    companyTel2: `${authUser.company.phone ? authUser.company.phone : ''}`,
    companyEmail: `${authUser.company.email ? authUser.company.email : ''}`,
    companyEmail2: `${authUser.company.email ? authUser.company.email : ''}`,
    companyVat: `VAT: ${authUser.company.taxno ? authUser.company.taxno : ''}`,
    companyVat2: `VAT: ${authUser.company.taxno ? authUser.company.taxno : ''}`,
    mainTitle: 'CREDIT NOTE',
    mainTitle2: 'CREDIT NOTE',
    customerHeader: 'CUSTOMER',
    customerHeader2: 'CUSTOMER',
    customer: '',
    customer2: '',
    dateHeader: 'DATE',
    dateHeader2: 'DATE',
    date: '',
    date2: '',
    refNoHeader: 'REF. NO',
    refNoHeader2: 'REF. NO',
    refNo: '',
    refNo2: '',
    invoiceNoHeader: 'INVOICE NO',
    invoiceNoHeader2: 'INVOICE NO',
    invoiceNo: '',
    invoiceNo2: '',
    customerRefHeader: 'CUSTOMER REF',
    customerRefHeader2: 'CUSTOMER REF',
    customerRef: '',
    customerRef2: '',
    shipperHeader: 'SHIPPER',
    shipperHeader2: 'SHIPPER',
    shipper: `<div></div>\n<div>VAT: </div>`,
    shipper2: `<div></div>\n<div>VAT: </div>`,
    importerHeader: 'IMPORTER',
    importerHeader2: 'IMPORTER',
    importer: '',
    importer2: `\n\n VAT: \n`,
    shipperHeaderVat: 'VAT: ',
    shipperHeaderVat2: 'VAT: ',
    importerHeaderVat: 'VAT: ',
    importerHeaderVat2: 'VAT: ',
    collectionAddressHeader: 'COLLECTION ADDRESS',
    collectionAddressHeader2: 'COLLECTION ADDRESS',
    collectionAddress: '',
    collectionAddress2: '',
    collectionDateHeader: 'Collection Date',
    collectionDateHeader2: 'Collection Date',
    collectionDate: '',
    collectionDate2: '',
    deliveryAddressHeader: 'DELIVERY ADDRESS',
    deliveryAddressHeader2: 'DELIVERY ADDRESS',
    deliveryAddress: '',
    deliveryAddress2: '',
    deliveryDateHeader: 'Delivery Date',
    deliveryDateHeader2: 'Delivery Date',
    deliveryDate: '',
    deliveryDate2: '',
    noOfPackageTypeHeader: 'No of Package / Type',
    noOfPackageTypeHeader2: 'No of Package / Type',
    noOfPackageType: '',
    noOfPackageType2: '',
    chargeableWeightHeader: 'Chargeable Weight',
    chargeableWeightHeader2: 'Chargeable Weight',
    chargeableWeight: '',
    chargeableWeight2: '',
    grossWeightHeader: 'Gross Weight',
    grossWeightHeader2: 'Gross Weight',
    grossWeight: '',
    grossWeight2: '',
    volumeHeader: 'Volume',
    volumeHeader2: 'Volume',
    volume: '',
    volume2: '',
    commodityHeader: 'Commodity',
    commodityHeader2: 'Commodity',
    commodity: '',
    commodity2: '',
    chargesHeader: 'CHARGES',
    chargesHeader2: 'CHARGES',
    charges: [],
    charges2: [],
    addInfoHeader: 'ADD. İNFO',
    addInfoHeader2: 'ADD. İNFO',
    vatHeader: 'VAT',
    vatHeader2: 'VAT',
    vat: '',
    vat2: '',
    vatTotal: '',
    vatTotal2: '',
    amountHeader: 'Amount',
    amountHeader2: 'Amount',
    amount: '',
    amount2: '',
    amountTotal: '',
    amountTotal2: '',
    totalHeader: 'TOTAL',
    totalHeader2: 'TOTAL',
    total: '0.00',
    total2: '0.00',
    paymentTerms: '',
    paymentTerms2: '',
    invoiceDueDate: '',
    invoiceDueDate2: '',
    ibanNo: '',
    ibanNo2: '',
    beneficiary: '',
    beneficiary2: '',
    bic: '',
    bic2: '',
    bankDetails: '',
    bankDetails2: '',
  })
  const { creatingTempdoc } = useSelector((state) => state.tempdoc)

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  useEffect(() => {
    async function fetchLogo() {
      const resData = await dispatch(fetchCompanyLogoDataUrl()).unwrap()
      if (resData) {
        setTempdocData((state) => ({
          ...state,
          imgLogoUrl: resData.logoUrl ? resData.logoUrl : null,
        }))
      }
    }
    fetchLogo()
  }, [dispatch])

  const handleChangeTemp = (e) => {
    const name = e.currentTarget.getAttribute('data-name')
    const value = e.currentTarget.textContent
    setTempdocData({
      ...tempdocData,
      [name]: value,
    })
  }

  const addTempDoc = async (e) => {
    e.preventDefault()
    //form data
    const formData = new FormData()
    formData.append('tempCode', tempdocData.templateId)
    formData.append('tempdocData', JSON.stringify(tempdocData))
    formData.append('invoiceId', tempdocData.invoiceId)
    formData.append('tempHtml', JSON.stringify($('#templatediv').clone().html()))

    const resData = await dispatch(createTempdoc(formData)).unwrap()
    if (resData) {
      history.push(`/tempdocs/${resData.name}`)
    }
  }

  let query = useQuery()

  const handleSetTempDoc = useCallback(() => {
    if (invoiceData) {
      const inv = invoiceData
      // console.log(inv.invoicedCompany)
      setTempdocData((state) => ({
        ...state,
        invoiceId: inv.id,
        invoiceNo: inv.invoiceName,
        invoiceNo2: inv.invoiceName,
        date: inv.invoiceDate ? moment(inv.invoiceDate).format('L') : null,
        date2: inv.invoiceDate ? moment(inv.invoiceDate).format('L') : null,
        refNo: inv.refNo,
        refNo2: inv.refNo,
        customer: `${inv.invoicedCompany.name}<div style="">${
          inv.invoicedCompany.address ? inv.invoicedCompany.address : ''
        }</div><div style="">${inv.invoicedCity ? inv.invoicedCity.name : ''} / ${
          inv.invoicedCompany.countryId ? countryList().getLabel(inv.invoicedCompany.countryId) : ''
        }</div><div style="">VAT: ${
          inv.invoicedCompany.taxno ? inv.invoicedCompany.taxno : ''
        }<br></div>`,
        customer2: `${inv.invoicedCompany.name}<div style="">${
          inv.invoicedCompany.address ? inv.invoicedCompany.address : ''
        }</div><div style="">${inv.invoicedCity ? inv.invoicedCity.name : ''} / ${
          inv.invoicedCompany.countryId ? countryList().getLabel(inv.invoicedCompany.countryId) : ''
        }</div><div style="">VAT: ${
          inv.invoicedCompany.taxno ? inv.invoicedCompany.taxno : ''
        }<br></div>`,
        charges: inv.invoicedCharges.length > 0 ? inv.invoicedCharges : [],
        charges2: inv.invoicedCharges.length > 0 ? inv.invoicedCharges : [],
        total: `${formatMoney(inv.netTotal)} ${inv.invoiceCurr ? inv.invoiceCurr.name : ''}`,
        total2: `${formatMoney(inv.netTotal)} ${inv.invoiceCurr ? inv.invoiceCurr.name : ''}`,
        invoiceDueDate: inv.dueDate ? moment(inv.dueDate).format('L') : null,
        invoiceDueDate2: inv.dueDate ? moment(inv.dueDate).format('L') : null,
      }))
    }

    if (query.get('template_id')) {
      setTempdocData((state) => ({
        ...state,
        templateId: query.get('template_id'),
      }))
    }
  }, [invoiceData, query])

  useEffect(() => {
    handleSetTempDoc()
    //
  }, [handleSetTempDoc])

  if (!invoiceData && isNull(authUser)) return null

  return (
    <div className="containerPreview">
      <div className="hidden-print preview_button">
        <div className="form-actions">
          <form id="newtempdocs" onSubmit={(e) => addTempDoc(e)}>
            <CButton
              type="submit"
              color="primary"
              id="template_submit_button"
              disabled={creatingTempdoc ? true : false}
            >
              Save
            </CButton>
          </form>
        </div>
      </div>
      <div id="templatediv" style={{ backgroundColor: '#FFFFFF !important' }}>
        <div id="doc_div" style={{ height: '1110px', width: '794px' }}>
          <div
            id="print_me"
            style={{ padding: '5mm 10mm 0mm', position: 'absolute', left: '0px', top: '0px' }}
          >
            <table cellSpacing="0" cellPadding="0" align="center">
              <tbody>
                <tr>
                  <td style={{ width: '100%' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '100%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '10px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            ></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: '3mm', width: '100%' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '60mm',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '20mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            >
                              {!isEmpty(tempdocData.imgLogoUrl) ? (
                                <img
                                  src={tempdocData.imgLogoUrl}
                                  height={80}
                                  style={{
                                    maxWidth: '300px',
                                    objectFit: 'contain',
                                    verticalAlign: 'middle',
                                  }}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src=""
                                  height={80}
                                  style={{
                                    maxWidth: '300px',
                                    objectFit: 'contain',
                                    verticalAlign: 'middle',
                                  }}
                                  alt=""
                                />
                              )}
                            </div>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '140mm',
                              backgroundColor: 'transparent',
                              paddingTop: '3mm',
                            }}
                          >
                            <table width="100%" cellSpacing="0" cellPadding="0">
                              <tbody>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '14px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'bold',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyTitle"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyTitle2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyAddress"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyAddress2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyTel"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyTel2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyEmail"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyEmail2}
                                    </span>
                                  </td>
                                </tr>
                                <tr className="">
                                  <td
                                    className="line-td show_on_doc_div"
                                    style={{
                                      verticalAlign: 'top',
                                      wordBreak: 'normal',
                                      width: '100%',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '100%',
                                        padding: '0mm',
                                        fontSize: '12px',
                                        textAlign: 'right',
                                        color: 'rgb(51, 51, 51)',
                                        fontWeight: 'normal',
                                        fontStyle: 'normal',
                                        textDecoration: 'none',
                                      }}
                                      data-name="companyVat"
                                      onInput={(e) => handleChangeTemp(e)}
                                      contentEditable="true"
                                      suppressContentEditableWarning={true}
                                    >
                                      {tempdocData.companyVat2}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%', paddingBottom: '2mm' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '100%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '16px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="mainTitle"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.mainTitle2}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%', paddingBottom: '5mm' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '50%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="customerHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.customerHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '16,6666666667%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="dateHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.dateHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '16,6666666667%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="refNoHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.refNoHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              width: '16,6666666667%',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="invoiceNoHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.invoiceNoHeader2}
                            </span>
                          </td>
                        </tr>

                        <tr className="">
                          <td
                            rowSpan="3"
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="customer"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              spellCheck="false"
                              dangerouslySetInnerHTML={{ __html: tempdocData.customer2 }}
                            ></span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="date"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.date2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="refNo"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.refNo2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="invoiceNo"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.invoiceNo2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                              height: '5mm',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="customerRefHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.customerRefHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '14mm',
                              }}
                              data-name="customerRef"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.customerRef2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="shipperHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.shipperHeader2}
                            </span>
                          </td>
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="importerHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.importerHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '20mm',
                              }}
                              data-name="shipper"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              dangerouslySetInnerHTML={{ __html: tempdocData.shipper2 }}
                            ></span>
                          </td>
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '20mm',
                              }}
                              data-name="importer"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                              dangerouslySetInnerHTML={{ __html: tempdocData.importer2 }}
                            ></span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="5"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="collectionAddressHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.collectionAddressHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="collectionDateHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.collectionDateHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="5"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '10mm',
                              }}
                              data-name="collectionAddress"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.collectionAddress2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '10mm',
                              }}
                              data-name="collectionDate"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.collectionDate2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="5"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="deliveryAddressHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.deliveryAddressHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="deliveryDateHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.deliveryDateHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="5"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '10mm',
                              }}
                              data-name="deliveryAddress"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.deliveryAddress2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                                minHeight: '10mm',
                              }}
                              data-name="deliveryDate"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.deliveryDate2}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="noOfPackageTypeHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.noOfPackageTypeHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="chargeableWeightHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.chargeableWeightHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="grossWeightHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.grossWeightHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="volumeHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.volumeHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="commodityHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.commodityHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="noOfPackageType"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.noOfPackageType2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="chargeableWeight"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.chargeableWeight2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="grossWeight"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.grossWeight2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="volume"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.volume2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              borderTop: '0px',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="commodity"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.commodity2}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="6" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="chargesHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.chargesHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="addInfoHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.addInfoHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="vatHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.vatHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="amountHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.amountHeader2}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="6"></td>
                        </tr>
                        {/* charges */}
                        {tempdocData.charges.length > 0
                          ? tempdocData.charges.map((item, idx) => (
                              <ChargeTableRow
                                key={idx}
                                itemName={item.name}
                                unitNumber={item.unitNumber}
                                vatAmount={item.vatAmount}
                                amountWithoutVat={item.amountWithoutVat}
                                currency={item.currency}
                                addInfo={item.addInfo}
                                handleChangeTemp={handleChangeTemp}
                              />
                            ))
                          : null}
                        {/*  */}
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              borderTop: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              borderTop: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'center',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="totalHeader"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.totalHeader2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="vatTotal"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.vatTotal2}
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              border: '1px solid black',
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '1mm',
                                fontSize: '12px',
                                textAlign: 'right',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="total"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              {tempdocData.total2}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: '100%' }}>
                    <table width="100%" cellSpacing="0" cellPadding="0">
                      <tbody>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '50%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="paymentTerms"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Payment Terms:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.paymentTerms2}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              width: '50%',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="invoiceDueDate"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Invoice Due Date:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.invoiceDueDate2}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr>
                          <td></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="ibanNo"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              EUR/USD IBAN No:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.ibanNo2}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bic"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              BIC:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bic2}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="2"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="beneficiary"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Beneficiary:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.beneficiary2}
                              </span>
                            </span>
                          </td>
                          <td
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                height: '5mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'bold',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                              data-name="bankDetails"
                              onInput={(e) => handleChangeTemp(e)}
                              contentEditable="true"
                              suppressContentEditableWarning={true}
                            >
                              Bank Details:{' '}
                              <span
                                style={{ float: 'none', fontWeight: 'normal', minWidth: '10mm' }}
                              >
                                {tempdocData.bankDetails2}
                              </span>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="3" style={{ height: '3mm' }}></td>
                        </tr>
                        <tr className="">
                          <td
                            colSpan="3"
                            className="line-td show_on_doc_div"
                            style={{
                              verticalAlign: 'top',
                              wordBreak: 'normal',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span
                              style={{
                                width: '100%',
                                padding: '0mm',
                                fontSize: '12px',
                                textAlign: 'left',
                                color: 'rgb(51, 51, 51)',
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                textDecoration: 'none',
                              }}
                            ></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

CreditNote.propTypes = {
  invoiceData: PropTypes.object,
}

export default CreditNote
