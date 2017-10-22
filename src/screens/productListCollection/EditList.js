import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ListModel from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';
import TextField from 'react-md/lib/TextFields';
import Divider from 'react-md/lib/Dividers';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';
import DialogContainer from 'react-md/lib/Dialogs';

import {getList, getFirstList} from 'Reducers/list';
import {updateList, deleteList} from 'Actions/list';

class EditList extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = {deleteDialog: false, ...params.list.serialize()};
    }

    componentWillReceiveProps({list}) {
        if (list.getIdentifier() !== this.state.id) {
            this.setState(list.serialize());
        }
    }

    showDeleteDialog = () => {
        this.setState({deleteDialog: true});
    };

    hideDeleteDialog = () => {
        this.setState({deleteDialog: false});
    };

    render() {

        const actions = [];
        actions.push({secondary: true, children: 'Cancel', onClick: this.hideDeleteDialog});
        actions.push(<Button flat primary onClick={() => {
            this.hideDeleteDialog();
            this.props.delete(this.props.list);
        }}>Confirm</Button>);

        return (
            <div>
                <Header
                    title={"Edit product list"}
                    leftLinks={<BackButton iconType="clear" />}
                    rightLinks={[<SaveButton
                        key="save"
                        onClick={() => this.props.save(this.props.list, this.state.name)}
                    />]}
                />

                <form className="md-grid">
                    <TextField
                        id="listName"
                        label="List name"
                        customSize="title"
                        required
                        defaultValue={this.state.name}
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({name: value})}
                    />
                </form>

                <Divider style={{marginTop: 40, marginBottom: 40}}/>

                <div className="md-grid">
                    <Button
                        raised
                        secondary
                        iconBefore={false}
                        iconEl={<FontIcon>delete</FontIcon>}
                        onClick={this.showDeleteDialog}
                        className="md-cell--right"
                    >Delete list</Button>
                </div>

                <DialogContainer
                    id="delete-list-dialog"
                    visible={this.state.deleteDialog}
                    onHide={this.hideDeleteDialog}
                    actions={actions}
                    title="Are you sure to delete?"
                />
            </div>
        );
    }
}

EditList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    isDeleteAllowed: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
};

export default connect(
    (state, {match}) => {

        const list = getList(state, match.params.listId || 0);

        return {
            list,
            isDeleteAllowed: list !== getFirstList(state)
        }
    },
    (dispatch, {history}) => {
        return {
            save: (list, newListName) => {
                updateList(list, newListName)(dispatch);
                history.push('/product-list/' + list.getIdentifier());
            },
            delete: (list) => {
                deleteList(list)(dispatch);
                history.push('/');
            }
        }
    }
)(EditList);