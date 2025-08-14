import React, { useState, useEffect, useCallback } from 'react'
import { CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { pdfDownloadTempdoc, printPdfTempdoc, updateTempdoc } from 'src/redux/slices/tempdocSlice'
import $ from 'jquery'
import { useHistory } from 'react-router-dom'
import countryList from 'react-select-country-list'
import { isEmpty, isNull } from 'lodash'
import ChargeTableRow from '../../invoices/CreditNote/ChargeTableRow'
import Noty from 'noty'
import defCorpImage from 'src/assets/images/default-corporate-image.jpg'

const CreditNoteTempdoc = ({ reqData, tempdocDataId }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { authUser } = useSelector((state) => state.auth)
  const [tempdocData, setTempdocData] = useState({
    templateId: '',
    invoiceId: '',
    imgLogoUrl: `${
      authUser && authUser.company && authUser.company.logoUrl ? authUser.company.logoUrl : ''
    }`,
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
  const { updatingTempdoc } = useSelector((state) => state.tempdoc)

  const handleChangeTemp = (e) => {
    const name = e.currentTarget.getAttribute('data-name')
    const value = e.currentTarget.textContent
    setTempdocData({
      ...tempdocData,
      [name]: value,
    })
  }

  const saveTempDoc = async (e) => {
    e.preventDefault()
    //form data
    const data = {
      tempCode: tempdocData.templateId,
      tempdocData: JSON.stringify(tempdocData),
      findocId: tempdocData.findocId,
      tempHtml: JSON.stringify($('#templatediv').clone().html()),
    }
    const resData = await dispatch(updateTempdoc({ Id: tempdocDataId, ...data })).unwrap()
    if (resData) {
      new Noty({
        text: 'Tempdoc successfully updated',
        type: 'alert',
      }).show()
      history.push('/financor/debit')
    }
  }

  const pdfDownload = async (e) => {
    e.preventDefault()
    //form data
    let formData = new FormData()
    formData.append('tempdocDataId', tempdocDataId)
    await dispatch(pdfDownloadTempdoc(formData)).unwrap()
  }

  const sendMailTempdoc = (e) => {
    e.preventDefault()
    history.push(`/emails/new?tempdoc_id=${tempdocDataId}`)
  }

  const printTempdoc = async (e) => {
    e.preventDefault()
    //form data
    let formData = new FormData()
    formData.append('tempdocDataId', tempdocDataId)
    await dispatch(printPdfTempdoc(formData)).unwrap()
  }

  const handleSetTempDoc = useCallback(() => {
    if (reqData) {
      const req = reqData
      setTempdocData((state) => ({
        ...state,
        templateId: req.templateId,
        invoiceId: req.invoiceId,
        imgLogoUrl: req.imgLogoUrl,
        companyTitle: req.companyTitle,
        companyTitle2: req.companyTitle,
        companyAddress: req.companyAddress,
        companyAddress2: req.companyAddress,
        companyTel: req.companyTel,
        companyTel2: req.companyTel,
        companyEmail: req.companyEmail,
        companyEmail2: req.companyEmail,
        companyVat: req.companyVat,
        companyVat2: req.companyVat,
        mainTitle: req.mainTitle,
        mainTitle2: req.mainTitle,
        customerHeader: req.customerHeader,
        customerHeader2: req.customerHeader,
        customer: req.customer,
        customer2: req.customer,
        dateHeader: req.dateHeader,
        dateHeader2: req.dateHeader,
        date: req.date,
        date2: req.date,
        refNoHeader: req.refNoHeader,
        refNoHeader2: req.refNoHeader,
        refNo: req.refNo,
        refNo2: req.refNo,
        invoiceNoHeader: req.invoiceNoHeader,
        invoiceNoHeader2: req.invoiceNoHeader,
        invoiceNo: req.invoiceNo,
        invoiceNo2: req.invoiceNo,
        customerRefHeader: req.customerRefHeader,
        customerRefHeader2: req.customerRefHeader,
        customerRef: req.customerRef,
        customerRef2: req.customerRef,
        shipperHeader: req.shipperHeader,
        shipperHeader2: req.shipperHeader,
        shipper: req.shipper,
        shipper2: req.shipper,
        importerHeader: req.importerHeader,
        importerHeader2: req.importerHeader,
        importer: req.importer,
        importer2: req.importer,
        shipperHeaderVat: req.shipperHeaderVat,
        shipperHeaderVat2: req.shipperHeaderVat,
        importerHeaderVat: req.importerHeaderVat,
        importerHeaderVat2: req.importerHeaderVat,
        collectionAddressHeader: req.collectionAddressHeader,
        collectionAddressHeader2: req.collectionAddressHeader,
        collectionAddress: req.collectionAddress,
        collectionAddress2: req.collectionAddress,
        collectionDateHeader: req.collectionDateHeader,
        collectionDateHeader2: req.collectionDateHeader,
        collectionDate: req.collectionDate,
        collectionDate2: req.collectionDate,
        deliveryAddressHeader: req.deliveryAddressHeader,
        deliveryAddressHeader2: req.deliveryAddressHeader,
        deliveryAddress: req.deliveryAddress,
        deliveryAddress2: req.deliveryAddress,
        deliveryDateHeader: req.deliveryDateHeader,
        deliveryDateHeader2: req.deliveryDateHeader,
        deliveryDate: req.deliveryDate,
        deliveryDate2: req.deliveryDate,
        noOfPackageTypeHeader: req.noOfPackageTypeHeader,
        noOfPackageTypeHeader2: req.noOfPackageTypeHeader,
        noOfPackageType: req.noOfPackageType,
        noOfPackageType2: req.noOfPackageType,
        chargeableWeightHeader: req.chargeableWeightHeader,
        chargeableWeightHeader2: req.chargeableWeightHeader,
        chargeableWeight: req.chargeableWeight,
        chargeableWeight2: req.chargeableWeight,
        grossWeightHeader: req.grossWeightHeader,
        grossWeightHeader2: req.grossWeightHeader,
        grossWeight: req.grossWeight,
        grossWeight2: req.grossWeight,
        volumeHeader: req.volumeHeader,
        volumeHeader2: req.volumeHeader,
        volume: req.volume,
        volume2: req.volume,
        commodityHeader: req.commodityHeader,
        commodityHeader2: req.commodityHeader,
        commodity: req.commodity,
        commodity2: req.commodity,
        chargesHeader: req.chargesHeader,
        chargesHeader2: req.chargesHeader,
        charges: req.charges,
        charges2: req.charges,
        addInfoHeader: req.addInfoHeader,
        addInfoHeader2: req.addInfoHeader,
        addInfo: req.addInfo,
        addInfo2: req.addInfo,
        vatHeader: req.vatHeader,
        vatHeader2: req.vatHeader,
        vat: req.vat,
        vat2: req.vat,
        vatTotal: req.vatTotal,
        vatTotal2: req.vatTotal,
        amountHeader: req.amountHeader,
        amountHeader2: req.amountHeader,
        amount: req.amount,
        amount2: req.amount,
        amountTotal: req.amountTotal,
        amountTotal2: req.amountTotal,
        totalHeader: req.totalHeader,
        totalHeader2: req.totalHeader,
        total: req.total,
        total2: req.total,
        paymentTerms: req.paymentTerms,
        paymentTerms2: req.paymentTerms,
        invoiceDueDate: req.invoiceDueDate,
        invoiceDueDate2: req.invoiceDueDate,
        ibanNo: req.ibanNo,
        ibanNo2: req.ibanNo,
        beneficiary: req.beneficiary,
        beneficiary2: req.beneficiary,
        bic: req.bic,
        bic2: req.bic,
        bankDetails: req.bankDetails,
        bankDetails2: req.bankDetails,
      }))
    }
  }, [reqData])

  useEffect(() => {
    handleSetTempDoc()
  }, [handleSetTempDoc, dispatch])

  if (!tempdocData && isNull(authUser)) return null

  return (
    <div className="containerPreview">
      <div className="preview_button" id="hiddenPrint">
        <div className="form-actions">
          <form>
            <CButton
              color="primary"
              id="template_submit_button"
              className="mr-2"
              onClick={(e) => printTempdoc(e)}
            >
              Print
            </CButton>
            <CButton
              color="primary"
              className="mr-2"
              id="template_submit_button"
              onClick={(e) => pdfDownload(e)}
            >
              PDF
            </CButton>
            <CButton
              color="primary"
              className="mr-2"
              id="template_submit_button"
              onClick={(e) => sendMailTempdoc(e)}
            >
              Send Mail
            </CButton>
            <CButton
              color="primary"
              id="template_submit_button"
              disabled={updatingTempdoc ? true : false}
              onClick={(e) => saveTempDoc(e)}
            >
              {updatingTempdoc ? 'Processing...' : 'Save'}
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
                            <span
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
                                  src={defCorpImage}
                                  height={80}
                                  style={{
                                    maxWidth: '300px',
                                    objectFit: 'contain',
                                    verticalAlign: 'middle',
                                  }}
                                  alt=""
                                />
                              )}
                            </span>
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

CreditNoteTempdoc.propTypes = {
  reqData: PropTypes.object,
  tempdocDataId: PropTypes.string,
}

export default CreditNoteTempdoc
