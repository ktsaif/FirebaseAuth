import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ToastAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Login</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={'#000'}
          style={{
            backgroundColor: 'lightgray',
            width: '80%',
            padding: 10,
            marginVertical: 10,
            color: '#000',
            fontWeight: 'bold',
          }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={'#000'}
          style={{
            backgroundColor: 'lightgray',
            width: '80%',
            padding: 10,
            marginVertical: 10,
            color: '#000',
            fontWeight: 'bold',
          }}
        />
        <Button title="Register" onPress={() => register(email, password)} />
        <View style={{ padding: 10 }}></View>
        <Button title="Login" onPress={() => login(email, password)} />
      </View>
    );
  }


  function register(email, password) {
    if (email && password) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          ToastAndroid.show('User account created & signed in!', ToastAndroid.SHORT);
          console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            ToastAndroid.show('That email address is already in use!', ToastAndroid.SHORT);
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            ToastAndroid.show('That email address is invalid!', ToastAndroid.SHORT);
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    } else {
      ToastAndroid.show('Fill up the required fields email and password.', ToastAndroid.SHORT);
    }
  }

  function login(email, password) {
    if (email && password) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          ToastAndroid.show('User successfully signed in!', ToastAndroid.SHORT);
          console.log('User signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/invalid-email') {
            ToastAndroid.show('The email address is invalid!', ToastAndroid.SHORT);
            console.log('That email address is invalid!');
          }

          if (error.code === 'auth/wrong-password') {
            ToastAndroid.show('Thae password is invalid!', ToastAndroid.SHORT);
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    } else {
      ToastAndroid.show('Fill up the required fields email and password.', ToastAndroid.SHORT);
    }

  }


  function signout() {
    auth()
      .signOut()
      .then(() => ToastAndroid.show('User signed out!', ToastAndroid.SHORT));
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
      <Text>Welcome {user.email}</Text>
      <Button title="Logout" onPress={() => signout()} />
    </View>
  );
}

export default App