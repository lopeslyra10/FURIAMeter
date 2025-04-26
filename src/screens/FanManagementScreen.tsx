import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FanManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FanManagement'>;
};

interface Fan {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'fan';
}

interface StyledProps {
  role: string;
}

const FanManagementScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<FanManagementScreenProps['navigation']>();
  const [fans, setFans] = useState<Fan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFans = async () => {
    try {
      const storedFans = await AsyncStorage.getItem('@FURIAMeter:fans');
      if (storedFans) {
        const allFans: Fan[] = JSON.parse(storedFans);
        const filteredFans = allFans.filter(f => f.id !== user?.id);
        setFans(filteredFans);
      }
    } catch (error) {
      console.error('Erro ao carregar fãs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFan = async (fanId: string) => {
    try {
      const storedFans = await AsyncStorage.getItem('@FURIAMeter:fans');
      if (storedFans) {
        const allFans: Fan[] = JSON.parse(storedFans);
        const updatedFans = allFans.filter(f => f.id !== fanId);
        await AsyncStorage.setItem('@FURIAMeter:fans', JSON.stringify(updatedFans));
        loadFans();
      }
    } catch (error) {
      console.error('Erro ao deletar fã:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFans();
    }, [])
  );

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'staff':
        return 'Equipe FURIA';
      case 'fan':
        return 'Fã';
      default:
        return role;
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Gerenciar Fãs</Title>

        <Button
          title="Adicionar Novo Fã"
          onPress={() => {}}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando fãs...</LoadingText>
        ) : fans.length === 0 ? (
          <EmptyText>Nenhum fã cadastrado</EmptyText>
        ) : (
          fans.map((fan) => (
            <FanCard key={fan.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.fanName as TextStyle}>
                  {fan.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.fanEmail as TextStyle}>
                  {fan.email}
                </ListItem.Subtitle>
                <RoleBadge role={fan.role}>
                  <RoleText role={fan.role}>
                    {getRoleText(fan.role)}
                  </RoleText>
                </RoleBadge>
                <ButtonContainer>
                <Button
                    title="Editar"
                    onPress={() => navigation.navigate('EditFan', { fan })}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteFan(fan.id)}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.deleteButton}
                  />
                </ButtonContainer>
              </ListItem.Content>
            </FanCard>
          ))
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  backButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  fanName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  fanEmail: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const FanCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const RoleBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'staff':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const RoleText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary;
      case 'staff':
        return theme.colors.success;
      default:
        return theme.colors.secondary;
    }
  }};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export default FanManagementScreen;
