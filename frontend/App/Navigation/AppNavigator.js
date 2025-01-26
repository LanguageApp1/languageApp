import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Pages/HomeScreen';
import ChatFaceScreen from '../Pages/ChatFaceScreen';
import ChatScreen from '../Pages/ChatScreen';
import ConversationHistory from '../Pages/ConversationHistory';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChatFaceScreen" component={ChatFaceScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen
          name="ConversationHistory"
          component={ConversationHistory}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
