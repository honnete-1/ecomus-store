# Ecomus — E-Commerce Storefront

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.18-5A29E4?logo=axios&logoColor=white)

Ecomus is a luxury e-commerce storefront built as a frontend developer assignment. It consumes a live REST API to let a visitor browse a product catalog, filter by category, view product details, manage a cart, and place an order, all wrapped in a clean black, charcoal, and gold design.

Live Demo: [https://ecomus-store-ten.vercel.app/](https://ecomus-store-ten.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Used](#api-used)
- [Folder Structure](#folder-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [How Authentication Works](#how-authentication-works)
- [State Management](#state-management)
- [Known Limitations and Assumptions](#known-limitations-and-assumptions)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Features

- User registration and login with JWT based authentication
- Persistent session using a token stored in localStorage
- Protected routes for cart, checkout, and order history
- Product catalog fetched live from the API, shown in a responsive grid
- Product details page with images, brand, price, stock, and variants
- Category filtering and client side search and sorting
- Shopping cart with add, update quantity, remove, and clear actions
- Checkout flow that places an order from the cart
- Order history page showing the logged in user's past purchases
- Loading, success, error, and empty states on every API driven view
- Fully responsive layout for mobile, tablet, and desktop
- Graceful fallback UI for products with missing images or fields

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 with Vite |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Icons | Lucide React |
| State Management | React Context API |
| Linting | oxlint |

## API Used

This project consumes the Ecomus Professional E-Commerce REST API.

Base URL:
```
https://e-commas-apis-production-e0f8.up.railway.app
```

Key endpoints integrated:

| Purpose | Endpoint |
|---|---|
| List products | `GET /api/public/products` |
| Products by category | `GET /api/public/products/category/{categoryId}` |
| Product detail | `GET /api/public/products/{id}` |
| Register | `POST /api/auth/users/register` |
| Login | `POST /api/auth/users/login` |
| Current user | `GET /api/auth/users/me` |
| Categories | `GET /api/categories` |
| View cart | `GET /api/auth/cart` |
| Add cart item | `POST /api/auth/cart/items` |
| Update cart item | `PATCH /api/auth/cart/items/{itemId}` |
| Remove cart item | `DELETE /api/auth/cart/items/{itemId}` |
| Clear cart | `DELETE /api/auth/cart` |
| Checkout from cart | `POST /api/auth/orders` |
| Order history | `GET /api/auth/orders` |

All endpoint paths, payloads, and response shapes follow the Swagger documentation provided with the assignment, and it was treated as the single source of truth during development.

## Folder Structure

```
src/
├── api/               # centralized Axios client and request interceptor
├── components/        # reusable UI (ProductCard, CategoryFilter, ProtectedRoute, SkeletonCard)
├── context/            # AuthContext and CartContext for global state
├── pages/              # route level views (Login, Register, Products, ProductDetails,
│                       #   Cart, Checkout, OrderHistory)
├── assets/             # static images
├── App.jsx             # routes and layout
├── main.jsx            # application entry point
└── index.css           # Tailwind CSS setup and global styles
```

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/ecomus-store.git
   cd ecomus-store
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root (see [Environment Variables](#environment-variables)).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app at `http://localhost:5173`.

## Environment Variables

Create a `.env` file with the following key:

```env
VITE_API_BASE_URL=https://e-commas-apis-production-e0f8.up.railway.app
```

The same variable must be added under Project Settings in Vercel (or any host) for the deployed build to reach the live API.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs oxlint against the codebase |

## How Authentication Works

- Registration and login requests go to `/api/auth/users/register` and `/api/auth/users/login`.
- On success, the API returns a JWT token and a user object.
- The token is stored in localStorage and attached to every protected request through an Axios request interceptor as `Authorization: Bearer <token>`.
- `GET /api/auth/users/me` is used to restore the session on page reload.
- `ProtectedRoute` redirects unauthenticated users away from the cart, checkout, and order history pages.
- Logging out clears the token and user state and returns the visitor to the login page.

## State Management

Global state is handled with the Context API rather than a library like Redux, since the app only needs two shared pieces of state.

- `AuthContext` holds the current user, token, and the login, register, and logout actions.
- `CartContext` holds the cart contents and item count, and exposes add, update, remove, and clear actions that call the cart API and refresh the cart afterward.

This keeps the app simple, readable, and easy to explain, while still avoiding prop drilling.

## Known Limitations and Assumptions

- The live API currently returns empty image arrays for most products. Rather than substituting fake images, the UI renders a clean, on brand "no image available" placeholder so the interface still looks intentional.
- The Swagger documentation does not describe a dedicated search endpoint, so search is implemented as client side filtering over the fetched product list, matching against name and brand.
- Sorting by price or name is also done on the client for the same reason.
- The exact response shape of the cart endpoint was not fully documented, so the frontend normalizes whatever shape is returned into a consistent `{ items, total, count }` structure before rendering.
- If an endpoint behaves unexpectedly or becomes unavailable, the affected view shows a friendly error state with a retry option instead of failing silently.

## Deployment

The app is deployed on Vercel.

Live Demo: [https://ecomus-store-ten.vercel.app/](https://ecomus-store-ten.vercel.app/)

To deploy your own copy:

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Add `VITE_API_BASE_URL` under Environment Variables in the Vercel project settings.
5. Deploy.

## Future Improvements

- Add unit tests for the API layer and critical components with Vitest or React Testing Library.
- Add debounced search once a backend search endpoint becomes available.
- Add a wishlist or favorites feature.
- Add dark mode and theme switching.
- Replace plain spinners with skeleton loaders across all views for a more polished loading experience.
