import React, {Component, PropTypes} from 'react';

class ActivityCard extends Component {

    constructor(props) {
        super(props);

        this.onSaveButtonClicked = this.onSaveButtonClicked.bind(this);

        this.state = {
            fields: props.fields
        };
    }

    onFieldChanged = (e) => {
        console.log(e);
        console.log(e.target);
        console.log(this);

        const fields = this.state.fields.map((field) => {
            if (field.label !== e.target.name) {
                return field;
            }

            field.value = e.target.value;

            return field;
        });

        this.setState({
            fields: fields
        });
    };

    onSaveButtonClicked() {
        this.props.handleUpdateActivity(this.state.fields);
    }

    render() {
        return (
            <div>
                {this.state.fields.map((field) => {
                    return (
                        <div key={field.label}>
                            {field.label}:
                            <input
                                type="text"
                                name={field.label}
                                value={field.value}
                                onChange={this.onFieldChanged}
                                disabled={!field.editable}
                            />
                        </div>
                    );
                })}

                <button onClick={this.onSaveButtonClicked}>Save</button>
            </div>
        );
    }
}

ActivityCard.propTypes = {
    fields: PropTypes.array.isRequired,
    handleUpdateActivity: PropTypes.func.isRequired
};

export default ActivityCard;