import React from 'react'
import './CastCards.css'

function CastCards({ cast }) {
    return (
        <>
            <div className='card-cast-data'>
                <img
                    src={
                        cast.url && cast.url !== 'https://image.tmdb.org/t/p/w500/null'
                            ? cast.url
                            : require('./../../utils/images/icon-person.jpg')
                    }
                    alt='image-cast'
                />
                <span className='cast-name-card'>{cast.name}</span>
                <hr className='spacing-cast-card'></hr>
                <span className='cast-characterName-card'>{cast.characterName}</span>
            </div>
        </>
    )
}

export default CastCards