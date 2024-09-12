import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import axios from 'axios';
import DataLoader from 'dataloader';
import { User, Order, Product } from './types'; // Import the interfaces

// Define the GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    orders: [Order!] # Associated orders for the user
  }

  type Order {
    id: ID!
    userId: ID!
    products: [Product!] # Associated products for the order
    total: Float!
    status: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
    order(id: ID!): Order
    orders: [Order]
    product(id: ID!): Product
    products: [Product]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean

    createOrder(userId: ID!, productIds: [ID!]!): Order
    updateOrder(id: ID!, status: String!): Order
    deleteOrder(id: ID!): Boolean

    createProduct(name: String!, price: Float!, description: String): Product
    updateProduct(id: ID!, name: String, price: Float, description: String): Product
    deleteProduct(id: ID!): Boolean
  }
`;

// DataLoader instances to batch and cache requests
const orderLoader = new DataLoader<string, Order[]>(async (userIds) => {
  try {
    const response = await axios.get(`http://orders-service:3002/orders`, {
      params: { userIds: userIds.join(',') }
    });
    console.log('Order Loader Response:', response.data); // Log the data to check for issues
    const orders = response.data;
    // Ensure the length of the returned array matches userIds
    return userIds.map(userId => orders.filter((order: Order) => order.userId === userId) || null);
  } catch (error) {
    console.error('Error fetching products:', error);
    return userIds.map(() => new Error('Error fetching users'));
  }
});

// Example product loader that fetches products by IDs
const productLoader = new DataLoader(async (productIds: readonly string[]) => {
  try {
    const response = await axios.get(`http://inventory-service:3003/products?ids=${productIds.join(',')}`);
    console.log('Product Loader Response:', response.data); // Log the data to check for issues
    const products = response.data;
    // Ensure the length of the returned array matches productIds
    return productIds.map(productId => products.find((product: Product) => product._id === productId) || null);
  } catch (error) {
    console.error('Error fetching products:', error);
    return productIds.map(() => new Error('Error fetching products'));
  }
});

// Resolvers to handle GraphQL operations
const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }): Promise<User> => {
      const userResponse = await axios.get(`http://users-service:3001/users/${id}`);
      const user = userResponse.data;
      const orders = await orderLoader.load(user._id);
      return { ...user, id: user._id, orders };
    },
    users: async (): Promise<User[]> => {
      const response = await axios.get('http://users-service:3001/users');
      const users = response.data;
      
      // For each user, fetch associated orders
      return Promise.all(users.map(async (user: User) => {
        const orders = await orderLoader.load(user._id);
                // Check if orders are found and map _id to id
                const resolvedOrders = orders.map((order: Order) => {
                  if (order instanceof Error || !order) {
                    // Handle missing orders if necessary
                    console.error('Order not found:', order);
                    throw new Error('Order not found');
                  }
                  return { ...order, id: order.id };
                });
        
                // Remove any null products or throw an error if necessary
                const nonNullOrders = resolvedOrders.filter(order => order !== null);
                
                // Return the order with associated non-null products
                return { ...user, id: user._id, orders: nonNullOrders };
      }));
    },
    order: async (_: any, { id }: { id: string }): Promise<Order> => {
      const orderResponse = await axios.get(`http://orders-service:3002/orders/${id}`);
      const order = orderResponse.data;
      const products = await productLoader.loadMany(order.productIds);
      return { ...order, products };
    },
    orders: async (): Promise<Order[]> => {
      const response = await axios.get('http://orders-service:3002/orders');
      const orders = response.data;

      // Fetch associated products for each order
      return Promise.all(orders.map(async (order: Order) => {
        const products = await productLoader.loadMany(order.productIds);

        // Check if products are found and map _id to id
        const resolvedProducts = products.map((product: Product) => {
          if (product instanceof Error || !product) {
            // Handle missing products if necessary
            console.error('Product not found:', product);
            throw new Error('Product not found');
          }
          return { ...product, id: product._id };
        });

        // Remove any null products or throw an error if necessary
        const nonNullProducts = resolvedProducts.filter(product => product !== null);
        
        // Return the order with associated non-null products
        return { ...order, products: nonNullProducts };
      }));
    },
    product: async (_: any, { id }: { id: string }): Promise<Product> => {
      const response = await axios.get(`http://inventory-service:3003/products/${id}`);
      return { ...response.data, id: response.data._id };
    },
    products: async (): Promise<Product[]> => {
      const response = await axios.get('http://inventory-service:3003/products');
      return response.data.map((product: Product) => ({ ...product, id: product._id }));
    }
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string, email: string }): Promise<User> => {
      const response = await axios.post('http://users-service:3001/users', { name, email });
      return { ...response.data, id: response.data._id }
    },
    updateUser: async (_: any, { id, name, email }: { id: string, name?: string, email?: string }): Promise<User> => {
      const response = await axios.put(`http://users-service:3001/users/${id}`, { name, email });
      return { ...response.data, id: response.data._id };
    },
    deleteUser: async (_: any, { id }: { id: string }): Promise<boolean> => {
      await axios.delete(`http://users-service:3001/users/${id}`);
      return true;
    },

    createOrder: async (_: any, { userId, productIds }: { userId: string, productIds: string[] }): Promise<Order> => {
      const products = await productLoader.loadMany(productIds);

      // Check if there is an error in the products response
      if (products.some((product) => product instanceof Error)) {
        console.error('Error loading products');
        throw new Error('Error loading products');
      }

      // Map productIds to the corresponding products
      const filteredProducts = productIds.map(productId =>
        (products as Product[]).find(product => product._id === productId)
      );

      // Check if any of the products were not found
      if (filteredProducts.some(product => !product)) {
        console.error('Some products not found');
        throw new Error('Some products not found');
      }

       // Calculate the total price
      const total = (products as Product[]).reduce((sum, product) => sum + product.price, 0);

      // Send the order creation request to the order service
      const orderResponse = await axios.post('http://orders-service:3002/orders', {
        userId,
        productIds,
        total,
        status: 'pending'
      });

      return { ...orderResponse.data, products: filteredProducts };
    },
    updateOrder: async (_: any, { id, status }: { id: string, status: string }): Promise<Order> => {
      const response = await axios.put(`http://orders-service:3002/orders/${id}`, { status });
      return { ...response.data, id: response.data._id };
    },
    deleteOrder: async (_: any, { id }: { id: string }): Promise<boolean> => {
      await axios.delete(`http://orders-service:3002/orders/${id}`);
      return true;
    },

    createProduct: async (_: any, { name, price, description }: { name: string, price: number, description?: string }): Promise<Product> => {
      const response = await axios.post('http://inventory-service:3003/products', { name, price, description });
      return { ...response.data, id: response.data._id };
    },
    updateProduct: async (_: any, { id, name, price, description }: { id: string, name?: string, price?: number, description?: string }): Promise<Product> => {
      const response = await axios.put(`http://inventory-service:3003/products/${id}`, { name, price, description });
      return { ...response.data, id: response.data._id };
    },
    deleteProduct: async (_: any, { id }: { id: string }): Promise<boolean> => {
      await axios.delete(`http://inventory-service:3003/products/${id}`);
      return true;
    }
  }
};

// Initialize Express app
const app = express();

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });

  // Start the server
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});