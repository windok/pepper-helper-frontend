import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Sidebar from 'Components/Sidebar';

import UserSidebarWidget from 'Screens/user';
import ProductListCollectionSidebarWidget from 'Screens/productListCollection';

import ProductListScreen from 'Screens/productList';
import AddItemToListSearchStep from 'Screens/addItemToList/searchStep';
import AddItemToListSaveStep from 'Screens/addItemToList/saveStep';
import UserScreen from 'Screens/user';
import AboutScreen from 'Screens/about';

const Root = ({store}) => (
    <Provider store={store}>
        <div>
            <BrowserRouter>
                <div>
                    <Sidebar>
                        <UserSidebarWidget/>
                        <ProductListCollectionSidebarWidget/>
                    </Sidebar>

                    <Switch>
                        <Route exact path="/product-list/:productListId" component={ProductListScreen}/>
                        <Route exact path="/product-list/:productListId/add-item/search" component={AddItemToListSearchStep}/>
                        <Route exact path="/product-list/:productListId/add-item/save" component={AddItemToListSaveStep}/>
                        <Route exact path="/product-list/:productListId/recommendations" component={ProductListScreen}/>
                        <Route exact path="/user" component={UserScreen}/>
                        <Route exact path="/about" component={AboutScreen}/>

                        <Route component={ProductListScreen}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
