import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';

import {getList, getFirstList} from 'Reducers/storage/list';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/RecommendationList';

class RecommendationsScreen extends React.PureComponent {
    componentWillMount() {
        if (this.props.list.isNullObject()) {
            this.props.redirectToDefaultList(this.props.listId);
        }

        this.props.fetchListItems(this.props.list);
    }

    componentWillReceiveProps({listId, list}) {
        if (list.isNullObject()) {
            this.props.redirectToDefaultList(listId);
        }

        if (listId !== this.props.listId) {
            this.props.fetchListItems(list);
        }
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
    redirectToDefaultList: PropTypes.func.isRequired,
    fetchListItems: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId) || 0;

        const list = listId ? getList(state, listId) : getFirstList(state);

        return {listId, list};
    },
    (dispatch, {history}) => {
        return {
            redirectToDefaultList: (listId) => history.push('/product-list/' + listId),
            fetchListItems: (list) => fetchItemsForList(list)(dispatch)
        };
    }
)(RecommendationsScreen));
