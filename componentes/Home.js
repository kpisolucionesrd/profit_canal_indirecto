import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Button,Alert,AsyncStorage} from 'react-native';
import {Icon} from 'react-native-elements';
import Logo from '../imagenes/logo_profit.png';


export default class Home extends Component{
  constructor(props){
    super(props);
    this.state={
      momentoAhora:new Date()
    }
    this.VerificacionLoggin() //Verificar si el usuario ha realizado loggin
}
  static navigationOptions = {
    title: 'Inicio',
  };

  //Eventos de las entradas {textbox}
  gettingUser(typeduser){
    this.setState({
      usuarioDigitado:typeduser
    })
  };

  gettingPassword(typedPassword){
    this.setState({
      passwordDigitado:typedPassword
    })
  };

  //Eventos
  CredencialesProcess=async()=>{
    //Esta funcion realizara un request al servidor en busqueda de las credenciales de usuario

    //Reiniciar el equipo
    if(this.state.usuarioDigitado=="MarioProfit" && this.state.passwordDigitado=="AdminProfit")
    {
      await AsyncStorage.clear() //Limpiar el Async Storage
      alert("El Dispositivo fue reiniciado completamente")
    }else
    {
      //Proceso para hacer login con el servidor
      response=await fetch("http://167.99.167.145/api/profit_usuarios/"+this.state.usuarioDigitado);
      responseJSON=await response.json();
        if(responseJSON[0].password==this.state.passwordDigitado){

          //Guardando status de la sesion
          await AsyncStorage.setItem("sesionstatus","online");

          //Guardando los datos del mercaderista
          await AsyncStorage.setItem("datosUsuario",await JSON.stringify(responseJSON[0]));

          //Guardando los colmados del mercaderista
          angendaRequest=await fetch("http://167.99.167.145/api/profit_agenda_trabajo/"+this.state.usuarioDigitado)
          angendaRequestJSON=await angendaRequest.json()
          AsyncStorage.setItem("datosAgenda",JSON.stringify(angendaRequestJSON[0]))

          //Ir al menu de mercaderistas
          this.props.navigation.navigate("MenuMercaderista",{
            datosUsuario:responseJSON[0]
          });
        }else{
          alert("Contraseña Incorrecta!")
        }
    }
  };

  VerificacionLoggin=async()=>{
    //Este metodo verificara si la session fue terminada o aun sigue vigente.
    await AsyncStorage.clear() //Limpiar el Async Storage ********************TEMPORAL*********************
    let momentoLoggin =await AsyncStorage.getItem("momentoLoggin");
    let datosUsuario= JSON.parse(await AsyncStorage.getItem("datosUsuario"));
    if(momentoLoggin!=this.state.momentoAhora.getFullYear()+"-"+this.state.momentoAhora.getMonth()+"-"+this.state.momentoAhora.getDay())
    {
      await AsyncStorage.clear() //Limpiar el Async Storage
      await AsyncStorage.setItem("momentoLoggin",this.state.momentoAhora.getFullYear()+"-"+this.state.momentoAhora.getMonth()+"-"+this.state.momentoAhora.getDay())
    }else
    {
      this.props.navigation.navigate("MenuMercaderista",{
        datosUsuario:datosUsuario
      });
    }
  }

  //Cadenas de Eventos
  cadenaEventosLOGGING=async()=>{
    await this.CredencialesProcess();
  }

  render(){
    return(
      <ScrollView style={iniciar_seccion_styles.main}>
        <Image source={Logo} style={iniciar_seccion_styles.logo_profit} />
        <Text style={iniciar_seccion_styles.version}>Profit Canal Indirecto</Text>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Text style={iniciar_seccion_styles.labels}>Usuario</Text>
          <TextInput placeholder="Digite su Usuario" style={iniciar_seccion_styles.text_box} onChangeText={this.gettingUser.bind(this)}/>
          <Text style={iniciar_seccion_styles.labels}>Contraseña</Text>
          <TextInput placeholder="Digite su contraseña" secureTextEntry={true} style={iniciar_seccion_styles.text_box_password} onChangeText={this.gettingPassword.bind(this)}/>
        </KeyboardAvoidingView>
        <Icon name='login' type='entypo' color='white' size={40} onPress={this.cadenaEventosLOGGING}/>
        <Text style={{color:'white',fontWeight:'bold',fontSize:30,textAlign:'center'}} onPress={this.cadenaEventosLOGGING}>Entrar</Text>
      </ScrollView>
    )
  }
}

const iniciar_seccion_styles=StyleSheet.create({
  main:{
    backgroundColor:'red',
    height:'100%',
    padding:6,
  },
  logo_profit:{
    width:'100%',
    height:200,
    marginBottom:10,
    resizeMode: 'contain',
  },
  version:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center'
  },
  releasedate:{
    color:'white',
    fontSize:16,
    textAlign:'center',
    marginBottom:20,
  },
  labels:{
    fontSize:15,
    color:'white',
    fontWeight:'bold',
  },
  text_box:{
    borderColor:'black',
    borderWidth:0.3,
    backgroundColor:'white',
    width:'100%',
    marginBottom:0,
  },
  text_box_password:{
    borderColor:'black',
    borderWidth:0.3,
    backgroundColor:'white',
    width:'100%',
    marginBottom:40,
  },
  btn_inicio_seccion:{
    marginTop:200,
  }
})
