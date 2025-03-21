/**
 * Payment schemas for PayPal MCP Server
 * 
 * Defines Zod validation schemas for payment-related operations.
 */

import { z } from 'zod';

/**
 * Common schemas used across multiple payment operations
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

const nameSchema = z.object({
  given_name: z.string(),
  surname: z.string().optional(),
});

const payerSchema = z.object({
  name: nameSchema.optional(),
  email_address: z.string().email().optional(),
  payer_id: z.string().optional(),
  address: addressSchema.optional(),
});

const applicationContextSchema = z.object({
  brand_name: z.string().optional(),
  locale: z.string().optional(),
  landing_page: z.enum(['LOGIN', 'BILLING', 'NO_PREFERENCE']).optional(),
  shipping_preference: z.enum(['GET_FROM_FILE', 'NO_SHIPPING', 'SET_PROVIDED_ADDRESS']).optional(),
  user_action: z.enum(['CONTINUE', 'PAY_NOW']).optional(),
  return_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
});

/**
 * Create Payment Token Schema
 */
const createPaymentTokenSchema = z.object({
  customer: z.object({
    id: z.string().optional(),
    email_address: z.string().email().optional(),
    phone: z.object({
      phone_number: z.string(),
      phone_type: z.enum(['HOME', 'WORK', 'MOBILE', 'OTHER']),
    }).optional(),
  }),
  payment_source: z.object({
    card: z.object({
      number: z.string().regex(/^\d{13,19}$/),
      expiry: z.string().regex(/^\d{4}$/),
      name: z.string(),
      security_code: z.string().regex(/^\d{3,4}$/),
      billing_address: addressSchema.optional(),
    }),
  }),
});

/**
 * Create Order Schema
 */
const createOrderSchema = z.object({
  intent: z.enum(['CAPTURE', 'AUTHORIZE']),
  purchase_units: z.array(
    z.object({
      reference_id: z.string().optional(),
      description: z.string().optional(),
      custom_id: z.string().optional(),
      invoice_id: z.string().optional(),
      amount: amountSchema,
      payee: z.object({
        email_address: z.string().email().optional(),
        merchant_id: z.string().optional(),
      }).optional(),
      shipping: z.object({
        name: nameSchema,
        address: addressSchema,
      }).optional(),
    })
  ).min(1),
  payer: payerSchema.optional(),
  application_context: applicationContextSchema.optional(),
});

/**
 * Capture Order Schema
 */
const captureOrderSchema = z.object({
  order_id: z.string(),
  payment_source: z.object({
    token: z.object({
      id: z.string(),
      type: z.string(),
    }),
  }).optional(),
});

/**
 * Create Payment Schema
 */
const createPaymentSchema = z.object({
  intent: z.enum(['sale', 'authorize', 'order']),
  payer: z.object({
    payment_method: z.enum(['paypal', 'credit_card']),
    funding_instruments: z.array(
      z.object({
        credit_card: z.object({
          number: z.string().regex(/^\d{13,19}$/),
          type: z.string(),
          expire_month: z.number().min(1).max(12),
          expire_year: z.number().min(2000),
          cvv2: z.string().regex(/^\d{3,4}$/),
          first_name: z.string(),
          last_name: z.string(),
          billing_address: addressSchema.optional(),
        }),
      })
    ).optional(),
  }),
  transactions: z.array(
    z.object({
      amount: amountSchema,
      description: z.string().optional(),
      custom: z.string().optional(),
      invoice_number: z.string().optional(),
      item_list: z.object({
        items: z.array(
          z.object({
            name: z.string(),
            sku: z.string().optional(),
            price: z.string(),
            currency: z.string().min(3).max(3),
            quantity: z.number().int().positive(),
          })
        ).optional(),
        shipping_address: addressSchema.optional(),
      }).optional(),
    })
  ),
  redirect_urls: z.object({
    return_url: z.string().url(),
    cancel_url: z.string().url(),
  }),
});

/**
 * Create Subscription Schema
 */
const createSubscriptionSchema = z.object({
  plan_id: z.string(),
  start_time: z.string().datetime().optional(),
  quantity: z.string().optional(),
  shipping_amount: amountSchema.optional(),
  subscriber: z.object({
    name: nameSchema,
    email_address: z.string().email(),
    shipping_address: addressSchema.optional(),
  }),
  application_context: applicationContextSchema.optional(),
});

/**
 * Export all payment schemas
 */
export const paymentSchemas = {
  createPaymentTokenSchema,
  createOrderSchema,
  captureOrderSchema,
  createPaymentSchema,
  createSubscriptionSchema,
};
