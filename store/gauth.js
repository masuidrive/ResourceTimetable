import { calendar } from '../externals/calendar';

const initialState = {
  gauth: 'initializing'
}

export const actionTypes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHORIZING: 'AUTHORIZING',
  AUTHORIZED: 'AUTHORIZED',
  AUTHORIZE_ERROR: 'AUTHORIZE_ERROR'
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTHORIZED:
      return Object.assign({}, state, { gauth: 'authorized' })
    case actionTypes.AUTHORIZING:
      return Object.assign({}, state, { gauth: 'authorizing' })
      case actionTypes.UNAUTHORIZED:
      return Object.assign({}, state, { gauth: 'unauthorized' })
    case actionTypes.AUTHORIZE_ERROR:
    return Object.assign({}, state, { gauth: 'authorize_error' })
    default: return state
  }
}

// ACTIONS
export const authorize = () => dispatch => {
  const gapi = window.gapi;
  gapi.auth2.getAuthInstance().signIn().then(undefined, (error) => {
    dispatch(unauthorize())
  })
  dispatch({ type: actionTypes.AUTHORIZING })
}

export const unauthorize = () => dispatch => {
  const gapi = window.gapi;
  gapi.auth2.getAuthInstance().signOut();
  dispatch(unauthorized())
}

export const unauthorized = () => ({ type: actionTypes.UNAUTHORIZED })


const updateAuthState = (isSignedIn) => {
  if(isSignedIn) {
    dispatch(authorized())
  }
  else {
    dispatch(unauthorized())
  }
}

// Initialize GAPI
export const initializeGAuth = () => dispatch => {
  const gapi = window.gapi;


  gapi.load('client:auth2', () => {
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar";

    gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateAuthState)
      updateAuthState(gapi.auth2.getAuthInstance().isSignedIn.get());
    },
    () => {
      console.log("auth error")      
    }
  );
  });
}

export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}