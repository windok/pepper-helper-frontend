import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem} from 'Models/ListItem';

import {ListItem as ListItemComponent} from 'material-ui/List';
import ItemLabel from './ItemLabel';

import history from 'Services/BrowserHistory';

class RecommendedItem extends React.PureComponent {
    render() {
        return (
            <ListItemComponent onTouchTap={() => this.props.editItem(this.props.item)}>
                <ItemLabel item={this.props.item}/>
            </ListItemComponent>
        )
    }
}

RecommendedItem.propTypes = {
    item: PropTypes.instanceOf(ListItem).isRequired,
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
