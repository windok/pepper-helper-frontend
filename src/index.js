import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import configureStore from './configureStore';

const store = configureStore();

// todo fetch list collection somewhere else
import {fetchProductListCollection} from 'Actions';
fetchProductListCollection()(store.dispatch);

render(
    <Root store={store}/>,
    document.getElementById('root')
);
