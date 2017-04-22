import React, {Component, PropTypes} from 'react';

class AddActivity extends Component {

    constructor(props) {
        super(props);

        this.onSaveButtonClicked = this.onSaveButtonClicked.bind(this);

        // todo get fields list as props
        this.state = {
            fields: {
                name: '',
            }
        };
    }


    onFieldChanged = (e) => {
        const fieldValues = {...this.state.fields};
        fieldValues[e.target.name] = e.target.value;

        this.setState({
            fields: fieldValues
        });
    };

    onSaveButtonClicked() {
        if (this.state.fields.name === '') {
            return;
        }

        this.props.handleNewActivity(this.state.fields.name);

        this.setState({
            fields: {
                name: '',
            }
        })
    }

    render() {
        // todo autogenerate fields
        return (
            <div>
                Name: <input
                    type="text"
                    name="name"
                    value={this.state.fields.name}
                    placeholder="Enter name"
                    onChange={this.onFieldChanged}
                />

                <button onClick={this.onSaveButtonClicked}>Save</button>
            </div>
        );
    }
}

AddActivity.propTypes = {
    handleNewActivity: PropTypes.func.isRequired
};

export default AddActivity;