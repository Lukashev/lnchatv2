import { useReducer } from 'react'
import { AppContext, initialState, reducer } from './store';
import SectionHandler from './sections/SectionHandler';
import Api from './api'
import SnackbarProvider from 'react-simple-snackbar';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const api = new Api()

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch, api }}>
      <SnackbarProvider>
        <SectionHandler />
      </SnackbarProvider>
    </AppContext.Provider>
  );
}

export default App;
