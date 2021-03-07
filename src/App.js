import SectionHandler from './sections/SectionHandler'
import SnackbarProvider from 'react-simple-snackbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <SnackbarProvider>
      <SectionHandler />
    </SnackbarProvider>
  )
}

export default App
