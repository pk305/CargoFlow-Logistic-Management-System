import React from 'react'

const TransportPanel = () => {
  return (
    <div className="slidePanel-inner-section">
      <div className="card card-custom gutter-b">
        <div className="card-body p-6">
          <form className="simple_form horizontal-form" id="new_position">
            <div className="row">
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_contract_type">
                  <label className="control-label select optional" htmlFor="position_contract_type">
                    Contract
                  </label>
                  <select
                    className="form-control select optional"
                    name="position[contract_type]"
                    id="position_contract_type"
                  >
                    <option value="owned">Our Own Vehicle</option>
                    <option value="rented">Contracted Vehicle</option>
                    <option value="unknown">Vehicle Not-Specified</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group string optional position_extref">
                  <label className="control-label string optional" htmlFor="position_extref">
                    Booking Ref.
                  </label>
                  <input
                    className="form-control string optional"
                    type="text"
                    name="position[extref]"
                    id="position_extref"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group boolean optional position_empty_truck">
                  <label className="boolean optional" htmlFor="position_empty_truck">
                    Empty Trailer ?
                  </label>
                  <div className="checkbox-custom checkbox-primary">
                    <input name="position[empty_truck]" type="hidden" value="0" />
                    <input
                      className="boolean optional"
                      type="checkbox"
                      value="1"
                      name="position[empty_truck]"
                      id="position_empty_truck"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_operation_id">
                  <label className="control-label select optional" htmlFor="position_operation_id">
                    Operation
                  </label>
                  <select
                    className="form-control select optional"
                    name="position[operation_id]"
                    id="position_operation_id"
                  >
                    <option value=""></option>
                    <option selected="selected" value="7254">
                      Road Transports Team
                    </option>
                    <option value="7626">A</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_operator_id">
                  <label className="control-label select optional" htmlFor="position_operator_id">
                    Operator
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control select optional select2-hidden-accessible"
                        data-plugin="select2"
                        name="position[operator_id]"
                        id="position_operator_id"
                        data-select2-id="position_operator_id"
                        aria-hidden="true"
                      >
                        <option value=""></option>
                        <option selected="selected" value="4121" data-select2-id="538">
                          James
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_branch_id">
                  <label className="control-label select optional" htmlFor="position_branch_id">
                    Branch
                  </label>
                  <select
                    className="form-control select optional"
                    name="position[branch_id]"
                    id="position_branch_id"
                  >
                    <option value=""></option>
                    <option value="1531">Branch B</option>
                    <option selected="selected" value="1528">
                      Head Office
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="rented" style={{ display: 'none' }}>
              <div className="row">
                <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_vessel_code">
                    <label className="control-label string optional" htmlFor="position_vessel_code">
                      Trailer
                    </label>
                    <input
                      className="form-control string optional"
                      type="text"
                      name="position[vessel_code]"
                      id="position_vessel_code"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_truck_code">
                    <label className="control-label string optional" htmlFor="position_truck_code">
                      2.Transport Means
                    </label>
                    <input
                      className="form-control string optional"
                      type="text"
                      name="position[truck_code]"
                      id="position_truck_code"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group select optional position_truck_type">
                    <label className="control-label select optional" htmlFor="position_truck_type">
                      Truck Type
                    </label>
                    <select
                      className="form-control select optional"
                      name="position[truck_type]"
                      id="position_truck_type"
                    >
                      <option value=""></option>
                      <option value="trailer">Trailer</option>
                      <option value="truck">Truck</option>
                      <option value="lorry">Lorry</option>
                      <option value="van">Van</option>
                      <option value="forklift">Forklift</option>
                      <option value="bus">Bus</option>
                      <option value="car">Otomobile</option>
                      <option value="tanker">Tanker</option>
                      <option value="tractor">Tractor</option>
                      <option value="romork">Römork</option>
                      <option value="crane">Crane</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="container">Container</option>
                      <option value="wagon">Wagon</option>
                      <option value="swapbody">swapbody</option>
                      <option value="minivan">Minivan</option>
                      <option value="frigo">Frigo</option>
                      <option value="flatbed">flatbed</option>
                      <option value="tarpaulin_truck">tarpaulin_truck</option>
                      <option value="box_container">box_container</option>
                    </select>
                  </div>
                </div>
                <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_driver_name">
                    <label className="control-label string optional" htmlFor="position_driver_name">
                      Driver Name
                    </label>
                    <input
                      className="form-control string optional"
                      type="text"
                      name="position[driver_name]"
                      id="position_driver_name"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group string optional position_driver_tel">
                    <label className="control-label string optional" htmlFor="position_driver_tel">
                      Driver Phone
                    </label>
                    <input
                      className="form-control string optional"
                      type="text"
                      name="position[driver_tel]"
                      id="position_driver_tel"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group company optional position_supplier_id">
                    <label
                      className="control-label company optional"
                      htmlFor="position_supplier_id"
                    >
                      Supplier Company
                    </label>
                    <div>
                      <div className="input-group">
                        <select
                          className="form-control company-select select2-hidden-accessible"
                          data-url="/roster/autocompletes.json?model=Network::Company&amp;source_type="
                          name="position[supplier_id]"
                          id="position_supplier_id"
                          data-select2-id="position_supplier_id"
                          aria-hidden="true"
                        >
                          <option value="" data-select2-id="559"></option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group decimal optional position_freight_price">
                    <label
                      className="control-label decimal optional"
                      htmlFor="position_freight_price"
                    >
                      Carrier Freight Price
                    </label>
                    <input
                      className="form-control numeric decimal optional"
                      type="number"
                      step="any"
                      value="0.0"
                      name="position[freight_price]"
                      id="position_freight_price"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                  <div className="form-group select optional position_freight_curr">
                    <label
                      className="control-label select optional"
                      htmlFor="position_freight_curr"
                    >
                      Currency
                    </label>
                    <select
                      className="form-control select optional"
                      name="position[freight_curr]"
                      id="position_freight_curr"
                    >
                      <option value=""></option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="CHF">CHF</option>
                      <option value="CAD">CAD</option>
                      <option value="CZK">CZK</option>
                      <option value="SEK">SEK</option>
                      <option value="PLN">PLN</option>
                      <option value="NOK">NOK</option>
                      <option value="AUD">AUD</option>
                      <option value="DKK">DKK</option>
                      <option value="KWD">KWD</option>
                      <option value="SAR">SAR</option>
                      <option value="RON">RON</option>
                      <option value="BGN">BGN</option>
                      <option value="RUB">RUB</option>
                      <option value="PKR">PKR</option>
                      <option value="CNY">CNY</option>
                      <option value="IRR">IRR</option>
                      <option value="JPY">JPY</option>
                      <option value="SGD">SGD</option>
                      <option value="AZN">AZN</option>
                      <option value="AED">AED</option>
                      <option value="HKD">HKD</option>
                      <option value="HUF">HUF</option>
                      <option value="MKD">MKD</option>
                      <option value="MYR">MYR</option>
                      <option value="KRW">KRW</option>
                      <option value="INR">INR</option>
                      <option value="XAU">XAU</option>
                      <option value="XAG">XAG</option>
                      <option value="XPT">XPT</option>
                      <option value="ZAR">ZAR</option>
                      <option value="VND">VND</option>
                      <option value="GEL">GEL</option>
                      <option value="GBP">GBP</option>
                      <option value="TRY">TRY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="owned row">
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group vehicle optional position_vessel_id">
                  <label className="control-label vehicle optional" htmlFor="position_vessel_id">
                    Trailer
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control vehicle-select select2-hidden-accessible"
                        data-url="/roster/autocompletes.json?model=Fleet::Vehicle&amp;truck_type=vessel"
                        data-newurl="/vehicles/new"
                        data-placeholder=""
                        data-driver-field="position_driver_id"
                        data-person-field=""
                        data-odometer-field="position_dep_odemeter"
                        data-covehicle-field="position_truck_id"
                        data-company-filter=""
                        data-plugin="lookup"
                        data-minimuminputlength="0"
                        name="position[vessel_id]"
                        id="position_vessel_id"
                        data-select2-id="position_vessel_id"
                        aria-hidden="true"
                      >
                        <option value="" data-select2-id="561"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group vehicle optional position_truck_id">
                  <label className="control-label vehicle optional" htmlFor="position_truck_id">
                    Tractor Unit
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control vehicle-select select2-hidden-accessible"
                        data-url="/roster/autocompletes.json?model=Fleet::Vehicle&amp;truck_type=truck"
                        data-newurl="/vehicles/new"
                        data-placeholder=""
                        data-driver-field="position_driver_id"
                        data-person-field=""
                        data-odometer-field="position_dep_odemeter"
                        data-covehicle-field="position_vessel_id"
                        data-company-filter=""
                        data-plugin="lookup"
                        data-minimuminputlength="0"
                        name="position[truck_id]"
                        id="position_truck_id"
                        data-select2-id="position_truck_id"
                        aria-hidden="true"
                      >
                        <option value="" data-select2-id="563"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-8 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group driver optional position_driver_id">
                  <label className="control-label driver optional" htmlFor="position_driver_id">
                    Driver
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control driver-select select2-hidden-accessible"
                        data-url="/roster/autocompletes.json?model=Fleet::Driver"
                        data-newurl="/drivers/new"
                        data-placeholder=""
                        data-form-scope=""
                        data-vehicle-field=""
                        data-driver-tel=""
                        data-plugin="lookup"
                        data-minimuminputlength="0"
                        name="position[driver_id]"
                        id="position_driver_id"
                        data-select2-id="position_driver_id"
                        aria-hidden="true"
                      >
                        <option value="" data-select2-id="565"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group integer optional position_dep_odemeter">
                      <label
                        className="control-label integer optional"
                        htmlFor="position_dep_odemeter"
                      >
                        Departure Km
                      </label>
                      <input
                        className="form-control numeric integer optional"
                        type="number"
                        step="1"
                        value="0"
                        name="position[dep_odemeter]"
                        id="position_dep_odemeter"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group integer optional position_arv_odemeter">
                      <label
                        className="control-label integer optional"
                        htmlFor="position_arv_odemeter"
                      >
                        Arrival Km
                      </label>
                      <input
                        className="form-control numeric integer optional"
                        type="number"
                        step="1"
                        value="0"
                        name="position[arv_odemeter]"
                        id="position_arv_odemeter"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group decimal optional position_total_fuel">
                      <label
                        className="control-label decimal optional"
                        htmlFor="position_total_fuel"
                      >
                        Total Fuel
                      </label>
                      <input
                        className="form-control numeric decimal optional"
                        type="number"
                        step="any"
                        value="0.0"
                        name="position[total_fuel]"
                        id="position_total_fuel"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group decimal optional position_driver_payment">
                      <label
                        className="control-label decimal optional"
                        htmlFor="position_driver_payment"
                      >
                        Travel Payment
                      </label>
                      <input
                        className="form-control numeric decimal optional"
                        type="number"
                        step="any"
                        value="0.0"
                        name="position[driver_payment]"
                        id="position_driver_payment"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_status">
                  <label className="control-label select optional" htmlFor="position_status">
                    Status
                  </label>
                  <select
                    className="form-control select optional"
                    name="position[status]"
                    id="position_status"
                  >
                    <option value=""></option>
                    <option selected="selected" value="planning">
                      Planning
                    </option>
                    <option value="active">In Transit</option>
                    <option value="delivered">Completed / Delivered</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_waybill_type">
                  <label className="control-label select optional" htmlFor="position_waybill_type">
                    Transit Type
                  </label>
                  <select
                    className="form-control select optional"
                    name="position[waybill_type]"
                    id="position_waybill_type"
                  >
                    <option value=""></option>
                    <option value="t1">T1/T2</option>
                    <option value="tir_karnesi">Truck Report Card</option>
                    <option value="irsaliye">Waybill</option>
                    <option value="ata_belgesi">ATA Certificate</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group string optional position_waybill_no">
                  <label className="control-label string optional" htmlFor="position_waybill_no">
                    Transit Doc. No
                  </label>
                  <input
                    className="form-control string optional"
                    type="text"
                    name="position[waybill_no]"
                    id="position_waybill_no"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group date_picker optional position_waybill_date">
                  <label
                    className="control-label date_picker optional"
                    htmlFor="position_waybill_date"
                  >
                    Transit Doc. Date
                  </label>
                  <input
                    className="form-control string date_picker optional flatpickr-input"
                    type="hidden"
                    data-plugin="datepicker"
                    name="position[waybill_date]"
                    id="position_waybill_date"
                  />
                  <input
                    className="form-control string date_picker optional form-control input"
                    placeholder=""
                    type="text"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2"></div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_project_id">
                  <label className="control-label select optional" htmlFor="position_project_id">
                    Project
                  </label>
                  <select
                    className="form-control select optional select2-hidden-accessible"
                    data-plugin="select2"
                    name="position[project_id]"
                    id="position_project_id"
                    data-select2-id="position_project_id"
                    aria-hidden="true"
                  >
                    <option value="" data-select2-id="541"></option>
                  </select>
                </div>
              </div>
            </div>

            <hr />
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <h4 className="font-size-h4 font-weight-bolder mb-6 py-3 border-bottom">
                  Departure &amp; Arrival Ports
                </h4>
              </div>
            </div>
            <div className="row" id="departure_partial">
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group datetime_picker optional position_departure_date">
                  <label
                    className="control-label datetime_picker optional"
                    htmlFor="position_departure_date"
                  >
                    Departure Date
                  </label>
                  <input
                    className="form-control string datetime_picker optional flatpickr-input"
                    type="text"
                    data-plugin="datetimepicker"
                    name="position[departure_date]"
                    id="position_departure_date"
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12 col-xs-12">
                <div className="form-group string optional position_dep_place_name">
                  <label
                    className="control-label string optional"
                    htmlFor="position_dep_place_name"
                  >
                    Departure Place
                  </label>
                  <div>
                    <div className="input-group">
                      <input
                        className="form-control string optional"
                        data-place-city="#position_dep_city"
                        data-place-country="#position_dep_country_id"
                        data-place-type="#position_dep_place_type"
                        data-place-id="#position_dep_place_id"
                        data-plugin="typeahead-place"
                        type="text"
                        value=""
                        name="position[dep_place_name]"
                        id="position_dep_place_name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                <div className="form-group city optional position_dep_city_id">
                  <label className="control-label city optional" htmlFor="position_dep_city_id">
                    Departure City
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control chosen_input city-select select2-hidden-accessible"
                        data-url="/roster/autocompletes.json?model=Nimbos::City"
                        data-newurl="/cities/new"
                        data-placeholder=""
                        data-country_id="position_dep_country_id"
                        data-address-role=""
                        data-plugin="lookup"
                        name="position[dep_city_id]"
                        id="position_dep_city_id"
                        data-select2-id="position_dep_city_id"
                        aria-hidden="true"
                      >
                        <option value="" data-select2-id="567"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_dep_country_id">
                  <label
                    className="control-label select optional"
                    htmlFor="position_dep_country_id"
                  >
                    Collection Country
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control select optional select2-hidden-accessible"
                        data-plugin="select2"
                        name="position[dep_country_id]"
                        id="position_dep_country_id"
                        data-select2-id="position_dep_country_id"
                        aria-hidden="true"
                      >
                        <option value=""></option>
                        <option selected="selected" value="AD" data-select2-id="543">
                          AD-ANDORRA
                        </option>
                        <option value="AE">AE-UNITED ARAB EMIRATES</option>
                        <option value="AF">AF-AFGHANISTAN</option>

                        <option value="ZW">ZW-ZIMBABWE</option>
                        <option value="ZZ">ZZ-NAHÇIVAN</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" id="arrival_partial">
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group datetime_picker optional position_arrival_date">
                  <label
                    className="control-label datetime_picker optional"
                    htmlFor="position_arrival_date"
                  >
                    Arrival Date
                  </label>
                  <input
                    className="form-control string datetime_picker optional flatpickr-input"
                    type="text"
                    data-plugin="datetimepicker"
                    name="position[arrival_date]"
                    id="position_arrival_date"
                  />
                </div>
              </div>
              <div className="col-md-4 col-sm-12 col-xs-12">
                <div className="form-group string optional position_arv_place_name">
                  <label
                    className="control-label string optional"
                    htmlFor="position_arv_place_name"
                  >
                    Arrival Place
                  </label>
                  <div>
                    <div className="input-group">
                      <input
                        className="form-control string optional"
                        data-place-city="#position_arv_city"
                        data-place-country="#position_arv_country_id"
                        data-place-type="#position_arv_place_type"
                        data-place-id="#position_arv_place_id"
                        data-plugin="typeahead-place"
                        type="text"
                        value=""
                        name="position[arv_place_name]"
                        id="position_arv_place_name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                <div className="form-group city optional position_arv_city_id">
                  <label className="control-label city optional" htmlFor="position_arv_city_id">
                    Arrival City
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control chosen_input city-select select2-hidden-accessible"
                        data-url="/roster/autocompletes.json?model=Nimbos::City"
                        data-newurl="/cities/new"
                        data-placeholder=""
                        data-country_id="position_arv_country_id"
                        data-address-role=""
                        data-plugin="lookup"
                        name="position[arv_city_id]"
                        id="position_arv_city_id"
                        data-select2-id="position_arv_city_id"
                        aria-hidden="true"
                      >
                        <option value="" data-select2-id="569"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_arv_country_id">
                  <label
                    className="control-label select optional"
                    htmlFor="position_arv_country_id"
                  >
                    Delivery Country
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control select optional select2-hidden-accessible"
                        data-plugin="select2"
                        name="position[arv_country_id]"
                        id="position_arv_country_id"
                        data-select2-id="position_arv_country_id"
                        aria-hidden="true"
                      >
                        <option value=""></option>
                        <option value="AD">AD-ANDORRA</option>
                        <option value="AE">AE-UNITED ARAB EMIRATES</option>
                        <option value="AF">AF-AFGHANISTAN</option>
                        <option value="AG">AG-ANTIGUA AND BARBUDA</option>
                        <option selected="selected" value="AI" data-select2-id="546">
                          AI-ANGUILLA
                        </option>
                        <option value="AL">AL-ALBANIA</option>
                        <option value="AM">AM-ARMENIA</option>
                        <option value="ZW">ZW-ZIMBABWE</option>
                        <option value="ZZ">ZZ-NAHÇIVAN</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group select optional position_route_id">
                  <label className="control-label select optional" htmlFor="position_route_id">
                    Route
                  </label>
                  <div>
                    <div className="input-group">
                      <select
                        className="form-control select optional select2-hidden-accessible"
                        data-plugin="select2"
                        name="position[route_id]"
                        id="position_route_id"
                        data-select2-id="position_route_id"
                        aria-hidden="true"
                      >
                        <option value="" data-select2-id="549"></option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group string optional position_route_notes">
                  <label className="control-label string optional" htmlFor="position_route_notes">
                    Route Notes
                  </label>
                  <input
                    className="form-control string optional"
                    type="text"
                    name="position[route_notes]"
                    id="position_route_notes"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-4 col-md-2 col-lg-2 col-xl-2">
                <div className="form-group decimal optional position_route_km">
                  <label className="control-label decimal optional" htmlFor="position_route_km">
                    Route Km
                  </label>
                  <input
                    className="form-control numeric decimal optional"
                    type="number"
                    step="any"
                    value="0.0"
                    name="position[route_km]"
                    id="position_route_km"
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="form-group text optional position_notes">
                  <label className="control-label text optional" htmlFor="position_notes">
                    Notes
                  </label>
                  <textarea
                    className="form-control text optional"
                    rows="1"
                    name="position[notes]"
                    id="position_notes"
                  ></textarea>
                </div>
              </div>
            </div>
            <input type="hidden" id="form_places_trans_method" value="road" />
            <div className="form-actions">
              <input type="hidden" name="source_field" id="position_submit_button" value="" />
              <input
                type="submit"
                name="commit"
                value="Save"
                className="btn btn-success"
                data-disable-with="Save"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TransportPanel
