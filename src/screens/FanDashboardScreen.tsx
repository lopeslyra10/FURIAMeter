import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type FanDashboardScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FanDashboard'>;
};

interface Interaction {
  id: string;
  fanId: string;
  type: string; // Ex: "chat", "quiz", "stream"
  date: string;
  points: number;
  status: 'pending' | 'confirmed';
}

interface StyledProps {
  status: string;
}

const getStatusColor = (status: string) => {
  return status === 'confirmed' ? theme.colors.success : theme.colors.warning;
};

const getStatusText = (status: string) => {
  return status === 'confirmed' ? 'Confirmada' : 'Pendente';
};

const FanDashboardScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<FanDashboardScreenProps['navigation']>();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInteractions = async () => {
    try {
      const stored = await AsyncStorage.getItem('@FURIAMeter:interactions');
      if (stored) {
        const all: Interaction[] = JSON.parse(stored);
        const userInteractions = all.filter(item => item.fanId === user?.id);
        setInteractions(userInteractions);
      }
    } catch (error) {
      console.error('Erro ao carregar interações:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadInteractions();
    }, [])
  );

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Minhas Interações</Title>

        <Button
          title="Meu Perfil"
          onPress={() => navigation.navigate('Profile')}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {loading ? (
          <LoadingText>Carregando...</LoadingText>
        ) : interactions.length === 0 ? (
          <EmptyText>Nenhuma interação registrada</EmptyText>
        ) : (
          interactions.map((item) => (
            <InteractionCard key={item.id}>
              <ListItem.Content>
                <ListItem.Title style={styles.interactionType as TextStyle}>
                  Tipo: {item.type}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.dateTime as TextStyle}>
                  {item.date}
                </ListItem.Subtitle>
                <Text style={styles.points as TextStyle}>
                  Pontos: {item.points}
                </Text>
                <StatusBadge status={item.status}>
                  <StatusText status={item.status}>
                    {getStatusText(item.status)}
                  </StatusText>
                </StatusBadge>
              </ListItem.Content>
            </InteractionCard>
          ))
        )}

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
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
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  interactionType: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  points: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginTop: 4,
  },
  dateTime: {
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

const InteractionCard = styled(ListItem)`
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

const StatusBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => getStatusColor(props.status) + '20'};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const StatusText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => getStatusColor(props.status)};
  font-size: 12px;
  font-weight: 500;
`;

export default FanDashboardScreen;
