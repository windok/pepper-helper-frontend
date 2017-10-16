import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import Router from './Router';

import {fetchAll as fetchProductListCollection} from 'Actions/list';
import {fetchAll as fetchProductCollection} from 'Actions/product';
import {fetchAll as fetchUnitCollection} from 'Actions/unit';
import {fetchAll as fetchGroupCollection} from 'Actions/group';

class Screen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            resourcesLoadingPromise: null,
            resourcesLoaded: false
        };

        this.state.resourcesLoadingPromise = this.loadResources();
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
        // todo request difference
        return (
            <div>
                {!this.state.resourcesLoaded && <CircularProgress id="progressBar"/>}
                {
                    this.state.resourcesLoaded
                    // todo show linear progress when difference is requested
                }
                {this.state.resourcesLoaded && <Router/>}
            </div>
        );
    }
}

Screen.propTypes = {
    loadResources: PropTypes.func.isRequired,
};

export default connect(
    null,
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
