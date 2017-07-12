import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem} from 'Models/ListItem';

import {ListItem as ListItemComponent} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import ReturnIcon from 'material-ui/svg-icons/content/undo';
import ItemLabel from './ItemLabel';

import {returnItem} from 'Actions/listItem';

class BoughtItem extends React.PureComponent {
    render() {
        const returnButton = (
            <IconButton tooltip="return" onTouchTap={() => this.props.returnItem(this.props.item)}>
                <ReturnIcon/>
            </IconButton>
        );

        return (
            <ListItemComponent rightIconButton={returnButton}>
                <ItemLabel item={this.props.item} style={{textDecoration: 'line-through'}}/>
            </ListItemComponent>
        )
    }
}

BoughtItem.propTypes = {
    item: PropTypes.instanceOf(ListItem).isRequired,
    returnItem: PropTypes.func.isRequired
};

export default connect(
    (state, {item}) => {
        return {item}
    },
    (dispatch) => {
        return {
            returnItem: (listItem) => returnItem(listItem)(dispatch)
        }
    }
)(BoughtItem);
