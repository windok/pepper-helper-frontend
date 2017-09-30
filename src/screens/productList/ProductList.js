import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';

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

        props.fetchListItems(props.list);
    }

    componentWillReceiveProps({list}) {
        if (list !== this.props.list) {
            this.props.fetchListItems(list);
        }
    }

    render() {
        return (
            <div>
                <Sidebar currentList={this.props.list}/>
                <Header
                    title={this.props.list.getName()}
                    leftLinks={<MenuButton key="void"/>}
                    rightLinks={<Button icon key="edit-list" onTouchTap={() => this.props.editList(this.props.list)}>settings</Button>}
                />

                <ListComponent list={this.props.list} itemComponent={DraftItem}/>

                <div style={{marginTop: '180px'}}/>

                <Button onTouchTap={() => this.props.showRecommendations(this.props.list)}
                        floating
                        fixed
                        secondary
                        style={{
                            bottom: 90
                        }}>
                    <SVGIcon use={pepperLogo.url} style={{fill: 'white'}}/>
                </Button>

                <Button
                    onTouchTap={() => this.props.addItem(this.props.list)}
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
    (state, {match}) => {
        // todo dirty hack to redirect to new list, consider another way
        const listId = (/^[0-9]+$/.test(match.params.listId) ? parseInt(match.params.listId) : match.params.listId) || 0;

        return {
            list: listId ? getList(state, listId) : getFirstList(state)
        };
    },
    (dispatch, {history}) => {
        return {
            fetchListItems: (list) => fetchItemsForList(list)(dispatch),
            addItem: (list) => history.push('/product-list/' + list.getId() + '/item/search'),
            editList: (list) => history.push('/product-list/' + list.getId() + '/edit'),
            showRecommendations: (list) => history.push('/product-list/' + list.getId() + '/recommendations')
        };
    }
)(ProductListScreen));
