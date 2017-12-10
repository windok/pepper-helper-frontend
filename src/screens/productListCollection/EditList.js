import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import ListModel from 'Models/List';

import {ensureListExists} from 'Components/EnsureListExists';
import Header from 'Components/Header';
import BackButton from 'Components/buttons/BackButton';
import {SaveButton} from 'Components/buttons/Button';
import DeleteButton from 'Components/buttons/DeleteButton';
import TextField from 'react-md/lib/TextFields';
import Divider from 'react-md/lib/Dividers';

import ShareList from './components/ShareList';

import {getList} from 'Reducers/list';

import {updateList, deleteList} from 'Actions/list';

import {redirectToDefaultList} from 'Services/BrowserHistory';

class EditList extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = {...params.list.serialize()};
    }

    componentWillReceiveProps({list}) {
        if (list.getIdentifier() !== this.state.id) {
            this.setState(list.serialize());
        }
    }

    render() {
        if (this.props.list.isNullObject()) {
            return null;
        }

        return (
            <div>
                <Header
                    title={"Edit product list"}
                    leftLinks={<BackButton iconType="clear"/>}
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

                <ShareList list={this.props.list}/>

                <Divider style={{marginTop: 40, marginBottom: 40}}/>

                <DeleteButton text="Delete list" onClick={() => this.props.delete(this.props.list)}/>

            </div>
        );
    }
}

EditList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,

    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
};

export default connect(
    (state, {match}) => ({
        list: getList(state, match.params.listId)
    }),
    (dispatch, {history}) => ({
        save: (list, newListName) => {
            dispatch(updateList(list, newListName));
            history.push('/product-list/' + list.getIdentifier());
        },
        delete: (list) => {
            dispatch(deleteList(list));
            redirectToDefaultList()
        }
    })
)(ensureListExists(EditList));