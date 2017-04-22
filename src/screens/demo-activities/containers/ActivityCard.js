import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import ActivityCardRepresentation from '../components/ActivityCard';

import {updateActivity} from '../actions';

// todo get history from parent component
import { browserHistory } from 'react-router'

const AddActivity = withRouter(connect(
    (state, {params}) => {
        const activityId = params.activityId;

        const {name, productState} = state.activity.activityStorage[activityId];

        // todo define visibility by context layout
        return {
            fields: [
                {
                    label: 'id',
                    value: activityId,
                    editable: false
                },
                {
                    label: 'name',
                    value: name,
                    editable: true
                },
                {
                    label: 'state',
                    value: productState,
                    editable: false
                }
            ]
        }
    },
    (dispatch, {params}) => {
        const activityId = params.activityId;

        return {
            handleUpdateActivity: (fields) => {
                // todo process updated value also somewhere else
                const nameField = fields.filter((field) => field.label === 'name')[0];

                dispatch(updateActivity(activityId, nameField.value));
                browserHistory.push('/demo-activity');
            }
        }
    }
)(ActivityCardRepresentation));

export default AddActivity;