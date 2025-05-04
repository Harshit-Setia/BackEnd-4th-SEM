import React from 'react'
import Layout from './Layout'
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom'
import { Home, EventList,EventDetails, Login, Signup, EventAddUpdate, User } from './Components'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home />}/> //done
      <Route path='login' element={<Login/>}/>  //done
      <Route path='signup' element={<Signup/>}/>  //done
      <Route path='events/' element={<EventList/>}/>  //done
      <Route path='events/add' element={<EventAddUpdate/>}/>  //done
      <Route path='events/:id' element={<EventDetails/>}/>  //done
      <Route path='events/:id/edit' element={<EventAddUpdate/>}/>  //done
      <Route path='user' element={<User/>}/> //pending
      {/* <Route path='user/edit' element={<Home/>}/> //pending
      <Route path='user/events' element={<Home/>}/> //pending */}
    </Route>
  )
)
function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App