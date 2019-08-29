import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon,Button} from 'react-native-elements';
const URL="http://167.71.9.11:5000/api/";
export default class CamaraTaker extends Component{
  constructor(props){
    super(props);
    this.state={
      fecha_hoy:new Date(), //Fecha del dia de hoy
      fotosObjeto:{},
      fotosVector:[],
      disableButton:false,
    }
  }

  static navigationOptions = {
    title: 'Tomar Fotos',
  };

  //Eventos
  capturarFoto=async()=>{
    /* Esta funcion se utiliza para capturar foto */
    const { navigation } = this.props;
    const datosEncuesta=navigation.getParam('datosEncuesta');

    //elementos FotosVector & fotosObjeto
    const fotosVector=await this.state.fotosVector;
    const fotosObjeto=await this.state.fotosObjeto;

    //Tomando imagenes
    const options = { quality: 0.5,skipProcessing:false};
    const data = await this.camera.takePictureAsync(options);

    //Insertando imagen tomada
    fotosVector.push(data.uri);

    //Guardar el objeto
    fotosObjeto[datosEncuesta.encuesta["colmado"]+"__"+datosEncuesta.id]=fotosVector

    //Guardando estados
    this.setState({
      fotosVector:fotosVector,
      fotosObjeto:fotosObjeto
    });
  };

  finishCam=async()=>{
    /*Verificar si la cantidad es la correcta*/
    const { navigation } = this.props;
    if(await this.state.fotosVector.length>0){
    this.props.navigation.navigate('MenuCamara',{
      fotosObjeto:this.state.fotosObjeto,
      fotosVector:this.state.fotosVector
    });
    alert("Foto capturada exitosamente!!");
  }else{
    alert("Debes capturar fotos")
  }
};

  //Cadenas de Eventos
  render(){
    return(
      <ScrollView>
        <RNCamera ref={ref => {this.camera = ref;}} style={cameraView.cameraStyle} flashMode={RNCamera.Constants.FlashMode.on} type={RNCamera.Constants.Type.back} permissionDialogTitle={'Permiso para acceder a la cámara'}/>
        <Icon name='camera' type='entypo' color='red' iconStyle={{marginLeft:300}} size={40} onPress={this.capturarFoto}/>
        <Text style={{marginTop:25,color:'red',fontWeight:'bold',fontSize:20,marginBottom:40}}>Cantidad de fotos: {this.state.fotosVector.length}</Text>
        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300,color:'red'}} size={40} onPress={this.finishCam}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'red',fontSize:15}} onPress={this.finishCam}>Listo</Text>}
      </ScrollView>
    )
  };
}

const cameraView=StyleSheet.create({
  cameraStyle:{
    height:350,
    width:'100%',
    alignItems:'center'
  },
  textCamera:{
    backgroundColor:'black',
    color:'white',
    fontWeight:'bold',
    width:'40%',
    height:30,
    lineHeight:30,
    textAlign:'center',
    marginLeft:'30%'
  }
});
