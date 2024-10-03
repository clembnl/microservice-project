# Microservices Project - Full Project

This project demonstrates a complete microservices architecture using **Node.js**, **TypeScript**, **GraphQL**, **Kafka**, and more. It consists of the following services:

1. **Inventory Service** (MongoDB)
2. **Orders Service** (PostgreSQL)
3. **Users Service** (MongoDB)
4. **GraphQL Gateway**: Combines APIs of microservices via GraphQL (available at port `4000`).
5. **Kafka**: Message broker for inter-service communication.
6. **Prometheus**: Monitoring for Kafka and microservices.
7. **Grafana**: Visualization for Prometheus metrics (available at port `3000`).

## Prerequisites

Make sure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Minikube**: [Install Minikube](https://minikube.sigs.k8s.io/docs/start/) (for Kubernetes deployment)
- **Kubectl**: [Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) (for Kubernetes commands)

## Project Structure

```bash
services/
├── inventory/          # Inventory service
├── orders/             # Orders service
├── users/              # Users service
├── graphql/            # GraphQL Gateway service
docker-compose.yml      # Docker Compose configuration
kubernetes/             # Kubernetes manifests (deployments, services, etc.)
```

## Running with Docker Compose

### 1. Build and Start the Services

To build and start all services with **Docker Compose** (including Kafka, Prometheus, and Grafana):

```bash
docker-compose up --build
```

### 2. Accessing the Services

Once the services are running, you can access them via the following ports:

- **Inventory Service**: [http://localhost:3003](http://localhost:3003)
- **Orders Service**: [http://localhost:3002](http://localhost:3002)
- **Users Service**: [http://localhost:3001](http://localhost:3001)
- **GraphQL Gateway**: [http://localhost:4000](http://localhost:4000) (Use to query the other services)
- **Kafka**: Internal service (no direct HTTP access)
- **Prometheus**: [http://localhost:9090](http://localhost:9090) (for metrics monitoring)
- **Grafana**: [http://localhost:3000](http://localhost:3000) (for visualizing metrics)

You can log in to **Grafana** using the default credentials:
- Username: `admin`
- Password: `admin`

### 3. Stopping the Services

To stop and clean up all running services:

```bash
docker-compose down
```

---

## Running with Kubernetes Minikube

### 1. Start Minikube

Start Minikube with sufficient resources:

```bash
minikube start --cpus 4 --memory 8192
```

### 2. Deploy the Services

To deploy all services with **Kubernetes** using **kubectl** and **Minikube**, run the following commands from the `kubernetes/` directory:

```bash
kubectl apply -f k8s/base/namespace.yml
kubectl apply -f ./k8s/configs
kubectl apply -f ./k8s/base
kubectl apply -f ./k8s/network-policies
```

This will deploy the services into the `microservices` namespace.

### 3. Accessing Services in Minikube

In **Minikube**, only **GraphQL Gateway** and **Grafana** are exposed externally. You can access them via Minikube's service tunneling feature:

- Start a tunnel:
  
  ```bash
  minikube tunnel
  ```

- **GraphQL Gateway**: [http://localhost:4000](http://localhost:4000)
- **Grafana**: [http://localhost:3000](http://localhost:3000)

You can also access other services (e.g., **Prometheus**) by forwarding their ports:

```bash
kubectl port-forward svc/prometheus -n microservices 9090:9090
```

This command will expose Prometheus at [http://localhost:9090](http://localhost:9090).

### 4. Stopping and Cleaning Up

To stop and remove all Kubernetes resources:

```bash
kubectl delete -f .
```

And to stop Minikube:

```bash
minikube stop
```

---

## Environment Variables

You can customize the environment variables for each service in both `docker-compose.yml` (for Docker) and `kubernetes/` manifests (for Kubernetes). This includes database connection strings, service ports, Kafka configurations, etc.

---

## License

This project is licensed under the MIT License.