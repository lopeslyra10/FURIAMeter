import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface Interaction {
  id: string;
  fanId: string;
  fanName: string;
  interactionType: string;
  description: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed';
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadInteractions = async () => {
    try {
      const stored = await AsyncStorage.getItem('@Furiameter:interactions');
      if (stored) {
        setInteractions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar interações:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadInteractions();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInteractions();
    setRefreshing(false);
  };

  const renderInteraction = ({ item }: { item: Interaction }) => {
    return (
      <InteractionCard>
        <InfoContainer>
          <InteractionType>{item.interactionType}</InteractionType>
          <DateTime>{item.date} às {item.time}</DateTime>
          <Description>{item.description}</Description>
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmada'}
          </Status>
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </InteractionCard>
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Minhas Interações</HeaderTitle>
      </HeaderContainer>

      <Content>
        <Button
          title="Nova Interação"
          icon={
            <FontAwesome
              name="plus"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateInteraction')}
        />

        <InteractionList
          data={interactions}
          keyExtractor={(item: Interaction) => item.id}
          renderItem={renderInteraction}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyText>Nenhuma interação registrada</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

const InteractionList = styled(FlatList)`
  flex: 1;
`;

const InteractionCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const InteractionType = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;

export default HomeScreen;
