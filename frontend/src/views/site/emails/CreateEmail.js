import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'trix/dist/trix'
import 'trix/dist/trix.css'
import { TrixEditor } from 'react-trix'
import { CButton, CCard, CCardBody, CFormFeedback, CFormInput, CFormTextarea } from '@coreui/react'
import Select from 'react-select'
import classNames from 'classnames'
import { isEmpty, isNull } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { clearMailError } from 'src/redux/slices/mailSlice'
import { fetchContacts } from 'src/redux/slices/contactSlice'
import { useLocation } from 'react-router-dom'
import { findTempdoc, pdfDownloadTempdoc } from 'src/redux/slices/tempdocSlice'
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { Dashboard } from '@uppy/react'

const CreateEmail = () => {
  const dispatch = useDispatch()
  const { contacts, fetchingContacts } = useSelector((state) => state.contact)
  const { mailErrors } = useSelector((state) => state.mail)
  const [mailData, setMailData] = useState({
    toIds: '',
    ccIds: '',
    cc: '',
    to: '',
    title: '',
    sendCopyToMe: '1',
    trixContent:
      'Hi;<br><br>You can find your receipt attached to this email.<br><br>Best Regards.',
  })
  const [htmlData, setHtmlData] = useState(null)
  const [tempdocDataId, setTempdocDataId] = useState(null)

  const handleChangeForm = (e) => {
    const { name, value } = e.target
    setMailData({
      ...mailData,
      [name]: value,
    })
  }

  const handleCheckedForm = (e) => {
    const { name, checked } = e.target
    if (checked) {
      setMailData({
        ...mailData,
        [name]: '1',
      })
    } else {
      setMailData({
        ...mailData,
        [name]: '0',
      })
    }
  }

  const handleSelectForm = (c, val) => {
    const e = {
      target: {
        name: c,
        value: !isNull(val) ? val.value : '',
      },
    }
    handleChangeForm(e)
  }

  const handleSelectFocus = (c, _) => {
    dispatch(clearMailError({ type: c, errorType: 'errMail' }))

    if (c === 'toIds' || c === 'ccIds') {
      if (isEmpty(contacts)) {
        dispatch(fetchContacts())
      }
    }
  }

  const pdfDownload = async (e) => {
    e.preventDefault()
    if (tempdocDataId) {
      //form data
      let formData = new FormData()
      formData.append('tempdocDataId', tempdocDataId)
      await dispatch(pdfDownloadTempdoc(formData)).unwrap()
    }
  }

  const useQuery = () => {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
  }

  let query = useQuery()

  const findTempdata = useCallback(async () => {
    const tempId = query.get('tempdoc_id')
    const resData = await dispatch(findTempdoc(tempId)).unwrap()
    if (resData) {
      console.log(resData)
      setTempdocDataId(resData.uuid)
      setHtmlData(JSON.parse(JSON.parse(resData.htmlData)))
      setMailData((state) => ({
        ...state,
        title: `${resData.itemDoc.name} referenced ${resData.itemDoc.type}`,
      }))
    }
  }, [dispatch, query])

  const handleChangeEditor = (html, text) => {
    setMailData({
      ...mailData,
      trixContent: text,
    })
  }

  const uppy = new Uppy({
    autoProceed: true,
    debug: true,
    restrictions: {
      maxFileSize: 1000000,
      maxNumberOfFiles: 3,
      minNumberOfFiles: 1,
      // allowedFileTypes: ['image/*', 'video/*'],
    },
  })

  // uppy.use(Tus, { endpoint: '/' })
  uppy.use(Tus, {
    endpoint: 'http://localhost:8000/files/', // use your tus endpoint here
    // retryDelays: [0, 1000, 3000, 5000],
    headers: {
      // authorization: `Bearer ${window.getCurrentUserToken()}`,
      // expires: file.meta.expires,
    },
    // withCredentials
    limit: 5,
    // onSuccess: function () {
    //   var upload2 = new tus.Upload(file2, {
    //     endpoint: 'http://localhost:1080/files/',
    //     onSuccess: function () {
    //       console.log('Uploads done')
    //     },
    //   })

    //   // Start the second upload
    //   upload2.start()
    // },
    // async onBeforeRequest(req) {
    //   const token = await getAuthToken()
    //   req.setHeader('Authorization', `Bearer ${token}`)
    // },
    // onShouldRetry(err, retryAttempt, options, next) {
    //   if (err?.originalResponse?.getStatus() === 401) {
    //     return true
    //   }
    //   return next(err)
    // },
    // async onAfterResponse(req, res) {
    //   if (res.getStatus() === 401) {
    //     await refreshAuthToken()
    //   }
    // },
  })

  uppy.on('complete', (result) => {
    // const url = result.successful[0].uploadURL

    console.log(result)
    // store.dispatch({
    //   type: 'SET_USER_AVATAR_URL',
    //   payload: { url },
    // })
  })

  useEffect(() => {
    findTempdata()
  }, [findTempdata])

  return (
    <div className="setupProccessContainer">
      <div className="pageContainer">
        <div className="container-fluid h-100">
          <div className="d-block"></div>
          <CCard className="cardCustom">
            <div className="card-header">
              <div className="toolBarContainer">
                <div className="customHeaderContainer">
                  <div className="customHeaderContainer-body">
                    <div className="symbolWrapper">
                      <span className="symbol-label">
                        <i className="fa fa-envelope icon-20"></i>
                      </span>
                    </div>
                  </div>
                  <div className="customHeaderContainer-footer">
                    <div className="card-title">
                      <h3 className="card-label">New Mail</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CCard className="cardCustom">
              <form className="simple_form new_email" id="new_email" method="post">
                <CCardBody className="p-0">
                  <div className="pageContainer-wrapper">
                    <div className="pageBoxSizing-container">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group">
                            <label className="control-label" htmlFor="email_to">
                              To <span title="required">*</span>
                            </label>
                            <CFormTextarea
                              className="form-control-cst text required"
                              rows="1"
                              placeholder="Enter receiver (TO) mail addresses"
                              name="to"
                              id="email_to"
                              onChange={(e) => handleChangeForm(e)}
                              value={mailData.to}
                              invalid={mailErrors && !isEmpty(mailErrors.cc) ? true : false}
                              onFocus={(e) => handleSelectFocus('to', e)}
                            ></CFormTextarea>
                            <CFormFeedback invalid className="fieldError-cst">
                              {mailErrors.to}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"></div>
                        <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                          <div className="form-group email_addr optional email_to_ids">
                            <label
                              className="control-label email_addr optional"
                              htmlFor="email_to_ids"
                            >
                              Select from existing contacts and users
                            </label>
                            <div className="input-group">
                              <Select
                                id="email_to_ids"
                                classNamePrefix="cstSelect"
                                isClearable={true}
                                placeholder
                                isLoading={fetchingContacts ? true : false}
                                isSearchable
                                name="toIds"
                                options={
                                  contacts && !fetchingContacts && contacts.length > 0
                                    ? contacts.map((itm) => ({
                                        label: itm.email,
                                        value: itm.id,
                                      }))
                                    : []
                                }
                                className={classNames(
                                  'form-control form-control-cst pageCstSelect ',
                                  {
                                    'is-invalid': mailErrors && !isEmpty(mailErrors.toIds),
                                  },
                                )}
                                noOptionsMessage={() => 'No results found'}
                                onChange={(e) => handleSelectForm('toIds', e)}
                                onMenuOpen={(e) => handleSelectFocus('toIds', e)}
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {mailErrors.toIds}
                              </CFormFeedback>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group email_cc">
                            <label className="control-label" htmlFor="email_cc">
                              cc
                            </label>
                            <CFormTextarea
                              className="form-control-cst"
                              rows="1"
                              placeholder="Enter carbon copy (CC) mail addresses"
                              name="cc"
                              id="email_cc"
                              onChange={(e) => handleChangeForm(e)}
                              value={mailData.cc}
                              invalid={mailErrors && !isEmpty(mailErrors.cc) ? true : false}
                              onFocus={(e) => handleSelectFocus('toIds', e)}
                            ></CFormTextarea>
                            <CFormFeedback invalid className="fieldError-cst">
                              {mailErrors.cc}
                            </CFormFeedback>
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"></div>
                        <div className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
                          <div className="form-group email_addr optional email_cc_ids">
                            <label
                              className="control-label email_addr optional"
                              htmlFor="email_cc_ids"
                            >
                              Select from existing contacts and users
                            </label>
                            <div>
                              <div className="input-group">
                                <div className="input-group">
                                  <Select
                                    id="email_cc_ids"
                                    classNamePrefix="cstSelect"
                                    isClearable={true}
                                    placeholder
                                    isLoading={fetchingContacts ? true : false}
                                    isSearchable
                                    name="ccIds"
                                    options={
                                      contacts && !fetchingContacts && contacts.length > 0
                                        ? contacts.map((itm) => ({
                                            label: itm.email,
                                            value: itm.id,
                                          }))
                                        : []
                                    }
                                    className={classNames(
                                      'form-control form-control-cst pageCstSelect ',
                                      {
                                        'is-invalid': mailErrors && !isEmpty(mailErrors.ccIds),
                                      },
                                    )}
                                    noOptionsMessage={() => 'No results found'}
                                    onChange={(e) => handleSelectForm('ccIds', e)}
                                    onMenuOpen={(e) => handleSelectFocus('ccIds', e)}
                                  />
                                  <CFormFeedback invalid className="fieldError-cst">
                                    {mailErrors.ccIds}
                                  </CFormFeedback>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="separator"></div>
                        <div className="row">
                          {/* <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div> */}
                        </div>
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div className="form-group string optional email_title">
                              <label
                                className="control-label string optional"
                                htmlFor="email_title"
                              >
                                Message Title
                              </label>
                              <CFormInput
                                className="form-control-cst"
                                type="text"
                                name="title"
                                id="email_title"
                                onChange={(e) => handleChangeForm(e)}
                                value={mailData.title}
                                invalid={mailErrors && !isEmpty(mailErrors.title) ? true : false}
                                onFocus={(e) => handleSelectFocus('title', e)}
                              />
                              <CFormFeedback invalid className="fieldError-cst">
                                {mailErrors.title}
                              </CFormFeedback>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                            <div className="form-group boolean optional email_send_copy_to_me">
                              <label className="boolean optional" htmlFor="email_send_copy_to_me">
                                Send a copy to me
                              </label>
                              <div className="checkbox-custom checkbox-primary">
                                <input
                                  type="checkbox"
                                  value="1"
                                  checked={mailData.sendCopyToMe === '1' ? true : false}
                                  name="sendCopyToMe"
                                  id="email_send_copy_to_me"
                                  onChange={(e) => handleCheckedForm(e)}
                                  className={classNames('bollean ', {
                                    'is-invalid': mailErrors && !isEmpty(mailErrors.ccIds),
                                  })}
                                  onFocus={(e) => handleSelectFocus('sendCopyToMe', e)}
                                />
                                <CFormFeedback invalid className="fieldError-cst">
                                  {mailErrors.sendCopyToMe}
                                </CFormFeedback>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="separator"></div>
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
                            <div className="form-group">
                              <div className="col-sm-12">
                                {/**trix */}
                                <TrixEditor
                                  className="rich_text_area"
                                  autoFocus={false}
                                  value={mailData.trixContent}
                                  onChange={handleChangeEditor}
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            className="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5"
                            style={{ paddingLeft: '1.25rem' }}
                          >
                            <Dashboard
                              uppy={uppy}
                              id={'email_attachments'}
                              width={398}
                              height={198}
                              showLinkToFileUploadResult={false}
                              showProgressDetails={true}
                              hideUploadButton={true}
                              proudlyDisplayPoweredByUppy={false}
                              hidePauseResumeButton={true}
                              hideProgressAfterFinish={true}
                            />
                          </div>
                        </div>
                        <div className="separator"></div>
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            <a
                              className="hidden-print"
                              href="/tempdocs/766876-invoice-credit-note.pdf"
                              onClick={(e) => pdfDownload(e)}
                            >
                              <i className="far fa-file-pdf"></i> {mailData.title}
                            </a>
                          </div>
                          <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"></div>
                        </div>
                        <div className="separator"></div>
                        <div className="form-actions">
                          <div className="row">
                            <div className="col-md-2">
                              <CButton type="submit" color="success">
                                {/* Sending... */}
                                Send Message
                              </CButton>
                            </div>
                            <div className="col-md-10"></div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              className="mail-preview"
                              dangerouslySetInnerHTML={{ __html: htmlData }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CCardBody>
              </form>
            </CCard>
          </CCard>
        </div>
      </div>
    </div>
  )
}

export default CreateEmail
