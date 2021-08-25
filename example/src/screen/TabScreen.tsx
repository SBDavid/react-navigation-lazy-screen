import React from 'react';
import { SafeAreaView, Text, Button } from 'react-native';

import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../router/type';
import type { LazyScreenProps } from 'react-navigation-lazy-screen';
import { AddListenerContext } from 'react-navigation-lazy-screen';

// 在内涂组件上挂载focus事件、blur事件
class InnerComp extends React.PureComponent<{ pageName: string }> {
  unsubscribeFocus: any;
  unsubscribeBlur: any;

  static contextType = AddListenerContext;

  componentDidMount() {
    this.unsubscribeFocus = this.context.addListener('focus', () => {
      console.info(this.props.pageName + ' InnerComp focus');
    });

    this.unsubscribeBlur = this.context.addListener('blur', () => {
      console.info(this.props.pageName + ' InnerComp blur');
    });

    console.info(this.props.pageName + ' InnerComp componentDidMount');
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();

    console.info('InnerComp componentWillUnmount');
  }

  render() {
    return <Text>{'The ' + this.props.pageName + ' InnerComp'}</Text>;
  }
}

type Props = { pageName: string } & StackScreenProps<RootStackParamList> &
  LazyScreenProps;

export default class TabScreen extends React.Component<Props> {
  unsubscribeFocus: any;
  unsubscribeBlur: any;

  componentDidMount() {
    this.unsubscribeFocus = this.props.addFocusListener(() => {
      console.info(this.props.pageName + ' focus');
    });

    this.unsubscribeBlur = this.props.addBlurListener(() => {
      console.info(this.props.pageName + ' blur');
    });

    console.info(this.props.pageName + ' componentDidMount');
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();

    console.info(this.props.pageName + ' componentWillUnmount');
  }

  render() {
    return (
      <SafeAreaView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        <Text>{'The ' + this.props.pageName + ' page'}</Text>
        <Button
          title="Go to Stack screen B"
          onPress={() => {
            this.props.navigation.navigate('StackScreenB');
            console.info('open StackScreenB');
          }}
        />
        <InnerComp pageName={this.props.pageName} />
      </SafeAreaView>
    );
  }
}
