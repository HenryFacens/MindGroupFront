import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // console.log('Email:', email);
    // console.log('Senha:', password);

    try {
      const response = await fetch('http://localhost:3000/api/users_get/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('Erro de login:', response.status);
        alert('Login falhou. Verifique suas credenciais.');
        return;
      }

      const data = await response.json();

      if (data?.success) {
        const userId = data?.user?.id;
        const isAdmin = data?.user?.is_admin;
        console.log('Usuário logado:', userId, 'É admin?', isAdmin);

        if (isAdmin == 1) {
          navigation.navigate('Home', { userId, isAdmin });
        } else {
          navigation.navigate('HomeScreenUser', { userId, isAdmin });
        }
      } else {
        alert(data?.message || 'Falha no login.');
      }
    } catch (error) {
      console.error('Erro ao chamar o backend:', error);
      alert('Não foi possível conectar ao servidor.');
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Tela de Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#FFF',
    borderColor: '#FF0000',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 250,
    height: 125,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  containerImage: {
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',

  }
});
