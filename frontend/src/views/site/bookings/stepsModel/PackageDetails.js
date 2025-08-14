import React, { useState } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormFeedback,
  CButton,
  CFormTextarea,
} from '@coreui/react'
import Select from 'react-select'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { clearBookingError } from 'src/redux/slices/bookingSlice'
import Noty from 'noty'
import classNames from 'classnames'
import { isNull } from 'lodash'
import { nanoid } from 'nanoid'

const PackageDetails = ({
  handleChangeForm,
  bookingData,
  handleSelectFocus,
  handleUpdateBooking,
  packageInput,
  setPackageInput,
  containerInput,
  setContainerInput,
}) => {
  const dispatch = useDispatch()
  const [isShippingContainer, setIsShippingContainer] = useState(false)
  const { updatingBooking, bookingErrors } = useSelector((state) => state.booking)
  const { hscodes, fetchingHscodes } = useSelector((state) => state.hscode)

  const [imoType, showImoType] = useState(false)

  const handleSelectForm = (c, val) => {
    const e = { target: { name: c, value: !isNull(val) ? val.value : '' } }
    handleChangeForm(e)
  }

  const handleSelectContainer = (e) => {
    handleChangeForm(e)
    if (e.target.value === 'at_container') {
      setIsShippingContainer(true)
    } else {
      setIsShippingContainer(false)
    }
  }

  const calcTotalPack = (itms, name) => {
    let sumArray = []
    if (itms.length > 0) {
      for (let i = 0; i < itms.length; i++) {
        const p = itms[i]
        if (name === 'total') {
          sumArray.push(parseFloat(p.total))
        }
        if (name === 'packTotal') {
          sumArray.push(parseFloat(p.packTotal))
        }
      }
    }
    const sm = sumArray.reduce((a, b) => a + b, 0)
    const e = { target: { name: 'totalPack', value: sm ? sm.toFixed(2) : '0.0' } }
    handleChangeForm(e)
  }

  const handleRemoveItem = (e, item) => {
    e.preventDefault()
    var n = new Noty({
      text: 'The record will be deleted, do you want to continue ?',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      buttons: [
        Noty.button(
          'Delete',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          async function () {
            let itms = packageInput.filter((x) => x.id !== item.id)
            calcTotalPack(itms, 'total')
            setPackageInput(itms)
            n.close()
          },
          { id: `delItem-${item.id}` },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }

  const handleContainerInput = () => {
    let item = {
      id: nanoid(10),
      containerName: '',
      containerType: '',
      sealNo: '',
      packTotal: '0.0',
      packCode: '',
      weight: '0.0',
      volume: '0.0',
    }

    setContainerInput([...containerInput, item])
  }

  const handlePackageQty = (e) => {
    const { name } = e.target
    if (name === 'total') {
      calcTotalPack(packageInput, name)
    }
    if (name === 'packTotal') {
      calcTotalPack(containerInput, name)
    }
  }

  const changeCustomInput = (e, itemId) => {
    const { name, value } = e.target
    setPackageInput((state) =>
      state.map((x) =>
        x.id === itemId
          ? {
              ...x,
              [name]: value,
            }
          : x,
      ),
    )
  }

  const handlePackageInput = (e) => {
    e.preventDefault()
    let item = {
      id: nanoid(10),
      total: '0',
      packCode: '',
      dimUnit: '',
      innerQuantity: '',
      brutWg: '0.0',
      packDimension1: '',
      packDimension2: '',
      packDimension3: '',
      packVolume: '0.0',
    }
    setPackageInput([...packageInput, item])
  }

  const handleChangeContainer = (e, itemId) => {
    const { name, value } = e.target
    setContainerInput((state) =>
      state.map((x) =>
        x.id === itemId
          ? {
              ...x,
              [name]: value,
            }
          : x,
      ),
    )
  }

  const handleRemoveContainer = (e, item) => {
    e.preventDefault()
    var n = new Noty({
      text: 'The record will be deleted, do you want to continue ?',
      layout: 'topCenter',
      progressBar: false,
      timeout: false,
      type: 'error',
      buttons: [
        Noty.button(
          'Delete',
          'btn btn-default btn-sm del-bnt-mr text-danger float-right',
          async function () {
            let itms = containerInput.filter((x) => x.id !== item.id)
            calcTotalPack(itms, 'packTotal')
            setContainerInput(itms)
            n.close()
          },
          { id: `delItem-${item.id}` },
        ),

        Noty.button('Cancel', 'btn btn-default btn-sm float-right', function () {
          n.close()
        }),
      ],
    })
    n.show()
  }

  const handleChangeCommodity = (e) => {
    const { name, value } = e.target
    if (name === 'commodityType') {
      if (value === 'adr') {
        showImoType(true)
      } else {
        showImoType(false)
      }
    }
    handleChangeForm(e)
  }
  return (
    <div>
      <form
        className="simple_form horizontal-form"
        id="new_loading"
        onSubmit={(e) => handleUpdateBooking(e, '2')}
      >
        <h4 className="cstPageTitle">Package Details</h4>
        <h6 className="subTitleHeading">Step: 2/5</h6>
        <div className="separator"></div>
        <div className="row">
          <CCol sm={12} md={12} lg={12} xl={12}>
            <CRow id="loadingInContainerDiv">
              <CCol sm={6} md={3} lg={3} xl={3}>
                <div className="form-group select optional loading_in_container">
                  <label className="control-label select optional" htmlFor="load_inContainer">
                    Shipping in Container ?
                  </label>
                  <div>
                    <CFormSelect
                      className="form-control-cst"
                      name="inContainer"
                      id="load_inContainer"
                      style={{
                        paddingRight: '23px',
                      }}
                      value={bookingData.inContainer}
                      invalid={bookingErrors && !isEmpty(bookingErrors.inContainer) ? true : false}
                      onChange={(e) => handleSelectContainer(e)}
                      onFocus={() =>
                        dispatch(
                          clearBookingError({ type: 'inContainer', errorType: 'errBooking' }),
                        )
                      }
                    >
                      <option value="out_of_container">No</option>
                      <option value="at_container">Yes</option>
                    </CFormSelect>
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.inContainer}
                    </CFormFeedback>
                  </div>
                </div>
              </CCol>
            </CRow>
            <hr />
            <div
              className="row container_nested_form"
              style={{ display: !isShippingContainer ? 'none' : '' }}
            >
              <div id="container_details">
                <div className="col-md-12">
                  {containerInput.length > 0
                    ? containerInput.map((item) => (
                        <React.Fragment key={item.id}>
                          <div className={`container-field-${item.id} container-line`}>
                            <div className="row">
                              <div className="col-md-2 col-sm-4 col-xs-12">
                                <div className="form-group ">
                                  <label
                                    className="control-label"
                                    htmlFor={`containerName_${item.id}`}
                                  >
                                    Container No
                                  </label>
                                  <CFormInput
                                    className="form-control-cst"
                                    type="text"
                                    id={`containerName_${item.id}`}
                                    name="containerName"
                                    value={item.containerName}
                                    onChange={(e) => handleChangeContainer(e, item.id)}
                                  />
                                </div>
                              </div>
                              <div className="col-md-9 col-sm-12 col-xs-12">
                                <div className="row">
                                  <div className="col-md-2 col-sm-4 col-xs-6 padding-0">
                                    <div className="form-group select required loading_containers_container_type">
                                      <label
                                        className="control-label select required"
                                        htmlFor={`containerType_${item.id}`}
                                      >
                                        Container Type<span>*</span>
                                      </label>
                                      <CFormSelect
                                        className="form-control-cst"
                                        id={`containerType_${item.id}`}
                                        name="containerType"
                                        value={item.containerType}
                                        onChange={(e) => handleChangeContainer(e, item.id)}
                                      >
                                        <option value=""></option>
                                        <option value="20DC">20 Dry</option>
                                        <option value="20FT">20 Flat Rack</option>
                                        <option value="20ISOTANK">20 Iso Tank</option>
                                        <option value="20OT">20 Open Top</option>
                                        <option value="20RF">20 Reefer</option>
                                        <option value="30SC">30 Sc</option>
                                        <option value="40CELLPALET">40 Cellular Palette</option>
                                        <option value="40DC">40 Dry</option>
                                        <option value="40FR">40 Flat Rack</option>
                                        <option value="40HIGHCUBEPALET">
                                          40 High Cube Palette Wide
                                        </option>
                                        <option value="40HQ">40 High Cube Dry</option>
                                        <option value="40OT">40 Open Top</option>
                                        <option value="40PF">40 Platform</option>
                                        <option value="40RF">40 Reefer</option>
                                        <option value="45HQ">45 High Cube Dry</option>
                                        <option value="45SWAPBODY">45 Swap Body</option>
                                      </CFormSelect>
                                    </div>
                                  </div>
                                  <div className="col-md-2 col-sm-4 col-xs-6">
                                    <div className="form-group loading_containers_sealno">
                                      <label
                                        className="control-label"
                                        htmlFor={`sealNo_${item.id}`}
                                      >
                                        Seal No
                                      </label>
                                      <CFormInput
                                        className="form-control"
                                        type="text"
                                        name="sealNo"
                                        id={`sealNo_${item.id}`}
                                        value={item.sealNo}
                                        onChange={(e) => handleChangeContainer(e, item.id)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 col-sm-4 col-xs-6">
                                    <div className="form-group loading_containers_pack_total">
                                      <label
                                        className="control-label"
                                        htmlFor={`packTotal_${item.id}`}
                                      >
                                        Package Qty.
                                      </label>
                                      <CFormInput
                                        className="form-control change-total pack-total text-align-right"
                                        type="text"
                                        name="packTotal"
                                        id={`packTotal_${item.id}`}
                                        value={item.packTotal}
                                        onChange={(e) => handleChangeContainer(e, item.id)}
                                        onBlur={(e) => handlePackageQty(e, item)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 col-sm-4 col-xs-6">
                                    <div className="form-group select optional loading_containers_pack_code">
                                      <label
                                        className="control-label select optional"
                                        htmlFor={`packCode_${item.id}`}
                                      >
                                        Package Type
                                      </label>
                                      <CFormSelect
                                        className="form-control-cst"
                                        name="packCode"
                                        id={`packCode_${item.id}`}
                                        value={item.packCode}
                                        onChange={(e) => handleChangeContainer(e, item.id)}
                                      >
                                        <option value=""></option>
                                        <option value="BG">BG-Bag</option>
                                        <option value="BI">BI-Bin</option>
                                        <option value="BR">BR-Bar</option>
                                        <option value="BX">BX-Box</option>
                                        <option value="CN">CN-Container</option>
                                        <option value="CR">CR-Crate</option>
                                        <option value="CT">CT-Carton</option>
                                        <option value="NE">NE-UNPACKAGED OR UNPACKED</option>
                                        <option value="PA">PA-Packet</option>
                                        <option value="PC">PC-Parcel</option>
                                        <option value="PK">PK-Package</option>
                                        <option value="PX">PX-Pallet</option>
                                        <option value="RO">RO-Roll</option>
                                      </CFormSelect>
                                    </div>
                                  </div>
                                  <div className="col-md-2 col-sm-4 col-xs-6">
                                    <div className="form-group decimal optional loading_containers_weight">
                                      <label
                                        className="control-label decimal optional"
                                        htmlFor={`weight_${item.id}`}
                                      >
                                        Gross Wg.(kg)
                                      </label>
                                      <CFormInput
                                        className="form-control-cst text-align-right"
                                        type="number"
                                        step="any"
                                        name="weight"
                                        id={`weight_${item.id}`}
                                        value={item.weight}
                                        onChange={(e) => handleChangeContainer(e, item.id)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-2 col-sm-4 col-xs-6">
                                    <div className="form-group float optional loading_containers_volume">
                                      <label
                                        className="control-label float optional"
                                        htmlFor={`volume_${item.id}`}
                                      >
                                        Volume
                                      </label>
                                      <CFormInput
                                        className="form-control numeric float optional pack-volume change-total"
                                        type="number"
                                        name="volume"
                                        id={`volume_${item.id}`}
                                        value={item.volume}
                                        onChange={(e) => handleChangeContainer(e, item.id)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-1 col-sm-3 col-xs-4 pt-6">
                                <button
                                  className="btn btn-close"
                                  aria-label="Close"
                                  onClick={(e) => handleRemoveContainer(e, item)}
                                ></button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))
                    : null}
                  <div className="new_record_button mt-2">
                    <CButton color="primary" onClick={handleContainerInput}>
                      Add Container Line
                    </CButton>
                  </div>
                </div>
                <div className="col-12">
                  <div className="separator"></div>
                </div>
              </div>
            </div>
            <div
              className="row mb-4 pack_details"
              style={{ display: !isShippingContainer ? '' : 'none' }}
            >
              <CCol sm={12} md={12} lg={12} xl={12} id="pack_details">
                <div className="row">
                  <CCol md={3} sm={2} xs={6}>
                    <CRow>
                      <CCol md={6} sm={4} xs={6}>
                        Package Quantity
                      </CCol>
                      <CCol md={6} sm={4} xs={6}>
                        Package Type
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={2} sm={4} xs={12}>
                    Stackable
                  </CCol>
                  <CCol md={1} sm={3} xs={6}>
                    Pieces
                  </CCol>
                  <CCol md={1} sm={3} xs={6} className="padding-0">
                    Gross Wg.
                  </CCol>
                  <CCol md={4} sm={2} xs={6}>
                    <CRow>
                      <CCol md={9} sm={4} xs={6}>
                        Dimensions (Ln/Wd/Hg (cm))
                      </CCol>
                      <CCol md={3} sm={4} xs={6} className="padding-0">
                        Volume
                      </CCol>
                    </CRow>
                  </CCol>
                </div>
                {packageInput.length > 0
                  ? packageInput.map((item) => (
                      <React.Fragment key={item.id}>
                        <div
                          className={`row package-field-${item.id} package-line`}
                          style={{ marginBottom: '-7px' }}
                        >
                          <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                            <div className="row">
                              <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <div className="form-group integer required loading_packages_total">
                                  <CFormInput
                                    className="form-control-cst text-right"
                                    type="number"
                                    step="1"
                                    name="total"
                                    id={`total_${item.id}`}
                                    value={item.total}
                                    onChange={(e) => changeCustomInput(e, item.id)}
                                    onBlur={(e) => handlePackageQty(e, item)}
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                <div className="form-group select required">
                                  <div>
                                    <div className="input-group">
                                      <CFormSelect
                                        className="form-control-cst select required"
                                        id={`packCode-${item.id}`}
                                        name="packCode"
                                        value={item.packCode}
                                        onChange={(e) => changeCustomInput(e, item.id)}
                                      >
                                        <option value=""></option>
                                        <option value="AE">AE-AEROSOL</option>
                                        <option value="AM">AM-Ampoule, non protected</option>
                                        <option value="AP">AP-Ampoule, protected</option>
                                        <option value="AT">AT-Atomiser</option>
                                        <option value="BA">BA-Barrel</option>
                                        <option value="BB">BB-Bobbin</option>
                                        <option value="BC">BC-Bottlecrate / bottlerack</option>
                                        <option value="BD">BD-Board</option>
                                        <option value="BE">BE-Fardel</option>
                                        <option value="BF">BF-Balloon, non-protected</option>
                                        <option value="BG">BG-Bag</option>
                                        <option value="BI">BI-Bin</option>
                                        <option value="BJ">BJ-Bucket</option>
                                        <option value="BK">BK-Basket</option>
                                        <option value="BL">BL-Bale, compressed</option>
                                        <option value="BN">BN-Bale, non-compressed</option>
                                        <option value="BO">
                                          BO-Bottle, non-protected, cylindrical
                                        </option>
                                        <option value="BP">BP-Balloon, protected</option>
                                        <option value="BQ">BQ-Bottle protected cylindrical</option>
                                        <option value="BR">BR-Bar</option>
                                        <option value="BS">BS-Bottle, non-protected bulbous</option>
                                        <option value="BT">BT-Bolt</option>
                                        <option value="BU">BU-Butt</option>
                                        <option value="BV">BV-Bottle, protected bulbous</option>
                                        <option value="BX">BX-Box</option>
                                        <option value="CA">CA-Can, rectangular</option>
                                        <option value="CB">CB-Carte, Beer</option>
                                        <option value="CC">CC-Churn</option>
                                        <option value="CE">CE-Creel</option>
                                        <option value="CF">CF-Coffer</option>
                                        <option value="CG">CG-Cage</option>
                                        <option value="CH">CH-Chest</option>
                                        <option value="CJ">CJ-Coffin</option>
                                        <option value="CK">CK-Cask</option>
                                        <option value="CL">CL-Coil</option>
                                        <option value="CN">CN-Container</option>
                                        <option value="CO">CO-Carboy, non-protected</option>
                                        <option value="CP">CP-Carboy, protected</option>
                                        <option value="CR">CR-Crate</option>
                                        <option value="CS">CS-Case</option>
                                        <option value="CT">CT-Carton</option>
                                        <option value="CU">CU-Cup</option>
                                        <option value="CV">CV-Cover</option>
                                        <option value="CX">CX-Can, cylindrical</option>
                                        <option value="CY">CY-Cylinder</option>
                                        <option value="CZ">CZ-Canvas</option>
                                        <option value="DJ">DJ-Demijohn, non-protected</option>
                                        <option value="DP">DP-emijohn, protected</option>
                                        <option value="DR">DR-Drum</option>
                                        <option value="EN">EN-Envelope</option>
                                        <option value="FC">FC-Carte, fruit</option>
                                        <option value="FD">FD-Crate, framed</option>
                                        <option value="FI">FI-Firkin</option>
                                        <option value="FL">FL-Flask</option>
                                        <option value="FO">FO-Footlocker</option>
                                        <option value="FP">FP-Film pack</option>
                                        <option value="FR">FR-Frame</option>
                                        <option value="GB">GB-Bottle, gas</option>
                                        <option value="GI">GI-Girder</option>
                                        <option value="JG">JG-Jug</option>
                                        <option value="JR">JR-Jar</option>
                                        <option value="JT">JT-Jutebag</option>
                                        <option value="JY">JY-Jerry-can,cylindrical</option>
                                        <option value="KG">KG-Keg</option>
                                        <option value="LG">LG-LOG</option>
                                        <option value="MB">MB-Bag, multiply</option>
                                        <option value="MT">MT-Mat</option>
                                        <option value="MX">MX-Match box</option>
                                        <option value="NE">NE-UNPACKAGED OR UNPACKED</option>
                                        <option value="NS">NS-Nest</option>
                                        <option value="NT">NT-Net</option>
                                        <option value="PA">PA-Packet</option>
                                        <option value="PC">PC-Parcel</option>
                                        <option value="PG">PG-Plate</option>
                                        <option value="PH">PH-Pitcher</option>
                                        <option value="PI">PI-Pipe</option>
                                        <option value="PK">PK-Package</option>
                                        <option value="PL">PL-Pail</option>
                                        <option value="PX">PX-Pallet</option>
                                        <option value="RO">RO-Roll</option>
                                        <option value="SA">SA-Sack</option>
                                      </CFormSelect>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                            <div className="form-group select optional ">
                              <CFormSelect
                                className="form-control-cst"
                                id={`dimUnit-${item.id}`}
                                name="dimUnit"
                                value={item.dimUnit}
                                onChange={(e) => changeCustomInput(e, item.id)}
                              >
                                <option value=""></option>
                                <option value="not_stackable">Non-Stackable</option>
                                <option value="stackable">Stackable</option>
                                <option value="stackable2">2 Tier Stackable</option>
                                <option value="stackable3">3 Tier Stackable</option>
                                <option value="stackable4">4 Tier Stackable</option>
                                <option value="stackable5">5 Tier Stackable</option>
                                <option value="stackable6">6 Tier Stackable</option>
                                <option value="stackable7">7 Tier Stackable</option>
                                <option value="stackable8">8 Tier Stackable</option>
                                <option value="stackable9">9 Tier Stackable</option>
                                <option value="stackable10">10+ Tier Stackable</option>
                                <option value="top_stackable">Top-Stackable</option>
                              </CFormSelect>
                            </div>
                          </div>
                          <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1">
                            <div className="form-group decimal optional loading_packages_inner_quantity">
                              <CFormInput
                                className="form-control-cst text-right"
                                type="number"
                                step="any"
                                id={`innerQuantity-${item.id}`}
                                name="innerQuantity"
                                value={item.innerQuantity}
                                onChange={(e) => changeCustomInput(e, item.id)}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1">
                            <div className="form-group float optional loading_packages_brutwg">
                              <CFormInput
                                className="form-control-cst text-right"
                                type="number"
                                step="any"
                                id={`brutWg-${item.id}`}
                                name="brutWg"
                                value={item.brutWg}
                                onChange={(e) => changeCustomInput(e, item.id)}
                              />
                            </div>
                          </div>
                          <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div className="row">
                              <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                <div className="form-group">
                                  <CFormInput
                                    className="form-control-cst numeric change-total pack-dimension1 text-right"
                                    type="number"
                                    step="1"
                                    id={`packDimension1-${item.id}`}
                                    name="packDimension1"
                                    value={item.packDimension1}
                                    onChange={(e) => changeCustomInput(e, item.id)}
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                <div className="form-group">
                                  <CFormInput
                                    className="form-control-cst text-right"
                                    type="number"
                                    step="1"
                                    id={`packDimension2-${item.id}`}
                                    name="packDimension2"
                                    value={item.packDimension2}
                                    onChange={(e) => changeCustomInput(e, item.id)}
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                <div className="form-group">
                                  <CFormInput
                                    className="form-control-cst text-right"
                                    type="number"
                                    step="1"
                                    id={`packDimension3-${item.id}`}
                                    name="packDimension3"
                                    value={item.packDimension3}
                                    onChange={(e) => changeCustomInput(e, item.id)}
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 p-1">
                                <div className="form-group">
                                  <CFormInput
                                    className="form-control-cst"
                                    type="number"
                                    step="any"
                                    id={`packVolume-${item.id}`}
                                    name="packVolume"
                                    value={item.packVolume}
                                    onChange={(e) => changeCustomInput(e, item.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="col-6 col-sm-6 col-md-2 col-lg-1 col-xl-1"
                            style={{ lineHeight: '35px' }}
                          >
                            <button
                              className="btn btn-close"
                              aria-label="Close"
                              onClick={(e) => handleRemoveItem(e, item)}
                            ></button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))
                  : null}
                <div className="mt-2">
                  <CButton color="primary" onClick={(e) => handlePackageInput(e)}>
                    Add Package Line
                  </CButton>
                </div>
                <hr />
              </CCol>
            </div>
            <CRow>
              <CCol md={5}>
                <div className="form-group text optional loading_commodity">
                  <label className="control-label text optional" htmlFor="loading_commodity">
                    Commodity
                  </label>
                  <CFormTextarea
                    className="form-control-cst text optional"
                    rows="1"
                    style={{ minHeight: '46px', maxHeight: '200px' }}
                    name="commodity"
                    id="loading_commodity"
                    value={bookingData.commodity}
                    onChange={(e) => handleChangeForm(e)}
                    invalid={bookingErrors && !isEmpty(bookingErrors.commodity) ? true : false}
                    onFocus={() =>
                      dispatch(clearBookingError({ type: 'commodity', errorType: 'errBooking' }))
                    }
                  ></CFormTextarea>
                  <CFormFeedback
                    invalid={bookingErrors && !isEmpty(bookingErrors.commodity) ? true : false}
                    className="fieldError-cst"
                  >
                    {bookingErrors.commodity}
                  </CFormFeedback>
                </div>
              </CCol>
              <CCol md={7}>
                <CRow>
                  <CCol md={2} sm={2} lg={2} xl={2}>
                    <div className="form-group float optional loading_total_pack">
                      <label className="control-label float optional" htmlFor="loading_total_pack">
                        Total pack
                      </label>
                      <CFormInput
                        className="form-control-cst numeric float optional text-align-right total-pack"
                        type="number"
                        step="any"
                        value={bookingData.totalPack}
                        name="totalPack"
                        id="loading_total_pack"
                        invalid={bookingErrors && !isEmpty(bookingErrors.totalPack) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={() =>
                          dispatch(
                            clearBookingError({ type: 'totalPack', errorType: 'errBooking' }),
                          )
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.totalPack}
                      </CFormFeedback>
                    </div>
                  </CCol>

                  <CCol md={3} sm={2} lg={3} xl={3}>
                    <div className="form-group">
                      <label className="control-label" htmlFor="loading_brut_wg">
                        Gross Weight(kg)
                      </label>
                      <CFormInput
                        className="form-control-cst numeric float optional text-align-right total-brut-weight"
                        type="number"
                        step="any"
                        name="brutWg"
                        id="loading_brut_wg"
                        value={bookingData.brutWg}
                        invalid={bookingErrors && !isEmpty(bookingErrors.brutWg) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={() =>
                          dispatch(clearBookingError({ type: 'brutWg', errorType: 'errBooking' }))
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.brutWg}
                      </CFormFeedback>
                    </div>
                  </CCol>

                  <CCol md={2} sm={2} lg={2} xl={2}>
                    <div className="form-group float optional loading_volume">
                      <label className="control-label float optional" htmlFor="loading_volume">
                        m3
                      </label>
                      <CFormInput
                        className="form-control-cst numeric float optional text-align-right total-volume"
                        type="number"
                        step="any"
                        name="volume"
                        id="loading_volume"
                        value={bookingData.volume}
                        invalid={bookingErrors && !isEmpty(bookingErrors.volume) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={() =>
                          dispatch(clearBookingError({ type: 'volume', errorType: 'errBooking' }))
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.volume}
                      </CFormFeedback>
                    </div>
                  </CCol>

                  <CCol md={2} sm={2} lg={2} xl={2}>
                    <div className="form-group float optional loading_ladameter">
                      <label className="control-label float optional" htmlFor="loading_ladameter">
                        Ldm.
                      </label>
                      <CFormInput
                        className="form-control-cst numeric float optional text-align-right total-ladameter"
                        type="number"
                        step="any"
                        name="ladameter"
                        id="loading_ladameter"
                        value={bookingData.ladameter}
                        invalid={bookingErrors && !isEmpty(bookingErrors.ladameter) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={() =>
                          dispatch(
                            clearBookingError({ type: 'ladameter', errorType: 'errBooking' }),
                          )
                        }
                      />
                      <CFormFeedback
                        invalid={bookingErrors && !isEmpty(bookingErrors.ladameter) ? true : false}
                        className="fieldError-cst"
                      >
                        {bookingErrors.ladameter}
                      </CFormFeedback>
                    </div>
                  </CCol>

                  <CCol md={3} sm={2} lg={3} xl={3}>
                    <div className="form-group">
                      <label className="control-label float optional" htmlFor="loading_price_wg">
                        Volumetric Weight
                      </label>
                      <CFormInput
                        className="form-control-cst numeric float optional text-align-right total-chargable-weight"
                        type="number"
                        step="any"
                        name="priceWg"
                        id="loading_price_wg"
                        value={bookingData.priceWg}
                        invalid={bookingErrors && !isEmpty(bookingErrors.priceWg) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={() =>
                          dispatch(clearBookingError({ type: 'priceWg', errorType: 'errBooking' }))
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.priceWg}
                      </CFormFeedback>
                    </div>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol md={2} sm={2} lg={2} xl={2}>
                <div className="form-group select optional loading_commodity_type">
                  <label className="control-label select optional" htmlFor="loading_commodity_type">
                    Commodity Type
                  </label>
                  <CFormSelect
                    className="form-control-cst select"
                    name="commodityType"
                    id="loading_commodity_type"
                    onChange={(e) => handleChangeCommodity(e)}
                    value={bookingData.commodityType}
                    invalid={bookingErrors && !isEmpty(bookingErrors.commodityType) ? true : false}
                    onFocus={() =>
                      dispatch(
                        clearBookingError({ type: 'commodityType', errorType: 'errBooking' }),
                      )
                    }
                  >
                    <option value="standard">Dry Cargo (Freight all kinds)</option>
                    <option value="adr">Dangerous Cargo</option>
                    <option value="perishable">Perishable Cargo</option>
                    <option value="pharma">Pharmaceuticals</option>
                    <option value="bulk">Bulk Cargo</option>
                  </CFormSelect>
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.commodityType}
                  </CFormFeedback>
                </div>
              </CCol>
              {imoType && (
                <>
                  <CCol md={2} sm={2} lg={2} xl={2}>
                    <div className="form-group select optional loading_hts_no">
                      <label className="control-label select optional" htmlFor="loading_hts_no">
                        IMO Class
                      </label>
                      <CFormSelect
                        className="form-control-cst"
                        name="htsNo"
                        id="loading_hts_no"
                        onChange={(e) => handleChangeForm(e)}
                        value={bookingData.htsNo}
                        invalid={bookingErrors && !isEmpty(bookingErrors.htsNo) ? true : false}
                        onFocus={() =>
                          dispatch(clearBookingError({ type: 'htsNo', errorType: 'errBooking' }))
                        }
                      >
                        <option></option>
                        <option value="1.1">
                          (1.1) Substances and articles which have a mass explosion hazard
                        </option>
                        <option value="1.2">
                          (1.2) Substances and articles which have a projection hazard but not a
                          mass explosion hazard
                        </option>
                        <option value="1.3">
                          (1.3) Substances and articles which have a fire hazard and either a minor
                          blast hazard or a minor projection hazard or both, but not a mass
                          explosion hazard
                        </option>
                        <option value="1.4">
                          (1.4) Substances and articles which present no significant hazard
                        </option>
                        <option value="1.6">
                          (1.6) Extremely insensitive articles which do not have a mass explosion
                          hazard
                        </option>
                        <option value="2.1">(2.1) Flammable gases</option>
                        <option value="2.2">(2.2) Non-flammable, non-toxic gases</option>
                        <option value="2.3">(2.3) Toxic gases</option>
                        <option value="3">(3) Flammable liquids</option>
                        <option value="4.1">
                          (4.1) Flammable solids, self-reactive substances and solid desensitized
                          explosives
                        </option>
                        <option value="4.2">
                          (4.2) Substances liable to spontaneous combustion
                        </option>
                        <option value="4.3">
                          (4.3) Substances which, in contact with water, emit flammable gases
                        </option>
                        <option value="5.1">(5.1) Oxidizing substances</option>
                        <option value="5.2">(5.2) Organic peroxides</option>
                        <option value="6.1">(6.1) Toxic substances</option>
                        <option value="7">(7) Radioactive material</option>
                        <option value="8">(8) Corrosive substances</option>
                        <option value="9">
                          (9) Miscellaneous dangerous substances and articles
                        </option>
                      </CFormSelect>
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.htsNo}
                      </CFormFeedback>
                    </div>
                  </CCol>
                  <CCol md={2} sm={2} lg={2} xl={2}>
                    <div className="form-group loading_addr_unno">
                      <label className="control-label" htmlFor="loading_addr_unno">
                        IMO Number
                      </label>
                      <CFormInput
                        className="form-control-cst"
                        type="text"
                        name="addrUnno"
                        id="loading_addr_unno"
                        value={bookingData.addrUnno}
                        invalid={bookingErrors && !isEmpty(bookingErrors.addrUnno) ? true : false}
                        onChange={(e) => handleChangeForm(e)}
                        onFocus={() =>
                          dispatch(clearBookingError({ type: 'addrUnno', errorType: 'errBooking' }))
                        }
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.addrUnno}
                      </CFormFeedback>
                    </div>
                  </CCol>
                </>
              )}
              <CCol md={2} sm={2} lg={2} xl={2}>
                <div className="form-group decimal optional loading_optimum_temperature">
                  <label
                    className="control-label decimal optional"
                    htmlFor="loading_optimum_temperature"
                  >
                    Optimum Temperature
                  </label>
                  <CFormInput
                    className="form-control-cst numeric decimal optional"
                    type="number"
                    step="any"
                    name="optimumTemperature"
                    id="loading_optimum_temperature"
                    value={bookingData.optimumTemperature}
                    invalid={
                      bookingErrors && !isEmpty(bookingErrors.optimumTemperature) ? true : false
                    }
                    onChange={(e) => handleChangeForm(e)}
                    onFocus={() =>
                      dispatch(
                        clearBookingError({ type: 'optimumTemperature', errorType: 'errBooking' }),
                      )
                    }
                  />
                  <CFormFeedback invalid className="fieldError-cst">
                    {bookingErrors.optimumTemperature}
                  </CFormFeedback>
                </div>
              </CCol>
              <CCol md={2} sm={2} lg={2} xl={2}>
                <div className="form-group gtip optional loading_gtip_id">
                  <label className="control-label gtip optional" htmlFor="loading_gtip_id">
                    HS Code*
                  </label>
                  <div>
                    <div className="input-group">
                      <Select
                        classNamePrefix="cstSelect"
                        isClearable
                        placeholder
                        id="loading_gtip_id"
                        name="gtpId"
                        options={
                          hscodes && !fetchingHscodes && hscodes.length > 0
                            ? hscodes.map((itm) => ({
                                label: itm.name,
                                value: itm.id,
                              }))
                            : []
                        }
                        isLoading={fetchingHscodes ? true : false}
                        className={classNames('form-control form-control-cst pageCstSelect ', {
                          'is-invalid': bookingErrors && !isEmpty(bookingErrors.gtpId),
                        })}
                        noOptionsMessage={() => 'No results found'}
                        onChange={(e) => handleSelectForm('gtpId', e)}
                        onMenuOpen={(e) => handleSelectFocus('gtpId', e)}
                      />
                      <CFormFeedback invalid className="fieldError-cst">
                        {bookingErrors.gtpId}
                      </CFormFeedback>
                    </div>
                  </div>
                </div>
              </CCol>
              <CCol md={2} sm={2} lg={2} xl={2}>
                <div className="form-group select optional loading_tag_names">
                  <label className="control-label select optional" htmlFor="loading_tag_names">
                    Booking Category
                  </label>
                  <div>
                    <CFormInput
                      className="form-control-cst"
                      type="text"
                      name="tagNames"
                      id="loading_tag_names"
                      value={bookingData.tagNames}
                      invalid={bookingErrors && !isEmpty(bookingErrors.tagNames) ? true : false}
                      onChange={(e) => handleChangeForm(e)}
                      onFocus={() =>
                        dispatch(clearBookingError({ type: 'tagNames', errorType: 'errBooking' }))
                      }
                    />
                    <CFormFeedback invalid className="fieldError-cst">
                      {bookingErrors.tagNames}
                    </CFormFeedback>
                  </div>
                </div>
              </CCol>
            </CRow>
            <div className="separator"></div>
            <CRow id="booking_form_buttons">
              <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6"></div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <CButton
                  type="submit"
                  color="info"
                  className="float-right"
                  disabled={updatingBooking ? true : false}
                >
                  {updatingBooking ? (
                    'Processing...'
                  ) : (
                    <span>
                      Next <i className="fa fa-arrow-right ml-2" />
                    </span>
                  )}{' '}
                </CButton>
              </div>
            </CRow>
          </CCol>
        </div>
      </form>
    </div>
  )
}

PackageDetails.propTypes = {
  handleChangeForm: PropTypes.func.isRequired,
  bookingData: PropTypes.object.isRequired,
  handleSelectFocus: PropTypes.func.isRequired,
  handleUpdateBooking: PropTypes.func.isRequired,
  packageInput: PropTypes.array.isRequired,
  setPackageInput: PropTypes.func.isRequired,
  containerInput: PropTypes.array.isRequired,
  setContainerInput: PropTypes.func.isRequired,
}

export default PackageDetails
