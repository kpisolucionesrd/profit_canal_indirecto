import React, {Component} from 'react';
import {WebView,ScrollView,Text} from 'react-native';

const URL="http://167.71.9.11:5000/api/";

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
    const Fecha=new Date();
    colmadosEncuesta=navigation.getParam("colmadosEstadisticas","NA")
    colmadosPrecios=navigation.getParam("colmadosFormPrecios","NA")
    cantPendingEncuesta=navigation.getParam("cantPendingEncuesta","NA")
    cantPendingFormPrecios=navigation.getParam("cantPendingFormPrecios","NA")
    encColmados=navigation.getParam("cantEncuestaServidor","NA")
    encFormPrecios=navigation.getParam("cantFormPrecio","NA")
    return(
      <ScrollView>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Completar Encuesta Colmado: {colmadosEncuesta}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Completar Formulario Precios: {colmadosPrecios}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Enviar Servidor Encuesta Colmado: {cantPendingEncuesta}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Pendientes de Enviar Servidor Formulario Precios: {cantPendingFormPrecios}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Enviados al Servidor Encuesta Colmado: {encColmados}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>Enviados al Servidor Formulario Precios: {encFormPrecios}</Text>
        <Text style={{color:'black',fontWeight:'bold'}}>{Fecha.toDateString()}</Text>
      </ScrollView>
    );
  } //Cierre del metodo render
} //Cierre de la clase
