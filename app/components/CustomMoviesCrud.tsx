"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import {
  posterOptions,
  type ManagedMovie,
  type MovieDraft,
} from "../data/managedMovies";

type CustomMoviesCrudProps = {
  movies: ManagedMovie[];
  onCreate: (movie: MovieDraft) => void;
  onUpdate: (id: string, movie: MovieDraft) => void;
  onDelete: (id: string) => void;
};

type MovieFormValues = {
  title: string;
  genre: string;
  rating: string;
  year: string;
  poster: string;
};

type FormErrors = Partial<Record<keyof MovieFormValues, string>>;

const currentYear = new Date().getFullYear();
const emptyForm: MovieFormValues = {
  title: "",
  genre: "",
  rating: "",
  year: String(currentYear),
  poster: posterOptions[0].value,
};

function validateForm(values: MovieFormValues) {
  const errors: FormErrors = {};
  const rating = Number(values.rating);
  const year = Number(values.year);

  if (values.title.trim().length < 2) errors.title = "Judul minimal 2 karakter.";
  if (values.genre.trim().length < 3) errors.genre = "Genre minimal 3 karakter.";
  if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
    errors.rating = "Rating harus berada di antara 0–10.";
  }
  if (!Number.isInteger(year) || year < 1900 || year > currentYear + 1) {
    errors.year = `Tahun harus berada di antara 1900–${currentYear + 1}.`;
  }
  if (!values.poster) errors.poster = "Pilih poster film.";

  return errors;
}

function toDraft(values: MovieFormValues): MovieDraft {
  return {
    title: values.title.trim(),
    genre: values.genre.trim(),
    rating: Number(values.rating),
    year: Number(values.year),
    poster: values.poster,
  };
}

type MovieFormProps = {
  values: MovieFormValues;
  errors: FormErrors;
  editing: boolean;
  onChange: (field: keyof MovieFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

function MovieForm({
  values,
  errors,
  editing,
  onChange,
  onSubmit,
  onCancel,
}: MovieFormProps) {
  return (
    <form className="movie-crud-form" onSubmit={onSubmit} noValidate>
      <div className="movie-crud-form__heading">
        <span className="movie-crud-form__icon" aria-hidden="true">
          {editing ? "✎" : "+"}
        </span>
        <div>
          <p>{editing ? "Mode pembaruan" : "Buat data baru"}</p>
          <h3>{editing ? "Edit film" : "Tambah film"}</h3>
        </div>
      </div>

      <div className="movie-crud-field movie-crud-field--wide">
        <label htmlFor="managed-title">Judul film</label>
        <input
          id="managed-title"
          value={values.title}
          onChange={(event) => onChange("title", event.target.value)}
          placeholder="Contoh: Spider-Man"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "managed-title-error" : undefined}
        />
        {errors.title && <small id="managed-title-error">{errors.title}</small>}
      </div>

      <div className="movie-crud-form__row">
        <div className="movie-crud-field">
          <label htmlFor="managed-genre">Genre</label>
          <input
            id="managed-genre"
            value={values.genre}
            onChange={(event) => onChange("genre", event.target.value)}
            placeholder="Aksi"
            aria-invalid={Boolean(errors.genre)}
            aria-describedby={errors.genre ? "managed-genre-error" : undefined}
          />
          {errors.genre && <small id="managed-genre-error">{errors.genre}</small>}
        </div>

        <div className="movie-crud-field">
          <label htmlFor="managed-year">Tahun</label>
          <input
            id="managed-year"
            type="number"
            min="1900"
            max={currentYear + 1}
            value={values.year}
            onChange={(event) => onChange("year", event.target.value)}
            aria-invalid={Boolean(errors.year)}
            aria-describedby={errors.year ? "managed-year-error" : undefined}
          />
          {errors.year && <small id="managed-year-error">{errors.year}</small>}
        </div>
      </div>

      <div className="movie-crud-field">
          <label htmlFor="managed-rating">Rating</label>
          <div className="movie-crud-rating-input">
            <span aria-hidden="true">★</span>
            <input
              id="managed-rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={values.rating}
              onChange={(event) => onChange("rating", event.target.value)}
              placeholder="8.5"
              aria-invalid={Boolean(errors.rating)}
              aria-describedby={errors.rating ? "managed-rating-error" : undefined}
            />
          </div>
          {errors.rating && <small id="managed-rating-error">{errors.rating}</small>}
      </div>

      <fieldset
        className="movie-crud-poster-picker"
        aria-invalid={Boolean(errors.poster)}
        aria-describedby={errors.poster ? "managed-poster-error" : undefined}
      >
        <legend>Pilih poster film</legend>
        <p>Klik salah satu gambar untuk langsung memasangnya.</p>
        <div className="movie-crud-poster-picker__grid">
          {posterOptions.map((poster) => {
            const selected = values.poster === poster.value;
            return (
              <button
                key={poster.value}
                type="button"
                className={selected ? "is-selected" : ""}
                onClick={() => onChange("poster", poster.value)}
                aria-label={`Gunakan poster ${poster.label}`}
                aria-pressed={selected}
              >
                <Image
                  src={poster.value}
                  alt={`Poster ${poster.label}`}
                  width={112}
                  height={168}
                  unoptimized
                />
                <span className="movie-crud-poster-picker__check" aria-hidden="true">✓</span>
                <span className="movie-crud-poster-picker__label">{poster.label}</span>
              </button>
            );
          })}
        </div>
        {errors.poster && <small id="managed-poster-error">{errors.poster}</small>}
      </fieldset>

      <div className="movie-crud-form__preview" aria-label="Pratinjau poster terpilih">
        <Image src={values.poster} alt="" width={80} height={120} unoptimized />
        <div>
          <span>Pratinjau poster</span>
          <strong>{values.title.trim() || "Judul filmmu"}</strong>
          <small>{values.genre.trim() || "Genre"} · {values.year}</small>
        </div>
      </div>

      <div className="movie-crud-form__actions">
        <button className="movie-crud-button movie-crud-button--primary" type="submit">
          <span aria-hidden="true">{editing ? "✓" : "+"}</span>
          {editing ? "Simpan perubahan" : "Tambah ke koleksi"}
        </button>
        {editing && (
          <button className="movie-crud-button movie-crud-button--ghost" type="button" onClick={onCancel}>
            Batal edit
          </button>
        )}
      </div>
    </form>
  );
}

type MovieCardProps = {
  movie: ManagedMovie;
  confirmingDelete: boolean;
  onEdit: () => void;
  onAskDelete: () => void;
  onDelete: () => void;
};

function MovieCard({
  movie,
  confirmingDelete,
  onEdit,
  onAskDelete,
  onDelete,
}: MovieCardProps) {
  return (
    <article className="managed-movie-card">
      <div className="managed-movie-card__poster">
        <Image
          src={movie.poster}
          alt={`Poster ${movie.title}`}
          width={280}
          height={420}
          unoptimized
        />
        <span className="managed-movie-card__rating">★ {movie.rating.toFixed(1)}</span>
        <div className="managed-movie-card__actions">
          <button type="button" onClick={onEdit} aria-label={`Edit ${movie.title}`}>
            <span aria-hidden="true">✎</span> Edit
          </button>
          <button
            type="button"
            className={confirmingDelete ? "is-confirming" : ""}
            onClick={confirmingDelete ? onDelete : onAskDelete}
            aria-label={confirmingDelete ? `Konfirmasi hapus ${movie.title}` : `Hapus ${movie.title}`}
          >
            <span aria-hidden="true">{confirmingDelete ? "!" : "×"}</span>
            {confirmingDelete ? "Yakin?" : "Hapus"}
          </button>
        </div>
      </div>
      <div className="managed-movie-card__body">
        <h3>{movie.title}</h3>
        <p><span>{movie.genre}</span><i aria-hidden="true" />{movie.year}</p>
      </div>
    </article>
  );
}

export function CustomMoviesCrud({
  movies,
  onCreate,
  onUpdate,
  onDelete,
}: CustomMoviesCrudProps) {
  const [formValues, setFormValues] = useState<MovieFormValues>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("Semua");
  const [notice, setNotice] = useState("Data siap dikelola.");

  const genres = useMemo(
    () => ["Semua", ...Array.from(new Set(movies.map((movie) => movie.genre))).sort()],
    [movies],
  );

  const visibleMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return movies.filter((movie) => {
      const matchesGenre = genreFilter === "Semua" || movie.genre === genreFilter;
      const matchesQuery =
        !normalizedQuery ||
        movie.title.toLowerCase().includes(normalizedQuery) ||
        movie.genre.toLowerCase().includes(normalizedQuery);
      return matchesGenre && matchesQuery;
    });
  }, [genreFilter, movies, query]);

  const averageRating = movies.length
    ? (movies.reduce((total, movie) => total + movie.rating, 0) / movies.length).toFixed(1)
    : "0.0";

  function resetForm() {
    setFormValues(emptyForm);
    setFormErrors({});
    setEditingId(null);
  }

  function changeField(field: keyof MovieFormValues, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitMovie(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateForm(formValues);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setNotice("Periksa kembali data film yang ditandai.");
      return;
    }

    const movie = toDraft(formValues);
    if (editingId) {
      onUpdate(editingId, movie);
      setNotice(`${movie.title} berhasil diperbarui.`);
    } else {
      onCreate(movie);
      setNotice(`${movie.title} berhasil ditambahkan.`);
    }
    resetForm();
    setDeleteId(null);
  }

  function startEditing(movie: ManagedMovie) {
    setEditingId(movie.id);
    setDeleteId(null);
    setFormErrors({});
    setFormValues({
      title: movie.title,
      genre: movie.genre,
      rating: String(movie.rating),
      year: String(movie.year),
      poster: movie.poster,
    });
    setNotice(`Sedang mengedit ${movie.title}.`);
    document.getElementById("koleksi-saya")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function deleteMovie(movie: ManagedMovie) {
    onDelete(movie.id);
    if (editingId === movie.id) resetForm();
    setDeleteId(null);
    setNotice(`${movie.title} berhasil dihapus.`);
  }

  return (
    <section className="movie-crud" id="koleksi-saya" aria-labelledby="movie-crud-title">
      <div className="movie-crud__header">
        <div>
          <span className="movie-crud__eyebrow">CRUD INTERAKTIF</span>
          <h2 id="movie-crud-title">Kelola Koleksi Film</h2>
          <p>Tambah, lihat, ubah, dan hapus film favoritmu langsung dari beranda.</p>
        </div>
        <div className="movie-crud__stats" aria-label="Ringkasan koleksi">
          <span><strong>{movies.length}</strong> Film</span>
          <span><strong>{averageRating}</strong> Rata-rata</span>
        </div>
      </div>

      <div className="movie-crud__workspace">
        <MovieForm
          values={formValues}
          errors={formErrors}
          editing={Boolean(editingId)}
          onChange={changeField}
          onSubmit={submitMovie}
          onCancel={() => {
            resetForm();
            setNotice("Pembaruan dibatalkan.");
          }}
        />

        <div className="movie-crud__collection">
          <div className="movie-crud-toolbar">
            <label className="movie-crud-search">
              <span className="sr-only">Cari film</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul atau genre..."
              />
            </label>
            <label className="movie-crud-filter">
              <span className="sr-only">Filter genre</span>
              <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)}>
                {genres.map((genre) => <option key={genre}>{genre}</option>)}
              </select>
            </label>
          </div>

          <p className="movie-crud__notice" role="status" aria-live="polite">{notice}</p>

          {visibleMovies.length ? (
            <div className="managed-movie-grid" aria-label="Daftar koleksi film">
              {visibleMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  confirmingDelete={deleteId === movie.id}
                  onEdit={() => startEditing(movie)}
                  onAskDelete={() => setDeleteId(movie.id)}
                  onDelete={() => deleteMovie(movie)}
                />
              ))}
            </div>
          ) : (
            <div className="movie-crud-empty">
              <span aria-hidden="true">⌕</span>
              <h3>Tidak ada film ditemukan</h3>
              <p>Ubah kata pencarian atau pilih genre lain.</p>
              <button type="button" onClick={() => { setQuery(""); setGenreFilter("Semua"); }}>
                Tampilkan semua
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
