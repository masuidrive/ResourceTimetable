import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import makeAsyncScriptLoader from "react-async-script";

import { calendar } from './externals/calendar';



const initialState = {
  resources: undefined,
  resourceSettings: JSON.parse(typeof(window) == 'undefined' ? '{}' : window.localStorage["resourceSettings"] || "{}"),
  resourcesStatus: 'unloaded',
  gapiAuth: 'initializing'
}

export const actionTypes = {
  LOADING_RESOURCES: 'LOADING_RESOURCES',
  LOAD_RESOURCES: 'LOAD_RESOURCES',

  CLEAR_RESOURCE_SETTINGS: 'CLEAR_RESOURCE_SETTINGS',
  SAVE_RESOURCE_SETTINGS: 'SAVE_RESOURCE_SETTINGS',

  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHORIZING: 'AUTHORIZING',
  AUTHORIZED: 'AUTHORIZED',

  INITIALIZE: 'INITIALIZE',
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_RESOURCES:
      return Object.assign({}, state, { resourcesStatus: 'loaded', resources: action.resources })
    case actionTypes.LOADING_RESOURCES:
      return Object.assign({}, state, { resourcesStatus: 'loading', resources: undefined })
      case actionTypes.SAVE_RESOURCE_SETTINGS:
      window.localStorage["resourceSettings"] = JSON.stringify(action.resourceSettings)
      return Object.assign({}, state, { resourceSettings: action.resourceSettings })
    case actionTypes.CLEAR_RESOURCE_SETTINGS:
      window.localStorage.removeItem("resourceSettings")
      return Object.assign({}, state, { resourceSettings: {} })
    case actionTypes.AUTHORIZED:
      return Object.assign({}, state, { gapiAuth: 'authorized', resourcesStatus: 'unloaded', resources: undefined })
    case actionTypes.AUTHORIZING:
      return Object.assign({}, state, { gapiAuth: 'authorizing', resourcesStatus: 'unloaded', resources: undefined })
    case actionTypes.UNAUTHORIZED:
      return Object.assign({}, state, { gapiAuth: 'unauthorized', resourcesStatus: 'unloaded', resources: undefined })
    default: return state
  }
}

// ACTIONS
export const loadResources = () => dispatch => {
  dispatch({ type: actionTypes.LOADING_RESOURCES })
  calendar.resourceEvents(new Date()).then((resources) => {
    dispatch({ type: actionTypes.LOAD_RESOURCES, resources: resources })
  })
}

export const loading_resources = () => ({ type: actionTypes.LOAD_RESOURCES })

export const saveResourceSettings = (resourceSettings) => (
  { type: actionTypes.SAVE_RESOURCE_SETTINGS, resourceSettings: resourceSettings }
)

export const clearResourceSettings = () => ({ type: actionTypes.CLEAR_RESOURCE_SETTINGS })

export const authorize = () => dispatch => {
  const gapi = window.gapi;
  gapi.auth2.getAuthInstance().signIn().then(undefined, (error) => {
    dispatch(unauthorize())
  });
  dispatch({ type: actionTypes.AUTHORIZING })
}

export const authorized = () => ({ type: actionTypes.AUTHORIZED })

export const unauthorize = () => dispatch => {
  const gapi = window.gapi;
  gapi.auth2.getAuthInstance().signOut();
  dispatch(unauthorized())
}

export const unauthorized = () => ({ type: actionTypes.UNAUTHORIZED })


// Initialize GAPI
export const initialize = () => dispatch => {
  const gapi = window.gapi;

  const updateAuthState = (isSignedIn) => {
    if(isSignedIn) {
      dispatch(authorized())
      dispatch(loadResources())
    }
    else {
      dispatch(unauthorized())
    }
  }

  gapi.load('client:auth2', () => {
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar";

    gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(() => {
      console.log("auth succ")
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