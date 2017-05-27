import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Sidebar from 'Components/Sidebar';

import UserSidebarWidget from 'Screens/user';
import ProductListCollectionSidebarWidget from 'Screens/productListCollection';

import ProductListScreen from 'Screens/productList';
import UserScreen from 'Screens/user';
import AboutScreen from 'Screens/about';

const Root = ({store}) => (
    <Provider store={store}>
        <div>
            <Sidebar>
                <UserSidebarWidget/>
                <ProductListCollectionSidebarWidget/>
            </Sidebar>

            <BrowserRouter>
                <Switch>
                    <Route exact path="/product-list/:productListId" component={ProductListScreen}/>
                    <Route exact path="/user" component={UserScreen}/>
                    <Route exact path="/about" component={AboutScreen}/>

                    <Route component={ProductListScreen}/>
                </Switch>
            </BrowserRouter>
        </div>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
