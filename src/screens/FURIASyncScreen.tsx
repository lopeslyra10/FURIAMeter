import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Input, Button } from '@rneui/themed'; // Atualizado
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FURIASyncScreen: React.FC = () => {
  const { user } = useAuth();
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [steam, setSteam] = useState('');

  useEffect(() => {
    if (user?.social) {
      setInstagram(user.social.instagram);
      setTwitter(user.social.twitter);
      setSteam(user.social.steam);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      social: {
        instagram,
        twitter,
        steam,
      },
    };

    const storedUsers = await AsyncStorage.getItem('@FURIAMeter:registered_users');
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    users = users.map((u: any) => (u.id === user.id ? updatedUser : u));
    await AsyncStorage.setItem('@FURIAMeter:registered_users', JSON.stringify(users));
    await AsyncStorage.setItem('@FURIAMeter:user', JSON.stringify(updatedUser));

    Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
  };

  return (
    <Container contentContainerStyle={{ padding: 20 }}>
      <Title>FURIASync</Title>

      <Input
        label="Instagram"
        placeholder="@exemplo"
        value={instagram}
        onChangeText={setInstagram}
      />
      <Input
        label="Twitter"
        placeholder="@exemplo"
        value={twitter}
        onChangeText={setTwitter}
      />
      <Input
        label="Steam"
        placeholder="Seu usuário Steam"
        value={steam}
        onChangeText={setSteam}
      />

      <Button
        title="Salvar Preferências"
        onPress={handleSave}
        buttonStyle={{ backgroundColor: theme.colors.primary }}
        containerStyle={{ marginTop: 20 }}
      />
    </Container>
  );
};

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${theme.colors.text};
  text-align: center;
`;

export default FURIASyncScreen;
