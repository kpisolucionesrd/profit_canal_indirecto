import React, {Component} from 'react';
import {WebView} from 'react-native';

export default class Estadisticas extends Component{
  constructor(props){
    super(props);
  };

  static navigationOptions = {
    title: 'Estadísticas y mensajes',
  };

  //Eventos

  //Cadenas de Eventos
  render(){
    return(
      <WebView
        source={{uri: 'https://github.com/facebook/react-native'}}
        style={{marginTop: 20}}
      />
    );
  } //Cierre del metodo render

} //Cierre de la clase
