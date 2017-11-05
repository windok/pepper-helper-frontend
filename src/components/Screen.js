import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import Router from './Router';

import {isColdStartFinished} from 'Reducers/sync';
import {startColdStart} from 'Actions/app';

class Screen extends React.PureComponent {
    // TODO remove from representation class
    componentWillMount() {
        if (!this.props.isColdStartFinished) {
            this.props.startColdStartResourceLoading();
        }
    }

    render() {
        return (
            <div>
                {!this.props.isColdStartFinished && <CircularProgress id="progressBar"/>}
                {this.props.isColdStartFinished && <Router/>}
            </div>
        );
    }
}

Screen.propTypes = {
    isColdStartFinished: PropTypes.bool.isRequired,
    startColdStartResourceLoading: PropTypes.func.isRequired
};

export default connect(
    (state) => ({
        isColdStartFinished: isColdStartFinished(state)
    }),
    (dispatch) => ({
        startColdStartResourceLoading: () => dispatch(startColdStart())
    })
)(Screen);
