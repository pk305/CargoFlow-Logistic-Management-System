import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CRow } from '@coreui/react'
import { AppBreadcrumb } from 'src/components'
import {
  LedgerAccounts,
  ProfitCenters,
  Counters,
  CurrencyList,
  CurrencyRates,
  InvoiceItems,
  TaxRates,
  BankAccounts,
  GeneralSetings,
} from './settings'

const FinanceSettings = () => {
  const [breadcrumbList] = useState([
    { name: 'Sales Invoices', pathname: '/financor/debit' },
    { name: 'Purchase Invoices', pathname: '/financor/credit' },
    { name: 'Cash Transactions', pathname: '/financor/cash_trans' },
    { name: 'Bank Transactions', pathname: '/financor/bank_trans' },
    { name: 'Driver Transactions', pathname: '/financor/driver_trans' },
    { name: 'Ledger Entries', pathname: '/gldocs' },
    { name: 'Reports', pathname: '/reports/home?group_type=financor' },
  ])
  const [activeNav, setActiveNav] = useState([
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ])

  const toggleNav = (e, tab) => {
    e.preventDefault()
    const state = activeNav.map((x, i) => (tab === i ? true : false))
    setActiveNav(state)
  }

  useEffect(() => {
    document.title = 'CargoFlow TMS'
  }, [])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="rawWrapper-container">
        <div className="pageContainer">
          <div className="container-fluid">
            <div className="d-block"></div>
            <CCard className="cardCustom">
              <CCardBody>
                <CRow>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                    <div className="settings-wrap-list">
                      <ul className="nav flex-column nav-light-info nav-pills w-100">
                        <div className="d-flex">
                          <h3 className="st-Title">Settings</h3>
                        </div>
                        <div className="separator"></div>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 0)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              Ledger Accounts
                            </span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 1)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              Profit Centers
                            </span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 2)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              Bank Accounts
                            </span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 3)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              Invoice Items
                            </span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 4)} href="#">
                            <span className="nav-text font-weight-bolder truncate">Tax Rates</span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 5)} href="#">
                            <span className="nav-text font-weight-bolder truncate">Counters</span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 6)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              Currency Rates
                            </span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 7)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              Currency List
                            </span>
                          </a>
                        </li>
                        <li className="nav-item w-100 mb-3">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a className="nav-link" onClick={(e) => toggleNav(e, 8)} href="#">
                            <span className="nav-text font-weight-bolder truncate">
                              General Settings
                            </span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
                    <div className="settings-menu-container">
                      <div>
                        {activeNav[0] && true && <LedgerAccounts />}
                        {activeNav[1] && true && <ProfitCenters />}
                        {activeNav[2] && true && <BankAccounts />}
                        {activeNav[3] && true && <InvoiceItems />}
                        {activeNav[4] && true && <TaxRates />}
                        {activeNav[5] && true && <Counters />}
                        {activeNav[6] && true && <CurrencyRates />}
                        {activeNav[7] && true && <CurrencyList />}
                        {activeNav[8] && true && <GeneralSetings />}
                      </div>
                    </div>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinanceSettings
