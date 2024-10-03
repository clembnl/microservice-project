# Microservices Project - Module 1

This project demonstrates a basic microservices architecture built using **Node.js** and **TypeScript**. It consists of three microservices: **Inventory**, **Orders**, and **Users**, each connected to its respective database. The services are dockerized and deployed locally using **Docker Compose**.

## Microservices Overview

1. **Inventory Service**: Manages product inventory using **MongoDB**.
2. **Orders Service**: Manages orders with **PostgreSQL** as its database.
3. **Users Service**: Manages user data, backed by **MongoDB**.

## Prerequisites

Make sure you have the following installed on your machine:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```bash
services/
├── inventory/          # Inventory service
├── orders/             # Orders service
├── users/              # Users service
docker-compose.yml      # Docker Compose file for setting up the services and databases
```

## Running the Services Locally

To run all the services along with their databases locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/clembnl/microservice-project.git
   cd microservice-project
   git checkout module1
   ```

2. **Build and Start the Services**:

   Run the following command to build the services and start the containers:

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker images for each service.
   - Start the services along with their databases (MongoDB and PostgreSQL).

3. **Accessing the Services**:

   The services will be available at the following ports:

   - **Inventory Service**: [http://localhost:3003](http://localhost:3003)
   - **Orders Service**: [http://localhost:3002](http://localhost:3002)
   - **Users Service**: [http://localhost:3001](http://localhost:3001)

## Stopping the Services

To stop and remove the containers, networks, and volumes, run:

```bash
docker-compose down
```

This command will stop all running services and clean up the containers, networks, and volumes created by Docker Compose.

## API Endpoints

Each service exposes a set of CRUD operations. Here's an example of the endpoints for the **Inventory Service**:

- **GET** `/products` - Get all products
- **GET** `/products/:id` - Get a product by ID
- **POST** `/products` - Create a new product
- **PUT** `/products/:id` - Update a product by ID
- **DELETE** `/products/:id` - Delete a product by ID

Similar endpoints exist for the **Orders** and **Users** services.

## Environment Variables

You can modify the environment variables for each service in the `docker-compose.yml` file. For example, database connection strings and ports are configured in the `environment` section of each service.

## License

This project is licensed under the MIT License.