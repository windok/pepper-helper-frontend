import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ListModel from 'Models/List';

import Header from 'Components/Header';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/send';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import {getList} from 'Reducers/storage/list';
import {update as editList} from 'Actions/list';
import {showMenu} from 'Actions/ui';

class EditList extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = params.list.serialize();
    }

    render() {
        if (this.props.list.isNullObject()) {
            return (
                <div>
                    <Header title={"Create product list"}
                            leftLinks={<IconButton onTouchTap={this.props.cancel}><CloseIcon/></IconButton>}
                            rightLinks={<IconButton onTouchTap={() => this.props.save(this.state.name)}><SaveIcon/></IconButton>}/>
                </div>
            )
        }

        return (
            <div>
                <Header title={"Edit product list"}
                        leftLinks={<IconButton onTouchTap={this.props.cancel}><CloseIcon/></IconButton>}
                        rightLinks={<IconButton onTouchTap={() => this.props.save(this.props.list, this.state.name)}><SaveIcon/></IconButton>}/>

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
            cancel: () => {
                history.goBack();
                showMenu()(dispatch);
            },
            save: (oldList, newListName) => {
                editList(oldList, newListName)(dispatch);
                history.goBack();
                showMenu()(dispatch);
            }
        }
    }
)(EditList);