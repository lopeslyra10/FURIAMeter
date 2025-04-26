// src/screens/EditFanScreen.tsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, Text } from 'react-native-elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';

type EditFanScreenRouteProp = RouteProp<RootStackParamList, 'EditFan'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditFan'>;

export const EditFanScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditFanScreenRouteProp>();
  const { fan } = route.params;

  const [name, setName] = useState(fan.name);
  const [email, setEmail] = useState(fan.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) =>
          u.id === fan.id ? { ...u, name, email } : u
        );
        await AsyncStorage.setItem('@MedicalApp:users', JSON.stringify(updatedUsers));
        navigation.goBack();
      }
    } catch (e) {
      setError('Erro ao salvar alterações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Editar Fã</Title>

      <Input
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        containerStyle={{ marginBottom: 15 }}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={{ marginBottom: 15 }}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Button
        title="Salvar"
        onPress={handleSave}
        loading={loading}
        buttonStyle={{ backgroundColor: theme.colors.primary }}
        containerStyle={{ marginTop: 10 }}
      />

      <Button
        title="Cancelar"
        onPress={() => navigation.goBack()}
        buttonStyle={{ backgroundColor: theme.colors.secondary }}
        containerStyle={{ marginTop: 10 }}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 30px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default EditFanScreen;
