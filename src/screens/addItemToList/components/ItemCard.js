import React from 'react';
import PropTypes from 'prop-types'

import TextField from 'react-md/lib/TextFields';

import UnitSelect from './UnitSelect';
import GroupPicker from './GroupPicker';

const styles = {
    formField: {
        margin: '0px auto',
        width: '100%'
    },
    selectGroup: {
        flex: '0 1 auto',
        padding: 0
    },
};

class ItemCard extends React.PureComponent {
    render() {
        return this.props.listItem ?
            (
                <div className="md-grid">
                    <div className="md-cell--2 md-cell--0-tablet md-cell--0-phone"></div>
                    <form className="md-cell--8 md-cell--8-tablet md-cell--4-phone">
                        <TextField
                            disabled
                            style={styles.formField}
                            id="name"
                            label="Product"
                            size="title"
                            defaultValue={this.props.listItem.name}
                        />

                        <GroupPicker
                            style={styles.selectGroup}
                            selectedGroupId={this.props.listItem.groupId}
                            onChange={(groupId) => this.props.onListItemFieldChange('groupId', groupId)}
                        />

                        <TextField
                            id="quantity"
                            label="Quantity"
                            type="number"
                            style={styles.formField}
                            value={this.props.listItem.quantity}
                            onChange={(value) => this.props.onListItemFieldChange('quantity', value)}
                        />

                        <UnitSelect
                            style={styles.formField}
                            unitId={this.props.listItem.unitId}
                            onUnitChange={(unitId) => this.props.onListItemFieldChange('unitId', unitId)}
                        />

                    </form>
                    <div className="md-cell--2 md-cell--0-tablet md-cell--0-phone"></div>
                </div>
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
