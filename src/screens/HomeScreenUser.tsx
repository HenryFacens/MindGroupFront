import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreenUser'>;

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  user_id: number;
  image?: string;
};

export function HomeScreenUser({ route, navigation }: Props) {
  const userId = route.params?.userId;

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/get_products');
      if (!response.ok) {
        Alert.alert('Erro', 'Não foi possível obter a lista de produtos.');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        Alert.alert('Erro', data.message || 'Falha ao buscar produtos');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <View style={styles.productContainer}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.infoText}>
          Preço: R$ {parseFloat(String(item.price)).toFixed(2)}
        </Text>
        <Text style={styles.infoText}>Quantidade: {item.quantity}</Text>

        {item.image && (
          <Image
            source={{ uri: `data:image/png;base64,${item.image}` }}
            style={styles.productImage}
            resizeMode="contain"
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Produtos</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  productContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF0000',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#1a1a1a',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#FFF',
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 4,
    color: '#ccc',
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  productImage: {
    width: '100%',
    height: 150,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
});
