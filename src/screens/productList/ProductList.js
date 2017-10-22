import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

import {redirectToDefaultList} from 'Services/BrowserHistory';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import MenuButton from 'Components/buttons/MenuButton';
import Button from 'react-md/lib/Buttons';
import SVGIcon from 'react-md/lib/SVGIcons';

import {getList, getFirstList} from 'Reducers/list';

import {fetchItemsForList} from 'Actions/listItem';

import ListComponent from './components/ListAggregatedByGroup';
import DraftItem from './components/DraftItem';

import pepperLogo from 'Assets/hot-pepper.svg';

class ProductListScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        if (this.redirectToDefaultListIfNecessary(this.props.list)) {
            return;
        }

        props.fetchListItems(props.list);
    }

    componentWillReceiveProps({list}) {
        if (this.redirectToDefaultListIfNecessary(list)) {
            return;
        }

        if (list !== this.props.list) {
            this.props.fetchListItems(list);
        }
    }

    redirectToDefaultListIfNecessary(list) {
        if (!list.isNullObject()) {
            return false;
        }

        redirectToDefaultList();

        return true;
    }

    render() {
        return (
            <div>
                <Sidebar currentList={this.props.list}/>
                <Header
                    title={this.props.list.getName()}
                    leftLinks={<MenuButton key="void"/>}
                    rightLinks={<Button icon key="edit-list" onClick={() => this.props.editList(this.props.list)}>settings</Button>}
                />

                <ListComponent list={this.props.list} itemComponent={DraftItem}/>

                <div style={{marginTop: '180px'}}/>

                <Button onClick={() => this.props.showRecommendations(this.props.list)}
                        floating
                        fixed
                        secondary
                        style={{
                            bottom: 90
                        }}>
                    <SVGIcon use={pepperLogo.url} style={{fill: 'white'}}/>
                </Button>

                <Button
                    onClick={() => this.props.addItem(this.props.list)}
                    floating fixed primary
                >add</Button>
            </div>
        )
    }
}

ProductListScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel).isRequired,
    fetchListItems: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    editList: PropTypes.func.isRequired,
    showRecommendations: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => ({
        list: match.params.hasOwnProperty('listId') ? getList(state, match.params.listId || 0) : getFirstList(state)
    }),
    (dispatch, {history}) => ({
        fetchListItems: (list) => fetchItemsForList(list)(dispatch),
        addItem: (list) => history.push('/product-list/' + list.getIdentifier() + '/item/search'),
        editList: (list) => history.push('/product-list/' + list.getIdentifier() + '/edit'),
        showRecommendations: (list) => history.push('/product-list/' + list.getIdentifier() + '/recommendations')
    })
)(ProductListScreen));
