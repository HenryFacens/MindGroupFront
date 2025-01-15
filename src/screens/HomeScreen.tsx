import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ route, navigation }: Props) {
  const user_Id = route.params?.userId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [userId, setUserId] = useState(user_Id ?? '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Precisamos de acesso à galeria para enviar uma imagem.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const pickedImage = result.assets[0];
      setImageUri(pickedImage.uri || null);
      setImageBase64(pickedImage.base64 || null);
    }
  };

  const handleSaveProduct = async () => {
    try {
      // Monta o objeto
      const productData = {
        name,
        description,
        price,
        quantity,
        user_id: userId,
        imageBase64: imageBase64 ?? '',
      };

      const response = await fetch('http://localhost:3000/api/product/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errData = await response.json();
        Alert.alert('Erro', errData.message || 'Erro ao criar produto');
        return;
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert('Sucesso!', data.message || 'Produto criado com sucesso!');
        // Limpar campos
        setName('');
        setDescription('');
        setPrice('');
        setQuantity('');
        // setUserId('');
        setImageUri(null);
        setImageBase64(null);
      } else {
        Alert.alert('Erro', data.message || 'Falha ao criar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>

      {/* Preview da imagem (se existir) */}
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.imagePreview}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleSaveProduct}>
        <Text style={styles.buttonText}>Salvar Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#1a1a1a',
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#FF0000',
  },
});
