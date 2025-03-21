/**
 * Business schemas for PayPal MCP Server
 * 
 * Defines Zod validation schemas for business-related operations.
 */

import { z } from 'zod';

/**
 * Common schemas used across multiple business operations
 */
const amountSchema = z.object({
  currency_code: z.string().min(3).max(3),
  value: z.string().regex(/^\d+\.?\d*$/),
});

const addressSchema = z.object({
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  admin_area_1: z.string().optional(),
  admin_area_2: z.string().optional(),
  postal_code: z.string().optional(),
  country_code: z.string().min(2).max(2),
});

const phoneSchema = z.object({
  country_code: z.string().optional(),
  national_number: z.string(),
  extension_number: z.string().optional(),
  phone_type: z.enum(['FAX', 'HOME', 'MOBILE', 'OTHER', 'PAGER']).optional(),
});

/**
 * Create Product Schema
 */
const createProductSchema = z.object({
  name: z.string().min(1).max(127),
  description: z.string().max(256).optional(),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'SERVICE']),
  category: z.enum([
    'ACCOMMODATION', 'ACCESSORIES', 'APPAREL', 'ART', 'AUTOMOTIVE', 'BABY', 'BOOKS', 'COLLECTIBLES',
    'COMPUTER', 'CRAFTS', 'ELECTRONICS', 'ENTERTAINMENT', 'FITNESS', 'FOOD', 'FURNITURE', 'GIFT_CARDS',
    'HEALTH', 'HOME', 'JEWELRY', 'MERCHANDISE', 'MUSIC', 'OFFICE', 'OTHER', 'PETS', 'PHOTOGRAPHY',
    'SERVICES', 'SOFTWARE', 'SPORTS', 'TICKETS', 'TOYS', 'TRAVEL', 'VIDEO_GAMES'
  ]).optional(),
  image_url: z.string().url().optional(),
  home_url: z.string().url().optional(),
});

/**
 * Create Invoice Schema
 */
const createInvoiceSchema = z.object({
  detail: z.object({
    invoice_number: z.string().max(25).optional(),
    reference: z.string().max(60).optional(),
    invoice_date: z.string().datetime().optional(),
    currency_code: z.string().min(3).max(3),
    note: z.string().max(4000).optional(),
    term: z.string().max(4000).optional(),
    memo: z.string().max(4000).optional(),
    payment_term: z.object({
      term_type: z.enum(['DUE_ON_RECEIPT', 'DUE_ON_DATE_SPECIFIED', 'NET_10', 'NET_15', 'NET_30', 'NET_45', 'NET_60', 'NET_90']),
      due_date: z.string().datetime().optional(),
    }).optional(),
  }),
  invoicer: z.object({
    name: z.object({
      given_name: z.string().max(140).optional(),
      surname: z.string().max(140).optional(),
    }).optional(),
    address: addressSchema.optional(),
    email_address: z.string().email().max(260).optional(),
    phones: z.array(phoneSchema).optional(),
    website: z.string().url().max(2048).optional(),
    tax_id: z.string().max(100).optional(),
    logo_url: z.string().url().max(2048).optional(),
  }).optional(),
  primary_recipients: z.array(
    z.object({
      billing_info: z.object({
        name: z.object({
          given_name: z.string().max(140).optional(),
          surname: z.string().max(140).optional(),
        }).optional(),
        address: addressSchema.optional(),
        email_address: z.string().email().max(260).optional(),
        phones: z.array(phoneSchema).optional(),
      }).optional(),
      shipping_info: z.object({
        name: z.object({
          given_name: z.string().max(140).optional(),
          surname: z.string().max(140).optional(),
        }).optional(),
        address: addressSchema.optional(),
      }).optional(),
    })
  ).optional(),
  items: z.array(
    z.object({
      name: z.string().max(200),
      description: z.string().max(1000).optional(),
      quantity: z.number().positive(),
      unit_amount: amountSchema,
      tax: amountSchema.optional(),
      discount: amountSchema.optional(),
      unit_of_measure: z.string().max(20).optional(),
    })
  ).optional(),
  configuration: z.object({
    partial_payment: z.object({
      allow_partial_payment: z.boolean(),
      minimum_amount_due: amountSchema.optional(),
    }).optional(),
    allow_tip: z.boolean().optional(),
    tax_calculated_after_discount: z.boolean().optional(),
    tax_inclusive: z.boolean().optional(),
  }).optional(),
  amount: z.object({
    breakdown: z.object({
      custom: z.object({
        label: z.string().max(25),
        amount: amountSchema,
      }).optional(),
      shipping: amountSchema.optional(),
      discount: amountSchema.optional(),
    }).optional(),
  }).optional(),
});

/**
 * Create Payout Schema
 */
const createPayoutSchema = z.object({
  sender_batch_header: z.object({
    sender_batch_id: z.string().max(50),
    email_subject: z.string().max(255).optional(),
    email_message: z.string().max(1000).optional(),
    recipient_type: z.enum(['EMAIL', 'PHONE', 'PAYPAL_ID']).optional(),
  }),
  items: z.array(
    z.object({
      recipient_type: z.enum(['EMAIL', 'PHONE', 'PAYPAL_ID']).optional(),
      amount: amountSchema,
      note: z.string().max(1000).optional(),
      receiver: z.string().max(127),
      sender_item_id: z.string().max(50).optional(),
    })
  ),
});

/**
 * Export all business schemas
 */
export const businessSchemas = {
  createProductSchema,
  createInvoiceSchema,
  createPayoutSchema,
};
