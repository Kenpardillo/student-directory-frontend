# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Reflection Questions

### 1. Why do we store the token in `localStorage`? What is one security risk, and what is a more secure alternative?

We store the token in `localStorage` so the user stays logged in after refreshing the page or closing the tab. The frontend can also read it easily and attach it to each request as `Authorization: Bearer <token>`. The main security risk is cross-site scripting (XSS): if an attacker manages to run JavaScript on the page, that script can read `localStorage` and steal the token. A more secure alternative is to have the server send the token in an `httpOnly`, `Secure`, `SameSite` cookie, which JavaScript cannot read. This approach needs extra protection against CSRF attacks.

### 2. What is the purpose of the `AuthContext`? Why not just pass the token as a prop to each component?

`AuthContext` keeps the login state (the token, the user, and the login and logout functions) in one central place. Any component can read it through the `useAuth()` hook, as `Students.jsx` does to get the token for its fetch request. Passing the token as a prop would mean sending it through every component between `App` and the page that needs it, which is called prop drilling and gets messy as the app grows. With context, there is one source of truth, so when the user logs out, every component sees the change at once.

### 3. What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.

When the JWT expires, the backend's `requireAuth` middleware rejects the request with a 401 Unauthorized response. I would want the frontend to detect that 401, remove the token from `localStorage` and from the context, and redirect the user to the login page. The login page should show a clear message such as "Your session has expired. Please log in again," so the user is not confused by a blank list or a vague error. After logging in again, the user should be taken back to the page they were on. A further improvement would be to check the token's expiry time before sending requests so the user is logged out earlier.

### 4. What is the difference between the backend's `requireAuth` middleware and the frontend's `ProtectedRoute` component? Why do we need both?

`requireAuth` runs on the server and verifies the JWT's signature and expiry before it lets a request reach the data. It is the real security check, because it decides whether the data is sent at all. `ProtectedRoute` runs in the browser and only controls which pages are shown, redirecting users without a token to the login page. We need both because frontend code can be viewed and changed by the user, so `ProtectedRoute` alone cannot protect data. Without `ProtectedRoute`, the backend would still be safe, but users would see broken pages instead of being sent to login.