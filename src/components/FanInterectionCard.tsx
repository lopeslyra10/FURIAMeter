import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import { Card, Text, Avatar } from '@rneui/themed';
import theme from '../styles/theme';

interface FanInteractionCardProps {
  fanName: string;
  platform: 'Twitter' | 'Instagram' | 'Steam';
  achievement: string;
  engagement: string;
  level: 'bronze' | 'silver' | 'gold';
  onPress?: () => void;
  style?: ViewStyle;
}

const FanInteractionCard: React.FC<FanInteractionCardProps> = ({
  fanName,
  platform,
  achievement,
  engagement,
  level,
  onPress,
  style,
}) => {
  const getLevelColor = () => {
    switch (level) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      case 'bronze':
      default:
        return '#cd7f32';
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'Twitter':
        return 'https://cdn-icons-png.flaticon.com/512/733/733579.png';
      case 'Instagram':
        return 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png';
      case 'Steam':
        return 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png';
      default:
        return '';
    }
  };

  return (
    <Card containerStyle={[styles.card, style]}>
      <FanInfo>
        <Avatar
          size="medium"
          rounded
          source={{ uri: getPlatformIcon() }}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <FanName>{fanName}</FanName>
          <Achievement>{achievement}</Achievement>
        </TextContainer>
      </FanInfo>

      <EngagementInfo>
        <InfoRow>
          <InfoLabel>Plataforma:</InfoLabel>
          <InfoValue>{platform}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Engajamento:</InfoLabel>
          <InfoValue>{engagement}</InfoValue>
        </InfoRow>
      </EngagementInfo>

      <LevelContainer>
        <StatusDot color={getLevelColor()} />
        <Text style={{ color: getLevelColor() }}>
          {level === 'gold' ? 'Fã Lendário' : level === 'silver' ? 'Fã Avançado' : 'Fã Iniciante'}
        </Text>
      </LevelContainer>
    </Card>
  );
};

const styles = {
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#0D0D0D', // FURIA dark mode
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

const FanInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const TextContainer = styled.View`
  margin-left: 15px;
`;

const FanName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const Achievement = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const EngagementInfo = styled.View`
  margin-bottom: 15px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  marginBottom: 5px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const LevelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-right: 8px;
`;

export default FanInteractionCard;
