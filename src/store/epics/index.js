import 'rxjs/Observable';
import 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/throttleTime';

import {combineEpics} from 'redux-observable';

import {appReadyEpic, onlineEpic, backendConnectionEpic, beginColdStartEpic, coldStartEpic} from 'Actions/app';
import {logoutEpic, refreshTokenEpic} from 'Actions/auth';
import {createSyncActionEpic, startSyncEpic, cancelSyncEpic, syncEpic, syncCompleteEpic, requestDiffEpic} from 'Actions/sync';

import {fetchListDiffEpic} from 'Actions/list';
import {fetchListItemDiffEpic} from 'Actions/listItem';
import {fetchProductDiffEpic} from 'Actions/product';
import {fetchGroupDiffEpic} from 'Actions/group';
import {fetchUnitDiffEpic} from 'Actions/unit';

export  default combineEpics(
    appReadyEpic,
    onlineEpic,
    backendConnectionEpic,
    beginColdStartEpic,
    coldStartEpic,

    logoutEpic,
    refreshTokenEpic,

    createSyncActionEpic,
    startSyncEpic,
    cancelSyncEpic,
    syncEpic,
    syncCompleteEpic,
    requestDiffEpic,

    fetchListDiffEpic,
    fetchListItemDiffEpic,
    fetchGroupDiffEpic,
    fetchProductDiffEpic,
    fetchUnitDiffEpic
);
