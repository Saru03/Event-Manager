import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import React from 'react';
import Login from './Login';
import Events from './Events';

function App() {
  const router = createBrowserRouter([
    {
      path:'/',
      element:<Login/>
    },
    {
      path:'/events',
      element:<Events/>
    }
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
