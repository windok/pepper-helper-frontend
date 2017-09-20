import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';

import {getListCollection} from 'Reducers/list';

import {hideMenu, disableListManagerMode} from 'Actions/ui';

class ListManager extends React.PureComponent {
    render() {
        const listElements = [];
        this.props.lists.forEach((list) => listElements.push(
            <ListItem key={list.getId()}
                               primaryText={list.getName()}
                               onTouchTap={() => this.props.editList(list)}/>
        ));

        return (
            <div>
                <List>
                    {listElements}
                    <Divider style={{marginTop: 10, marginBottom: 10}}/>
                    <ListItem primaryText="Add new"
                                       leftIcon={<FontIcon>add</FontIcon>}
                                       onTouchTap={this.props.addList}/>
                    <ListItem primaryText="Done editing"
                                       leftIcon={<FontIcon>done</FontIcon>}
                                       onTouchTap={this.props.disableListManagerMode}/>
                </List>
            </div>
        );
    }
}

ListManager.propTypes = {
    lists: PropTypes.instanceOf(Map).isRequired,
    addList: PropTypes.func.isRequired,
    editList: PropTypes.func.isRequired,
    disableListManagerMode: PropTypes.func.isRequired,
};

export default connect(
    (state) => {
        return {
            lists: getListCollection(state)
        }
    },
    (dispatch) => {
        return {
            addList: () => {
                hideMenu()(dispatch);
                history.push('/product-list/add')
            },
            editList: (list) => {
                hideMenu()(dispatch);
                history.push('/product-list/' + list.getId() + '/edit')
            },
            disableListManagerMode: () => disableListManagerMode()(dispatch)
        }
    }
)(ListManager);