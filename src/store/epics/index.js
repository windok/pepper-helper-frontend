// import 'rxjs';

// todo import rxjs properly
import 'rxjs/Observable';
import 'rxjs/Subscription';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

import {combineEpics} from 'redux-observable';


import {onlineEpic, backendConnectionEpic, coldStartEpic} from 'Actions/app';
import {logoutEpic} from 'Actions/auth';
import {createSyncActionEpic, startSyncEpic, cancelSyncEpic, syncEpic, syncCompleteEpic, requestDiffEpic} from 'Actions/sync';

import {fetchListDiffEpic} from 'Actions/list';
import {fetchListItemDiffEpic} from 'Actions/listItem';
import {fetchProductDiffEpic} from 'Actions/product';
import {fetchGroupDiffEpic} from 'Actions/group';
import {fetchUnitDiffEpic} from 'Actions/unit';

export  default combineEpics(
    onlineEpic,
    backendConnectionEpic,

    logoutEpic,

    createSyncActionEpic,
    startSyncEpic,
    cancelSyncEpic,
    syncEpic,
    syncCompleteEpic,
    coldStartEpic,
    requestDiffEpic,

    fetchListDiffEpic,
    fetchListItemDiffEpic,
    fetchGroupDiffEpic,
    fetchProductDiffEpic,
    fetchUnitDiffEpic
);
