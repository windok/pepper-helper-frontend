import moment from 'moment';

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import {List as ListModel} from 'Models/List';
import {STATUS_DRAFT, TYPE_GENERAL} from 'Models/ListItem';

import {redirectToDefaultList} from 'Services/BrowserHistory';

import Sidebar from 'Components/Sidebar';
import Header from 'Components/Header';
import MenuButton from 'Components/buttons/MenuButton';
import Button from 'react-md/lib/Buttons';
import SVGIcon from 'react-md/lib/SVGIcons';

import {getList, getSelectedList, getFirstList} from 'Reducers/list';

import {selectProductList} from 'Actions/list';

import NoList from './components/NoList';
import ListComponent from './components/ListAggregatedByGroup';
import DraftItem from './components/DraftItem';

class ProductListScreen extends React.PureComponent {
    render() {
        if (this.props.list === null) {
            return (<NoList/>);
        }

        if (this.props.list.isNullObject()) {
            return null;
        }

        return (
            <div>
                <Sidebar/>
                <Header
                    title={this.props.list.getName()}
                    leftLinks={<MenuButton key="void"/>}
                    rightLinks={<Button icon key="edit-list" onClick={() => this.props.editList(this.props.list)}>settings</Button>}
                />

                {!this.props.list.isNullObject() && <ListComponent
                    list={this.props.list}
                    itemFilterFunc={(item) => {
                        const today = moment.utc();
                        const nextDay = moment.utc(today.add(1, 'day').format('YYYY-MM-DD'), 'YYYY-MM-DD');
                        const isItemActual = nextDay.isAfter(item.getDate());

                        return item.getListId() === this.props.list.getIdentifier()
                            && item.getStatus() === STATUS_DRAFT
                            && item.getType() === TYPE_GENERAL
                            && isItemActual
                    }}
                    itemComponent={DraftItem}
                />}

                <div style={{marginTop: '180px'}}/>

                <Button onClick={() => this.props.showRecommendations(this.props.list)}
                        floating
                        fixed
                        secondary
                        style={{
                            bottom: 90
                        }}>
                    <SVGIcon use="#logo" style={{fill: 'white'}}/>
                </Button>

                <Button
                    onClick={() => this.props.addItem(this.props.list)}
                    floating fixed primary
                >add</Button>
            </div>
        )
    }

    afterRender(prevList) {
        if (this.props.list && this.props.list.isNullObject()) {
            redirectToDefaultList();
        }

        if(this.props.list && !this.props.list.isNullObject() && prevList !== this.props.list) {
            this.props.selectList(this.props.list);
        }
    }

    componentDidMount() {
        this.afterRender(null);
    }

    componentDidUpdate({list}) {
        this.afterRender(list);
    }
}

ProductListScreen.propTypes = {
    list: PropTypes.instanceOf(ListModel),

    selectList: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    editList: PropTypes.func.isRequired,
    showRecommendations: PropTypes.func.isRequired,
};

export default withRouter(connect(
    (state, {match}) => ({
        list: match.params.hasOwnProperty('listId')
            ? getList(state, match.params.listId)
            : getSelectedList(state) || getFirstList(state),
    }),
    (dispatch, {history}) => ({
        selectList: (list) => dispatch(selectProductList(list)),
        addItem: (list) => history.push('/product-list/' + list.getIdentifier() + '/item/search'),
        editList: (list) => history.push('/product-list/' + list.getIdentifier() + '/edit'),
        showRecommendations: (list) => history.push('/product-list/' + list.getIdentifier() + '/recommendations')
    })
)(ProductListScreen));
