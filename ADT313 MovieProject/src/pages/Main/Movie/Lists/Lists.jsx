import { useNavigate } from 'react-router-dom';
import { useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../../../utils/context/AuthContext';
import axios from 'axios';
import './Lists.css';

const Lists = () => {
    const navigate = useNavigate();
    const { lists } = useContext(AuthContext);
    const { setListDataMovie } = useContext(AuthContext);
    const { auth } = useContext(AuthContext);

    const getMovies = useCallback(() => {
        axios.get('/movies').then((response) => {
            setListDataMovie(response.data);
        });
    }, [setListDataMovie]);

    useEffect(() => {
        getMovies();
    }, [getMovies]);

    const handleDelete = (id) => {
        const isConfirm = window.confirm(
            'Are you sure that you want to delete this data?'
        );
        if (isConfirm) {
            axios
                .delete(`/movies/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                })
                .then(() => {
                    const tempLists = [...lists];
                    const index = lists.findIndex((movie) => movie.id === id);
                    if (index !== undefined || index !== -1) {
                        tempLists.splice(index, 1);
                        setListDataMovie(tempLists);
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <div className="lists-container">
            <div className="top-context">
                <button
                    type="button"
                    className="btn-top btn-primary"
                    onClick={() => {
                        navigate('/main/movies/form');
                    }}
                >
                    Create new
                </button>
            </div>
            <div className="table-container">
                <table className="movie-lists">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lists.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="edit-button"
                                        onClick={() => {
                                            navigate(
                                                '/main/movies/form/' +
                                                movie.id +
                                                '/cast-and-crews/' + movie.tmdbId
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-movie-button"
                                        onClick={() => handleDelete(movie.tmdbId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Lists;