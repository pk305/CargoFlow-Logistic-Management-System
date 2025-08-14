import React from 'react'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// import logo from 'src/assets/brand/truck-logo.png'
import miniLogo from 'src/assets/brand/brand.png'
import { storeLocalData, getLocalData, triggerEvent } from 'src/config/helpers'
import { isNull } from 'lodash'
import PropTypes from 'prop-types'
// sidebar nav config
import navigation from '../_nav'

const AppSidebar = ({ mainUnfoldable, mainSidebar }) => {
  const showHideMiniMenu = () => {
    const sUnfoldable = getLocalData('sidebarUnfoldable')
    if (isNull(sUnfoldable)) {
      storeLocalData('sidebarUnfoldable', !sUnfoldable)
      triggerEvent('sidebarUnfoldable:click', !sUnfoldable)
    } else {
      storeLocalData('sidebarUnfoldable', true)
      triggerEvent('sidebarUnfoldable:click', true)
    }
  }

  const showHideMainMenu = (visible) => {
    const sShow = getLocalData('sidebarShow')
    if (isNull(sShow)) {
      storeLocalData('sidebarShow', !sShow)
      storeLocalData('sidebarUnfoldable', true)
      console.log('logb')
    } else {
      storeLocalData('sidebarShow', true)
    }
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={mainUnfoldable}
      visible={mainSidebar}
      onVisibleChange={(visible) => showHideMainMenu(visible)}
    >
      <CSidebarBrand
        className="d-none d-md-flex"
        to="/"
        style={{
          minWidth: '53px',
          maxWidth: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0px',
          margin: '0px',
          background: '#fff',
          borderRight: '1px solid #ebedef',
        }}
      >
        <CImage
          src={miniLogo}
          style={{ maxWidth: '100%', objectFit: 'cover', height: '52px' }}
          alt=""
        />
        <div className="sidebar-brand-full animate__animated animate__fadeIn">
          <span
            style={{
              color: '#000',
              padding: '0.5rem',
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: '"La Belle Aurore", cursive',
              transition: 'all 0.15s ease',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Nueklabs TMS
          </span>
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => showHideMiniMenu()} />
    </CSidebar>
  )
}

AppSidebar.propTypes = {
  mainUnfoldable: PropTypes.bool,
  mainSidebar: PropTypes.bool,
}
export default React.memo(AppSidebar)
