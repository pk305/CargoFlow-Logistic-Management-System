import React from 'react'

const CreateProspect = () => {
  return (
    <div>
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <h4 className="fs-h4 font-weight-bolder mb-6 py-3 border-bottom">
            <div className="card-title">
              <div className="">Prospects</div>
              <div className="tools">
                {/* eslint-disable-next-line */}
                <a href="#" className="collapse"></a>
              </div>
              <div className="actions hide_on_closed"></div>
            </div>
          </h4>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-5" data-select2-id="8190">
          <div
            className="form-group company optional opportunity_company_id"
            data-select2-id="8189"
          >
            <label className="control-label company optional" htmlFor="opportunity_company_id">
              Company
            </label>
            <div>
              <div className="input-group">
                <select
                  className="form-control company-select select2-hidden-accessible"
                  name="opportunity[company_id]"
                  id="opportunity_company_id"
                  data-select2-id="opportunity_company_id"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <option value="" data-select2-id="8182"></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1 col-sm-2 col-md-1 col-lg-1 p-0">
          {/* eslint-disable-next-line */}
          <a
            href="#"
            id="company-address-link"
            data-href="#company-address-fields"
            className="btn btn-sm btn-outline-secondary mt-7 togglebutton"
          >
            <i className="fas fa-ellipsis-h"></i>
          </a>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_prospect_type">
            <label className="control-label select optional" htmlFor="opportunity_prospect_type">
              Prospect Type
            </label>
            <select
              className="form-control select optional"
              name="opportunity[prospect_type]"
              id="opportunity_prospect_type"
            >
              <option value=""></option>
              <option value="new_prospect">New Prospect</option>
              <option value="renewal">Renewal</option>
            </select>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_tag_names">
            <label className="control-label select optional" htmlFor="opportunity_tag_names">
              Tags
            </label>
            <div>
              <div className="input-group">
                <input name="opportunity[tag_names][]" type="hidden" value="" />
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="tag_select"
                  multiple=""
                  name="opportunity[tag_names][]"
                  id="opportunity_tag_names"
                  data-select2-id="opportunity_tag_names"
                  tabIndex="-1"
                  aria-hidden="true"
                ></select>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_branch_id">
            <label className="control-label select optional" htmlFor="opportunity_branch_id">
              Branch
            </label>
            <select
              className="form-control select optional"
              name="opportunity[branch_id]"
              id="opportunity_branch_id"
            >
              <option value="1380">Head Office</option>
            </select>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_company_type">
            <label className="control-label select optional" htmlFor="opportunity_company_type">
              Company Type
            </label>
            <select
              className="form-control select optional"
              name="opportunity[company_type]"
              id="opportunity_company_type"
            >
              <option value=""></option>
              <option value="Agent">Agent</option>
              <option value="Airline">Airline</option>
              <option value="Competitor">Competitor</option>
              <option value="Customer">Customer</option>
              <option value="Customs Officer">Customs Officer</option>
              <option value="Partner">Partner</option>
              <option value="Shipowner">Shipowner</option>
              <option value="Supplier">Supplier</option>
              <option value="Trader">Trader(Exporter/Importer)</option>
            </select>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_business_type">
            <label className="control-label select optional" htmlFor="opportunity_business_type">
              Company Sector
            </label>
            <select
              className="form-control select optional"
              name="opportunity[business_type]"
              id="opportunity_business_type"
            >
              <option value=""></option>
              <option value="Aerospace">Aerospace, Defense Industry</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Air Transport">Air Transport</option>
              <option value="Alcohol">Alcohol Beverages</option>
              <option value="Automotive">Automotive, Car Manufacturing</option>
              <option value="Chemical">Chemical &amp; Related Manufacturing</option>
              <option value="Construction">Construction, Building Materials &amp; Equipment</option>
              <option value="Electronics">Electronics Manufacturing &amp; Equipment</option>
              <option value="Energy">Energy Production &amp; Services</option>
              <option value="Food">Food &amp; Beverage &amp; Bars &amp; Restaurants</option>
              <option value="Gas&amp;Oil">Gas &amp; Oil</option>
              <option value="Pharmaceuticals">
                Pharmaceuticals / Health Products &amp; Medical Supplies
              </option>
              <option value="Publishing">Newspaper, Magazine &amp; Book Publishing</option>
              <option value="Rail Transport">Rail Transport</option>
              <option value="Road Transport">Road Transport</option>
              <option value="Sea Transport">Sea Transport</option>
              <option value="Textile">Textile, Clothing Manufacturing</option>
              <option value="Tobacco">Tobacco Products</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_operator_id">
            <label className="control-label select optional" htmlFor="opportunity_operator_id">
              Operation Rep.
            </label>
            <select
              className="form-control select optional select2-hidden-accessible"
              data-plugin="select2"
              name="opportunity[operator_id]"
              id="opportunity_operator_id"
              data-select2-id="opportunity_operator_id"
              tabIndex="-1"
              aria-hidden="true"
            >
              <option value="" data-select2-id="7923"></option>
              <option value="3835">Kennedy Peter</option>
            </select>
          </div>
        </div>
      </div>
      <div id="company-address-fields" className="row slidingDiv" style={{ display: 'none' }}>
        <div className="col-12 col-md-6">
          <div className="form-group string required opportunity_company_name">
            <label className="control-label string required" htmlFor="opportunity_company_name">
              <abbr title="required">*</abbr> Company Name
            </label>
            <input
              className="form-control string required"
              type="text"
              name="opportunity[company_name]"
              id="opportunity_company_name"
            />
          </div>
        </div>
        <div
          data-role="sender_locations"
          className="col-md-1 col-sm-1 col-xs-2 slidingDiv"
          style={{ display: 'none' }}
        ></div>
        <div className="col-12 col-md-2"></div>
        <div className="col-12 col-md-6">
          <div className="form-group string optional opportunity_address">
            <label className="control-label string optional" htmlFor="opportunity_address">
              Address
            </label>
            <input
              className="form-control string optional"
              data-address-role="opportunity_address"
              type="text"
              name="opportunity[address]"
              id="opportunity_address"
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group city optional opportunity_city_id">
            <label className="control-label city optional" htmlFor="opportunity_city_id">
              City
            </label>
            <div>
              <div className="input-group">
                <select
                  className="form-control chosen_input city-select select2-hidden-accessible"
                  name="opportunity[city_id]"
                  id="opportunity_city_id"
                  data-select2-id="opportunity_city_id"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <option value="" data-select2-id="8184"></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_country_id">
            <label className="control-label select optional" htmlFor="opportunity_country_id">
              Country
            </label>
            <select
              className="form-control select optional select2-hidden-accessible"
              data-plugin="select2"
              data-address-role="opportunity_country_id"
              name="opportunity[country_id]"
              id="opportunity_country_id"
              data-select2-id="opportunity_country_id"
              tabIndex="-1"
              aria-hidden="true"
            >
              <option value=""></option>
              <option value="+3">+3-CIBUTI</option>
              <option value="ZZ">ZZ-NAHÇIVAN</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-3">
          <div className="form-group string optional opportunity_contact_name">
            <label className="control-label string optional" htmlFor="opportunity_contact_name">
              Contact Person
            </label>
            <input
              className="form-control string optional"
              type="text"
              name="opportunity[contact_name]"
              id="opportunity_contact_name"
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group string optional opportunity_contact_tel">
            <label className="control-label string optional" htmlFor="opportunity_contact_tel">
              Contact Phone
            </label>
            <input
              className="form-control string optional"
              type="text"
              name="opportunity[contact_tel]"
              id="opportunity_contact_tel"
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_contact_email">
            <label className="control-label select optional" htmlFor="opportunity_contact_email">
              Contact E-mail
            </label>
            <div>
              <div className="input-group">
                <select
                  className="form-control select optional select2-hidden-accessible"
                  data-plugin="tag_select"
                  multiple=""
                  name="opportunity[contact_email][]"
                  id="opportunity_contact_email"
                  data-select2-id="opportunity_contact_email"
                  tabIndex="-1"
                  aria-hidden="true"
                ></select>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="form-group select optional opportunity_pipeline_id">
            <label className="control-label select optional" htmlFor="opportunity_pipeline_id">
              Pipeline
            </label>
            <select
              className="form-control select optional"
              name="opportunity[pipeline_id]"
              id="opportunity_pipeline_id"
            >
              <option value=""></option>
              <option value="default">Default</option>
              <option value="e_logistic">E-Lojistik</option>
            </select>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="form-group text optional opportunity_notes">
            <label className="control-label text optional" htmlFor="opportunity_notes">
              Notes
            </label>
            <textarea
              className="form-control text optional"
              name="opportunity[notes]"
              id="opportunity_notes"
            ></textarea>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group boolean optional opportunity_has_depot">
            <label className="boolean optional" htmlFor="opportunity_has_depot">
              Using Warehouse ?
            </label>
            <div className="checkbox-custom checkbox-primary">
              <input name="opportunity[has_depot]" type="hidden" value="0" />
              <input
                className="boolean optional"
                type="checkbox"
                value="1"
                name="opportunity[has_depot]"
                id="opportunity_has_depot"
              />
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group boolean optional opportunity_has_warehouse">
            <label className="boolean optional" htmlFor="opportunity_has_warehouse">
              Using Bonded Warehouse ?
            </label>
            <div className="checkbox-custom checkbox-primary">
              <input name="opportunity[has_warehouse]" type="hidden" value="0" />
              <input
                className="boolean optional"
                type="checkbox"
                value="1"
                name="opportunity[has_warehouse]"
                id="opportunity_has_warehouse"
              />
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group boolean optional opportunity_has_domestic">
            <label className="boolean optional" htmlFor="opportunity_has_domestic">
              Has Domestic Transports ?
            </label>
            <div className="checkbox-custom checkbox-primary">
              <input name="opportunity[has_domestic]" type="hidden" value="0" />
              <input
                className="boolean optional"
                type="checkbox"
                value="1"
                name="opportunity[has_domestic]"
                id="opportunity_has_domestic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProspect
