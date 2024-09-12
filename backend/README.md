# Backend

## Overview
This is the backend API for the Welcome Collective Inventory Management Solution.
It's built using Express.js with Typescript, TypeORM for DB management, and tsoa for API documentation and route generation.


## Technologies

- Express.js
- TypeScript
- TypeORM
- tsoa
- Swagger
- Nodemon
- Morgan

## Getting Started

### Prerequisites

- Nodejs (v14 or later)
- npm
- PostgreSQL

**Installing / Configuring PostgreSQL**
```
brew install postgresql
brew services start postgresql
# Create welcome collective DB
createdb welcome-collective
```

### Installation
1. Clone the repository
2. Cd into the backend dir
3. Install global dependencies
  ```bash
  npm install -g nodemon
  ```
4. Install project dependencies
  ```bash
  npm install
  ```
*Note: if you receive an error with code: EACCES when running "npm install -g nodemon" or "npm install", run the following commands on your console:*
  ```bash
  sudo chown -R `whoami` ~/.npm

  sudo chown -R `whoami` /usr/local/lib/node_modules
  ```
### DB Setup
Seed the DB with an Admin User
Username: Admin, Pw: Admin123

```bash
npm run seed
```

### Copy and Modify Env File
Copy the .env-example file and rename it to .env

Configure your DB_USERNAME and DB_PASSWORD.
MAC -> Your default username is your logged in account (left of the @ in the terminal)

### Running the Development Server
Start the development server
```bash
npm run start:dev
```
If no errors popup, navigate to localhost:3001/docs!

## Project Structure
```
src/
  controllers/
  services/
  dtos/
  entities/
  middlewares/
  utils/
  tests/
```

# Conventions

## Conventions for Project Components

To maintain consistency and clarity in our codebase, we will follow these naming conventions for components in the backend.

## General Rules

1. Use PascalCase for class names, interfaces, and type aliases.
2. Use camelCase for variable names, function names, and method names.
3. Use UPPER_SNAKE_CASE for constants.
4. Use kebab-case for file names.

## Specific Component Conventions

### Controllers

- File naming: `<feature>.controller.ts`
- Class naming: `<Feature>Controller`

Examples:
- `auth.controller.ts`
- `user.controller.ts`
- `item.controller.ts`

```typescript
// In auth.controller.ts
export class AuthController { ... }
```

### Services

- File naming: `<feature>.service.ts`
- Class naming: `<Feature>Service`

Examples:
- `auth.service.ts`
- `user.service.ts`
- `item.service.ts`

```typescript
// In user.service.ts
export class UserService { ... }
```

### DTOs (Data Transfer Objects)

Directory Structure:
```
src/
  dtos/
    user.dto.ts
    item.dto.ts
```

- File naming: `<feature>.dto.ts`
- Class naming: `<Action><Feature>DTO`

Examples:
- `user.dto.ts`
- `item.dto.ts`

```typescript
// In user.dto.ts
export class CreateUserDTO { ... }
export class UpdateUserDTO { ... }
```

### Entities

- File naming: `<feature>.entity.ts`
- Class naming: `<Feature>`

Examples:
- `user.entity.ts`
- `item.entity.ts`
- `category.entity.ts`

```typescript
// In user.entity.ts
export class User { ... }
```

### Middlewares

- File naming: `<feature>.middleware.ts`
- Function/Class naming: `<feature>Middleware`

Examples:
- `auth.middleware.ts`
- `error-handling.middleware.ts`

```typescript
// In auth.middleware.ts
export function authMiddleware() { ... }
// or
export class AuthMiddleware { ... }
```

### Utility Functions

- File naming: `<feature>.util.ts`
- Function naming: camelCase

Examples:
- `password.util.ts`
- `date.util.ts`

```typescript
// In password.utils.ts
export function hashPassword() { ... }
```

### Test Files

- File naming: `<component-name>.spec.ts`

Examples:
- `user.controller.spec.ts`
- `auth.service.spec.ts`

By following the conventions mentioned above, we ensure a consistent and easily navigable codebase. This structure allows for scalability and clear separation of concerns.

# Validation Approach

Our application uses a combination of tsoa, class-validator, and DTOs to handle validation consistently across the codebase. This approach ensures that data is validated at the API boundary and that our services work with pre-validated data.

## Key Components

1. **DTOs (Data Transfer Objects)**: Define the shape of data for both incoming requests and outgoing responses.
2. **tsoa**: Generates routes and Swagger documentation based on our controller decorators.
3. **class-validator**: Provides decorators for validating properties in our DTOs.

## Validation Flow

1. **API Request**: When a request comes in, tsoa automatically validates it against the defined DTO.
2. **Controller**: The controller receives pre-validated data matching the DTO, and we use class-validator to validate other constraints.
3. **Service**: Services work with validated DTOs, focusing on business logic and DB queries rather than validation.

## Example

```typescript
// DTO
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    username!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string;
}

// Controller
@Post("/login")
@Response<LoginResponseDTO>(200, "OK")
@Response<AuthResponseDTO>(401, "Unauthorized")
public async login(@Body() request: LoginRequestDTO): Promise<LoginResponseDTO> {
    // Validates loginRequestDTO against class-validator requirements.
    const loginRequestDTO = await transformAndValidate<LoginRequestDTO>(LoginRequestDTO, request);
    return this.authService.login(request);
}

// Service
public async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    // Implement login logic here
    // Don't need to revalidate the DTO.
}
```

## Benefits

1. **Single Source of Truth**: DTOs define both the API contract and validation rules.
2. **Automatic Validation**: tsoa handles validation based on DTO definitions.
3. **Type Safety**: TypeScript ensures we're working with correctly shaped data throughout the application.
4. **Clean Code**: Controllers and services focus on their primary responsibilities without duplicating validation logic.
5. **Consistent Error Responses**: tsoa provides consistent error responses for validation failures.

## Best Practices

1. Define all DTOs in a `dtos` directory.
2. Use class-validator decorators in DTOs for all validation rules.
3. Keep controllers thin, delegating business logic to services.
4. Services should assume incoming DTOs are valid and focus on business logic.
5. Use tsoa decorators in controllers to define API behavior and generate documentation.

# Error Logging Implementation

Our application implements a robust error logging system using a custom Logger utility and a centralized error handling middleware.
This approach ensures consistent error handling and logging across the application.

## Key Components

1. **Logger Utility**: A custom Logger class that wraps Winston logger, providing methods for different log levels (info, warn, error, etc.).
2. **Error Handling Middleware**: A centralized middleware that catches and processes all errors, logging them appropriately and sending standardized responses to the client.

## Error Handling Flow

1. **Error Occurrence**: When an error occurs in any part of the application, it's either thrown or passed to the next() function in Express middleware.
2. **Middleware Capture**: The error handling middleware captures all errors that weren't handled earlier in the request-response cycle.
3. **Error Classification**: The middleware determines the type of error (Validation, Authentication, Authorization, etc.) and logs it accordingly.
4. **Logging**: The appropriate log level (warn, error) is used based on the error type. All errors are logged with relevant details.
5. **Response**: A standardized error response is sent to the client, with an appropriate HTTP status code and message.

**Benefits**

1. **Centralized Error Handling**: All errors are processed in one place, ensuring consistency.
2. **Detailed Logging**: Each error is logged with relevant details, aiding in debugging and monitoring.
3. **Standardized Responses**: Clients receive consistent error responses, improving API usability.
4. **Separation of Concerns**: Error handling logic is separated from business logic, improving code maintainability.

By following this approach, we maintain a clear separation of concerns, reduce code duplication, and ensure consistent validation across our application.
