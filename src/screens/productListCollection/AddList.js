import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';
import TextField from 'material-ui/TextField';

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
                        leftLinks={<BackButton onTouchTap={this.props.cancel}/>}
                        rightLinks={<SaveButton onTouchTap={() => this.props.save(this.state.name)}/>}/>

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
        return {}
    },
    (dispatch, {history}) => {
        return {
            cancel: () => showMenu()(dispatch),
            save: (listName) => {
                createList(listName)(dispatch);
                history.goBack();
                showMenu()(dispatch);
            }
        }
    }
)(AddList);