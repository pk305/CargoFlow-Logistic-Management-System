import React, { useCallback, useEffect, useRef } from 'react'
import { CRow, CCol, CButton } from '@coreui/react'
import $ from 'jquery'
import PropTypes from 'prop-types'

const LogoUpload = ({ setCurrentAvatar, currentAvatar }) => {
  const fileRef = useRef(null)

  const handleDropClick = (e, n) => {
    e.preventDefault()
    if (n === 'currentAvatar') {
      fileRef.current.click()
    }
  }

  const handleRemoveFile = (e, n) => {
    e.preventDefault()
    if (n === 'currentAvatar') {
      setCurrentAvatar(null)
    }
  }

  const handleDragOver = useCallback(() => {
    //prevent default
    $('#dragAndDrop--logoDragAndDrop').on(
      'dragenter dragstart dragend dragleave dragover drag drop',
      function (e) {
        e.stopPropagation()
        e.preventDefault()
        const el = $(this)
        if (e.handleObj.type === 'dragenter') {
          $(this).css({ backgroundColor: '#eaeaea', border: '2px dashed #adadad' })
        }

        if (e.handleObj.type === 'dragleave') {
          $(this).css({ backgroundColor: '', border: '1px solid #adadad' })
        }

        if (e.handleObj.type === 'drop') {
          if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
            e.preventDefault()
            e.stopPropagation()
            /*UPLOAD FILES HERE*/
            const file = e.originalEvent.dataTransfer.files[0]
            let fileReader = new FileReader()
            fileReader.onload = (function (file) {
              return function (event) {
                $(el).css({ backgroundColor: '', border: '1px solid #adadad' })
                setCurrentAvatar(event.target.result)
              }
            })(file)
            fileReader.readAsDataURL(file)
          }
        }
      },
    )
  }, [setCurrentAvatar])

  const handleFileUpload = (e, n) => {
    if (n === 'currentAvatar') {
      const file = e.target.files[0]
      if (file) {
        let fileReader = new FileReader()
        fileReader.onload = (function (file) {
          return function (event) {
            setCurrentAvatar(event.target.result)
          }
        })(file)
        fileReader.readAsDataURL(file)
      }
    }
  }

  useEffect(() => {
    handleDragOver()
  }, [handleDragOver])

  return (
    <div>
      <CRow>
        <CCol sm={6} md={12} lg={6} xl={6}>
          <div className="form-group">
            <label className="control-label" htmlFor="logo">
              Company Logo
            </label>
            <div
              id="dragAndDrop--logoDragAndDrop"
              className="zc-drag-drop zc-borderradius-four zc-boxsizing"
            >
              <div
                id="zc-upload-preview--logoDragAndDrop"
                className="zc-drag-drop-img"
                style={{ display: !currentAvatar ? 'none' : '' }}
              >
                <img
                  id="zc-upload-preview-img--logoDragAndDrop"
                  src={currentAvatar}
                  alt=""
                  title=""
                  width="120px"
                />

                <div className="zc-upload-button-container">
                  <CButton
                    id="img-upload-cancel--logoDragAndDrop"
                    className="btn btn-outline-secondary mr-3"
                    aria-label="Remove"
                    tabIndex="0"
                    role="button"
                    onClick={(e) => handleRemoveFile(e, 'currentAvatar')}
                  >
                    <span className="zbutton__text">Remove</span>
                  </CButton>
                  <CButton
                    style={{ left: '245px' }}
                    color="secondary"
                    variant="outline"
                    onClick={(e) => handleDropClick(e, 'currentAvatar')}
                  >
                    <span className="zbutton__text">Change</span>
                  </CButton>
                  <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>
              <div
                id="zc-upload-content--logoDragAndDrop"
                style={{ display: !currentAvatar ? '' : 'none' }}
              >
                <div className="zc-drag-drop-title">
                  Drag and drop your file <span> OR</span>
                </div>
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={(e) => handleDropClick(e, 'currentAvatar')}
                >
                  <span className="zbutton__text">Browse</span>
                </CButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'currentAvatar')}
                />
                <div className="zc-drag-drop-info">
                  Uploading requires Image (.jpg, .jpeg, .png, ..) format
                </div>
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  )
}

LogoUpload.propTypes = {
  setCurrentAvatar: PropTypes.func,
  currentAvatar: PropTypes.string,
}

export default LogoUpload
