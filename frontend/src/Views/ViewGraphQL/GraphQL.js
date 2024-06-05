import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from "react-router-dom";
import './estilos.css';

// Consulta GraphQL para obtener todas las películas
const GET_MOVIES = gql`
  query {
    movies {
      id
      title
      director
      year
    }
  }
`;

// Mutación para agregar una película
const ADD_MOVIE = gql`
  mutation AddMovie($title: String!, $director: String!, $year: Int!) {
    addMovie(title: $title, director: $director, year: $year) {
      id
      title
      director
      year
    }
  }
`;

// Mutación para actualizar
const UPDATE_MOVIE = gql`
  mutation UpdateMovie($id: ID!, $title: String!, $director: String!, $year: Int!) {
    updateMovie(id: $id, title: $title, director: $director, year: $year) {
      id
      title
      director
      year
    }
  }
`;

// Mutación para eliminar
const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id) {
      id
    }
  }
`;

function GraphQL() {
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        director: '',
        year: ''
    });

    const { loading, error, data } = useQuery(GET_MOVIES);
    const [addMovie] = useMutation(ADD_MOVIE, {
        update(cache, { data: { addMovie } }) {
            const { movies } = cache.readQuery({ query: GET_MOVIES });
            cache.writeQuery({
                query: GET_MOVIES,
                data: { movies: [...movies, addMovie] },
            });
        }
    });

    const [updateMovie] = useMutation(UPDATE_MOVIE, {
        update(cache, { data: { updateMovie } }) {
            const { movies } = cache.readQuery({ query: GET_MOVIES });
            cache.writeQuery({
                query: GET_MOVIES,
                data: { movies: movies.map(movie => movie.id === updateMovie.id ? updateMovie : movie) },
            });
        }
    });

    const [deleteMovie] = useMutation(DELETE_MOVIE, {
        update(cache, { data: { deleteMovie } }) {
            const { movies } = cache.readQuery({ query: GET_MOVIES });
            cache.writeQuery({
                query: GET_MOVIES,
                data: { movies: movies.filter(movie => movie.id !== deleteMovie.id) },
            });
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveMovie = async () => {
        try {
            if (formData.id) {
                await updateMovie({ variables: { ...formData, year: parseInt(formData.year) } });
            } else {
                await addMovie({ variables: { ...formData, year: parseInt(formData.year) } });
            }
            setFormData({
                id: null,
                title: '',
                director: '',
                year: ''
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDeleteMovie = async (id) => {
        try {
            await deleteMovie({ variables: { id } });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleStartEditing = (movie) => {
        setFormData({ ...movie, year: movie.year.toString() });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h1>Películas</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <h2>Lista de Películas</h2>
            <ul>
                {data.movies.map(movie => (
                    <li key={movie.id}>
                        <h3>{movie.title}</h3>
                        <p><strong>Director:</strong> {movie.director}</p>
                        <p><strong>Año:</strong> {movie.year}</p>
                        <button className="edit" onClick={() => handleStartEditing(movie)}>Editar</button>
                        <button className="delete" onClick={() => handleDeleteMovie(movie.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <h2>Agregar/Editar</h2>
            <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleInputChange} />
            <input type="text" name="director" placeholder="Director" value={formData.director} onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Año" value={formData.year} onChange={handleInputChange} />
            <button onClick={handleSaveMovie}>Guardar</button>
            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Volver</button>
                </Link>
            </div>
        </div>
    );
}

export default GraphQL;
