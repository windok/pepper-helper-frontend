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

    shouldComponentUpdate({productListId, translationId}) {
        if (
            this.props.productListId !== productListId
            || this.props.translationId !== translationId
        ) {
            this.props.getTemplate(productListId, translationId);
        }

        return true;
    }

    componentDidUpdate({template}) {
        if (
            Object.keys(this.props.template).length > 0
            && this.props.template !== template
        ) {
            this.setState({template: this.props.template});
        }
    }

    onTemplateFieldChange(event) {
        this.setState({
            template: {...this.state.template, [event.target.name]: event.target.value}
        });
    }

    render() {
        if (Object.keys(this.state.template).length === 0) {
            return <div></div>
        }

        const listId = this.props.productListId;

        return (
            <div>
                <Link to={"/product-list/" + listId + "/add-item/search"}
                      onClick={() => this.props.cancelHandler(listId)}>Cancel</Link>
                <br/>
                <Link to={"/product-list/" + listId} onClick={() => this.props.saveItemHandler(this.state.template)}>Save</Link>
                <br/>
                Add item to {this.props.productListName} <br/>
                <div>
                    <label>Group:
                        <select
                            value={this.state.template.groupId}
                            name="groupId"
                            onChange={this.onTemplateFieldChange.bind(this)}>
                            {Object.keys(this.props.groups).map((groupId) => {
                                return <option key={groupId} value={groupId}>{this.props.groups[groupId].name}</option>
                            })}
                        </select>
                    </label>
                </div>
                <div>
                    <label>Unit:
                        <select
                            value={this.state.template.unitId}
                            name="unitId"
                            onChange={this.onTemplateFieldChange.bind(this)}>
                            {Object.keys(this.props.units).map((unitId) => {
                                return <option key={unitId} value={unitId}>{this.props.units[unitId].name}</option>
                            })}
                        </select>
                    </label>
                </div>
                <div>
                    <label>Quantity:
                        <input type="text"
                               name="quantity"
                               value={this.state.template.quantity}
                               onChange={this.onTemplateFieldChange.bind(this)}/>
                    </label>
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
