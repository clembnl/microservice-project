#!/bin/bash

# 1. Generate the Certificate Authority (CA)
openssl req -new -x509 -keyout ca-key.pem -out ca-cert.pem -days 365 -subj "/CN=ca.example.com" -nodes

# 2. Generate Kafka broker keystore and private key
keytool -keystore kafka.server.keystore.jks -alias kafka-broker -validity 365 -genkey -keyalg RSA -storepass kafka123 -keypass kafka123 -dname "CN=kafka.example.com"

# 3. Create a certificate signing request (CSR) for the broker
keytool -keystore kafka.server.keystore.jks -alias kafka-broker -certreq -file kafka-broker.csr -storepass kafka123 -keypass kafka123

# 4. Sign the broker certificate with the CA
openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -in kafka-broker.csr -out kafka-broker-signed-cert.pem -days 365 -CAcreateserial -passin pass:kafka123

# 5. Import the CA certificate into the broker keystore
keytool -keystore kafka.server.keystore.jks -alias CARoot -import -file ca-cert.pem -storepass kafka123 -keypass kafka123 -noprompt

# 6. Import the signed certificate into the broker keystore
keytool -keystore kafka.server.keystore.jks -alias kafka-broker -import -file kafka-broker-signed-cert.pem -storepass kafka123 -keypass kafka123 -noprompt

# 7. Create a truststore and import the CA certificate
keytool -keystore kafka.server.truststore.jks -alias CARoot -import -file ca-cert.pem -storepass kafka123 -noprompt

# 8. Generate client keystores and certificates (repeat for each service)
for service in orders-service users-service; do
  keytool -keystore $service.keystore.jks -alias $service -validity 365 -genkey -keyalg RSA -storepass kafka123 -keypass kafka123 -dname "CN=$service.example.com"
  keytool -keystore $service.keystore.jks -alias $service -certreq -file $service.csr -storepass kafka123 -keypass kafka123
  openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -in $service.csr -out $service-signed-cert.pem -days 365 -CAcreateserial -passin pass:kafka123
  keytool -keystore $service.keystore.jks -alias CARoot -import -file ca-cert.pem -storepass kafka123 -keypass kafka123 -noprompt
  keytool -keystore $service.keystore.jks -alias $service -import -file $service-signed-cert.pem -storepass kafka123 -keypass kafka123 -noprompt
done

# 9. Generate a keystore and certificate for kafka-exporter
keytool -keystore kafka-exporter.keystore.jks -alias kafka-exporter -validity 365 -genkey -keyalg RSA -storepass kafka123 -keypass kafka123 -dname "CN=kafka"
keytool -keystore kafka-exporter.keystore.jks -alias kafka-exporter -certreq -file kafka-exporter.csr -storepass kafka123 -keypass kafka123
openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -in kafka-exporter.csr -out kafka-exporter-signed-cert.pem -days 365 -CAcreateserial -passin pass:kafka123
keytool -keystore kafka-exporter.keystore.jks -alias CARoot -import -file ca-cert.pem -storepass kafka123 -keypass kafka123 -noprompt
keytool -keystore kafka-exporter.keystore.jks -alias kafka-exporter -import -file kafka-exporter-signed-cert.pem -storepass kafka123 -keypass kafka123 -noprompt

# 10. Extract private keys and certificates from JKS to PEM format
for service in orders-service users-service; do
  keytool -exportcert -alias $service -keystore $service.keystore.jks -rfc -file $service-certificate.pem -storepass kafka123
  keytool -importkeystore -srckeystore $service.keystore.jks -destkeystore $service-keystore.p12 -deststoretype PKCS12 -srcstorepass kafka123 -deststorepass kafka123
  openssl pkcs12 -in $service-keystore.p12 -nodes -nocerts -out $service-key.pem -passin pass:kafka123
done

# 11. Extract kafka-exporter's private key and certificate
keytool -exportcert -alias kafka-exporter -keystore kafka-exporter.keystore.jks -rfc -file kafka-exporter-certificate.pem -storepass kafka123
keytool -importkeystore -srckeystore kafka-exporter.keystore.jks -destkeystore kafka-exporter-keystore.p12 -deststoretype PKCS12 -srcstorepass kafka123 -deststorepass kafka123
openssl pkcs12 -in kafka-exporter-keystore.p12 -nodes -nocerts -out kafka-exporter-key.pem -passin pass:kafka123

echo "TLS certificates generated and extracted to PEM format successfully."