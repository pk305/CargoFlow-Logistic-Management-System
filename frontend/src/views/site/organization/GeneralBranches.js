import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  CCardBody,
  CRow,
  CCol,
  CButton,
  CPagination,
  CFormSelect,
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CFormInput,
  CFormFeedback,
  CFormTextarea,
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
import CIcon from '@coreui/icons-react'
import { cilFilter, cilZoom, cilX } from '@coreui/icons'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import Select from 'react-select'
import { fetchBranches } from 'src/redux/slices/branchSlice'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <input
        type="text"
        id="searchComp--branches-search"
        name="branches-search"
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
  const { fetchingBranches } = useSelector((state) => state.branch)

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
            {fetchingBranches ? (
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
        {!fetchingBranches && (
          <div className="table-page">
            {firstPageRows.length > 0 && (
              <div>
                <span>
                  Showing page {pageIndex + 1} of {pageOptions.length} - {data.length}
                </span>
              </div>
            )}
            <div className="pagination">
              {firstPageRows.length > 0 && (
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

const GeneralBranches = ({ company }) => {
  const dispatch = useDispatch()
  const { branches } = useSelector((state) => state.branch)
  const { companyErrors } = useSelector((state) => state.company)

  const [branchModal, setBranchModal] = useState(false)
  const [branchData] = useState([])

  const closeBranchModal = () => {
    setBranchModal(false)
  }

  const handleChangeForm = (e) => {}
  const handleSelectFocus = (e) => {}
  const handleSelectForm = (e) => {}

  const handleBranchModal = (e) => {
    e.preventDefault()
    setBranchModal(true)
  }

  const columns = useMemo(
    () => [
      {
        Header: <span>Branch Name</span>,
        accessor: 'name',
      },
      {
        Header: <span>Manager</span>,
        accessor: 'jobTitle',
      },
      {
        Header: <span>Phone</span>,
        accessor: 'phone',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value ? `${value}-${original.name}` : null}
          </span>
        ),
      },
      {
        Header: <span>Fax</span>,
        accessor: 'lastLogin',
      },
      {
        Header: <span>E-mail</span>,
        accessor: 'branchName',
      },
      {
        Header: <span>Address</span>,
        accessor: 'status',
        // eslint-disable-next-line react/prop-types
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: () => (
          <div className="float-right">
            <div className="table-action-dropdown">
              <CDropdown>
                <CDropdownToggle color="link">
                  <i className="fa fa-ellipsis-h"></i>
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>
                    <i className="fa fa-edit" />
                    <span className="text-rl">Edit</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-lock" />
                    <span className="text-rl">Change Password</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-envelope" />
                    <span className="text-rl">SMTP Settings</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-edit" />
                    <span className="text-rl">Change Authorization</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-user" />
                    <span className="text-rl">User Login</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="far fa-envelope" />
                    <span className="text-rl">Send Activation Email</span>
                  </CDropdownItem>
                  <CDropdownItem>
                    <i className="fa fa-trash" />
                    <span className="text-rl">Delete</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
    ],
    [],
  )

  const data = useMemo(() => (branches && branches.length > 0 ? branches : []), [branches])

  const fetcBranchData = useCallback(() => dispatch(fetchBranches()), [dispatch])

  useEffect(() => {
    fetcBranchData()
  }, [fetcBranchData])

  return (
    <>
      <div className="tab-pane fade show active" id="general_user_details" role="tabpanel">
        <div className="d-block bg-white p-3 rounded">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="d-flex flex-column gutter-b">
                <div className="d-flex justify-content-between">
                  <h4 className="cstPageTitle">Branches</h4>
                  <CButton color="primary" size="sm" onClick={(e) => handleBranchModal(e)}>
                    <i className="fa fa-plus mr-2" />
                    Create Branch
                  </CButton>
                </div>
                <CCardBody className="p-0">
                  <div className="pageContainer-wrapper">
                    <Table columns={columns} data={data} />
                  </div>
                </CCardBody>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* create user modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollable
        size="lg"
        visible={branchModal}
        onClose={() => closeBranchModal()}
      >
        <CModalHeader>
          <CModalTitle className="ml-2">Branch Information</CModalTitle>
        </CModalHeader>
        <CModalBody className="p-2">
          <div className="pageContainer-wrapper">
            <div className="pageBoxSizing-container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="row">
                    <div className="co-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="form-group">
                        <label className="control-label" htmlFor="branch_name">
                          Branch Name
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          placeholder="Branch name"
                          type="text"
                          name="branchName"
                          id="branch_name"
                          // value={branchData.branchName}
                          // onChange={(e) => handleChangeForm(e)}
                          // invalid={
                          //   companyErrors && !isEmpty(companyErrors.branchName) ? true : false
                          // }
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'branchName',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.branchName}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group company_city_name">
                        <label className="control-label" htmlFor="company_city_name">
                          City
                        </label>
                        <div className="input-group">
                          <Select
                            id="company_city_name"
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder
                            // isLoading={fetchingCities ? true : false}
                            isSearchable
                            name="cityId"
                            // value={loadDataValue.loadCity}
                            // options={
                            //   cities && !fetchingCities && cities.length > 0
                            //     ? cities.map((itm) => ({
                            //         label: itm.name,
                            //         value: itm,
                            //       }))
                            //     : []
                            // }
                            className={classNames('form-control form-control-cst pageCstSelect ', {
                              'is-invalid': companyErrors && !isEmpty(companyErrors.cityId),
                            })}
                            // noOptionsMessage={() => noOptionCity()}
                            // onChange={(e) => handleSelectForm('cityId', e)}
                            // onMenuOpen={(e) => handleSelectFocus('cityId', e)}
                          />
                          <CFormFeedback invalid className="fieldError-cst">
                            {companyErrors.cityId}
                          </CFormFeedback>
                        </div>
                        {/*                               
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="cityId"
                                id="company_city_name"
                                value={branchData.cityId}
                                onChange={(e) => handleChangeForm(e)}
                                invalid={
                                  companyErrors && !isEmpty(companyErrors.cityId) ? true : false
                                }
                                onFocus={() =>
                                  dispatch(
                                    clearCompanyError({
                                      type: 'cityName',
                                      errorType: 'errCompany',
                                    }),
                                  )
                                }
                              /> */}
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group select company_country_id">
                        <label className="control-label select" htmlFor="company_country_id">
                          Country
                        </label>
                        <div className="input-group">
                          <Select
                            key={'cstSelect-countryId'}
                            className={classNames('form-control form-control-cst pageCstSelect ', {
                              'is-invalid': companyErrors && !isEmpty(companyErrors.countryId),
                            })}
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder="-Select-"
                            isSearchable
                            // value={loadDataValue.loadCountry}
                            // isLoading={countryData && !countryData.length > 0 ? true : false}
                            id="company_country_id"
                            // options={
                            //   countryData && countryData.length > 0
                            //     ? countryData.map((item) => ({
                            //         value: item.value,
                            //         label: `${item.value ? item.value + '-' : ''}${item.label}`,
                            //       }))
                            //     : []
                            // }
                            noOptionsMessage={() => 'No results found'}
                            onChange={(val) => handleSelectForm('countryId', val)}
                            onFocus={(e) => handleSelectFocus('countryId', e)}
                          />
                          <CFormFeedback invalid className="fieldError-cst">
                            {companyErrors.countryId}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="form-group text company_address">
                        <label className="control-label text" htmlFor="company_address">
                          Address
                        </label>
                        <CFormTextarea
                          className="form-control-cst text"
                          rows="1"
                          name="address"
                          id="company_address"
                          // value={branchData.address}
                          // onChange={(e) => handleChangeForm(e)}
                          // invalid={companyErrors && !isEmpty(companyErrors.address) ? true : false}
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'address',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        ></CFormTextarea>
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.address}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group company_eori_code">
                        <label className="control-label" htmlFor="company_eori_code">
                          EORI No
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          type="text"
                          name="eoriCode"
                          id="company_eori_code"
                          value={branchData.eoriCode}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={companyErrors && !isEmpty(companyErrors.eoriCode) ? true : false}
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'eoriCode',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.eoriCode}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group company_taxoffice">
                        <label className="control-label" htmlFor="company_taxoffice">
                          Deferment Acc. No
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          type="text"
                          name="taxOffice"
                          id="company_taxoffice"
                          value={branchData.taxOffice}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            companyErrors && !isEmpty(companyErrors.taxOffice) ? true : false
                          }
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'taxOffice',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.taxOffice}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                      <div className="form-group company_taxno">
                        <label className="control-label" htmlFor="company_taxno">
                          Tax No
                        </label>
                        <CFormInput
                          className="form-control-cst"
                          type="text"
                          name="taxNo"
                          id="company_taxno"
                          value={branchData.taxNo}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={companyErrors && !isEmpty(companyErrors.taxNo) ? true : false}
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'taxNo',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback
                          invalid={companyErrors && !isEmpty(companyErrors.taxNo) ? true : false}
                          className="fieldError-cst"
                        >
                          {companyErrors.taxNo}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group select company_branch_id">
                        <label className="control-label select" htmlFor="company_branch_id">
                          Branch
                        </label>
                        <CFormSelect
                          className="form-control-cst select"
                          name="branchId"
                          id="company_branch_id"
                          value={branchData.branchId}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={companyErrors && !isEmpty(companyErrors.branchId) ? true : false}
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'branchId',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        >
                          <option value="1380">Head Office</option>
                        </CFormSelect>
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.branchId}
                        </CFormFeedback>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group">
                        <label className="control-label" htmlFor="company_tel">
                          Telephone
                        </label>
                        <CFormInput
                          className="form-control-cst mask_phone"
                          type="text"
                          name="companyTel"
                          id="company_tel"
                          value={branchData.companyTel}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyTel) ? true : false
                          }
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'companyTel',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.companyTel}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group company_fax">
                        <label className="control-label" htmlFor="company_fax">
                          Fax
                        </label>
                        <CFormInput
                          className="form-control-cst mask_phone"
                          type="text"
                          name="companyFax"
                          id="company_fax"
                          value={branchData.companyFax}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyFax) ? true : false
                          }
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'companyFax',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyFax) ? true : false
                          }
                          className="fieldError-cst"
                        >
                          {companyErrors.companyFax}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group email company_email">
                        <label className="control-label email" htmlFor="company_email">
                          E-mail
                        </label>
                        <CFormInput
                          className="form-control-cst string email"
                          type="email"
                          name="companyEmail"
                          id="company_email"
                          value={branchData.companyEmail}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyEmail) ? true : false
                          }
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'companyEmail',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        />
                        <CFormFeedback
                          invalid={
                            companyErrors && !isEmpty(companyErrors.companyEmail) ? true : false
                          }
                          className="fieldError-cst"
                        >
                          {companyErrors.companyEmail}
                        </CFormFeedback>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group select company_branch_id">
                        <label className="control-label select" htmlFor="company_branch_id">
                          Branch
                        </label>
                        <CFormSelect
                          className="form-control-cst select"
                          name="branchId"
                          id="company_branch_id"
                          value={branchData.branchId}
                          onChange={(e) => handleChangeForm(e)}
                          invalid={companyErrors && !isEmpty(companyErrors.branchId) ? true : false}
                          // onFocus={() =>
                          //   dispatch(
                          //     clearCompanyError({
                          //       type: 'branchId',
                          //       errorType: 'errCompany',
                          //     }),
                          //   )
                          // }
                        >
                          <option value="1380">Head Office</option>
                        </CFormSelect>
                        <CFormFeedback invalid className="fieldError-cst">
                          {companyErrors.branchId}
                        </CFormFeedback>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <div className="form-group select company_saler_id">
                        <label className="control-label select" htmlFor="company_saler_id">
                          A/C Rep.
                        </label>
                        <div className="input-group">
                          <Select
                            className={classNames('form-control form-control-cst pageCstSelect ')}
                            classNamePrefix="cstSelect"
                            isClearable
                            placeholder
                            isSearchable
                            id="company_sector"
                            options={[
                              { label: '', value: '' },
                              { label: 'Kennedy Peter', value: '1234' },
                            ]}
                            menuPlacement="auto"
                            noOptionsMessage={() => 'No results found'}
                            onChange={(e) => handleSelectForm('companySalerId', e)}
                            onFocus={(e) => handleSelectFocus('companySalerId', e)}
                          />
                          <CFormFeedback
                            invalid={
                              companyErrors && !isEmpty(companyErrors.companySalerId) ? true : false
                            }
                            className="fieldError-cst"
                          >
                            {companyErrors.companySalerId}
                          </CFormFeedback>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}

GeneralBranches.propTypes = {
  company: PropTypes.object,
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
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

export default GeneralBranches
