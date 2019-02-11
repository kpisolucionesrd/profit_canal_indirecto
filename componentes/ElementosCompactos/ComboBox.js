//Librerias globales
import React, {Component} from 'react';
import {StyleSheet, View,Text,Picker} from 'react-native';

export default class ComboBox extends Component{
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
        <Text style={comboBoxStyle.text_subitem}>{this.props.identificacion}</Text>
        <Picker onValueChange={this.cambioValor} selectedValue={this.state.seleccion} style={comboBoxStyle.combobox}>
          {this.props.datos.map((lenguage)=><Picker.Item label={lenguage} value={lenguage} />)}
        </Picker>
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
    height:50,
    width:'100%',
    borderColor:'white',
    borderWidth:3,
    backgroundColor:'white'
  }
});
