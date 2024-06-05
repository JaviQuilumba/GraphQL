const { gql } = require('apollo-server-express');

// Definir el esquema GraphQL
const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    director: String!
    year: Int!
  }

  type Query {
    movies: [Movie]
    movie(id: ID!): Movie
  }

  type Mutation {
    addMovie(title: String!, director: String!, year: Int!): Movie
    updateMovie(id: ID!, title: String!, director: String!, year: Int!): Movie
    deleteMovie(id: ID!): Movie
  }
`;

// Datos de películas 
let movies = [
    {
        id: '1',
        title: 'Inception',
        director: 'Christopher Nolan',
        year: 2010
    },
    {
        id: '2',
        title: 'The Matrix',
        director: 'Lana and Lilly Wachowski',
        year: 1999
    },
    {
        id: '3',
        title: 'Interstellar',
        director: 'Christopher Nolan',
        year: 2014
    }
];

//Consultas y mutaciones
const resolvers = {
    Query: {
        movies: () => movies,
        movie: (_, { id }) => movies.find(movie => movie.id === id),
    },
    Mutation: {
        addMovie: (_, { title, director, year, coverImage }) => {
            const id = String(movies.length + 1);
            const newMovie = { id, title, director, year, coverImage };
            movies.push(newMovie);
            return newMovie;
        },
        updateMovie: (_, { id, title, director, year, coverImage }) => {
            const index = movies.findIndex(movie => movie.id === id);
            if (index === -1) {
                throw new Error('Movie not found');
            }
            movies[index] = { ...movies[index], title, director, year, coverImage };
            return movies[index];
        },
        deleteMovie: (_, { id }) => {
            const index = movies.findIndex(movie => movie.id === id);
            if (index === -1) {
                throw new Error('Movie not found');
            }
            const [deletedMovie] = movies.splice(index, 1);
            return deletedMovie;
        }
    }
};

module.exports = { typeDefs, resolvers };
