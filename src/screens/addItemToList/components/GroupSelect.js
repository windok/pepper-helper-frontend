import React from 'react';
import PropTypes from 'prop-types'
import Select from 'Components/form/Select';
import {connect} from 'react-redux';

// todo create user group if not found
class GroupSelect extends React.PureComponent {
    render() {
        const options = [];
        this.props.groups.forEach((group) => options.push({
                value: group.getId(),
                label: group.getName()
            }
        ));

        return (
            <Select label="Group"
                    defaultValue={this.props.groupId}
                    options={options}
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
            groups: state.storage.group.items
        }
    }
)(GroupSelect);