import React from 'react'

// Home
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const SetupAccount = React.lazy(() => import('./views/setup/SetupAccount'))
const Tickets = React.lazy(() => import('./views/site/tickets/Tickets'))
const Reminders = React.lazy(() => import('./views/site/reminders/Reminders'))
//
const ViewUser = React.lazy(() => import('./views/site/users/ViewUser'))
const EditUser = React.lazy(() => import('./views/site/users/EditUser'))
//
const Notifications = React.lazy(() => import('./views/site/notifications/Notifications'))
//
const Bookings = React.lazy(() => import('./views/site/bookings/Bookings'))
const CreateBooking = React.lazy(() => import('./views/site/bookings/CreateBooking'))
const ViewBooking = React.lazy(() => import('./views/site/bookings/ViewBooking'))
// const EditBooking = React.lazy(() => import('./views/site/bookings/ViewBooking'))
//
const CreateSearch = React.lazy(() => import('./views/site/searches/CreateSearch'))
//
const Transports = React.lazy(() => import('./views/site/transports/Transports'))
//
const Mappings = React.lazy(() => import('./views/site/mappings/Mappings'))
//
const Agreements = React.lazy(() => import('./views/site/agreements/Agreements'))
//

const Positions = React.lazy(() => import('./views/site/positions/Positions'))
const CreatePosition = React.lazy(() => import('./views/site/positions/CreatePosition'))
const ViewPosition = React.lazy(() => import('./views/site/positions/ViewPosition'))
//
const Tariffs = React.lazy(() => import('./views/site/tariffs/Tariffs'))
const CreateTariff = React.lazy(() => import('./views/site/tariffs/CreateTariff'))
//
const Companies = React.lazy(() => import('./views/site/companies/Companies'))
const CreateCompany = React.lazy(() => import('./views/site/companies/CreateCompany'))
const ViewCompany = React.lazy(() => import('./views/site/companies/ViewCompany'))
const EditCompany = React.lazy(() => import('./views/site/companies/EditCompany'))
//
const Contacts = React.lazy(() => import('./views/site/contacts/Contacts'))
const CreateContact = React.lazy(() => import('./views/site/contacts/CreateContact'))
const ViewContact = React.lazy(() => import('./views/site/contacts/ViewContact'))
const EditContact = React.lazy(() => import('./views/site/contacts/EditContact'))
//
const Quotations = React.lazy(() => import('./views/site/quotations/Quotations'))
const CreateQuotation = React.lazy(() => import('./views/site/quotations/CreateQuotation'))
const ViewQuotation = React.lazy(() => import('./views/site/quotations/ViewQuotation'))
const EditQuotation = React.lazy(() => import('./views/site/quotations/EditQuotation'))
//
const CompanyNotes = React.lazy(() => import('./views/site/companyNotes/CompanyNotes'))
//
const Prospects = React.lazy(() => import('./views/site/prospects/Prospects'))
//
const Contracts = React.lazy(() => import('./views/site/contracts/Contracts'))
//
const Locations = React.lazy(() => import('./views/site/locations/Locations'))
//
const Operations = React.lazy(() => import('./views/site/operations/Operations'))
//
const Tenders = React.lazy(() => import('./views/site/tenders/Tenders'))
//
const FinanceDashboard = React.lazy(() => import('./views/site/finance/FinanceDashboard'))
const FinanceSettings = React.lazy(() => import('./views/site/finance/FinanceSettings'))
//

//
const SalesInvoice = React.lazy(() => import('./views/site/salesInvoice/SalesInvoice'))
const CreateSalesInvoice = React.lazy(() => import('./views/site/salesInvoice/CreateSalesInvoice'))
const StartInvoice = React.lazy(() => import('./views/site/salesInvoice/StartInvoice'))
const ViewInvoice = React.lazy(() => import('./views/site/salesInvoice/ViewInvoice'))
const EditInvoice = React.lazy(() => import('./views/site/salesInvoice/EditInvoice'))
const CloneInvoice = React.lazy(() => import('./views/site/salesInvoice/CloneInvoice'))

//
const PurchaseInvoice = React.lazy(() => import('./views/site/purchaseInvoice/PurchaseInvoice'))
const CreatePurchaseInvoice = React.lazy(() =>
  import('./views/site/purchaseInvoice/CreatePurchaseInvoice'),
)

const CashTransaction = React.lazy(() => import('./views/site/cashTransaction/CashTransaction'))
const BankTransaction = React.lazy(() => import('./views/site/bankTransaction/BankTransaction'))
const DriverTransaction = React.lazy(() =>
  import('./views/site/driverTransaction/DriverTransaction'),
)
const CreditPolicies = React.lazy(() => import('./views/site/creditPolicies/CreditPolicies'))
//
const LedgerEntries = React.lazy(() => import('./views/site/ledgerEntries/LedgerEntries'))
const CreateLedgerEntry = React.lazy(() => import('./views/site/ledgerEntries/CreateLedgerEntry'))
const ViewLedgerEntry = React.lazy(() => import('./views/site/ledgerEntries/ViewLedgerEntry'))
const EditLedgerEntry = React.lazy(() => import('./views/site/ledgerEntries/EditLedgerEntry'))
//
const RoadVoyages = React.lazy(() => import('./views/site/fleet/WorkOrders'))
const ExpenseForms = React.lazy(() => import('./views/site/fleet/ExpenseForms'))
const GateActions = React.lazy(() => import('./views/site/fleet/GateActions'))
const Fuellogs = React.lazy(() => import('./views/site/fleet/Fuellogs'))
const ServiceLogs = React.lazy(() => import('./views/site/fleet/ServiceLogs'))
const PeriodicDocs = React.lazy(() => import('./views/site/fleet/PeriodicDocs'))
const RoRoTickets = React.lazy(() => import('./views/site/fleet/RoRoTickets'))
const Drivers = React.lazy(() => import('./views/site/fleet/Drivers'))

const Vehicles = React.lazy(() => import('./views/site/fleet/Vehicles'))
const CreateVehicle = React.lazy(() => import('./views/site/fleet/panels/NewVehicle'))
const ViewVehicle = React.lazy(() => import('./views/site/fleet/ViewVehicle'))

const FacilityManagement = React.lazy(() => import('./views/site/fleet/FacilityManagement'))
const CreateDriver = React.lazy(() => import('./views/site/fleet/panels/NewDriver'))

const ViewFindocs = React.lazy(() => import('./views/site/findocs/ViewFindocs'))

//
const Emails = React.lazy(() => import('./views/site/emails/Emails'))
const CreateEmail = React.lazy(() => import('./views/site/emails/CreateEmail'))
//
const Organization = React.lazy(() => import('./views/site/organization/Organization'))
const EditOrganization = React.lazy(() => import('./views/site/organization/EditOrganization'))
//
const Reports = React.lazy(() => import('./views/site/reports/Reports'))

const Page404 = React.lazy(() => import('./views/auth/page404/page404'))

const routes = [
  { path: '/', exact: true, name: 'Homepage', component: Dashboard },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/loadings', exact: true, name: 'Bookings', component: Bookings },
  { path: '/loadings/new/:query?', name: 'New Booking', component: CreateBooking },
  { path: '/loadings/:id', exact: true, name: 'Created Booking', component: ViewBooking },
  // { path: '/loadings/:id/edit', name: 'Edit Booking', component: EditBooking },

  { path: '/transports', exact: true, name: 'Transports', component: Transports },
  { path: '/transports/:query?', name: 'Disposition Transports', component: Transports },

  { path: '/positions', exact: true, name: 'Positions', component: Positions },
  { path: '/positions/new/:query?', name: 'New Position', component: CreatePosition },
  { path: '/positions/:id', name: 'View Position', component: ViewPosition },

  { path: '/tariffs', name: 'Tariffs', component: Tariffs },
  { path: '/tariffs/new/:query?', name: 'New Tariff', component: CreateTariff },

  { path: '/companies', exact: true, name: 'Companies', component: Companies },
  { path: '/companies/new', name: 'New Company', component: CreateCompany },
  { path: '/companies/:id', exact: true, name: 'View Companies', component: ViewCompany },
  { path: '/companies/edit/:companyId', exact: true, name: 'Edit Company', component: EditCompany },

  { path: '/contacts', exact: true, name: 'Contacts', component: Contacts },
  { path: '/contacts/new', name: 'New Contact', component: CreateContact },
  { path: '/contacts/:id', exact: true, name: 'View Contact', component: ViewContact },
  { path: '/contacts/edit/:id', exact: true, name: 'Edit Contact', component: EditContact },

  { path: '/leads', exact: true, name: 'Quotations', component: Quotations },
  { path: '/leads/new', name: 'New Quotation', component: CreateQuotation },
  { path: '/leads/:id', exact: true, name: 'View Quotation', component: ViewQuotation },
  { path: '/leads/edit/:id', exact: true, name: 'Edit Quotation', component: EditQuotation },

  { path: '/notices', name: 'CompanyNotes', component: CompanyNotes },

  { path: '/opportunities', name: 'Prospects', component: Prospects },

  { path: '/contracts', name: 'Contracts', component: Contracts },

  { path: '/tenders', name: 'Tenders', component: Tenders },

  { path: '/financor', exact: true, name: 'Finance', component: FinanceDashboard },
  { path: '/financor/home', name: 'Home Finance', component: FinanceDashboard },
  { path: '/financor/settings', name: 'Settings Finance', component: FinanceSettings },

  { path: '/financor/debit', exact: true, name: 'Sales Invoice', component: SalesInvoice },
  { path: '/financor/debit/new', name: 'New Sales Invoice', component: CreateSalesInvoice },
  { path: '/invoices/start', name: 'Start Invoice', component: StartInvoice },
  { path: '/invoices/:invId', exact: true, name: 'View Invoice', component: ViewInvoice },
  { path: '/invoices/edit/:invId', exact: true, name: 'Edit Invoice', component: EditInvoice },
  { path: '/invoices/clone/:invId', exact: true, name: 'Clone Invoice', component: CloneInvoice },

  { path: '/financor/credit', exact: true, name: 'Purchase Invoice', component: PurchaseInvoice },
  {
    path: '/financor/credit/new',
    exact: true,
    name: 'Create Purchase Invoice',
    component: CreatePurchaseInvoice,
  },

  { path: '/financor/cash_trans', name: 'Cash Transactions', component: CashTransaction },
  { path: '/financor/bank_trans', name: 'Bank Transactions', component: BankTransaction },

  {
    path: '/financor/driver_trans/:query?',
    name: 'Driver Transactions',
    component: DriverTransaction,
  },

  { path: '/financor/pay_terms', name: 'Credit Policies', component: CreditPolicies },

  { path: '/gldocs', exact: true, name: 'Ledger Entries', component: LedgerEntries },
  { path: '/gldocs/new', name: 'New Ledger Entry', component: CreateLedgerEntry },
  { path: '/gldocs/:id', exact: true, name: 'View Ledger Entries', component: ViewLedgerEntry },
  { path: '/gldocs/edit/:id', exact: true, name: 'Edit Ledger Entry', component: EditLedgerEntry },

  { path: '/reports/home/:query?', name: 'Reports', component: Reports },
  { path: '/notifies', name: 'Notifications', component: Notifications },

  { path: '/road_voyages', name: 'Road Voyages', component: RoadVoyages },

  { path: '/emails', exact: true, name: 'Emails', component: Emails },
  { path: '/emails/new/:query?', name: 'New Voyages', component: CreateEmail },

  { path: '/nlms/searches/new/:query?', name: 'New Search', component: CreateSearch },

  { path: '/organization/:query?', exact: true, name: 'Organization', component: Organization },
  {
    path: '/organization/edit/:companyId',
    exact: true,
    name: 'Edit Organization',
    component: EditOrganization,
  },

  { path: '/operations', name: 'Operations', component: Operations },

  { path: '/mappings', name: 'Mappings', component: Mappings },

  { path: '/findocs/:finId', name: 'View Findocs', component: ViewFindocs },

  { path: '/agreement_periods', name: 'Agreements', component: Agreements },

  { path: '/locations', name: 'Locations', component: Locations },

  { path: '/vehicles', exact: true, name: 'Vehicles', component: Vehicles },
  { path: '/vehicles/new', name: 'Create Vehicle', component: CreateVehicle },
  { path: '/vehicles/:id', exact: true, name: 'View Vehicle', component: ViewVehicle },

  { path: '/expense_forms/:query?', name: 'Expense Forms', component: ExpenseForms },
  { path: '/fuellogs/:query?', name: 'Fuel Logs', component: Fuellogs },
  { path: '/gate_actions', name: 'Gate Actions', component: GateActions },

  { path: '/servicelogs', name: 'Service Logs', component: ServiceLogs },

  { path: '/tickets/:query?', name: 'Tickets', component: Tickets },
  { path: '/reminders', name: 'Reminders', component: Reminders },

  { path: '/drivers', exact: true, name: 'Drivers', component: Drivers },
  { path: '/drivers/new', name: 'Create Driver', component: CreateDriver },

  { path: '/periodocs', name: 'Periodic Docs', component: PeriodicDocs },
  { path: '/transdocs/:query?', name: 'Trans Doc', component: RoRoTickets },
  { path: '/facility_managements', name: 'Facility Managements', component: FacilityManagement },

  { path: '/users/:userId', exact: true, name: 'View User', component: ViewUser },
  { path: '/users/edit/:userId', exact: true, name: 'Edit User', component: EditUser },

  { path: '/setups/new', exact: true, name: 'Setup Account', component: SetupAccount },
  { path: '*', name: 'Page404', component: Page404 },
]

export default routes
