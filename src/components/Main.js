import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Header from './Header';

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <div>
                <Header/>
                <div>
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}

export default Main;
