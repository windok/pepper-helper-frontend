import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {List as ListModel, ListNullObject} from 'Models/List';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import MenuButton from 'Components/buttons/MenuButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {getList, getFirstList} from 'Reducers/storage/list';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/GeneralList';

class ProductListScreen extends React.PureComponent {
    componentWillMount() {
        this.props.fetchListItems(this.props.list);
    }

    componentWillReceiveProps({listId, list}) {
        if (listId !== this.props.listId) {
            this.props.fetchListItems(list);
        }
    }

    render() {
        // todo create separate component that specifies Menu
        // todo keep list of links for each screen somewhere

        if (this.props.list.isNullObject()) {
            return (
                <div>
                    <Sidebar/>
                    <Header title={"Product list " + this.props.list.getName()} leftLinks={<MenuButton/>}/>
                    {this.props.list.getName()}
                </div>
            );
        }

        // todo add item and recommendation links should be FAB
        return (
            <div>
                <Sidebar/>
                <Header title={this.props.list.getName()} leftLinks={<MenuButton/>}/>

                <ListComponent list={this.props.list}/>

                <div style={{marginTop: '110px'}}></div>

                <FloatingActionButton onTouchTap={() => this.props.showRecommendations(this.props.list)}
                                      secondary={true}
                                      mini={true}
                                      style={{
                                          bottom: 70,
                                          position: 'fixed',
                                          margin: '1em',
                                          right: '0px',
                                          zIndex: 999
                                      }}>
                    <strong>R</strong>
                </FloatingActionButton>

                <FloatingActionButton onTouchTap={() => this.props.addItem(this.props.list)}
                                      style={{
                                          bottom: 0,
                                          position: 'fixed',
                                          margin: '1em',
                                          right: '0px',
                                          zIndex: 989
                                      }}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}

ProductListScreen.propTypes = {
    listId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    list: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    showRecommendations: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => {
        const listId = parseInt(match.params.listId) || 0;

        const list = listId ? getList(state, listId) : getFirstList(state);

        if (
            // todo list fetching request in progress
        // todo maybe this list does not exist?
        // todo unexisted list, redirect to user's default list
            list.isNullObject()
        ) {
            return {listId: 0, list};
        }

        return {listId, list};
    },
    (dispatch, {history}) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch),
            addItem: (list) => history.push('/product-list/' + list.getId() + '/add-item/search'),
            showRecommendations: (list) => history.push('/product-list/' + list.getId() + '/recommendations')
        };
    }
)(ProductListScreen));
