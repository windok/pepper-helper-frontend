import React from 'react';
import {redirectToDefaultList} from 'Services/BrowserHistory';

const ensureListExists = (WrappedComponent) => {

    return class extends React.Component {
        doesListExist() {
            return this.props.list && !this.props.list.isNullObject();
        }

        redirectToDefaultListIfNecessary() {
            if (!this.doesListExist()) {
                redirectToDefaultList();
            }
        }

        render() {
            if (!this.doesListExist()) {
                return null;
            }

            return <WrappedComponent {...this.props} />;
        }

        componentDidMount() {
            this.redirectToDefaultListIfNecessary();
        }

        componentDidUpdate() {
            this.redirectToDefaultListIfNecessary();
        }
    };
};

export default ensureListExists;
export {
    ensureListExists
};