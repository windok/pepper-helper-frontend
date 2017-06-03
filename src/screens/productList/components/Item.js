import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class Item extends React.PureComponent {
    render() {
        return (
            <span>{this.props.groupName}: {this.props.translationValue} - {this.props.quantity} {this.props.unitName}</span>
        )
    }
}

Item.propTypes = {
    id: PropTypes.any.isRequired,
    translationId: PropTypes.any.isRequired,
    translationValue: PropTypes.any.isRequired,
    groupId: PropTypes.any.isRequired,
    groupName: PropTypes.any.isRequired,
    unitId: PropTypes.any.isRequired,
    unitName: PropTypes.any.isRequired,
    quantity: PropTypes.any.isRequired,
    status: PropTypes.any.isRequired,
};

export default connect(
    (state, {id}) => {
        const item = state.storage.listItem.items[id];

        if (!item) {
            return {
                id,
                translationId: 'n/a',
                translationValue: 'n/a',
                groupId: 'n/a',
                groupName: 'n/a',
                unitId: 'n/a',
                unitName: 'n/a',
                quantity: 'n/a',
                status: 'n/a',
            };
        }

        const translation = state.storage.translation.items[item.translationId];
        const group = state.storage.group.items[item.groupId];
        const unit = state.storage.unit.items[item.unitId];

        return {
            id,
            translationId: item.translationId,
            translationValue: translation ? translation[state.storage.user.language] || translation.en : 'n/a',
            groupId: item.groupId,
            groupName: group ? group.name : 'n/a',  // todo show by user lang
            unitId: item.unitId,
            unitName: unit ? unit.name : 'n/a',
            quantity: item.quantity,
            status: item.status,
        }
    }
)(Item);
