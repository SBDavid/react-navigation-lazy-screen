import React from 'react';
import { SafeAreaView, Text, Button } from 'react-native';

import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../router/type';
import type { LazyScreenProps } from 'react-navigation-lazy-screen';

type Props = { pageName: string } & StackScreenProps<RootStackParamList> &
  LazyScreenProps;

export default class StackScreen extends React.Component<Props> {
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
        <Button
          title="Go to TabS"
          onPress={() => {
            this.props.navigation.navigate('TabS');
            console.info('open TabS');
          }}
        />
      </SafeAreaView>
    );
  }
}
