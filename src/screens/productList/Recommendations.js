import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';

import {getList, getFirstList} from 'Reducers/storage/list';
import {redirectToDefaultList} from 'Services/BrowserHistory';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/RecommendationList';

class RecommendationsScreen extends React.PureComponent {
    componentWillMount() {
        if (this.redirectToDefaultListIfNecessary(this.props.listId, this.props.list)) {
            return;
        }

        this.props.fetchListItems(this.props.list);
    }

    componentWillReceiveProps({listId, list}) {
        if (this.redirectToDefaultListIfNecessary(listId, list)) {
            return;
        }

        if (listId !== this.props.listId) {
            this.props.fetchListItems(list);
        }
    }

    redirectToDefaultListIfNecessary(listId, list) {
        if (listId === list.getId() && !list.isNullObject()) {
            return false;
        }

        redirectToDefaultList();

        return true;
    }

    render() {
        return (
            <div>
                <Header title={this.props.list.getName() + ": Recommendations"} leftLinks={<BackButton/>}/>

                <ListComponent list={this.props.list}/>
            </div>
        )
    }
}

RecommendationsScreen.propTypes = {
    listId: PropTypes.number.isRequired,
    list: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId) || 0;

        return {
            listId,
            list: listId ? getList(state, listId) : getFirstList(state)
        };
    },
    (dispatch) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch)
        };
    }
)(RecommendationsScreen));
