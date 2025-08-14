import React, { useState, useMemo, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButtonGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPagination,
  CPaginationItem,
  CDropdownDivider,
  CDropdownItemPlain,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CCallout,
  CForm,
  CFormFeedback,
} from '@coreui/react'
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useAsyncDebounce,
} from 'react-table'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppBreadcrumb } from 'src/components'
import { useEffect } from 'react'
import {
  clearCompanyError,
  destroyCompany,
  fetchCompanies,
  findCompany,
  showCompanyError,
  updateCompany,
} from 'src/redux/slices/companySlice'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import Noty from 'noty'
// import ReactTooltip from 'react-tooltip'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import SlidingPane from 'react-sliding-pane'
import countryList from 'react-select-country-list'
import { isEmpty, isNull } from 'lodash'
import $ from 'jquery'
import EditCompany from './modalInfo/EditCompany'
import { showFinancialError, createFinancial } from 'src/redux/slices/financialSlice'
import EditCompanyFinancials from './modalInfo/EditCompanyFinancials'
import Select from 'react-select'
import { fetchTimezones } from 'src/redux/slices/timezoneSlice'
import { fetchUsers } from 'src/redux/slices/userSlice'
import { fetchBranches } from 'src/redux/slices/branchSlice'
import { fetchCities } from 'src/redux/slices/citySlice'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <input
        type="text"
        id="searchComp--users-search"
        name="users-search"
        placeholder="Search"
        className="cst-search-input"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
      />
      <CIcon icon={cilZoom} customClassName="icon-search" size="sm" />
    </>
  )
}

const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder=""
      style={{ width: '100%' }}
      className="filterInput-box"
    />
  )
}

const fuzzyTextFilterFn = (page, id, filterValue) => {
  return matchSorter(page, filterValue, { keys: [(row) => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = (val) => !val

const Table = ({ columns, data }) => {
  const [showFilter, setShowFilter] = useState(false)
  const { fetchingCompanies } = useSelector((state) => state.company)

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (page, id, filterValue) => {
        return page.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const handleFilter = (e) => {
    e.preventDefault()
    setShowFilter(!showFilter)
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    state: { pageIndex, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
  )

  const firstPageRows = page.slice(0, 20)

  return (
    <>
      <CRow className="pageBoxSizing-filter">
        <CCol
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: selectedFlatRows.length > 0 })}
        >
          <div className="pageSearchContainer">
            <div className="cst-search-box">
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </div>
          </div>
        </CCol>
        <CCol
          sm={6}
          md={6}
          lg={6}
          xl={6}
          className={classNames({ hide: selectedFlatRows.length > 0 })}
        >
          <div className="cstSearchActions">
            <CButton color="secondary" variant="outline" onClick={(e) => handleFilter(e)}>
              {!showFilter ? (
                <span>
                  <CIcon icon={cilFilter} /> Filter
                </span>
              ) : (
                <span>
                  <CIcon icon={cilX} style={{ verticalAlign: '-2px', paddingRight: '2px' }} />
                  Cancel Filter
                </span>
              )}
            </CButton>
          </div>
        </CCol>
      </CRow>
      <div className="pageBoxSizing-container cst-tableResponsive">
        <div className="table-responsive table-truncate pageTableWrapper">
          <div>
            {fetchingCompanies ? (
              <div className="table-info">
                <span className="mt-5">
                  <img src={loaderLg} alt="" />
                </span>
              </div>
            ) : (
              <>
                <table className="table pageTable" {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup) => {
                      const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                      return (
                        <tr key={key} {...restHeaderGroupProps}>
                          {headerGroup.headers.map((column) => {
                            const { key, ...restColumn } = column.getHeaderProps()
                            return (
                              <th key={key} {...restColumn}>
                                {column.render('Header')}
                                <div style={{ display: !showFilter ? 'none' : '' }}>
                                  {column.canFilter &&
                                  key !== 'header_actions' &&
                                  key !== 'header_countVar'
                                    ? column.render('Filter')
                                    : null}
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </thead>
                  <tbody {...getTableBodyProps}>
                    {firstPageRows.length > 0 ? (
                      firstPageRows.map((row) => {
                        prepareRow(row)
                        const { key, ...restRowProps } = row.getRowProps()
                        return (
                          <tr key={key} {...restRowProps} className="bg-hover-light-primary">
                            {row.cells.map((cell) => {
                              const { key, ...restCellProps } = cell.getCellProps()
                              return (
                                <td key={key} {...restCellProps}>
                                  {cell.render('Cell')}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })
                    ) : (
                      <>
                        <tr className="text-center">
                          <td
                            colSpan={15}
                            style={{ borderBottom: 'none', borderTop: 'none', paddingTop: '3rem' }}
                          >
                            <span className="font-weight-bold">No records found.</span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
        {!fetchingCompanies && (
          <div className="table-page">
            {data.length > 0 && (
              <div>
                <span>
                  Showing page {pageIndex + 1} of {pageOptions.length} - {data.length}
                </span>
              </div>
            )}
            <div className="pagination">
              {data.length > 20 && (
                <CPagination aria-label="cst-table-navigation">
                  <CPaginationItem
                    aria-label="First"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    <span aria-hidden="true"> {'<<'}</span>
                  </CPaginationItem>
                  <CPaginationItem
                    aria-label="Previous"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    <span aria-hidden="true">{'<'}</span>
                  </CPaginationItem>
                  <CPaginationItem
                    aria-label="Next"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    <span aria-hidden="true">{'>'}</span>
                  </CPaginationItem>
                  <CPaginationItem
                    aria-label="Last"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    <span aria-hidden="true">{'>>'}</span>
                  </CPaginationItem>
                </CPagination>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const Companies = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies', active: true },
    { name: 'Contacts', pathname: '/contacts' },
    { name: 'Quotations', pathname: '/leads' },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const [mergePanel, setMergePanel] = useState(false)
  const [editCompanyMd, setEditCompanyMd] = useState(false)
  const [financialModal, setFinancialModal] = useState(false)
  const [financialData, setFinancialData] = useState({
    financialId: '',
    companyName: '',
    taxNo: '',
    taxOffice: '',
    companyNo: '',
    address: '',
    postcode: '',
    district: '',
    cityId: '',
    countryId: '',
    financialEmail: '',
    companyFinancorId: '',
    paymentNotes: '',
    informationEmail: '',
    creditLimit: '0.0',
    dueDays: '0',
    invoiceNotes: '',
    creditLimitControl: '',
    companyCurr: '',
    companyCreditLimitCurr: '',
    financialStatus: '',
    companyRemindPayment: '',
    financialNotes: '',
  })
  const { creatingFinancial } = useSelector((state) => state.financial)
  const [companyMergeData, setCompanyMergeData] = useState({
    targetCompanyId: '',
  })
  const { companyMergeErrors } = useSelector((state) => state.company)
  const { fetchingCompanies, companies, updatingCompany } = useSelector((state) => state.company)
  const [companyData, setCompanyData] = useState({
    companyId: '',
    companyName: '',
    cityId: '',
    countryId: '',
    district: '',
    address: '',
    postcode: '',
    eoriCode: '',
    taxOffice: '',
    taxNo: '',
    companyTel: '',
    companyFax: '',
    companyEmail: '',
    companyWebsite: '',
    companySalerId: '',
    branchId: '',
    companyGroup: '',
    companyType: '',
    companySector: '',
    tagNames: '',
    notes: '',
    contactsAttrName: '',
    contactsAttrJobTitle: '',
    contactsAttrTel: '',
    contactsAttrEmail: '',
    linkId: '',
    logoUrl: '',
    timezoneId: '',
  })
  const [defaultSelect, setDefaultSelect] = useState({
    countryId: null,
    timezoneId: null,
    companySalerId: null,
    branchId: null,
    loadCity: null,
    loadCountry: null,
  })

  const { branches } = useSelector((state) => state.branch)
  const { cities } = useSelector((state) => state.city)
  const { users } = useSelector((state) => state.user)
  const { timezones } = useSelector((state) => state.timezone)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setCompanyData({
      ...companyData,
      [name]: value,
    })
  }

  const handleSelectForm = (c, val) => {
    const f = val ? val.value : null
    if (c === 'cityId') {
      const countryData = f ? countryList().getLabel(f.country) : null
      setDefaultSelect((state) => ({
        ...state,
        loadCity: f ? { label: f.name, value: f.id } : '',
        loadCountry: countryData ? { label: `${f.country}-${countryData}`, value: f.country } : '',
      }))

      setCompanyData((state) => ({
        ...state,
        cityId: !isNull(f) ? f.id : '',
        countryId: !isNull(f) ? f.country : '',
      }))
    } else if (c === 'companySalerId') {
      setDefaultSelect((state) => ({
        ...state,
        companySalerId: f ? { label: f.name, value: f.uuid } : '',
      }))
      setCompanyData((state) => ({
        ...state,
        companySalerId: !isNull(f) ? f.uuid : '',
      }))
    } else if (c === 'branchId') {
      setDefaultSelect((state) => ({
        ...state,
        branchId: f ? { label: f.name, value: f.id } : '',
      }))
      setCompanyData((state) => ({
        ...state,
        branchId: !isNull(f) ? f.id : '',
      }))
    } else if (c === 'timezoneId') {
      setDefaultSelect((state) => ({
        ...state,
        timezoneId: f ? { label: `${f.code ? f.code + ' ' : ''}  ${f.name}`, value: f.id } : '',
      }))
      setCompanyData((state) => ({
        ...state,
        timezoneId: !isNull(f) ? f.id : '',
      }))
    } else {
      if (c === 'countryId') {
        setDefaultSelect((state) => ({
          ...state,
          loadCountry: { label: val.label, value: val.value },
        }))
      }
      const e = {
        target: {
          name: c,
          value: !isNull(val) ? val.value : '',
        },
      }
      handleChangeForm(e)
    }
  }

  const closeFinModal = () => {
    setFinancialModal(false)
  }

  const closeMergePanel = () => {
    setMergePanel(false)
  }

  const handleChangeFinancials = (e) => {
    const { name, value } = e.target
    setFinancialData({
      ...companyMergeData,
      [name]: value,
    })
  }

  const handleSubmitFinancials = async () => {
    if (financialData.address === '') {
      dispatch(showFinancialError({ type: 'address', errorType: 'errFinancial' }))
      $('.company-financials').animate({ scrollTop: 0 }, 300)
      return false
    }
    //form data
    let arrForm = Object.entries(financialData)
    const formData = new FormData()
    if (arrForm.length > 0) {
      for (const [key, value] of arrForm) {
        formData.append([key], value)
      }
    }

    const resData = await dispatch(createFinancial(formData)).unwrap()
    if (resData) {
      setFinancialModal(false)
      new Noty({
        text: 'The Company has been updated successfully',
        layout: 'topCenter',
        type: 'success',
      }).show()
    }
  }

  const toLink = (e, link) => {
    e.preventDefault()
    history.push(link)
  }

  const handleShowDelBtn = useCallback((e, item) => {
    e.preventDefault()
    $(`#moreCollapse${item.id}`).fadeToggle('fast', function () {
      $(`#moreCollapse${item.id}`).toggleClass('hide')
    })
  }, [])

  const closeEditCompMd = () => {
    setEditCompanyMd(false)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearCompanyError({ type: c, errorType: 'errCompany' }))
    if (c === 'cityId') {
      if (isEmpty(cities)) {
        dispatch(fetchCities())
      }
    } else if (c === 'timezoneId') {
      if (isEmpty(timezones)) {
        dispatch(fetchTimezones())
      }
    } else if (c === 'companySalerId') {
      if (isEmpty(users)) {
        dispatch(fetchUsers())
      }
    } else if (c === 'branchId') {
      if (isEmpty(branches)) {
        dispatch(fetchBranches())
      }
    }
  }

  const handleEditCompany = useCallback(
    async (e, item) => {
      e.preventDefault()
      const resData = await dispatch(findCompany(item.id)).unwrap()
      if (resData) {
        const company = resData
        // console.log(company)
        setCompanyData((state) => ({
          ...state,
          companyId: company.id ? company.id : '',
          companyName: company.name ? company.name : '',
          address: company.address ? company.address : '',
          companyEmail: company.email ? company.email : '',
          companyTel: company.phone ? company.phone : '',
          companyWebsite: company.website ? company.website : '',
          cityId: company.city && company.city.id ? company.city.id : '',
          postcode: company.postcode ? company.postcode : '',
          taxNo: company.taxno ? company.taxno : '',
          countryId: company.countryId ? company.countryId : '',
          district: company.district ? company.district : '',
          eoriCode: company.eoriCode ? company.eoriCode : '',
          companyFax: company.fax ? company.fax : '',
          taxOffice: company.taxOffice ? company.taxOffice : '',
          companySalerId: company && company.saler ? company.saler.id : '',
          companyGroup: company.companyGroup ? company.companyGroup : '',
          companyType: company && company.companyType ? company.companyType : '',
          companySector: company ? company.companySector : '',
          tagNames: company.tagNames ? company.tagNames : '',
          notes: company.notes ? company.notes : '',
          contactsAttrName: company.contact ? company.contact.name : '',
          contactsAttrJobTitle: company.contact ? company.contact.jobTitle : '',
          contactsAttrTel: company.contact ? company.contact.telephone : '',
          contactsAttrEmail: company.contact ? company.contact.email : '',
          branchId: company.branch ? company.branch.id : '',
          linkId: company.linkId ? company.linkId : '',
          logoUrl: company.logoUrl ? company.logoUrl : '',
          // timezoneId: '',
        }))

        setDefaultSelect((state) => ({
          ...state,
          companySalerId:
            company && company.saler
              ? {
                  label: `${company.saler.name}`,
                  value: `${company.saler.id}`,
                }
              : null,
          countryId: company.countryId
            ? {
                label: `${countryList().getLabel(company.countryId)}`,
                value: `${company.countryId}`,
              }
            : null,
          branchId:
            company && company.branch
              ? {
                  label: `${company.branch.name}`,
                  value: `${company.branch.id}`,
                }
              : null,
        }))
      }
      $('.dropdown-menu').removeClass('show')

      setEditCompanyMd(true)
    },
    [dispatch],
  )

  const handleEditFinDetail = useCallback((e) => {
    e.preventDefault()
    // const resData = await dispatch(findFinancial(invoiceData.invoiceCompanyId)).unwrap()
    // if (resData) {
    //   setFinancialData({
    //     ...financialData,
    //     financialId: !isNull(resData.financial.id) ? resData.financial.id : '',
    //     address: !isNull(resData.address) ? resData.address : '',
    //     companyName: !isNull(resData.financial.companyTitle) ? resData.financial.companyTitle : '',
    //   })
    // }
    $('.dropdown-menu').removeClass('show')
    setFinancialModal(true)
  }, [])

  // const clearCompanyData = () => {
  //   setCompanyData({
  //     companyId: '',
  //     companyName: '',
  //     cityId: '',
  //     countryId: '',
  //     district: '',
  //     address: '',
  //     postcode: '',
  //     eoriCode: '',
  //     taxOffice: '',
  //     taxNo: '',
  //     companyTel: '',
  //     companyFax: '',
  //     companyEmail: '',
  //     companyWebsite: '',
  //     companySalerId: '',
  //     branchId: '',
  //     companyGroup: '',
  //     companyType: '',
  //     companySector: '',
  //     tagNames: '',
  //     notes: '',
  //     contactsAttrName: '',
  //     contactsAttrJobTitle: '',
  //     contactsAttrTel: '',
  //     contactsAttrEmail: '',
  //   })
  // }

  const handleUpdateCompany = async (e) => {
    e.preventDefault()
    const form = $('#editCompany')
    if (form.length > 0) {
      if (companyData.companyName === '') {
        dispatch(showCompanyError({ type: 'companyName', errorType: 'errCompany' }))
        $('html, body').animate({ scrollTop: 0 }, 300)
        return false
      }
    }
    // form data
    const resData = await dispatch(
      updateCompany({ Id: companyData.companyId, ...companyData }),
    ).unwrap()
    if (resData) {
      // clearCompanyData()
      setEditCompanyMd(false)
      new Noty({
        type: 'alert',
        layout: 'topRight',
        id: `updateItem${resData.id}`,
        text: 'Company updated succesfully',
        timeout: 5000,
      }).show()
    }
  }

  const handleMergePanel = useCallback((e) => {
    e.preventDefault()
    $('.dropdown-menu').removeClass('show')
    setMergePanel(true)
  }, [])

  const handleSelectFormMerge = (c, val) => {
    setCompanyMergeData({
      [c]: !isNull(val) ? val.value : '',
    })
  }

  const handleSelectFocusMerge = (c, _) => {
    dispatch(clearCompanyError({ type: c, errorType: 'errCompany' }))
    if (c === 'targetCompanyId') {
      if (isEmpty(companies)) {
        dispatch(fetchCompanies())
      }
    }
  }

  const handleDeleteCompany = useCallback(
    (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      var n = new Noty({
        text: 'The record will be deleted, do you want to continue ?',
        layout: 'topCenter',
        progressBar: false,
        timeout: false,
        type: 'error',
        closeWith: 'button',
        buttons: [
          Noty.button(
            'Delete',
            'btn btn-default btn-sm del-bnt-mr text-danger float-right',
            async function () {
              const resData = await dispatch(destroyCompany(item.id)).unwrap()
              if (resData) {
                new Noty({
                  text: 'Company has been deleted succesfully',
                  layout: 'topCenter',
                  progressBar: false,
                  timeout: 5000,
                  type: 'alert',
                }).show()
              }
              n.close()
            },
            { id: `delItem${item.id}` },
          ),

          Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
            n.close()
          }),
        ],
      })
      n.show()
    },
    [dispatch],
  )

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'actions',
        // eslint-disable-next-line react/prop-types
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={(e) => handleEditCompany(e, original)}>
                    <i className="fa fa-edit mr-2" /> Edit
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleEditFinDetail(e, original)}>
                    <i className="fa fa-edit mr-2" /> Edit Company Finance Details
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleMergePanel(e, original)}>
                    <i className="fa fa-copy mr-2" /> Merge this Company
                  </CDropdownItem>
                  {/* <CDropdownItem>
                    <i className="far fa-file mr-2" /> Ledger Integration
                  </CDropdownItem> */}
                  {/* <CDropdownItem>
                    <i className="fa fa-print mr-2" /> Print
                  </CDropdownItem> */}
                  <CDropdownDivider />
                  {/* eslint-disable-next-line react/prop-types */}
                  <div id={`moreCollapse${original.id}`} className="hide">
                    <CDropdownItem onClick={(e) => handleDeleteCompany(e, original)}>
                      <i className="fa fa-trash mr-2" /> Delete
                    </CDropdownItem>
                  </div>
                  <CDropdownItemPlain>
                    <CButton
                      color="primary"
                      size="sm"
                      style={{ width: '100%', padding: '0.55rem 0.75rem' }}
                      onClick={(e) => handleShowDelBtn(e, original)}
                    >
                      Show more
                    </CButton>
                  </CDropdownItemPlain>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Name</span>,
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <div className="link-search-hover truncate">
            <div>
              <Link
                target="_blank"
                // eslint-disable-next-line react/prop-types
                to={`/companies/${original.linkId}`}
                className={classNames('redirect-link truncate ', {
                  // eslint-disable-next-line react/prop-types
                  'text-info': original.status === 'draft',
                  // eslint-disable-next-line react/prop-types
                  'text-cancelled': original.status === 'cancelled',
                  // eslint-disable-next-line react/prop-types
                  'text-default': original.status === 'confirmed',
                })}
                rel="noreferrer"
              >
                {value}
              </Link>
            </div>
            <div className="btn-search-hover">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                href="#"
                // onClick={(e) => handleSetInvoice(e, original)}
              >
                <i className="fa fa-search"></i>
              </a>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Company Type</span>,
        accessor: 'companyType',
      },
      {
        Header: <span>Phone</span>,
        accessor: 'phone',
      },

      {
        Header: <span>Email</span>,
        accessor: 'email',
      },
      {
        Header: <span>Address / Country</span>,
        accessor: 'address',
        // eslint-disable-next-line
        Cell: ({ row: { original } }) => (
          <div className="d-flex flex-column">
            {/* eslint-disable-next-line react/prop-types */}
            <span className="truncate" data-tip={original.address} data-html="addresTip">
              {/* eslint-disable-next-line react/prop-types */}
              {original.address}
            </span>
            {/* <ReactTooltip place="right" type="light" effect="solid" id="addresTip" /> */}
            <span className="font-weight-bold">
              {/* eslint-disable-next-line */}
              {original.countryId ? countryList().getLabel(original.countryId) : null}
            </span>
          </div>
        ),
      },
      {
        Header: <span>Tax No/EORI No</span>,
        accessor: 'taxno',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          // eslint-disable-next-line react/prop-types
          <span>{`${value ? value : ''} - ${original.eoriCode ? original.eoriCode : ''}`}</span>
        ),
      },
      {
        Header: <span>AC/REP</span>,
        accessor: 'saler.name',
      },

      {
        Header: <span>Branch</span>,
        accessor: 'branch.name',
      },
    ],
    [
      handleEditCompany,
      handleShowDelBtn,
      handleEditFinDetail,
      handleMergePanel,
      handleDeleteCompany,
    ],
  )

  const data = useMemo(() => (companies && companies.length > 0 ? companies : []), [companies])

  const fetchCompanyData = useCallback(() => dispatch(fetchCompanies()), [dispatch])

  useEffect(() => {
    document.title = 'Companies'
    //
    fetchCompanyData()
  }, [fetchCompanyData])

  return (
    <div>
      <div className="cstContainerDef">
        <AppBreadcrumb items={breadcrumbList} />
      </div>
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="cstCardbodyHeaderTitle">Companies</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => toLink(e, '/companies/new')}>
                      <i className="fa fa-plus mr-2" /> Create Company
                    </CButton>
                  </CButtonGroup>
                </div>
              </div>
            </div>
            <CCardBody className="p-0">
              <div className="pageContainer-wrapper isTable">
                <Table columns={columns} data={data} />
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>

      {/* merge company panel*/}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={mergePanel}
        title={
          <div className="space">
            <div>
              <span>Company Merge</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={() => closeMergePanel(false)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <CCard className="cardCustom">
            <CCardBody>
              <div className="">
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <h3 className="titleHeading m-0 p-0" style={{ border: 'none' }}>
                      Halmac Transporters
                    </h3>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <CCallout
                      color="danger"
                      className="bg-light cstCalloutInfo animate__animated animate__fadeIn "
                    >
                      <div style={{ width: '100%' }}>
                        <ul className="cstUl">
                          <li>This Company will be deleted!</li>
                        </ul>
                      </div>
                    </CCallout>
                  </div>
                </div>
                <div className="separator"></div>
              </div>
              <CForm className="simple_form horizontal-form" id="new_company_merge" method="post">
                <div className="card-body px-6 pt-0">
                  <div className="row">
                    <div
                      className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
                      data-select2-id="6414"
                    >
                      <div
                        className="form-group company required company_merge_target_company_id"
                        data-select2-id="6413"
                      >
                        <label
                          className="control-label company required"
                          htmlFor="company_merge_target_company_id"
                        >
                          Main Company <span title="required">*</span>
                        </label>
                        <div>
                          <div className="input-group">
                            <Select
                              id="company_merge_target_company_id"
                              classNamePrefix="cstSelect"
                              isClearable={true}
                              placeholder
                              isLoading={fetchingCompanies ? true : false}
                              isSearchable
                              name="targetCompanyId"
                              autoFocus={false}
                              options={
                                companies && !fetchingCompanies && companies.length > 0
                                  ? companies.map((itm) => ({
                                      label: itm.name,
                                      value: itm.id,
                                    }))
                                  : []
                              }
                              className={classNames(
                                'form-control form-control-cst pageCstSelect ',
                                {
                                  'is-invalid':
                                    companyMergeErrors &&
                                    !isEmpty(companyMergeErrors.targetCompanyId),
                                },
                              )}
                              noOptionsMessage={() => 'No results found'}
                              onChange={(e) => handleSelectFormMerge('targetCompanyId', e)}
                              onFocus={(e) => handleSelectFocusMerge('targetCompanyId', e)}
                            />
                            <CFormFeedback
                              invalid={
                                companyMergeErrors && !isEmpty(companyMergeErrors.targetCompanyId)
                                  ? true
                                  : false
                              }
                              className="fieldError-cst"
                            >
                              {companyMergeErrors.targetCompanyId}
                            </CFormFeedback>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"></div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                      <CButton color="success">
                        Save <i className="fa fa-check"></i>
                      </CButton>
                    </div>
                  </div>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </div>
      </SlidingPane>

      {/* edit company modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="xl"
        visible={editCompanyMd}
        onClose={(e) => closeEditCompMd(e)}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Edit</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="p-2">
            <EditCompany
              companyData={companyData}
              handleSelectFocus={handleSelectFocus}
              handleChangeForm={handleChangeForm}
              handleSelectForm={handleSelectForm}
              defaultSelect={defaultSelect}
              closeEditCompMd={closeEditCompMd}
              setCompanyData={setCompanyData}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <div>
            <CButton
              color="success"
              onClick={(e) => handleUpdateCompany(e)}
              disabled={updatingCompany ? true : false}
            >
              {updatingCompany ? 'Processing...' : 'Save'} <i className="fa fa-check ml-1"></i>
            </CButton>
          </div>
        </CModalFooter>
      </CModal>

      {/* financial modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        scrollable={true}
        size="xl"
        transition={false}
        visible={financialModal}
        onClose={() => closeFinModal()}
      >
        <CModalHeader>
          <CModalTitle>Financials</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <EditCompanyFinancials
            financialData={financialData}
            handleChangeFinancials={handleChangeFinancials}
          />
        </CModalBody>
        <CModalFooter>
          <div>
            <CButton color="secondary" variant="ghost" onClick={() => closeFinModal()}>
              Cancel
            </CButton>
            <CButton
              color="success"
              onClick={() => handleSubmitFinancials()}
              disabled={creatingFinancial ? true : false}
            >
              {creatingFinancial ? 'Processing...' : 'Save'} <i className="fa fa-check ml-1"></i>
            </CButton>
          </div>
        </CModalFooter>
      </CModal>
    </div>
  )
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
}

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  setGlobalFilter: PropTypes.func,
}

fuzzyTextFilterFn.propTypes = {
  page: PropTypes.array,
  id: PropTypes.number,
  filterValue: PropTypes.array,
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

export default Companies
