import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import makeAsyncScriptLoader from "react-async-script"
import { calendar } from '../externals/calendar'
import moment from 'moment-timezone'

const initialState = () => ({
  resources: undefined,
  resourceSettings: [],
  resourcesStatus: 'unloaded',
  gapiAuth: 'initializing',
  shownSettingsModal: false,
  date: new Date(),
})

export const actionTypes = {
  NEXT_DATE: 'NEXT_DATE',
  PREV_DATE: 'PREV_DATE',

  SHOW_SETTINGS_MODAL: 'SHOW_SETTINGS_MODAL',
  HIDE_SETTINGS_MODAL: 'HIDE_SETTINGS_MODAL',

  LOADING_RESOURCES: 'LOADING_RESOURCES',
  LOAD_RESOURCES: 'LOAD_RESOURCES',

  SAVE_RESOURCE_SETTINGS: 'SAVE_RESOURCE_SETTINGS',
  RESET_RESOURCE_SETTINGS: 'RESET_RESOURCE_SETTINGS',

  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHORIZING: 'AUTHORIZING',
  AUTHORIZED: 'AUTHORIZED',

  INITIALIZE: 'INITIALIZE',
}

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEXT_DATE:
      return Object.assign({}, state, { date: moment(state.date).add(1, 'day').toDate() })
    case actionTypes.PREV_DATE:
      return Object.assign({}, state, { date: moment(state.date).subtract(1, 'day').toDate() })
    case actionTypes.SHOW_SETTINGS_MODAL:
      return Object.assign({}, state, { shownSettingsModal: true })
    case actionTypes.HIDE_SETTINGS_MODAL:
      return Object.assign({}, state, { shownSettingsModal: false })
    case actionTypes.LOAD_RESOURCES:
      return Object.assign({}, state, { resourcesStatus: 'loaded', resources: action.resources, resourceSettings: updateSettings(action.resources, state.resourceSettings) })
    case actionTypes.LOADING_RESOURCES:
      return Object.assign({}, state, { resourcesStatus: 'loading', resources: undefined })
    case actionTypes.SAVE_RESOURCE_SETTINGS:
      window.localStorage["resourceSettings"] = JSON.stringify(action.resourceSettings)
      return Object.assign({}, state, { resourceSettings: action.resourceSettings })
    case actionTypes.RESET_RESOURCE_SETTINGS:
      if(state.resources === undefined) {
        return state
      }
      else {
        window.localStorage.removeItem("resourceSettings")
        return Object.assign({}, state, { resourceSettings: updateSettings(state.resources, []) })
      }
    case actionTypes.AUTHORIZED:
      return Object.assign({}, state, { gapiAuth: 'authorized', resourcesStatus: 'unloaded', resources: undefined })
    case actionTypes.AUTHORIZING:
      return Object.assign({}, state, { gapiAuth: 'authorizing', resourcesStatus: 'unloaded', resources: undefined })
    case actionTypes.UNAUTHORIZED:
      return Object.assign({}, state, { gapiAuth: 'unauthorized', resourcesStatus: 'unloaded', resources: undefined })
    default: return state
  }
}

const updateSettings = (resources, settings) => {
  // sort by resource name
  resources = resources.sort((a, b) => {
    const aa = a.name.toUpperCase(), bb = b.name.toUpperCase()
    if(aa < bb) return -1
    if(aa > bb) return 1
    return 0
  })

  var result = settings.filter((rs) => {
    return resources.find((r2) => r2.calendarId === rs.calendarId)
  })

  resources = resources.map((r) => {
    if(settings.find((r2) => r.calendarId === r2.calendarId)) {
      return undefined
    }
    else {
      return({
        calendarId: r.calendarId,
        name: r.name
      })
    }
  })
  
  return result.concat(resources).filter((r) => r !== undefined)
}

// ACTIONS
export const showSettingsModal = () => ({ type: actionTypes.SHOW_SETTINGS_MODAL })
export const hideSettingsModal = () => ({ type: actionTypes.HIDE_SETTINGS_MODAL })

export const loadResources = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.LOADING_RESOURCES })
  calendar.loadEvents(getState().date).then((resources) => {
    dispatch({ type: actionTypes.LOAD_RESOURCES, resources: resources })
  })
}

export const loading_resources = () => ({ type: actionTypes.LOAD_RESOURCES })

export const saveResourceSettings = (resourceSettings) => (
  { type: actionTypes.SAVE_RESOURCE_SETTINGS, resourceSettings: resourceSettings }
)

export const resetResourceSettings = () => ({ type: actionTypes.RESET_RESOURCE_SETTINGS })

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

export const nextDate = (date) => (dispatch, getState) => {
  dispatch({ type: actionTypes.NEXT_DATE })
  dispatch(loadResources())
}

export const prevDate = (date) => (dispatch, getState) => {
  dispatch({ type: actionTypes.PREV_DATE })
  dispatch(loadResources())
}

// Initialize GAPI
export const initialize = () => dispatch => {
  const gapi = window.gapi;
  dispatch(saveResourceSettings(JSON.parse(window.localStorage["resourceSettings"] || "[]")))

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
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly";

    gapi.client.init({
      apiKey: GOOGLE_API_KEY,
      clientId: GOOGLE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(
      () => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateAuthState)
        updateAuthState(gapi.auth2.getAuthInstance().isSignedIn.get())
      },
      () => {
        console.log("auth error")      
      }
    );
  });
}

export const initStore = () => {
  return createStore(reducer, initialState(), composeWithDevTools(applyMiddleware(thunkMiddleware)))
}