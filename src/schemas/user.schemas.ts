/**
 * User schemas for PayPal MCP Server
 * 
 * Defines Zod validation schemas for user-related operations.
 */

import { z } from 'zod';

/**
 * Get User Info Schema
 * 
 * Schema for retrieving user information from PayPal.
 */
const getUserInfoSchema = z.object({
  // No parameters required for this operation
}).strict();

/**
 * Create Web Profile Schema
 * 
 * Schema for creating a web experience profile in PayPal.
 * Web experience profiles allow merchants to customize the checkout experience.
 */
const createWebProfileSchema = z.object({
  name: z.string().min(1).max(50),
  temporary: z.boolean().optional(),
  flow_config: z.object({
    landing_page_type: z.enum(['billing', 'login']).optional(),
    bank_txn_pending_url: z.string().url().optional(),
    user_action: z.enum(['commit', 'continue']).optional(),
    return_uri_http_method: z.enum(['GET', 'POST']).optional(),
  }).optional(),
  input_fields: z.object({
    allow_note: z.boolean().optional(),
    no_shipping: z.number().int().min(0).max(2).optional(),
    address_override: z.number().int().min(0).max(1).optional(),
  }).optional(),
  presentation: z.object({
    brand_name: z.string().max(127).optional(),
    logo_image: z.string().url().optional(),
    locale_code: z.string().regex(/^[a-z]{2}[-_][A-Z]{2}$/).optional(),
    return_url_label: z.string().max(50).optional(),
    note_to_seller_label: z.string().max(50).optional(),
  }).optional(),
}).strict();

/**
 * Get Web Profiles Schema
 * 
 * Schema for retrieving web experience profiles from PayPal.
 */
const getWebProfilesSchema = z.object({
  // No parameters required for this operation
}).strict();

/**
 * Get Web Profile Schema
 * 
 * Schema for retrieving a specific web experience profile from PayPal.
 */
const getWebProfileSchema = z.object({
  profile_id: z.string(),
}).strict();

/**
 * Update Web Profile Schema
 * 
 * Schema for updating an existing web experience profile in PayPal.
 */
const updateWebProfileSchema = z.object({
  profile_id: z.string(),
  name: z.string().min(1).max(50).optional(),
  flow_config: z.object({
    landing_page_type: z.enum(['billing', 'login']).optional(),
    bank_txn_pending_url: z.string().url().optional(),
    user_action: z.enum(['commit', 'continue']).optional(),
    return_uri_http_method: z.enum(['GET', 'POST']).optional(),
  }).optional(),
  input_fields: z.object({
    allow_note: z.boolean().optional(),
    no_shipping: z.number().int().min(0).max(2).optional(),
    address_override: z.number().int().min(0).max(1).optional(),
  }).optional(),
  presentation: z.object({
    brand_name: z.string().max(127).optional(),
    logo_image: z.string().url().optional(),
    locale_code: z.string().regex(/^[a-z]{2}[-_][A-Z]{2}$/).optional(),
    return_url_label: z.string().max(50).optional(),
    note_to_seller_label: z.string().max(50).optional(),
  }).optional(),
}).strict();

/**
 * Delete Web Profile Schema
 * 
 * Schema for deleting a web experience profile from PayPal.
 */
const deleteWebProfileSchema = z.object({
  profile_id: z.string(),
}).strict();

/**
 * Export all user schemas
 */
export const userSchemas = {
  getUserInfoSchema,
  createWebProfileSchema,
  getWebProfilesSchema,
  getWebProfileSchema,
  updateWebProfileSchema,
  deleteWebProfileSchema,
};
