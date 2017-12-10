import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ListItem as ListItemModel} from 'Models/ListItem';
import {Product} from 'Models/Product';
import {Unit} from 'Models/Unit';
import ItemAction from './ItemAction';

import FontIcon from 'react-md/lib/FontIcons';
import Avatar from 'react-md/lib/Avatars';
import Chip from 'react-md/lib/Chips';
import ListItem from 'react-md/lib/Lists/ListItem';
import SwipeToRevealOptions from 'react-swipe-to-reveal-options';

import {getProduct} from 'Reducers/product';
import {getUnit} from 'Reducers/unit';

class Item extends React.PureComponent {

    createIcon(itemAction) {
        return (<FontIcon className="md-cell--phone-hidden" onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            itemAction.getFunction()(this.props.item);
        }}>{itemAction.getIconType()}</FontIcon>);
    }

    createSwipe(itemAction) {
        return [{
            label: (
                <div className="text-with-icon"><FontIcon style={{color: 'white'}}>{itemAction.getIconType()}</FontIcon>{itemAction.getText()}</div>),
            'class': itemAction.getClassName()
        }]
    }

    render() {

        return (
            <div className="item-container">
                <SwipeToRevealOptions
                    leftOptions={this.createSwipe(this.props.leftAction)}
                    rightOptions={this.createSwipe(this.props.rightAction)}
                    onLeftClick={() => this.props.leftAction.getFunction()(this.props.item)}
                    onRightClick={() => this.props.rightAction.getFunction()(this.props.item)}
                    callActionWhenSwipingFarRight={true}
                    callActionWhenSwipingFarLeft={true}
                >
                    <ListItem
                        id=""
                        leftAvatar={<Avatar random>{this.props.product.getName()[0]}</Avatar>}
                        primaryText={this.props.product.getName()}
                        onClick={() => this.props.onClick(this.props.item)}
                        rightIcon={<div>
                            <Chip label={<span><span
                                className="md-font-semibold">{this.props.item.getQuantity()}</span>&nbsp;{this.props.unit.getName()}</span>}
                            />
                            {this.props.leftAction && this.createIcon(this.props.leftAction)}
                            {this.props.rightAction && this.createIcon(this.props.rightAction)}
                        </div>}
                    />
                </SwipeToRevealOptions>
            </div>
        )
    }
}

Item.propTypes = {
    item: PropTypes.instanceOf(ListItemModel).isRequired,
    product: PropTypes.instanceOf(Product).isRequired,
    unit: PropTypes.instanceOf(Unit).isRequired,
    onClick: PropTypes.instanceOf(Function),
    leftAction: PropTypes.instanceOf(ItemAction),
    rightAction: PropTypes.instanceOf(ItemAction),
};

export default connect(
    (state, {item, leftAction, rightAction, onClick}) => ({
        item,
        product: getProduct(state, item.getProductId()),
        unit: getUnit(state, item.getUnitId()),
        onClick: onClick || function() {},
        leftAction,
        rightAction
    })
)(Item);
