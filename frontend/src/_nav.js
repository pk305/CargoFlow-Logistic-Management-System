import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <i className="fa fa-home nav-icon" aria-hidden="true" />,
  },
  {
    component: CNavGroup,
    name: 'Logistics',
    icon: <i className="fa fa-truck nav-icon" aria-hidden="true" />,
    items: [
      {
        component: CNavItem,
        name: 'Bookings',
        icon: <i className="fa fa-book nav-icon" aria-hidden="true" />,
        to: '/loadings',
      },
      {
        component: CNavItem,
        name: 'Transport Planning',
        icon: <i className="fa fa-truck nav-icon" aria-hidden="true" />,
        to: '/transports',
        activeClassName: 'act-trans',
      },
      {
        component: CNavItem,
        name: 'Disposition',
        icon: <i className="fa fa-route nav-icon" aria-hidden="true" />,
        to: '/transports?operation_id=6638&version=new',
        activeClassName: 'act-trans',
      },
      {
        component: CNavItem,
        name: 'Air Freight',
        icon: <i className="fa fa-plane nav-icon" aria-hidden="true" />,
        to: '/positions?trans_method=air',
        activeClassName: 'act-pos',
      },
      {
        component: CNavItem,
        name: 'Sea Freight',
        icon: <i className="fa fa-ship nav-icon" aria-hidden="true" />,
        to: '/positions?trans_method=sea',
        activeClassName: 'act-pos',
      },
      {
        component: CNavItem,
        name: 'Road Freight',
        icon: <i className="fa fa-truck nav-icon" aria-hidden="true" />,
        to: '/positions?trans_method=road',
        activeClassName: 'act-pos',
      },
      {
        component: CNavItem,
        name: 'Warehouse',
        icon: <i className="fa fa-warehouse nav-icon" aria-hidden="true" />,
        activeClassName: 'act-pos',
        to: '/positions?trans_method=warehouse',
      },
      // {
      //   component: CNavItem,
      //   name: 'Control Tower',
      //   icon: <i className="fa fa-gopuram nav-icon" aria-hidden="true" />,
      //   to: '/logistics/home/control',
      // },
    ],
  },

  {
    component: CNavGroup,
    name: 'CRM',
    icon: <i className="fa fa-network-wired  nav-icon" aria-hidden="true" />,
    items: [
      {
        component: CNavItem,
        name: 'Companies',
        icon: <i className="fa fa-building nav-icon" aria-hidden="true" />,
        to: '/companies',
      },
      {
        component: CNavItem,
        name: 'Contacts',
        icon: <i className="fa fa-user-friends nav-icon" aria-hidden="true" />,
        to: '/contacts',
      },
      {
        component: CNavItem,
        name: 'Quotations',
        icon: <i className="fa fa-user-edit nav-icon" aria-hidden="true" />,
        to: '/leads',
      },
      {
        component: CNavItem,
        name: 'Company Notes',
        icon: <i className="fa fa-book nav-icon" aria-hidden="true" />,
        to: '/notices',
      },
      {
        component: CNavItem,
        name: 'Prospects',
        icon: <i className="fa fa-users nav-icon" aria-hidden="true" />,
        to: '/opportunities',
      },
      {
        component: CNavItem,
        name: 'Contracts',
        icon: <i className="fa fa-file-signature nav-icon" aria-hidden="true" />,
        to: '/contracts',
      },
      {
        component: CNavItem,
        name: 'Tenders',
        icon: <i className="fa fa-file-signature nav-icon" aria-hidden="true" />,
        to: '/tenders',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Finance',
    icon: <i className="fa fa-money-check-alt nav-icon" aria-hidden="true" />,
    items: [
      {
        component: CNavItem,
        name: 'Dashboard',
        icon: <i className="fas fa-tachometer-alt nav-icon" aria-hidden="true" />,
        to: '/financor/home',
      },
      {
        component: CNavItem,
        name: 'Sales Invoice',
        icon: <i className="fas fa-file-invoice nav-icon" aria-hidden="true" />,
        to: '/financor/debit',
      },
      {
        component: CNavItem,
        name: 'Purchase Invoice',
        icon: <i className="fa fa-file-alt nav-icon" aria-hidden="true" />,
        to: '/financor/credit',
      },
      {
        component: CNavItem,
        name: 'Cash Transactions',
        icon: <i className="fa fa-coins nav-icon" aria-hidden="true" />,
        to: '/financor/cash_trans',
      },
      {
        component: CNavItem,
        name: 'Bank Transactions',
        icon: <i className="fa fa-university nav-icon" aria-hidden="true" />,
        to: '/financor/bank_trans',
      },
      {
        component: CNavItem,
        name: 'Driver Transactions',
        icon: <i className="fa fa-university nav-icon" aria-hidden="true" />,
        to: '/financor/driver_trans',
      },
      {
        component: CNavItem,
        name: 'Credit, Policies',
        icon: <i className="fa fa-money-bill-wave nav-icon" aria-hidden="true" />,
        to: '/financor/pay_terms',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Fleet Services',
    icon: <i className="fa fa-truck nav-icon" aria-hidden="true" />,
    items: [
      {
        component: CNavItem,
        name: 'Work Orders',
        icon: <i className="fa fa-building nav-icon" aria-hidden="true" />,
        to: '/road_voyages',
      },
      {
        component: CNavItem,
        name: 'Expense Forms',
        icon: <i className="fa fa-user-friends nav-icon" aria-hidden="true" />,
        to: '/expense_forms?person_type=driver',
      },
      {
        component: CNavItem,
        name: 'Service Logs',
        icon: <i className="fa fa-user-edit nav-icon" aria-hidden="true" />,
        to: '/servicelogs',
      },
      {
        component: CNavItem,
        name: 'Periodic Docs',
        icon: <i className="fa fa-book nav-icon" aria-hidden="true" />,
        to: '/periodocs',
      },
      {
        component: CNavItem,
        name: 'Fuel Logs',
        icon: <i className="fa fa-gas-pump nav-icon" aria-hidden="true" />,
        to: '/fuellogs?scope=vehicle',
      },
      {
        component: CNavItem,
        name: 'Gate Actions',
        icon: <i className="fa fa-file-signature nav-icon" aria-hidden="true" />,
        to: '/gate_actions',
      },
    ],
  },

  // {
  //   component: CNavGroup,
  //   name: 'Customs Forms',
  //   icon: <i className="fa fa-file-alt nav-icon" aria-hidden="true" />,
  //     {
  //       component: CNavItem,
  //       name: 'NCTS Declarations',
  //       icon: <i className="fa fa-file-certificate nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'GVMS Records',
  //       icon: <i className="fa fa-scanner-keyboard nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Ens Declarations',
  //       icon: <i className="fa fa-ship nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Declaration Requests',
  //       icon: <i className="fa fa-bolt nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Warehouse',
  //   icon: <i className="fa fa-warehouse nav-icon" aria-hidden="true" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Warehouse Mvt',
  //       icon: <i className="fa fa-warehouse nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Bonded Whs Mvt',
  //       icon: <i className="fa fa-user-friends nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Service Logs',
  //       icon: <i className="fa fa-user-edit nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Periodic Documents',
  //       icon: <i className="fa fa-book nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Prospects',
  //       icon: <i className="fa fa-users nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Contracts',
  //       icon: <i className="fa fa-file-signature nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //   ],
  // },

  // {
  //   component: CNavGroup,
  //   name: 'Human Resource',
  //   icon: <i className="fa fa-users nav-icon" aria-hidden="true" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Employees',
  //       icon: <i className="fa fa-users nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Payrolls Periods',
  //       icon: <i className="fa fa-calendar nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Leaves',
  //       icon: <i className="fa fa-user-clock nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Allowance And Wagecuts',
  //       icon: <i className="fa fa-book nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Workday Information',
  //       icon: <i className="fa fa-file-signature nav-icon" aria-hidden="true" />,
  //       to: '/transports',
  //     },
  //   ],
  // },

  {
    component: CNavGroup,
    name: 'Reports',
    className: 'reportgroup-link',
    icon: <i className="fa fa-file-alt nav-icon" aria-hidden="true" />,
    items: [
      {
        component: CNavItem,
        name: 'Logistics Reports',
        activeClassName: 'act-log',
        to: '/reports/home?group_type=logistics',
      },
      {
        component: CNavItem,
        name: 'Financial Reports',
        activeClassName: 'act-log',
        to: '/reports/home?group_type=financor',
      },
      {
        component: CNavItem,
        name: 'Fleet Reports',
        activeClassName: 'act-log',
        to: '/reports/home?group_type=fleet',
      },
      {
        component: CNavItem,
        name: 'Warehouse Reports',
        activeClassName: 'act-log',
        to: '/reports/home?group_type=deport',
      },
      {
        component: CNavItem,
        name: 'Sales & CRM Reports',
        activeClassName: 'act-log',
        to: '/reports/home?group_type=network',
      },
      {
        component: CNavItem,
        name: 'User Reports',
        activeClassName: 'act-log',
        to: '/reports/home?group_type=user',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Manage',
  },
  // {
  //   component: CNavItem,
  //   name: 'Users',
  //   icon: <i className="fa fa-users nav-icon" aria-hidden="true" />,
  //   to: '/manage/users',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Operations',
  //   icon: <i className="fa fa-cog nav-icon" aria-hidden="true" />,
  //   to: '/operations',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Locations',
  //   icon: <i className="fa fa-warehouse nav-icon" aria-hidden="true" />,
  //   to: '/locations',
  // },
  {
    component: CNavItem,
    name: 'Company',
    icon: <i className="fa fa-cog nav-icon" aria-hidden="true" />,
    to: '/organization',
  },
]

export default _nav
