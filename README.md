# Ecomus Luxury E-Commerce Storefront

A professional, production-grade frontend application for the Ecomus Luxury brand, consuming the Ecomus REST API. Built with modern React features, Context API, and Tailwind CSS.

## Project Overview

This project is a high-end luxury e-commerce storefront designed to provide a premium user experience. It integrates seamlessly with the Ecomus REST API to handle authentication, dynamic product catalog listing, category filtering, a shopping cart, and an order checkout flow. The aesthetic focuses on elegance, using a custom color palette (Black, Charcoal, Luxury Gold, Light Gray, White), smooth transitions, generous spacing, and minimalist design.

## Architecture & Folder Structure

The application is structured to separate concerns logically and ensure scalability:

```text
src/
├── api/             # Centralized Axios client and interceptors
├── components/      # Reusable UI components (ProductCard, CategoryFilter, ProtectedRoute, etc.)
├── context/         # React Context for global state (AuthContext, CartContext)
├── pages/           # Route-level components (Login, Products, Cart, Checkout, etc.)
├── App.jsx          # Main application component with routing
├── main.jsx         # React application entry point
├── index.css        # Global styles and Tailwind CSS v4 setup
```

## Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Context API

## Installation and Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd ecomus-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the API Base URL:
   ```env
   VITE_API_BASE_URL=https://e-commas-apis-production-e0f8.up.railway.app
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## How Authentication Works

- The application uses JWT (JSON Web Tokens) for authentication.
- Upon successful login (`/api/auth/users/login`) or registration, the server returns a token.
- This token is persisted in `localStorage`.
- `axiosClient` utilizes a request interceptor to automatically attach `Authorization: Bearer <token>` to all outgoing protected requests.
- A response interceptor catches `401 Unauthorized` responses to clear the session and redirect the user back to the login page via a global event.
- React Router's `ProtectedRoute` component ensures that only authenticated users can access routes like Cart, Checkout, and Orders.

## State Management

Global state is managed via the **Context API** to avoid prop-drilling without introducing the complexity of external libraries like Redux.
- `AuthContext`: Manages user session, login, registration, and logout flows.
- `CartContext`: Fetches the cart from the API, manages adding/removing items, updating quantities, and clearing the cart upon successful checkout.

## Known Limitations & Design Decisions

- **Missing API Images (Design Decision)**: The API currently returns empty image arrays for all products. To strictly adhere to the provided API and avoid "faking" data with external image generation services, the frontend gracefully handles this edge case by rendering a custom, luxurious "No Image" UI fallback (utilizing Lucide icons and Tailwind). This demonstrates robust null-data handling.
- **Search**: The Swagger documentation does not detail a specific search endpoint. Search functionality is currently implemented via client-side filtering on the fetched product list.
- **Cart API Details**: Assuming a standard cart structure returned by the API since exact shapes varied in the Swagger summary.

## Future Improvements

- Add comprehensive Unit Tests (Jest / React Testing Library).
- Implement a Dark Mode theme switcher.
- Add debounced search requests if a backend search endpoint becomes available.
- Optimize image loading with `loading="lazy"` and modern formats.

## Deployment

This application is ready to be deployed to Vercel, Netlify, or any static hosting service. Ensure that the `VITE_API_BASE_URL` environment variable is configured in the hosting provider's dashboard.
