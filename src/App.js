import { useReducer } from 'react'
import { AppContext, initialState, reducer } from './store';
import SectionHandler from './sections/SectionHandler';
import Api from './api'
import SnackbarProvider from 'react-simple-snackbar';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const api = new Api()

function $dispatch (cb) {
  if (!(cb instanceof Function)) return this.dispatch(cb)
  return cb.call(null, this.state, this.dispatch)
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch: $dispatch.bind({state, dispatch}), api }}>
      <SnackbarProvider>
        <SectionHandler />
      </SnackbarProvider>
    </AppContext.Provider>
  );
}

export default App;
