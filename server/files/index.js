window.onload = function () {
    fetchMovies();
    renderGenreFilters();

    const sidebar = document.getElementById("filter-sidebar");
    const toggleBtn = document.getElementById("menu-toggle");
    const closeBtn = document.getElementById("close-sidebar");
    const body = document.body;


    closeBtn.addEventListener("click", () => {
        body.classList.toggle("sidebar-closed");
        toggleBtn.removeAttribute("hidden");
    });


    toggleBtn.addEventListener("click", () => {
        toggleBtn.setAttribute("hidden", "");
        body.classList.toggle("sidebar-closed");
    });
};

function fetchMovies() {
    const xhr = new XMLHttpRequest()
    xhr.onload = () => renderMovies(xhr);
    xhr.open("GET", `/movies?genre=${activefilters.join(',')}`);
    xhr.send();
    console.log("Fetching movies with filters:", activefilters);
}

function renderMovies(xhrRequest) {
    const movieCardContainer = document.querySelector("main");
    movieCardContainer.innerHTML = "";
    if (xhrRequest.status == 200) {
        const movies = JSON.parse(xhrRequest.responseText);
        movies.forEach((movie, movieIndex) => {
            const article = document.createElement("article");
            article.classList.add("movie-card"); // Add a class for styling

            const header = document.createElement("header");

            // Create a wrapper for title + edit button
            const titleRow = document.createElement("div");
            titleRow.classList.add("title-row");

            // Title
            const title = document.createElement("h2");
            title.textContent = movie.title;
            titleRow.append(title);

            // Edit
            const editButton = document.createElement("button");
            editButton.id = movie.imdbID + "-edit";
            editButton.classList.add("edit-btn");
            editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>`;
            editButton.setAttribute("aria-label", `Edit ${movie.title} movie details`);
            editButton.setAttribute("title", `Edit ${movie.title}`);
            editButton.onclick = function () {
                window.open('edit.html?imdbID=' + movie.imdbID, '_blank', 'width=500,height=800');
            };

            titleRow.append(editButton);
            header.append(titleRow);

            // Genres as tags
            const genres = document.createElement("div");
            genres.classList.add("movie-genres");
            movie.genres.forEach(genre => {
                const genreSpan = document.createElement("span");
                genreSpan.textContent = genre;
                console.log("Rendering genre:", genre, "Active filters:", activefilters);
                genreSpan.classList.add("genre-tag"); // Add a class for styling
                if (activefilters.length > 0 && activefilters.includes(genre)) {
                    genreSpan.classList.add("active-genre");
                } else {
                    genreSpan.classList.add("inactive-genre");
                }
                genres.append(genreSpan);
            });
            header.append(genres);

            article.append(header);

            // Poster image
            const imgwrapper = document.createElement("div");
            imgwrapper.classList.add("img-wrapper");

            const poster = document.createElement("img");
            poster.src = movie.poster;
            poster.alt = "Poster of " + movie.title;
            poster.width = 200;

            imgwrapper.append(poster);
            article.append(imgwrapper);

            // Details as simple text
            const date = new Date(movie.released);
            const formatted_data = `${date.getFullYear()} ${date.toLocaleString("en-US", { month: "short" })
                } ${String(date.getDate()).padStart(2, "0")}`;
            const detailsText = document.createElement("p");
            detailsText.classList.add("meta-data");
            detailsText.innerHTML = `
                    <span class="label">Runtime</span> 
                    <span class="value">${movie.runtime} min</span>
                    <span class="separator">|</span>
                    <span class="label">Released</span> 
                    <span class="value">${formatted_data}</span>
                    `;
            article.append(detailsText);

            const movieDetails = document.createElement("div");
            movieDetails.classList.add("movie-details");
            article.append(movieDetails);

            const expandButton = document.createElement("button");
            expandButton.classList.add("expand-btn");
            expandButton.textContent = "show details";
            expandButton.addEventListener("click", () => toggleCard(expandButton));
            article.append(expandButton);


            // Movie Details:
            // Plot summary
            const plot = document.createElement("p");
            plot.classList.add("movie-plot");
            plot.classList.add("scrollable");
            plot.textContent = movie.plot;

            // Ratings as pills
            const ratingsText = document.createElement("div");
            ratingsText.classList.add("movie-ratings");
            ratingsText.innerHTML = `
                <span class="rating-badge imdb">IMDb ${movie.imdbRating}/10</span>
                <span class="rating-badge metascore">Metascore ${movie.metascore}</span>
                `;

            // credits list
            const creditsPanel = document.createElement("div");
            creditsPanel.classList.add("credits-panel-container")
            const credits = [
                { id: "actors", label: "Actors", items: movie.actors },
                { id: "directors", label: "Directors", items: movie.directors },
                { id: "writers", label: "Writers", items: movie.writers }
            ];
            credits.forEach(contributor => {

                const creditsDiv = document.createElement("div");
                creditsDiv.classList.add("credits-panel");

                const title = document.createElement("h2");
                title.textContent = contributor.label;
                creditsDiv.append(title);

                const list = document.createElement("ul");
                contributor.items.forEach(item => {
                    const listItem = document.createElement("li");
                    listItem.textContent = item;
                    list.append(listItem);
                });
                creditsDiv.append(list);
                creditsPanel.append(creditsDiv);
            });

            // Credits section with tabs
            // Create tablist container
            const tablist = document.createElement("div");
            tablist.classList.add("details-tablist");
            tablist.setAttribute("role", "tablist");
            tablist.setAttribute("aria-label", "Movie Credits");

            // Define tabs with data
            const tabs = [
                { id: "summary", label: "Summary", items: [plot, ratingsText] },
                { id: "credits", label: "Credits", items: [creditsPanel] },
            ];

            // Create all tab buttons
            const panels = [];
            tabs.forEach((tab, index) => {
                const button = document.createElement("button");
                button.id = `tab-${movieIndex}-${tab.id}`;
                button.classList.add("details-tab-button");
                button.setAttribute("role", "tab");
                button.setAttribute("aria-controls", `panel-${movieIndex}-${tab.id}`);
                button.setAttribute("aria-selected", index === 0 ? "true" : "false");
                button.setAttribute("tabindex", index === 0 ? "0" : "-1");
                button.textContent = tab.label;

                tablist.append(button);

                // Create corresponding panel
                const panel = document.createElement("section");
                panel.classList.add("details-section")
                panel.classList.add("scrollable")
                if (tab.id === "credits") {
                    panel.classList.add("scrollable-fade");
                }
                panel.id = `panel-${movieIndex}-${tab.id}`;
                panel.setAttribute("role", "tabpanel");
                panel.setAttribute("aria-labelledby", `tab-${movieIndex}-${tab.id}`);
                if (index !== 0) {
                    panel.setAttribute("hidden", "");
                }

                tab.items.forEach(item => panel.append(item));

                panels.push({ button, panel });
            });

            // Set up click handlers for tab switching
            panels.forEach(({ button, panel }) => {
                button.addEventListener("click", () => {
                    // Deactivate all tabs and panels
                    panels.forEach(({ button: btn, panel: pnl }) => {
                        btn.setAttribute("aria-selected", "false");
                        btn.setAttribute("tabindex", "-1");
                        pnl.setAttribute("hidden", "");
                    });

                    // Activate clicked tab and its panel
                    button.setAttribute("aria-selected", "true");
                    button.setAttribute("tabindex", "0");
                    panel.removeAttribute("hidden");
                });
            });

            movieDetails.append(document.createElement("hr")); // Add a horizontal rule for separation
            movieDetails.append(tablist);
            panels.forEach(({ panel }) => movieDetails.append(panel));

            movieCardContainer.append(article);
        });

    } else {
        const errorMessage = document.createElement("p");
        errorMessage.textContent =
            "Daten konnten nicht geladen werden, Status " +
            xhrRequest.status +
            " - " +
            xhrRequest.statusText;
        movieCardContainer.append(errorMessage);
    }
};

function toggleCard(button) {
    const details = button.previousElementSibling;
    const isOpen = details.classList.contains("open");

    details.classList.toggle("open");
    button.textContent = isOpen ? "show details" : "hide details";
};


const ALL_GENRES = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film Noir",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Short Film",
    "Sport",
    "Superhero",
    "Thriller",
    "War",
    "Western"
]

let activefilters = [];

function renderGenreFilters() {
    const activeFilterContainer = document.getElementById("active-filters");
    const availableFilterContainer = document.getElementById("available-filters");

    activeFilterContainer.innerHTML = "";
    availableFilterContainer.innerHTML = "";

    if (activefilters.length == 0) {
        const allBtn = document.createElement("span");
        allBtn.classList.add("filter-btn", "active-filter");
        allBtn.textContent = "ALL";
        allBtn.addEventListener("click", (e) => e.stopPropagation());
        activeFilterContainer.append(allBtn);
    } else {
        activefilters.forEach(genre => {
            const btn = document.createElement("span");
            btn.classList.add("filter-btn", "active-filter");
            btn.textContent = genre;
            btn.addEventListener("click", (e) => e.stopPropagation());

            const remove = document.createElement("span");
            remove.classList.add("remove-filter");
            remove.textContent = "x";
            btn.append(remove);

            remove.onclick = () => removefilter(genre);

            activeFilterContainer.append(btn);
        });
    }

    ALL_GENRES.filter(genre => !activefilters.includes(genre))
        .forEach(genre => {
            const btn = document.createElement("span");
            btn.classList.add("filter-btn", "available-filter");
            btn.textContent = genre;
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                addFilter(genre);
            });
            availableFilterContainer.append(btn);
        });
}

function removefilter(genre) {
    activefilters = activefilters.filter(g => g !== genre);
    renderGenreFilters();
    fetchMovies();
}

function addFilter(genre) {
    activefilters.push(genre);
    renderGenreFilters();
    fetchMovies();
}