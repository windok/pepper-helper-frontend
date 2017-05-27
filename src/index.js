import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import configureStore from './configureStore';

const store = configureStore();

render(
    <Root store={store}/>,
    document.getElementById('root')
);


import {fetchProductLists} from 'Actions';
fetchProductLists()(store.dispatch);