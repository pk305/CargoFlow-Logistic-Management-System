import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { findTempdoc } from 'src/redux/slices/tempdocSlice'
import {
  CreditNoteTempdoc,
  InvoiceDefaultTempdoc,
  InvoiceVatTempdoc,
  InvoiceFreightVat,
  PaymentReceiptTempdoc,
} from './tempdocs'

const ViewTempdoc = () => {
  const { tempid } = useParams()
  const dispatch = useDispatch()
  const [tempdocData, setTempdocData] = useState(null)
  const [reqData, setReqData] = useState(null)
  const [tempdocDataId, setTempdocDataId] = useState(null)
  const [template, setTemplate] = useState({ Id: '', itemDocId: '' })

  const findTempdata = useCallback(async () => {
    const resData = await dispatch(findTempdoc(tempid)).unwrap()
    if (resData) {
      setTempdocData(resData)
      setReqData(JSON.parse(JSON.parse(resData.docData)))
      setTempdocDataId(resData.uuid)
      setTemplate((state) => ({
        ...state,
        Id: resData.tempCode,
        itemDocId: resData.itemDocId,
      }))
    }
  }, [dispatch, tempid])

  useEffect(() => {
    findTempdata()
  }, [findTempdata])

  switch (template.Id) {
    case '9978':
      return (
        <InvoiceFreightVat
          id="9978"
          reqData={reqData}
          tempdocDataId={tempdocDataId}
          itemDocType={tempdocData.itemDocType}
          itemDocId={tempdocData.itemDocId}
          docName={tempdocData.name}
        />
      )

    case '6650':
      return (
        <InvoiceVatTempdoc
          id="6650"
          reqData={reqData}
          tempdocDataId={tempdocDataId}
          itemDocType={tempdocData.itemDocType}
          itemDocId={tempdocData.itemDocId}
          docName={tempdocData.name}
        />
      )

    case '8712':
      return (
        <CreditNoteTempdoc
          id="8712"
          reqData={reqData}
          tempdocDataId={tempdocDataId}
          itemDocType={tempdocData.itemDocType}
          itemDocId={tempdocData.itemDocId}
          docName={tempdocData.name}
        />
      )

    case '4417':
      return (
        <InvoiceDefaultTempdoc
          reqData={reqData}
          tempdocDataId={tempdocDataId}
          itemDocType={tempdocData.itemDocType}
          itemDocId={tempdocData.itemDocId}
          docName={tempdocData.name}
          id="3093"
        />
      )

    case '3454':
      return (
        <PaymentReceiptTempdoc
          reqData={reqData}
          tempdocDataId={tempdocDataId}
          itemDocType={tempdocData.itemDocType}
          itemDocId={tempdocData.itemDocId}
          docName={tempdocData.name}
          id="3454"
        />
      )

    default:
      return null
  }
}

export default ViewTempdoc
