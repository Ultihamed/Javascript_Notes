const addMovieModal = document.getElementById("add-modal");
const btn = document.getElementById("add-movie");
const backdrop = document.getElementById("backdrop");
const cancelAddMovieModal = addMovieModal.querySelector(".btn--passive");
const confirmAddMovieButton = cancelAddMovieModal.nextElementSibling;
const userInputs = addMovieModal.querySelectorAll("input");
const entryTextSection = document.getElementById("entry-text");
const deleteMovieModal = document.getElementById("delete-modal");

const movies = [];

const toggleBackdrop = () => {
    backdrop.classList.toggle("visible");
}

const updateUI = () => {
    if (movies.length === 0) {
        entryTextSection.style.display = "block";
    } else {
        entryTextSection.style.display = "none";
    }
};

const closeMovieDeletionModal = () => {
    toggleBackdrop();
    deleteMovieModal.classList.remove("visible");
};

const deleteMovieHandler = movieId => {
    let movieIndex = 0;
    for (const movie of movies) {
        if (movie.id === movieId) {
            break;
        }
        movieIndex++;
    }
    movies.splice(movieIndex, 1);
    const listRoot = document.getElementById("movie-list");
    listRoot.children[movieIndex].remove();
    closeMovieDeletionModal();
    updateUI();
}

const startDeleteMovieHandler = movieId => {
    deleteMovieModal.classList.add("visible");
    toggleBackdrop();
    const cancelDeletionButton = deleteMovieModal.querySelector(".btn--passive");
    let confirmDeletionButton = deleteMovieModal.querySelector(".btn--danger");
    confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));

    cancelDeletionButton.removeEventListener("click", closeMovieDeletionModal);
    cancelDeletionButton.addEventListener("click", closeMovieDeletionModal);
    confirmDeletionButton = deleteMovieModal.querySelector(".btn--danger");
    confirmDeletionButton.addEventListener("click", deleteMovieHandler.bind(null, movieId));
}

const renderNewMovieElement = (id, title, imageUrl, rating) => {
    const newMovieElement = document.createElement("li");
    newMovieElement.className = "movie-element";
    newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
      <h2>${title}</h2>
      <p>${rating}/5 stars</p>
    </div>
    `;
    newMovieElement.addEventListener("click", startDeleteMovieHandler.bind(null, id));
    const listRoot = document.getElementById("movie-list");
    listRoot.appendChild(newMovieElement);
};

const closeMovieModal = () => {
    addMovieModal.classList.remove("visible");
};

const cancelAddMovieHandler = () => {
    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();
};

const showMovieModal = () => {
    addMovieModal.classList.add("visible");
    toggleBackdrop();
}

const clearMovieInput = () => {
    // for (const input of userInputs) {
    //     input.value = "";
    // }
    userInputs.forEach(input => {
        input.value = "";
    })
};

const addMovieHandler = () => {
    const titleValue = userInputs[0].value;
    const imageUrlValue = userInputs[1].value;
    const ratingValue = userInputs[2].value;

    if (titleValue.trim() === "" || imageUrlValue.trim() === "" || ratingValue.trim() === "" || +ratingValue < 1 || +ratingValue > 5) {
        alert("Please enter valid values (rating between 1 and 5).");
        return;
    }

    const newMovie = {
        id: Math.random().toString(),
        title: titleValue,
        image: imageUrlValue,
        rating: ratingValue
    };

    movies.push(newMovie);
    console.log(movies);
    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();
    renderNewMovieElement(newMovie.id, newMovie.title, newMovie.image, newMovie.rating);
    updateUI();
};

const backdropClickHandler = () => {
    closeMovieModal();
    closeMovieDeletionModal();
    clearMovieInput();
};

btn.addEventListener("click", showMovieModal);
backdrop.addEventListener("click", backdropClickHandler);
cancelAddMovieModal.addEventListener("click", cancelAddMovieHandler);
confirmAddMovieButton.addEventListener("click", addMovieHandler);