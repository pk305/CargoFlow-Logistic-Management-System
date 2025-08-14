import React from 'react'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import PropTypes from 'prop-types'
import { AppHeaderDropdown } from './header/index'
import { isNull } from 'lodash'
import { getLocalData, storeLocalData, triggerEvent } from 'src/config/helpers'
import logo from 'src/assets/brand/truck-logo.png'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AppHeader = ({ setShowInfo }) => {
  const { authUser } = useSelector((state) => state.auth)
  const showHideMenu = () => {
    const sShow = getLocalData('sidebarShow')
    if (!isNull(sShow)) {
      storeLocalData('sidebarShow', !sShow)
      triggerEvent('sidebarShow:click', !sShow)
    } else {
      storeLocalData('sidebarShow', true)
      triggerEvent('sidebarShow:click', true)
    }
  }

  const handleSwitchAcc = (e) => {
    e.preventDefault(e)
  }

  return (
    <CHeader position="sticky">
      <CContainer fluid>
        <CHeaderToggler className="ps-1" onClick={() => showHideMenu()}>
          <i className="fas fa-bars icon icon-lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem className="company-title">
            <CNavLink
              to="/"
              component={NavLink}
              onClick={(e) => handleSwitchAcc(e)}
              activeClassName="active"
              className="menu-link btn btn-bg-white btn-hover-secondary"
            >
              <span className="menu-text">
                {authUser && authUser.company && authUser.company.name}{' '}
                <i className="fa icon-sm fa-chevron-down ml-2 font-weight-bolder"></i>
              </span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#" className="mr-2">
              <i className="far fa-bell icon icon-lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#" className="">
              <i className="far fa-envelope icon icon-lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown setShowInfo={setShowInfo} />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

AppHeader.propTypes = {
  setShowInfo: PropTypes.func,
}

export default AppHeader
