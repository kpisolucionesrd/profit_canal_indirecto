import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import RadioBottom from './ElementosCompactos/radioBottom.js';
import ComboBox from './ElementosCompactos/ComboBox.js';
import TextInputComponent from './ElementosCompactos/textInput.js';
import {Icon,Button} from 'react-native-elements';

export default class Encuesta extends Component{
  constructor(props){
    super(props);
    this.state={
      default:"**Seleccionar**",
      disableButton:false,
      colmado:"***SELECCIONAR***",
      objetoDatos:{
        id:null,
        encuesta:{},
        fechaInserccion:null
      },
      objetoEncuesta:{}
    }
    //Funciones
  };

  static navigationOptions = {
    title: 'Encuesta Mercaderista',
  };

  //Eventos
  crearJson=async(idCampo,nuevo_resultado)=>{
    //Proceso para crear el JSON con los datos de la encuesta
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');

    let objetoDatos=this.state.objetoEncuesta; //Obtener el Json del constructor
    objetoDatos[idCampo]=nuevo_resultado

    //Guardar data en el state
    this.setState({
      objetoEncuesta:objetoDatos,
    })
  };

  cargarDataLocal=async()=>{
    const { navigation } = this.props;
    const datosUsuarios=navigation.getParam('datosUsuarios','some default value');

    let objetoDatos=await this.state.objetoDatos;
    objetoDatos.id=datosUsuarios.identificador;
    objetoDatos.encuesta=this.state.objetoEncuesta;
    objetoDatos.tipoEncuesta="Encuesta";

    //Guardar el objeto datos en el statte
    this.setState({
      objetoDatos:objetoDatos
    });

    //PRUEBA
    alert(objetoDatos.encuesta["colmado"])

    //Verificar si los campos fueron completados
    if(Object.keys(this.state.objetoEncuesta).length>=datosUsuarios.cantCampos && objetoDatos.encuesta["colmado"]!="***SELECCIONAR***"){

      //Eliminar el colmado completado de la lista y guardar el vector
      let datosAgenda=await JSON.parse(await AsyncStorage.getItem("datosAgenda"));
      let colmados=datosAgenda["colmados"];
      indiceEliminar=colmados.indexOf(this.state.colmado)
      colmados.splice(indiceEliminar,1); //Eliminar Colmado
      datosAgenda["colmados"]=colmados;
      await AsyncStorage.setItem("datosAgenda",await JSON.stringify(datosAgenda));

      //Ir al MenuCamara
      this.props.navigation.navigate('MenuCamara',{
        datosUsuarios:datosUsuarios,
        datosEncuesta:objetoDatos
      });

    }else{
      if(objetoDatos.encuesta["colmado"]=="***SELECCIONAR***" || objetoDatos.encuesta["colmado"]==null){
        alert("Favor seleccionar colmado")
      }else{
        alert("Faltan campos por completar")
      }
    }

  };

  gettingComboBox=async(valorSeleccionado)=>{

    //Obtener el Json del constructor
    let objetoDatos=this.state.objetoDatos;
    objetoDatos.encuesta["colmado"]=valorSeleccionado

    /*Guardar objeto*/
    this.setState({
      objetoDatos:objetoDatos,
      colmado:valorSeleccionado
    });
  };

  //Cadenas de Eventos
  render(){
    const { navigation } = this.props;
    const colmados=navigation.getParam('colmados','some default value');
    const datosUsuarios=navigation.getParam('datosUsuarios','some default value');
    return(
      <ScrollView style={iniciar_seccion_styles.main}>

        {/*Label Seleccionar Colmado*/}
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Favor Seleccionar Colmado</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.colmado} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {colmados.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        {/*Estados de los Colmados*/}
        <Text style={iniciar_seccion_styles.secciones}>ESTADO DEL COLMADO</Text>
        <ComboBox identificacion="Estado del colmado" datos={datosUsuarios.estadoColmado} funcion={this.crearJson} default="***SELECCIONAR***"/>

        {/*Disosicion del Colmadero*/}
        <Text style={iniciar_seccion_styles.secciones}>DISPOSICION DEL COLMADERO</Text>
        {datosUsuarios.dispColmaderoSiNo.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        <ComboBox identificacion="Disposicion Colmadero" datos={datosUsuarios.dispColmadero} funcion={this.crearJson} default="***SELECCIONAR***"/>

        {/*Tipo de Acceso al Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>TIPO DE ACCESO AL COLMADO</Text>

        <ComboBox identificacion="Acceso Colmado" datos={datosUsuarios.tipoAccesoColmado} funcion={this.crearJson} default="***SELECCIONAR***"/>

        {/*Tamaño del Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>TAMAñO DEL COLMADO</Text>

        <ComboBox identificacion="Tamano Colmado" datos={datosUsuarios.tamanoColmado} funcion={this.crearJson} default="***SELECCIONAR***"/>

        {/*Capacidad del Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>CAPACIDAD DEL COLMADO</Text>
        {datosUsuarios.capacidadColmadoSiNo.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        <TextInputComponent identificacion="Cantidad de Deliverys" funcion={this.crearJson} default="***SELECCIONAR***"/>

        {/*Tipo Ventana*/}
        <Text style={iniciar_seccion_styles.secciones}>TIPO VENTANA</Text>
        <ComboBox identificacion="Tipo Ventana" datos={datosUsuarios.tipoVentana} funcion={this.crearJson} default="***SELECCIONAR***"/>

        <TextInputComponent identificacion="Cantidad Tramos Ventana" funcion={this.crearJson} default="***SELECCIONAR***"/>

        {/*Iniciativas de Visibilidad*/}
        <Text style={iniciar_seccion_styles.secciones}>INICIATIVAS DE VISIBILIDAD</Text>
        {datosUsuarios.iniciativasVisibilidad.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        {/*Surtido Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>SURTIDO COLMADO</Text>
        {datosUsuarios.surtidoColmado.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        {/*Actividad Competitiva*/}
        <Text style={iniciar_seccion_styles.secciones}>ACTIVIDAD COMPETITIVA</Text>
        {datosUsuarios.actividadCompetitiva.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson} value={campo}/>)}

        {/*COMENTARIOS*/}
        <TextInputComponent identificacion="Comentarios" funcion={this.crearJson} default="***SELECCIONAR***"/>

        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300}} size={40} onPress={this.cargarDataLocal}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'white',fontSize:15,marginBottom:15}} onPress={this.cargarDataLocal}>Listo</Text>}
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
  secciones:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    backgroundColor:'darkblue',
    width:'100%',
    textAlign:'center'
  }
})
