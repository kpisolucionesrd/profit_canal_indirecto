import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import {Icon,Button} from 'react-native-elements';
import Slideshow from 'react-native-slideshow';

//const URL="http://167.71.9.11:5000/api/";
const URL="http://165.22.205.126:5000/api/";

export default class MenuCamara extends Component{
  constructor(props){
    super(props);
    this.state={
      disableButton:false,
    }
  }

  static navigationOptions = {
    title: 'Menu Camara',
  };

  //Eventos
  cargarDataLocal=async()=>{
    const { navigation } = this.props;
    const datosEncuesta=navigation.getParam('datosEncuesta');
    const fotosObjeto=navigation.getParam('fotosObjeto','NA');
    const colmadoOngoing=navigation.getParam('colmadoOnGoing','NA');

    try {
      //Guardar las imagenes y encuesta en el TERMINAL (SMARTPHONE)
      if(fotosObjeto[datosEncuesta.encuesta["colmado"]+"__"+datosEncuesta.id].length>1){
        this.setState({disableButton:true});
        GlobalFotos=await JSON.parse(await AsyncStorage.getItem("GlobalFotos")); //Vector global que guarda todas las fotos por colmado
        GlobalEncuesta=await JSON.parse(await AsyncStorage.getItem("GlobalEncuesta")); //Vector global que guarda todas las encuesta

        //--------------------------------------------------------------------------------------------------
        //Proceso GlobalFotos
        if(GlobalFotos!=null && GlobalFotos!="null" && GlobalFotos!=undefined && GlobalFotos!="undefined")
        {
          GlobalFotos.push(fotosObjeto) //Agregar objeto fotos
          await AsyncStorage.setItem("GlobalFotos",await JSON.stringify(GlobalFotos))
        }
        else
        {
          let vectorTemp=[fotosObjeto] //Agregar objeto fotos
          await AsyncStorage.setItem("GlobalFotos",await JSON.stringify(vectorTemp))
        }
        //--------------------------------------------------------------------------------------------------
        //Proceso GlobalEncuesta
        if(GlobalEncuesta!=null && GlobalEncuesta!="null" && GlobalEncuesta!=undefined && GlobalEncuesta!="undefined")
        {
          GlobalEncuesta.push(datosEncuesta) //Agregar objeto fotos
          await AsyncStorage.setItem("GlobalEncuesta",await JSON.stringify(GlobalEncuesta))
        }
        else
        {
          let vectorTemp=[datosEncuesta] //Agregar objeto fotos
          await AsyncStorage.setItem("GlobalEncuesta",await JSON.stringify(vectorTemp))
        }
        //--------------------------------------------------------------------------------------------------
        //Ir al Menu
        this.props.navigation.navigate('MenuMercaderista');

          //Eliminar el colmado completado de la lista y guardar el vector
          let datosAgenda=await JSON.parse(await AsyncStorage.getItem("datosAgenda"));
          let colmados=datosAgenda["colmados"];
          indiceEliminar=colmados.indexOf(colmadoOngoing)
          colmados.splice(indiceEliminar,1); //Eliminar Colmado
          datosAgenda["colmados"]=colmados;
          await AsyncStorage.setItem("datosAgenda",await JSON.stringify(datosAgenda));
        alert("La Data se guardo Exitosamente en el Dispositivo");
      }
      else
      {
        alert("La cantidad de fotos debe ser mayor a 1");
      }
  }catch(e)
  {
    alert(e)
  }
};

  cargarIMGServidor=async(imagenURI,index,vector)=>{
  /* Esta funcion se utiliza para enviar las imagenes al servidor*/
  const {navigation}=this.props;
  const puntoVenta=navigation.getParam('puntoVenta','NA');
  try {
    const h = {}; //headers
    h.Accept = 'application/json';
    let formData=new FormData();
    await formData.append("foto_colmados",{uri:imagenURI,name:"FlashTeam-"+puntoVenta+".jpg",type:'image/jpg'})
    await fetch(URL+"profit_insertar_imagenes",{
      method:'POST',
      headers:h,
      body:formData
    });
    if(index==vector.length-1){
      this.setState({disableButton:false});
      alert("Enviados al servidor CORRECTAMENTE")
      this.props.navigation.goBack(); //Navegar
    }
  }
  catch (e) {
    alert(e)
  }
};

  //Cadenas de Eventos
  render(){
    const { navigation } = this.props;
    const datosUsuarios=navigation.getParam('datosUsuarios');
    const datosEncuesta=navigation.getParam('datosEncuesta');
    const fotos=navigation.getParam('fotosVector',null);

    return(
      <ScrollView style={iniciar_seccion_styles.main}>
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>CAPTURAR FOTOS!!</Text>
        <Icon name='camera' type='entypo' color='white' iconStyle={{marginLeft:300,marginBottom:50}} size={40} onPress={
          ()=>{
            this.props.navigation.navigate('CamaraTaker',{
              datosUsuarios:datosUsuarios,
              datosEncuesta:datosEncuesta
            });
          }
        }/>
        <Text style={{textAlign:'left',color:'white',fontSize:15}}>Imagenes Capturadas</Text>
        {fotos!=null ? <Slideshow dataSource={fotos.map((foto)=>{return{url:foto}})}/>:null}
        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300}} size={40} onPress={this.cargarDataLocal}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'white',fontSize:15}} onPress={this.cargarDataLocal}>Listo</Text>}
      </ScrollView>
    )
  };
}

const iniciar_seccion_styles=StyleSheet.create({
  main:{
    backgroundColor:'red',
    height:'100%',
    padding:6
  }
})
