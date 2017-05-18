import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Sidebar from 'Components/Sidebar';
import UserScreen from 'Screens/user';
import ProductListCollection from 'Screens/productListCollection';
import ProductList from 'Screens/productList';

const Root = ({store}) => (
    <Provider store={store}>
        <div>
            <Sidebar>
                <UserScreen/>
                <ProductListCollection/>
            </Sidebar>

            <BrowserRouter>
                <Switch>
                    <Route component={ProductList}/>
                </Switch>
            </BrowserRouter>
        </div>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
