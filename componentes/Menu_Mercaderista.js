import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MenuMercaderista extends Component{
  constructor(props){
    super(props);
    this.state={
      estadoBoton:false
    }
  };

  static navigationOptions = {
    title: 'Encuesta Mercaderista',
  };

  //Eventos
  iniciarEncuesta=async()=>{
    //Obteniendo campos y datos usuarios
    const { navigation } = this.props;
    const datosUsuarios=JSON.parse(await AsyncStorage.getItem("datosUsuario")); /*Aqui se encuentra los datos/campo para Encuesta*/

    //Obteniendo colmados
    colmados=JSON.parse(await AsyncStorage.getItem("datosAgenda"))["colmados"]

    //Ir a la encuesta
    this.props.navigation.navigate('Encuesta',{
      datosUsuarios:datosUsuarios,
      colmados:colmados
    });

  };

  encuestaPrecios=async()=>{
    //Obteniendo campos y datos usuarios
    const { navigation } = this.props;
    const datosUsuarios=JSON.parse(await AsyncStorage.getItem("datosUsuario"));

    //Obteniendo colmados
    colmados=JSON.parse(await AsyncStorage.getItem("datosAgenda"))["colmadosFormPrecios"];

    //Ir a encuesta precios
    this.props.navigation.navigate('EncuestaPrecios',{
      datosUsuarios:datosUsuarios,
      colmados:colmados
    })
  };

  estadisticas=async()=>{
    /*Esta función se utiliza para ir al menu de estadistica*/
    const { navigation } = this.props;
    const datosUsuarios=JSON.parse(await AsyncStorage.getItem("datosUsuario")); /*Aqui se encuentra los datos/campo para Encuesta*/
    try {
      //Colmados Estadisticas: Cantidad de colmados pendientes Encuesta Colmados
      colmPendientesEncuesta=JSON.parse(await AsyncStorage.getItem("datosAgenda"))["colmados"]

      //Colmados Formulario Precios: Cantidad de colmados pendientes Formulario de precios
      colmPendientesFormPrecios=JSON.parse(await AsyncStorage.getItem("datosAgenda"))["colmadosFormPrecios"]

      //Pendientes enviar servidor Encuesta Colmados
      GlobalEncuesta=await JSON.parse(await AsyncStorage.getItem("GlobalEncuesta")); //Vector global que guarda todas las encuesta

      //Pendientes enviar servidor Formularios de Precios
      GlobalEncuestaForm=await JSON.parse(await AsyncStorage.getItem("GlobalEncuestaForm")); //Vector global que guarda todas las encuesta

      //Evaluaciones
      if(GlobalEncuesta==null)
      {
        cantPendingEncuesta=0
      }
      else
      {
        cantPendingEncuesta=GlobalEncuesta.length
      }

      if(GlobalEncuestaForm==null)
      {
        cantPendingFormPrecios=0
      }
      else
      {
        cantPendingFormPrecios=GlobalEncuestaForm.length
      }

      //Consulta al servidor
      respuesta=await fetch("http://167.99.167.145/api/profit_estadisticas/"+datosUsuarios.identificador);
      respuestaJSON=await respuesta.json();

      //Ir a la encuesta
      this.props.navigation.navigate('Estadisticas',{
        colmadosEstadisticas:colmPendientesEncuesta.length-1,
        colmadosFormPrecios:colmPendientesFormPrecios.length-1,
        cantPendingEncuesta:cantPendingEncuesta,
        cantPendingFormPrecios:cantPendingFormPrecios,
        cantEncuestaServidor:respuestaJSON["EncuestaColmado"],
        cantFormPrecio:respuestaJSON["FormularioPrecios"],
      });
    }
    catch (e)
    {
      alert("Un Error ha ocurrido: "+ e)

    }
  };

  irCargarDataServidor=async()=>{
    /*Esta funcion se utiliza para ir al menu para enviar la data al servidor*/
    const { navigation } = this.props;
    this.props.navigation.navigate('EnviarDatos')

  };

  //Cadenas de Eventos
  render(){
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');
    return(
      <ScrollView style={iniciar_seccion_styles.main}>
        <Text style={{color:'white',fontSize:30,fontWeight:'bold',textAlign:'center',marginBottom:110}}>Hola! Sr. {datosUsuario.nombre}</Text>
        <Button disabled={this.state.estadoBoton} icon={{name:'list',type:'entypo'}} title='Iniciar Encuesta'onPress={this.iniciarEncuesta} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button disabled={this.state.estadoBoton} icon={{name:'list',type:'entypo'}} title='Formulario Precios'onPress={this.encuestaPrecios.bind(this)} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button disabled={this.state.estadoBoton} icon={{name:'list',type:'entypo'}} title='Cargar Data Al Servidor'onPress={this.irCargarDataServidor.bind(this)} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button disabled={this.state.estadoBoton} icon={{name:'list',type:'entypo'}} title='Estadisticas'onPress={this.estadisticas} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>

        <Text style={{color:'white',fontSize:8,fontWeight:'bold',textAlign:'center',marginTop:50}}>Release Date: 2019-Marzo-23</Text>
      </ScrollView>
    )
  } //Cierre del metodo render

} //Cierre de la clase
const iniciar_seccion_styles=StyleSheet.create({
  main:{
    backgroundColor:'red',
    height:'100%',
    padding:6
  },
  logo_profit:{
    width:'100%',
    height:200,
    marginBottom:10,
    resizeMode: 'contain',
    borderWidth:3,
  },
  menuItem:{
    fontSize:24,
    color:'black',
    fontWeight:'bold',
    backgroundColor:'white',
    textAlign:'center',
    borderWidth:3,
    marginTop:5,
  },
});
