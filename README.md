# Microservices Project - Module 2

This project demonstrates an enhanced microservices architecture built using **Node.js**, **TypeScript**, and **GraphQL**. It consists of four microservices: **Inventory**, **Orders**, **Users**, and **GraphQL**, each connected to its respective database. The services are dockerized and deployed locally using **Docker Compose**.

## Microservices Overview

1. **Inventory Service**: Manages product inventory using **MongoDB**.
2. **Orders Service**: Manages orders with **PostgreSQL** as its database.
3. **Users Service**: Manages user data, backed by **MongoDB**.
4. **GraphQL Service**: Acts as an API gateway, providing a unified GraphQL interface for all services.

## Prerequisites

Make sure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```bash
services/
├── inventory/          # Inventory service
├── orders/             # Orders service
├── users/              # Users service
├── graphql/            # GraphQL Gateway service
docker-compose.yml      # Docker Compose configuration
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
   - **GraphQL Service**: [http://localhost:4000](http://localhost:4000)

## GraphQL Playground

The GraphQL Service provides a GraphQL Playground where you can explore and test the GraphQL API. Access it at: [http://localhost:4000](http://localhost:4000)

## Stopping the Services

To stop and remove the containers, networks, and volumes, run:

```bash
docker-compose down
```

This command will stop all running services and clean up the containers, networks, and volumes created by Docker Compose.

## GraphQL Queries and Mutations

The **GraphQL Service** exposes a unified API for querying and mutating data across all services. Here are some example queries and mutations:

### Queries

- Get all products:

```graphql
query {
  products {
    id
    name
    price
    description
  }
}
```

- Get a user by ID with their orders and products:

```graphql
query {
  user(id: "user_id") {
    id
    name
    email
    orders {
      id
      total
      products {
        id
        name
        price
      }
    }
  }
}
```

### Mutations

- Create a new product:

```graphql
mutation {
  createProduct(name: "New Product", price: 9.99, description: "A new product") {
    id
    name
    price
    description
  }
}
```

- Create a new order:

```graphql
mutation {
  createOrder(userId: "user_id", productIds: ["product_id_1", "product_id_2"]) {
    id
    userId
    total
    products {
      id
      name
      price
    }
  }
}
```

## Environment Variables

You can modify the environment variables for each service in the `docker-compose.yml` file. For example, database connection strings and ports are configured in the `environment` section of each service.

## License

This project is licensed under the MIT License.
