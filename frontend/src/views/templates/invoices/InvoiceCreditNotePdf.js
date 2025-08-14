// import React from 'react'
import brandLogo from 'src/assets/brand/truckLogoData'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs

// var Helvetica = require('src/assets/fonts/standard-fonts/Helvetica')
// pdfMake.fonts = Helvetica

export const InvoiceCreditNotePdf = (data, pdfPrint) => {
  console.log(data, pdfPrint)
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
                fit: [100, 100],
              },
            ],
          },
          {
            with: 396,
            alignment: 'right',
            style: 'headerTableRight',
            text: [
              { text: '\n Nueklabs Logistics', bold: true, fontSize: 10.5, color: '#000' },
              { text: '\n Mombasa along Nkrumah Road / Kenya', style: 'defFont' },
              { text: '\n +25400412127', style: 'defFont' },
              { text: '\n info@gmail.com', style: 'defFont' },
              { text: '\n VAT: AKS2903030', style: 'defFont' },
            ],
            layout: 'noBorders',
          },
        ],
        marginBottom: 2.8,
      },
      {
        alignment: 'center',
        text: 'CREDIT NOTE',
        bold: true,
        fontSize: 12,
        marginBottom: 5.6,
      },
      {
        style: 'tableStyle',
        alignment: 'justify',
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          headerRows: 3,
          body: [
            [
              { text: 'CUSTOMER', bold: true, alignment: 'left', colSpan: 3, width: 283 },
              {},
              {},
              { text: 'DATE', bold: true, alignment: 'left' },
              { text: 'REF. NO', bold: true, alignment: 'left' },
              { text: 'INVOICE NO', bold: true, alignment: 'left' },
            ],
            [
              {
                text: `Hakika Transporters \nMsa 80100-3030, Kenya  \nMsa / Kenya  \nVAT: A9SKO88009\n`,
                style: 'defFont',
                rowSpan: 3,
                colSpan: 3,
              },
              {},
              {},
              { text: '02/27/2022', style: 'defFont' },
              { text: 'FEB/616551/22', style: 'defFont' },
              { text: 'INV035373751', bold: true, style: 'defFont' },
            ],
            [
              {},
              {},
              {},
              { text: 'CUSTOMER REF', bold: true, alignment: 'left', colSpan: 3 },
              {},
              {},
            ],
            [{}, {}, {}, { text: '\n\n\n', alignment: 'left', colSpan: 3 }, {}, {}],
            [
              {
                text: 'SHIPPER',
                colSpan: 3,
                bold: true,
                alignment: 'left',
              },
              {},
              {},
              { text: 'IMPORTER', colSpan: 3, bold: true, alignment: 'left' },
              {},
              {},
            ],
            [
              {
                text: '\n VAT:  \n\n',
                colSpan: 3,
                alignment: 'left',
                style: 'defFont',
              },
              {},
              {},
              { text: '\n\n VAT: \n\n\n', colSpan: 3, style: 'defFont', alignment: 'left' },
              {},
              {},
            ],
          ],
        },
      },

      {
        style: 'tableStyle',
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'COLLECTION ADDRESS', bold: true, alignment: 'center', colSpan: 5 },
              {},
              {},
              {},
              {},
              { text: 'Collection Date', bold: true, fontSize: 10, alignment: 'center' },
            ],
            [
              { text: '\n\n', style: 'defFont', colSpan: 5 },
              {},
              {},
              {},
              {},
              { text: '\n\n', style: 'defFont' },
            ],
            [
              { text: 'DELIVERY ADDRESS', bold: true, colSpan: 5, alignment: 'center' },
              {},
              {},
              {},
              {},
              { text: 'Delivery Date', bold: true, fontSize: 10, alignment: 'center' },
            ],
            [
              { text: '\n\n', style: 'defFont' },
              {},
              {},
              {},
              {},
              { text: '\n\n', style: 'defFont' },
            ],
          ],
        },
      },
      {
        style: 'tableStyle',
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: 'No of Package / Type',
                bold: true,
                alignment: 'center',
                colSpan: 2,
                style: 'defFont',
              },
              {},
              { text: 'Chargeable Weight', bold: true, alignment: 'center', style: 'defFont' },
              { text: 'Gross Weight', bold: true, alignment: 'center', style: 'defFont' },
              { text: 'Volume', bold: true, alignment: 'center', style: 'defFont' },
              { text: 'Commodity', bold: true, alignment: 'center', style: 'defFont' },
            ],
            [
              { text: '\n', style: 'defFont', colSpan: 2 },
              {},
              { text: '\n', style: 'defFont' },
              { text: '\n', style: 'defFont' },
              { text: '\n', style: 'defFont' },
              { text: '\n', style: 'defFont' },
            ],
          ],
        },
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            [
              { text: 'CHARGES', colSpan: 3, bold: true, alignment: 'center' },
              {},
              {},
              { text: 'ADD. İNFO', bold: true, alignment: 'center' },
              { text: 'VAT', bold: true, alignment: 'center' },
              { text: 'Amount', bold: true, alignment: 'center' },
            ],
            // [{}, {}, {}, {}, {}, {}],
            [
              { text: 'Freight Charge', style: 'defFont', colSpan: 3, alignment: 'left' },
              {},
              {},
              { text: '39,404.00', style: 'defFont', alignment: 'left' },
              { text: '0.00', style: 'defFont', alignment: 'left' },
              { text: '39,404.00', style: 'defFont', alignment: 'left' },
            ],
          ],
        },
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: '',
                colSpan: 3,
                bold: true,
                alignment: 'center',
                border: [false, false, false, false],
              },
              {},
              {},
              {
                text: 'Total',
                bold: true,
                alignment: 'center',
                border: [true, false, true, true],
              },
              { text: '\n', alignment: 'center', border: [true, false, true, true] },
              { text: '\n', alignment: 'center', border: [true, false, true, true] },
            ],
          ],
        },
        marginBottom: 14,
      },
      {
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: [
                  { text: 'Payment Terms: ', bold: true },
                  { text: '37383', style: 'defFont' },
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
          widths: ['*', '*', '*', '*', '*', '*'],
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
          widths: ['*', '*', '*', '*', '*', '*'],
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
      logo: brandLogo,
    },
    pageMargins: [28, 14, 28, 14],
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
