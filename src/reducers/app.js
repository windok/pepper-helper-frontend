import * as actionType from 'Actions';

import {UNIT_TYPE_USA, UNIT_TYPE_INTERNATIONAL, UNIT_TYPE_INTERNATIONAL_RU} from 'Models/User';

const initialState = {
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
    }
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.OFFLINE_REHYDRATE_COMPLETED:
                return {...state, rehydrateCompleted: true};
        }

        return state;
    },
    {
        persist: () => {
            return {};
        }
    });

export const isRehydrationCompleted = (state) => state.app.rehydrateCompleted;

export const getAvailableLanguages = (state) => state.app.availableLanguages;

export const getUnitTypes = (state, lang) => state.app.unitTypes[lang] || [];
