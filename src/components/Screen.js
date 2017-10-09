import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Router from './Router';

import {isRehydrationCompleted} from 'Reducers/app';

import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';

class Screen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            rehydrationCompleted: props.isRehydrationCompleted,
            resourcesLoadingPromise: null,
            resourcesLoaded: false
        };

        if (this.state.rehydrationCompleted) {
            this.state.resourcesLoadingPromise = this.loadResources();
        }
    }

    componentWillReceiveProps({isRehydrationCompleted}) {
        if (!this.state.rehydrationCompleted && isRehydrationCompleted) {
            this.setState({rehydrationCompleted: true});
        }

        if (this.state.resourcesLoaded || this.state.resourcesLoadingPromise || !this.state.rehydrationCompleted) {
            return;
        }

        this.setState({resourcesLoadingPromise: this.loadResources()});
    }

    componentWillUnmount() {
        // todo cancel resourceLoadingPromise
    }

    loadResources() {
        return this.props.loadResources().then(() => this.setState({
            resourcesLoadingPromise: null,
            resourcesLoaded: true
        }));
    }

    render() {
        return (
            <div>
                {!this.state.resourcesLoaded && <LinearProgress id="loading-bar"/>}
                {this.state.rehydrationCompleted && <Router/>}
            </div>
        );
    }
}

Screen.propTypes = {
    isRehydrationCompleted: PropTypes.bool.isRequired,
    loadResources: PropTypes.func.isRequired,
};

export default connect(
    (state) => {
        return {
            isRehydrationCompleted: isRehydrationCompleted(state)
        }
    },
    (dispatch) => {
        return {
            loadResources: () => {
                return Promise.all([
                    fetchProductListCollection()(dispatch),
                    fetchProductCollection()(dispatch),
                    fetchUnitCollection()(dispatch),
                    fetchGroupCollection()(dispatch)
                ]);
            }
        }
    }
)(Screen);
