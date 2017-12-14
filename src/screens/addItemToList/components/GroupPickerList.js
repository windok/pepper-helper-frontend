import React from 'react';
import PropTypes from 'prop-types'
import {connect} from "react-redux";

import Avatar from 'react-md/lib/Avatars/Avatar';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';

import {getGroupCollection} from 'Reducers/group';

const styles = {
};

class GroupPickerList extends React.PureComponent {
    render() {
        return (
            <List>
                {Array.from(this.props.groups, ([groupId, group]) => (
                    <ListItem key={group.getIdentifier()}
                              leftAvatar={<Avatar random>{group.getName().trim()[0]}</Avatar>}
                              primaryText={group.getName()}
                              onClick={() => this.props.onGroupPick(group)}>
                        {}
                    </ListItem>
                ))}
            </List>
        );
    }
}

GroupPickerList.propTypes = {
    groups: PropTypes.instanceOf(Map).isRequired,

    onGroupPick: PropTypes.func.isRequired,
};

export default connect(
    (state, {selectedGroupId}) => ({
        groups: getGroupCollection(state)
    })
)(GroupPickerList);
