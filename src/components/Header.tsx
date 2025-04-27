import React from 'react';
import styled from 'styled-components/native';
import { Avatar } from '@rneui/themed';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container>
      <UserInfo>
        <Avatar
          size="medium"
          rounded
          source={user.image ? { uri: user.image } : undefined}
          containerStyle={styles.avatar}
          title={user.name ? user.name[0] : '?'} // Se não tiver imagem, aparece a inicial do nome
        />
        <TextContainer>
          <WelcomeText>Fala, FURIOSO!</WelcomeText>
          <UserName>{user.name}</UserName>
        </TextContainer>
      </UserInfo>
    </Container>
  );
};

const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

const Container = styled.View`
  background-color: ${theme.colors.black};
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.primary};
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TextContainer = styled.View`
  margin-left: 12px;
`;

const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.7;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

export default Header;
