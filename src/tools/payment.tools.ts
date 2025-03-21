/**
 * Payment tools for PayPal MCP Server
 * 
 * Implements payment-related tools for the MCP server.
 */

import { PayPalAuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';

/**
 * Tool definition interface
 */
interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: (args: any, authService: PayPalAuthService) => Promise<any>;
}

/**
 * Create Payment Token Tool
 * 
 * Creates a payment token that can be used for future payments.
 */
const createPaymentToken: Tool = {
  name: 'create_payment_token',
  description: 'Create a payment token for future use',
  inputSchema: {
    type: 'object',
    properties: {
      customer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email_address: { type: 'string', format: 'email' },
        },
      },
      payment_source: {
        type: 'object',
        properties: {
          card: {
            type: 'object',
            properties: {
              number: { type: 'string' },
              expiry: { type: 'string' },
              name: { type: 'string' },
              security_code: { type: 'string' },
            },
            required: ['number', 'expiry', 'name', 'security_code'],
          },
        },
        required: ['card'],
      },
    },
    required: ['customer', 'payment_source'],
  },
  handler: async (args, authService) => {
    logger.info('Creating payment token');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v1/vault/payment-tokens', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create payment token:', error);
      throw new Error('Failed to create payment token');
    }
  },
};

/**
 * Create Order Tool
 * 
 * Creates a new order in PayPal.
 */
const createOrder: Tool = {
  name: 'create_order',
  description: 'Create a new order in PayPal',
  inputSchema: {
    type: 'object',
    properties: {
      intent: { type: 'string', enum: ['CAPTURE', 'AUTHORIZE'] },
      purchase_units: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            amount: {
              type: 'object',
              properties: {
                currency_code: { type: 'string' },
                value: { type: 'string' },
              },
              required: ['currency_code', 'value'],
            },
          },
          required: ['amount'],
        },
      },
    },
    required: ['intent', 'purchase_units'],
  },
  handler: async (args, authService) => {
    logger.info('Creating order');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v2/checkout/orders', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create order:', error);
      throw new Error('Failed to create order');
    }
  },
};

/**
 * Capture Order Tool
 * 
 * Captures payment for an authorized order.
 */
const captureOrder: Tool = {
  name: 'capture_order',
  description: 'Capture payment for an authorized order',
  inputSchema: {
    type: 'object',
    properties: {
      order_id: { type: 'string' },
      payment_source: { type: 'object' },
    },
    required: ['order_id'],
  },
  handler: async (args, authService) => {
    logger.info(`Capturing order: ${args.order_id}`);
    
    const axios = authService.getAxiosInstance();
    const { order_id, ...payload } = args;
    
    try {
      const response = await axios.post(`/v2/checkout/orders/${order_id}/capture`, payload);
      return response.data;
    } catch (error) {
      logger.error(`Failed to capture order ${order_id}:`, error);
      throw new Error(`Failed to capture order ${order_id}`);
    }
  },
};

/**
 * Create Payment Tool
 * 
 * Creates a direct payment using the PayPal API.
 */
const createPayment: Tool = {
  name: 'create_payment',
  description: 'Create a direct payment',
  inputSchema: {
    type: 'object',
    properties: {
      intent: { type: 'string', enum: ['sale', 'authorize', 'order'] },
      payer: {
        type: 'object',
        properties: {
          payment_method: { type: 'string' },
        },
        required: ['payment_method'],
      },
      transactions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            amount: {
              type: 'object',
              properties: {
                total: { type: 'string' },
                currency: { type: 'string' },
              },
              required: ['total', 'currency'],
            },
          },
          required: ['amount'],
        },
      },
      redirect_urls: {
        type: 'object',
        properties: {
          return_url: { type: 'string', format: 'uri' },
          cancel_url: { type: 'string', format: 'uri' },
        },
        required: ['return_url', 'cancel_url'],
      },
    },
    required: ['intent', 'payer', 'transactions', 'redirect_urls'],
  },
  handler: async (args, authService) => {
    logger.info('Creating payment');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v1/payments/payment', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create payment:', error);
      throw new Error('Failed to create payment');
    }
  },
};

/**
 * Create Subscription Tool
 * 
 * Creates a subscription for recurring billing.
 */
const createSubscription: Tool = {
  name: 'create_subscription',
  description: 'Create a subscription for recurring billing',
  inputSchema: {
    type: 'object',
    properties: {
      plan_id: { type: 'string' },
      subscriber: {
        type: 'object',
        properties: {
          name: {
            type: 'object',
            properties: {
              given_name: { type: 'string' },
              surname: { type: 'string' },
            },
            required: ['given_name'],
          },
          email_address: { type: 'string', format: 'email' },
        },
        required: ['name', 'email_address'],
      },
    },
    required: ['plan_id', 'subscriber'],
  },
  handler: async (args, authService) => {
    logger.info('Creating subscription');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v1/billing/subscriptions', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      throw new Error('Failed to create subscription');
    }
  },
};

/**
 * Export all payment tools
 */
export const paymentTools: Tool[] = [
  createPaymentToken,
  createOrder,
  captureOrder,
  createPayment,
  createSubscription,
];
