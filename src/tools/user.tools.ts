/**
 * User tools for PayPal MCP Server
 * 
 * Implements user-related tools for the MCP server.
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
 * Get User Info Tool
 * 
 * Retrieves information about the authenticated user.
 */
const getUserInfo: Tool = {
  name: 'get_userinfo',
  description: 'Retrieve user information',
  inputSchema: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  handler: async (_args, authService) => {
    logger.info('Getting user information');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.get('/v1/identity/oauth2/userinfo?schema=paypalv1.1');
      return response.data;
    } catch (error) {
      logger.error('Failed to get user information:', error);
      throw new Error('Failed to get user information');
    }
  },
};

/**
 * Create Web Profile Tool
 * 
 * Creates a web experience profile for customizing the checkout flow.
 */
const createWebProfile: Tool = {
  name: 'create_web_profile',
  description: 'Create a web experience profile',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      temporary: { type: 'boolean' },
      flow_config: { type: 'object' },
      input_fields: { type: 'object' },
      presentation: { type: 'object' },
    },
    required: ['name'],
  },
  handler: async (args, authService) => {
    logger.info('Creating web profile');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.post('/v1/payment-experience/web-profiles', args);
      return response.data;
    } catch (error) {
      logger.error('Failed to create web profile:', error);
      throw new Error('Failed to create web profile');
    }
  },
};

/**
 * Get Web Profiles Tool
 * 
 * Retrieves all web experience profiles.
 */
const getWebProfiles: Tool = {
  name: 'get_web_profiles',
  description: 'Get list of web experience profiles',
  inputSchema: {
    type: 'object',
    properties: {},
    additionalProperties: false,
  },
  handler: async (_args, authService) => {
    logger.info('Getting web profiles');
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.get('/v1/payment-experience/web-profiles');
      return response.data;
    } catch (error) {
      logger.error('Failed to get web profiles:', error);
      throw new Error('Failed to get web profiles');
    }
  },
};

/**
 * Get Web Profile Tool
 * 
 * Retrieves a specific web experience profile.
 */
const getWebProfile: Tool = {
  name: 'get_web_profile',
  description: 'Get a specific web experience profile',
  inputSchema: {
    type: 'object',
    properties: {
      profile_id: { type: 'string' },
    },
    required: ['profile_id'],
  },
  handler: async (args, authService) => {
    logger.info(`Getting web profile: ${args.profile_id}`);
    
    const axios = authService.getAxiosInstance();
    
    try {
      const response = await axios.get(`/v1/payment-experience/web-profiles/${args.profile_id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get web profile ${args.profile_id}:`, error);
      throw new Error(`Failed to get web profile ${args.profile_id}`);
    }
  },
};

/**
 * Update Web Profile Tool
 * 
 * Updates an existing web experience profile.
 */
const updateWebProfile: Tool = {
  name: 'update_web_profile',
  description: 'Update a web experience profile',
  inputSchema: {
    type: 'object',
    properties: {
      profile_id: { type: 'string' },
      name: { type: 'string' },
      flow_config: { type: 'object' },
      input_fields: { type: 'object' },
      presentation: { type: 'object' },
    },
    required: ['profile_id'],
  },
  handler: async (args, authService) => {
    logger.info(`Updating web profile: ${args.profile_id}`);
    
    const axios = authService.getAxiosInstance();
    const { profile_id, ...payload } = args;
    
    try {
      const response = await axios.put(`/v1/payment-experience/web-profiles/${profile_id}`, payload);
      return response.data || { success: true, profile_id };
    } catch (error) {
      logger.error(`Failed to update web profile ${profile_id}:`, error);
      throw new Error(`Failed to update web profile ${profile_id}`);
    }
  },
};

/**
 * Delete Web Profile Tool
 * 
 * Deletes a web experience profile.
 */
const deleteWebProfile: Tool = {
  name: 'delete_web_profile',
  description: 'Delete a web experience profile',
  inputSchema: {
    type: 'object',
    properties: {
      profile_id: { type: 'string' },
    },
    required: ['profile_id'],
  },
  handler: async (args, authService) => {
    logger.info(`Deleting web profile: ${args.profile_id}`);
    
    const axios = authService.getAxiosInstance();
    
    try {
      await axios.delete(`/v1/payment-experience/web-profiles/${args.profile_id}`);
      return { success: true, profile_id: args.profile_id };
    } catch (error) {
      logger.error(`Failed to delete web profile ${args.profile_id}:`, error);
      throw new Error(`Failed to delete web profile ${args.profile_id}`);
    }
  },
};

/**
 * Export all user tools
 */
export const userTools: Tool[] = [
  getUserInfo,
  createWebProfile,
  getWebProfiles,
  getWebProfile,
  updateWebProfile,
  deleteWebProfile,
];
