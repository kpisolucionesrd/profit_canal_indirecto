import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MenuMercaderista extends Component{
  constructor(props){
    super(props);
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

  reiniciarAplicacion(){
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');
    this.props.navigation.navigate('FaltantesMercaderista',{
      datosUsuario:datosUsuario
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

      //Pendientes enviar servicor Encuesta Colmados
      GlobalEncuesta=await JSON.parse(await AsyncStorage.getItem("GlobalEncuesta")); //Vector global que guarda todas las encuesta

      //Pendientes enviar servicor Formularios de Precios
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

  funcionCargarEncuesta=async(objetoEncuesta)=>{
    /*
      Esta funcion se utiliza para cargar los datos de la encuesta al servidor.
      El objeto encuesta: es el json que contiene la encuesta levantada por el mercaderista.
    */
    try {
      alert(objetoEncuesta)
      await fetch("http://167.99.167.145/api/profit_datos",{
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
      return true;
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
      await fetch("http://167.99.167.145/api/profit_insertar_imagenes",{
        method:'POST',
        headers:h,
        body:formData
      });
    }
    catch (e) {
      alert(e)
    }
  };

  cargarDataServidor=async()=>{
    /*
      Esta Funcion se utiliza para Cargar la al servidor.
    */
    //--------------------------------------------------------------------------------------------
                                /*DATOS ENCUESTA COLMADO*/
    GlobalFotos=await JSON.parse(await AsyncStorage.getItem("GlobalFotos")) //Vector global que guarda todas las fotos por colmado
    GlobalEncuesta=await JSON.parse(await AsyncStorage.getItem("GlobalEncuesta")) //Vector global que guarda todas las encuesta

                                /*DATOS FORMULARIO PRECIO*/
    GlobalEncuestaForm=await JSON.parse(await AsyncStorage.getItem("GlobalEncuestaForm")) //Vector global que guarda todas las encuesta
    //--------------------------------------------------------------------------------------------
                                /*CARGAR DATOS AL SERVIDOR*/

    /*CARGAR ENCUESTAS*/
    try {
      if(GlobalEncuesta!=null)
      {
        let vecVerdadEncuesta=await GlobalEncuesta.map(this.funcionCargarEncuesta);
      }

      if(GlobalEncuestaForm!=null)
      {
        let vectorVerdadForm=await  GlobalEncuestaForm.map(this.funcionCargarEncuesta);
      }

      if(GlobalEncuesta==null && GlobalEncuestaForm==null)
      {
        alert("No Existe Data para cargar al servidor")
      }
      else
      {
        alert("Data Cargada al Servidor Correctamente")
      }
    }
    catch (e)
    {
      alert("Error al cargar la data...intente de nuevo-->"+e)
    }
    //--------------------------------------------------------------------------------------------
                                /*CARGAR FOTOS AL SERVIDOR*/
    try {
      if(GlobalFotos!=null)
      {
        GlobalFotos.forEach(async(objectFotos)=>{
          let nombreColmado=await Object.keys(objectFotos);
          objectFotos[nombreColmado].forEach(x=>this.funcionCargarIMG(nombreColmado,x));
        });
      }
    } catch (e) {
      alert("Error al cargar las imagenes..."+e)
    }

  };

  //PRUEBA_MOSTRAR
  mostrarData=async()=>{
    GlobalFotos=await JSON.parse(await AsyncStorage.getItem("GlobalFotos")); //Vector global que guarda todas las fotos por colmado
    alert(GlobalFotos)
  };


  //Cadenas de Eventos
  render(){
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');
    return(
      <ScrollView style={iniciar_seccion_styles.main}>
        <Text style={{color:'white',fontSize:30,fontWeight:'bold',textAlign:'center',marginBottom:110}}>Hola! Sr. {datosUsuario.nombre}</Text>
        <Button icon={{name:'list',type:'entypo'}} title='Iniciar Encuesta'onPress={this.iniciarEncuesta} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button icon={{name:'list',type:'entypo'}} title='Formulario Precios'onPress={this.encuestaPrecios.bind(this)} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button icon={{name:'list',type:'entypo'}} title='Reiniciar Aplicacion'onPress={this.reiniciarAplicacion.bind(this)} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button icon={{name:'list',type:'entypo'}} title='Cargar Data Al Servidor'onPress={this.cargarDataServidor.bind(this)} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button icon={{name:'list',type:'entypo'}} title='Estadisticas'onPress={this.estadisticas} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>
        <Button icon={{name:'list',type:'entypo'}} title='PRUEBA_MOSTRAR DATOS'onPress={this.mostrarData} buttonStyle={{width:'80%',marginLeft:'10%',backgroundColor:'white',borderColor:'red',marginBottom:15}} titleStyle={{color:'red',fontWeight:'bold'}}/>

        <Text style={{color:'white',fontSize:8,fontWeight:'bold',textAlign:'center',marginTop:50}}>Release Date: 2019-Feb-01</Text>
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
