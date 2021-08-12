import { StatusBar } from 'expo-status-bar'
import React, {
  createRef,
  forwardRef,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  findNodeHandle,
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Image,
  Text,
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

const Tab = forwardRef(({ item }, ref) => {
  return (
    <View ref={ref}>
      <Text
        style={{
          color: 'white',
          fontSize: 84 / data.length,
          fontWeight: '800',
          textTransform: 'uppercase',
        }}
      >
        {item.title}
      </Text>
    </View>
  )
})

const Indicator = ({ measures, scrollX }) => {
  return (
    <View
      style={{
        position: 'absolute',
        height: 4,
        backgroundColor: 'white',
        width: measures[0].width,
        left: measures[0].x,
        bottom: -10,
      }}
    />
  )
}

const Tabs = ({ scrollX, data }) => {
  const [measures, setMeasures] = useState()
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
        {data.map((item) => {
          return <Tab key={item.key} item={item} ref={item.ref} />
        })}
      </View>
      {measures.length && <Indicator measures={measures} scrollX={scrollX} />}
    </View>
  )
}

export default function App() {
  const scrollX = useRef(new Animated.Value(0)).current
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
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
      <Tabs scrollX={scrollX} data={data} />
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
