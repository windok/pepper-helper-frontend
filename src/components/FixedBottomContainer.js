import React from 'react';
import PropTypes from 'prop-types'

import Paper from 'react-md/lib/Papers/Paper';

const styles = {
    component: {
        position: 'fixed',
        backgroundColor: 'white',
        bottom: '0px',
        width: '100%',
    }
};

const FixedBottomContainer = (props) => (
    <Paper
        style={styles.component}
        className="md-grid md-box-shadow"
    >
        {props.children}
    </Paper>
);


export default FixedBottomContainer;
