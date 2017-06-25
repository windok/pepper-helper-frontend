import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import {List as ListComponent, ListItem as ListItemComponent} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AddIcon from 'material-ui/svg-icons/content/create';
import DoneIcon from 'material-ui/svg-icons/action/done';

import {getListCollection} from 'Reducers/storage/list';

import {hideMenu, disableListManagerMode} from 'Actions/ui';

class ListManager extends React.PureComponent {
    render() {
        const listElements = [];
        this.props.lists.forEach((list) => listElements.push(
            <ListItemComponent key={list.getId()}
                               primaryText={list.getName()}
                               onTouchTap={() => this.props.editList(list)}/>
        ));

        return (
            <div>
                Lists:
                <Divider style={{marginTop: 10, marginBottom: 10}}/>
                <ListComponent>
                    {listElements}
                    <Divider style={{marginTop: 10, marginBottom: 10}}/>
                    <ListItemComponent primaryText="Add new"
                                       leftIcon={<AddIcon/>}
                                       onTouchTap={this.props.addList}/>
                    <ListItemComponent primaryText="Done editing"
                                       leftIcon={<DoneIcon/>}
                                       onTouchTap={this.props.disableListManagerMode}/>
                </ListComponent>
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