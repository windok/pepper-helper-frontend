import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Root from './Root';
import store from 'Store';
import {AppContainer} from 'react-hot-loader'
import OfflinePlugin from 'offline-plugin/runtime';

import ErrorHandler from 'Services/ErrorHandler';
import UnauthorizedErrorHandler from 'Services/ErrorHandler/UnauthorizedErrorHandler';
import LoggingErrorHandler from 'Services/ErrorHandler/LoggingErrorHandler';

import persistConfig from 'Services/ReduxPersistConfig';
import {persistStore} from 'redux-persist';


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

injectTapEventPlugin();
import './styles.scss';

persistStore(store, persistConfig);

const renderApp = (Component = Root) =>
    render(
        <AppContainer>
            <Component store={store}/>
        </AppContainer>,
        document.getElementById('root')
    );

module.hot && module.hot.accept('./Root', () => renderApp());

renderApp();
