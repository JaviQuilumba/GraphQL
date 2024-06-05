import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css'
import Inicio from "./Views/Inicio";
import GraphQL from "./Views/ViewGraphQL/GraphQL";

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/button2" element={<GraphQL />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
