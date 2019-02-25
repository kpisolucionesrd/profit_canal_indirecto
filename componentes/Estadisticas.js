import React, {Component} from 'react';
import {WebView,ScrollView,Text} from 'react-native';

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
    const { navigation } = this.props;
    colmadosEncuesta=navigation.getParam("colmadosEstadisticas","NA")
    colmadosPrecios=navigation.getParam("colmadosFormPrecios","NA")
    cantPendingEncuesta=navigation.getParam("cantPendingEncuesta","NA")
    cantPendingFormPrecios=navigation.getParam("cantPendingFormPrecios","NA")
    return(
      <ScrollView>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Completar Encuesta Colmado: {colmadosEncuesta}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Completar Formulario Precios: {colmadosPrecios}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Enviar Servidor Encuesta Colmado: {cantPendingEncuesta}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Enviar Servidor Formulario Precios: {cantPendingFormPrecios}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Enviados al Servidor Encuesta Colmado</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Enviados al Servidor Formulario Precios</Text>
      </ScrollView>
    );
  } //Cierre del metodo render
} //Cierre de la clase
