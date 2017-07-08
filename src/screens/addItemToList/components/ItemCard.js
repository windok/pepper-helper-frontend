import React from 'react';
import PropTypes from 'prop-types'

import Input from 'Components/form/Input';

import UnitSelect from './UnitSelect';
import GroupSelect from './GroupSelect';

class ItemCard extends React.PureComponent {
    render() {
        return this.props.listItem ?
            (
                <div>
                    <GroupSelect groupId={this.props.listItem.groupId}
                                 onGroupChange={(groupId) => this.props.onListItemFieldChange('groupId', groupId)}/>

                    <UnitSelect unitId={this.props.listItem.unitId}
                                onUnitChange={(unitId) => this.props.onListItemFieldChange('unitId', unitId)}/>

                    <Input label="Quantity"
                           defaultValue={this.props.listItem.quantity}
                           onChange={(value) => this.props.onListItemFieldChange('quantity', value)}/>
                </div>
            )
            : (<div></div>);
    }
}

ItemCard.propTypes = {
    listItem: PropTypes.shape({
        groupId: PropTypes.isRequired,
        unitId: PropTypes.isRequired,
        quantity: PropTypes.isRequired,
    }).isRequired,
    onListItemFieldChange: PropTypes.func.isRequired
};

export default ItemCard;
