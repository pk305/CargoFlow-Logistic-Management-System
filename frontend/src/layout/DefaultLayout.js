import React, { useEffect, useState, useCallback } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import Noty from 'noty'
import { useDispatch } from 'react-redux'
import { checkUserAuthenticated } from 'src/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import $ from 'jquery'
import { isNull } from 'lodash'
import { onEvent, getLocalData, storeLocalData } from 'src/config/helpers'
import { CCard, CCardBody, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import changelogPreview from './Resources/changelog.txt'

Noty.overrideDefaults({
  layout: 'topRight',
  theme: 'nest',
  timeout: 6000,
  progressBar: false,
  // closeWith: ['click', 'button'],
})

const DefaultLayout = () => {
  const dispatch = useDispatch()
  const { authUser } = useSelector((state) => state.auth)
  const { search } = useLocation()
  const [mainUnfoldable, setMainUnfoldable] = useState(false)
  const [mainSidebar, setMainSidebar] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const handleActiveNav = useCallback(() => {
    const checkList = (tx, idx, itm) => {
      const list = $(tx).attr('href')
      const qry = list.split('?')[1]
      if (search.toString() === `?${qry}`) {
        $(tx).addClass('active')
      } else {
        $(tx).removeClass('active')
      }
    }

    $('.act-trans').each(function (idx, item) {
      const tx = this
      checkList(tx, idx, item)
    })
    $('.act-pos').each(function (idx, item) {
      const tx = this
      checkList(tx, idx, item)
    })
    $('.act-log').each(function (idx, item) {
      const tx = this
      checkList(tx, idx, item)
      $('.reportgroup-link').addClass('show')
    })
  }, [search])

  const handleSetSidebar = useCallback((sShow) => {
    setMainSidebar(sShow)
  }, [])

  const handleSetUnfoldable = useCallback((sUnfoldable) => {
    setMainUnfoldable(sUnfoldable)
  }, [])

  const handleChangeSideBar = useCallback((e) => {
    setMainSidebar(e)
  }, [])

  const handleChangeUnfoldable = useCallback((e) => {
    setMainUnfoldable(e)
  }, [])

  useEffect(() => {
    document.title = 'Nueklabs TMS'
    //
    handleActiveNav()

    //sidebarShow
    const sShow = getLocalData('sidebarShow')
    if (!isNull(sShow)) {
      handleSetSidebar(sShow)
    }
    onEvent('sidebarShow:click', (e) => handleChangeSideBar(e.detail))
    //sidebarUnfoldable
    const sUnfoldable = getLocalData('sidebarUnfoldable')
    if (!isNull(sUnfoldable)) {
      handleSetUnfoldable(sUnfoldable)
    }
    onEvent('sidebarUnfoldable:click', (e) => handleChangeUnfoldable(e.detail))
  }, [
    handleActiveNav,
    handleChangeSideBar,
    handleSetSidebar,
    handleChangeUnfoldable,
    handleSetUnfoldable,
  ])

  const closeShowInfo = () => {
    storeLocalData('changelog', false)
    setShowInfo(false)
  }

  useEffect(() => {
    if (!authUser) {
      dispatch(checkUserAuthenticated({ clientId: new Date() }))
    }
    // changelog
    if (isNull(getLocalData('changelog'))) {
      storeLocalData('changelog', true)
      setShowInfo(true)
    } else {
      if (getLocalData('changelog')) {
        setShowInfo(true)
      } else {
        setShowInfo(false)
      }
    }
  }, [authUser, dispatch])

  return (
    <div id="mainWrapperElement">
      <AppSidebar mainUnfoldable={mainUnfoldable} mainSidebar={mainSidebar} />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader
          mainSidebar={mainSidebar}
          mainUnfoldable={mainUnfoldable}
          setShowInfo={setShowInfo}
        />
        <div className="body flex-grow-1 px-1">
          <AppContent />
        </div>
        <AppFooter />

        {/* show info modal */}
        <CModal
          className="animate__animated animate__fadeIn"
          backdrop={'static'}
          keyboard={false}
          portal={false}
          transition={false}
          scrollable
          size="lg"
          visible={showInfo}
          onClose={() => closeShowInfo()}
        >
          <CModalHeader>
            <CModalTitle className="ml-2">Nueklabs TMS Changelog v1.0.0</CModalTitle>
          </CModalHeader>
          <CModalBody className="p-2 bg-white">
            <CCard className="cardCustom gutter-b" style={{ boxShadow: 'none' }}>
              <CCardBody style={{ padding: '0px', margin: '0px', background: '#ebedf3' }}>
                <object data={changelogPreview} style={{ width: '100%', height: '75vh' }}>
                  Browser not supported{' '}
                </object>
              </CCardBody>
            </CCard>
          </CModalBody>
        </CModal>
      </div>
    </div>
  )
}

export default DefaultLayout
