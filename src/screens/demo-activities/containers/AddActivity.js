import {connect} from 'react-redux';

import AddActivityRepresentation from '../components/AddActivity';

import {addNewActivity} from '../actions';

// todo get history from parent component
import { browserHistory } from 'react-router'


const AddActivity = connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            handleNewActivity: (name) => {
                dispatch(addNewActivity(name));
                browserHistory.push('/demo-activity');
            }
        }
    }
)(AddActivityRepresentation);

export default AddActivity;