import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem as ListItemModel} from 'Models/ListItem';

import ListItem from 'react-md/lib/Lists/ListItem';
import Icon from 'react-md/lib/FontIcons';
import ItemLabel from './ItemLabel';

import {returnItem} from 'Actions/listItem';

class BoughtItem extends React.PureComponent {
    render() {
        const returnButton = (
            <Icon onTouchTap={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                this.props.returnItem(this.props.item);
            }}> undo </Icon>
        );

        const label = <ItemLabel item={this.props.item} style={{textDecoration: 'line-through'}}/>;

        return (
            <ListItem primaryText={label} rightIcon={returnButton}/>
        )
    }
}

BoughtItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
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

