import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Main from './components/Main';
import NoMatch from './components/NoMatch';

import ProductRoot from './screens/products/Root'

import DemoActivityRoot from './screens/demo-activities/Root'
import DemoVisibleActivityList from './screens/demo-activities/containers/VisibleActivityList'
import DemoAddActivity from './screens/demo-activities/containers/AddActivity'
import DemoActivityCard from './screens/demo-activities/containers/ActivityCard'

const Root = ({store}) => (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={Main}>
                <IndexRoute component={ProductRoot}/>
                <Route path="product" component={ProductRoot}/>
                // todo create inner routes
                <Route path="demo-activity" component={DemoActivityRoot}>
                    <IndexRoute component={DemoVisibleActivityList}/>
                    <Route path="/demo-activity/create" component={DemoAddActivity}/>
                    <Route path=":activityId" component={DemoActivityCard}/>
                </Route>
                <Route path="*" component={NoMatch}/>
            </Route>
        </Router>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
