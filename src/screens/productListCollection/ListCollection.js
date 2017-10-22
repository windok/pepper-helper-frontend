import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import {hideMenu} from 'Actions/ui';

import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';
import Avatar from 'react-md/lib/Avatars';
import SVGIcon from 'react-md/lib/SVGIcons';

import {getListCollection} from 'Reducers/list';

import pepperLogo from 'Assets/hot-pepper.svg';

class ListCollection extends React.PureComponent {
    render() {
        const listElements = [];
        this.props.lists.forEach(list => listElements.push(
            <ListItem
                key={list.getIdentifier()}
                leftAvatar={<Avatar random>{list.getName()[0]}</Avatar>}
                primaryText={list.getName()}
                onClick={() => this.props.onListClick(list)}
            />
        ));

        let folders = (<div className="folder-list">
            <ListItem
                primaryText="Recommended"
                leftIcon={<SVGIcon use={pepperLogo.url}/>}
                onClick={this.props.showRecommendations}
            />
            <ListItem
                primaryText="Bought"
                leftIcon={<FontIcon>done_all</FontIcon>}
                onClick={this.props.showBought}
            />
            <ListItem
                primaryText="Snoozed"
                leftIcon={<FontIcon>schedule</FontIcon>}
                onClick={this.props.showSuspended}
            />
        </div>);

        return (
            <List>
                {this.props.currentList && folders}
                <Divider style={{marginTop: 10, marginBottom: 10}}/>
                {listElements}
                <Divider style={{marginTop: 10, marginBottom: 10}}/>
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
    // currentList: PropTypes.instanceOf(List).isRequired,
    lists: PropTypes.instanceOf(Map).isRequired,
    addList: PropTypes.func.isRequired,
    onListClick: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            lists: getListCollection(state)
        }
    },
    (dispatch, props) => {
        return {
            showBought: () => {
                hideMenu()(dispatch);
                history.push('/product-list/' + props.currentList.getIdentifier() + '/bought');
            },
            showSuspended: () => {
                hideMenu()(dispatch);
                history.push('/product-list/' + props.currentList.getIdentifier() + '/suspended');
            },
            showRecommendations: () => {
                hideMenu()(dispatch);
                history.push('/product-list/' + props.currentList.getIdentifier() + '/recommendations');
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