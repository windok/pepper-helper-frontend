import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';

import {getList} from 'Reducers/list';
import {redirectToDefaultList} from 'Services/BrowserHistory';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/ListAggregatedByGroup';
import RecommendedItem from './components/RecommendedItem';

class RecommendationsScreen extends React.PureComponent {
    componentWillMount() {
        if (this.redirectToDefaultListIfNecessary(this.props.list)) {
            return;
        }

        this.props.fetchListItems(this.props.list);
    }

    componentWillReceiveProps({list}) {
        if (this.redirectToDefaultListIfNecessary(list)) {
            return;
        }

        if (list.getIdentifier() !== this.props.list.getIdentifier()) {
            this.props.fetchListItems(list);
        }
    }

    redirectToDefaultListIfNecessary(list) {
        if (!list.isNullObject()) {
            return false;
        }

        redirectToDefaultList();

        return true;
    }

    render() {
        return (
            <div>
                <Header title={this.props.list.getName() + ": Recommendations"} leftLinks={<BackButton/>}/>

                <ListComponent list={this.props.list} itemComponent={RecommendedItem}/>
            </div>
        )
    }
}

RecommendationsScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        return {
            list: getList(state, match.params.listId || 0)
        };
    },
    (dispatch) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch)
        };
    }
)(RecommendationsScreen));
