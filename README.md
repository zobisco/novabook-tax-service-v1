# Novabook API Tax Service

The Novabook API is a service designed to manage transactions, sales amendments, and tax positions. This document provides an overview of the project, including setup instructions, usage, and key features.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Endpoints](#endpoints)
  - [Transactions](#transactions)
  - [Sales Amendments](#sales-amendments)
  - [Tax Position](#tax-position)
- [Testing](#testing)
- [Technologies Used](#technologies-used)

## Features

- Manage transactions (sales and tax payments).
- Track amendments to sales.
- Query tax positions at any given point in time.
- Full API documentation using Swagger.
- SQLite database for lightweight persistence.
- Comprehensive test coverage.

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zobisco/novabook-tax-service-v1.git
   cd novabook-tax-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

1. Start the application in dev mode:

   ```bash
   npm run start:dev
   ```

2. Apply migrations to set up the database:

   ```bash
   npm run migration:run
   ```

3. Access the API documentation at:

   ```
   http://localhost:3000/api
   ```

## Endpoints

### Transactions

- **POST /transactions**
  - Create a new transaction.
  - Example Request Body (Sales):

    ```json
    {
      "eventType": "SALES",
      "date": "2024-02-22T17:29:39Z",
      "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      "items": [
        {
          "itemId": "item1",
          "cost": 1099,
          "taxRate": 0.2
        }
      ]
    }
    ```

- **POST /transactions**
  - Example Request Body (Tax Payment):

    ```json
    {
      "eventType": "TAX_PAYMENT",
      "date": "2024-02-22T17:29:39Z",
      "amount": 74901
    }
    ```

### Sales Amendments

- **PATCH /sale**
  - Amend an item in a sale.
  - Example Request Body:

    ```json
    {
      "date": "2024-02-22T17:29:39Z",
      "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      "itemId": "item1",
      "cost": 1200,
      "taxRate": 0.15
    }
    ```

### Tax Position

- **GET /tax-position**
  - Query the tax position for a specific date.
  - Example Query:

    ```
    GET /tax-position?date=2024-02-22T17:29:39Z
    ```

  - Example Response:

    ```json
    {
      "date": "2024-02-22T17:29:39Z",
      "taxPosition": 500
    }
    ```

## Testing

1. Run tests:

   ```bash
   npm test
   ```

2. Run tests with verbose output:

   ```bash
   npm test -- --verbose
   ```

## Technologies Used

- **Backend Framework**: NestJS
- **Database**: SQLite
- **ORM**: TypeORM
- **Testing**: Jest
- **Documentation**: Swagger

---

For further details, refer to the source code and Swagger documentation.

npm install && npm run start:dev && npm run migration:run

//EOF
