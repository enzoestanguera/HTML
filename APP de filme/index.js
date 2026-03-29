const movieNameRef = document.getElementById("movie-name");
const searchBtn = document.getElementById("search-btn");
const result = document.getElementById("result");

// 🔑 coloque sua API aqui
const API_KEY = "7f9a3b82";

const getMovie = async () => {
    const movieName = movieNameRef.value.trim();

    // validação
    if (!movieName) {
        result.innerHTML = `<h3 class="msg">Digite o nome de um filme 🎬</h3>`;
        return;
    }

    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${API_KEY}`;

    // loading
    result.innerHTML = `<h3 class="msg">Buscando filme...</h3>`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
            result.innerHTML = `
                <div class="info">
                    <img src="${data.Poster !== "N/A" ? data.Poster : "no-image.png"}" class="poster">

                    <div>
                        <h2>${data.Title}</h2>

                        <div class="rating">
                            ⭐ <h4>${data.imdbRating}</h4>
                        </div>

                        <div class="details">
                            <span>${data.Rated}</span>
                            <span>${data.Year}</span>
                            <span>${data.Runtime}</span>
                        </div>

                        <div class="genre">
                            ${data.Genre.split(",")
                                .map(g => `<div>${g.trim()}</div>`)
                                .join("")}
                        </div>
                    </div>
                </div>

                <h3>Sinopse:</h3>
                <p>${data.Plot}</p>

                <h3>Elenco:</h3>
                <p>${data.Actors}</p>
            `;
        } else {
            result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
        }

    } catch (error) {
        result.innerHTML = `<h3 class="msg">Erro ao buscar filme 🚫</h3>`;
        console.error(error);
    }
};

// clique no botão
searchBtn.addEventListener("click", getMovie);

// ENTER no input
movieNameRef.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getMovie();
    }
});

// evita rodar vazio ao carregar
window.addEventListener("load", () => {
    result.innerHTML = `<h3 class="msg"></h3>`;
});