import './App.css'
import { SearchProvider } from './components/Header/searchcontent'

function App() {
  return (
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  )
}

export default App

