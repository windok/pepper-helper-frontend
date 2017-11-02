import 'rxjs';

// todo import rxjs properly
// import {Observable} from "rxjs/Observable";
// import {from} from "rxjs/observable/from";
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/delay';
// import 'rxjs/add/operator/do';

import {combineEpics} from 'redux-observable';


import {onlineEpic, backendConnectionEpic} from 'Actions/app';
import {logoutEpic} from 'Actions/auth';
import {createSyncActionEpic, startSyncEpic, syncEpic, syncCompleteEpic} from 'Actions/sync';

export  default combineEpics(
    onlineEpic,
    backendConnectionEpic,

    logoutEpic,

    createSyncActionEpic,
    startSyncEpic,
    syncEpic,
    syncCompleteEpic,
);
