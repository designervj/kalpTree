# KalpTree - E-commerce SaaS & Website Builder

KalpTree is a powerful, multi-tenant E-commerce SaaS and Website Builder platform built with modern web technologies. It empowers users to create dynamic online stores, manage products, and customize website layouts with a visual drag-and-drop editor.

## Key Features

- **Dynamic Entity System**: Flexible data model for managing various business entities.
- **Role-Based Access Control (RBAC)**: secure permission management for different user roles.
- **Visual Website Builder**: Integrated GrapesJS editor for drag-and-drop page creation.
- **Multi-tenancy Support**: Architecture designed to support multiple tenants/stores.
- **Admin Dashboard**: Comprehensive dashboard for managing store settings, orders, and content.
- **Authentication**: Secure user authentication powered by NextAuth.js.

## Tech Stack

This project leverages a robust stack of modern technologies:

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Page Builder**: [GrapesJS](https://grapesjs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Storage**: AWS S3
- **Payment Integration**: Stripe, Razorpay

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Check `package.json` for version compatibility, likely v18 or higher recommended)
- Package Manager: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/m17gupta/new-kalpTree.git
    cd new-kalpTree
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Environment Setup

1.  Create a `.env` file in the root directory based on `.env.example`.
    ```bash
    cp .env.example .env
    ```
2.  Update the `.env` file with your specific configuration values (MongoDB URI, Auth secrets, AWS keys, etc.).

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your console) to view the application.

## Project Structure

For a detailed overview of the project's file structure, please refer to [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Documentation

Comprehensive documentation is available in the root directory:

- [ARCHITECTURE.md](./ARCHITECTURE.md): System architecture overview.
- [RBAC_SYSTEM.md](./RBAC_SYSTEM.md): Details on the Role-Based Access Control system.
- [DYNAMIC_ENTITY_SYSTEM.md](./DYNAMIC_ENTITY_SYSTEM.md): Guide to the dynamic entity system.
- [QUICK_START_NEW_ENTITY.md](./QUICK_START_NEW_ENTITY.md): Guide for adding new entities.
- [REPEATABLE_COMPONENTS_GUIDE.md](./REPEATABLE_COMPONENTS_GUIDE.md): Guidelines for creating repeatable components.
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md): Summary of recent refactoring efforts.

## Scripts

- `dev`: Runs the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality issues.
