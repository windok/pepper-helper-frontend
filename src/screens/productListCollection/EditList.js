import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ListModel from 'Models/List';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';
import TextField from 'material-ui/TextField';

import {getList} from 'Reducers/storage/list';
import {update as editList} from 'Actions/list';
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
                            leftLinks={<BackButton onTouchTap={this.props.cancel}/>}/>
                </div>
            )
        }

        return (
            <div>
                <Header title={"Edit product list"}
                        leftLinks={<BackButton onTouchTap={this.props.cancel}/>}
                        rightLinks={<SaveButton onTouchTap={() => this.props.save(this.props.list, this.state.name)}/>}/>

                <TextField
                    hintText="List name"
                    floatingLabelText="List name"
                    defaultValue={this.state.name}
                    onChange={(event) => this.setState({name: event.target.value})}/>

            </div>
        );
    }
}

EditList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
};

export default connect(
    (state, {match}) => {
        return {
            list: getList(state, parseInt(match.params.listId) || 0)
        }
    },
    (dispatch, {history}) => {
        return {
            cancel: () => showMenu()(dispatch),
            save: (oldList, newListName) => {
                editList(oldList, newListName)(dispatch);
                history.goBack();
                showMenu()(dispatch);
            }
        }
    }
)(EditList);