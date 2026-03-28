import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ExchangeType, ExchangeDisplayName} from '../../domain/Coin';
import {UpbitBlue, GateIOPurple} from '../../theme/colors';
import {credentialsManager} from '../../data/local/credentialsManager';
import {styles} from './styles';

const exchangeColor: Record<ExchangeType, string> = {
  [ExchangeType.UPBIT]: UpbitBlue,
  [ExchangeType.GATEIO]: GateIOPurple,
};

interface Props {
  onLogout?: () => void;
}

export default function SettingsScreen({onLogout}: Props) {
  const linkedExchanges = credentialsManager.getSavedExchanges();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '모든 연동된 거래소 정보가 삭제됩니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            credentialsManager.clearAll();
            onLogout?.();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <Text style={styles.headerTitle}>설정</Text>

        {/* 연동된 계정 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.keyIcon}>🔑</Text>
            <Text style={styles.sectionTitle}>연동된 계정</Text>
          </View>

          {linkedExchanges.map((exchange, idx) => (
            <View key={exchange}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.exchangeRow}>
                <View style={styles.exchangeLeft}>
                  <View
                    style={[
                      styles.exchangeDot,
                      {backgroundColor: exchangeColor[exchange]},
                    ]}
                  />
                  <Text style={styles.exchangeName}>
                    {ExchangeDisplayName[exchange]}
                  </Text>
                </View>
                <Text style={styles.linkedBadge}>연동됨</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <Text style={styles.exitIcon}>🚪</Text>
          <View style={styles.logoutTextCol}>
            <Text style={styles.logoutTitle}>로그아웃</Text>
            <Text style={styles.logoutSub}>
              모든 거래소 연동이 해제됩니다
            </Text>
          </View>
        </TouchableOpacity>

        {/* 앱 정보 */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>CryptoView</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
