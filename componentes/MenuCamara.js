import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import {Icon,Button} from 'react-native-elements';
import Slideshow from 'react-native-slideshow';

export default class EncuestaFlashTeam extends Component{
  constructor(props){
    super(props);
    this.state={
      fecha_hoy:new Date(), //Fecha del dia de hoy
      campos:["prueba","PRUEBA","***SIN SELECCIONAR***"],
      valorSeleccionado:"***SIN SELECCIONAR***",
      fotos:[],
      disableButton:false,
    }
    this.descargarCampos().then((result)=>{
      this.setState({
        campos:result,
      })
    })
  }

  static navigationOptions = {
  title: 'Encuesta Flash Team',
  };

  //Eventos
  gettingComboBox=async(valorSeleccionado)=>{
    this.setState({
      valorSeleccionado:valorSeleccionado,
    });
  };

  descargarCampos=async()=>{
    /* Esta funcion se encarga de descargar los campos desde el servidor */
    try {
      const { navigation } = this.props;
      const datosUsuario=navigation.getParam('datosUsuario','some default value');

      /*Descargar los Campos iniciales*/
      response=await fetch("http://167.99.167.145/api/canalDirecto/campos/"+datosUsuario.identificador);
      responseJSON=await response.json();
      camposIniciales=responseJSON[0].flashTeamCallValue;

      /*Descargar los campos completados*/
      responseCompletados=await fetch("http://167.99.167.145/api/canalDirecto/CamposCompletados/"+datosUsuario.identificador+"/FlashTeam");
      responseJSONCompletados=await responseCompletados.json();
      try {
        camposCompletados=responseJSONCompletados[0].flashTeamCallValue;
      } catch (e) {
        camposCompletados=["mercaderistaCallValue1"];
      }
      camposNoCompletados=camposIniciales.map((campo)=>{
        if(camposCompletados.includes(campo)){
          return null
        }else{
          return campo
        }
      });


      camposNoCompletadosFiltered=camposNoCompletados.filter((campo)=>{
        if(campo!=null | campo=="***SIN SELECCIONAR***"){
          return campo
        }
      })
      return camposNoCompletadosFiltered
    } catch (e) {
      alert(e)
    }
  };

  cargarData=async()=>{
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');
    this.setState({disableButton:true});
    try {
      //Cargar las imagenes al servidor
      const { navigation } = this.props;
      let fotos=navigation.getParam('fotos','NA');
      if(fotos.length<35){
        await fotos.forEach(this.cargarIMG);
      }else{
        alert("La cantidad de fotos debe ser menor a 35");
      }

      //cargar el colmado completado
      data={
        identificador:datosUsuario.identificador,
        fecha_ejecucion:this.state.fecha_hoy.getDay()+"-"+this.state.fecha_hoy.getMonth()+"-"+this.state.fecha_hoy.getFullYear(),
        flashTeamCallValue:[this.state.valorSeleccionado],
        encuesta:"FlashTeam",
      }
      await fetch("http://167.99.167.145/api/canalDirecto/CamposCompletados",{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
      });
    } catch (e) {
      alert(e)
    }
  };

  cargarIMG=async(imagenURI,index,vector)=>{
    /* Esta funcion se utiliza para enviar las imagenes al servidor*/
    const {navigation}=this.props;
    const puntoVenta=navigation.getParam('puntoVenta','NA');
    try {
      const h = {}; //headers
      h.Accept = 'application/json';
      let formData=new FormData();
      await formData.append("foto_colmados",{uri:imagenURI,name:"FlashTeam-"+puntoVenta+".jpg",type:'image/jpg'})
      await fetch("http://167.99.167.145/api/profit_insertar_imagenes",{
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
    const fotos=navigation.getParam('fotos');
    const puntoVenta=navigation.getParam('puntoVenta');

    return(
      <ScrollView style={iniciar_seccion_styles.main}>
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Favor Seleccionar Punto de Venta</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.valorSeleccionado} style={{backgroundColor:'white',width:'100%',marginBottom:15}}>
          {this.state.campos.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>
        <Icon name='camera' type='entypo' color='white' iconStyle={{marginLeft:300,marginBottom:50}} size={40} onPress={
          ()=>{
            if(this.state.valorSeleccionado!="***SIN SELECCIONAR***"){
              this.props.navigation.navigate('CamaraTaker',{
                puntoVenta:this.state.valorSeleccionado
              });
            }else{
              alert("Debe seleccionar un punto de venta")
            }
          }
        }/>
        <Text style={{textAlign:'left',color:'white',fontSize:15}}>Imagenes Capturadas</Text>
        {typeof(fotos)!="undefined" ? <Slideshow dataSource={fotos.map((foto)=>{return{url:foto}})}/>:null}
        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300}} size={40} onPress={this.cargarData}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'white',fontSize:15}} onPress={this.cargarData}>Listo</Text>}
      </ScrollView>
    )
  }
}

const iniciar_seccion_styles=StyleSheet.create({
  main:{
    backgroundColor:'red',
    height:'100%',
    padding:6
  }
})
