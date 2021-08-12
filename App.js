import { StatusBar } from 'expo-status-bar'
import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'
const { width, height } = Dimensions.get('screen')

const images = {
  man: 'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  women:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  kids: 'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  skullcandy:
    'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  help: 'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
}
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref: createRef(),
}))

const Tab = forwardRef(({ item, onItemPress, scrollX, index }, ref) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width]
  const color = scrollX.interpolate({
    inputRange,
    outputRange: ['white', 'black', 'white'],
  })
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Animated.Text
          style={{
            color,
            fontSize: 84 / data.length,
            fontWeight: '800',
            textTransform: 'uppercase',
            zIndex: 1,
            padding: 5,
          }}
        >
          {item.title}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  )
})

const Indicator = ({ measures, scrollX }) => {
  const inputRange = data.map((_, i) => i * width)
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure) => measure.width),
  })
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map((measure) => measure.x),
  })
  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: 30,
        borderRadius: 20,
        backgroundColor: 'white',
        width: indicatorWidth,
        left: 0,
        bottom: 0,
        transform: [
          {
            translateX,
          },
        ],
        zIndex: -10,
      }}
    />
  )
}

const Tabs = ({ scrollX, data, onItemPress }) => {
  const [measures, setMeasures] = useState([])
  const containerRef = useRef()
  useEffect(() => {
    const m = []
    data.forEach((item) => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({ x, y, width, height })
          if (m.length === data.length) {
            setMeasures(m)
          }
        }
      )
    })
  }, [])

  return (
    <View style={{ position: 'absolute', top: 30, width }}>
      <View
        ref={containerRef}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => onItemPress(index)}
              scrollX={scrollX}
              index={index}
            />
          )
        })}
      </View>
      {measures.length ? (
        <Indicator measures={measures} scrollX={scrollX} />
      ) : null}
    </View>
  )
}

export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current
  const ref = useRef()
  const onItemPress = useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    })
  })
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item.key.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { x: scrollX } },
            },
          ],
          { useNativeDriver: false }
        )}
        bounces={false}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                source={{ uri: item.image }}
                style={{ flex: 1, resizeMode: 'cover' }}
              />
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: 'rgba(0,0,0,0.3)' },
                ]}
              />
            </View>
          )
        }}
      />
      <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
