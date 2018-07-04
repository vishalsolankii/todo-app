import Rx from 'rxjs/Rx'
import {
    Record
} from 'immutable'

import {
    combineEpics
} from 'redux-observable'

import HttpStatus from 'http-status-codes'

import {
    assign
} from 'lodash'

import {
    INIT,
    LOADING,
    SUCCESS,
    ERROR
} from '../../constants/phase'

import Config from '../../config'

import * as api from './api'

/***********************************
 * Action Types
 ***********/
export const FETCH_REPO = 'propelhub/user/FETCH_REPO'
export const FETCH_REPO_SUCCESS = 'propelhub/user/FETCH_REPO_SUCCESS'
export const FETCH_REPO_ERROR = 'propelhub/user/FETCH_REPO_ERROR'

export const COMMIT = 'propelhub/user/COMMIT'
export const COMMIT_SUCCESS = 'propelhub/user/COMMIT_SUCCESS'
export const COMMIT_ERROR = 'propelhub/user/COMMIT_ERROR'

export const GET_BUILDS = 'propelhub/user/GET_BUILDS'
export const GET_BUILDS_SUCCESS = 'propelhub/user/GET_BUILDS_SUCCESS'
export const GET_BUILDS_ERROR = 'propelhub/user/GET_BUILDS_ERROR'


export const CLEAR_PHASE = 'propelhub/user/CLEAR_PHASE'

/***********************************
 * Initial State
 ***********/

// Unlike other ducks we are taking a class style approach
// for creating the InitialState. This is becuase we need to fetch the
// locally stored token in the constructor when it is created
const InitialStateInterface = {
    token: null, // We need this here to tell InitialState that there is a token key,
    // but it will be reset below to what is in localStorage, unless a value
    // is passed in when the object is instanciated
    phase: INIT,
    repoPhase: INIT,
    buildPhase: INIT,
    error: null,
    isSubmitting: false,
    message: '',
    commitPhase:INIT,
    repodata: null,
    commitdata:null,
    builddata:[] 
    
}

class InitialState extends Record(InitialStateInterface) {
    constructor(desiredValues) {
        // When we construct InitialState, we automatically update it's default value
        // for token to be what is stored in localStorage
        const token = ''//localStorage.getItem(Config.LocalStorageKeys.Authorization)
        super(assign({
            token
        }, desiredValues))
    }
}

/***********************************
 * Reducer
 ***********/
// eslint-disable-next-line complexity, max-statements
export default function(state = new InitialState(), action = {}) {
    switch (action.type) {
        case FETCH_REPO: {
            return state
           .set('repoPhase', LOADING)
           .set('error', null)
           .set('message', '')
           .set('isSubmitting', true)
        }

        case FETCH_REPO_SUCCESS: {
            const { payload } = action
            return state
            .set('repoPhase', SUCCESS) 
        }

        case FETCH_REPO_ERROR: {
            const { payload } = action
            return state
            .set('error', payload.error)
            .set('message', payload.message)
            .set('repoPhase', ERROR)
        }    

        case CLEAR_PHASE: {
            return state
            .set('repoPhase': INIT)
            .set('Phase', INIT)
        }

        case COMMIT: {
            return state
            .set('commitPhase', LOADING)
            .set('error', null)
            .set('message', '')
            .set('isSubmitting', true)
        }

        case COMMIT_SUCCESS: {
            const { payload } = action
            return state
            .set('commitPhase', SUCCESS)
            .set('commitdata', payload)
            .set('isSubmitting', false)
        }

        case COMMIT_ERROR: {
            const { payload } = action
            return state
            .set('error', payload.error)
            .set('message', payload.message)
            .set('commitPhase', ERROR)
        }
        case GET_BUILDS: {
            return state
            .set('buildPhase', LOADING)
            .set('error', null)
            .set('message', '')
            .set('isSubmitting', true)
        }
        case GET_BUILDS_SUCCESS: {
            const { payload } = action
            return state
            .set('buildPhase', SUCCESS)
            .set('builddata', payload)
            .set('isSubmitting', false)
        }

        case GET_BUILDS_ERROR: {
            const { payload } = action
            return state
            .set('error', payload.error)
            .set('message', payload.message)
            .set('buildPhase', ERROR)
        }

        
        
        default:{
            return state
        }
    }
}

/***********************************
 * Action Creators
 ***********/

export const fetchRepos = (data) => ({
    type: FETCH_REPO,
    payload: data
})

export const gitCommit = (data) => ({
   type: COMMIT,
   payload: data
})

export const getBuilds = (data) => ({
   type: GET_BUILDS,
   payload: data
})


export const clearPhase = () =>{
    type: CLEAR_PHASE
}

/***********************************
 * Epics
 ***********************************/
const fetchReposEpic = (action$) =>
  action$
  .ofType(FETCH_REPO)
  .mergeMap((action) => {
    return Rx.Observable.fromPromise(api.fetchRepos(action.payload))
    .flatMap((payload) => ([{
      type: FETCH_REPO_SUCCESS,
      payload
    }]))
    .catch((error) => Rx.Observable.of({
      type: FETCH_REPO_ERROR,
      payload: { error }
    }))
})

const gitCommitEpic = (action$) =>
    action$
    .ofType(COMMIT)
    .mergeMap((action) => {
    return Rx.Observable.fromPromise(api.gitCommit(action.payload))
    .map((payload) => ({
        type: COMMIT_SUCCESS,
        payload
    }))
    .catch((error) => Rx.Observable.of({
      type: COMMIT_ERROR,
      payload: { error }
    }))
  })

const getBuildsEpic = (action$) =>
    action$
    .ofType(GET_BUILDS)
    .mergeMap((action) => {
    return Rx.Observable.fromPromise(api.getBuilds(action.payload))
    .map((payload) => ({
        type: GET_BUILDS_SUCCESS,
        payload
    }))
    .catch((error) => Rx.Observable.of({
      type: GET_BUILDS_ERROR,
      payload: { error }
    }))
  })

export const reposEpic = combineEpics(
    fetchReposEpic,
    gitCommitEpic,
    getBuildsEpic,
    
)
