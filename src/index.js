import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './Root';
import store from 'Store';

import 'normalize.css';
injectTapEventPlugin();

// todo fetch list collection somewhere else
import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';


Promise.all([
    fetchProductListCollection()(store.dispatch),
    fetchProductCollection()(store.dispatch),
    fetchUnitCollection()(store.dispatch),
    fetchGroupCollection()(store.dispatch)
])
    .then(() => {
        render(
            <Root store={store}/>,
            document.getElementById('root')
        );
    });

