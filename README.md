# beta version avalible on
https://dulcet-lokum-0e2e6a.netlify.app/

# E-commerce Platform

An E-commerce platform built on the MERN (MongoDB, Express.js, React.js, Node.js) stack. It includes user authentication, cart functionality, search with category filters, an admin panel for product and category management, and global state management using Context API.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Admin Panel Usage](#admin-panel-usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- **User Authentication:** Secure user registration, login, and password reset functionalities.
- **Cart Functionality:** Enable users to manage their shopping cart by adding/removing items.
- **Search with Category Filters:** Allow users to search and filter products by categories.
- **Admin Panel:** Secure access for administrators to manage products and categories via CRUD operations.
- **Global State Management:** Utilize Context API for efficient global state management.
- **Third-Party Libraries:**
  - Axios: Utilized for making HTTP requests to the backend.
  - React-Toast: Display informative messages or notifications to users.
  - Context API: Manage global states efficiently.

## Tech Stack

- **Frontend:** React.js, Context API, Axios, React-Toast, deployed on Netlify.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose) for data storage.

## Getting Started

1. **Clone the Repository:** `git clone <repository-url>`
2. **Install Dependencies:**
   - Frontend: `cd frontend && npm install`
   - Backend: `cd backend && npm install`
3. **Set Up Environment Variables:** Configure environment variables for MongoDB connection, etc.
4. **Run the Application:**
   - Frontend: `npm start` in the `frontend` directory
   - Backend: `npm start` in the `backend` directory

## Admin Panel Usage

- **Managing Products and Categories:**
  - Use the admin panel to add, edit, or delete products and categories.

## Deployment

The frontend is deployed on [Netlify](https://www.netlify.com/) at `<frontend-deployment-url>`. Please check the live application [here](<frontend-deployment-url>).

## Contributing

Contributions are welcome! If you'd like to contribute or report issues, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Mention any libraries, tutorials, or resources you used.
