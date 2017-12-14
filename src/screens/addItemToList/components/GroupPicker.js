import React from 'react';
import PropTypes from 'prop-types'
import {connect} from "react-redux";

import Button from 'react-md/lib/Buttons/Button';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import TextField from 'react-md/lib/TextFields/TextField';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';

import FixedBottomContainer from 'Components/FixedBottomContainer';
import GroupPickerList from './GroupPickerList';

import Group from "Models/Group";
import {createGroup} from 'Actions/group';

import {getGroup, getGroupCollection} from 'Reducers/group';

const styles = {
    container: {
        padding: 0
    },
    selectElement: {
        width: '100%',
    },
    paddingFromTopToolbar: {
        marginTop: '70px',
        marginBottom: '80px'
    }
};

class GroupPicker extends React.PureComponent {
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
            <div className="md-grid" style={styles.container}>
                {/* todo replace with custom component */}
                <TextField
                    id="group"
                    label="Group"
                    style={styles.selectElement}
                    className="md-cell--12"
                    value={this.props.selectedGroup.getName()}
                    disabled
                    onClick={this.showDialog}
                />

                <DialogContainer
                    id="simple-full-page-dialog"
                    visible={this.state.visible}
                    pageX={this.state.pageX}
                    pageY={this.state.pageY}
                    fullPage
                    onHide={this.hideDialog}
                    className="md-cell--0"
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
                        <GroupPickerList onGroupPick={this.selectGroup}/>
                    </div>

                    <FixedBottomContainer>
                        <div className="md-cell--2 md-cell--0-tablet md-cell--0-phone"></div>
                        <div className="md-cell--8 md-cell--8-tablet md-cell--4-phone">
                            <TextField
                                id="newGroup"
                                label="Create new group"
                                defaultValue=''
                                style={{
                                    width: '80%',
                                    float: 'left'
                                }}
                                onChange={this.onNewGroupNameChange}
                            />
                            <Button
                                icon
                                style={{
                                    width: '20%',
                                    float: 'right'
                                }}
                                onClick={this.createGroup}
                            >add</Button>
                        </div>
                        <div className="md-cell--2 md-cell--0-tablet md-cell--0-phone"></div>
                    </FixedBottomContainer>

                </DialogContainer>
            </div>
        );
    }
}

GroupPicker.propTypes = {
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
)(GroupPicker);
