const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require("./src/graphqlServ");

const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://localhost:3000'
}));

const server = new ApolloServer({ typeDefs, resolvers });
const startServer = async () => {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
        console.log(`GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
    });
};

startServer();
