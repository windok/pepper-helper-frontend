import React, {Component} from 'react';
import NavLink from './NavLink';
// todo get history from parent component
import { browserHistory } from 'react-router'

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
    }

    // todo move to container component
    goBack() {
        // Go back to previous location.
        browserHistory.goBack()
    }

    render () {
        return (
            <div>
                <button onClick={this.goBack}>Back</button>
                &nbsp;|&nbsp;
                <NavLink to="/product">Products</NavLink>
                &nbsp;|&nbsp;
                <NavLink to="/demo-activity">Activities</NavLink>
            </div>
        );
    }
}


export default NavBar;