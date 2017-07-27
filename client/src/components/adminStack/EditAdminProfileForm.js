import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Drawer, Button, Header, Left, Right, Body, Input, Label, Item, Title, Content, Separator, Text, Footer, FooterTab, Icon, ListItem } from 'native-base';
// import UserSwiperFooter from './helpers/UserSwiperFooter';
// import ImagePicker from 'react-native-image-picker';
// import Swiper from 'react-native-swiper';

import axios from 'axios';
import Config from '../../../../config/config.js';
import AdminStackHeader from './helpers/AdminStackHeader';
import DatePicker from './DatePicker.js';
import normalizePhoneNumber from '../registerStack/helpers/normalizePhoneNumber';


// need initialize to initialize the form with some data if it exists
import { Field, reduxForm, initialize } from 'redux-form';
import { connect } from 'react-redux';
import { setAdminSelectedConference } from '../actions/actions.js';
import SideBar from './helpers/HostSidebar';


const required = value => {
  return value ? undefined  : <Text> Required </Text>
};

const email = (value) => {
 return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
              ? <Text> Invalid Email </Text>
              : undefined
}

const linkedin = (value) => {
  return value && !value.toLowerCase().startsWith('https://www.linkedin.com')
               ? <Text> Invalid Linkedin URL</Text>
              : undefined
}

const renderInput = ({ input: { onChange, ...restInput }, label, keyboardType, placeholder, normalize, multiline, meta: { touched, error, warning }}) => {
  return (
    <Item inlineLabel>
      <Label>{label}</Label>
      <Input keyboardType={keyboardType} onChangeText={onChange} {...restInput} normalize={normalize} placeholder={placeholder} multiline={multiline}/>
      {touched &&
        (error &&
          <Item error>
            {error}
          </Item>) }
    </Item>
  )
}

class EditAdminProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbUser: {}
    }
  }

  closeDrawer() {
    this.drawer._root.close()
  }

  openDrawer() {
    this.drawer._root.open()
  };

  componentDidMount() {
    const SERVER_URL = Config.server.url;

    let url = SERVER_URL + 'api/users/' + this.props.user.id;
    axios.get(url)
      .then(user => {
        this.setState({
          dbUser: user.data
        }, this.handleInitialize)
      })
      .catch(err => {
        console.log('error getting user: ', err);
      })
  }

  handleInitialize() {
    const profileValues = {
      first_name: this.state.dbUser.first_name,
      last_name: this.state.dbUser.last_name,
      email: this.state.dbUser.email,
      linkedin_id: this.state.dbUser.linkedin_id,
      phone_number: this.state.dbUser.phone_number,
    };
    this.props.initialize(profileValues);
  }


  saveToDB(profile) {
    const SERVER_URL = Config.server.url || 'http://localhost:3000';

    let url = SERVER_URL + 'api/editUserProfile/';

    axios.post(url, profile)
      .then(response => {
        this.props.navigation.navigate('AdminLanding');
      })
      .catch(err => {
        console.log('error updating user: ', err);
      })

    }

  submit(profile) {
    profile.login_id = this.props.user.id;
    profile.avatar_url = this.state.dbUser.avatar_url;
    profile.user_type = this.state.dbUser.user_type;
    this.saveToDB(profile);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<SideBar navigator={this.navigator} navigation={this.props.navigation} />}
        onClose={() => this.closeDrawer()} >
         <Header style={{backgroundColor: '#428bca'}}>
          <Left>
            <Button transparent onPress={() => this.openDrawer()}>
              <Icon style={{color: 'white'}} name="menu"/>
            </Button>
          </Left>
          <Body>
            <Title style={{color: 'white'}} >Edit Profile</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Field name="first_name" validate={[required]} component={ renderInput } label="First Name:" placeholder="John" />
          <Field name="last_name" validate={[required]} component={ renderInput } label="Last Name:" placeholder="Doe" />
          <Field name="email" validate={[required, email]} component={ renderInput } label="Email:" placeholder="johndoe123@gmail.com" />
          <Field name="linkedin_id" validate={[required, linkedin]} component={ renderInput } label="Linked In URL:" placeholder="linkedin.com/in/johndoe123" />
          <Field name="phone_number" component={ renderInput } label="Phone Number:" keyboardType="phone-pad" normalize={normalizePhoneNumber} placeholder="555-555-5555" />
        </Content>
        <Footer>
          <Content style={{backgroundColor: '#428bca'}}>
            <Button style={{flex: 1, alignSelf: 'center'}} transparent onPress={handleSubmit(this.submit.bind(this))}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Update Profile</Text>
            </Button>
          </Content>
        </Footer>
      </Drawer>
    )
  }
}

const reduxFormConfig = {
  form: 'EditAdminProfileForm',
  fields: ['name', 'address', 'logo', 'ticket_price', 'venue_map', 'banner', 'details']
}

EditAdminProfileForm = reduxForm(reduxFormConfig)(EditAdminProfileForm)

EditAdminProfileForm = connect(
  state => ({
    user: state.userReducer
  }))(EditAdminProfileForm)

export default EditAdminProfileForm;


