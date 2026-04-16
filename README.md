[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/dpELSpGq)
# Web Technologies - Exercise 2

The second exercise in Web Technologies extends your movie application from Exercise 1. The goal is to make movie data editable: you will restructure how movies are stored on the server, add an edit page with a form, and implement saving changes back to the server.

As before, the work is split across **server-side** and **client-side** code. You find detailed information in the **Tasks** section below.

## Important: Reusing your work from Exercise 1 (strongly recommended)

This repository contains **skeleton code** to get you started. It includes working file structure, some starter JavaScript, and some **basic styling** for the pages (e.g., `base.css`, `index.css`, `edit.css`). The skeleton is meant to provide a solid baseline and to help you recover if something went wrong in Exercise 1.

However, if your solution from Exercise 1 is working, we **strongly recommend** that you build on top of it:

- Bring over your **client-side rendering** from Exercise 1 (HTML structure + DOM manipulation).
- Bring over your **styling** from Exercise 1 (CSS). Even if the skeleton includes some basic CSS, your own styling is part of your work and you should keep it if possible.
- Bring over (and adapt) your **server-side implementation** from Exercise 1, especially your `GET /movies` endpoint and any data formatting you already implemented in `server.js`.

In other words: use this repository as the *starting framework*, but try to continue from your own working codebase. If you copy files over, make sure you understand what you are replacing and keep the parts of the skeleton that are helpful (for example: the new files related to editing, the provided CSS files, and the general folder structure).

## Setup

Before you start, set up your environment the same way as in Exercise 1. Clone your GitHub Classroom repository, open it in an IDE (WebStorm or VS Code recommended), and install dependencies in the project root directory (where this `README.md` file is located):

    npm install

To start the server, you can run:

    npm start

When using the start script, remember that you need to *restart the server whenever you make changes* to your project.

To avoid restarting the server manually each time after making a change, use [`nodemon`](https://www.npmjs.com/package/nodemon) (recommended). `nodemon` monitors your code for changes and restarts the server automatically.

There is no need to install `nodemon` explicitly, it is already a development dependency of the project you cloned.

To start the server using `nodemon`, run:

    npm run start-nodemon

Whichever option you choose, after starting the server you should see:

    Server now listening on http://localhost:3000/

Visit [http://localhost:3000/](http://localhost:3000/) in your browser to test the application manually.

## Project structure

Compared to Exercise 1, the project is now a bit larger.

### Server-side
- `server/server.js` contains startup code and the endpoints
- `server/movie-model.js` will contain the data structure in which the movies are stored

### Client-side
- `server/files/index.html` the overview page showing all movies
- `server/files/index.js` holds the JavaScript code for `index.html`
- `server/files/index.css` contains the stylesheet for `index.html`
- `server/files/edit.html` the edit page for a single movie
- `server/files/edit.js` holds the JavaScript code for `edit.html` (most of which already exists)
- `server/files/edit.css` is ready for you to use in `edit.html` and contains styling for the form
- `server/files/base.css` contains a base stylesheet, used in `index.css` and in `edit.css`

## Tasks

This exercise consists of three larger tasks:

1. **Part 1: Move the movie data to the movie model (2 point)**

   In the first task you will change the way in which the movies are stored on the server. You move the movie data to the movie model module `server/movie-model.js`. Then you re-implement `GET /movies` to return the movies from that module. Finally, you update the overview rendering to include an *Edit* button for each movie.
2. **Part 2: Add a form to edit a movie (2 points)**

   In the second task you will build your first `form`. The user will be able to edit the data of one specific movie. For this to work you will add a new endpoint `GET /movies/:imdbID`, implement navigation from the overview to a new `edit.html` page, and create the form in `edit.html`.
3. **Part 3: Store the modified movie data on the server (2 points)**

   In the third task you will implement saving: the user modifies the form and clicks *Save*, which triggers a `PUT /movies/:imdbID` request to update (or create) the movie on the server.

### Important: Presentation Requirement

**You will be asked about your implementation during our next meeting.** Be prepared to:
- Walk through your code and explain your implementation choices
- Demonstrate the working application
- Answer questions about your approach

Make sure you understand what your code does and why you made certain decisions!

## Checking your implementation

In this exercise you should primarily verify your solution **by using the application in the browser** (and optionally using DevTools / the Network tab).

Recommended checks:
- Does the overview show all movies?
- Does the *Edit* button navigate to the correct movie?
- Does the edit form show existing values?
- Do *Save* and *Cancel* behave as expected?
- If you reload the page, do you still see the updated values?

If you want, you can also verify individual endpoints directly in the browser:
- `GET /movies` should return valid JSON with all movies
- `GET /movies/<imdbID>` should return one movie (or 404 if not found)

---

## Task 1: Move the movie data to the movie model

### 1.1 Store movies in `movie-model.js` as an object (keyed by `imdbID`)

In `movie-model.js`, store movies in a JavaScript object where:
- the **key** is the `imdbID`
- the **value** is the full movie object (same structure as in Exercise 1)

Include **at least three movies**.

One entry could look like this:

```js
tt0084787: {
  imdbID: `tt0084787`,
  Title: `The Thing`,
  Released: `1982-06-25`,
  Runtime: 109,
  Genres: [`Horror`, `Mystery`, `Sci-Fi`],
  Directors: [`John Carpenter`],
  Writers: [`Bill Lancaster`, `John W. Campbell Jr.`],
  Actors: [`Kurt Russell`, `Wilford Brimley`, `Keith David`],
  Plot: `A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.`,
  Poster: `https://m.media-amazon.com/images/M/MV5BNGViZWZmM2EtNGYzZi00ZDAyLTk3ODMtNzIyZTBjN2Y1NmM1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg`,
  Metascore: 57,
  imdbRating: 8.2,
}
```

Make sure to `export` the complete movies object from the `movie-model.js` module so that `server.js` can use it (the import is already included in the skeleton code).

**Verify your implementation:** quickly inspect the model in a debugger or add a `console.log` temporarily to ensure the structure is what you expect.

### 1.2 Update `GET /movies` in `server.js`

Re-implement the endpoint `GET /movies` so that it returns **all movies as an array** (even though they are stored as an object).

Tip: you can use [`Object.values(...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Object/values).

**Verify your implementation:** open [http://localhost:3000/movies](http://localhost:3000/movies) in the browser and check that valid JSON is returned and contains your movies.

### 1.3 Render movies in `index.js` (including an Edit button)

Move (or recreate) your rendering code from Exercise 1 into `server/files/index.js`.

Then extend your rendering so that each movie includes an **Edit** button.

Also, make sure that the element representing a movie has its IMDB id set as its `id` attribute.

**Verify your implementation:** reload [http://localhost:3000/](http://localhost:3000/) and check that:
- all movies appear
- each movie has an *Edit* button
- the movie elements have the correct `id` attributes (you can check this in DevTools)

---

## Task 2: Add a form to edit a movie

### 2.1 Add `GET /movies/:imdbID` in `server.js`

Implement the endpoint `GET /movies/:imdbID`.

The client passes the `imdbID` as a **path parameter**. You can access it in the endpoint code using:

- `req.params.imdbID`

Then:
- If you find the movie, send it to the client using `res.send(...)`
- If you do not find the movie, respond with status **404** (e.g., using `res.sendStatus(404)`)

**Verify your implementation:**
- Open `http://localhost:3000/movies/<someExistingImdbID>` and check you receive JSON
- Try a non-existing id and check the server responds with 404

### 2.2 Navigation between `index.html` and `edit.html`

Now you connect the overview page to a new edit page.

#### From `index.html` to `edit.html`
Add a click handler to each movie’s *Edit* button. The handler should navigate to `edit.html` and pass the movie id as a **query parameter**:

```js
location.href = "edit.html?imdbID=tt1234567"
```

Because the buttons are created dynamically in `index.js`, this also needs to be done dynamically. For example:

```js
const buttonElement = document.createElement('button')
buttonElement.textContent = 'Edit'
buttonElement.onclick = function() {
  location.href = 'edit.html?imdbID=' + movie.imdbID
}
```

#### From `edit.html` back to `index.html`
Add a *Cancel* button in `edit.html` that navigates back to the overview page, e.g.:

- `location.href = "index.html"`

**Verify your implementation:** click *Edit* on a movie, then click *Cancel* and ensure you return to the overview page.

### 2.3 Build the form in `edit.html`

In this part you create the edit page and build the form **statically in HTML** (this time you do not generate the form using `document.createElement(...)`).

Create a `form` element (and put the *Cancel* button inside the form). Then add form fields for all movie properties. Use appropriate elements:
- `input` elements for strings, numbers, dates, urls, and also for your list fields like Actors/Writers/Directors (as text inputs)
- a `select` element for genres
- a `textarea` for the plot

Guidelines:
- Wrap each visible form field in a `div`
- Add a `label` for each field
- Each `label` must have a `for` attribute pointing to the `id` of its input element
- Use the property name as the `id` (e.g., `id="Title"`, `id="Released"`, ...)
- Use `required` for fields (recommended: all fields)

#### Special case: `imdbID`
The `imdbID` is not editable. Use an `input` with `type="hidden"` and `id="imdbID"`. Since it is hidden, you do not need a `div` or a label, but make sure the `id` exists.

#### `select` element for genres
Add a `<select id="Genres" multiple required>` element. It should include the following 24 genres as `<option>` elements:

`Action`, `Adventure`, `Animation`, `Biography`, `Comedy`, `Crime`, `Documentary`, `Drama`, `Family`, `Fantasy`, `Film Noir`, `History`, `Horror`, `Music`, `Musical`, `Mystery`, `Romance`, `Sci-Fi`, `Short Film`, `Sport`, `Superhero`, `Thriller`, `War`, `Western`

Example:

```html
<select id="Genres" multiple required>
  <option value="Action">Action</option>
  <option value="Adventure">Adventure</option>
  <option value="Animation">Animation</option>
  ...
</select>
```

Wrap the select element in a `div` and add a label, the same as with inputs.

#### `textarea` for plot
Add a `<textarea id="Plot" rows="5" required></textarea>` (also wrapped in a `div` with a label).

#### Buttons
At the end of the form, add two buttons:
- **Save**: calls the JavaScript function `putMovie()` via `onclick`. Be sure to set `type="button"` (otherwise it behaves like a submit button).
- **Cancel**: navigates back to `index.html` (as in 2.2)

Finally: include `edit.js` in `edit.html`, so the movie data is loaded and inserted into the form.

**Verify your implementation:** click *Edit* for a movie. The form should appear and be filled with the movie data.

### 2.4 Include the provided stylesheet

Reference the given `edit.css` file in `edit.html`.

**Verify your implementation:** reload `edit.html` and check that the form styling is applied.

---

## Task 3: Store the modified movie data on the server

In this task you implement saving.

There are two cases:
- You `PUT` a modified movie with an `imdbID` that already exists → update
- You `PUT` a new movie with an `imdbID` that does not exist yet → creation

Both cases are handled by one endpoint: `PUT /movies/:imdbID`.

### 3.1 Update an existing movie (`server.js`)

In `server.js`, implement `PUT /movies/:imdbID`.

If the `imdbID` already exists in the server-side model:
- replace the existing movie data with the received movie data
- respond with status code **200** (using `res.sendStatus(...)`)

**Verify your implementation:** edit an existing movie, save it, go back to the overview, and confirm the change is visible.

### 3.2 Create a new movie (`server.js`)

If the `imdbID` does not exist:
- add the received movie to your server-side model
- respond with status code **201** and send back the movie object you stored

**Verify your implementation (optional but recommended):** try sending a new movie via DevTools / REST client / code and check it appears in `GET /movies`.

### 3.3 Trigger the PUT request from the client (`edit.js`)

In `edit.js`, complete the function `putMovie()` so that it sends the movie data from the form to:

- `PUT /movies/:imdbID`

Some code is already there, but you will need to find the missing pieces and decide how you want to handle the result (for example, navigating back to the overview after saving).

**Verify your implementation:** edit a movie, click *Save*, and confirm the changes are reflected when you return to the overview.

---

**Congratulations on finishing the second exercise!** Make sure to test your application thoroughly and be ready to present your work in the next meeting.
