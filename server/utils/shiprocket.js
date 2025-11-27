const axios = require('axios');

// Shiprocket API configuration
const SHIPROCKET_CONFIG = {
  baseURL: 'https://apiv2.shiprocket.in/v1',
  email: 'anishyaadv8461@gmail.com',
  password: 'kV42ddiNl&mGG9YC'
};

let authToken = null;
let tokenExpiry = null;

// Get authentication token
const getAuthToken = async () => {
  try {
    // Check if we have a valid token
    if (authToken && tokenExpiry && new Date() < tokenExpiry) {
      return authToken;
    }

    const response = await axios.post(`${SHIPROCKET_CONFIG.baseURL}/external/auth/login`, {
      email: SHIPROCKET_CONFIG.email,
      password: SHIPROCKET_CONFIG.password
    }, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mateshwari Moorti Bhandar/1.0'
      }
    });


    if (response.data && response.data.token) {
      authToken = response.data.token;
      // Set token expiry to 24 hours from now
      tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      return authToken;
    } else {
      throw new Error('Failed to get authentication token from Shiprocket');
    }
  } catch (error) {
    console.error('Shiprocket authentication error:', error.response?.data || error.message);
    console.error('Full error:', error);
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

// Create order in Shiprocket
const createShiprocketOrder = async (orderData) => {
  try {
    const token = await getAuthToken();
    
    // Helper function to format address for Shiprocket
    const formatAddressForShiprocket = (address) => {
      // Determine state from pincode if not provided
      let state = address.state;
      if (!state && address.postalCode) {
        // Simple state mapping based on pincode ranges
        const pincode = parseInt(address.postalCode);
        if (pincode >= 302000 && pincode <= 303999) {
          state = 'Rajasthan';
        } else if (pincode >= 110000 && pincode <= 110999) {
          state = 'Delhi';
        } else if (pincode >= 400000 && pincode <= 400999) {
          state = 'Maharashtra';
        } else {
          state = 'Rajasthan';
        }
      }
      
             return {
         name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
         address: address.address || '',
         landmark: address.apartment || '',
         city: address.city || '',
         pincode: address.postalCode || '',
         state: state || '', // Default state if not provided
         email: '', // Will be set later with actual customer email
         phone: address.phone || ''
       };
    };

    const billingAddress = formatAddressForShiprocket(orderData.billing_address);
    const shippingAddress = formatAddressForShiprocket(orderData.shipping_address);
    
    // Use customer's actual email
    const customerEmail = orderData.customer_email;
    if (!customerEmail) {
      throw new Error('Customer email is required for Shiprocket order');
    }
    billingAddress.email = customerEmail;
    shippingAddress.email = customerEmail;

    const shiprocketOrder = {
      order_id: orderData.order_number,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Mateshwari Moorti Bhandar",
      billing_customer_name: billingAddress.name,
      billing_last_name: "",
      billing_address: billingAddress.address,
      billing_address_2: billingAddress.landmark,
      billing_city: billingAddress.city,
      billing_pincode: billingAddress.pincode,
      billing_state: billingAddress.state,
      billing_country: "India",
      billing_email: billingAddress.email,
      billing_phone: billingAddress.phone,
      shipping_is_billing: false,
      shipping_customer_name: shippingAddress.name,
      shipping_last_name: "",
      shipping_address: shippingAddress.address,
      shipping_address_2: shippingAddress.landmark,
      shipping_city: shippingAddress.city,
      shipping_pincode: shippingAddress.pincode,
      shipping_country: "India",
      shipping_state: shippingAddress.state,
      shipping_email: shippingAddress.email,
      shipping_phone: shippingAddress.phone,
      order_items: orderData.items.map(item => ({
        name: item.product_name,
        sku: `SKU-${item.product_id}`,
        units: item.quantity,
        selling_price: item.total_price / item.quantity,
        discount: 0,
        tax: 0,
        hsn: 0
      })),
             payment_method: orderData.payment_method === 'COD' ? 'COD' : 'Prepaid',
       shipping_charges: 0,
       giftwrap_charges: 0,
       transaction_charges: orderData.cod_charges || 0, // Add COD charges as transaction charges
       total_discount: orderData.discount || 0,
       sub_total: orderData.subtotal,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
      // Additional required fields
      cod: orderData.payment_method === 'COD' ? 1 : 0,
      pickup_location_id: 9584888,
      delivery_is_billing: false
    };

    // Debug: Log the final Shiprocket order data
    const response = await axios.post(
      `${SHIPROCKET_CONFIG.baseURL}/external/orders/create/adhoc`,
      shiprocketOrder,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 second timeout
      }
    );


    if (response.data && response.data.shipment_id) {
      return {
        success: true,
        shipment_id: response.data.shipment_id,
        awb_code: response.data.awb_code,
        courier_company_id: response.data.courier_company_id,
        courier_name: response.data.courier_name
      };
    } else {
      console.error('❌ Shiprocket order creation failed - no shipment_id in response');
      throw new Error(`Failed to create order in Shiprocket: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Shiprocket order creation error:', error.response?.data || error.message);
    throw new Error('Failed to create order in Shiprocket');
  }
};

// Track order in Shiprocket
const trackShiprocketOrder = async (shipmentId) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.get(
      `${SHIPROCKET_CONFIG.baseURL}/external/courier/track/shipment/${shipmentId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.data) {
      return {
        success: true,
        tracking_data: response.data.data
      };
    } else {
      throw new Error('Failed to get tracking information from Shiprocket');
    }
  } catch (error) {
    console.error('Shiprocket tracking error:', error.response?.data || error.message);
    throw new Error('Failed to get tracking information from Shiprocket');
  }
};

// Get courier serviceability
const checkCourierServiceability = async (pickupPincode, deliveryPincode, weight = 0.5) => {
  try {
    const token = await getAuthToken();
    
    const response = await axios.get(
      `${SHIPROCKET_CONFIG.baseURL}/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.data) {
      return {
        success: true,
        available_couriers: response.data.data.available_courier_companies
      };
    } else {
      throw new Error('Failed to check courier serviceability');
    }
  } catch (error) {
    console.error('Shiprocket serviceability check error:', error.response?.data || error.message);
    throw new Error('Failed to check courier serviceability');
  }
};

// Test function to check Shiprocket connectivity
const testShiprocketConnection = async () => {
  try {
    const response = await axios.get('https://apiv2.shiprocket.in/v1/external/auth/login', {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mateshwari Moorti Bhandar/1.0'
      }
    });
    return true;
  } catch (error) {
    console.error('Shiprocket connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  createShiprocketOrder,
  trackShiprocketOrder,
  checkCourierServiceability,
  getAuthToken,
  testShiprocketConnection
};
