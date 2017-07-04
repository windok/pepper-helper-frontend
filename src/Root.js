import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {Router, Switch, Route} from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import history from 'Services/BrowserHistory';

import AddListScreen from 'Screens/productListCollection/AddList';
import EditListScreen from 'Screens/productListCollection/EditList';
import ProductListScreen from 'Screens/productList/ProductList';
import RecommendationsScreen from 'Screens/productList/Recommendations';
import AddItemToListSearchStep from 'Screens/addItemToList/SearchStep';
import AddItemToListSaveStep from 'Screens/addItemToList/SaveStep';
import UserScreen from 'Screens/user';
import AboutScreen from 'Screens/about';

const Root = ({store}) => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Provider store={store}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/product-list/add" component={AddListScreen}/>
                    <Route exact path="/product-list/:listId/edit" component={EditListScreen}/>
                    <Route exact path="/product-list/:listId" component={ProductListScreen}/>
                    <Route exact path="/product-list/:listId/add-item/search" component={AddItemToListSearchStep}/>
                    <Route exact path="/product-list/:listId/add-item/save/:productId" component={AddItemToListSaveStep}/>
                    <Route exact path="/product-list/:listId/recommendations" component={RecommendationsScreen}/>
                    <Route exact path="/user" component={UserScreen}/>
                    <Route exact path="/about" component={AboutScreen}/>

                    <Route component={ProductListScreen}/>
                </Switch>
            </Router>
        </Provider>
    </MuiThemeProvider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
