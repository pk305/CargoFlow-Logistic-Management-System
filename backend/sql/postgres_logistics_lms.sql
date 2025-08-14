-- PostgreSQL Database Schema
-- Converted from MySQL phpMyAdmin dump
-- Database: logistics_lms

-- Set timezone
SET TIME ZONE 'UTC';

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- Table structure for table bookings
-- --------------------------------------------------------

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    operation_id VARCHAR(255) NOT NULL,
    receipt_no VARCHAR(255) NOT NULL UNIQUE,
    load_type VARCHAR(255) NOT NULL,
    company_id BIGINT NOT NULL,
    customer_ref VARCHAR(255) DEFAULT NULL,
    saler_id BIGINT DEFAULT NULL,
    contact_id BIGINT DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    vagon_no VARCHAR(255) DEFAULT NULL,
    hbl_date VARCHAR(255) DEFAULT NULL,
    talex VARCHAR(255) DEFAULT NULL,
    free_time INTEGER DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    created_by BIGINT NOT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table booking_collection_points
-- --------------------------------------------------------

CREATE TABLE booking_collection_points (
    id BIGSERIAL PRIMARY KEY,
    load_date TIMESTAMP NULL DEFAULT NULL,
    sender_id BIGINT DEFAULT NULL,
    loader_id BIGINT DEFAULT NULL,
    load_place_type VARCHAR(255) DEFAULT NULL,
    load_place VARCHAR(255) DEFAULT NULL,
    load_place_id VARCHAR(255) DEFAULT NULL,
    dep_zipcode VARCHAR(255) DEFAULT NULL,
    load_city_id BIGINT DEFAULT NULL,
    load_country VARCHAR(255) DEFAULT NULL,
    load_custom_id VARCHAR(255) DEFAULT NULL,
    load_customofficer_id VARCHAR(255) DEFAULT NULL,
    check_load_customofficer VARCHAR(255) DEFAULT NULL,
    load_center_id BIGINT DEFAULT NULL,
    booking_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table booking_delivery_points
-- --------------------------------------------------------

CREATE TABLE booking_delivery_points (
    id BIGSERIAL PRIMARY KEY,
    unload_date TIMESTAMP NULL DEFAULT NULL,
    consignee_id BIGINT DEFAULT NULL,
    delivery_id BIGINT DEFAULT NULL,
    termin_date VARCHAR(255) DEFAULT NULL,
    unload_place_type VARCHAR(255) DEFAULT NULL,
    unload_place VARCHAR(255) DEFAULT NULL,
    unload_place_id BIGINT DEFAULT NULL,
    arv_zipcode VARCHAR(255) DEFAULT NULL,
    unload_city_id VARCHAR(255) DEFAULT NULL,
    unload_country VARCHAR(255) DEFAULT NULL,
    unload_custom_id BIGINT DEFAULT NULL,
    unload_customofficer_id BIGINT DEFAULT NULL,
    check_load_customofficer VARCHAR(255) DEFAULT NULL,
    unload_center_id BIGINT DEFAULT NULL,
    booking_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table booking_other_details
-- --------------------------------------------------------

CREATE TABLE booking_other_details (
    id BIGSERIAL PRIMARY KEY,
    freight_price INTEGER DEFAULT NULL,
    freight_curr VARCHAR(255) DEFAULT NULL,
    incoterm VARCHAR(255) DEFAULT NULL,
    ppcc VARCHAR(255) DEFAULT NULL,
    letter_of_credit BOOLEAN DEFAULT NULL,
    notes TEXT,
    agent_id BIGINT DEFAULT NULL,
    agent_ref VARCHAR(255) DEFAULT NULL,
    notify1_id BIGINT DEFAULT NULL,
    notify2_id BIGINT DEFAULT NULL,
    service_type_id BIGINT DEFAULT NULL,
    product_price INTEGER DEFAULT NULL,
    product_curr VARCHAR(255) DEFAULT NULL,
    channel VARCHAR(255) DEFAULT NULL,
    document_date VARCHAR(255) DEFAULT NULL,
    project_id VARCHAR(255) DEFAULT NULL,
    booking_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table booking_package_details
-- --------------------------------------------------------

CREATE TABLE booking_package_details (
    id BIGSERIAL PRIMARY KEY,
    in_container VARCHAR(255) DEFAULT NULL,
    commodity TEXT,
    total_pack INTEGER DEFAULT NULL,
    brut_wg INTEGER DEFAULT NULL,
    volume INTEGER DEFAULT NULL,
    ladameter INTEGER DEFAULT NULL,
    price_wg INTEGER DEFAULT NULL,
    commodity_type VARCHAR(255) DEFAULT NULL,
    hts_no INTEGER DEFAULT NULL,
    addr_unno VARCHAR(255) DEFAULT NULL,
    optimum_temperature INTEGER DEFAULT NULL,
    gtip_id INTEGER DEFAULT NULL,
    tag_names VARCHAR(255) DEFAULT NULL,
    booking_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table branches
-- --------------------------------------------------------

CREATE TABLE branches (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manager_id BIGINT DEFAULT NULL,
    phone VARCHAR(255) DEFAULT NULL,
    fax VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    country_id VARCHAR(255) NOT NULL,
    city_id BIGINT DEFAULT NULL,
    postcode VARCHAR(255) DEFAULT NULL,
    account_code VARCHAR(255) DEFAULT NULL,
    profit_center_code VARCHAR(255) DEFAULT NULL,
    company_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table cities
-- --------------------------------------------------------

CREATE TABLE cities (
    id BIGSERIAL PRIMARY KEY,
    country_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) DEFAULT NULL,
    tel_code VARCHAR(255) DEFAULT NULL,
    states_code VARCHAR(255) DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table companies
-- --------------------------------------------------------

CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    main_branch BOOLEAN DEFAULT NULL,
    address TEXT,
    branch_id BIGINT DEFAULT NULL,
    city_id BIGINT DEFAULT NULL,
    city_name VARCHAR(255) DEFAULT NULL,
    district VARCHAR(255) DEFAULT NULL,
    country_id VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    eori_code VARCHAR(255) DEFAULT NULL,
    lat BIGINT DEFAULT NULL,
    lng BIGINT DEFAULT NULL,
    saler_id BIGINT DEFAULT NULL,
    financial_id BIGINT DEFAULT NULL,
    saler_name VARCHAR(255) DEFAULT NULL,
    taxno VARCHAR(255) DEFAULT NULL,
    taxoffice VARCHAR(255) DEFAULT NULL,
    text VARCHAR(255) DEFAULT NULL,
    postcode VARCHAR(255) DEFAULT NULL,
    telephone VARCHAR(255) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    fax VARCHAR(255) DEFAULT NULL,
    notes TEXT,
    logo VARCHAR(255) DEFAULT NULL,
    logo_url VARCHAR(255) DEFAULT NULL,
    favicon VARCHAR(255) DEFAULT NULL,
    favicon_url VARCHAR(255) DEFAULT NULL,
    is_client BOOLEAN NOT NULL DEFAULT FALSE,
    company_type VARCHAR(255) DEFAULT NULL,
    company_group VARCHAR(255) DEFAULT NULL,
    tag_names JSONB DEFAULT NULL,
    company_sector VARCHAR(255) DEFAULT NULL,
    due_day VARCHAR(255) DEFAULT NULL,
    logo_base64 TEXT,
    timezone_id BIGINT DEFAULT NULL,
    persona VARCHAR(255) DEFAULT NULL,
    status VARCHAR(100) DEFAULT 'active',
    contact_name VARCHAR(100) DEFAULT NULL,
    job_title VARCHAR(255) DEFAULT NULL,
    contact_phone VARCHAR(100) DEFAULT NULL,
    contact_email VARCHAR(100) DEFAULT NULL,
    contact_website VARCHAR(255) DEFAULT NULL,
    contact_fax VARCHAR(255) DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table contacts
-- --------------------------------------------------------

CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    jobtitle VARCHAR(255) DEFAULT NULL,
    telephone VARCHAR(255) DEFAULT NULL,
    company_id BIGINT DEFAULT NULL,
    gsm VARCHAR(255) DEFAULT NULL,
    skype VARCHAR(255) DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    road_notify VARCHAR(255) DEFAULT NULL,
    sea_notify VARCHAR(255) DEFAULT NULL,
    air_notify VARCHAR(255) DEFAULT NULL,
    rail_notify VARCHAR(255) DEFAULT NULL,
    custom_notify VARCHAR(255) DEFAULT NULL,
    depot_notify VARCHAR(255) DEFAULT NULL,
    finance_notify VARCHAR(255) DEFAULT NULL,
    twitter VARCHAR(255) DEFAULT NULL,
    linkedin VARCHAR(255) DEFAULT NULL,
    facebook VARCHAR(255) DEFAULT NULL,
    instagram VARCHAR(255) DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    saved BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------
-- Table structure for table containers
-- --------------------------------------------------------

CREATE TABLE containers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL,
    container_type VARCHAR(255) DEFAULT NULL,
    sealno VARCHAR(255) DEFAULT NULL,
    pack_total VARCHAR(255) DEFAULT NULL,
    pack_code VARCHAR(255) DEFAULT NULL,
    pack_type VARCHAR(255) DEFAULT NULL,
    weight INTEGER DEFAULT NULL,
    volume INTEGER DEFAULT NULL,
    booking_package_detail_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table counters
-- --------------------------------------------------------

CREATE TABLE counters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL,
    counter_type VARCHAR(255) NOT NULL,
    prefix VARCHAR(255) DEFAULT NULL,
    suffix VARCHAR(255) DEFAULT NULL,
    count VARCHAR(255) DEFAULT NULL,
    count_str_length BIGINT DEFAULT NULL,
    period_scope VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table currency_lists
-- --------------------------------------------------------

CREATE TABLE currency_lists (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(255) DEFAULT NULL,
    multiplier VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table currency_rates
-- --------------------------------------------------------

CREATE TABLE currency_rates (
    id BIGSERIAL PRIMARY KEY,
    bank VARCHAR(255) NOT NULL,
    curr VARCHAR(255) NOT NULL,
    rate_date VARCHAR(255) NOT NULL,
    buying VARCHAR(255) NOT NULL,
    selling VARCHAR(255) NOT NULL,
    banknote_buying VARCHAR(255) NOT NULL,
    banknote_selling VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table departments
-- --------------------------------------------------------

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table drivers
-- --------------------------------------------------------

CREATE TABLE drivers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    refno VARCHAR(255) DEFAULT NULL UNIQUE,
    birth_date TIMESTAMP NULL DEFAULT NULL,
    phone_os VARCHAR(255) DEFAULT NULL,
    birth_place_id BIGINT DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    gsm VARCHAR(255) DEFAULT NULL,
    tel VARCHAR(255) DEFAULT NULL,
    work_type VARCHAR(255) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    branch_id VARCHAR(255) DEFAULT NULL,
    company_id BIGINT DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    city_id VARCHAR(255) DEFAULT NULL,
    country_id VARCHAR(255) DEFAULT NULL,
    passport VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table failed_jobs
-- --------------------------------------------------------

CREATE TABLE failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table structure for table financials
-- --------------------------------------------------------

CREATE TABLE financials (
    id BIGSERIAL PRIMARY KEY,
    company_title VARCHAR(255) NOT NULL,
    financial_email VARCHAR(255) DEFAULT NULL,
    payment_notes VARCHAR(255) DEFAULT NULL,
    information_email VARCHAR(255) DEFAULT NULL,
    invoice_notes TEXT,
    due_days BIGINT DEFAULT NULL,
    company_curr VARCHAR(255) DEFAULT NULL,
    credit_limit_control VARCHAR(255) DEFAULT NULL,
    credit_limit BIGINT DEFAULT NULL,
    credit_limit_curr VARCHAR(255) DEFAULT NULL,
    financial_status VARCHAR(255) DEFAULT NULL,
    remind_payment VARCHAR(255) DEFAULT NULL,
    financial_notes TEXT,
    company_financor_id BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table findocs
-- --------------------------------------------------------

CREATE TABLE findocs (
    id BIGSERIAL PRIMARY KEY,
    doc_date TIMESTAMP NULL DEFAULT NULL,
    doc_type VARCHAR(255) DEFAULT NULL,
    code VARCHAR(255) DEFAULT NULL,
    account_type VARCHAR(255) DEFAULT NULL,
    account_id BIGINT DEFAULT NULL,
    credit DOUBLE PRECISION DEFAULT NULL,
    curr_id BIGINT DEFAULT NULL,
    curr_rate BIGINT DEFAULT NULL,
    curr_type VARCHAR(255) DEFAULT NULL,
    related_account_type VARCHAR(255) DEFAULT NULL,
    related_account_id BIGINT DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    profit_center_id BIGINT DEFAULT NULL,
    notes TEXT,
    confirm BOOLEAN DEFAULT NULL,
    accounted BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table finitems
-- --------------------------------------------------------

CREATE TABLE finitems (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    involine_type VARCHAR(255) DEFAULT NULL,
    name_foreign VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    ext_service_id BIGINT DEFAULT NULL,
    integration_names TEXT,
    salable BOOLEAN DEFAULT NULL,
    sales_price DOUBLE PRECISION DEFAULT NULL,
    sales_curr VARCHAR(255) DEFAULT NULL,
    sales_tax_id BIGINT DEFAULT NULL,
    sales_controll_rate VARCHAR(255) DEFAULT NULL,
    sales_notes TEXT,
    purchasable BOOLEAN DEFAULT NULL,
    purchase_price DOUBLE PRECISION DEFAULT NULL,
    purchase_curr VARCHAR(255) DEFAULT NULL,
    purchase_tax_id BIGINT DEFAULT NULL,
    purchase_controll_rate BIGINT DEFAULT NULL,
    purchase_notes TEXT,
    auto_calc_finitem_id BIGINT DEFAULT NULL,
    auto_calc_rate BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table finpoints
-- --------------------------------------------------------

CREATE TABLE finpoints (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT NULL,
    point_type VARCHAR(255) DEFAULT NULL,
    curr_id BIGINT DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    reference VARCHAR(255) DEFAULT NULL,
    bank VARCHAR(255) DEFAULT NULL,
    manager_id VARCHAR(255) DEFAULT NULL,
    use_on_invoice BOOLEAN DEFAULT FALSE,
    bank_official VARCHAR(255) DEFAULT NULL,
    account_type VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    bank_definition_id VARCHAR(255) DEFAULT NULL,
    branch_code VARCHAR(255) DEFAULT NULL,
    account_code VARCHAR(255) DEFAULT NULL,
    company_code VARCHAR(255) DEFAULT NULL,
    uname VARCHAR(255) DEFAULT NULL,
    upass VARCHAR(255) DEFAULT NULL,
    vpos_id BIGINT DEFAULT NULL,
    swift_code VARCHAR(255) DEFAULT NULL,
    cost_account_type VARCHAR(255) DEFAULT NULL,
    cost_profit_center_id BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table gldocs
-- --------------------------------------------------------

CREATE TABLE gldocs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    doc_date TIMESTAMP NULL DEFAULT NULL,
    due_date VARCHAR(255) DEFAULT NULL,
    ledger_type VARCHAR(255) DEFAULT NULL,
    operation_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    slug BIGINT NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'draft',
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table gldoc_items
-- --------------------------------------------------------

CREATE TABLE gldoc_items (
    id BIGSERIAL PRIMARY KEY,
    account_type VARCHAR(255) DEFAULT NULL,
    notes TIMESTAMP NULL DEFAULT NULL,
    debit DOUBLE PRECISION DEFAULT NULL,
    credit DOUBLE PRECISION DEFAULT NULL,
    account_id VARCHAR(255) DEFAULT NULL,
    curr_id VARCHAR(255) DEFAULT NULL,
    debit_local DOUBLE PRECISION DEFAULT NULL,
    curr_rate DOUBLE PRECISION DEFAULT NULL,
    credit_local DOUBLE PRECISION DEFAULT NULL,
    gldoc_id BIGINT NOT NULL,
    profit_center_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table ibans
-- --------------------------------------------------------

CREATE TABLE ibans (
    id BIGSERIAL PRIMARY KEY,
    iban_no VARCHAR(255) NOT NULL,
    bank_id BIGINT DEFAULT NULL,
    curr VARCHAR(255) DEFAULT NULL,
    is_default BOOLEAN DEFAULT NULL,
    bank_name VARCHAR(255) DEFAULT NULL,
    bank_code VARCHAR(255) DEFAULT NULL,
    branch_code VARCHAR(255) DEFAULT NULL,
    customer_code VARCHAR(255) DEFAULT NULL,
    account_code VARCHAR(255) DEFAULT NULL,
    swift_code VARCHAR(255) DEFAULT NULL,
    id_number VARCHAR(255) DEFAULT NULL,
    title VARCHAR(255) DEFAULT NULL,
    company_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table invoices
-- --------------------------------------------------------

CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) DEFAULT NULL,
    invoice_date TIMESTAMP NULL DEFAULT NULL,
    due_date TIMESTAMP NULL DEFAULT NULL,
    curr_id BIGINT DEFAULT NULL,
    curr_rate NUMERIC(12,1) DEFAULT 1.0,
    branch_id BIGINT DEFAULT NULL,
    work_type VARCHAR(255) DEFAULT NULL,
    invoice_address TEXT,
    notes TEXT,
    profit_center_id BIGINT DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    saler_id BIGINT DEFAULT NULL,
    company_id BIGINT NOT NULL,
    ref_no VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT 'draft',
    vat_amount NUMERIC(12,2) DEFAULT NULL,
    subtotal_amount NUMERIC(12,2) DEFAULT NULL,
    net_amount NUMERIC(12,2) DEFAULT NULL,
    amount NUMERIC(12,2) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    account VARCHAR(255) DEFAULT NULL,
    account_type VARCHAR(255) DEFAULT NULL,
    invoice_type VARCHAR(255) DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table invoice_items
-- --------------------------------------------------------

CREATE TABLE invoice_items (
    id BIGSERIAL PRIMARY KEY,
    finitem_id BIGINT DEFAULT NULL,
    description VARCHAR(255) DEFAULT NULL,
    profit_center_id BIGINT DEFAULT NULL,
    unit_number NUMERIC(12,2) DEFAULT NULL,
    unit_price NUMERIC(12,2) DEFAULT NULL,
    vat_id BIGINT DEFAULT NULL,
    vat_amount NUMERIC(12,2) DEFAULT 0.00,
    amount_with_vat NUMERIC(12,2) DEFAULT NULL,
    amount_without_vat NUMERIC(12,2) DEFAULT NULL,
    invoice_id BIGINT DEFAULT NULL,
    curr_id BIGINT DEFAULT NULL,
    add_info VARCHAR(255) DEFAULT NULL,
    curr_rate NUMERIC(12,2) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table leads
-- --------------------------------------------------------

CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    ref_no VARCHAR(255) DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    due_date TIMESTAMP NULL DEFAULT NULL,
    incoterm VARCHAR(255) DEFAULT NULL,
    lead_class VARCHAR(255) DEFAULT NULL,
    saler_id BIGINT DEFAULT NULL,
    lead_type VARCHAR(255) DEFAULT NULL,
    lead_operation VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    created_by VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table ledger_accounts
-- --------------------------------------------------------

CREATE TABLE ledger_accounts (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    partner_account_code VARCHAR(255) DEFAULT NULL,
    english_name VARCHAR(255) DEFAULT NULL,
    ledgerable BOOLEAN DEFAULT NULL,
    is_partner BOOLEAN DEFAULT NULL,
    curr VARCHAR(255) DEFAULT NULL,
    account_type VARCHAR(255) DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    mapping_type VARCHAR(255) DEFAULT NULL,
    notes VARCHAR(255) DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table locations
-- --------------------------------------------------------

CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) DEFAULT NULL,
    city_id VARCHAR(255) DEFAULT NULL,
    city_name VARCHAR(255) NOT NULL,
    code VARCHAR(255) DEFAULT NULL,
    country_id VARCHAR(255) DEFAULT NULL,
    lat VARCHAR(255) DEFAULT NULL,
    lng VARCHAR(255) DEFAULT NULL,
    opening_info VARCHAR(255) DEFAULT NULL,
    place_type VARCHAR(255) DEFAULT NULL,
    postcode VARCHAR(255) DEFAULT NULL,
    contact_name VARCHAR(255) DEFAULT NULL,
    telephone VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    company_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table migrations
-- --------------------------------------------------------

CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL
);

-- --------------------------------------------------------
-- Table structure for table oauth_access_tokens
-- --------------------------------------------------------

CREATE TABLE oauth_access_tokens (
    id VARCHAR(100) PRIMARY KEY,
    user_id BIGINT DEFAULT NULL,
    client_id UUID NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    scopes TEXT,
    revoked BOOLEAN NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table oauth_auth_codes
-- --------------------------------------------------------

CREATE TABLE oauth_auth_codes (
    id VARCHAR(100) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    client_id UUID NOT NULL,
    scopes TEXT,
    revoked BOOLEAN NOT NULL,
    expires_at TIMESTAMP DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table oauth_clients
-- --------------------------------------------------------

CREATE TABLE oauth_clients (
    id UUID PRIMARY KEY,
    user_id BIGINT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    secret VARCHAR(100) DEFAULT NULL,
    provider VARCHAR(255) DEFAULT NULL,
    redirect TEXT NOT NULL,
    personal_access_client BOOLEAN NOT NULL,
    password_client BOOLEAN NOT NULL,
    revoked BOOLEAN NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table oauth_personal_access_clients
-- --------------------------------------------------------

CREATE TABLE oauth_personal_access_clients (
    id BIGSERIAL PRIMARY KEY,
    client_id UUID NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table oauth_refresh_tokens
-- --------------------------------------------------------

CREATE TABLE oauth_refresh_tokens (
    id VARCHAR(100) PRIMARY KEY,
    access_token_id VARCHAR(100) NOT NULL,
    revoked BOOLEAN NOT NULL,
    expires_at TIMESTAMP DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table operations
-- --------------------------------------------------------

CREATE TABLE operations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id BIGINT NOT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table packages
-- --------------------------------------------------------

CREATE TABLE packages (
    id BIGSERIAL PRIMARY KEY,
    total INTEGER DEFAULT NULL,
    pack_type VARCHAR(255) DEFAULT NULL,
    dim_unit VARCHAR(255) DEFAULT NULL,
    inner_quantity INTEGER DEFAULT NULL,
    brutwg INTEGER DEFAULT NULL,
    dimension1 INTEGER DEFAULT NULL,
    dimension2 INTEGER DEFAULT NULL,
    dimension3 INTEGER DEFAULT NULL,
    volume INTEGER DEFAULT NULL,
    booking_package_detail_id BIGINT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table password_resets
-- --------------------------------------------------------

CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table positions
-- --------------------------------------------------------

CREATE TABLE positions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL,
    contract_type VARCHAR(255) DEFAULT NULL,
    extref VARCHAR(255) DEFAULT NULL,
    empty_truck BOOLEAN DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    operator_id BIGINT DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    vessel_code VARCHAR(255) DEFAULT NULL,
    truck_code VARCHAR(255) DEFAULT NULL,
    truck_type VARCHAR(255) DEFAULT NULL,
    driver_name VARCHAR(255) DEFAULT NULL,
    driver_tel VARCHAR(255) DEFAULT NULL,
    supplier_id VARCHAR(255) DEFAULT NULL,
    freight_price DOUBLE PRECISION DEFAULT NULL,
    freight_curr VARCHAR(255) DEFAULT NULL,
    vessel_id BIGINT DEFAULT NULL,
    truck_id BIGINT DEFAULT NULL,
    driver_id BIGINT DEFAULT NULL,
    dep_odemeter DOUBLE PRECISION DEFAULT NULL,
    arv_odemeter DOUBLE PRECISION DEFAULT NULL,
    total_fuel DOUBLE PRECISION DEFAULT NULL,
    driver_payment DOUBLE PRECISION DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    waybill_type VARCHAR(255) DEFAULT NULL,
    waybill_no VARCHAR(255) DEFAULT NULL,
    waybill_date TIMESTAMP NULL DEFAULT NULL,
    project_id BIGINT DEFAULT NULL,
    loading_id BIGINT DEFAULT NULL,
    ref_position_id VARCHAR(255) DEFAULT NULL,
    trans_method VARCHAR(255) DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table posts
-- --------------------------------------------------------

CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    message VARCHAR(255) DEFAULT NULL,
    group_id BIGINT DEFAULT NULL,
    is_private VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table profit_centers
-- --------------------------------------------------------

CREATE TABLE profit_centers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) DEFAULT NULL,
    ledgerable BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(255) DEFAULT 'active',
    account_filter VARCHAR(255) DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table tax_codes
-- --------------------------------------------------------

CREATE TABLE tax_codes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    rate DOUBLE PRECISION NOT NULL,
    rate_percantage NUMERIC(8,2) DEFAULT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table templates
-- --------------------------------------------------------

CREATE TABLE templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    ref_code VARCHAR(255) DEFAULT NULL,
    type VARCHAR(255) DEFAULT NULL,
    is_default BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table template_docs
-- --------------------------------------------------------

CREATE TABLE template_docs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    temp_code VARCHAR(255) DEFAULT NULL,
    invoice_id BIGINT DEFAULT NULL,
    template_id BIGINT NOT NULL,
    doc_data JSONB DEFAULT NULL,
    unique_code VARCHAR(255) DEFAULT NULL,
    html_data JSONB DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table timezones
-- --------------------------------------------------------

CREATE TABLE timezones (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table todos
-- --------------------------------------------------------

CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    todo_text VARCHAR(255) NOT NULL,
    assigned_id BIGINT DEFAULT NULL,
    due_date TIMESTAMP NULL DEFAULT NULL,
    project_id BIGINT DEFAULT NULL,
    img VARCHAR(255) DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table users
-- --------------------------------------------------------

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(13) DEFAULT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL,
    language VARCHAR(255) DEFAULT NULL,
    username VARCHAR(255) DEFAULT NULL,
    office_tel INTEGER DEFAULT NULL,
    timezone_id BIGINT DEFAULT NULL,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    two_factor_secret TEXT,
    two_factor_recovery_codes TEXT,
    remember_token VARCHAR(100) DEFAULT NULL,
    access_level SMALLINT NOT NULL DEFAULT 1,
    is_super BOOLEAN NOT NULL DEFAULT FALSE,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    country_code VARCHAR(254) DEFAULT NULL,
    country_id VARCHAR(100) DEFAULT NULL,
    unique_id VARCHAR(255) NOT NULL UNIQUE,
    company_id BIGINT DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    is_setup_company BOOLEAN NOT NULL DEFAULT FALSE,
    setup_company_process INTEGER NOT NULL DEFAULT 1,
    is_admin INTEGER NOT NULL DEFAULT 0,
    password VARCHAR(255) DEFAULT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- Table structure for table vehicles
-- --------------------------------------------------------

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    vehicle_class VARCHAR(255) NOT NULL,
    brand VARCHAR(255) DEFAULT NULL,
    model VARCHAR(255) DEFAULT NULL,
    model_year VARCHAR(255) DEFAULT NULL,
    vehicle_type VARCHAR(255) DEFAULT NULL,
    covehicle_id BIGINT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    owner_type VARCHAR(255) DEFAULT NULL,
    driver_id BIGINT DEFAULT NULL,
    company_id BIGINT DEFAULT NULL,
    country_id VARCHAR(255) DEFAULT NULL,
    branch_id BIGINT DEFAULT NULL,
    operation_id BIGINT DEFAULT NULL,
    operator_id BIGINT DEFAULT NULL,
    profit_center_id BIGINT DEFAULT NULL,
    slug VARCHAR(255) DEFAULT NULL,
    created_by BIGINT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- --------------------------------------------------------
-- CREATE INDEXES
-- --------------------------------------------------------

-- Bookings indexes
CREATE INDEX idx_bookings_contact_id ON bookings(contact_id);
CREATE INDEX idx_bookings_branch_id ON bookings(branch_id);

-- Booking collection points indexes
CREATE INDEX idx_booking_collection_points_booking_id ON booking_collection_points(booking_id);

-- Booking delivery points indexes
CREATE INDEX idx_booking_delivery_points_booking_id ON booking_delivery_points(booking_id);

-- Booking other details indexes
CREATE INDEX idx_booking_other_details_booking_id ON booking_other_details(booking_id);

-- Booking package details indexes
CREATE INDEX idx_booking_package_details_booking_id ON booking_package_details(booking_id);

-- Branches indexes
CREATE INDEX idx_branches_company_id ON branches(company_id);

-- Companies indexes
CREATE UNIQUE INDEX idx_companies_name ON companies(name);

-- Containers indexes
CREATE INDEX idx_containers_booking_package_detail_id ON containers(booking_package_detail_id);

-- Financials indexes
CREATE INDEX idx_financials_company_financor_id ON financials(company_financor_id);

-- GLDocs indexes
CREATE INDEX idx_gldocs_operation_id ON gldocs(operation_id);
CREATE INDEX idx_gldocs_branch_id ON gldocs(branch_id);
CREATE INDEX idx_gldocs_company_id ON gldocs(company_id);
CREATE INDEX idx_gldocs_created_by ON gldocs(created_by);

-- GLDoc items indexes
CREATE INDEX idx_gldoc_items_gldoc_id ON gldoc_items(gldoc_id);
CREATE INDEX idx_gldoc_items_profit_center_id ON gldoc_items(profit_center_id);

-- Invoices indexes
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_created_by ON invoices(created_by);

-- Invoice items indexes
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Ledger accounts indexes
CREATE INDEX idx_ledger_accounts_branch_id ON ledger_accounts(branch_id);

-- Locations indexes
CREATE INDEX idx_locations_company_id ON locations(company_id);

-- OAuth access tokens indexes
CREATE INDEX idx_oauth_access_tokens_user_id ON oauth_access_tokens(user_id);

-- OAuth auth codes indexes
CREATE INDEX idx_oauth_auth_codes_user_id ON oauth_auth_codes(user_id);

-- OAuth clients indexes
CREATE INDEX idx_oauth_clients_user_id ON oauth_clients(user_id);

-- OAuth refresh tokens indexes
CREATE INDEX idx_oauth_refresh_tokens_access_token_id ON oauth_refresh_tokens(access_token_id);

-- Packages indexes
CREATE INDEX idx_packages_booking_package_detail_id ON packages(booking_package_detail_id);

-- Password resets indexes
CREATE INDEX idx_password_resets_email ON password_resets(email);

-- Template docs indexes
CREATE INDEX idx_template_docs_template_id ON template_docs(template_id);
CREATE INDEX idx_template_docs_created_by ON template_docs(created_by);

-- Users indexes
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_operation_id ON users(operation_id);
CREATE INDEX idx_users_timezone_id ON users(timezone_id);

-- --------------------------------------------------------
-- ADD FOREIGN KEY CONSTRAINTS
-- --------------------------------------------------------

-- Bookings foreign keys
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_contact_id
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_branch_id
    FOREIGN KEY (branch_id) REFERENCES companies(id) ON DELETE CASCADE;

-- Booking collection points foreign keys
ALTER TABLE booking_collection_points ADD CONSTRAINT fk_booking_collection_points_booking_id
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Booking delivery points foreign keys
ALTER TABLE booking_delivery_points ADD CONSTRAINT fk_booking_delivery_points_booking_id
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Booking other details foreign keys
ALTER TABLE booking_other_details ADD CONSTRAINT fk_booking_other_details_booking_id
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Booking package details foreign keys
ALTER TABLE booking_package_details ADD CONSTRAINT fk_booking_package_details_booking_id
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

-- Branches foreign keys
ALTER TABLE branches ADD CONSTRAINT fk_branches_company_id
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Containers foreign keys
ALTER TABLE containers ADD CONSTRAINT fk_containers_booking_package_detail_id
    FOREIGN KEY (booking_package_detail_id) REFERENCES booking_package_details(id) ON DELETE CASCADE;

-- Financials foreign keys
ALTER TABLE financials ADD CONSTRAINT fk_financials_company_financor_id
    FOREIGN KEY (company_financor_id) REFERENCES users(id) ON DELETE CASCADE;

-- GLDocs foreign keys
ALTER TABLE gldocs ADD CONSTRAINT fk_gldocs_operation_id
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE CASCADE;
ALTER TABLE gldocs ADD CONSTRAINT fk_gldocs_branch_id
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;
ALTER TABLE gldocs ADD CONSTRAINT fk_gldocs_company_id
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- GLDoc items foreign keys
ALTER TABLE gldoc_items ADD CONSTRAINT fk_gldoc_items_gldoc_id
    FOREIGN KEY (gldoc_id) REFERENCES gldocs(id) ON DELETE CASCADE;
ALTER TABLE gldoc_items ADD CONSTRAINT fk_gldoc_items_profit_center_id
    FOREIGN KEY (profit_center_id) REFERENCES profit_centers(id) ON DELETE CASCADE;

-- Invoices foreign keys
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_company_id
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Ledger accounts foreign keys
ALTER TABLE ledger_accounts ADD CONSTRAINT fk_ledger_accounts_branch_id
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Locations foreign keys
ALTER TABLE locations ADD CONSTRAINT fk_locations_company_id
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- Packages foreign keys
ALTER TABLE packages ADD CONSTRAINT fk_packages_booking_package_detail_id
    FOREIGN KEY (booking_package_detail_id) REFERENCES booking_package_details(id) ON DELETE CASCADE;

-- Template docs foreign keys
ALTER TABLE template_docs ADD CONSTRAINT fk_template_docs_template_id
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE;
ALTER TABLE template_docs ADD CONSTRAINT fk_template_docs_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- Users foreign keys
ALTER TABLE users ADD CONSTRAINT fk_users_company_id
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE users ADD CONSTRAINT fk_users_branch_id
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;
ALTER TABLE users ADD CONSTRAINT fk_users_operation_id
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE CASCADE;
ALTER TABLE users ADD CONSTRAINT fk_users_timezone_id
    FOREIGN KEY (timezone_id) REFERENCES timezones(id) ON DELETE CASCADE;

-- --------------------------------------------------------
-- INSERT DATA
-- --------------------------------------------------------

-- Insert data for branches
INSERT INTO branches (id, name, manager_id, phone, fax, email, address, country_id, city_id, postcode, account_code, profit_center_code, company_id, created_at, updated_at) VALUES
(1, 'Head Office', NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, 9302305, NULL, NULL),
(2, 'Head Office', NULL, NULL, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, 9302304, NULL, NULL),
(3, 'Head Office', NULL, '0700412127', NULL, 'ben.amani@gmail.com', 'Msa', 'US', 19, NULL, NULL, NULL, 9302309, '2022-05-24 10:07:13', '2022-05-24 10:07:13'),
(4, 'Head Office', NULL, NULL, NULL, 'karanja@gmail.com', 'Kiambu', 'AS', 11, NULL, NULL, NULL, 9302310, '2022-05-24 10:21:57', '2022-05-24 10:21:57'),
(5, 'Head Office', NULL, NULL, NULL, 'juan@gmail.com', 'Nyeri', 'AX', 20, NULL, NULL, NULL, 9302311, '2022-05-24 10:34:24', '2022-05-24 10:34:24'),
(6, 'Head Office', NULL, NULL, NULL, 'hug@gmail.com', 'Kabete', 'AX', 20, NULL, NULL, NULL, 9302312, '2022-05-24 10:45:27', '2022-05-24 10:45:27'),
(9, 'Head Office', NULL, NULL, NULL, 'faithchebet@gmail.com', 'Kajiado', 'AX', 20, NULL, NULL, NULL, 9302315, '2022-05-24 10:56:26', '2022-05-24 10:56:26'),
(10, 'Head Office', NULL, NULL, NULL, 'faithchebet@gmail.com', 'Kajiado', 'AX', 21, NULL, NULL, NULL, 9302316, '2022-05-24 11:07:11', '2022-05-24 11:07:11');

-- Insert data for cities
INSERT INTO cities (id, country_id, name, code, tel_code, states_code, created_by, created_at, updated_at) VALUES
(6, 'KE', 'Mombasa', '001', '000', '000', 1, '2022-05-05 11:21:06', '2022-05-05 11:21:06'),
(8, 'AF', 'Kabul', '001', '000', '000', 1, '2022-05-05 11:23:09', '2022-05-05 11:23:09'),
(9, 'KE', 'Nairobi', '001', '000', '000', 1, '2022-05-05 11:25:53', '2022-05-05 11:25:53'),
(10, 'TR', 'Istanbul', NULL, NULL, NULL, 1, '2022-05-05 11:30:22', '2022-05-05 11:30:22'),
(11, 'AS', 'Kabulc', NULL, NULL, NULL, 1, '2022-05-05 11:42:07', '2022-05-05 11:42:07'),
(12, 'AM', 'Kalis', NULL, NULL, NULL, 1, '2022-05-06 02:21:10', '2022-05-06 02:21:10'),
(13, 'AS', 'Kujios', NULL, NULL, NULL, 1, '2022-05-06 02:22:06', '2022-05-06 02:22:06'),
(14, 'AX', 'Ddd', NULL, NULL, NULL, 1, '2022-05-06 02:25:47', '2022-05-06 02:25:47'),
(15, 'AF', 'Dqs', NULL, NULL, NULL, 1, '2022-05-06 02:26:23', '2022-05-06 02:26:23'),
(16, 'AX', 'Sd', NULL, NULL, NULL, 1, '2022-05-06 02:27:01', '2022-05-06 02:27:01'),
(17, 'AX', 'Ds', NULL, NULL, NULL, 1, '2022-05-06 02:28:00', '2022-05-06 02:28:00'),
(18, 'CA', 'Toronto', NULL, NULL, NULL, 1, '2022-05-09 03:39:33', '2022-05-09 03:39:33'),
(19, 'US', 'Beverly Hills', NULL, NULL, NULL, 1, '2022-05-09 04:46:12', '2022-05-09 04:46:12'),
(20, 'AX', 'Iop', NULL, NULL, NULL, 10, '2022-05-13 07:38:48', '2022-05-13 07:38:48'),
(21, 'AX', 'Ss', NULL, NULL, NULL, 10, '2022-05-15 03:28:43', '2022-05-15 03:28:43');

-- Insert data for currency_lists
INSERT INTO currency_lists (id, code, name, symbol, multiplier, created_at, updated_at) VALUES
(1, 'KES', 'KES', NULL, '1', '2022-03-08 19:02:03', '2022-03-08 19:02:03'),
(2, 'USD', 'USD', '
    , '1', '2022-03-08 19:10:37', '2022-03-08 19:10:37'),
(3, 'GBP', 'GBP', NULL, '1', '2022-03-08 19:25:40', '2022-03-08 19:25:40'),
(4, 'EUR', 'EUR', NULL, '1', '2022-03-08 19:28:36', '2022-03-08 19:28:36');

-- Insert data for finitems
INSERT INTO finitems (id, code, name, item_type, involine_type, name_foreign, status, ext_service_id, integration_names, salable, sales_price, sales_curr, sales_tax_id, sales_controll_rate, sales_notes, purchasable, purchase_price, purchase_curr, purchase_tax_id, purchase_controll_rate, purchase_notes, auto_calc_finitem_id, auto_calc_rate, created_at, updated_at) VALUES
(1, 'DEMURRAGE', 'Demurrage Fee', 'invoice_line', NULL, NULL, 'active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'FREIGHT', 'Freight Charge', 'invoice_line', NULL, NULL, 'active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'HANDLING', 'Handling Fee', 'invoice_line', NULL, NULL, 'active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'STOCK', 'Warehouse Stocking Fee', 'invoice_line', NULL, '', 'active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Insert data for operations
INSERT INTO operations (id, name, department_id, slug, created_at, updated_at) VALUES
(1, 'Road Transports Team', 1, 'road', NULL, NULL),
(2, 'Fleet Management Team', 1, 'fleet', NULL, NULL),
(3, 'Sales Team', 1, 'sales', NULL, NULL);

-- Insert data for profit_centers
INSERT INTO profit_centers (id, code, name, ledgerable, is_default, status, account_filter, notes, created_at, updated_at) VALUES
(1, 'B', 'BALANCE ACCOUNT', FALSE, FALSE, 'active', NULL, NULL, NULL, NULL),
(2, 'O', 'OPERATIONAL COSTS', FALSE, FALSE, 'active', NULL, NULL, NULL, NULL),
(3, 'P', 'STAFF ACCOUNTS	', FALSE, FALSE, 'active', NULL, NULL, NULL, NULL);

-- Insert data for tax_codes
INSERT INTO tax_codes (id, name, code, rate, rate_percantage, status, created_at, updated_at) VALUES
(1, 'VAT5', 'REDUCEDVAT', 5, 5.00, '1', NULL, NULL),
(2, 'VAT20', 'VAT', 20, 20.00, '1', NULL, NULL);

-- Insert data for timezones
INSERT INTO timezones (id, name, code, created_at, updated_at) VALUES
(1, 'International Date Line West', '(GMT-12:00)', NULL, NULL),
(2, 'American Samoa', '(GMT-11:00)', NULL, NULL),
(3, 'Midway Island', '(GMT-11:00)', NULL, NULL),
(4, 'Hawaii', '(GMT-10:00)', NULL, NULL),
(5, 'Alaska', '(GMT-09:00)', NULL, NULL),
(82, 'Nairobi', '(GMT+03:00)', NULL, NULL);

-- Set sequence values to current max values
SELECT setval('branches_id_seq', (SELECT COALESCE(MAX(id), 1) FROM branches));
SELECT setval('cities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM cities));
SELECT setval('currency_lists_id_seq', (SELECT COALESCE(MAX(id), 1) FROM currency_lists));
SELECT setval('finitems_id_seq', (SELECT COALESCE(MAX(id), 1) FROM finitems));
SELECT setval('operations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM operations));
SELECT setval('profit_centers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM profit_centers));
SELECT setval('tax_codes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tax_codes));
SELECT setval('timezones_id_seq', (SELECT COALESCE(MAX(id), 1) FROM timezones));
