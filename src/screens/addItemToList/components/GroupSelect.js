import React from 'react';
import PropTypes from 'prop-types'
import SelectField from 'react-md/lib/SelectFields';
import {connect} from 'react-redux';

import {getGroupCollection} from 'Reducers/group';

class GroupSelect extends React.PureComponent {
    render() {
        const options = [];
        this.props.groups.forEach((group) => options.push({
                value: group.getId(),
                label: group.getName()
            }
        ));

        return (
            <SelectField
                id="group"
                label="Group"
                className={this.props.className}
                defaultValue={this.props.groupId}
                menuItems={options}
                onChange={this.props.onGroupChange}/>
        )
    }
}

GroupSelect.propTypes = {
    groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    groups: PropTypes.instanceOf(Map).isRequired,
    onGroupChange: PropTypes.func.isRequired
};

export default connect(
    (state) => {
        return {
            groups: getGroupCollection(state)
        }
    }
)(GroupSelect);