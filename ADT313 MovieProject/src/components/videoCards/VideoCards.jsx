import React from 'react'
import './VideoCards.css'

function VideoCards({ video, onClick }) {
    return (
        <>
            <div className='card-video-data' onClick={onClick}>
                <iframe
                    src={video.url}
                    title='video-movie'
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
                <span className='video-name-card'>{video.name}</span>
            </div>
        </>
    )
}

export default VideoCards