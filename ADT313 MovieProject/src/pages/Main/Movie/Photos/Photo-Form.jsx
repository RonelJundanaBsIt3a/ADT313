import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { AuthContext } from '../../../../utils/context/AuthContext'
import './Photo-Form.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useParams } from 'react-router-dom';

function PhotoForm() {
  const { auth } = useContext(AuthContext);
  const [photoid, setPhotoId] = useState(undefined);
  const urlRef = useRef();
  const descriptionRef = useRef();
  const [photos, setPhotos] = useState([]);
  const [selectedphoto, setSelectedPhoto] = useState({});
  let { movieId } = useParams();

  const getAll = useCallback((movieId) => {
    axios({
      method: 'get',
      url: `/movies/${movieId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        setPhotos(response.data.photos);
      })
      .catch((error) => {
        console.error("Error fetching Photos:", error.response.data);
      });
  }, [auth.accessToken])

  useEffect(() => {
    getAll(movieId);
  }, [movieId, getAll]);

  //This used for Importing Photos based on tmdbId from Movie
  function importDataPhoto() {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/movie/${movieId}/images`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YWY2YTFjZmUxNDU5NDQzZDc2NTUxNGZmNDE4MmE2NSIsIm5iZiI6MTczMTY0NTE2MS45OTQsInN1YiI6IjY3MzZjZWU5Y2U0OTQxMDAzMmMxZTZmZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I7aNAX9k2sedT4XrNrq_yQ--b1HkDPfFXm-2aZ_cyGA',
      },
    }).then((response) => {
      setSavePhotosImp(response.data.backdrops);
      alert(`Total of ${response.data.backdrops.length} Photos are now Imported to Database`);
      setTimeout(() => {
        getAll(movieId);
      }, 2000);
    })
  }

  //Saving all Photo Imported to Database
  async function setSavePhotosImp(photoImportData) {
    await Promise.all(photoImportData.map(async (datainfo) => {
      const dataphoto = {
        userId: auth.user.userId,
        movieId: movieId,
        description: `Imported from TMDB Data`,
        url: `https://image.tmdb.org/t/p/w500/${datainfo.file_path}`,
      };
      console.log('Transfering import to Database', dataphoto);
      try {
        await axios.post('/admin/photos', dataphoto, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Error of Importing:', error);
      }
    }));
    console.log('Imported Success');
  }

  const validateField = (fieldRef, fieldName) => {
    if (!fieldRef.current.value.trim()) {
      fieldRef.current.style.border = '2px solid red';
      setTimeout(() => {
        fieldRef.current.style.border = '1px solid #ccc';
      }, 2000);
      console.log(`${fieldName} cannot be empty.`)
      return false;
    }
    return true;
  }

  const handlesave = async () => {

    const validateFields = () => {
      const isUrlValid = validateField(urlRef, "URL");
      const isDescriptionValid = validateField(descriptionRef, "Description");

      return isUrlValid && isDescriptionValid;
    };

    if (!validateFields()) {
      return; // This is for stop if any valid is null
    } else {
      try {
        const dataphoto = {
          userId: auth.user.userId,
          movieId: movieId,
          url: selectedphoto.url,
          description: selectedphoto.description,
        }
        await axios({
          method: 'POST',
          url: '/admin/photos',
          data: dataphoto,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          }
        });
        alert('Added Success');
        setSelectedPhoto([])
        getAll(movieId);
      } catch (error) {
        console.log("Error Saving Photo", error.response?.data || error.message);
      }
    }
  }

  const handledelete = (id) => {
    const isConfirm = window.confirm("Are you Sure to Delete this Photo?");

    if (isConfirm) {
      axios({
        method: 'delete',
        url: `/photos/${id}`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      }).then(() => {
        alert("Delete Success");
        getAll(movieId);
        console.log("Database Updated");
      }).catch((err) => {
        console.log("err");
      });
    }
  };

  const handleclear = useCallback(() => {
    setSelectedPhoto([]);
    setPhotoId(undefined);
  }, [setSelectedPhoto, setPhotoId]);

  const photofetch = async (id) => {
    axios({
      method: 'get',
      url: `/photos/${id}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        setSelectedPhoto(response.data);
        setPhotoId(response.data.id)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const photoUpdate = async (id) => {
    const validateFields = () => {
      const isUrlValid = validateField(urlRef, "URL");
      const isDescriptionValid = validateField(descriptionRef, "Description");

      return isUrlValid && isDescriptionValid;
    };

    if (!validateFields()) {
      return; // This is for stop if any valid is null
    } else {
      const isConfirm = window.confirm("Are you sure you want to update the Photo?");
      if (isConfirm) {
        const dataphoto = {
          userId: auth.user.userId,
          movieId: selectedphoto.movieId,
          description: selectedphoto.description,
          url: selectedphoto.url,
        };

        console.table(dataphoto);
        try {
          const response = await axios({
            method: 'patch',
            url: `/photos/${id}`,
            data: dataphoto,
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          console.log(response.data);
          alert('Updated Successfully')
          handleclear();
          getAll(movieId)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  return (
    <div className='photo-box'>
      <div className='Photo-View-Box'>
        {photos !== undefined && photos.length > 0 ? (
          <div className='card-display-photo'>
            {photos.map((image) => (
              <div key={image.id} className='card-photo'>
                <div className='buttons-group'>
                  <button
                    type='button'
                    className='delete-button'
                    onClick={() => handledelete(image.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button
                    type='button'
                    className='edit-button'
                    onClick={() => photofetch(image.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
                <img src={image.url} alt={image.description} style={{ width: '100%' }} className='image-style' />
                <div className='container-photo'>
                  <p>{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='no-photo'>
            <h3>Photos not Found</h3>
          </div>
        )}
      </div>
      <div className='Photo-Search-Box'>
        <div className='parent-container'>
          <div className='photo-detail-box'>
            <div className='photo-container-center'>
              <div className='photo-image-container'>
                <img
                  alt='photo-movies'
                  src={selectedphoto.url
                    ? selectedphoto.url
                    : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                  }
                  className='photo-img'
                />
              </div>
            </div>
          </div>
          <div className='photo-info-text'>
            <div className='input-group'>
              <label className='label-photo'>
                Url Image:
              </label>
              <input
                className='photo-url'
                value={selectedphoto.url || ''}
                onChange={(e) => setSelectedPhoto({ ...selectedphoto, url: e.target.value })}
                ref={urlRef}
              />
            </div>
            <div className='input-group'>
              <label className='label-photo'>
                Description:
              </label>
              <textarea
                className='photo-description'
                value={selectedphoto.description || ''}
                onChange={(e) => setSelectedPhoto({ ...selectedphoto, description: e.target.value })}
                ref={descriptionRef}
              />
            </div>
          </div>
          <div className='save-edit-back-btn'>
            {!photoid ? (
              <>
                <button className='edit-save-btn'
                  type='button'
                  onClick={handlesave}
                >
                  Save
                </button>
                <div className='Import-Btn'>
                  <button
                    className='photo-btn-importer'
                    type='button'
                    onClick={importDataPhoto}
                  >
                    Import All Photos
                  </button>
                </div>
              </>
            ) : (
              <>
                <button className='edit-save-btn'
                  type='button'
                  onClick={() => photoUpdate(photoid)}
                >
                  Update
                </button>
              </>
            )}


            <button className='clear-btn'
              type='button'
              onClick={handleclear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoForm