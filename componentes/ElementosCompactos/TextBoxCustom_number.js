//Librerias globales
import React, {Component} from 'react';
import {StyleSheet, View,Text,Picker,TextInput} from 'react-native';

export default class TextBoxInputCustomNumber extends Component{
  constructor(props){
    super(props);
    this.state={
      seleccion:this.props.default,
    }
  }
  //Funciones
  cambioValor=(itemValue, itemIndex)=>{
    this.setState({
      seleccion:itemValue,
    });
    this.props.funcion(this.props.identificacion,itemValue);
  }

  render(){
    return(
      <View>
        <Text style={textBoxCustom.text_subitem}>{this.props.identificacion}</Text>
        <TextInput keyboardType="numeric" onChangeText={this.cambioValor} value={this.state.seleccion} style={textBoxCustom.textInput}/>
      </View>
    )
  }
};

const textBoxCustom=StyleSheet.create({
  text_subitem:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  },
  textInput:{
    color:'black',
    backgroundColor:'white',
    width:'100%',
    fontSize:15,
    marginBottom:3,
  }
});
