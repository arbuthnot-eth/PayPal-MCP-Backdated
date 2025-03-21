/**
 * Business tools for PayPal MCP Server
 * 
 * Implements business-related tools for the MCP server.
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
 * Create Product Tool
 * 
 * Creates a new product in the PayPal catalog.
 */
const createProduct: Tool = {
  name: 'create_product',
  description: 'Create a new product in the catalog',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      type: { type: 'string', enum: ['PHYSICAL', 'DIGITAL', 'SERVICE'] },
      category: { type: 'string' },
      image_url: { type: 'string', format: 'uri' },
      home_url: { type: 'string', format: 'uri' },
    },
    required: ['name', 'type'],
  },
  handler: async (args, authService) => {
    logger.info('Creating product');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v1/catalogs/products', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create product:', error);
      throw new Error('Failed to create product');
    }
  },
};

/**
 * Create Invoice Tool
 * 
 * Generates a new invoice in PayPal.
 */
const createInvoice: Tool = {
  name: 'create_invoice',
  description: 'Generate a new invoice',
  inputSchema: {
    type: 'object',
    properties: {
      detail: {
        type: 'object',
        properties: {
          invoice_number: { type: 'string' },
          reference: { type: 'string' },
          invoice_date: { type: 'string', format: 'date-time' },
          currency_code: { type: 'string' },
          note: { type: 'string' },
          term: { type: 'string' },
          memo: { type: 'string' },
        },
        required: ['currency_code'],
      },
      invoicer: { type: 'object' },
      primary_recipients: { type: 'array' },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            quantity: { type: 'number' },
            unit_amount: {
              type: 'object',
              properties: {
                currency_code: { type: 'string' },
                value: { type: 'string' },
              },
              required: ['currency_code', 'value'],
            },
          },
          required: ['name', 'quantity', 'unit_amount'],
        },
      },
    },
    required: ['detail'],
  },
  handler: async (args, authService) => {
    logger.info('Creating invoice');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v2/invoicing/invoices', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create invoice:', error);
      throw new Error('Failed to create invoice');
    }
  },
};

/**
 * Create Payout Tool
 * 
 * Process a batch payout to multiple recipients.
 */
const createPayout: Tool = {
  name: 'create_payout',
  description: 'Process a batch payout',
  inputSchema: {
    type: 'object',
    properties: {
      sender_batch_header: {
        type: 'object',
        properties: {
          sender_batch_id: { type: 'string' },
          email_subject: { type: 'string' },
          email_message: { type: 'string' },
        },
        required: ['sender_batch_id'],
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            recipient_type: { type: 'string' },
            amount: {
              type: 'object',
              properties: {
                value: { type: 'string' },
                currency: { type: 'string' },
              },
              required: ['value', 'currency'],
            },
            note: { type: 'string' },
            receiver: { type: 'string' },
            sender_item_id: { type: 'string' },
          },
          required: ['amount', 'receiver'],
        },
      },
    },
    required: ['sender_batch_header', 'items'],
  },
  handler: async (args, authService) => {
    logger.info('Creating payout');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v1/payments/payouts', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create payout:', error);
      throw new Error('Failed to create payout');
    }
  },
};

/**
 * Get Product Tool
 * 
 * Retrieves a product from the PayPal catalog.
 */
const getProduct: Tool = {
  name: 'get_product',
  description: 'Get a product from the catalog',
  inputSchema: {
    type: 'object',
    properties: {
      product_id: { type: 'string' },
    },
    required: ['product_id'],
  },
  handler: async (args, authService) => {
    logger.info(`Getting product: ${args.product_id}`);
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.get(`/v1/catalogs/products/${args.product_id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get product ${args.product_id}:`, error);
      throw new Error(`Failed to get product ${args.product_id}`);
    }
  },
};

/**
 * Get Invoice Tool
 * 
 * Retrieves an invoice from PayPal.
 */
const getInvoice: Tool = {
  name: 'get_invoice',
  description: 'Get an invoice',
  inputSchema: {
    type: 'object',
    properties: {
      invoice_id: { type: 'string' },
    },
    required: ['invoice_id'],
  },
  handler: async (args, authService) => {
    logger.info(`Getting invoice: ${args.invoice_id}`);
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.get(`/v2/invoicing/invoices/${args.invoice_id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get invoice ${args.invoice_id}:`, error);
      throw new Error(`Failed to get invoice ${args.invoice_id}`);
    }
  },
};

/**
 * Export all business tools
 */
export const businessTools: Tool[] = [
  createProduct,
  createInvoice,
  createPayout,
  getProduct,
  getInvoice,
];
