import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'Components/Header';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui/svg-icons/content/send';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import {create as createList} from 'Actions/list';
import {showMenu} from 'Actions/ui';

class AddList extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = {name: ''};
    }

    render() {
        return (
            <div>
                <Header title={"Create product list"}
                        leftLinks={<IconButton onTouchTap={this.props.cancel}><CloseIcon/></IconButton>}
                        rightLinks={<IconButton onTouchTap={() => this.props.save(this.state.name)}><SaveIcon/></IconButton>}/>

                <TextField
                    hintText="List name"
                    floatingLabelText="List name"
                    value={this.state.name}
                    onChange={(event) => this.setState({name: event.target.value})}/>

            </div>
        );
    }
}

AddList.propTypes = {
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
};

export default connect(
    (state) => {
        return {

        }
    },
    (dispatch, {history}) => {
        return {
            cancel: () => {
                history.goBack();
                showMenu()(dispatch);
            },
            save: (listName) => {
                createList(listName)(dispatch);
                history.goBack();
                showMenu()(dispatch);
            }
        }
    }
)(AddList);