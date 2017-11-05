import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import ListModel from 'Models/List';

import {hideMenu} from 'Actions/ui';

import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';
import Avatar from 'react-md/lib/Avatars';
import SVGIcon from 'react-md/lib/SVGIcons';

import {getListCollection, getSelectedList} from 'Reducers/list';

import pepperLogo from 'Assets/hot-pepper.svg';

class ListCollection extends React.PureComponent {
    getCurrentListOptions() {
        return (
            <div className="folder-list">
                <ListItem
                    primaryText="Recommended"
                    leftIcon={<SVGIcon use={pepperLogo.url}/>}
                    onClick={() => this.props.showRecommendations(this.props.currentList)}
                />
                <ListItem
                    primaryText="Bought"
                    leftIcon={<FontIcon>done_all</FontIcon>}
                    onClick={() => this.props.showBought(this.props.currentList)}
                />
                <ListItem
                    primaryText="Snoozed"
                    leftIcon={<FontIcon>schedule</FontIcon>}
                    onClick={() => this.props.showSuspended(this.props.currentList)}
                />
            </div>
        );
    }

    render() {
        return (
            <List>
                {this.props.currentList && this.getCurrentListOptions()}
                {this.props.currentList && <Divider style={{marginTop: 10, marginBottom: 10}}/>}

                {this.props.lists.size > 0 && Array.from(this.props.lists, (([listId, list]) => <ListItem
                    key={list.getIdentifier()}
                    leftAvatar={<Avatar random>{list.getName()[0]}</Avatar>}
                    primaryText={list.getName()}
                    onClick={() => this.props.onListClick(list)}
                />))}
                {this.props.lists.size > 0 && <Divider style={{marginTop: 10, marginBottom: 10}}/>}

                <ListItem
                    primaryText="Add new list"
                    leftIcon={<FontIcon>add</FontIcon>}
                    onClick={this.props.addList}
                />
            </List>
        );
    }
}

ListCollection.propTypes = {
    currentList: PropTypes.instanceOf(ListModel),
    lists: PropTypes.instanceOf(Map).isRequired,

    addList: PropTypes.func.isRequired,
    onListClick: PropTypes.func.isRequired,
    showBought: PropTypes.func.isRequired,
    showSuspended: PropTypes.func.isRequired,
    showRecommendations: PropTypes.func.isRequired,
};

export default connect(
    (state) => {
        return {
            currentList: getSelectedList(state),
            lists: getListCollection(state)
        }
    },
    (dispatch) => {
        return {
            showBought: (list) => {
                hideMenu()(dispatch);
                history.push('/product-list/' + list.getIdentifier() + '/bought');
            },
            showSuspended: (list) => {
                hideMenu()(dispatch);
                history.push('/product-list/' + list.getIdentifier() + '/suspended');
            },
            showRecommendations: (list) => {
                hideMenu()(dispatch);
                history.push('/product-list/' + list.getIdentifier() + '/recommendations');
            },
            addList: () => {
                hideMenu()(dispatch);
                history.push('/product-list/add');
            },
            onListClick: (list) => {
                hideMenu()(dispatch);
                history.push('/product-list/' + list.getIdentifier());
            }
        }
    }
)(ListCollection);