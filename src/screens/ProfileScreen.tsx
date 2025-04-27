import React from 'react';
import { ScrollView } from 'react-native'; // Import necessário
import styled from 'styled-components/native';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container contentContainerStyle={{ padding: 20 }}>
      <Avatar source={{
        uri: user.image || 'https://i.pravatar.cc/150?img=12',
      }} />
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
      <Role>{user.role === 'admin' ? 'Administrador' : user.role === 'staff' ? 'Equipe FURIA' : 'Fã'}</Role>

      <SectionTitle>Redes Sociais</SectionTitle>
      <Label>Instagram:</Label>
      <Value>{user.social?.instagram || '-'}</Value>
      <Label>Twitter:</Label>
      <Value>{user.social?.twitter || '-'}</Value>
      <Label>Steam:</Label>
      <Value>{user.social?.steam || '-'}</Value>
    </Container>
  );
};

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  align-self: center;
  margin-bottom: 20px;
`;

const Name = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: ${theme.colors.text};
`;

const Email = styled.Text`
  font-size: 16px;
  text-align: center;
  color: ${theme.colors.text};
  margin-bottom: 5px;
`;

const Role = styled.Text`
  font-size: 14px;
  text-align: center;
  color: ${theme.colors.secondary};
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${theme.colors.text};
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

const Value = styled.Text`
  font-size: 14px;
  color: ${theme.colors.secondary};
`;

export default ProfileScreen;
