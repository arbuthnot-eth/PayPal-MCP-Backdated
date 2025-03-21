/**
 * PayPal Authentication Service
 * 
 * Handles authentication with PayPal API, including token management,
 * automatic token refresh, and credential verification.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { logger } from '../utils/logger.js';
import { sanitizeForLogging } from '../utils/validation.js';

/**
 * Authentication service configuration
 */
interface PayPalAuthConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'live';
}

/**
 * Authentication token response from PayPal
 */
interface TokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
  scope: string;
  expiration?: number; // Added locally, not from PayPal
}

/**
 * PayPal Authentication Service
 */
export class PayPalAuthService {
  private config: PayPalAuthConfig;
  private baseUrl: string;
  private axiosInstance: AxiosInstance;
  private tokenData: TokenResponse | null = null;
  
  /**
   * Create a new PayPal authentication service
   */
  constructor(config: PayPalAuthConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';
    
    // Create axios instance with default configuration
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(async (config) => {
      // Skip auth for token endpoint
      if (config.url === '/v1/oauth2/token') {
        return config;
      }
      
      // Ensure we have a valid token
      await this.ensureAccessToken();
      
      // Add authorization header
      if (this.tokenData) {
        config.headers.Authorization = `${this.tokenData.token_type} ${this.tokenData.access_token}`;
      }
      
      return config;
    });
    
    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          // Log API errors
          logger.error('PayPal API Error:', {
            status: error.response.status,
            data: sanitizeForLogging(error.response.data),
            url: error.config.url,
            method: error.config.method,
          });
          
          // Handle 401 errors (token expired)
          if (error.response.status === 401 && error.config && !error.config.__isRetry) {
            logger.info('Access token expired, refreshing...');
            
            // Clear token and retry
            this.tokenData = null;
            await this.ensureAccessToken();
            
            // Clone the original request
            const newRequest = { ...error.config, __isRetry: true };
            
            // Add new token
            if (this.tokenData) {
              newRequest.headers.Authorization = `${this.tokenData.token_type} ${this.tokenData.access_token}`;
            }
            
            return this.axiosInstance(newRequest);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Get the axios instance with authentication
   */
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
  
  /**
   * Ensure we have a valid access token
   */
  public async ensureAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.tokenData && this.tokenData.expiration && this.tokenData.expiration > Date.now()) {
      return this.tokenData.access_token;
    }
    
    // Get a new token
    return this.getAccessToken();
  }
  
  /**
   * Get a new access token from PayPal
   */
  private async getAccessToken(): Promise<string> {
    try {
      logger.debug('Getting new access token from PayPal');
      
      // Create auth string
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      
      // Request configuration
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`,
        },
      };
      
      // Make request to token endpoint
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        config
      );
      
      // Store token with expiration
      this.tokenData = response.data;
      this.tokenData.expiration = Date.now() + (this.tokenData.expires_in * 1000) - 60000; // Subtract 1 minute for safety
      
      logger.info('Successfully obtained new access token');
      
      return this.tokenData.access_token;
    } catch (error) {
      logger.error('Failed to get access token:', error);
      throw new Error('Failed to authenticate with PayPal API');
    }
  }
  
  /**
   * Verify PayPal credentials by attempting to get a token
   */
  public async verifyCredentials(): Promise<boolean> {
    try {
      await this.getAccessToken();
      return true;
    } catch (error) {
      logger.error('Failed to verify PayPal credentials:', error);
      return false;
    }
  }
}
