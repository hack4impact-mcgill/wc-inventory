# Web Collective Inventory Management Solution

[![Netlify Status](https://api.netlify.com/api/v1/badges/d4f6c68a-954f-42f8-b172-9fb6e3a79b9f/deploy-status)](https://app.netlify.com/sites/wc-inventory/deploys)

## Overview

The Welcome Collective Inventory Frontend is an inventory management application for the Welcome Collective. The application allows volunteers and management to easily manage incoming and outgoing donations.

## Project Structure

```txt
web-collective-inventory/
│
├── src/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setting Up the Frontend

1. clone the repo
```bash
git clone https://github.com/hack4impact-mcgill/wc-inventory.git
cd new-frontend
```

2. Install the dependencies for the project:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```
The app should now be running on [localhost:3000](http://localhost:3000).

## Project Structure

- **`/assets`**: Static assets used across the application.
- **`/components`**: Reusable UI components.
- **`/contexts`**: Contexts for application-wide state management, such as authentication.
- **`/features`**: Grouped features for distinct sections,
  such as `admin-dashboard` and `volunteer-dashboard`.
- **`/hooks`**: Custom hooks to abstract common logic.
- **`/lib`**: Utility files, including API functions.
- **`/providers`**: Providers for third-party libraries,
  including React Query and our Router.
- **`/types`**: Type definitions for structured data and our supabase exported schema.


## Technologies

- **Supabase**: Used for DB and authentication services.
  For more information, visit [Supabase](https://supabase.com/).
- **TailwindCSS**: Utility-first CSS framework for styling.
  For more information, visit [TailwindCSS](https://tailwindcss.com/).
- **shadcn/ui**: Styled component library providing reusable UI elements,
  built on top of TailwindCSS.
  Learn more at [shadcn](https://shadcn.dev/).



## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes, adhering to the coding conventions described in the backend and frontend READMEs.
4. Write or update tests as necessary.
5. Push your changes and create a pull request.
6. Code Review
7. Merge into Dev




## Contributing

1. **Fork the repository** and create a story branch, where # is the number of your ticket:

   ```bash
   git checkout -b WC-##
   ```

2. **Stage and commit your changes**:

   ```bash
   git add .
   git commit -m "[WC-#] Add your feature"
   ```

3. **Write or update tests as necessary**.

4. **Push to your branch** and then create a pull request:

   ```bash
   git push origin WC-#
   ```

5. **Code Review and Merge**

