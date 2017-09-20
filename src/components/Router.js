import React from 'react';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import history from 'Services/BrowserHistory';

import AddListScreen from 'Screens/productListCollection/AddList';
import EditListScreen from 'Screens/productListCollection/EditList';
import ProductListScreen from 'Screens/productList/ProductList';
import RecommendationsScreen from 'Screens/productList/Recommendations';
import AddItemToListSearchStep from 'Screens/addItemToList/SearchStep';
import AddItemToListSaveStep from 'Screens/addItemToList/SaveStep';
import EditItemScreen from 'Screens/addItemToList/Edit';
import UserScreen from 'Screens/user';
import AboutScreen from 'Screens/about';

const AppRouter = () => (
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={ProductListScreen}/>
            <Route exact path="/product-list/add" component={AddListScreen}/>
            <Route exact path="/product-list/:listId" component={ProductListScreen}/>
            <Route exact path="/product-list/:listId/edit" component={EditListScreen}/>
            <Route exact path="/product-list/:listId/item/search" component={AddItemToListSearchStep}/>
            <Route exact path="/product-list/:listId/item/save/:productId" component={AddItemToListSaveStep}/>
            <Route exact path="/product-list/:listId/item/:itemId" component={EditItemScreen}/>
            <Route exact path="/product-list/:listId/recommendations" component={RecommendationsScreen}/>
            <Route exact path="/user" component={UserScreen}/>
            <Route exact path="/about" component={AboutScreen}/>

            <Redirect to="/" push={false}/>
        </Switch>
    </Router>
);


export default AppRouter;