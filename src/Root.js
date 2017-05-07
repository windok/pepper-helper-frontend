import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Main from './components/Main';
import NoMatch from './components/NoMatch';

const Root = ({store}) => (
    <Provider store={store}>
        <BrowserRouter>
            <Main>
                <Switch>
                    <Route component/>
                    <Route component={NoMatch}/>
                </Switch>
            </Main>
        </BrowserRouter>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
