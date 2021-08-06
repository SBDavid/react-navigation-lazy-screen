# react-navigation-lazy-screen

实现页面懒加载，并补发首次focus事件

此库需要结合react-navigation使用，目前支持 StackNavigaton 和 BottomNavigation。

词库解决的主要问题为：当我们在 react-navigation 中使用懒加载来加载页面时无法收到首个 focus 事件。react-navigation-lazy-screen 会向页面补发首个 focus 事件。并且 react-navigation-lazy-screen 在使用形式上更加简洁。

## Installation

```sh
npm install react-navigation-lazy-screen
```

## Usage

### 1. 在Router中加入 LazyScreen 组件
```js
import LazyScreen from "react-navigation-lazy-screen";

// Tab路由
const Tab = createBottomTabNavigator();
function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="TabA">
        {(props) => {
          return (
            <LazyScreen
              {...props} // 传入navigation、route等属性，这些属性会传入 TabScreen组件
              pageName="TabA" // 自定义属性，这些属性会传入 TabScreen组件
              fallback={<Text>Loading...</Text>} // 如果懒加载失败则显示 fallback
              factory={() => import('../screen/TabScreen')} // 通过懒加载方式加载组件
            />
          );
        }}
      </Tab.Screen>
      <Tab.Screen name="TabB">
        {/* ... */}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
// Stack 路由
<RootStack.Screen name="StackScreen">
  {(props) => {
    return (
      <LazyScreen
        {...props}
        pageName="Home"
        fallback={<Text>Loading...</Text>}
        factory={() => import('../screen/StackScreen')}
      />
    );
  }}
</RootStack.Screen>
```

### 2. 在页面中绑定 focus 和 blur 事件
```js
export default class StackScreen extends React.Component<Props> {
  unsubscribeFocus: any;
  unsubscribeBlur: any;

  componentDidMount() {
    // 绑定事件
    this.unsubscribeFocus = this.props.addFocusListener(() => {
      console.info(' focus');
    });

    this.unsubscribeBlur = this.props.addBlurListener(() => {
      console.info(' blur');
    });
  }

  componentWillUnmount() {
    // 解绑事件
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  render() {
    return (
      <SafeAreaView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      > 
      </SafeAreaView>
    );
  }
}

```

## Example

请参考 example 文件夹

## License

MIT
