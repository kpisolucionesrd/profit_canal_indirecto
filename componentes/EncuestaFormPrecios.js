import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import RadioBottom from './ElementosCompactos/radioBottom.js';
import ComboBox from './ElementosCompactos/ComboBox.js';
import TextInputComponent from './ElementosCompactos/textInput.js';
import TextBoxInputCustomNumber from './ElementosCompactos/TextBoxCustom_number.js';
import {Icon,Button} from 'react-native-elements';

export default class EncuestaPrecios extends Component{
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
    title: 'Formulario de Precios',
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

  completarEncuesta=async()=>{
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuarios','some default value');

    let objetoDatos=this.state.objetoDatos;
    objetoDatos.id=datosUsuario.identificador;
    objetoDatos.encuesta=this.state.objetoEncuesta;

    //Guardar el objeto datos en el statte
    this.setState({
      objetoDatos:objetoDatos
    })

    //Verificar si los campos fueron completados
    if(Object.keys(this.state.objetoEncuesta).length>5 && this.state.objetoEncuesta["colmado"]!="***SELECCIONAR***"){

      //Eliminar el colmado completado de la lista y guardar el vector
      let datosAgenda=await JSON.parse(await AsyncStorage.getItem("datosAgenda"));
      let colmados=datosAgenda["colmados"];
      indiceEliminar=colmados.indexOf(this.state.colmado)
      colmados.splice(indiceEliminar,1); //Eliminar
      datosAgenda["colmados"]=colmados;
      await AsyncStorage.setItem("datosAgenda",await JSON.stringify(datosAgenda));

      //Ir al MenuCamara
      this.props.navigation.navigate('MenuCamara',{
        datosUsuarios:datosUsuarios,
        datosEncuesta:objetoDatos
      });

    }else{
      if(this.state.objetoEncuesta["colmado"]=="***SELECCIONAR***" || this.state.objetoEncuesta["colmado"]==null){
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

        {/*Cuidado Oral*/}
        <Text style={iniciar_seccion_styles.secciones}>CUIDADO ORAL</Text>
        {datosUsuarios.cuidadoOral.map((campo)=><TextBoxInputCustomNumber identificacion={campo} funcion={this.crearJson} default="***SELECCIONAR***"/>)}

        {/*Menu de Procesar*/}
        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300}} size={40} onPress={this.completarEncuesta}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'white',fontSize:15,marginBottom:15}} onPress={this.completarEncuesta}>Listo</Text>}
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
