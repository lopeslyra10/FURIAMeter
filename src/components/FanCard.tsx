import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import { Card, Text, Avatar } from '@rneui/themed';
import theme from '../styles/theme';

interface FanCardProps {
  username: string;
  platform: string;
  interaction: string;
  status: 'active' | 'highlight' | 'inactive';
  onPress?: () => void;
  style?: ViewStyle;
}

const FanCard: React.FC<FanCardProps> = ({
  username,
  platform,
  interaction,
  status,
  onPress,
  style,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'highlight':
        return theme.colors.success;
      case 'inactive':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Card containerStyle={[styles.card, style]}>
      <UserInfo>
        <Avatar
          size="medium"
          rounded
          source={{ uri: `https://i.pravatar.cc/150?u=${username}` }}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <Username>@{username}</Username>
          <PlatformText>{platform}</PlatformText>
        </TextContainer>
      </UserInfo>

      <InteractionContainer>
        <InfoRow>
          <Label>Interação:</Label>
          <Value>{interaction}</Value>
        </InfoRow>
      </InteractionContainer>

      <StatusContainer>
        <StatusDot color={getStatusColor()} />
        <Text style={{ color: getStatusColor() }}>
          {status === 'highlight' ? 'Destaque' : status === 'inactive' ? 'Inativo' : 'Ativo'}
        </Text>
      </StatusContainer>
    </Card>
  );
};

const styles = {
  card: {
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.primary,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const TextContainer = styled.View`
  margin-left: 15px;
`;

const Username = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

const PlatformText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.6;
`;

const InteractionContainer = styled.View`
  margin-bottom: 15px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.7;
`;

const Value = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
`;

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
`;

export default FanCard;
