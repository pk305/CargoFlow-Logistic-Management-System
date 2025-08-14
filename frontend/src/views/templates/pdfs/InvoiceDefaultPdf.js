// import React from 'react'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs

// var fonts = require('src/assets/fonts/standard-fonts/Helvetica')
// pdfMake.fonts = Helvetica

const formatMoney = (n, c, d, t) => {
  let j = ''
  c = isNaN((c = Math.abs(c))) ? 2 : c
  d = d === undefined ? '.' : d
  t = t === undefined ? ',' : t
  let s = n < 0 ? '-' : ''
  let i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c))))
  j = (j = i.length) > 3 ? j % 3 : 0

  return (
    s +
    (j ? i.substr(0, j) + t : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : '')
  )
}

export const InvoiceDefaultPdf = (data, logoUrl, pdfPrint) => {
  let chargesTable = [
    [
      {
        text: data.chargesHeader ? data.chargesHeader : '',
        colSpan: 3,
        bold: true,
        alignment: 'center',
      },
      {},
      {},
      { text: data.addInfoHeader2 ? data.addInfoHeader2 : '', bold: true, alignment: 'center' },
      { text: data.unitPrice2 ? data.unitPrice2 : '', bold: true, alignment: 'center' },
      { text: data.unitNumber2 ? data.unitNumber2 : '', bold: true, alignment: 'center' },
      { text: data.amountHeader2 ? data.amountHeader2 : '', bold: true, alignment: 'center' },
    ],
  ]

  if (data.charges.length > 0) {
    for (let i = 0; i < data.charges.length; i++) {
      const el = data.charges[i]
      chargesTable.push([
        { text: el.name, style: 'defFont', colSpan: 3, alignment: 'left' },
        {},
        {},
        { text: '', style: 'defFont', alignment: 'right' },
        { text: formatMoney(el.unitNumber), style: 'defFont', alignment: 'right' },
        { text: formatMoney(el.unitPrice), style: 'defFont', alignment: 'right' },
        { text: formatMoney(el.amountWithVat), style: 'defFont', alignment: 'right' },
      ])
    }
  }

  var doc = {
    // watermark: { text: 'Copy', color: 'blue', opacity: 0.1, bold: true, italics: false },
    content: [
      {
        columns: [
          {
            alignment: 'left',
            width: 170,
            height: 56,
            columns: [
              {
                width: 90,
                height: 23,
                image: 'logo',
                fit: [150, 100],
              },
            ],
          },
          {
            with: 396,
            alignment: 'right',
            style: 'headerTableRight',
            text: [
              { text: `\n ${data.companyTitle}`, bold: true, fontSize: 10.5, color: '#000' },
              { text: `\n ${data.companyAddress}`, style: 'defFont' },
              { text: `\n ${data.companyTel}`, style: 'defFont' },
              { text: `\n ${data.companyEmail}`, style: 'defFont' },
              { text: `\n ${data.companyVat}`, style: 'defFont' },
            ],
            layout: 'noBorders',
          },
        ],
        marginBottom: 2.8,
      },
      {
        alignment: 'center',
        text: data.mainTitle2 ? data.mainTitle2 : '',
        bold: true,
        fontSize: 12,
        marginBottom: 5.6,
      },
      {
        alignment: 'justify',
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          headerRows: 3,
          body: [
            [
              {
                text: data.customerHeader ? data.customerHeader : '',
                bold: true,
                alignment: 'left',
                colSpan: 3,
                width: 283,
              },
              {},
              {},
              { text: data.dateHeader2 ? data.dateHeader2 : '', bold: true, alignment: 'left' },
              {
                text: data.refNoHeader2 ? data.refNoHeader2 : '',
                colSpan: 2,
                bold: true,
                alignment: 'left',
              },
              {},
              {
                text: data.invoiceNoHeader2 ? data.invoiceNoHeader2 : '',
                bold: true,
                alignment: 'left',
              },
            ],
            [
              {
                text: `${data.customer2}`,
                // text: `Hakika Transporters \nMsa 80100-3030, Kenya  \nMsa / Kenya  \nVAT: A9SKO88009\n`,
                style: 'defFont',
                rowSpan: 3,
                colSpan: 3,
              },
              {},
              {},
              { text: data.date2 ? data.date2 : '', style: 'defFont' },
              { text: data.refNo2 ? data.refNo2 : '', colSpan: 2, style: 'defFont' },
              {},
              { text: data.invoiceNo ? data.invoiceNo : '', bold: true, style: 'defFont' },
            ],
            [
              {},
              {},
              {},
              {
                text: data.customerRefHeader2 ? data.customerRefHeader2 : '',
                bold: true,
                alignment: 'left',
                colSpan: 4,
              },
              {},
              {},
              {},
            ],
            [
              {},
              {},
              {},
              {
                text: data.customerRef2 ? data.customerRef2 : '\n\n\n',
                alignment: 'left',
                colSpan: 4,
              },
              {},
              {},
              {},
            ],
          ],
        },
        marginBottom: 18,
      },

      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: chargesTable,
        },
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: '',
                colSpan: 3,
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: 'SUB TOTAL',
                bold: true,
                alignment: 'right',
                colSpan: 3,
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: data.subTotalAmount2 ? data.subTotalAmount2 : '',
                bold: true,
                alignment: 'right',
              },
            ],
            [
              {
                text: '',
                colSpan: 3,
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: 'VAT',
                bold: true,
                alignment: 'right',
                colSpan: 3,
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: data.vatAmount2 ? data.vatAmount2 : '',
                bold: true,
                alignment: 'right',
              },
            ],
            [
              {
                text: '',
                colSpan: 3,
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: 'TOTAL',
                bold: true,
                alignment: 'right',
                colSpan: 3,
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: data.totalAmount2 ? data.totalAmount2 : '',
                bold: true,
                alignment: 'right',
              },
            ],
          ],
        },
        marginBottom: 14,
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: [
                  { text: 'Payment Terms: ', bold: true },
                  { text: '', style: 'defFont' },
                ],
                colSpan: 3,
              },
              {},
              {},
              {
                text: [
                  { text: 'Invoice Due Date: ', bold: true },
                  { text: '02/27/2022', style: 'defFont' },
                ],
                colSpan: 3,
              },
              {},
              {},
            ],
          ],
        },
        layout: 'noBorders',
        marginBottom: 8,
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: [
                  { text: 'EUR/USD IBAN No: ', bold: true },
                  { text: '', style: 'defFont' },
                ],
                colSpan: 3,
              },
              {},
              {},
              {
                text: [
                  { text: 'BIC ', bold: true },
                  { text: '', style: 'defFont' },
                ],
                colSpan: 3,
              },
              {},
              {},
            ],
          ],
        },
        layout: 'noBorders',
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: [
                  { text: 'Beneficiary: ', bold: true },
                  { text: '', style: 'defFont' },
                ],
                colSpan: 3,
              },
              {},
              {},
              {
                text: [
                  { text: 'Bank Details:  ', bold: true },
                  { text: '', style: 'defFont' },
                ],
                colSpan: 3,
              },
              {},
              {},
            ],
          ],
        },
        layout: 'noBorders',
      },
    ],
    defaultStyle: {
      // font: 'Helvetica',
      columnGap: 5,
      fontSize: 10.5,
      // lineHeight: 1.428571429,
      color: '#333',
    },
    styles: {
      defFont: {
        fontSize: 9,
        color: '#333',
      },
      headerTableRight: {
        margin: [0, 0, 0, 0],
      },
      tableStyle: {
        marginBottom: 8.5,
        color: '#333',
      },
    },
    images: {
      logo: logoUrl,
      // snow: '',
    },
    pageMargins: [28, 14, 28, 14],
    // pageSize: { customPageSize: { width: '794px' } },
  }

  var pdf = pdfMake.createPdf(doc)

  if (pdfPrint === 'print') {
    pdf.print()
  } else if (pdfPrint === 'open') {
    pdf.open()
  } else {
    pdf.download()
  }
}
