# Simple Social Media App

This is a simple social media application that is still under development. It combines a Java backend with a ReactJS frontend built using Vite.

## Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Setup](#setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
## Overview

This project aims to create a basic social media platform where users can connect, follow each other, and share posts. It is a work in progress with ongoing development to add more features and enhance functionality.

## Technologies

### Backend

- **Java:** Programming language used for backend development.
- **Spring Boot:** Framework for creating Java applications.
- **MongoDB:** NoSQL database for data storage.

### Frontend

- **ReactJS:** JavaScript library for building user interfaces.
- **Vite:** Fast build tool that supports modern JavaScript and TypeScript features.

## Setup

To run this project locally, follow these steps:

### Backend Setup

1. Ensure you have Java and Maven installed.
2. Clone this repository:
   ```bash
   git clone https://github.com/echomaverick/cautious-robot.git
   cd cautious-robot
   cd social-app
   ```
## Run the backend server:

```bash
mvn spring-boot:run
```

## Frontend Setup
- Ensure you have Node.js and npm installed.
- Navigate to the frontend directory:
```bash
cd cautious-robot
cd socialApp-client
```

## Install dependencies:

```bash
npm install
```
Start the frontend development server:

```bash
npm run dev
```
- The frontend server will start on http://localhost:3000.

## Database Setup
- Configure MongoDB or your preferred database connection in the backend application properties.

## Usage
- Register as a new user or log in with existing credentials.
- Explore the app, follow other users, and interact with posts.
- Create new posts and share updates with your followers.

## Future Improvements
This project is actively being developed. Planned improvements include:
- Enhanced user profiles and settings.
- Real-time updates and notifications.
- Improved UI/UX design and responsiveness.
- Integration with additional social features (e.g., likes).

## Contributing
Contributions are welcome! Fork this repository, make your changes, and submit a pull request. Please follow the existing coding style and conventions.

## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
