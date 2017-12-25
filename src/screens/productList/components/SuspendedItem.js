import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';

import {ListItem as ListItemModel} from 'Models/ListItem';

import Item from './Item';
import ItemAction from './ItemAction';
import SuspendDialog from './SuspendDialog';

import {suspendItem} from 'Actions/listItem';

class SuspendedItem extends React.PureComponent {
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
            this.props.returnItemToList,
            'undo',
            'To list',
            'item-return'
        );

        const rightAction = new ItemAction(
            this.showSuspendDialog,
            'schedule',
            'Schedule',
            'item-suspend'
        );

        return (
            <div>
                <Item
                    leftAction={leftAction}
                    rightAction={rightAction}
                    item={this.props.item}
                />

                <SuspendDialog
                    listItem={this.props.item}
                    visible={this.state.suspendDialogVisible}
                    hideDialog={this.hideSuspendDialog}
                />
        </div>
        );
    }
}

SuspendedItem.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    returnItemToList: PropTypes.func.isRequired
};

export default connect(
    null,
    (dispatch, {item}) => ({
        returnItemToList: () => dispatch(suspendItem(item, moment.utc()))
    })
)(SuspendedItem);

