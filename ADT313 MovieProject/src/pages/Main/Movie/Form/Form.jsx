import axios from 'axios';
import { useCallback, useEffect, useState, useContext, useRef } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../utils/context/AuthContext';
import './Form.css'


const Form = () => {
    const [query, setQuery] = useState('');
    const [searchedMovieList, setSearchedMovieList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(undefined);
    const [notfound, setNotFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pagebtn, setPageBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Error state for displaying error messages
    const tabset = JSON.parse(localStorage.getItem('tab'));
    const [tab, setTab] = useState(tabset);
    const navigate = useNavigate();
    let { movieId } = useParams();
    let { id } = useParams();
    const { auth } = useContext(AuthContext);
    const selectorRef = useRef();
    //const { movie } = useContext(AuthContext);
    const { setMovieInfo } = useContext(AuthContext);


    useEffect(() => {
        tabselector();
    })

    const tabselector = () => {
        const castTab = document.querySelector('.cast-tab');
        const videoTab = document.querySelector('.video-tab');
        const photoTab = document.querySelector('.photo-tab');

        switch (tab) {
            case 'cast':
                if (castTab) {
                    castTab.style.backgroundColor = 'grey';
                    videoTab.style.backgroundColor = '';
                    photoTab.style.backgroundColor = '';
                }
                break;
            case 'video':
                if (videoTab) {
                    videoTab.style.backgroundColor = 'grey';
                    castTab.style.backgroundColor = '';
                    photoTab.style.backgroundColor = '';
                }
                break;
            case 'photo':
                if (photoTab) {
                    photoTab.style.backgroundColor = 'grey)';
                    videoTab.style.backgroundColor = '';
                    castTab.style.backgroundColor = '';
                }
                break;
            default:
        }
        //this will update the tab select on localStorage
        localStorage.setItem('tab', JSON.stringify(tab));
    }

    const handleSearch = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null); // Reset error state before the search
        try {
            const response = await axios({
                method: 'get',
                url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YWY2YTFjZmUxNDU5NDQzZDc2NTUxNGZmNDE4MmE2NSIsIm5iZiI6MTczMTY0NTE2MS45OTQsInN1YiI6IjY3MzZjZWU5Y2U0OTQxMDAzMmMxZTZmZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7aNAX9k2sedT4XrNrq_yQ--b1HkDPfFXm-2aZ_cyGA',
                },
            });

            if (response.data.results.length === 0) {
                console.log("Not Found");
                setNotFound(true);
                setSearchedMovieList([]);
                setTotalPages(0);
                setPageBtn(false);
            } else {
                setSearchedMovieList(response.data.results);
                setTotalPages(response.data.total_pages);
                setNotFound(false);
                setPageBtn(true);
            }
        } catch (err) {
            setError('Error fetching movies. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
    };

    const handleSave = async () => {
        if (!selectedMovie) {
            alert('Please search and select a movie.');
            return;
        }

        try {
            if (movieId) {
                const data = {
                    tmdbId: selectedMovie.id,
                    title: selectedMovie.title,
                    overview: selectedMovie.overview,
                    popularity: selectedMovie.popularity,
                    releaseDate: selectedMovie.release_date,
                    voteAverage: selectedMovie.vote_average,
                    backdropPath: selectedMovie.backdrop_path,
                    posterPath: selectedMovie.poster_path,
                    isFeatured: selectedMovie.isFeatured,
                };
                await axios({
                    method: 'PATCH',
                    url: `/movies/${movieId}`,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                });
                alert('Update Success');
            } else {
                if (!selectorRef.current.value.trim()) {
                    selectorRef.current.style.border = '2px solid red';
                    setTimeout(() => {
                        selectorRef.current.style.border = '1px solid #ccc';
                    }, 2000);
                    return;
                }
                const data = {
                    tmdbId: selectedMovie.id,
                    title: selectedMovie.title,
                    overview: selectedMovie.overview,
                    popularity: selectedMovie.popularity,
                    releaseDate: selectedMovie.release_date,
                    voteAverage: selectedMovie.vote_average,
                    backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
                    posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
                    isFeatured: selectedMovie.isFeatured,
                };
                await axios({
                    method: 'post',
                    url: '/movies',
                    data: data,
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                });
                alert('Save Success');
            }
            navigate('/main/movies');
        } catch (err) {
            setError('Error saving movie. Please try again later.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (movieId) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`/movies/${movieId}`);
                    setMovieInfo(response.data);
                    setSelectedMovie({
                        id: response.data.tmdbId,
                        tmdbId: response.data.id,
                        title: response.data.title,
                        overview: response.data.overview,
                        popularity: response.data.popularity,
                        backdrop_path: response.data.backdropPath,
                        poster_path: response.data.posterPath,
                        release_date: response.data.releaseDate,
                        vote_average: response.data.voteAverage,
                        isFeatured: response.data.isFeatured,
                    });
                } catch (err) {
                    setError('Error fetching movie details. Please try again later.');
                    console.error(err);
                }
            };

            fetchMovie();
        }
    }, [movieId, setMovieInfo, setSelectedMovie]);

    return (
        <div className="form-box">
            <div className='title-text'>{movieId ? 'Edit ' : ' '} </div>

            {error && <p className="text-center text-danger">{error}</p>} {/* Display error messages */}

            {movieId === undefined && (
                <>
                    <div className="search-containermt-3">
                        <div>
                            <div className="search-with-btn">
                                <input
                                    type="text"
                                    className="search-bar"
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setNotFound(false);
                                        setSearchedMovieList([]);
                                        setSelectedMovie(undefined);
                                        setCurrentPage(1);
                                        setPageBtn(false);
                                    }}
                                    placeholder='Enter Movie Title'
                                />
                                <button
                                    type="button"
                                    className="btn-search btn-primary"
                                    onClick={() => handleSearch(1)}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="searched-movie">
                            {notfound ? (
                                <p className="text-warning">
                                    Movie not found
                                </p>
                            ) : isLoading ? (
                                <p className="text-searching">Searching...</p>
                            ) : (
                                searchedMovieList.map((movie) => (
                                    <p
                                        key={movie.id}
                                        className="list-movie"
                                        onClick={() => handleSelectMovie(movie)}
                                    >
                                        {movie.original_title}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 0 && !notfound && pagebtn && (
                        <div className="page-form">
                            <button
                                className="btn btn-secondary me-2"
                                onClick={() => {
                                    if (currentPage > 1) {
                                        handleSearch(currentPage - 1);
                                        setCurrentPage(currentPage - 1);
                                    }
                                }}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn btn-secondary ms-2"
                                onClick={() => {
                                    if (currentPage < totalPages) {
                                        handleSearch(currentPage + 1);
                                        setCurrentPage(currentPage + 1);
                                    }
                                }}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                    <hr />
                </>
            )}

            <div className="movie-box">
                <div className="image-box">
                    <img
                        className="img-fluid"
                        src={selectedMovie?.poster_path
                            ? `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`
                            : require('./../../../../utils/images/cinematography-symbols-black-background.jpg')}
                        alt={selectedMovie?.title || 'Fallback Cinematography Symbol'}
                        style={{ maxHeight: "500px", maxWidth: "318px" }}
                    />
                </div>

                <div>
                    <form className="movie-details-box">
                        <label>Title</label>
                        <input
                            type="text"
                            value={selectedMovie ? selectedMovie.title : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, title: e.target.value })}
                            disabled={movieId === undefined}
                        />

                        <label>Overview</label>
                        <textarea
                            rows={5}
                            value={selectedMovie ? selectedMovie.overview : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, overview: e.target.value })}
                            disabled={movieId === undefined}
                        />

                        <label>Popularity</label>
                        <input
                            type="number"
                            value={selectedMovie ? selectedMovie.popularity : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, popularity: e.target.value })}
                            step={0.1}
                            disabled={movieId === undefined}
                        />

                        <label>Release Date</label>
                        <input
                            type="date"
                            value={selectedMovie ? selectedMovie.release_date : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, release_date: e.target.value })}
                            disabled={movieId === undefined}
                        />

                        <label>Vote Average</label>
                        <input
                            type="number"
                            value={selectedMovie ? selectedMovie.vote_average : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, vote_average: e.target.value })}
                            step={0.1}
                            disabled={movieId === undefined}
                        />
                        <label>Is Featured</label>
                        <select
                            className="seletor-feature"
                            value={selectedMovie && typeof selectedMovie.isFeatured === "boolean"
                                ? (selectedMovie.isFeatured ? "Yes" : "No")
                                : ""}
                            onChange={(e) =>
                                setSelectedMovie({
                                    ...selectedMovie,
                                    isFeatured: e.target.value === "Yes"
                                })
                            }
                            ref={selectorRef}
                        >
                            <option value="" disabled>
                                Select an option
                            </option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <div className='button-box'>
                            <button
                                type="button"
                                className="btn btn-save"
                                onClick={handleSave}
                                disabled={!selectedMovie}
                            >
                                {movieId ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {movieId !== undefined && selectedMovie && (
                <div>
                    <hr />
                    <nav>
                        <ul className='tabs'>
                            <li
                                className='cast-tab'
                                onClick={() => {
                                    setTab('cast')
                                    navigate(`/main/movies/form/${id}/cast-and-crews/${movieId}`);
                                }}
                                onChange={tabselector}
                            >
                                Cast & Crews
                            </li>
                            <li
                                className='video-tab'
                                onClick={() => {
                                    setTab('video')
                                    navigate(`/main/movies/form/${id}/videos/${movieId}`);
                                }}
                                onChange={tabselector}
                            >
                                Videos
                            </li>
                            <li
                                className='photo-tab'
                                onClick={() => {
                                    setTab('photo')
                                    navigate(`/main/movies/form/${id}/photos/${movieId}`);
                                }}
                                onChange={tabselector}
                            >
                                Photos
                            </li>
                        </ul>
                    </nav>
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default Form;
