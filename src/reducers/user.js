import * as actionType from 'Actions';
import User from 'Models/User';
import {SharedListOwner} from "Models/SharedListOwner";

const initialState = {
    model: null,
    sharedListOwners: new Map(),
    refreshRequested: false
};

export default Object.assign(
    (state = initialState, action) => {
        switch (action.type) {
            case actionType.USER_REFRESH_REQUEST:
                return {...state, refreshRequested: true};

            case actionType.USER_REGISTER_SUCCESS:
            case actionType.USER_SIGN_IN_SUCCESS:
            case actionType.USER_REFRESH_SUCCESS:
                return {...state, model: action.payload, refreshRequested: false};

            case actionType.USER_REFRESH_ERROR:
                return {...state, refreshRequested: false};

            case actionType.SHARED_LIST_OWNERS_SUCCESS:
                return {...state, sharedListOwners: new Map([...action.payload.sharedListOwners])};

            case actionType.USER_LOGOUT:
                return {...initialState}
        }

        return state;
    },
    {
        persist: (state) => ({
            model: state.model ? state.model.serialize() : null,
            sharedListOwners: Array.from(state.sharedListOwners.entries(), ([ownerId, owner]) => [ownerId, owner.serialize()])
        }),
        rehydrate: (persistedState) => ({
            model: persistedState.model && new User(persistedState.model),
            sharedListOwners: new Map(persistedState.sharedListOwners.map(([ownerId, ownerData]) => [ownerId, new SharedListOwner(ownerData)]))
        })
    });

export const getUser = state => state.user.model;

export const isUserRefreshRequested = state => state.user.refreshRequested;

export const getSharedListOwners = state => state.user.sharedListOwners;
