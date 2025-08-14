import React, { useState } from 'react'
import { CCard, CCardBody } from '@coreui/react'
import { AppBreadcrumb } from 'src/components'
import DriverAdvances from './DriverAdvances'

const DriverTransaction = () => {
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans', active: true },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])

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
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">Driver Advance &amp; Expense</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <DriverAdvances />
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default DriverTransaction
