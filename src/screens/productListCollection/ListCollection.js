import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import {List as ListComponent, ListItem as ListItemComponent} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ManageIcon from 'material-ui/svg-icons/action/settings';

import {getListCollection} from 'Reducers/storage/list';

import {hideMenu, enableListManagerMode} from 'Actions/ui';

class ListCollection extends React.PureComponent {
    render() {
        const listElements = [];
        this.props.lists.forEach(list => listElements.push(
            <ListItemComponent key={list.getId()}
                               primaryText={list.getName()}
                               onTouchTap={() => this.props.onListClick(list)}
            />
        ));

        return (
            <div>
                <ListComponent>
                    {listElements}
                    <Divider style={{marginTop: 10, marginBottom: 10}}/>
                    <ListItemComponent key='listsManager'
                                       primaryText='Manage lists'
                                       leftIcon={<ManageIcon/>}
                                       onTouchTap={() => this.props.enableListManagerMode()}
                    />
                </ListComponent>
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