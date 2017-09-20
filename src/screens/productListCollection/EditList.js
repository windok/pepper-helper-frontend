import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ListModel from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';
import TextField from 'react-md/lib/TextFields';
import MenuItem from 'react-md/lib/Lists/ListItem';

import {getList, getFirstList} from 'Reducers/list';
import {updateList, deleteList} from 'Actions/list';
import {showMenu} from 'Actions/ui';

class EditList extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = params.list.serialize();
    }

    componentWillReceiveProps({list}) {
        if (list.getId() !== this.state.id) {
            this.setState(list.serialize());
        }
    }

    render() {
        if (this.props.list.isNullObject()) {
            return (
                <div>
                    <Header title={"Edit product list"}
                            leftLinks={<BackButton iconType="clear" onTouchTap={this.props.cancel}/>}/>
                </div>
            )
        }

        const options = this.props.isDeleteAllowed
            ? [<MenuItem key="delete" primaryText="Delete" onTouchTap={() => this.props.delete(this.props.list)}/>]
            : [];

        return (
            <div>
                <Header title={"Edit product list"}
                        leftLinks={<BackButton iconType="clear" onTouchTap={this.props.cancel}/>}
                        rightLinks={[<SaveButton key="save" onTouchTap={() => this.props.save(this.props.list, this.state.name)}/>]}
                        options={options}/>

                <form className="md-grid">
                    <TextField
                        id="listName"
                        label="List name"
                        customSize="title"
                        required
                        defaultValue={this.state.name}
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({name: value})}/>
                </form>
            </div>
        );
    }
}

EditList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    isDeleteAllowed: PropTypes.bool.isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
};

export default connect(
    (state, {match}) => {
        const list = getList(state, parseInt(match.params.listId) || 0);

        return {
            list,
            isDeleteAllowed: list !== getFirstList(state)
        }
    },
    (dispatch, {history}) => {
        return {
            cancel: () => showMenu()(dispatch),
            save: (oldList, newListName) => {
                updateList(oldList, newListName)(dispatch);
                history.goBack();
                showMenu()(dispatch);
            },
            delete: (list) => {
                deleteList(list)(dispatch);
                history.push('/');
                showMenu()(dispatch);
            }
        }
    }
)(EditList);