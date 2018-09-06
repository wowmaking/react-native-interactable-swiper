# react-native-interactable-swiper
Swiper for ReactNative apps

## Install
```
react-native-interactable-swiper
```

Then link [react-native-interactable](https://github.com/wix/react-native-interactable#installation).

## Usage

```jsx
import { Swiper, } from 'react-native-interactable-swiper';


export default class UserProfileSwiper extends PureComponent {

    render() {
        return (
            <Swiper
                style={styles.swiper}
                dotStyle={styles.dot}
                activeDotStyle={styles.activeDot}
                paginationStyle={styles.pagination}
                vertical={true}
                onIndexChanged={(index) => { console.log(index); }}
            >
                <View>...</View>
                <View>...</View>
                <View>...</View>
                <View>...</View>
            </Swiper>
        );
    }
}
```

## Props

* `onIndexChanged` (function) - Called with the new index when the user swiped, or auto-swipe completed
```jsx
    onIndexChanged={(index) => {}}
```

* `autoplay` (boolean) - Set to `true` enable auto play mode (default `false`)
```jsx
    autoplay={true}
```

* `vertical` (boolean) - If `true`, the swiper children are arranged vertically in a column (default `false` - children are arranged horizontally in a row)
```jsx
    vertical={true}
```

* `style` (`StyleSheet` object) - Container styles
```jsx
    style={{...}}
```

* `paginationStyle` (`StyleSheet` object) - Pagination container styles
```jsx
    paginationStyle={{...}}
```

* `dotStyle` (`StyleSheet` object) - Pagination dots styles
```jsx
    dotStyle={{...}}
```

* `activeDotStyle` (`StyleSheet` object) - Pagination active dot styles
```jsx
    activeDotStyle={{...}}
```

* `renderPagination` (function) - Complete control how to render pagination with two params (activeIndex, total)
```jsx
    renderPagination={
        (activeIndex, total) => { 
            return <View>...</View>;
        }
    }
```

* `hidePagination`  (boolean) - Set to `true` prevent padination rendering (default `false`)
```jsx
    hidePagination={true}
```
