import React from 'react';
import PropTypes from 'prop-types'

import TextField from 'react-md/lib/TextFields';

import UnitSelect from './UnitSelect';
import SelectGroupDialog from './SelectGroupDialog';

class ItemCard extends React.PureComponent {
    render() {
        return this.props.listItem ?
            (
                <form className="md-grid">

                    <TextField
                        disabled
                        id="name"
                        label="Product"
                        size="title"
                        className="md-cell md-cell--12"
                        defaultValue={this.props.listItem.name}
                    />

                    <SelectGroupDialog
                        className="md-cell md-cell--12"
                        selectedGroupId={this.props.listItem.groupId}
                        onChange={(groupId) => this.props.onListItemFieldChange('groupId', groupId)}
                    />

                    <TextField
                        id="quantity"
                        label="Quantity"
                        className="md-cell md-cell--12"
                        defaultValue={this.props.listItem.quantity}
                        onChange={(value) => this.props.onListItemFieldChange('quantity', value)}
                    />

                    <UnitSelect
                        className="md-cell md-cell--12"
                        unitId={this.props.listItem.unitId}
                        onUnitChange={(unitId) => this.props.onListItemFieldChange('unitId', unitId)}
                    />

                </form>
            )
            : (<div></div>);
    }
}

ItemCard.propTypes = {
    listItem: PropTypes.shape({
        name: PropTypes.isRequired,
        groupId: PropTypes.isRequired,
        unitId: PropTypes.isRequired,
        quantity: PropTypes.isRequired,
    }).isRequired,
    onListItemFieldChange: PropTypes.func.isRequired
};

export default ItemCard;
