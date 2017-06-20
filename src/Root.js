import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ProductListScreen from 'Screens/productList';
import AddItemToListSearchStep from 'Screens/addItemToList/SearchStep';
import AddItemToListSaveStep from 'Screens/addItemToList/SaveStep';
import UserScreen from 'Screens/user';
import AboutScreen from 'Screens/about';

const Root = ({store}) => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/product-list/:productListId" component={ProductListScreen}/>
                    <Route exact path="/product-list/:listId/add-item/search" component={AddItemToListSearchStep}/>
                    <Route exact path="/product-list/:listId/add-item/save/:productId" component={AddItemToListSaveStep}/>
                    <Route exact path="/product-list/:productListId/recommendations" component={ProductListScreen}/>
                    <Route exact path="/user" component={UserScreen}/>
                    <Route exact path="/about" component={AboutScreen}/>

                    <Route component={ProductListScreen}/>
                </Switch>
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
