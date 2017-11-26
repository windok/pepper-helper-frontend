import * as actionType from 'Actions';

import {UNIT_TYPE_USA, UNIT_TYPE_INTERNATIONAL, UNIT_TYPE_INTERNATIONAL_RU} from 'Models/User';

const initialState = {
    online: false,
    backendConnected: false,
    rehydrateCompleted: false,
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
            case actionType.OFFLINE_REHYDRATE_COMPLETED:
                return {
                    ...state,
                    // todo get rid of temporal workaround
                    cacheApplicationVersion: action.payload && action.payload.app && action.payload.app.cacheApplicationVersion,
                    rehydrateCompleted: true
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
            cacheApplicationVersion: state.cacheApplicationVersion
        }),
    });

export const isOnline = (state) => state.app.online;
export const isBackendConnected = (state) => state.app.backendConnected;

export const isRehydrationCompleted = (state) => state.app.rehydrateCompleted;

export const getAvailableLanguages = (state) => state.app.availableLanguages;

export const getUnitTypes = (state, lang) => state.app.unitTypes[lang] || [];

export const getApplicationVersion = (state) => state.app.applicationVersion;
export const getCacheApplicationVersion = (state) => state.app.cacheApplicationVersion;
