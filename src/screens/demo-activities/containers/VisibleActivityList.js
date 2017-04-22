import {connect} from 'react-redux';

import ActivityList from '../components/ActivityList';

// todo get history from parent component
import { browserHistory } from 'react-router'

const VisibleActivityList = connect(
    (state) => {
        return {
            activityCollection: state.activity.all.ids.map((activityId) => state.activity.activityStorage[activityId])
        }
    },
    (dispatch) => {
        return {
            editActivityHandler: (productId) => {
                browserHistory.push('/demo-activity/' + productId);
            }
        }
    }
)(ActivityList);

export default VisibleActivityList;