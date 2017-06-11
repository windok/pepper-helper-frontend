import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import store from 'Store';

// import List from './models/List';
//
// let state = {isFetching: false, items: new Map()};
//
// const f = new Map();
// f.set(1, new List({id: 1, name: 'first'}))
//     .set(2, new List({id: 2, name: 'second'}))
//     .set(4, {id: 4, name: 'forth'});
//
// const s = new Map();
// s.set(3, new List({id: 3, name: 'third'}))
//     .set(2, new List({id: 2, name: 'new second'}));
//
// const merged = new Map([...f, ...s]);
// console.log(state);
// state = {...state, isFetching: true};
// console.log(state);
// state = {...state, items: new Map([...state.items, ...merged])};
// console.log(state);
// state = {...state, isFetching: false};
// console.log(state);
//
// console.log(f);
// console.log(s);
// console.log(merged);
//
// f.set(1, new List({id: 1, name: 'updated first'}));
//
// console.log(f);
// console.log(s);
// console.log(merged);
//
// f.get(4).name = 'updated forth';
//
// console.log(f);
// console.log(s);
// console.log(merged);

// todo fetch list collection somewhere else
import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';
fetchProductListCollection()(store.dispatch);
fetchProductCollection()(store.dispatch);
fetchUnitCollection()(store.dispatch);
fetchGroupCollection()(store.dispatch);

render(
    <Root store={store}/>,
    document.getElementById('root')
);
