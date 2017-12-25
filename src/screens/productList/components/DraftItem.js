import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from 'Services/BrowserHistory';

import {ListItem as ListItemModel} from 'Models/ListItem';

import Item from './Item';
import ItemAction from './ItemAction';
import SuspendDialog from './SuspendDialog';

import {buyItem} from 'Actions/listItem';

class DraftItem extends React.PureComponent {

    state = {
        suspendDialogVisible: false
    };

    showSuspendDialog = () => {
        this.setState({suspendDialogVisible: true});
    };

    hideSuspendDialog = () => {
        this.setState({suspendDialogVisible: false});
    };

    render() {
        const leftAction = new ItemAction(
            this.props.buyItem.bind(this),
            'done',
            'Buy',
            'item-buy'
        );

        const rightAction = new ItemAction(
            this.showSuspendDialog,
            'schedule',
            'Snooze',
            'item-suspend'
        );

        return (
            <div>
                <Item
                    leftAction={leftAction}
                    rightAction={rightAction}
                    item={this.props.item}
                    onClick={this.props.editItem.bind(this)}
                />

                <SuspendDialog
                    listItem={this.props.item}
                    visible={this.state.suspendDialogVisible}
                    hideDialog={this.hideSuspendDialog}
                />
            </div>
        )
    }
}

DraftItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    editItem: PropTypes.func.isRequired,
    buyItem: PropTypes.func.isRequired
};

export default connect(
    null,
    (dispatch) => ({
        editItem: (listItem) => history.push('/product-list/' + listItem.getListId() + '/item/' + listItem.getIdentifier()),
        buyItem: (listItem) => dispatch(buyItem(listItem))
    })
)(DraftItem);
