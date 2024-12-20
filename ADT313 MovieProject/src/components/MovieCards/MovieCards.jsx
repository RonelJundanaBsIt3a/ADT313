import React from 'react'
import './MovieCards.css'

function MovieCards({ movie, onClick }) {
  return (
    <>
      <div className='card-movie' onClick={onClick}>
        <img src={movie.posterPath} alt='image-movie' />
        <span>{movie.title}</span>
      </div>
    </>
  )
}

export default MovieCards;