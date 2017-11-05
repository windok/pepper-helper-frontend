import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import store from 'Store';
import {AppContainer} from 'react-hot-loader'
import OfflinePlugin from 'offline-plugin/runtime';

import ErrorHandler from 'Services/ErrorHandler';
import UnauthorizedErrorHandler from 'Services/ErrorHandler/UnauthorizedErrorHandler';
import LoggingErrorHandler from 'Services/ErrorHandler/LoggingErrorHandler';

import {persistStore} from 'redux-persist';

import {Observable} from "rxjs/Observable";

OfflinePlugin.install({
    onUpdateReady: function () {
        OfflinePlugin.applyUpdate();
    },
    onUpdated: function () {
        window.location.reload();
    }
});

ErrorHandler.addHandlers([
    LoggingErrorHandler,
    UnauthorizedErrorHandler
]);

import './styles.scss';

persistStore(store);

// emit redux actions to trigger react-observable epics
Observable.interval(30 * 1000).subscribe(() => store.dispatch({type: 'TICK'}));

const renderApp = (Component = Root) =>
    render(
        <AppContainer>
            <Component store={store}/>
        </AppContainer>,
        document.getElementById('root')
    );

module.hot && module.hot.accept('./Root', () => renderApp());

renderApp();
