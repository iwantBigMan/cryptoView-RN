import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ExchangeType,
  ExchangeDisplayName,
} from '../../domain/Coin';
import {TextSecondary, ErrorColor} from '../../theme/colors';
import {useLogin} from '../../hooks/useLogin';
import {styles} from './styles';

interface Props {
  onLoginSuccess: () => void;
}

export default function LoginScreen({onLoginSuccess}: Props) {
  const {
    state,
    updateApiKey,
    updateSecretKey,
    toggleExchange,
    saveCredentials,
    deleteCredentials,
    clearError,
  } = useLogin(onLoginSuccess);

  const [upbitSecretVisible, setUpbitSecretVisible] = useState(false);
  const [foreignSecretVisible, setForeignSecretVisible] = useState<
    Record<string, boolean>
  >({});
  const [showExchangeDropdown, setShowExchangeDropdown] = useState(false);

  const foreignExchanges = Object.values(ExchangeType).filter(
    e => e !== ExchangeType.UPBIT,
  );

  // 에러 발생 시 3초 후 자동 클리어
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.error, clearError]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <Text style={styles.headerTitle}>거래소 연동</Text>

        {/* 에러 배너 */}
        {state.error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        )}

        {/* 저장된 거래소 목록 */}
        {state.savedCredentials.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>연동된 거래소</Text>
            {state.savedCredentials.map(ex => (
              <View key={ex} style={styles.savedItem}>
                <View>
                  <Text style={styles.savedExchangeName}>
                    {ExchangeDisplayName[ex]}
                  </Text>
                  <Text style={styles.savedStatus}>연동됨</Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteCredentials(ex)}
                  activeOpacity={0.7}>
                  <Text style={styles.deleteButton}>🗑</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.divider} />
          </>
        )}

        {/* 업비트 입력 카드 (필수) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {ExchangeDisplayName[ExchangeType.UPBIT]}
            </Text>
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>필수</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>API Key</Text>
            <TextInput
              style={styles.input}
              placeholder="API Key를 입력하세요"
              placeholderTextColor={TextSecondary}
              value={state.inputs[ExchangeType.UPBIT]?.apiKey ?? ''}
              onChangeText={text => updateApiKey(ExchangeType.UPBIT, text)}
              autoCorrect={false}
              autoCapitalize="none"
              editable={!state.isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Secret Key</Text>
            <View style={styles.secretInputRow}>
              <TextInput
                style={[styles.input, styles.secretInput]}
                placeholder="Secret Key를 입력하세요"
                placeholderTextColor={TextSecondary}
                value={state.inputs[ExchangeType.UPBIT]?.secretKey ?? ''}
                onChangeText={text => updateSecretKey(ExchangeType.UPBIT, text)}
                secureTextEntry={!upbitSecretVisible}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!state.isLoading}
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setUpbitSecretVisible(!upbitSecretVisible)}
                activeOpacity={0.7}>
                <Text style={styles.visibilityIcon}>
                  {upbitSecretVisible ? '👁' : '👁‍🗨'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 해외 거래소 드롭다운 */}
        <View style={styles.dropdownSection}>
          <View style={styles.dropdownRow}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowExchangeDropdown(!showExchangeDropdown)}
              activeOpacity={0.7}>
              <Text style={styles.dropdownButtonText}>해외 거래소 선택</Text>
            </TouchableOpacity>
            <Text style={styles.selectedExchangesText}>
              선택:{' '}
              {state.selectedExchanges
                .map(e => ExchangeDisplayName[e])
                .join(', ') || '없음'}
            </Text>
          </View>

          {showExchangeDropdown && (
            <View style={styles.dropdown}>
              {foreignExchanges.map(ex => (
                <TouchableOpacity
                  key={ex}
                  style={styles.dropdownItem}
                  onPress={() => toggleExchange(ex)}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.checkbox,
                      state.selectedExchanges.includes(ex) &&
                        styles.checkboxSelected,
                    ]}>
                    {state.selectedExchanges.includes(ex) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.dropdownItemText}>
                    {ExchangeDisplayName[ex]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 선택된 해외 거래소 입력 필드 */}
        {state.selectedExchanges.map(ex => (
          <View key={ex} style={styles.card}>
            <Text style={styles.cardTitle}>{ExchangeDisplayName[ex]}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>API Key</Text>
              <TextInput
                style={styles.input}
                placeholder="API Key를 입력하세요"
                placeholderTextColor={TextSecondary}
                value={state.inputs[ex]?.apiKey ?? ''}
                onChangeText={text => updateApiKey(ex, text)}
                autoCorrect={false}
                autoCapitalize="none"
                editable={!state.isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Secret Key</Text>
              <View style={styles.secretInputRow}>
                <TextInput
                  style={[styles.input, styles.secretInput]}
                  placeholder="Secret Key를 입력하세요"
                  placeholderTextColor={TextSecondary}
                  value={state.inputs[ex]?.secretKey ?? ''}
                  onChangeText={text => updateSecretKey(ex, text)}
                  secureTextEntry={!foreignSecretVisible[ex]}
                  autoCorrect={false}
                  autoCapitalize="none"
                  editable={!state.isLoading}
                />
                <TouchableOpacity
                  style={styles.visibilityToggle}
                  onPress={() =>
                    setForeignSecretVisible(prev => ({
                      ...prev,
                      [ex]: !prev[ex],
                    }))
                  }
                  activeOpacity={0.7}>
                  <Text style={styles.visibilityIcon}>
                    {foreignSecretVisible[ex] ? '👁' : '👁‍🗨'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* 연동하기 버튼 */}
        <TouchableOpacity
          style={[styles.saveButton, state.isLoading && styles.saveButtonDisabled]}
          onPress={saveCredentials}
          activeOpacity={0.7}
          disabled={state.isLoading}>
          {state.isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>연동하기</Text>
          )}
        </TouchableOpacity>

        {/* 안내 카드 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📌 필수 안내</Text>
          <Text style={styles.infoText}>
            {'• 업비트 연동은 필수입니다 (USDT/KRW 환율 조회용)\n' +
              '• 해외 거래소는 선택사항입니다\n' +
              '• API Key는 거래소 웹사이트에서 발급받을 수 있습니다\n' +
              '• 출금 권한은 체크하지 마세요\n' +
              '• API Key는 암호화되어 기기에만 저장됩니다'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
