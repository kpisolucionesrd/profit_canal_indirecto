//Librerias globales
import React, {Component} from 'react';
import {StyleSheet, View,Text,TextInput} from 'react-native';

export default class TextInputComponent extends Component{
  constructor(props){
    super(props);
    this.state={
      seleccion:"",
    }
  }
  //Funciones
  cambioValor=(itemValue,itemIndex)=>{
    this.setState({
      seleccion:itemValue,
    });
    this.props.funcion(this.props.identificacion,itemValue);
  }

  render(){
    return(
      <View>
        <Text style={comboBoxStyle.text_subitem}>{this.props.identificacion}</Text>
        <TextInput onChangeText={this.cambioValor} placeholder={this.props.default} value={this.state.seleccion} style={comboBoxStyle.textbox}/>
      </View>
    )
  }
};

const comboBoxStyle=StyleSheet.create({
  text_subitem:{
    color:'white',
    fontWeight:'bold',
    fontSize:15,
  },
  combobox:{
    fontSize:25,
    color:'black',
    marginBottom:30,
    height:50,
    width:'100%',
    borderColor:'red',
    borderWidth:3,
  },
  textbox:{
    fontSize:15,
    color:'black',
    marginBottom:30,
    height:35,
    width:'100%',
    borderColor:'black',
    borderWidth:1,
    backgroundColor:'white'

  }
});
