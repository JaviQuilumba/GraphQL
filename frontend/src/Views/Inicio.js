// src/Inicio.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

function Inicio() {
    return (
        <div className="container">
            <div className="content">
                <h1>GraphQL</h1>
                <h2>Es un lenguaje de consulta para API.</h2>
                <div className="button-container">
                    <Link to="/button2"><button className="styled-button">GraphQL</button></Link>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
