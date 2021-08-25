import React from 'react';
import type {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase, keyof ParamListBase>;
  fallback: NonNullable<React.ReactNode> | null;
  factory: () => Promise<{
    default: React.ComponentType<
      { navigation: any; route: any } & LazyScreenProps & any
    >;
  }>;
} & any;

export type LazyScreenProps = {
  addFocusListener: (callback: () => void) => () => void;
  addBlurListener: (callback: () => void) => () => void;
  addListener: (type: 'focus' | 'blur', callback: () => void) => () => void;
};

export const AddListenerContext = React.createContext({
  addFocusListener: (callback: () => void) => {
    callback();
    throw Error('this func should not be called');
  },
  addBlurListener: (callback: () => void) => {
    callback();
    throw Error('this func should not be called');
  },
  addListener: (type: 'focus' | 'blur', callback: () => void) => {
    callback();
    throw Error('this func should not be called ' + type);
  },
});

export default class LazyScreen extends React.PureComponent<Props> {
  // 取消订阅
  focusSubscripe?: () => void;
  blurSubscripe?: () => void;
  // 回调事件
  focusCallbacks: (() => void)[] = [];
  blurCallbacks: (() => void)[] = [];
  // 发送第一次focus事件
  hasEmitFirstDocus = false;
  comp: React.LazyExoticComponent<
    React.ComponentType<{ navigation: any; route: any } & LazyScreenProps & any>
  >;

  constructor(p: Props) {
    super(p);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.addFocusListener = this.addFocusListener.bind(this);
    this.addBlurListener = this.addBlurListener.bind(this);
    this.addListener = this.addListener.bind(this);

    this.comp = React.lazy(this.props.factory);
  }

  addListener(type: 'focus' | 'blur', callback: () => void): () => void {
    if (type === 'focus') {
      return this.addFocusListener(callback);
    }

    return this.addBlurListener(callback);
  }

  addFocusListener(callback: () => void): () => void {
    this.focusCallbacks.push(callback);
    // 补发首次事件
    if (!this.hasEmitFirstDocus) {
      this.hasEmitFirstDocus = true;
      setTimeout(() => {
        this.onFocus();
      }, 0);
    }

    return () => {
      const index = this.focusCallbacks.indexOf(callback);
      if (index > -1) {
        this.focusCallbacks.splice(index, 1);
      }
    };
  }

  addBlurListener(callback: () => void): () => void {
    this.blurCallbacks.push(callback);
    return () => {
      const index = this.blurCallbacks.indexOf(callback);
      if (index > -1) {
        this.blurCallbacks.splice(index, 1);
      }
    };
  }

  onFocus() {
    this.hasEmitFirstDocus = true;
    this.focusCallbacks.forEach((cb) => cb());
  }

  onBlur() {
    this.blurCallbacks.forEach((cb) => cb());
  }

  componentDidMount() {
    this.focusSubscripe = this.props.navigation.addListener(
      'focus',
      this.onFocus
    );
    this.blurSubscripe = this.props.navigation.addListener('blur', this.onBlur);
  }

  componentWillUnmount() {
    if (this.focusSubscripe) {
      this.focusSubscripe();
    }

    if (this.blurSubscripe) {
      this.blurSubscripe();
    }
  }

  render() {
    return (
      <AddListenerContext.Provider
        value={{
          // @ts-ignore
          addFocusListener: this.addFocusListener,
          // @ts-ignore
          addBlurListener: this.addBlurListener,
          // @ts-ignore
          addListener: this.addListener,
        }}
      >
        <React.Suspense fallback={this.props.fallback}>
          <this.comp
            {...this.props}
            addFocusListener={this.addFocusListener}
            addBlurListener={this.addBlurListener}
          />
        </React.Suspense>
      </AddListenerContext.Provider>
    );
  }
}
