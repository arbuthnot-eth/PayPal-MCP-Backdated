# PayPal MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that provides integration with PayPal's APIs. This server enables seamless interaction with PayPal's payment processing, invoicing, subscription management, and business operations through a standardized interface.

## Features

- **Payment Processing**: Create and capture payments, orders, and payment tokens
- **Subscription Management**: Create and manage recurring subscriptions
- **Business Operations**: Create products, invoices, and process payouts
- **User Management**: Retrieve user information and create web profiles
- **Secure Authentication**: Automatic token management with refresh handling
- **Input Validation**: Comprehensive validation using Zod schemas
- **Error Handling**: Robust error handling and logging

## Installation

```bash
# Clone the repository
git clone https://github.com/arbuthnot-eth/PayPal-MCP-Backdated.git
cd PayPal-MCP-Backdated

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

Create a `.env` file in the root directory with your PayPal API credentials:

```
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_ENVIRONMENT=sandbox  # or 'live' for production
```

## Usage

### Running the Server

```bash
# Start the server
npm start

# For development with auto-reload
npm run dev
```

### MCP Configuration

Add the server to your MCP configuration file:

```json
{
  "mcpServers": {
    "paypal": {
      "command": "node",
      "args": ["path/to/paypal-mcp/build/index.js"],
      "env": {
        "PAYPAL_CLIENT_ID": "your_client_id",
        "PAYPAL_CLIENT_SECRET": "your_client_secret",
        "PAYPAL_ENVIRONMENT": "sandbox"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Available Tools

### Payment Tools

- `create_payment_token`: Create a payment token for future use
- `create_order`: Create a new order in PayPal
- `capture_order`: Capture payment for an authorized order
- `create_payment`: Create a direct payment
- `create_subscription`: Create a subscription for recurring billing

### Business Tools

- `create_product`: Create a new product in the catalog
- `create_invoice`: Generate a new invoice
- `create_payout`: Process a batch payout

### User Tools

- `get_userinfo`: Retrieve user information
- `create_web_profile`: Create a web experience profile
- `get_web_profiles`: Get list of web experience profiles

## Development

```bash
# Run linting
npm run lint

# Run tests
npm test

# Format code
npm run format
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
