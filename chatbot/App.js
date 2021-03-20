import React, {Component} from 'react'
import {View, Text} from 'react-native'
import {GiftedChat} from 'react-native-gifted-chat'
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies'
import {Dialogflow_V2} from 'react-native-dialogflow'
import {dialogflowConfig} from './env';

const hinh = require('./asset/images/test1.jpg');

const bot={
  _id : 2,
  _name : 'Khoi',
  _avatar : hinh,
}

class App extends Component{
  state = {
    messages : [{_id: 1, text: 'Hi', createdAt: new Date(), user: bot},
    {_id: 2, text: 'Khôi Đẹp Trai', createdAt: new Date(), user: bot}],
    id : 1,
    name: '',
  };

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  handleGoogleResponse(result){
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }
  sendBotResponse(text){
    let msg = {
      _id: this.state.messages.length + 1, text, createdAt: new Date(), user: bot,
    }
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, [msg]),
    }))
  }

  onSend(messages = []){
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, messages)
    }))
    let message = messages[0].text;

    Dialogflow_V2.requestQuery(message,
    (result) => this.handleGoogleResponse(result),
    (error) => console.log(error))
  }

  onQuickReply(quickReply){
    this.setState((previouseState) => ({
      messages: GiftedChat.append(previouseState.messages, quickReply),
    }))
    let message = quickReply[0].value;

    Dialogflow_V2.requestQuery(message,
    (result) => this.handleGoogleResponse(result),
    (error) => console.log(error))
  }

  render() {
    return (
      <View style = {{flex: 1, backgroundColor  : '#fff'}}>
        <GiftedChat 
        messages = {this.state.messages}
        onSend = {(messages) => this.onSend(messages)}
        onQuickReply = {(quickReply) => this.onQuickReply(quickReply)}
        user={{_id : 1}}/>
      </View>
    );
  }
}
export default App;