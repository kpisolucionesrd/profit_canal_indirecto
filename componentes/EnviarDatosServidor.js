import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage} from 'react-native';
import {Button} from 'react-native-elements';
var RNFS = require('react-native-fs');

const URL="http://167.71.9.11:5000/api/";
export default class EnviarDatos extends Component{
  constructor(props){
    super(props);
    this.state={
      estadoBoton:false
    }
  };

  static navigationOptions = {
    title: 'ENVIAR DATOS AL SERVIDOR',
  };

  //Eventos
  funcionCargarEncuestaGeneral=async(objetoEncuesta)=>{
    /*
      Esta funcion se utiliza para cargar los datos de la encuesta al servidor.
      El objeto encuesta: es el json que contiene la encuesta levantada por el mercaderista.
    */
    try {
      var Encuesta_modified=await JSON.parse(await AsyncStorage.getItem("GlobalEncuesta")) //Vector global que guarda todas las encuesta
      let Respuestaawait=await fetch(URL+"profit_datos",{
        method:'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          "id":objetoEncuesta.id,
          "encuesta":objetoEncuesta.encuesta,
          "tipoEncuesta":objetoEncuesta.tipoEncuesta
        })
      });

      //Verificar si el dato fue ingresado correctamente
      if(Respuestaawait.ok){
        let position=await Encuesta_modified.indexOf(objetoEncuesta);
        Encuesta_modified.splice(position,1) //Eliminar objeto
        await AsyncStorage.setItem("GlobalEncuesta",await JSON.stringify(Encuesta_modified)) //Guardar el modificado
      }
    }
    catch (e)
    {
      alert("Error ha ocurrido"+e)
    };

  };

  funcionCargarEncuestaForm=async(objetoEncuesta)=>{
    /*
      Esta funcion se utiliza para cargar los datos de la encuesta al servidor.
      El objeto encuesta: es el json que contiene la encuesta levantada por el mercaderista.
    */
    try {
      var Encuesta_modified=await JSON.parse(await AsyncStorage.getItem("GlobalEncuestaForm")) //Vector global que guarda todas las encuesta
      let Respuestaawait=await fetch(URL+"profit_datos",{
        method:'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          "id":objetoEncuesta.id,
          "encuesta":objetoEncuesta.encuesta,
          "tipoEncuesta":objetoEncuesta.tipoEncuesta
        })
      });

      //Verificar si el dato fue ingresado correctamente
      if(Respuestaawait.ok){
        let position=await Encuesta_modified.indexOf(objetoEncuesta);
        Encuesta_modified.splice(position,1) //Eliminar objeto
        await AsyncStorage.setItem("GlobalEncuestaForm",await JSON.stringify(Encuesta_modified)) //Guardar el modificado
      }
    }
    catch (e)
    {
      alert("Error ha ocurrido"+e)
    };

  };

  funcionCargarIMG=async(nombreColmado,objetoImg)=>{
    /* Esta funcion se utiliza para enviar las imagenes al servidor*/
    const {navigation}=this.props;
    const puntoVenta=navigation.getParam('puntoVenta','NA');
    try {
      const h = {}; //headers
      h.Accept = 'application/json';
      let formData=new FormData();
      await formData.append("foto_colmados",{uri:objetoImg,name:nombreColmado+".jpg",type:'image/jpg'})
      let RespuestaSendFoto=await fetch(URL+"profit_insertar_imagenes",{
        method:'POST',
        headers:h,
        body:formData
      });

      if(!RespuestaSendFoto.ok){
        let RespuestaSendFoto=await fetch(URL+"profit_insertar_imagenes",{
          method:'POST',
          headers:h,
          body:formData
        });
      }
    }
    catch (e) {
      alert(e)
    }
    try{
      RNFS.unlink(objetoImg);
    }catch(err){
      console.log(err);
      alert("Error al eliminar la foto...Hablar con programador");
    }
  };

  cargarDataServidor=async()=>{
    /*
      Esta Funcion se utiliza para Cargar la data al servidor.
    */
    //--------------------------------------------------------------------------------------------
    const { navigation } = this.props;
                                /*DATOS ENCUESTA COLMADO*/
    GlobalFotos=await JSON.parse(await AsyncStorage.getItem("GlobalFotos")) //Vector global que guarda todas las fotos por colmado
    GlobalEncuesta=await JSON.parse(await AsyncStorage.getItem("GlobalEncuesta")) //Vector global que guarda todas las encuesta

                                /*DATOS FORMULARIO PRECIO*/
    GlobalEncuestaForm=await JSON.parse(await AsyncStorage.getItem("GlobalEncuestaForm")) //Vector global que guarda todas las encuesta
    //--------------------------------------------------------------------------------------------
                                /*CARGAR DATOS AL SERVIDOR*/

    /*CARGAR ENCUESTAS*/
    try {
      if(GlobalEncuesta!=null){
        if(GlobalEncuesta!=null || GlobalEncuesta.length!=0)
        {
          await GlobalEncuesta.map(this.funcionCargarEncuestaGeneral);
          await this.setState({estadoBoton:true}); /*Deshabilidat los botones*/
          await AsyncStorage.removeItem("GlobalEncuesta");
        }
      }

      if(GlobalEncuestaForm!=null){
        if(GlobalEncuestaForm.length!=0)
        {
          await  GlobalEncuestaForm.map(this.funcionCargarEncuestaForm);
          await this.setState({estadoBoton:true}); /*Deshabilidat los botones*/
          await AsyncStorage.removeItem("GlobalEncuestaForm");
        }
      }

      if((GlobalEncuesta==null && GlobalEncuestaForm==null) || (GlobalEncuesta==0 & GlobalEncuestaForm==0))
      {
        alert("No Existe Data para cargar al servidor")
      }
      else
      {
        alert("Data Cargada al Servidor Correctamente")
        //Ir a la encuesta
        this.props.navigation.navigate('MenuMercaderista');

        await this.setState({estadoBoton:false}); /*Deshabilidat los botones*/

      }
    }
    catch (e)
    {
      alert("Error al cargar la data...intente de nuevo-->"+e);
    }
    //--------------------------------------------------------------------------------------------
                                /*CARGAR FOTOS AL SERVIDOR*/
    try {
      if(GlobalFotos!=null)
      {
        await GlobalFotos.forEach(async(objectFotos)=>{
          let nombreColmado=await Object.keys(objectFotos);
          objectFotos[nombreColmado].forEach(x=>this.funcionCargarIMG(nombreColmado,x));
        });
        await AsyncStorage.removeItem("GlobalFotos");
      }
    } catch (e) {
      alert("Error al cargar las imagenes..."+e);
    }

  };

  //Cadenas de Eventos
  render(){
    return(
      <ScrollView style={iniciar_seccion_styles.main}>
        <Button disabled={this.state.estadoBoton} icon={{name:'list',type:'entypo'}} title='ENVIAR AL SERVIDOR'onPress={this.cargarDataServidor} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
      </ScrollView>
    );
  } //Cierre del metodo render
} //Cierre de la clase

const iniciar_seccion_styles=StyleSheet.create({
  main:{
    backgroundColor:'red',
    height:'100%',
    padding:6
  }
});
