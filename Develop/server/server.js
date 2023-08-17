const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Import your GraphQL type definitions and resolvers here
const typeDefs = `
  type Query {
    hello: String
  }`;

const resolvers = {
  Query: {
    hello: () => "Hello, World!",
  },
};

// Creates Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Apply Apollo Server as middleware to Express js
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if in production, serve build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});