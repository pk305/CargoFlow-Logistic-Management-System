import React from 'react'
import { CButton, CModalBody, CModalFooter } from '@coreui/react'
import PropTypes from 'prop-types'
// import Select from 'react-select'
// import classNames from 'classnames'

const NewAccPlan = ({ accountInfo, closeAccPlanModal }) => {
  // const [accountData, setAccountData] = useState({
  //   parentId: `${accountInfo && accountInfo.id}`,
  //   parentTitle: `${accountInfo && accountInfo.title}`,
  //   parentType: `${accountInfo && accountInfo.pointType}`,
  //   parentType2: 'cash',
  //   workType: 'static',
  //   fiscalYear: `${new Date().getFullYear()}`,
  //   status: 'active',
  //   ledgerAccountId: '',
  //   profitCenterId: '',
  // })

  // const handleChangeForm = (e) => {
  //   const { name, value } = e.target
  //   setAccountData({
  //     ...accountData,
  //     [name]: value,
  //   })
  // }

  const handleSubmitAccPlan = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <form className="simple_form horizontal-form" id="new_ledger_account">
        <CModalBody>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group select optional ledger_account_parent_id">
                <label className="control-label select optional" htmlFor="ledger_account_parent_id">
                  Main Account
                </label>
                {/* <div className="input-group">
                  <Select
                    id="ledger_account_parent_id"
                    classNamePrefix="cstSelect"
                    isClearable={true}
                    placeholder
                    isLoading={fetchingProfitCenters ? true : false}
                    isSearchable
                    name="profitCenterId"
                    autoFocus={false}
                    options={
                      profitCenters && !fetchingProfitCenters && profitCenters.length > 0
                        ? profitCenters.map((itm) => ({
                            label: itm.name,
                            value: itm.id,
                          }))
                        : []
                    }
                    className={classNames('form-control form-control-cst pageCstSelect ', {
                      'is-invalid': accountErrors && !isEmpty(accountErrors.profitCenterId),
                    })}
                    noOptionsMessage={() => 'No results found'}
                    onChange={(e) => handleSelectForm('profitCenterId', e)}
                    onFocus={(e) => handleSelectFocus('profitCenterId', e)}
                  />
                  <CFormFeedback
                    invalid={accountErrors && !isEmpty(accountErrors.profitCenterId) ? true : false}
                    className="fieldError-cst"
                  >
                    {accountErrors.profitCenterId}
                  </CFormFeedback>
                </div> */}
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="select2"
                  name="ledger_account[parent_id]"
                  id=""
                  data-select2-id="ledger_account_parent_id"
                  aria-hidden="true"
                >
                  <option value="" data-select2-id="24"></option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group string required ledger_account_name">
                <label className="control-label string required" htmlFor="ledger_account_name">
                  <abbr title="required">*</abbr> Account
                </label>
                <input
                  className="form-control string required"
                  type="text"
                  value="Joes EQUITY"
                  name="ledger_account[name]"
                  id="ledger_account_name"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group string optional ledger_account_notes">
                <label className="control-label string optional" htmlFor="ledger_account_notes">
                  Notes
                </label>
                <input
                  className="form-control string optional"
                  type="text"
                  name="ledger_account[notes]"
                  id="ledger_account_notes"
                />
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <div className="form-group boolean optional ledger_account_is_partner">
                <label className="boolean optional" htmlFor="ledger_account_is_partner">
                  Partner Account
                </label>
                <div className="checkbox-custom checkbox-primary">
                  <input
                    style={{ opacity: '1' }}
                    className="boolean optional"
                    type="checkbox"
                    value="true"
                    name="ledger_account[is_partner]"
                    id="ledger_account_is_partner"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <div className="form-group select optional ledger_account_account_type">
                <label
                  className="control-label select optional"
                  htmlFor="ledger_account_account_type"
                >
                  Account Type
                </label>
                <select
                  className="form-control select optional public-private-selection"
                  name="ledger_account[account_type]"
                  id="ledger_account_account_type"
                >
                  <option selected="selected" value="public">
                    Public
                  </option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <div className="form-group select optional ledger_account_status">
                <label className="control-label select optional" htmlFor="ledger_account_status">
                  Status
                </label>
                <select
                  className="form-control select optional"
                  name="ledger_account[status]"
                  id="ledger_account_status"
                >
                  <option selected="selected" value="active">
                    Active
                  </option>
                  <option value="passive">Passive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 private-user-ids"
              style={{ display: 'none' }}
            >
              <div className="form-group select optional ledger_account_user_ids">
                <label className="control-label select optional" htmlFor="users">
                  Related Users
                </label>
                <input name="ledger_account[user_ids][]" type="hidden" value="" />
                <select
                  className="form-control select optional user_ids select2-hidden-accessible"
                  data-plugin="select2"
                  multiple=""
                  id="users"
                  name="ledger_account[user_ids][]"
                  data-select2-id="users"
                  aria-hidden="true"
                >
                  <option value="4121">James</option>
                </select>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => closeAccPlanModal()}>
            Close
          </CButton>
          <CButton color="primary" onClick={() => handleSubmitAccPlan()}>
            {/* {creatingFinancial ? 'Processing...' : 'Save'} */}
            Save
          </CButton>
        </CModalFooter>
      </form>
    </div>
  )
}

NewAccPlan.propTypes = {
  accountInfo: PropTypes.object,
  closeAccPlanModal: PropTypes.func,
}
export default NewAccPlan
