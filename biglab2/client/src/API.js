const dayjs = require("dayjs");
const fixedURL = new URL("http://localhost:3001/api/");

async function getAllFilm() {
  // call: GET /api/films
  const response = await fetch(new URL("films", fixedURL), {
    credentials: "include",
  });
  const filmJson = await response.json();
  if (response.ok) {
    return filmJson.map((fi) => ({
      id: fi.id,
      title: fi.title,
      favorite: fi.favorite,
      date: fi.watchdate ? dayjs(fi.watchdate) : undefined,
      rating: fi.rating,
      user: fi.user,
    }));
  } else {
    throw filmJson; // an object with the error coming from the server
  }
}

async function getFilteredFilms(filter) {
  //async perchè c'è la await
  // call  /api/exams

  filter = filter.toLowerCase();
  const response = await fetch(fixedURL + `films/filter/${filter}`, {
    credentials: "include",
  }); //dalla fetch esce sempre un oggetto tipo Response, in questo caso lo abbiamo chiamato response
  const filmsJson = await response.json(); // await perchè .json() torna una promise, dobbiamo aspettare che sia processata
  if (response.ok) {
    return filmsJson.map((fi) => ({
      id: fi.id,
      title: fi.title,
      favorite: fi.favorite,
      date: fi.watchdate ? dayjs(fi.watchdate) : undefined,
      rating: fi.rating,
      user: fi.user,
    }));
  } else {
    throw filmsJson; // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}

function deleteFilm(id) {
  // call: DELETE /api/exams/:coursecode
  return new Promise((resolve, reject) => {
    fetch(new URL("films/" + id, fixedURL), {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

function addFilm(film) {
  // call: POST /api/exams
  return new Promise((resolve, reject) => {
    fetch(new URL("add", fixedURL), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: film.id,
        title: film.title,
        favorite: film.favorite,
        watchdate: film.date ? film.date.format("YYYY-MM-DD") : undefined,
        rating: film.rating,
        user: film.user,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

function updateFilm(film) {
  // call: PUT /api/edit/:filmId
  return new Promise((resolve, reject) => {
    fetch(new URL("films/" + film.id, fixedURL), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: film.id,
        title: film.title,
        favorite: film.favorite,
        date: film.date ? film.date.format("YYYY-MM-DD") : undefined,
        rating: film.rating,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

function updateFilm_favorite(filmID, favorite) {
  // call: PUT /api/films/:id/:favorite
  return new Promise((resolve, reject) => {
    favorite = favorite ? 0 : 1;
    fetch(new URL("films/" + filmID + "/" + favorite, fixedURL), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

function updateFilm_rating(filmID, rating) {
  // call: PUT /api/films/:id/rating/:rating
  return new Promise((resolve, reject) => {
    fetch(new URL("films/" + filmID + "/rating/" + rating, fixedURL), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: filmID,
        rating: rating,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

async function logIn(credentials) {
  let response = await fetch(new URL("sessions", fixedURL), {
    method: "POST",
    credentials: "include", //lo mettiamo ovunque (per cors)
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(new URL("sessions/current", fixedURL), {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(new URL("sessions/current", fixedURL), {
    credentials: "include",
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

const API = {
  getFilteredFilms,
  deleteFilm,
  addFilm,
  updateFilm,
  updateFilm_rating,
  updateFilm_favorite,
  logIn,
  logOut,
  getUserInfo,
  getAllFilm,
};
export default API;
