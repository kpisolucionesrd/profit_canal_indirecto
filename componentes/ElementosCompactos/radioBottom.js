//Librerias globales
import React, {Component} from 'react';
import {StyleSheet, View,Text} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

export default class RadioBottom extends Component{
  constructor(props){
    super(props);
    this.state={
      valores:[
        {label: 'Si', value: 'Si' },
        {label: 'No', value: 'No' }
      ],
    }
  }
  //Funciones
  cambioValor=(itemValue)=>{
    this.props.funcion(this.props.identificacion,itemValue);
  }
  render(){
    return(
      <View>
      <Text style={RadioBottomStyle.text_subitem}>{this.props.identificacion}</Text>
        <RadioForm
          radio_props={this.state.valores}
          initial={-1}
          onPress={this.cambioValor}
          buttonColor={'white'}
          labelColor={'white'}
        />
      </View>
    )
  }
};

const RadioBottomStyle=StyleSheet.create({
  text_subitem:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  }
});
