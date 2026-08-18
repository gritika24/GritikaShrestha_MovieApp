import React, { useState } from "react";
import { X } from "lucide-react";
import { styles } from "../styles.js";

const emptyForm = {
  title: "",
  year: "",
  genre: "",
  director: "",
  runtime: "",
  rating: "",
  synopsis: "",
  cast: "",
};

function toFormValues(movie) {
  if (!movie) return emptyForm;
  return {
    title: movie.title,
    year: String(movie.year),
    genre: movie.genre,
    director: movie.director,
    runtime: String(movie.runtime),
    rating: String(movie.rating),
    synopsis: movie.synopsis,
    cast: movie.cast.join(", "),
  };
}

export default function MovieForm({ movie, onSubmit, onCancel }) {
  const isEdit = Boolean(movie);
  const [values, setValues] = useState(toFormValues(movie));
  const [errors, setErrors] = useState({});

  const setField = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = "Enter a title.";
    if (!values.genre.trim()) next.genre = "Enter a genre.";
    const yearNum = Number(values.year);
    if (!values.year || Number.isNaN(yearNum)) next.year = "Enter a valid year.";
    const runtimeNum = Number(values.runtime);
    if (!values.runtime || Number.isNaN(runtimeNum) || runtimeNum <= 0)
      next.runtime = "Enter runtime in minutes.";
    const ratingNum = Number(values.rating);
    if (!values.rating || Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)
      next.rating = "Enter a rating from 0 to 10.";
    if (!values.synopsis.trim()) next.synopsis = "Enter a short synopsis.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }
    onSubmit({
      id: isEdit ? movie.id : undefined,
      title: values.title.trim(),
      year: Number(values.year),
      genre: values.genre.trim(),
      director: values.director.trim() || "Unknown",
      runtime: Number(values.runtime),
      rating: Number(values.rating),
      synopsis: values.synopsis.trim(),
      cast: values.cast
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    });
  };

  return (
    <div style={styles.formOverlay} onClick={onCancel}>
      <div style={styles.formCard} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onCancel} aria-label="Close">
          <X size={18} color="#C9BBA0" />
        </button>
        <h2 style={styles.formTitle}>{isEdit ? "Edit feature" : "Add feature"}</h2>

        <form style={styles.formGrid} onSubmit={handleSubmit} noValidate>
          <div style={styles.formField}>
            <label style={styles.formLabel} htmlFor="title">Title</label>
            <input id="title" style={styles.formInput} value={values.title} onChange={setField("title")} />
            {errors.title && <p style={styles.formError}>{errors.title}</p>}
          </div>

          <div style={styles.formRow2}>
            <div style={styles.formField}>
              <label style={styles.formLabel} htmlFor="year">Year</label>
              <input id="year" style={styles.formInput} value={values.year} onChange={setField("year")} inputMode="numeric" />
              {errors.year && <p style={styles.formError}>{errors.year}</p>}
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel} htmlFor="genre">Genre</label>
              <input id="genre" style={styles.formInput} value={values.genre} onChange={setField("genre")} />
              {errors.genre && <p style={styles.formError}>{errors.genre}</p>}
            </div>
          </div>

          <div style={styles.formRow2}>
            <div style={styles.formField}>
              <label style={styles.formLabel} htmlFor="runtime">Runtime (min)</label>
              <input id="runtime" style={styles.formInput} value={values.runtime} onChange={setField("runtime")} inputMode="numeric" />
              {errors.runtime && <p style={styles.formError}>{errors.runtime}</p>}
            </div>
            <div style={styles.formField}>
              <label style={styles.formLabel} htmlFor="rating">Rating (0-10)</label>
              <input id="rating" style={styles.formInput} value={values.rating} onChange={setField("rating")} inputMode="decimal" />
              {errors.rating && <p style={styles.formError}>{errors.rating}</p>}
            </div>
          </div>

          <div style={styles.formField}>
            <label style={styles.formLabel} htmlFor="director">Director</label>
            <input id="director" style={styles.formInput} value={values.director} onChange={setField("director")} />
          </div>

          <div style={styles.formField}>
            <label style={styles.formLabel} htmlFor="cast">Cast (comma-separated)</label>
            <input id="cast" style={styles.formInput} value={values.cast} onChange={setField("cast")} />
          </div>

          <div style={styles.formField}>
            <label style={styles.formLabel} htmlFor="synopsis">Synopsis</label>
            <textarea id="synopsis" style={styles.formTextarea} value={values.synopsis} onChange={setField("synopsis")} />
            {errors.synopsis && <p style={styles.formError}>{errors.synopsis}</p>}
          </div>

          <div style={styles.formActions}>
            <button type="button" style={styles.formCancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" style={styles.formSubmitBtn}>
              {isEdit ? "Save changes" : "Add to programme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
