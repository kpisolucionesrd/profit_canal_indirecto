import React, {Component} from 'react';
import {Image, StyleSheet, Text, View,ScrollView,TextInput,KeyboardAvoidingView,Alert,AsyncStorage,Picker} from 'react-native';
import RadioBottom from './ElementosCompactos/radioBottom.js';
import TextInputComponent from './ElementosCompactos/textInput.js';
import {Icon,Button} from 'react-native-elements';

export default class Encuesta extends Component{
  constructor(props){
    super(props);
    this.setState({
      default:"**Seleccionar**"
    })
    //Funciones
    this.obtenerDatosEncuesta();
  };

  static navigationOptions = {
    title: 'Encuesta Mercaderista',
  };

  //Eventos
  obtenerDatosEncuesta=async()=>{
    /* Esta funcion se utiliza para obtener los campos descargados a la hora de realizar el loggin*/

    //Aqui se configura los campos del formulario, colmados
    try {
      //Creacion de los states
      this.setState({
        campos:JSON.parse(await AsyncStorage.getItem("datosUsuario")).camposForm,
        colmados:JSON.parse(await AsyncStorage.getItem("datosAgenda")).colmados,
      })
    } catch (e) {
      alert("Error en funcion-obtenerDatosEncuesta---> "+e)
    }
  }

  crearJson=async(idCampo,nuevo_resultado)=>{
    //Proceso para crear el JSON con los datos de la encuesta
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');

    let objetoDatos=this.state.objetoDatosMedidas; //Obtener el Json del constructor

    if(idCampo.includes("CD80-")){
      objetoDatos.cremasDetales80[idCampo]=idCampo+"|"+nuevo_resultado /* Se Queda */
    }else if (idCampo.includes("HD50-")){
      objetoDatos.hiloDental50[idCampo]=idCampo+"|"+nuevo_resultado
    }else if (idCampo.includes("S65-")){
      objetoDatos.suavizantes65[idCampo]=idCampo+"|"+nuevo_resultado
    }else if (idCampo.includes("LL45-")){
      objetoDatos.lavaplatosLiquidos45[idCampo]=idCampo+"|"+nuevo_resultado
    }else if (idCampo.includes("CP65-")){
      objetoDatos.cepillosDentales[idCampo]=idCampo+"|"+nuevo_resultado /* Se Queda */
    }else if (idCampo.includes("JT50-")){
      objetoDatos.jabonesTocador50[idCampo]=idCampo+"|"+nuevo_resultado
    }else if (idCampo.includes("EB40-")){
      objetoDatos.enjuagueBucal40[idCampo]=idCampo+"|"+nuevo_resultado /* Se Queda */
    }else if (idCampo.includes("D30-")){
      objetoDatos.desodorante30[idCampo]=idCampo+"|"+nuevo_resultado
    }else if (idCampo.includes("LC50-")){
      objetoDatos.lavaplatosCrema50[idCampo]=idCampo+"|"+nuevo_resultado
    }else if (idCampo.includes("DESpul-")){
      objetoDatos.desinfectantes[idCampo]=idCampo+"|"+nuevo_resultado
    }else{
      alert("Campos no identificados")
    }
    this.setState({
      objetoDatos:objetoDatos,
    })
  };

  completarMedidas=async()=>{
    const { navigation } = this.props;
    const datosUsuario=navigation.getParam('datosUsuario','some default value');
    const datosRadar=navigation.getParam('dataRadarExhibiciones','some default value');

    if(
      Object.keys(this.state.objetoDatosMedidas.cremasDetales80).length==this.state.cremasDetales80.length &
      Object.keys(this.state.objetoDatosMedidas.hiloDental50).length==this.state.hiloDental50.length &
      Object.keys(this.state.objetoDatosMedidas.suavizantes65).length==this.state.suavizantes65.length &
      Object.keys(this.state.objetoDatosMedidas.lavaplatosLiquidos45).length==this.state.lavaplatosLiquidos45.length &
      Object.keys(this.state.objetoDatosMedidas.cepillosDentales).length==this.state.cepillosDentales.length &
      Object.keys(this.state.objetoDatosMedidas.jabonesTocador50).length==this.state.jabonesTocador50.length &
      Object.keys(this.state.objetoDatosMedidas.enjuagueBucal40).length==this.state.enjuagueBucal40.length &
      Object.keys(this.state.objetoDatosMedidas.desodorante30).length==this.state.desodorante30.length &
      Object.keys(this.state.objetoDatosMedidas.lavaplatosCrema50).length==this.state.lavaplatosCrema50.length &
      Object.keys(this.state.objetoDatosMedidas.desinfectantes).length==this.state.desinfectantes.length &
      this.state.puntoVenta!="***SIN SELECCIONAR***"
    ){
      //Desabilitar button
      this.setState({
        disableButton:true
      })

      //Cargar los datos
      data={
        identificador:datosUsuario.identificador,
        fecha_ejecucion:this.state.fecha_hoy.getDay()+"-"+this.state.fecha_hoy.getMonth()+"-"+this.state.fecha_hoy.getFullYear(),
        datosMedidas:JSON.stringify(this.state.objetoDatosMedidas),
      }
      await fetch("http://167.99.167.145/api/canalDirecto/DatosCompletados",{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
      });

      //cargar el colmado completado
      dataCamposCompletados={
        identificador:datosUsuario.identificador,
        fecha_ejecucion:this.state.fecha_hoy.getDay()+"-"+this.state.fecha_hoy.getMonth()+"-"+this.state.fecha_hoy.getFullYear(),
        mercaderistaCallValue:[this.state.puntoVenta],
        encuesta:"MedidasEspacios"
      }
      await fetch("http://167.99.167.145/api/canalDirecto/CamposCompletados",{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(dataCamposCompletados)
      });

      //Volver al menu
      await this.props.navigation.navigate(datosUsuario.perfil,{
        datosUsuario:datosUsuario,
      })
    }else{
      alert("Faltan Campos por completar")
    }
  };

  gettingComboBox=async(valorSeleccionado)=>{
    this.setState({
      puntoVenta:valorSeleccionado,
    });
  };

  //Cadenas de Eventos
  render(){
    return(
      <ScrollView style={iniciar_seccion_styles.main}>

        {/*Label Seleccionar Colmado*/}
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Favor Seleccionar Colmado</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.puntoVenta} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {this.state.colmados.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        {/*Estados de los Colmados*/}
        <Text style={iniciar_seccion_styles.secciones}>ESTADO DEL COLMADO</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.puntoVenta} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {this.state.camposForm.estadoColmado.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        {/*Disosicion del Colmadero*/}
        <Text style={iniciar_seccion_styles.secciones}>DISPOSICION DEL COLMADERO</Text>
        {this.state.camposForm.dispColmaderoSiNo.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Disposicion Colmadero</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.puntoVenta} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {this.state.camposForm.dispColmadero.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        {/*Tipo de Acceso al Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>TIPO DE ACCESO AL COLMADO</Text>

        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Acceso Colmado</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.puntoVenta} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {this.state.camposForm.tipoAccesoColmado.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        {/*Tamaño del Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>TAMAñO DEL COLMADO</Text>

        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Tamaño del Colmado</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.puntoVenta} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {this.state.camposForm.tamañoColmado.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        {/*Capacidad del Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>CAPACIDAD DEL COLMADO</Text>
        {this.state.camposForm.capacidadColmadoSiNo.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        <TextInputComponent identificador="Cantidad de Deliverys" funcion={this.crearJson} default={this.state.default}/>

        {/*Tipo Ventana*/}
        <Text style={iniciar_seccion_styles.secciones}>TIPO VENTANA</Text>
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Tipo Ventana</Text>
        <Picker onValueChange={this.gettingComboBox} selectedValue={this.state.puntoVenta} style={{backgroundColor:'white',width:'100%',marginBottom:30}}>
          {this.state.camposForm.tipoVentana.map((campo)=><Picker.Item label={campo} value={campo} />)}
        </Picker>

        <TextInputComponent identificador="Cantidad Tramos Ventana" funcion={this.crearJson} default={this.state.default}/>

        {/*Iniciativas de Visibilidad*/}
        <Text style={iniciar_seccion_styles.secciones}>INICIATIVAS DE VISIBILIDAD</Text>
        {this.state.camposForm.iniciativasVisibilidad.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        {/*Surtido Colmado*/}
        <Text style={iniciar_seccion_styles.secciones}>SURTIDO COLMADO</Text>
        {this.state.camposForm.surtidoColmado.map((campo)=><RadioBottom identificacion={campo} funcion={this.crearJson}/>)}

        {/*Actividad Competitiva*/}
        <Text style={iniciar_seccion_styles.secciones}>ACTIVIDAD COMPETITIVA</Text>
        {this.state.camposForm.actividadCompetitiva.map((campo)=><TextBoxInputCustom identificacion={campo} funcion={this.crearJson} value={campo}/>)}

        <Text style={iniciar_seccion_styles.secciones}>COMENTARIOS GENERALES</Text>
        {this.state.camposForm.map((campo)=><TextBoxInputCustom identificacion={campo} funcion={this.crearJson} value={campo}/>)}

        <Icon disabled={this.state.disableButton} name='done' type='materiallcons' color='white' iconStyle={{marginLeft:300}} size={40} onPress={this.completarMedidas}/>
        {this.state.disableButton ? null:<Text style={{marginLeft:300,color:'white',fontSize:15,marginBottom:15}} onPress={this.completarMedidas}>Listo</Text>}

      </ScrollView>
    )
  }
}

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
