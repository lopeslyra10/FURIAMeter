import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button, Input } from '@rneui/themed';
import { ScrollView, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Interaction } from '../types/interaction';
import Header from '../components/Header';
import theme from '../styles/theme';

const CreateInteractionScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [points, setPoints] = useState('');
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');

  const handleSave = async () => {
    if (!type || !date || !points) {
      Alert.alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!user) {
      Alert.alert('Usuário não encontrado');
      return;
    }

    const newInteraction: Interaction = {
      id: uuid.v4().toString(),
      fanId: user.id,
      fanName: user.name,
      type,
      date,
      points: Number(points),
      status,
    };

    try {
      const stored = await AsyncStorage.getItem('@FURIAMeter:interactions');
      const current = stored ? JSON.parse(stored) : [];
      const updated = [...current, newInteraction];
      await AsyncStorage.setItem('@FURIAMeter:interactions', JSON.stringify(updated));
      Alert.alert('Interação registrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar interação:', error);
      Alert.alert('Erro ao salvar interação');
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.medium }}>
        <Title>Registrar Interação</Title>

        <Input
          label="Tipo de Interação"
          placeholder="Ex: Assistiu Live"
          value={type}
          onChangeText={setType}
        />
        <Input
          label="Data"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />
        <Input
          label="Pontos"
          placeholder="Ex: 10"
          keyboardType="numeric"
          value={points}
          onChangeText={setPoints}
        />
        <Input
          label="Status"
          placeholder="pending ou confirmed"
          value={status}
          onChangeText={(text) => {
            if (text === 'pending' || text === 'confirmed') {
              setStatus(text as 'pending' | 'confirmed');
            }
          }}
        />

        <Button
          title="Salvar Interação"
          onPress={handleSave}
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            marginTop: 20,
          }}
        />
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: ${theme.spacing.large}px;
  text-align: center;
  color: ${theme.colors.text};
`;

export default CreateInteractionScreen;
