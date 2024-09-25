```markdown
# Kubernetes Deployment for Microservices Architecture

This repository contains Kubernetes manifests to deploy a microservices-based architecture using Kafka, MongoDB, PostgreSQL, Prometheus, Grafana, and microservices (`users`, `orders`, `inventory`, and `graphql-gateway`).

The system consists of:
- **Zookeeper & Kafka**: Message brokering and event-driven communication.
- **MongoDB (Users and Inventory)**: Databases for storing user and inventory-related data.
- **PostgreSQL (Orders)**: Database for managing orders.
- **Prometheus & Grafana**: Monitoring and visualization of the microservices.
- **Microservices**: `users`, `orders`, `inventory`, and a `GraphQL` gateway to expose APIs.

## Project Structure

```plaintext
/k8s
├── /base
│   ├── namespace.yml                # Namespace for the microservices
│   ├── zookeeper.yml                # Deployment and service for Zookeeper
│   ├── kafka.yml                    # Deployment and service for Kafka (single replica in k8s)
│   ├── kafka-acl-setup.yml          # ACL setup for Kafka (producer/consumer permissions)
│   ├── kafka-exporter.yml           # Kafka exporter for Prometheus monitoring
│   ├── prometheus.yml               # Prometheus deployment and configuration
│   ├── grafana.yml                  # Grafana deployment for monitoring visualization
│   ├── postgres.yml                 # PostgreSQL database for order service
│   ├── mongo-users.yml              # MongoDB for user service
│   ├── mongo-inventory.yml          # MongoDB for inventory service
│   ├── users-service.yml            # Deployment for the users microservice
│   ├── orders-service.yml           # Deployment for the orders microservice
│   ├── inventory-service.yml        # Deployment for the inventory microservice
│   ├── graphql-gateway.yml          # GraphQL gateway exposing all microservices
├── /configs
│   ├── kafka-configmap.yml          # ConfigMap for Kafka configurations
│   ├── prometheus-configmap.yml     # ConfigMap for Prometheus configurations
│   ├── postgres-secrets.yml         # Secrets for PostgreSQL credentials
│   ├── kafka-secrets.yml            # Secrets for Kafka credentials (SASL_SSL, keystore)
│   ├── users-service-secrets.yml    # Secrets for the users service (certificates, keys)
│   ├── orders-service-secrets.yml   # Secrets for the orders service (certificates, keys)
│   ├── mongo-users-pvc.yml          # Persistent Volume Claim for MongoDB (users)
│   ├── mongo-inventory-pvc.yml      # Persistent Volume Claim for MongoDB (inventory)
│   ├── kafka-pvc.yml                # Persistent Volume Claim for Kafka
│   ├── postgres-pvc.yml             # Persistent Volume Claim for PostgreSQL
│   ├── prometheus-pvc.yml           # Persistent Volume Claim for Prometheus data
└── README.md
```

## Prerequisites

Make sure you have the following installed:
- **Kubernetes cluster** (e.g., Minikube, AWS EKS, GKE, etc.)
- **kubectl** for interacting with your Kubernetes cluster
- **Docker** for building the images (if deploying custom images)

Locally with Minikube:

```bash
minikube start --memory 8192 --cpus 4
```

## Step-by-Step Deployment Instructions

### 1. Deploy the Namespace

Create a namespace to keep all resources under a single logical grouping:

```bash
kubectl apply -f k8s/base/namespace.yml
```

### 2. Apply Configuration and Secrets

Before deploying services, we need to set up the required configurations and secrets for Kafka, PostgreSQL, Prometheus, and the microservices:

```bash
kubectl apply -f k8s/configs/kafka-configmap.yml
kubectl apply -f k8s/configs/prometheus-configmap.yml
kubectl apply -f k8s/configs/postgres-secrets.yml
kubectl apply -f k8s/configs/kafka-secrets.yml
kubectl apply -f k8s/configs/users-service-secrets.yml
kubectl apply -f k8s/configs/orders-service-secrets.yml
```

### 3. Set up Persistent Volume Claims (PVCs)

Ensure your services have persistent storage by applying the PVCs:

```bash
kubectl apply -f k8s/configs/mongo-users-pvc.yml
kubectl apply -f k8s/configs/mongo-inventory-pvc.yml
kubectl apply -f k8s/configs/kafka-pvc.yml
kubectl apply -f k8s/configs/postgres-pvc.yml
kubectl apply -f k8s/configs/prometheus-pvc.yml
```

### 4. Deploy Core Services

Deploy Zookeeper, Kafka, Prometheus, Grafana, and the databases:

```bash
kubectl apply -f k8s/base/zookeeper.yml
kubectl apply -f k8s/base/kafka.yml
kubectl apply -f k8s/base/kafka-acl-setup.yml
kubectl apply -f k8s/base/kafka-exporter.yml
kubectl apply -f k8s/base/prometheus.yml
kubectl apply -f k8s/base/grafana.yml
kubectl apply -f k8s/base/postgres.yml
kubectl apply -f k8s/base/mongo-users.yml
kubectl apply -f k8s/base/mongo-inventory.yml
```

### 5. Deploy the Microservices

Deploy the actual microservices and the GraphQL gateway:

```bash
kubectl apply -f k8s/base/users-service.yml
kubectl apply -f k8s/base/orders-service.yml
kubectl apply -f k8s/base/inventory-service.yml
kubectl apply -f k8s/base/graphql-gateway.yml
```

### 6. Access the Microservices

Expose the services and access them from local machine with MiniKube:

```bash
minikube tunnel
```

Get the services and external IPs:

```bash
kubectl get svc -n microservices
```

Access the services locally:

```bash
http://localhost:4000/graphql
```

### 7. Monitor with Prometheus and Grafana

After deployment, access the monitoring tools:
- **Prometheus**: Visit `http://<prometheus-pod-ip>:9090` to query metrics.
- **Grafana**: Visit `http://<grafana-pod-ip>:3000`, login with `admin/admin`, and configure data sources to connect with Prometheus.

You can create dashboards in Grafana for Kafka, microservices, and database metrics using pre-built templates or custom configurations.

## Scaling and Further Customizations

- **Scaling Kafka**: You can easily increase Kafka replicas by adding new `kafka.yml` entries and modifying the `replication-factor`.
- **Secrets Management**: Use an external secret manager (AWS Secrets Manager, etc.) for handling sensitive data in production.
- **Auto-scaling**: Implement Horizontal Pod Autoscaler (HPA) for your microservices based on metrics like CPU or memory.

## Known Issues

- Kafka stream processing is not included in this initial setup but can be integrated once in production (via MSK or another solution).
- Ensure that resource limits are set appropriately in production environments to avoid issues with memory allocation.

## Next Steps

1. Deploy to a managed Kubernetes cluster (e.g., AWS EKS).
2. Add CI/CD pipelines for automated deployments.
3. Explore Kafka streaming with AWS MSK or Confluent Cloud.

---

### License

This project is licensed under the MIT License.
```