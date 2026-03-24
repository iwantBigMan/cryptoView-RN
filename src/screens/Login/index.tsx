import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ExchangeType,
  ExchangeDisplayName,
} from '../../domain/Coin';
import {TextSecondary} from '../../theme/colors';
import {styles} from './styles';

interface Props {
  onLoginSuccess: () => void;
}

interface ExchangeInput {
  apiKey: string;
  secretKey: string;
}

export default function LoginScreen({onLoginSuccess}: Props) {
  const [upbitInput, setUpbitInput] = useState<ExchangeInput>({
    apiKey: '',
    secretKey: '',
  });
  const [selectedExchanges, setSelectedExchanges] = useState<ExchangeType[]>(
    [],
  );
  const [foreignInputs, setForeignInputs] = useState<
    Record<string, ExchangeInput>
  >({});
  const [savedCredentials, setSavedCredentials] = useState<ExchangeType[]>([]);
  const [upbitSecretVisible, setUpbitSecretVisible] = useState(false);
  const [foreignSecretVisible, setForeignSecretVisible] = useState<
    Record<string, boolean>
  >({});
  const [showExchangeDropdown, setShowExchangeDropdown] = useState(false);

  const foreignExchanges = Object.values(ExchangeType).filter(
    e => e !== ExchangeType.UPBIT,
  );

  const toggleExchange = (ex: ExchangeType) => {
    setSelectedExchanges(prev =>
      prev.includes(ex) ? prev.filter(e => e !== ex) : [...prev, ex],
    );
  };

  const handleSave = () => {
    if (!upbitInput.apiKey.trim() || !upbitInput.secretKey.trim()) {
      Alert.alert('연동 실패', 'Upbit API Key와 Secret Key를 입력하세요.');
      return;
    }
    // 목 데이터: 저장 성공 시뮬레이션
    const saved = [ExchangeType.UPBIT, ...selectedExchanges];
    setSavedCredentials(saved);
    onLoginSuccess();
  };

  const handleDeleteCredential = (ex: ExchangeType) => {
    setSavedCredentials(prev => prev.filter(e => e !== ex));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <Text style={styles.headerTitle}>거래소 연동</Text>

        {/* 저장된 거래소 목록 */}
        {savedCredentials.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>연동된 거래소</Text>
            {savedCredentials.map(ex => (
              <View key={ex} style={styles.savedItem}>
                <View>
                  <Text style={styles.savedExchangeName}>
                    {ExchangeDisplayName[ex]}
                  </Text>
                  <Text style={styles.savedStatus}>연동됨</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteCredential(ex)}
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
              value={upbitInput.apiKey}
              onChangeText={text =>
                setUpbitInput(prev => ({...prev, apiKey: text}))
              }
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Secret Key</Text>
            <View style={styles.secretInputRow}>
              <TextInput
                style={[styles.input, styles.secretInput]}
                placeholder="Secret Key를 입력하세요"
                placeholderTextColor={TextSecondary}
                value={upbitInput.secretKey}
                onChangeText={text =>
                  setUpbitInput(prev => ({...prev, secretKey: text}))
                }
                secureTextEntry={!upbitSecretVisible}
                autoCorrect={false}
                autoCapitalize="none"
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
              {selectedExchanges
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
                      selectedExchanges.includes(ex) &&
                        styles.checkboxSelected,
                    ]}>
                    {selectedExchanges.includes(ex) && (
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
        {selectedExchanges.map(ex => (
          <View key={ex} style={styles.card}>
            <Text style={styles.cardTitle}>{ExchangeDisplayName[ex]}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>API Key</Text>
              <TextInput
                style={styles.input}
                placeholder="API Key를 입력하세요"
                placeholderTextColor={TextSecondary}
                value={foreignInputs[ex]?.apiKey ?? ''}
                onChangeText={text =>
                  setForeignInputs(prev => ({
                    ...prev,
                    [ex]: {...(prev[ex] ?? {apiKey: '', secretKey: ''}), apiKey: text},
                  }))
                }
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Secret Key</Text>
              <View style={styles.secretInputRow}>
                <TextInput
                  style={[styles.input, styles.secretInput]}
                  placeholder="Secret Key를 입력하세요"
                  placeholderTextColor={TextSecondary}
                  value={foreignInputs[ex]?.secretKey ?? ''}
                  onChangeText={text =>
                    setForeignInputs(prev => ({
                      ...prev,
                      [ex]: {
                        ...(prev[ex] ?? {apiKey: '', secretKey: ''}),
                        secretKey: text,
                      },
                    }))
                  }
                  secureTextEntry={!foreignSecretVisible[ex]}
                  autoCorrect={false}
                  autoCapitalize="none"
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
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>연동하기</Text>
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
