import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';
import TextField from 'react-md/lib/TextFields';

import {create as createList} from 'Actions/list';

class AddList extends React.PureComponent {
    state = {
        name: ''
    };

    render() {
        return (
            <div>
                <Header title={"Create product list"}
                        leftLinks={<BackButton onClick={this.props.cancel}/>}
                        rightLinks={<SaveButton onClick={() => this.props.save(this.state.name)}/>}/>
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

AddList.propTypes = {
    cancel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
};

export default connect(
    null,
    (dispatch, {history}) => {
        return {
            cancel: () => history.goBack(),
            save: (listName) => {
                const list = createList(listName)(dispatch);
                history.push('/product-list/' + list.getTmpId());
            }
        }
    }
)(AddList);