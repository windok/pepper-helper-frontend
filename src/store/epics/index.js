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


import {logoutEpic} from 'Actions/auth';
import {createSyncActionEpic, startSyncEpic, syncEpic} from 'Actions/sync';

import {listEpic} from 'Actions/list';

export  default combineEpics(
    logoutEpic,
    createSyncActionEpic,
    startSyncEpic,
    syncEpic,

    listEpic
);
