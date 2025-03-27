# Employee Directory

A modern React application for managing employee data with a beautiful UI, animations, and complete CRUD operations.

## Live Demo

View the live application at: [https://employ-wise-task.vercel.app/]

You can use the demo credentials below to log in.

## Features

- User authentication with token-based login
- View and search employee data
- Edit and delete employee information
- Responsive design for mobile and desktop
- Modern UI with animations
- Pagination for large datasets

## Tech Stack

- React
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling
- ReqRes API for backend interactions

## Demo Credentials

- Email: `eve.holt@reqres.in`
- Password: `cityslicka`

## Setup and Installation

1. **Clone the repository**


    ```bash
   git clone https://github.com/SankalpBadoni/EmployWise-Task.git
   cd employwisetask
   ```


2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**

   The application will be available at [http://localhost:5173](http://localhost:5173)

## Project Structure

```
employwisetask/
├── public/           # Static files
├── src/              # Source files
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   │   ├── Login.jsx       # Login page
│   │   └── UsersList.jsx   # Users management page
│   ├── App.jsx       # Main application component
│   └── main.jsx      # Entry point
└── index.html        # HTML template
```

## API Endpoints

This project uses the [ReqRes API](https://reqres.in/) for demonstration:

- `POST /api/login` - User authentication
- `GET /api/users?page={page_number}` - Fetch users with pagination
- `PUT /api/users/{id}` - Update user data
- `DELETE /api/users/{id}` - Delete user

## Development Notes

- The application uses a mock REST API provided by ReqRes
- User authentication token is stored in localStorage
- Edit and delete operations are simulated using the ReqRes API


## License

This project is licensed under the MIT License - see the LICENSE file for details.
