import React from 'react';
import {AppRegistry, StyleSheet, ScrollView, View, Text, Animated, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const GREY = 0;
const GREEN = 1;
const RED = 2;
const values = [1, 2, 3, 4];
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    outerScroll: {
        flex: 1,
        flexDirection: 'column'
    },
    row: {
        flex: 1
    }
});

class AnimatedFlick extends React.PureComponent {

    getInitialState() {
        return {
            values: values,
            colors: values.map(() => new Animated.Value(GREY))
        };
    }

    _animateScroll(index, e) {
        const threshold = width / 5;
        let x = e.nativeEvent.contentOffset.x;
        let target = null;
        x = x * -1;
        if (x > -50 && this._target != GREY) {
            target = GREY;
        } else if (x < -50 && x > -threshold && this._target != GREEN) {
            target = GREEN;
        } else if (x < -threshold && this._target != RED) {
            target = RED;
        }
        if (target !== null) {
            this._target = target;
            this._targetIndex = index;
            Animated.timing(this.state.colors[index], {
                toValue: target,
                duration: 180,
            }).start();
        }
    }

    takeAction() {
        this.setState({
            action: true
        });
    }

    getActionText() {
        let actionText = '';
        if (this.state.action) {
            if (this._target === GREEN) {
                actionText = 'Save Action';
            } else if (this._target === RED) {
                actionText = 'Delete Action'
            } else {
                actionText = 'No Action';
            }
            return 'You took "' + actionText + '" on the ' + this._targetIndex + ' row';
        }
        return 'You have not taken an action yet';
    }

    _renderRow(value, index) {
        const bgColor = this.state.colors[index].interpolate({
            inputRange: [
                GREY,
                GREEN,
                RED
            ],
            outputRange: [
                'rgb(180, 180, 180)',
                'rgb(63, 236, 35)',
                'rgb(233, 19, 19)',
            ],
        });
        return (
            <View
                style={styles.row}
                key={index}
            >
                <AnimatedScrollView
                    horizontal={true}
                    directionalLockEnabled={true}
                    style={[{flex: 1, height: 100}, {backgroundColor: bgColor}]}
                    onScroll={this._animateScroll.bind(this, index)}
                    scrollEventThrottle={16}
                    onMomentumScrollBegin={this.takeAction}
                >
                    <View style=>
                        <Text>{value + "  <----- Slide the row that way and release"}</Text>
                    </View>
                </AnimatedScrollView>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.outerScroll}>
                    {this.state.values.map(this._renderRow, this)}
                </ScrollView>
                <Text>{this.getActionText()}</Text>
            </View>
        );
    }
}

AppRegistry.registerComponent('AnimatedFlick', () => AnimatedFlick);

export default AnimatedFlick;