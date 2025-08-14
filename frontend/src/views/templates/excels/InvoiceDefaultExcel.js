import { saveAs } from 'file-saver'
const ExcelJs = require('exceljs')

export const InvoiceDefaultExcel = async (data, logoUrl, tempdocDataId) => {
  let logo64 = logoUrl.split(',', 2)
  let splLogo = logo64[0].split(';', 2)
  const splLogo2 = splLogo[0].split('/', 2)
  //
  const wb = new ExcelJs.Workbook()
  const ws = wb.addWorksheet('My Sheet', {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true,
      fitToHeight: 99,
      fitToWidth: 1,
      horizontalCentered: true,
    },
  })
  ws.pageSetup.printArea = 'B1:F45'
  ws.pageSetup.margins = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    header: 0,
    footer: 0,
  }
  ws.columns = [
    { header: '', key: 'a', width: 1 },
    { header: '', key: 'b', width: 40 },
    { header: '', key: 'c', width: 12 },
    { header: '', key: 'd', width: 12 },
    { header: '', key: 'e', width: 6 },
    { header: '', key: 'f', width: 12 },
  ]

  ws.mergeCells('B2:B9')
  ws.mergeCells('C2:F2')
  ws.mergeCells('C3:F3')
  ws.mergeCells('C4:F4')
  ws.mergeCells('C5:F5')
  ws.mergeCells('C6:F6')
  ws.mergeCells('C7:F7')
  ws.mergeCells('C8:F8')
  ws.mergeCells('C9:F9')

  ws.mergeCells('B10:F10')
  ws.mergeCells('B11:F11')

  // add logo
  const logo = wb.addImage({
    base64: logoUrl,
    extension: splLogo2[1],
  })
  ws.addImage(logo, {
    tl: { col: 1, row: 1 },
    ext: { width: 202, height: 123 },
    editAs: 'oneCell',
  })

  const headerStyle = {
    alignment: {
      horizontal: 'right',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
    },
  }
  ws.getCell('C2:F2').value = data.companyTitle2
  ws.getCell('C2:F2').style = {
    alignment: {
      horizontal: 'right',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '10.5',
      color: { argb: '333333' },
      bold: true,
    },
  }
  ws.getCell('C3:F3').value = data.companyAddress2
  ws.getCell('C3:F3').style = headerStyle
  ws.getCell('C4:F4').value = data.companyTel2
  ws.getCell('C4:F4').style = headerStyle
  ws.getCell('C5:F5').value = data.companyEmail2
  ws.getCell('C5:F5').style = headerStyle
  ws.getCell('C6:F6').value = data.companyVat2
  ws.getCell('C6:F6').style = headerStyle

  ws.getCell('B11:F11').value = data.mainTitle2
  ws.getCell('B11:F11').style = {
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '13',
      color: { argb: '333333' },
      bold: true,
    },
  }

  ws.mergeCells('B12:F12')

  const tblHeader = {
    alignment: {
      horizontal: 'left',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
      bold: true,
    },
    border: {
      top: { style: 'thin', color: { argb: '333333' } },
      left: { style: 'thin', color: { argb: '333333' } },
      bottom: { style: 'thin', color: { argb: '333333' } },
      right: { style: 'thin', color: { argb: '333333' } },
    },
  }

  ws.mergeCells('D13:E13')

  ws.getCell('B13').value = data.customerHeader2
  ws.getCell('B13').style = tblHeader
  ws.getCell('C13').value = data.dateHeader2
  ws.getCell('C13').style = tblHeader
  ws.getCell('D13').value = data.refNoHeader2
  ws.getCell('D13').style = tblHeader
  ws.getCell('F13').value = data.invoiceNoHeader2
  ws.getCell('F13').style = tblHeader

  ws.mergeCells('B14:B18')
  ws.mergeCells('D14:E14')
  ws.mergeCells('C15:F15')
  ws.mergeCells('C16:F18')

  const bodyStyle = {
    alignment: {
      horizontal: 'left',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
    },
    border: {
      top: { style: 'thin', color: { argb: '333333' } },
      left: { style: 'thin', color: { argb: '333333' } },
      bottom: { style: 'thin', color: { argb: '333333' } },
      right: { style: 'thin', color: { argb: '333333' } },
    },
  }

  ws.getCell('B14').value = data.customer2
  ws.getCell('B14').style = {
    alignment: {
      horizontal: 'left',
      vertical: 'top',
      shrinkToFit: true,
      wrapText: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
    },
    border: {
      top: { style: 'thin', color: { argb: '333333' } },
      left: { style: 'thin', color: { argb: '333333' } },
      bottom: { style: 'thin', color: { argb: '333333' } },
      right: { style: 'thin', color: { argb: '333333' } },
    },
  }
  ws.getCell('C14').value = data.date2
  ws.getCell('C14').style = bodyStyle
  ws.getCell('D14').value = data.refNo2
  ws.getCell('D14').style = bodyStyle
  ws.getCell('F14').value = data.invoiceNo
  ws.getCell('F14').style = bodyStyle
  ws.getCell('C15').value = data.customerRefHeader2
  ws.getCell('C15').style = tblHeader
  ws.getCell('C16').value = data.customerRef2
  ws.getCell('C16').style = bodyStyle
  ws.getCell('F17').style = bodyStyle
  ws.getCell('F15').style = bodyStyle
  ws.getCell('F16').style = bodyStyle

  ws.mergeCells('B19:F19')
  ws.mergeCells('B20:F20')
  const tbl2Header = {
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
      shrinkToFit: true,
      wrapText: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
      bold: true,
    },
    border: {
      top: { style: 'thin', color: { argb: '333333' } },
      left: { style: 'thin', color: { argb: '333333' } },
      bottom: { style: 'thin', color: { argb: '333333' } },
      right: { style: 'thin', color: { argb: '333333' } },
    },
  }
  ws.getCell('B19').style = {
    border: {
      top: { style: 'thin', color: { argb: '333333' } },
    },
  }
  ws.getCell('B21').value = data.chargesHeader2
  ws.getCell('B21').style = tbl2Header
  ws.getCell('C21').value = data.addInfoHeader2
  ws.getCell('C21').style = tbl2Header
  ws.getCell('D21').value = data.unitPrice2
  ws.getCell('D21').style = tbl2Header
  ws.getCell('E21').value = data.unitNumber2
  ws.getCell('E21').style = tbl2Header
  ws.getCell('F21').value = data.amountHeader2
  ws.getCell('F21').style = tbl2Header
  //
  const dataResults = data.charges

  console.log(dataResults)
  if (dataResults.length > 0) {
    for (let i = 0; i < dataResults.length; i++) {
      const el = dataResults[i]
      const row = ws.addRow({
        a: null,
        b: el.name,
        c: el.addInfo ? el.addInfo : '',
        d: el.unitNumber,
        e: el.unitPrice,
        f: el.amountWithVat,
      })
      row.eachCell(function (cell) {
        const key = cell._column._key
        if (key === 'b') {
          cell.style = {
            alignment: {
              horizontal: 'left',
              vertical: 'middle',
              shrinkToFit: true,
              wrapText: true,
            },
            font: {
              name: 'Helvetica',
              size: '9',
              color: { argb: '333333' },
            },
            border: {
              top: { style: 'thin', color: { argb: '333333' } },
              left: { style: 'thin', color: { argb: '333333' } },
              bottom: { style: 'thin', color: { argb: '333333' } },
              right: { style: 'thin', color: { argb: '333333' } },
            },
          }
        } else if (key === 'c') {
          cell.style = {
            alignment: {
              horizontal: 'center',
              vertical: 'middle',
              shrinkToFit: true,
              wrapText: true,
            },
            font: {
              name: 'Helvetica',
              size: '9',
              color: { argb: '333333' },
            },
            border: {
              top: { style: 'thin', color: { argb: '333333' } },
              left: { style: 'thin', color: { argb: '333333' } },
              bottom: { style: 'thin', color: { argb: '333333' } },
              right: { style: 'thin', color: { argb: '333333' } },
            },
          }
        } else if (key === 'e') {
          cell.style = {
            alignment: {
              horizontal: 'right',
              vertical: 'middle',
              shrinkToFit: true,
              wrapText: true,
            },
            font: {
              name: 'Helvetica',
              size: '9',
              color: { argb: '333333' },
            },
            border: {
              top: { style: 'thin', color: { argb: '333333' } },
              left: { style: 'thin', color: { argb: '333333' } },
              bottom: { style: 'thin', color: { argb: '333333' } },
              right: { style: 'thin', color: { argb: '333333' } },
            },
          }
          cell.numFmt = '#,##0.0;[Red]-#,##0.0'
        } else {
          cell.style = {
            alignment: {
              horizontal: 'right',
              vertical: 'middle',
              shrinkToFit: true,
              wrapText: true,
            },
            font: {
              name: 'Helvetica',
              size: '9',
              color: { argb: '333333' },
            },
            border: {
              top: { style: 'thin', color: { argb: '333333' } },
              left: { style: 'thin', color: { argb: '333333' } },
              bottom: { style: 'thin', color: { argb: '333333' } },
              right: { style: 'thin', color: { argb: '333333' } },
            },
          }
          cell.numFmt = '#,##0.00;[Red]-#,##0.00'
        }
      })
    }
  }
  //SUB TOTAL
  const subStyle = {
    alignment: {
      horizontal: 'right',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
      bold: true,
    },
  }
  const subMiniStyle = {
    alignment: {
      horizontal: 'right',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
      bold: true,
    },
    border: {
      top: { style: 'thin', color: { argb: '333333' } },
      left: { style: 'thin', color: { argb: '333333' } },
      bottom: { style: 'thin', color: { argb: '333333' } },
      right: { style: 'thin', color: { argb: '333333' } },
    },
  }
  const resCells = ws.addRow({ a: null, b: null, c: null, d: null, e: 'SUB TOTAL', f: '0.00' })
    .model.cells
  let subtotalRow = []
  if (resCells.length > 0) {
    for (let i = 0; i < resCells.length; i++) {
      const c = resCells[i]
      subtotalRow.push(c.address)
    }
  }
  const subtRows = subtotalRow.slice(1, 5)
  ws.mergeCells(`${subtRows[0]}:${subtRows[3]}`)
  ws.getCell(subtRows[0]).value = data.subTotalHeader2
  ws.getCell(subtRows[0]).style = subStyle
  ws.getCell(subtotalRow[5]).value = data.subTotalAmount2
  ws.getCell(subtotalRow[5]).numFmt = '0.00'
  ws.getCell(subtotalRow[5]).style = subMiniStyle
  //VAT
  const vatCells = ws.addRow({ a: null, b: null, c: null, d: null, e: 'VAT', f: '0.0' }).model.cells
  let vattotalRow = []
  if (vatCells.length > 0) {
    for (let i = 0; i < vatCells.length; i++) {
      const c = vatCells[i]
      vattotalRow.push(c.address)
    }
  }
  const vattRows = vattotalRow.slice(1, 5)
  ws.mergeCells(`${vattRows[0]}:${vattRows[3]}`)
  ws.getCell(vattRows[0]).value = data.vatHeader2
  ws.getCell(vattRows[0]).style = subStyle
  ws.getCell(vattotalRow[5]).value = data.vatAmount2
  ws.getCell(vattotalRow[5]).numFmt = '0.00'
  ws.getCell(vattotalRow[5]).style = subMiniStyle
  //TOTAL
  const totalCells = ws.addRow({ a: null, b: null, c: null, d: null, e: 'TOTAL', f: '0.00' }).model
    .cells
  let totalsRow = []
  if (totalCells.length > 0) {
    for (let i = 0; i < totalCells.length; i++) {
      const c = totalCells[i]
      totalsRow.push(c.address)
    }
  }
  const totalRows = totalsRow.slice(1, 5)
  ws.mergeCells(`${totalRows[0]}:${totalRows[3]}`)
  ws.getCell(totalRows[0]).value = data.totalHeader2
  ws.getCell(totalRows[0]).style = subStyle
  ws.getCell(totalsRow[5]).value = data.totalAmount2
  ws.getCell(totalsRow[5]).numFmt = '0.00'
  ws.getCell(totalsRow[5]).style = subMiniStyle
  //
  const footerStyle = {
    alignment: {
      horizontal: 'left',
      vertical: 'middle',
      shrinkToFit: true,
    },
    font: {
      name: 'Helvetica',
      size: '9',
      color: { argb: '333333' },
      bold: true,
    },
  }
  //
  ws.addRow({ a: null, b: null, c: null, d: null, e: null, f: null })
  //Pay
  const payTerms = ws.addRow({
    a: null,
    b: 'Payment Terms:',
    c: 'Invoice Due Date:',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let paytRows = []
  if (payTerms.length > 0) {
    for (let i = 0; i < payTerms.length; i++) {
      const c = payTerms[i]
      paytRows.push(c.address)
    }
  }
  ws.mergeCells(`${paytRows[2]}:${paytRows[5]}`)
  ws.getCell(paytRows[1]).value = 'Payment Terms: '
  ws.getCell(paytRows[1]).style = footerStyle
  ws.getCell(paytRows[2]).value = `Invoice Due Date: ${data.invoiceDueDate2}`
  ws.getCell(paytRows[2]).style = footerStyle
  //
  ws.addRow({ a: null, b: null, c: null, d: null, e: null, f: null })
  // EUR/USD IBAN No:
  const ibanRows = ws.addRow({
    a: null,
    b: 'EUR/USD IBAN No:',
    c: 'BIC: ',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let ibanTRows = []
  if (ibanRows.length > 0) {
    for (let i = 0; i < ibanRows.length; i++) {
      const c = ibanRows[i]
      ibanTRows.push(c.address)
    }
  }
  ws.mergeCells(`${ibanTRows[2]}:${ibanTRows[5]}`)
  ws.getCell(ibanTRows[1]).value = 'EUR/USD IBAN No: '
  ws.getCell(ibanTRows[1]).style = footerStyle
  ws.getCell(ibanTRows[2]).value = 'BIC: '
  ws.getCell(ibanTRows[2]).style = footerStyle
  //Beneficiary
  const benefRows = ws.addRow({
    a: null,
    b: 'Beneficiary:',
    c: 'Bank Details: ',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let beneftRows = []
  if (benefRows.length > 0) {
    for (let i = 0; i < benefRows.length; i++) {
      const c = benefRows[i]
      beneftRows.push(c.address)
    }
  }
  ws.mergeCells(`${beneftRows[2]}:${beneftRows[5]}`)
  ws.getCell(beneftRows[1]).value = 'Beneficiary: '
  ws.getCell(beneftRows[1]).style = footerStyle
  ws.getCell(beneftRows[2]).value = 'Bank Details: '
  ws.getCell(beneftRows[2]).style = footerStyle

  //
  ws.addRow({ a: null, b: null, c: null, d: null, e: null, f: null })
  // EUR/USD IBAN No 2:
  const iban2Rows = ws.addRow({
    a: null,
    b: 'EUR/USD IBAN No:',
    c: 'BIC: ',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let ibanT2Rows = []
  if (iban2Rows.length > 0) {
    for (let i = 0; i < iban2Rows.length; i++) {
      const c = iban2Rows[i]
      ibanT2Rows.push(c.address)
    }
  }
  ws.mergeCells(`${ibanT2Rows[2]}:${ibanT2Rows[5]}`)
  ws.getCell(ibanT2Rows[1]).value = 'EUR/USD IBAN No: '
  ws.getCell(ibanT2Rows[1]).style = footerStyle
  ws.getCell(ibanT2Rows[2]).value = 'BIC: '
  ws.getCell(ibanT2Rows[2]).style = footerStyle
  //Beneficiary 2
  const benef2Rows = ws.addRow({
    a: null,
    b: 'Beneficiary:',
    c: 'Bank Details: ',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let beneft2Rows = []
  if (benef2Rows.length > 0) {
    for (let i = 0; i < benef2Rows.length; i++) {
      const c = benef2Rows[i]
      beneft2Rows.push(c.address)
    }
  }
  ws.mergeCells(`${beneft2Rows[2]}:${beneft2Rows[5]}`)
  ws.getCell(beneft2Rows[1]).value = 'Beneficiary: '
  ws.getCell(beneft2Rows[1]).style = footerStyle
  ws.getCell(beneft2Rows[2]).value = 'Bank Details: '
  ws.getCell(beneft2Rows[2]).style = footerStyle
  //
  ws.addRow({ a: null, b: null, c: null, d: null, e: null, f: null })
  // EUR/USD IBAN No 3:
  const iban3Rows = ws.addRow({
    a: null,
    b: 'EUR/USD IBAN No:',
    c: 'BIC: ',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let ibanT3Rows = []
  if (iban3Rows.length > 0) {
    for (let i = 0; i < iban3Rows.length; i++) {
      const c = iban3Rows[i]
      ibanT3Rows.push(c.address)
    }
  }
  ws.mergeCells(`${ibanT3Rows[2]}:${ibanT3Rows[5]}`)
  ws.getCell(ibanT3Rows[1]).value = 'EUR/USD IBAN No: '
  ws.getCell(ibanT3Rows[1]).style = footerStyle
  ws.getCell(ibanT3Rows[2]).value = 'BIC: '
  ws.getCell(ibanT3Rows[2]).style = footerStyle
  //Beneficiary 2
  const benef3Rows = ws.addRow({
    a: null,
    b: 'Beneficiary:',
    c: 'Bank Details: ',
    d: null,
    e: null,
    f: null,
  }).model.cells
  let beneft3Rows = []
  if (benef3Rows.length > 0) {
    for (let i = 0; i < benef3Rows.length; i++) {
      const c = benef3Rows[i]
      beneft3Rows.push(c.address)
    }
  }
  ws.mergeCells(`${beneft3Rows[2]}:${beneft3Rows[5]}`)
  ws.getCell(beneft3Rows[1]).value = 'Beneficiary: '
  ws.getCell(beneft3Rows[1]).style = footerStyle
  ws.getCell(beneft3Rows[2]).value = 'Bank Details: '
  ws.getCell(beneft3Rows[2]).style = footerStyle
  //
  ws.addRow({ a: null, b: null, c: null, d: null, e: null, f: null })
  //Prepared by
  const prepbyRows = ws.addRow({
    a: null,
    b: 'Prepared By: ',
    c: null,
    d: null,
    e: null,
    f: null,
  }).model.cells
  let prepbrow = []
  if (prepbyRows.length > 0) {
    for (let i = 0; i < prepbyRows.length; i++) {
      const c = prepbyRows[i]
      prepbrow.push(c.address)
    }
  }
  ws.mergeCells(`${prepbrow[2]}:${prepbrow[5]}`)
  ws.getCell(prepbrow[1]).value =
    'Prepared By: ............................................................................................. '
  ws.getCell(prepbrow[1]).style = footerStyle
  //
  const buffer = await wb.xlsx.writeBuffer()
  const fileExtension = '.xlsx'
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, tempdocDataId + '-invoice' + fileExtension)
}
