import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './Root';
import store from 'Store';
import {AppContainer} from 'react-hot-loader'
import OfflinePlugin from 'offline-plugin/runtime';

OfflinePlugin.install({
    onUpdateReady: function() {
        OfflinePlugin.applyUpdate();
    },
    onUpdated: function() {
        window.location.reload();
    }
});

injectTapEventPlugin();
import './styles.scss';

// todo fetch list collection somewhere else
import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';

const renderApp = (Component = Root) =>
    render(
        <AppContainer>
            <Component store={store}/>
        </AppContainer>,
        document.getElementById('root')
    );


Promise.all([
    fetchProductListCollection()(store.dispatch),
    fetchProductCollection()(store.dispatch),
    fetchUnitCollection()(store.dispatch),
    fetchGroupCollection()(store.dispatch)
]).then(() => renderApp());

// Hot Module Replacement API
module.hot && module.hot.accept('./Root', () => renderApp());
