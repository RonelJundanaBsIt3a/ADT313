import * as React from 'react';
//import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './pages/Public/Login/Login';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Register from './pages/Public/Register/Register';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import CastForm from './pages/Main/Movie/Cast-and-Crew/Cast-Form';
import PhotoForm from './pages/Main/Movie/Photos/Photo-Form';
import VideoForm from './pages/Main/Movie/Videos/Video-Form';
import { AuthProvider } from './utils/context/AuthContext';
import Home from './pages/Client/Home/Home';
import Client from './pages/Client/Client';
import Movies from './pages/Main/Movie/Movie';
import Movie from './pages/Client/Movie/Movie';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin/',
    element: <Login />,
  },
  {
    path: '/admin/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/dashboard',
        element: <Dashboard />
      },
      {
        path: '/main/movies',
        element: <Movies />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:id?',
            element: <Form />,
            children: [
              {
                path: '/main/movies/form/:id',
                element: <CastForm />
              },
              {
                path: '/main/movies/form/:id/cast-and-crews/:movieId?',
                element: <CastForm />
              },
              {
                path: '/main/movies/form/:id/photos/:movieId?',
                element: <PhotoForm />
              },
              {
                path: '/main/movies/form/:id/videos/:movieId?',
                element: <VideoForm />
              },
            ]
          },
        ]
      },
      // {
      //   path: '/main/dashboard',
      //   element: <Dashboard />,
      // },
    ],
  },
  {
    path: '/home',
    element: <Client />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/home/movie/:movieId?',
        element: <Movie />
      }
    ]
  },
]);

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
