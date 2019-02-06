import {createStackNavigator,createAppContainer} from 'react-navigation';
import Home from './componentes/Home.js';
import MenuMercaderista from './componentes/Menu_Mercaderista.js';
import Encuesta from './componentes/Encuesta.js';


const App = createStackNavigator(
  {
    Home: Home,
    MenuMercaderista:MenuMercaderista,
    Encuesta:Encuesta
  },
  {
    initialRouteName:"Home"
  }
);

export default createAppContainer(App);
