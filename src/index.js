import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import configureStore from './configureStore';

const store = configureStore();

// todo fetch list collection somewhere else
import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchTranslationCollection} from 'Actions/translation';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchCategoryCollection} from 'Actions/category';
import {fetchAll as fetchGroupCollection} from 'Actions/group';
fetchProductListCollection()(store.dispatch);
fetchTranslationCollection()(store.dispatch);
fetchUnitCollection()(store.dispatch);
fetchCategoryCollection()(store.dispatch);
fetchGroupCollection()(store.dispatch);

render(
    <Root store={store}/>,
    document.getElementById('root')
);
