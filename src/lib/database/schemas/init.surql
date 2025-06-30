-- Business Setup Schema for Delivery SaaS
-- This schema defines the data structure for business profiles and related entities

-- ============================================================================
-- AUTH TABLES (from init.surql)
-- ============================================================================

-- User table (for authentication)
DEFINE TABLE user SCHEMAFULL
    PERMISSIONS
        FOR select
            WHERE id = $auth.id 
            OR $auth.id IN (SELECT ownerId FROM business WHERE id IN (SELECT businessId FROM employees WHERE userId = id))
        FOR update
            WHERE id = $auth.id 
            OR $auth.id IN (SELECT ownerId FROM business WHERE id IN (SELECT businessId FROM employees WHERE userId = id));

DEFINE FIELD email ON user TYPE string ASSERT string::is::email($value);
DEFINE FIELD password ON user TYPE option<string>;
DEFINE FIELD name ON user TYPE string;
DEFINE FIELD image ON user TYPE option<string>;
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD last_login ON user TYPE datetime DEFAULT time::now();
DEFINE INDEX email_idx ON user COLUMNS email UNIQUE;

-- Session table
DEFINE TABLE session SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
            WHERE userId = $auth.id;

DEFINE FIELD userId ON session TYPE record<user>;
DEFINE FIELD expires ON session TYPE datetime;
DEFINE FIELD sessionToken ON session TYPE string;
DEFINE INDEX session_token_idx ON session COLUMNS sessionToken UNIQUE;

-- Account table
DEFINE TABLE account SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
            WHERE userId = $auth.id;

DEFINE FIELD userId ON account TYPE record<user>;
DEFINE FIELD type ON account TYPE string;
DEFINE FIELD provider ON account TYPE string;
DEFINE FIELD providerAccountId ON account TYPE string;
DEFINE FIELD refresh_token ON account TYPE option<string>;
DEFINE FIELD access_token ON account TYPE string;
DEFINE FIELD expires_at ON account TYPE int;
DEFINE FIELD token_type ON account TYPE string;
DEFINE FIELD scope ON account TYPE string;
DEFINE FIELD id_token ON account TYPE string;
DEFINE FIELD session_state ON account TYPE option<string>;
DEFINE INDEX provider_account_idx ON account COLUMNS provider, providerAccountId UNIQUE;

-- VerificationToken table
DEFINE TABLE verification_token SCHEMAFULL
    PERMISSIONS
        FOR select, create, update, delete
            WHERE true;

DEFINE FIELD identifier ON verification_token TYPE string;
DEFINE FIELD token ON verification_token TYPE string;
DEFINE FIELD expires ON verification_token TYPE datetime;
DEFINE INDEX verification_token_idx ON verification_token COLUMNS token UNIQUE;
DEFINE INDEX verification_identifier_token_idx ON verification_token COLUMNS identifier, token UNIQUE;

-- ============================================================================
-- BUSINESS TABLE
-- ============================================================================
DEFINE TABLE business SCHEMAFULL
    PERMISSIONS
        FOR select
            WHERE ownerId = $auth.id
            OR $auth.id IN (SELECT userId FROM employees WHERE businessId = id)
        FOR create, update, delete
            WHERE ownerId = $auth.id;

-- TODO: Users need to have name, phone, address, etc.
-- Business basic information
DEFINE FIELD name ON business TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD description ON business TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD website ON business TYPE option<string>;
DEFINE FIELD phone ON business TYPE option<string>;

-- Business address
DEFINE FIELD address ON business TYPE object ASSERT $value != NONE;
DEFINE FIELD address.street ON business TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD address.city ON business TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD address.stateProvince ON business TYPE string;
DEFINE FIELD address.zipPostalCode ON business TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD address.country ON business TYPE string ASSERT $value != NONE AND $value != "";

-- Delivery settings
DEFINE FIELD delivery ON business TYPE object ASSERT $value != NONE;
DEFINE FIELD delivery.radius ON business TYPE int ASSERT $value >= 1 AND $value <= 100;
DEFINE FIELD delivery.radiusUnit ON business TYPE string ASSERT $value INSIDE ["miles", "kilometers"];
DEFINE FIELD delivery.specialRequirements ON business TYPE option<string>;

-- Operating hours (stored as JSON object)
DEFINE FIELD operatingHours ON business TYPE object ASSERT $value != NONE;
DEFINE FIELD operatingHours.monday ON business TYPE object;
DEFINE FIELD operatingHours.monday.open ON business TYPE string;
DEFINE FIELD operatingHours.monday.close ON business TYPE string;
DEFINE FIELD operatingHours.monday.enabled ON business TYPE bool;
DEFINE FIELD operatingHours.tuesday ON business TYPE object;
DEFINE FIELD operatingHours.tuesday.open ON business TYPE string;
DEFINE FIELD operatingHours.tuesday.close ON business TYPE string;
DEFINE FIELD operatingHours.tuesday.enabled ON business TYPE bool;
DEFINE FIELD operatingHours.wednesday ON business TYPE object;
DEFINE FIELD operatingHours.wednesday.open ON business TYPE string;
DEFINE FIELD operatingHours.wednesday.close ON business TYPE string;
DEFINE FIELD operatingHours.wednesday.enabled ON business TYPE bool;
DEFINE FIELD operatingHours.thursday ON business TYPE object;
DEFINE FIELD operatingHours.thursday.open ON business TYPE string;
DEFINE FIELD operatingHours.thursday.close ON business TYPE string;
DEFINE FIELD operatingHours.thursday.enabled ON business TYPE bool;
DEFINE FIELD operatingHours.friday ON business TYPE object;
DEFINE FIELD operatingHours.friday.open ON business TYPE string;
DEFINE FIELD operatingHours.friday.close ON business TYPE string;
DEFINE FIELD operatingHours.friday.enabled ON business TYPE bool;
DEFINE FIELD operatingHours.saturday ON business TYPE object;
DEFINE FIELD operatingHours.saturday.open ON business TYPE string;
DEFINE FIELD operatingHours.saturday.close ON business TYPE string;
DEFINE FIELD operatingHours.saturday.enabled ON business TYPE bool;
DEFINE FIELD operatingHours.sunday ON business TYPE object;
DEFINE FIELD operatingHours.sunday.open ON business TYPE string;
DEFINE FIELD operatingHours.sunday.close ON business TYPE string;
DEFINE FIELD operatingHours.sunday.enabled ON business TYPE bool;

-- Relationships and metadata
DEFINE FIELD ownerId ON business TYPE record<user> ASSERT $value != NONE;
DEFINE FIELD createdAt ON business TYPE datetime DEFAULT time::now();
DEFINE FIELD updatedAt ON business TYPE datetime DEFAULT time::now();

-- Indexes for performance
DEFINE INDEX name ON business COLUMNS name;
DEFINE INDEX country ON business COLUMNS address.country;
DEFINE INDEX ownerId ON business COLUMNS ownerId;

-- ============================================================================
-- EMPLOYEE TABLE
-- ============================================================================
DEFINE TABLE employees SCHEMAFULL
    PERMISSIONS
        FOR select
            WHERE userId = $auth.id 
            OR $auth.id IN (SELECT ownerId FROM business WHERE id = businessId)
        FOR create, update, delete
            WHERE $auth.id IN (SELECT ownerId FROM business WHERE id = businessId);

-- Business-specific employee fields
DEFINE FIELD role ON employees TYPE string ASSERT $value INSIDE ["owner", "dispatcher", "employee"];
DEFINE FIELD status ON employees TYPE string ASSERT $value INSIDE ["active", "inactive", "suspended"];

-- Relationships
DEFINE FIELD userId ON employees TYPE record<user> ASSERT $value != NONE;
DEFINE FIELD businessId ON employees TYPE record<business> ASSERT $value != NONE;

-- Timestamps
DEFINE FIELD createdAt ON employees TYPE datetime DEFAULT time::now();
DEFINE FIELD updatedAt ON employees TYPE datetime DEFAULT time::now();

-- Indexes
DEFINE INDEX businessId ON employees COLUMNS businessId;
DEFINE INDEX userId ON employees COLUMNS userId;
DEFINE INDEX role ON employees COLUMNS role;
DEFINE INDEX status ON employees COLUMNS status;

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
DEFINE TABLE orders SCHEMAFULL
    PERMISSIONS
        FOR select
            WHERE businessId IN (SELECT businessId FROM employees WHERE userId = $auth.id)
            OR $auth.id IN (SELECT ownerId FROM business WHERE id = businessId)
        FOR create, update, delete
            WHERE businessId IN (SELECT businessId FROM employees WHERE userId = $auth.id)
            OR $auth.id IN (SELECT ownerId FROM business WHERE id = businessId);

-- Order basic information
DEFINE FIELD orderNumber ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD status ON orders TYPE string ASSERT $value INSIDE ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"];
DEFINE FIELD totalAmount ON orders TYPE decimal ASSERT $value >= 0;

-- Customer information
DEFINE FIELD customerName ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD customerPhone ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD customerEmail ON orders TYPE option<string>;

-- Delivery information
DEFINE FIELD deliveryAddress ON orders TYPE object ASSERT $value != NONE;
DEFINE FIELD deliveryAddress.street ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD deliveryAddress.city ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD deliveryAddress.stateProvince ON orders TYPE string;
DEFINE FIELD deliveryAddress.zipPostalCode ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD deliveryAddress.country ON orders TYPE string ASSERT $value != NONE AND $value != "";
DEFINE FIELD deliveryAddress.instructions ON orders TYPE option<string>;

-- Order details
DEFINE FIELD orderDetails ON orders TYPE string ASSERT $value != NONE;
DEFINE FIELD specialInstructions ON orders TYPE option<string>;
DEFINE FIELD estimatedDeliveryTime ON orders TYPE option<datetime>;

-- Relationships
DEFINE FIELD businessId ON orders TYPE record<business> ASSERT $value != NONE;
DEFINE FIELD assignedDriverId ON orders TYPE option<record<user>>;

-- Timestamps
DEFINE FIELD createdAt ON orders TYPE datetime DEFAULT time::now();
DEFINE FIELD updatedAt ON orders TYPE datetime DEFAULT time::now();
DEFINE FIELD confirmedAt ON orders TYPE option<datetime>;
DEFINE FIELD deliveredAt ON orders TYPE option<datetime>;

-- Indexes
DEFINE INDEX businessId ON orders COLUMNS businessId;
DEFINE INDEX orderNumber ON orders COLUMNS orderNumber;
DEFINE INDEX status ON orders COLUMNS status;
DEFINE INDEX customerPhone ON orders COLUMNS customerPhone;
DEFINE INDEX createdAt ON orders COLUMNS createdAt;
DEFINE INDEX assignedDriverId ON orders COLUMNS assignedDriverId;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update business timestamp
DEFINE FUNCTION fn::update_business_timestamp($business_id: record<business>) {
    UPDATE $business_id SET updatedAt = time::now();
};

-- Function to get business with full address
DEFINE FUNCTION fn::get_business_with_address($business_id: record<business>) {
    SELECT *,
        address.street + ', ' + address.city + ', ' + address.stateProvince + ' ' + address.zipPostalCode + ', ' + address.country AS fullAddress
    FROM $business_id;
};

-- Function to check if business is currently open
DEFINE FUNCTION fn::is_business_open($business_id: record<business>) {
    LET $current_time = time::now();
    LET $current_day = time::wday($current_time);
    LET $current_hour = time::hour($current_time);
    LET $current_minute = time::minute($current_time);
    LET $current_time_str = string::concat($current_hour, ':', $current_minute);
    
    SELECT 
        *,
        $current_day AS currentDay,
        $current_time_str AS currentTime,
        operatingHours[$current_day].enabled AS isEnabled,
        operatingHours[$current_day].open AS openTime,
        operatingHours[$current_day].close AS closeTime,
        $current_time_str >= operatingHours[$current_day].open AND $current_time_str <= operatingHours[$current_day].close AS isWithinHours
    FROM $business_id
    WHERE operatingHours[$current_day].enabled = true 
    AND $current_time_str >= operatingHours[$current_day].open 
    AND $current_time_str <= operatingHours[$current_day].close;
}; 