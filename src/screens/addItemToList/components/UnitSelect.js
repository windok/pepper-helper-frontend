import React from 'react';
import PropTypes from 'prop-types'
import SelectField from 'react-md/lib/SelectFields';
import {connect} from 'react-redux';

import {getUserUnitCollection} from 'Reducers/unit';

class UnitSelect extends React.PureComponent {
    render() {
        const options = Array.from(this.props.units.values(), unit => ({
            value: unit.getId(),
            label: unit.getName()
        }));

        return (
            <SelectField
                id="unitId"
                label="Unit"
                className={this.props.className}
                value={this.props.unitId}
                menuItems={options}
                onChange={this.props.onUnitChange}/>
        )
    }
}

UnitSelect.propTypes = {
    unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    units: PropTypes.instanceOf(Map).isRequired,
    onUnitChange: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            units: getUserUnitCollection(state),
        }
    }
)(UnitSelect);