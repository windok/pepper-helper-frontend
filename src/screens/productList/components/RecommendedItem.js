import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem as ListItemModel} from 'Models/ListItem';

import ListItem from 'react-md/lib/Lists/ListItem';
import ItemLabel from './Item';

import history from 'Services/BrowserHistory';

class RecommendedItem extends React.PureComponent {
    render() {
        const label = <ItemLabel item={this.props.item}/>;

        return (
            <ListItem
                primaryText={label}
                onClick={() => this.props.editItem(this.props.item)}>
            </ListItem>
        )
    }
}

RecommendedItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    editItem: PropTypes.func.isRequired
};

export default connect(
    (state, {item}) => {
        return {item}
    },
    (dispatch) => {
        return {
            editItem: (listItem) => history.push('/product-list/' + listItem.getListId() + '/item/' + listItem.getId()),
        }
    }
)(RecommendedItem);
