import React, {Component, PropTypes} from 'react';

class ActivityList extends Component {

    constructor(props) {
        super(props);
    }

    onEditButtonClicked(productId) {
        this.props.editActivityHandler(productId);
    }

    render() {
        return (
            <div>
                <strong>Activity list</strong>

                <br/>

                {this.props.activityCollection.map((activity) => {
                    return (
                        <div key={activity.id}>
                            Id: {activity.id} - Name: {activity.name} - State: {activity.state}
                            <button onClick={() => this.onEditButtonClicked(activity.id)}>Edit</button>
                        </div>
                    );
                })}
            </div>
        );
    }
}


ActivityList.propTypes = {
    activityCollection: PropTypes.array.isRequired,
    editActivityHandler: PropTypes.func.isRequired
};

export default ActivityList;