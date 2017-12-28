import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ListModel from 'Models/List';

import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';

import {getSharedListOwners} from 'Reducers/user';
import {getListOwnerIds} from "Reducers/list";

class SharedListOwners extends React.PureComponent {
    render() {
        return (
            <List>
                {this.props.listOwnerIds.map(ownerId => (
                    <ListItem
                        key={ownerId}
                        leftAvatar={<Avatar random>{this.props.sharedListOwners.get(ownerId).getName().trim()[0]}</Avatar>}
                        primaryText={(
                            <div>
                                <div>{this.props.sharedListOwners.get(ownerId).getName()}</div>
                                <div>{this.props.sharedListOwners.get(ownerId).getEmail()}</div>
                            </div>
                        )}
                    />
                ))}
            </List>
        );
    }
}

SharedListOwners.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    sharedListOwners: PropTypes.instanceOf(Map).isRequired,
    listOwnerIds: PropTypes.instanceOf(Array).isRequired,

    addToast: PropTypes.func.isRequired
};

export default connect(
    (state, {list}) => ({
        sharedListOwners: getSharedListOwners(state),
        listOwnerIds: getListOwnerIds(state, list)
    })
)(SharedListOwners);