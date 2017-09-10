import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';

import {getListCollection} from 'Reducers/storage/list';

import {hideMenu, enableListManagerMode} from 'Actions/ui';

class ListCollection extends React.PureComponent {
    render() {
        const listElements = [];
        this.props.lists.forEach(list => listElements.push(
            <ListItem key={list.getId()}
                               primaryText={list.getName()}
                               onTouchTap={() => this.props.onListClick(list)}
            />
        ));

        return (
            <div>
                <List>
                    {listElements}
                    <Divider style={{marginTop: 10, marginBottom: 10}}/>
                    <ListItem key='listsManager'
                                       primaryText='Manage lists'
                                       leftIcon={<FontIcon>settings</FontIcon>}
                                       onTouchTap={() => this.props.enableListManagerMode()}
                    />
                </List>
            </div>
        );
    }
}

ListCollection.propTypes = {
    lists: PropTypes.instanceOf(Map).isRequired,
    onListClick: PropTypes.func.isRequired,
    enableListManagerMode: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            lists: getListCollection(state)
        }
    },
    (dispatch) => {
        return {
            onListClick: (list) => {
                hideMenu()(dispatch);
                history.push('/product-list/' + list.getId());
            },
            enableListManagerMode: () => enableListManagerMode()(dispatch)
        }
    }
)(ListCollection);