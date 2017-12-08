import * as actionType from 'Actions';

import {UNIT_TYPE_USA, UNIT_TYPE_INTERNATIONAL, UNIT_TYPE_INTERNATIONAL_RU} from 'Models/User';

const initialState = {
    online: false,
    backendConnected: false,
    rehydrateCompleted: false,
    ready: false,
    coldStartBegun: false,
    resourcesLoaded: false,
    availableLanguages: ['en', 'ru'],
    // todo refactor to not depend on lang
    unitTypes: {
        en: [
            {
                value: UNIT_TYPE_INTERNATIONAL,
                label: 'Metric system'
            },
            {
                value: UNIT_TYPE_USA,
                label: 'US standard system'
            }
        ],
        ru: [
            {
                value: UNIT_TYPE_INTERNATIONAL_RU,
                label: 'Метрическая система'
            },
            {
                value: UNIT_TYPE_USA,
                label: 'US standard system'
            }
        ]
    },
    applicationVersion: 3,
    cacheApplicationVersion: 3       // todo get rid of temporal workaround to clear local storage during dev testing,
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.OFFLINE_REHYDRATE_COMPLETED: {
                const persistedState = (action.payload && action.payload.app) || {};

                return {
                    ...state,
                    resourcesLoaded: persistedState.resourcesLoaded || false,
                    // todo get rid of temporal workaround
                    cacheApplicationVersion: persistedState.cacheApplicationVersion || 0,
                    rehydrateCompleted: true
                };
            }

            case actionType.APP_READY:
                return {
                    ...state,
                    ready: true
                };

            case actionType.APP_COLD_START_BEGUN:
                return {
                    ...state,
                    coldStartBegun: true,
                    resourcesLoaded: false
                };

            case actionType.APP_COLD_START_FINISHED:
                return {
                    ...state,
                    resourcesLoaded: true
                };


            case actionType.ONLINE_STATUS_CHANGE:
                return {...state, online: action.payload};

            case actionType.BACKEND_CONNECTION_STATUS_CHANGE:
                return {...state, backendConnected: action.payload};

            case actionType.USER_LOGOUT:
                return {
                    ...initialState,
                    rehydrateCompleted: state.rehydrateCompleted
                }
        }

        return state;
    },
    {
        persist: (state) => ({
            resourcesLoaded: state.resourcesLoaded,
            cacheApplicationVersion: state.cacheApplicationVersion
        }),
        // rehydrate callback does not work because OFFLINE_REHYDRATE_COMPLETED action is processed in reducer
    });

export const isAppReady = (state) => state.app.ready;
export const isColdStartFinished = (state) => state.app.resourcesLoaded;
export const isColdStartBegun = (state) => state.app.coldStartBegun;

export const isOnline = (state) => state.app.online;
export const isBackendConnected = (state) => state.app.backendConnected;

export const isRehydrationCompleted = (state) => state.app.rehydrateCompleted;

export const getAvailableLanguages = (state) => state.app.availableLanguages;

export const getUnitTypes = (state, lang) => state.app.unitTypes[lang] || [];

export const getApplicationVersion = (state) => state.app.applicationVersion;
export const getCacheApplicationVersion = (state) => state.app.cacheApplicationVersion;
