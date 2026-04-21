const express = require('express')
const path = require('path')
const fs = require('fs/promises');
const { writer } = require('repl');
const { writeJSON, readJSON, listStoredMovies, normalizeMovieData } = require('./movie-model.js');

require('dotenv').config();

const app = express()

// Parse JSON bodies
app.use(express.json());

// ---------------
// Main server code
// ---------------

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Configure a 'get' endpoint for data..
app.get('/movies', async function (req, res) {
  // accept optional query parameter 'genre' to filter movies by genre (e.g. /movies?genre=Action)
  // can be used multiple times to filter by multiple genres (e.g. /movies?genre=Action,Sci-Fi)
  const genreFilter = req.query.genre;
  const genreFilters = genreFilter ? genreFilter.split(',').map(s => s.trim()) : null;
  console.log("Received request for movies with genre filters:", genreFilters);

  // This endpoint will return a list of all movies stored in the JSON files (returns json data as list).
  try {
    const files = await listStoredMovies();

    const movies = (await Promise.all(
      files.map(file => readJSON(file))
    )).filter(movie => movie !== null) // filter out any files that failed to read;
      .filter(movie => {
        if (!genreFilters) return true;
        // check if atleast one of the movie's genres is in the genreFilters list
        return movie.genres.some(genre => genreFilters.includes(genre));
      });

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal: failed to read movies' });
  }
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', async function (req, res) {
  try {
    const imdbID = req.params.imdbID;
    const movie = await readJSON(`${imdbID}.json`);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal: failed to read movie' });
  }
});

app.put('/movies/:imdbID', async function (req, res) {
  const imdbID = req.params.imdbID;
  const movie = req.body;

  if (!movie) {
    return res.status(400).json({ error: 'invalid movie data' });
  }

  // Ensure the movie has the correct imdbID
  movie.imdbID = imdbID;

  console.log("Received movie data for update:", movie);

  try {
    const fileExists = await fs.access(`data/${imdbID}.json`)
      .then(() => true)
      .catch(() => false);

    await writeJSON(`${imdbID}.json`, movie);

    if (fileExists) {
      res.status(200).json({ status: 'success', message: 'Movie updated successfully' });
    } else {
      res.status(201).json(movie);
    }
  } catch (err) {
    console.error('Error saving movie:', err);
    res.status(500).json({ error: 'Failed to save movie' });
  }
});

// Custom endpoint to fetch a new movie from the OMDB API and save it to a JSON file.
app.post('/fetch-new-movie', async function (req, res) {
  //This endpoint will fetch a new movie from the OMDB API and save it to a JSON file.
  try {
    const title = req.query.title;

    if (!title) {
      return res.status(400).send('missing query parameter: title');
    }

    // Call OMDB API
    const apiKey = process.env.OMDb_apikey;
    if (!apiKey) {
      return res.status(500).json({ error: 'internal: OMDb API key not configured' });
    }

    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.Response === 'False') {
      return res.status(404).json({
        error: data.Error // Movie not found});
      });
    }

    // normalize and save movie data to JSON file
    const movie = normalizeMovieData(data);

    // check if movie already exists in JSON files
    if (await fs.access(`data/${movie.imdbID}.json`)
      .then(() => true)
      .catch(() => false)) {
      return res.status(200).json({ "status": "success", "msg": "Movie already exists" });
    }

    await writeJSON(`${movie.imdbID}.json`, movie);

    res.status(201).json({ "status": "success", "msg": "Movie added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- showcase ---
// const movieModule = require('./movie-model.js');
// if (!('tt1375666' in movieModule.model)) {
//   // foo
// } else {
//   // bar
// }


app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

