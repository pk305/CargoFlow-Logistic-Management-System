import React from 'react'
import PropTypes from 'prop-types'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'

const TabDocs = (props) => {
  const { children, handleNavLink, query, visible } = props

  return (
    <>
      <div className="card-header cstHeaderTabs-line">
        <div className="cstHeaderNav">
          <CNav variant="tabs" className="nav-tabs-line nav-bold nav-tabs-line-2x">
            <CNavItem>
              <CNavLink
                onClick={(e) => handleNavLink(e, '?scope=general_info')}
                active={
                  query.get('scope') === 'general_info' || query.get('scope') === null
                    ? true
                    : false
                }
              >
                <span className="nav-icon">
                  <i className="fa fa-layer-group ico"></i>
                </span>
                <span className="nav-text">General Info</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                onClick={(e) => handleNavLink(e, '?scope=users')}
                active={query.get('scope') === 'users' ? true : false}
              >
                <span className="nav-icon">
                  <i className="fa fa-users ico"></i>
                </span>
                <span className="nav-text">Users</span>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                onClick={(e) => handleNavLink(e, '?scope=branches')}
                active={query.get('scope') === 'branches' ? true : false}
              >
                <span className="nav-icon">
                  <i className="fa fa-building ico"></i>
                </span>
                <span className="nav-text">Branches</span>
              </CNavLink>
            </CNavItem>
          </CNav>
        </div>
      </div>

      <CTabContent className="cstTabContent ">
        <CTabPane className="fade" visible={visible}>
          {children}
        </CTabPane>
      </CTabContent>
    </>
  )
}

TabDocs.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  handleNavLink: PropTypes.func,
  query: PropTypes.object,
  visible: PropTypes.bool,
}

export default TabDocs
