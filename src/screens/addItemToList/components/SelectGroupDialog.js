import React from 'react';
import PropTypes from 'prop-types'
import {connect} from "react-redux";

import Button from 'react-md/lib/Buttons/Button';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import Avatar from 'react-md/lib/Avatars/Avatar';
import TextField from 'react-md/lib/TextFields/TextField';
import SelectField from 'react-md/lib/SelectFields';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Paper from 'react-md/lib/Papers/Paper';

import Group from "Models/Group";
import {createGroup} from 'Actions/group';

import {getGroup, getGroupCollection} from 'Reducers/group';

const styles = {
    paddingFromTopToolbar: {
        marginTop: '75px',
        marginBottom: '80px'
    },
    createGroupBox: {
        position: 'fixed',
        backgroundColor: 'white',
        bottom: '0px',
        width: '100%'
    }
};

class SelectGroupDialog extends React.PureComponent {
    state = {
        visible: false,
        pageX: 0,
        pageY: 0,
        newGroupName: ''
    };

    showDialog = (event) => {
        // provide a pageX/pageY to the dialog when making visible to make the
        // dialog "appear" from that x/y coordinate
        let {pageX, pageY} = event;
        if (event.changedTouches) {
            pageX = e.changedTouches[0].pageX;
            pageY = e.changedTouches[0].pageY;
        }

        this.setState({
            visible: true,
            pageX,
            pageY
        });
    };

    hideDialog = () => this.setState({visible: false});

    selectGroup = (group) => {
        this.props.onChange(group.getIdentifier());
        this.hideDialog();
        this.setState({
            newGroupName: ''
        });
    };

    onNewGroupNameChange = (newGroupName) => this.setState({newGroupName});

    createGroup = () => this.selectGroup(this.props.createGroup(this.state.newGroupName));

    render() {
        return (
            <div className="md-grid">

                {/* todo replace select field with container with the same styling */}
                <SelectField
                    id="group"
                    label="Group"
                    className="md-cell md-cell--12"
                    onClick={this.showDialog}
                    value={this.props.selectedGroup.getIdentifier()}
                    menuItems={[{
                        value: this.props.selectedGroup.getIdentifier(),
                        label: this.props.selectedGroup.getName()
                    }]}
                    onChange={() => {
                    }}
                />

                <DialogContainer
                    id="simple-full-page-dialog"
                    visible={this.state.visible}
                    pageX={this.state.pageX}
                    pageY={this.state.pageY}
                    fullPage
                    onHide={this.hideDialog}
                    className="md-cell"
                    aria-labelledby="simple-full-page-dialog-title"
                >
                    <Toolbar
                        fixed
                        colored
                        title="Select group"
                        titleId="simple-full-page-dialog-title"
                        nav={<Button icon onClick={this.hideDialog}>close</Button>}
                    />


                    <div style={styles.paddingFromTopToolbar}>
                        <List>
                            {Array.from(this.props.groups, ([groupId, group]) => (
                                <ListItem key={group.getIdentifier()}
                                          leftAvatar={<Avatar random>{group.getName().trim()[0]}</Avatar>}
                                          primaryText={group.getName()}
                                          onClick={() => this.selectGroup(group)}>
                                    {}
                                </ListItem>
                            ))}
                        </List>
                    </div>

                    <Paper
                        style={styles.createGroupBox}
                        className="md-grid md-box-shadow"
                    >
                        <TextField
                            id="newGroup"
                            label="Create new group"
                            className="md-cell--10 md-cell--7-tablet md-cell--3-phone"
                            defaultValue=''
                            onChange={this.onNewGroupNameChange}
                        />
                        <Button
                            icon
                            onClick={this.createGroup}
                            className="md-cell"
                        >add</Button>
                    </Paper>


                </DialogContainer>
            </div>
        );
    }
}

SelectGroupDialog.propTypes = {
    selectedGroupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    selectedGroup: PropTypes.instanceOf(Group).isRequired,
    groups: PropTypes.instanceOf(Map).isRequired,
    onChange: PropTypes.func.isRequired,

    createGroup: PropTypes.func.isRequired
};

export default connect(
    (state, {selectedGroupId}) => ({
        groups: getGroupCollection(state),
        selectedGroup: getGroup(state, selectedGroupId)
    }),
    dispatch => ({
        createGroup: (value) => dispatch(createGroup(value))
    })
)(SelectGroupDialog);
