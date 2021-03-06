import React, { Component } from 'react';
import { Header, Left, Body, Right, Button, Icon, Title} from 'native-base';

export default class AttendeeConferenceHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header style={{backgroundColor: '#428bca'}}>
        <Left>
          <Button transparent onPress={this.props.leftOnPress}>
            <Icon style={{color: 'white'}} name={this.props.leftIcon}/>
          </Button>
        </Left>
        <Body>
          <Title style={{color: 'white'}}>{ this.props.title }</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}
