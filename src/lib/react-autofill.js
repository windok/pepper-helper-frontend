import React from 'react';
import ReactDOM from 'react-dom';

export default function AutoFill(DecoratedComponent) {

    return class AutoFillWrapper extends React.Component {

        constructor(props, context) {

            super(props, context);
            this._listeners = [];
        }

        componentDidMount() {

            const forms = ReactDOM.findDOMNode(this).parentNode.querySelectorAll('form');

            [].forEach.call(forms, (form) => {
                [].forEach.call(form.elements, (element) => {

                    if (element.name === '') {
                        return;
                    }

                    const state = {
                        element,
                        value: element.value
                    };

                    state.timer = setInterval(function () {

                        if (!this.element || this.value === this.element.value) {
                            return;
                        }

                        const inputEvent = document.createEvent('HTMLEvents');
                        inputEvent.initEvent('input', true, true);
                        this.element.dispatchEvent(inputEvent);
                        const blurEvent = document.createEvent('HTMLEvents');
                        blurEvent.initEvent('blur', true, true);
                        this.element.dispatchEvent(blurEvent);

                        clearInterval(this.timer);
                    }.bind(state), 100);

                    this._listeners.push(state);

                });
            });

        }

        componentWillUnmount() {
            this._listeners.forEach(function (listener) {
                clearInterval(listener.timer);
            });
        }

        render() {
            return <DecoratedComponent {...this.props}/>;
        }
    }
}
