import React from 'react';
import PropTypes from 'prop-types'
import Select from 'Components/form/Select';
import {connect} from 'react-redux';

import {getUnitCollection} from 'Reducers/storage/unit';

class UnitSelect extends React.PureComponent {
    render() {

        const options = [];
        this.props.units.forEach((unit) => {
            options.push({
                value: unit.getId(),
                label: unit.getName()
            });
        });

        return (
        <Select label="Unit"
                defaultValue={this.props.unitId}
                options={options}
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
            units: getUnitCollection(state)
        }
    }
)(UnitSelect);