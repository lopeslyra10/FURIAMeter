import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Button, Input } from 'react-native-elements';
import { ScrollView, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Interaction } from '../types/interaction';
import Header from '../components/Header';

const CreateInteractionScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    if (!date || !time || !description || !status) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const newInteraction: Interaction = {
      id: uuid.v4().toString(),
      staffId: user?.id ?? '',
      date,
      time,
      description,
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
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Title>Registrar Interação</Title>

        <Input
          placeholder="Data (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <Input
          placeholder="Hora (HH:mm)"
          value={time}
          onChangeText={setTime}
        />
        <Input
          placeholder="Descrição (Ex: Participou de live)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Input
          placeholder="Status (realizada, pendente, cancelada)"
          value={status}
          onChangeText={setStatus}
        />

        <Button title="Salvar Interação" onPress={handleSave} />
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

export default CreateInteractionScreen;
