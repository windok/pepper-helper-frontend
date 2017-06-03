import React from 'react';
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {getTemplate, createItem} from 'Actions/listItem';

class AddItemToList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            template: props.template
        };
    }

    componentWillMount() {
        this.props.getTemplate(this.props.productListId, this.props.translationId);
    }

    shouldComponentUpdate({productListId, translationId, template}) {
        if (this.props.productListId !== productListId || this.props.translationId !== translationId) {
            this.props.getTemplate(productListId, translationId);
        }


        // todo to keep item template in redux store instead of compoent state, bind changes of select and inputs to update redux store
        this.setState({template});

        return true;
    }

    render() {
        if (Object.keys(this.props.template).length === 0) {
            return <div></div>
        }

        const listId = this.props.productListId;

        return (
            <div>
                <Link to={"/product-list/" + listId + "/add-item/search"}
                      onClick={() => this.props.cancelHandler(listId)}>Cancel</Link>
                <br/>
                <Link to={"/product-list/" + listId} onClick={() => this.props.saveItemHandler(this.props.template)}>Save</Link>
                <br/>
                Add item to {this.props.productListName} <br/>
                <div>
                    <label>Group: <select value={this.props.groups[this.props.template.groupId].name} readOnly>
                        {Object.keys(this.props.groups).map((groupId) => {
                            return <option key={groupId}>{this.props.groups[groupId].name}</option>
                        })}
                    </select></label>
                </div>
                <div>
                    <label>Unit: <select value={this.props.units[this.props.template.unitId].name} readOnly>
                        {Object.keys(this.props.units).map((unitId) => {
                            return <option key={unitId}>{this.props.units[unitId].name}</option>
                        })}
                    </select></label>
                </div>
                <div>
                    <label>Quantity: <input type="text" value={this.props.template.quantity} readOnly/></label>
                </div>

            </div>
        )
    }
}

AddItemToList.propTypes = {
    productListId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    translationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    productListName: PropTypes.string.isRequired,
    template: PropTypes.shape({
        // id: PropTypes.any,
        // listId: PropTypes.any,
        // productId: PropTypes.any,
        // unitId: PropTypes.any,
        // translationValue: PropTypes.any,
        // unitName: PropTypes.any,
        // groupName: PropTypes.any,
        // status: PropTypes.any
    }).isRequired,
    cancelHandler: PropTypes.func.isRequired,
    saveItemHandler: PropTypes.func.isRequired,
    getTemplate: PropTypes.func.isRequired
};

export default withRouter(connect(
    (state, ownProps) => {
        const {productListId, translationId}= ownProps.match.params;

        const productList = state.storage.list.data[productListId];

        if (!productList) {
            return {
                productListId: 0,
                translationId: 0,
                productListName: 'n/a',
                template: {},
            }
        }

        return {
            productListId,
            translationId,
            productListName: productList.name,
            template: state.storage.listItem.template,
            groups: state.storage.group.items,
            units: state.storage.unit.items,
            translations: state.storage.translation.items,
        }
    },
    (dispatch) => {
        return {
            cancelHandler: (listId) => {
            },
            saveItemHandler: (template) => createItem(template)(dispatch),
            getTemplate: (listId, translationId) => getTemplate(listId, translationId)(dispatch)

        }
    }
)(AddItemToList));
