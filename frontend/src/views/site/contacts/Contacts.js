import React, { useState, useMemo, useCallback } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CButtonGroup,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
  CPaginationItem,
  CPagination,
  CDropdownDivider,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModal,
  CModalFooter,
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
  destroyContact,
  fetchContacts,
  findContact,
  updateContact,
} from 'src/redux/slices/contactSlice'
import { matchSorter } from 'match-sorter'
import classNames from 'classnames'
import loaderLg from 'src/assets/loader/loaderLg.gif'
import Noty from 'noty'
import $ from 'jquery'
import { isEmpty } from 'lodash'
import SlidingPane from 'react-sliding-pane'
import ContactPanel from './ContactPanel'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <>
      <CFormInput
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
DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
  setGlobalFilter: PropTypes.func,
}

const fuzzyTextFilterFn = (page, id, filterValue) => {
  return matchSorter(page, filterValue, { keys: [(row) => row.values[id]] })
}
fuzzyTextFilterFn.propTypes = {
  page: PropTypes.array,
  id: PropTypes.number,
  filterValue: PropTypes.array,
}

fuzzyTextFilterFn.autoRemove = (val) => !val

const Table = ({ columns, data }) => {
  const [showFilter, setShowFilter] = useState(false)
  const { fetchingContacts } = useSelector((state) => state.contact)

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
            {fetchingContacts ? (
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
        {!fetchingContacts && (
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

const Contacts = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [breadcrumbList] = useState([
    { name: 'Companies', pathname: '/companies' },
    { name: 'Contacts', pathname: '/contacts', active: true },
    { name: 'Quotations', pathname: '/leads' },
    { name: 'Company Notes', pathname: '/notices' },
    { name: 'Prospects', pathname: '/opportunities' },
    { name: 'Contracts', pathname: '/contracts' },
    { name: 'Tenders', pathname: '/tenders' },
  ])
  const { contacts } = useSelector((state) => state.contact)
  const [socialModal, setSocialModal] = useState(false)
  const { updatingContact, contactErrors } = useSelector((state) => state.contact)
  const [socialProfileData, setSocialProfileData] = useState({
    contactName: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  })
  const [contactId, setContactId] = useState(null)
  const [contactPanel, setContactPanel] = useState(false)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setSocialProfileData({
      ...socialProfileData,
      [name]: value,
    })
  }

  const handleSetProfile = useCallback(
    async (e, item) => {
      e.preventDefault()
      $('.dropdown-menu').removeClass('show')
      setContactId(item.linkId)
      const resData = await dispatch(findContact(item.linkId)).unwrap()
      if (resData) {
        setSocialProfileData(() => ({
          contactName: resData.name ? resData.name : '',
          twitter: resData.twitter ? resData.twitter : '',
          linkedin: resData.linkedin ? resData.linkedin : '',
          facebook: resData.facebook ? resData.facebook : '',
          instagram: resData.instagram ? resData.instagram : '',
        }))
      }
      setSocialModal(true)
    },
    [dispatch],
  )

  const closeSocialModal = () => {
    setSocialModal(false)
  }

  const handleSetContact = useCallback((e, item) => {
    e.preventDefault()
    setContactId(item.linkId)
    setContactPanel(true)
  }, [])

  const closeContactPanel = () => {
    setContactPanel(false)
  }

  const handleSubmitContact = async (e) => {
    e.preventDefault()
    const resData = await dispatch(updateContact({ Id: contactId, ...socialProfileData })).unwrap()
    if (resData) {
      new Noty({
        type: 'alert',
        layout: 'topCenter',
        id: 'Qdwpdu12',
        text: 'Contact has been updated succesfully',
      }).show()

      setSocialModal(false)
      clearSocialProfileData()
    }
  }

  const clearSocialProfileData = () => {
    setSocialProfileData({
      contactName: '',
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
    })
  }

  const toLink = useCallback(
    (e, link) => {
      e.preventDefault()
      history.push(link)
    },
    [history],
  )

  const handleDeleteContact = useCallback(
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
              const resData = await dispatch(destroyContact(item.id)).unwrap()
              if (resData) {
                new Noty({
                  type: 'alert',
                  layout: 'topCenter',
                  id: 'sjsios1',
                  text: 'Contact has been deleted succesfully',
                }).show()
                history.push('/contacts')
              }
              n.close()
            },
            { id: 'deltItm' },
          ),

          Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
            n.close()
          }),
        ],
      })
      n.show()
    },
    [dispatch, history],
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
                  {/* eslint-disable-next-line react/prop-types */}
                  <CDropdownItem onClick={(e) => toLink(e, `/contacts/edit/${original.linkId}`)}>
                    <i className="fa fa-edit mr-2" /> Edit
                  </CDropdownItem>
                  <CDropdownItem onClick={(e) => handleSetProfile(e, original)}>
                    <i className="fa fa-globe mr-2" />
                    Social Media
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem onClick={(e) => handleDeleteContact(e, original)}>
                    <i className="fa fa-trash mr-2" /> Delete
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          </div>
        ),
      },
      {
        Header: 'Full Name',
        accessor: 'name',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <div className="link-search-hover">
            <div>
              {/*  eslint-disable-next-line react/prop-types */}
              <Link to={`/contacts/${original.linkId}`}>{value}</Link>
            </div>
            <div className="btn-search-hover">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                className="btn btn-xs btn-pill btn-icon btn-primary ml-2"
                href="#"
                onClick={(e) => handleSetContact(e, original)}
              >
                <i className="fa fa-search"></i>
              </a>
            </div>
          </div>
        ),
      },
      {
        Header: <span>Company</span>,
        accessor: 'company.name',
      },
      {
        Header: <span>Job Title</span>,
        accessor: 'jobTitle',
      },

      {
        Header: <span>Phone</span>,
        accessor: 'telephone',
        // eslint-disable-next-line react/prop-types
        Cell: ({ value, row: { original } }) => (
          <span>
            {/* eslint-disable-next-line react/prop-types */}
            {value} / {original.gsm}
          </span>
        ),
      },
      {
        Header: <span>Mail</span>,
        accessor: 'email',
      },
    ],
    [toLink, handleDeleteContact, handleSetProfile, handleSetContact],
  )

  const data = useMemo(() => (contacts && contacts.length > 0 ? contacts : []), [contacts])

  const fetchContactData = useCallback(() => dispatch(fetchContacts()), [dispatch])

  useEffect(() => {
    document.title = 'Contacts'
    //
    fetchContactData()
  }, [fetchContactData])

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
                      <h3 className="cstCardbodyHeaderTitle">Contacts</h3>
                    </div>
                  </div>
                </div>
                <div className="customHeaderToolbar">
                  <CButtonGroup>
                    <CButton color="primary" active onClick={(e) => toLink(e, '/contacts/new')}>
                      <i className="fa fa-plus mr-2" /> Create Contact
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

      {/* edit social profile modal */}
      <CModal
        className="animate__animated animate__fadeIn"
        backdrop={'static'}
        keyboard={false}
        portal={false}
        transition={false}
        scrollableprint
        visible={socialModal}
        onClose={(e) => closeSocialModal(e)}
      >
        <CModalHeader>
          <CModalTitle>Edit Social Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-12 col-xl-12">
              <div className="form-group contact_twitter">
                <label className="control-label string optional" htmlFor="contact_twitter">
                  Twitter
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                  </div>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    id="contact_twitter"
                    name="twitter"
                    value={socialProfileData.twitter}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={contactErrors && !isEmpty(contactErrors.twitter) ? true : false}
                  />
                  <CFormFeedback
                    invalid={contactErrors && !isEmpty(contactErrors.twitter) ? true : false}
                    className="fieldError-cst"
                  >
                    {contactErrors.twitter}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-12 col-xl-12">
              <div className="form-group contact_instagram">
                <label className="control-label string optional" htmlFor="contact_instagram">
                  Instagram
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                  </div>
                  <CFormInput
                    className="form-control-cst"
                    type="text"
                    name="instagram"
                    id="contact_instagram"
                    value={socialProfileData.instagram}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={contactErrors && !isEmpty(contactErrors.instagram) ? true : false}
                  />
                  <CFormFeedback
                    invalid={contactErrors && !isEmpty(contactErrors.instagram) ? true : false}
                    className="fieldError-cst"
                  >
                    {contactErrors.instagram}
                  </CFormFeedback>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-12 col-xl-12">
              <div className="form-group contact_linkedin">
                <label className="control-label string optional" htmlFor="contact_linkedin">
                  Linkedin
                </label>
                <CFormInput
                  className="form-control-cst string optional"
                  placeholder="Link of linkedin profile"
                  type="text"
                  name="linkedin"
                  id="contact_linkedin"
                  value={socialProfileData.linkedin}
                  onChange={(e) => handleChangeForm(e)}
                  invalid={contactErrors && !isEmpty(contactErrors.linkedin) ? true : false}
                />
                <CFormFeedback
                  invalid={contactErrors && !isEmpty(contactErrors.linkedin) ? true : false}
                  className="fieldError-cst"
                >
                  {contactErrors.linkedin}
                </CFormFeedback>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-12 col-xl-12">
              <div className="form-group contact_facebook">
                <label className="control-label string optional" htmlFor="contact_facebook">
                  Facebook
                </label>
                <CFormInput
                  className="form-control-cst string optional"
                  placeholder="Link of facebook profile"
                  name="facebook"
                  id="contact_facebook"
                  value={socialProfileData.facebook}
                  onChange={(e) => handleChangeForm(e)}
                  invalid={contactErrors && !isEmpty(contactErrors.facebook) ? true : false}
                />
                <CFormFeedback
                  invalid={contactErrors && !isEmpty(contactErrors.facebook) ? true : false}
                  className="fieldError-cst"
                >
                  {contactErrors.facebook}
                </CFormFeedback>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="success"
            className="btn-default btn btn-success"
            disabled={updatingContact ? true : false}
            onClick={(e) => handleSubmitContact(e)}
          >
            {updatingContact ? (
              'Processing...'
            ) : (
              <span>
                Save <i className="fa fa-check" />
              </span>
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* contact panel */}
      <SlidingPane
        className="cstSlidePanel"
        overlayClassName="cstSlidePanelOverlay"
        isOpen={contactPanel}
        title={
          <div className="space">
            <div>
              <span>Contact</span>
            </div>
            <div>
              <button
                className="btn btn-close"
                aria-label="Close"
                onClick={(e) => closeContactPanel(e)}
              ></button>
            </div>
          </div>
        }
        onRequestClose={(e) => e.preventDefault()}
        shouldCloseOnEsc
        backdrop="static"
      >
        <div>
          <ContactPanel
            closeContactPanel={closeContactPanel}
            contactId={contactId}
            setContactId={setContactId}
            handleSetProfile={handleSetProfile}
          />
        </div>
      </SlidingPane>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
}

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func,
}

export default Contacts
