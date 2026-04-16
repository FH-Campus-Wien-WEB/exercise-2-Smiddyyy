const express = require('express')
const path = require('path')
const fs = require('fs/promises');
require('dotenv').config();

// ---------------
// helpers methods
// ---------------

async function writeJSON(filename, data) {
  await fs.mkdir('data', { recursive: true });
  await fs.writeFile(`data/${filename}`, JSON.stringify(data, null, 2));
}

async function readJSON(filename) {
  try {
    const raw = await fs.readFile(`data/${filename}`, 'utf-8');
    const data = JSON.parse(raw);
    return data;
  } catch (err) {
    console.error("Invalid JSON in file:", filename);
    return null;
  }
}

async function listStoredMovies() {
  return fs.readdir('data')
    .then(files => files.filter(file => file.endsWith('.json')))
    .catch(err => {
      console.error("Error reading directory:", err);
      return [];
    });
}

function normalizeMovieData(movie) {
  return {
    imdbID: movie.imdbID,
    title: movie.Title,
    released: new Date(movie.Released).toISOString().split('T')[0], // in ISO 8601 format
    runtime: parseInt(movie.Runtime), // as number ("142 min" -> 142)
    genres: movie.Genre.split(', ').map(s => s.trim()), // as array of strings ("Action, Adventure, Sci-Fi" -> ["Action", "Adventure", "Sci-Fi"])
    directors: movie.Director.split(', ').map(s => s.trim()), // as array of strings ("Lana Wachowski, Lilly Wachowski" -> ["Lana Wachowski", "Lilly Wachowski"])
    actors: movie.Actors.split(', ').map(s => s.trim()), // as array of strings ("Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss" -> ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"])
    writers: movie.Writer.split(', ').map(s => s.trim()), // as array of strings ("Lana Wachowski, Lilly Wachowski" -> ["Lana Wachowski", "Lilly Wachowski"])
    plot: movie.Plot,
    poster: movie.Poster,
    metascore: parseInt(movie.Metascore), // as number
    imdbRating: parseFloat(movie.imdbRating) // as number
  };
}

module.exports = {
  writeJSON,
  readJSON,
  listStoredMovies,
  normalizeMovieData
};