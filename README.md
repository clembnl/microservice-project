# Microservices Project - Module 3

This project demonstrates a microservices architecture with event-driven communication using **Apache Kafka**. It consists of four microservices: **Inventory**, **Orders**, **Users**, and **GraphQL**, each connected to its respective database. The services are dockerized and deployed locally using **Docker Compose**.

## Microservices Overview

1. **Inventory Service**: Manages product inventory using **MongoDB**.
2. **Orders Service**: Manages orders with **PostgreSQL** as its database. Acts as a Kafka producer.
3. **Users Service**: Manages user data, backed by **MongoDB**. Acts as a Kafka consumer.
4. **GraphQL Service**: Acts as an API gateway, providing a unified GraphQL interface for all services.

## Prerequisites

Make sure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```bash
kafka/                  # Kafka configuration files
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
   git checkout module3
   ```

2. **Build and Start the Services**:

   Run the following command to build the services and start the containers:

   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the Docker images for each service.
   - Start the services along with their databases (MongoDB and PostgreSQL) and Kafka.
  
3. **Accessing the Services**:

   The services will be available at the following ports:

   - **Inventory Service**: [http://localhost:3003](http://localhost:3003)
   - **Orders Service**: [http://localhost:3002](http://localhost:3002)
   - **Users Service**: [http://localhost:3001](http://localhost:3001)
   - **GraphQL Service**: [http://localhost:4000](http://localhost:4000)
   - **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
   - **Grafana UI**: [http://localhost:3000](http://localhost:3000)

## GraphQL Playground

The GraphQL Service provides a GraphQL Playground where you can explore and test the GraphQL API. Access it at: [http://localhost:4000](http://localhost:4000)

## Grafana UI

The **Grafana UI** provides a web-based interface for monitoring Kafka. Access it at: [http://localhost:3000](http://localhost:3000)

## Stopping the Services

To stop and remove the containers, networks, and volumes, run:

```bash
docker-compose down
```

This command will stop all running services and clean up the containers, networks, and volumes created by Docker Compose.

## Testing Kafka Communication

To test the Kafka communication between the **Orders Service** and the **Users Service**, follow these steps:

1. Create a new order using the GraphQL mutation or by sending a POST request to the **Orders Service**.
2. Check the logs of the **Users Service** to verify that it has consumed the order creation event and updated the user's data accordingly.
3. Query the user data using the GraphQL API or by sending a GET request to the **Users Service** to confirm that the user's orders have been updated.

### Monitoring with Prometheus and Grafana

The project includes **Prometheus** and **Grafana** for monitoring the Kafka cluster and the microservices.

Prometheus: Access the Prometheus UI at [http://localhost:9090](http://localhost:9090)
Grafana: Access the Grafana UI at [http://localhost:3000](http://localhost:3000) (default credentials: admin/admin)

1. Click on the "Add data source" button and select "Prometheus".
2. Set the URL to [http://localhost:9090](http://localhost:9090) (assuming you've named the Prometheus service as prometheus in the Docker Compose file).
3. Click on "Save & Test" to verify the connection.
4. Import a pre-built Kafka dashboard or create your own panels to visualize the desired metrics (7589 for exemple).

## Environment Variables

You can modify the environment variables for each service in the `docker-compose.yml` file. For example, database connection strings and ports are configured in the `environment` section of each service.

## License

This project is licensed under the MIT License.