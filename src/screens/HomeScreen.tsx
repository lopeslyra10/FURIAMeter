import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import { HeaderContainer, HeaderTitle } from '../components/Header';
import theme from '../styles/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { Interaction } from '../types/interaction'; // Import do tipo correto

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadInteractions = async () => {
    try {
      const stored = await AsyncStorage.getItem('@FURIAMeter:interactions');
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
          <InteractionType>{item.type}</InteractionType>
          <DateTime>{item.date}</DateTime>
          <Points>{item.points} pontos</Points>
          <StatusBadge status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmada'}
          </StatusBadge>
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
            marginBottom: theme.spacing.medium,
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

const InteractionList = styled(FlatList as new () => FlatList<Interaction>)`
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

const Points = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.success};
  margin-top: 4px;
`;

const StatusBadge = styled.Text<{ status: string }>`
  align-self: flex-start;
  background-color: ${(props) =>
    props.status === 'pending' ? theme.colors.error : theme.colors.success};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  margin-top: 8px;
  font-size: 12px;
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
