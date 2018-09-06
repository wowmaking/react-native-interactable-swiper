import React, { PureComponent, } from 'react';
import { View, StyleSheet, ViewPropTypes, } from 'react-native';
import PropTypes from 'prop-types';
import Interactable from 'react-native-interactable';


const GRAY = '#999';
const WHITE = '#fff';

const SNAP_POINTS_PREFIX = 'sp_';

export default class Swiper extends PureComponent {

    static propTypes = {
        children: PropTypes.array,
        onIndexChanged: PropTypes.func,
        paginationStyle: ViewPropTypes.style,
        dotStyle: ViewPropTypes.style,
        activeDotStyle: ViewPropTypes.style,
        style: ViewPropTypes.style,
        autoplay: PropTypes.bool,
        renderPagination: PropTypes.func,
        hidePagination: PropTypes.bool,
        vertical: PropTypes.bool,
    }

    state = {
        activeIndex: 0,
        snapPoints: [],
        slides: [],
        containerWidth: 0,
        containerHeight: 0,
        slidesWrapperStyle: null,
    }

    componentDidMount() {
        this.initAutoplayInterval();
    }

    componentDidUpdate(prevProps, prevState) {
        const { children: oldChildren, } = prevProps,
            { children: newChildren, vertical, } = this.props,
            { containerWidth: oldCW, containerHeight: oldCH, } = prevState,
            { containerWidth: newCW, containerHeight: newCH, } = this.state;
        if (
            newCW !== oldCW ||
            newCH !== oldCH ||
            newChildren !== oldChildren
        ) {
            const orientation = vertical ? 'y' : 'x',
                containerSizeDimention = vertical ? 'height' : 'width',
                direction = vertical ? 'column' : 'row',
                containerSize = vertical ? newCH : newCW;
            this.setState({
                slides: newChildren.map((component, index) => {
                    return (
                        <View key={`${SNAP_POINTS_PREFIX}${index}`} style={{ [containerSizeDimention]: containerSize, }}>{component}</View>
                    );
                }),
                snapPoints: newChildren.map((slide, index) => {
                    return {
                        id: `${SNAP_POINTS_PREFIX}${index}`,
                        [orientation]: containerSize * index * -1,
                    };
                }),
                slidesWrapperStyle: {
                    flex: !vertical ? 1 : 0,
                    [containerSizeDimention]: newChildren.length * containerSize,
                    flexDirection: direction,
                },
            });
        }
    }

    render() {
        const {
            paginationStyle,
            dotStyle,
            activeDotStyle,
            style,
            renderPagination,
            hidePagination,
            vertical,
        } = this.props;
        const {
            snapPoints,
            slides,
            slidesWrapperStyle,
        } = this.state;


        return (
            <View
                style={[styles.container, style,]}
                onLayout={this.handleContainerLayout}
            >
                <Interactable.View
                    ref={this.handleInteractableRefBind}
                    horizontalOnly={!vertical}
                    verticalOnly={vertical}
                    style={slidesWrapperStyle}
                    snapPoints={snapPoints}
                    onSnap={this.handleSlidesSnap}
                    onDrag={this.handleSlidesDrag}
                >
                    {slides}
                </Interactable.View>
                {
                    hidePagination || slides.length < 2 ?
                        null
                        :
                        <View style={[styles.pagination, vertical ? styles.paginationVertical : null, paginationStyle,]}>
                            {
                                renderPagination ?
                                    renderPagination(this.state.activeIndex, slides.length)
                                    :
                                    slides.map((item, index, ) => {
                                        return index === this.state.activeIndex ?
                                            <View key={index} style={[styles.dot, styles.activeDot, dotStyle, activeDotStyle,]}></View>
                                            :
                                            <View key={index} style={[styles.dot, dotStyle,]}></View>;
                                    })
                            }
                        </View>
                }
            </View>
        );
    }

    handleInteractableRefBind = (ref) => {
        this.interactableInstance = ref;
    }

    initAutoplayInterval = () => {
        const { autoplay, } = this.props;

        if (autoplay) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = setInterval(() => {
                if (this.interactableInstance) {
                    const { activeIndex, slides, } = this.state,
                        indexToSnap = activeIndex !== (slides.length - 1) ? activeIndex + 1 : 0;
                    this.interactableInstance.snapTo({ index: indexToSnap, });
                    this.updateActiveIndex(indexToSnap);
                }
            }, 3000);
        }
    }

    handleChangeIndex = ({ nativeEvent: { index, }, }) => {
        this.updateActiveIndex(index);
    };

    handleSlidesDrag = ({ nativeEvent: { targetSnapPointId, }, }) => {
        if (targetSnapPointId) {
            const index = this.state.snapPoints.findIndex((sp) => {
                return sp.id === targetSnapPointId;
            });

            if (index !== undefined) {
                this.updateActiveIndex(index);
            }
        }
    }

    updateActiveIndex = (index) => {
        this.initAutoplayInterval();
        if (index !== this.state.activeIndex) {
            const { onIndexChanged, } = this.props;

            onIndexChanged && onIndexChanged(index);
            this.setState({
                activeIndex: index,
            });
        }
    }

    handleContainerLayout = ({ nativeEvent: { layout: { width, height, }, }, }) => {
        this.setState({
            containerWidth: width,
            containerHeight: height,
        });
    }

}


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
    pagination: {
        alignSelf: 'center',
        flexDirection: 'row',
        position: 'absolute',
    },
    paginationVertical: {
        flexDirection: 'column',
        right: 10,
    },
    dot: {
        backgroundColor: WHITE,
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 2.5,
    },
    activeDot: {
        backgroundColor: GRAY,
    },
});
