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

// todo define variable value from env
const hotModuleReplacement = false;

let renderApp;
if (hotModuleReplacement) {
    renderApp = (Component = Root) =>
        render(
            <AppContainer>
                <Component store={store}/>
            </AppContainer>,
            document.getElementById('root')
        );

    // Hot Module Replacement API
    module.hot && module.hot.accept('./Root', () => renderApp());
} else {
    renderApp = (Component = Root) => render(<Component store={store}/>, document.getElementById('root'));
}

renderApp();