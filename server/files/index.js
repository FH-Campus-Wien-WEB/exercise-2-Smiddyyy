window.onload = function () {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        const bodyElement = document.querySelector("body");

        if (xhr.status == 200) {
            const movies = JSON.parse(xhr.responseText);

            const mainElement = document.createElement("main");

            const pageTitle = document.createElement("h1");
            pageTitle.id = "page-title";
            pageTitle.textContent = "Movie List";

            const movieCardContainer = document.createElement("div");
            movieCardContainer.id = "movie-card-container";

            mainElement.append(pageTitle);
            mainElement.append(movieCardContainer);


            movies.forEach((movie, movieIndex) => {
                const article = document.createElement("article");
                article.classList.add("movie-card"); // Add a class for styling

                const header = document.createElement("header");

                // Title
                const title = document.createElement("h2");
                title.textContent = movie.title;
                header.append(title);

                // Genres as tags
                const genres = document.createElement("div");
                genres.classList.add("movie-genres");
                movie.genres.forEach(genre => {
                    const genreSpan = document.createElement("span");
                    genreSpan.textContent = genre;
                    genreSpan.classList.add("genre-tag"); // Add a class for styling
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
                plot.classList.add("scrollable-fade");
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

            bodyElement.append(mainElement);
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.textContent =
                "Daten konnten nicht geladen werden, Status " +
                xhr.status +
                " - " +
                xhr.statusText;
            bodyElement.append(errorMessage);
        }
    };

    xhr.open("GET", "/movies");
    xhr.send();
};

function toggleCard(button) {
    const details = button.previousElementSibling;
    const isOpen = details.classList.contains("open");

    details.classList.toggle("open");
    button.textContent = isOpen ? "show details" : "hide details";
};