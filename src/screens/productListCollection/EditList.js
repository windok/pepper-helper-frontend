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
import Button from 'react-md/lib/Buttons';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';

import SharedListOwners from './components/SharedListOwners';
import ShareListDialog from './components/ShareListDialog';

import {getList} from 'Reducers/list';

import {updateList, deleteList, fetchSharedListOwners} from 'Actions/list';

import {redirectToDefaultList} from 'Services/BrowserHistory';

const styles = {
    shareListButton: {
        width: '100%',
        padding: '10px'
    }
};

class EditList extends React.PureComponent {
    constructor(params) {
        super(params);

        this.state = {
            list: {...params.list.serialize()},
            shareDialogVisible: false
        };
    }

    componentWillReceiveProps({list}) {
        if (list.getIdentifier() !== this.state.id) {
            this.setState({list: list.serialize()});
        }
    }

    showShareDialog = () => {
        this.setState({shareDialogVisible: true});
    };

    hideShareDialog = () => {
        // todo remove loading data from representation component. move to some HOC or somehow else
        this.props.loadListOwners();
        this.setState({shareDialogVisible: false});
    };


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
                        onClick={() => this.props.save(this.props.list, this.state.list.name)}
                    />]}
                />

                <form className="md-grid">
                    <TextField
                        id="listName"
                        label="List name"
                        customSize="title"
                        required
                        defaultValue={this.state.list.name}
                        className="md-cell md-cell--12"
                        onChange={(value) => this.setState({list: {...this.state.list, name: value}})}
                    />
                </form>

                <SharedListOwners list={this.props.list}/>

                <div style={styles.shareListButton}>
                <Button
                    raised
                    iconEl={<FontIcon>share</FontIcon>}
                    onClick={this.showShareDialog}
                    style={{width: '100%'}}
                >Share list</Button>
                <ShareListDialog
                    list={this.props.list}
                    visible={this.state.shareDialogVisible}
                    hide={this.hideShareDialog}/>
                </div>

                <Divider style={{marginTop: 40, marginBottom: 40}}/>

                <DeleteButton text="Delete list" onClick={() => this.props.delete(this.props.list)}/>

            </div>
        );
    }

    componentDidMount() {
        // todo remove loading data from representation component. move to some HOC or somehow else
        this.props.loadListOwners();
    }
}

EditList.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,

    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    loadListOwners: PropTypes.func.isRequired,
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
        },
        loadListOwners: () => dispatch(fetchSharedListOwners())
    })
)(ensureListExists(EditList));