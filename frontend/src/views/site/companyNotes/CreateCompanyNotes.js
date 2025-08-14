import React from 'react'
import { CFormInput, CFormSelect } from '@coreui/react'
// import { TrixEditor } from 'react-trix'

const CreateCompanyNotes = () => {
  // const handleEditorReady = (editor) => {
  //   // this is a reference back to the editor if you want to
  //   // do editing programatically
  //   editor.insertString('editor is ready')
  // }

  // const handleChange = (html, text) => {
  //   // html is the new html content
  //   // text is the new text content
  // }

  const handleChangeForm = (e) => {}

  return (
    <div>
      {/* <TrixEditor
        onChange={handleChange}
        onEditorReady={handleEditorReady}
        className="custom-css-className"
        autoFocus={true}
        placeholder="editor's placeholder"
        value="initial content <strong>for the editor</strong>"
        uploadURL="https://domain.com/imgupload/receiving/post"
        uploadData={{ key1: 'value', key2: 'value' }}
        fileParamName="blob"
      /> */}
      <div className="card cardCustom gutter-b p-0 " style={{ boxShadow: 'none' }}>
        <div className="card-body p-0">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-6">
              <div className="form-group notice_title">
                <label className="control-label" htmlFor="notice_title">
                  Title*
                </label>
                <CFormInput
                  className="form-control-cst"
                  type="text"
                  name="notice[title]"
                  id="notice_title"
                  onChange={(e) => handleChangeForm(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
              <div className="form-group select required notice_notice_type">
                <label className="control-label select required" htmlFor="notice_notice_type">
                  <abbr title="required">*</abbr> Note Type
                </label>
                <CFormSelect
                  className="form-control-cst select required"
                  name="notice[notice_type]"
                  id="notice_notice_type"
                  onChange={(e) => handleChangeForm(e)}
                >
                  <option value="meeting">Meeting</option>
                  <option value="phonecall">Phone Call</option>
                  <option value="news">News</option>
                  <option value="note">Note</option>
                  <option value="complaint">Complaint</option>
                  <option value="financial">Financial</option>
                </CFormSelect>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
              <div className="form-group date_picker required notice_notice_date">
                <label className="control-label date_picker required" htmlFor="notice_notice_date">
                  Note Date <span>*</span>
                </label>
                <CFormInput
                  className="form-control-cst string date_picker required flatpickr-input"
                  type="hidden"
                  data-plugin="datepicker"
                  value="2022-02-11"
                  name="notice[notice_date]"
                  id="notice_notice_date"
                  onChange={(e) => handleChangeForm(e)}
                />
                <CFormInput
                  className="form-control-cst string date_picker required form-control-cst input"
                  placeholder=""
                  tabIndex="0"
                  type="text"
                  onChange={(e) => handleChangeForm(e)}
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2">
              <div className="form-group date_picker optional notice_remainder_date">
                <label
                  className="control-label date_picker optional"
                  htmlFor="notice_remainder_date"
                >
                  Remainder Date
                </label>
                <CFormInput
                  className="form-control-cst string date_picker optional flatpickr-input"
                  type="hidden"
                  data-plugin="datepicker"
                  name="notice[remainder_date]"
                  id="notice_remainder_date"
                />
                <CFormInput
                  className="form-control-cst string date_picker optional form-control-cst input"
                  placeholder=""
                  tabIndex="0"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-6">
              <input type="hidden" name="notice[input_type]" value="" />
              <span className="radio-custom radio-default radio-inline">
                <input
                  type="radio"
                  value="company"
                  name="notice[input_type]"
                  id="notice_input_type_company"
                />
                <label className="collection_radio_buttons" htmlFor="notice_input_type_company">
                  Company
                </label>
              </span>
              <span className="radio-custom radio-default radio-inline">
                <input
                  type="radio"
                  value="opportunity"
                  name="notice[input_type]"
                  id="notice_input_type_opportunity"
                />
                <label className="collection_radio_buttons" htmlFor="notice_input_type_opportunity">
                  Opportunity
                </label>
              </span>
            </div>
          </div>
          <div className="row" data-select2-id="31">
            <div className="col-12 col-sm-12 col-md-4 col-lg-6 col-xl-6" data-select2-id="30">
              <div id="company_div" data-select2-id="company_div">
                <div className="form-group company optional notice_company_id" data-select2-id="29">
                  <label className="control-label company optional" htmlFor="notice_company_id">
                    Company
                  </label>
                  <div data-select2-id="28">
                    <div className="input-group" data-select2-id="27">
                      <select
                        className="form-control company-select select2-hidden-accessible"
                        data-url="/roster/autocompletes.json?model=Network::Company&amp;source_type="
                        name="notice[company_id]"
                        id="notice_company_id"
                        data-select2-id="notice_company_id"
                        tabIndex="-1"
                        aria-hidden="true"
                        onChange={(e) => handleChangeForm(e)}
                      >
                        <option value="" data-select2-id="22"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div id="opportunity_div" style={{ display: 'none' }}>
                <div className="form-group opportunity optional notice_opportunity_id">
                  <label
                    className="control-label opportunity optional"
                    htmlFor="notice_opportunity_id"
                  >
                    Opportunity
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control select2-hidden-accessible"
                        name="notice[opportunity_id]"
                        id="notice_opportunity_id"
                        data-select2-id="notice_opportunity_id"
                        tabIndex="-1"
                        aria-hidden="true"
                        onChange={(e) => handleChangeForm(e)}
                      >
                        <option value=""></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="form-group rich_text_area optional notice_trix_content">
                <input
                  type="hidden"
                  name="notice[trix_content]"
                  id="notice_trix_content_trix_input_notice"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div id="participants" className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5">
              <div className="form-group select optional notice_participants">
                <label className="control-label select optional" htmlFor="notice_participants">
                  Participants
                </label>
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="tag_select"
                  multiple=""
                  name="notice[participants][]"
                  id="notice_participants"
                  data-select2-id="notice_participants"
                  tabIndex="-1"
                  aria-hidden="true"
                  onChange={(e) => handleChangeForm(e)}
                ></select>
              </div>
            </div>
            <div id="our_participants" className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5">
              <div className="form-group select optional notice_our_participants">
                <label className="control-label select optional" htmlFor="notice_our_participants">
                  Our Participants
                </label>
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="select2"
                  multiple=""
                  name="notice[our_participants][]"
                  id="notice_our_participants"
                  data-select2-id="notice_our_participants"
                  tabIndex="-1"
                  aria-hidden="true"
                  onChange={(e) => handleChangeForm(e)}
                >
                  <option value="3835">Kennedy Peter</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2">
              <div className="form-group boolean optional notice_secret_notice">
                <label className="boolean optional" htmlFor="notice_secret_notice">
                  Secret Note
                </label>
                <div className="checkbox-custom checkbox-primary">
                  <input name="notice[secret_notice]" type="hidden" value="f" />
                  <input
                    className="boolean optional"
                    type="checkbox"
                    value="true"
                    name="notice[secret_notice]"
                    id="notice_secret_notice"
                    onChange={(e) => handleChangeForm(e)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group hidden notice_scope">
              <input
                className="form-control hidden"
                value="notice"
                type="hidden"
                name="notice[scope]"
                id="notice_scope"
                onChange={(e) => handleChangeForm(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCompanyNotes
