import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon,Button} from 'react-native-elements';

export default class CamaraTaker extends Component{
  constructor(props){
    super(props);
    this.state={
      fecha_hoy:new Date(), //Fecha del dia de hoy
      fotos:[],
      disableButton:false,
    }
  }

  static navigationOptions = {
  title: 'Tomar Fotos FlashTeam',
  };

  //Eventos
  capturarFoto=async()=>{
    /* Esta funcion se utiliza para capturar foto */
    const { navigation } = this.props;

    const fotos=await this.state.fotos;
    const puntoVenta=navigation.getParam('puntoVenta');
    const options = { quality: 0.8,skipProcessing:true};
    const data = await this.camera.takePictureAsync(options);
    fotos.push(data.uri);
    this.setState({
      fotos:fotos
    });
  }

  finishCam=async()=>{
    /*Verificar si la cantidad es la correcta*/
    const { navigation } = this.props;
    const puntoVenta=navigation.getParam('puntoVenta');
    if(await this.state.fotos.length>0){
    this.props.navigation.navigate('EncuestaFlashTeam',{
      fotos:this.state.fotos,
      puntoVenta:puntoVenta
    });
    alert("Foto capturada exitosamente!!");
  }else{
    alert("Debes capturar fotos")
  }
}

  //Cadenas de Eventos
  render(){
    return(
      <ScrollView>
        <RNCamera ref={ref => {this.camera = ref;}} style={cameraView.cameraStyle} flashMode={RNCamera.Constants.FlashMode.on} type={RNCamera.Constants.Type.back} permissionDialogTitle={'Permission to use camera'} permissionDialogMessage={'We need your permission to use your camera phone'}/>
        <Icon name='camera' type='entypo' color='red' iconStyle={{marginLeft:300}} size={40} onPress={this.capturarFoto}/>
        <Text style={{marginTop:25,color:'red',fontWeight:'bold',fontSize:20,marginBottom:40}}>Cantidad de fotos: {this.state.fotos.length}</Text>
        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300,color:'red'}} size={40} onPress={this.finishCam}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'red',fontSize:15}} onPress={this.finishCam}>Listo</Text>}
      </ScrollView>
    )
  }
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
})
