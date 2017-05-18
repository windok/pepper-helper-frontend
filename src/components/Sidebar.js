import React, {Component} from 'react';
import PropTypes from 'prop-types';


class Sidebar extends Component {
    render() {
        return (
            <div>
                Sidebar:<br/>
                {this.props.children}
            </div>
        );
    }
}


export default Sidebar;