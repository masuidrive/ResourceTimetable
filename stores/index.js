import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import makeAsyncScriptLoader from "react-async-script";

import { calendar } from '../externals/calendar';



const initialState = {
  resources: undefined,
  resourcesStatus: 'unloaded',

  resourceSettings: JSON.parse(typeof(window) == 'undefined' ? '{}' : window.localStorage["resourceSettings"] || "{}"),
  
  gapiAuth: 'initializing'
}

export const actionTypes = {
  LOADING_EVENTS: 'LOADING_EVENTS',
  SET_EVENTS: 'SET_EVENTS',

  LOADING_RESOURCES: 'LOADING_RESOURCES',
  SET_RESOURCES: 'SET_RESOURCES',
  ERROR_RESOURCES: 'ERROR_RESOURCES',

  CLEAR_RESOURCE_SETTINGS: 'CLEAR_RESOURCE_SETTINGS',
  UPDATE_RESOURCE_NAME: 'UPDATE_RESOURCE_NAME',

  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHORIZING: 'AUTHORIZING',
  AUTHORIZED: 'AUTHORIZED',

  INITIALIZE: 'INITIALIZE',
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_RESOURCES:
      return Object.assign({}, state, { resourcesStatus: 'loadedResources', resources: action.resources })
    case actionTypes.LOADING_RESOURCES:
      return Object.assign({}, state, { resourcesStatus: 'loadingResources' })
    case actionTypes.SET_EVENTS:
      return Object.assign({}, state, { resourcesStatus: 'loadedEvents', resources: action.resources })
    case actionTypes.LOADING_EVENTS:
      return Object.assign({}, state, { resourcesStatus: 'loadingEvents' })
    case actionTypes.UPDATE_RESOURCE_NAME:
      //window.localStorage["resourceSettings"] = JSON.stringify(action.resourceSettings)
      //TODO
      console.log(action.name)
      return state;
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
export const loadResources = () => async dispatch => {
  dispatch({ type: actionTypes.LOADING_RESOURCES })
  const resources = await calendar.loadResources()
  dispatch({ type: actionTypes.SET_RESOURCES, resources: resources })
}

export const loadEvents = () => async dispatch => {
  dispatch({ type: actionTypes.LOADING_EVENTS })
  const resources = await calendar.loadEvents(new Date(2018,3-1,9))
  dispatch({ type: actionTypes.SET_EVENTS, resources: resources })
}

export const loading_events = () => ({ type: actionTypes.LOAD_EVENTS })

export const updateResourceName = (resourceCalendarId, name) => (
  { type: actionTypes.UPDATE_RESOURCE_NAME, resourceCalendarId, name }
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
      dispatch(loadEvents())
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