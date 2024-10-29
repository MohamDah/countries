import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  // redirect
} from 'react-router-dom';
import Layout from './components/Layout';
import Main from './components/Main';
import Country from './components/Country';


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route index element={<Main />} />
    <Route path=':country' element={<Country />} />
  </Route>
))

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
