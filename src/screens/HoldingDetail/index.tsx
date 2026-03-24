import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../App';
import {
  ExchangeHoldingDetail,
  CurrencyUnit,
  ExchangeDisplayName,
} from '../../domain/Coin';
import {mockExchangeHoldingDetails} from '../../data/mockCoins';
import {PositiveColor, NegativeColor} from '../../theme/colors';
import {styles} from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'HoldingDetail'>;

function formatNumber(value: number): string {
  return Math.abs(value).toLocaleString('ko-KR', {maximumFractionDigits: 0});
}

function formatPrice(value: number, unit: CurrencyUnit): string {
  return unit === CurrencyUnit.KRW
    ? `₩${formatNumber(value)}`
    : `$${formatNumber(value)}`;
}

function formatQuantity(qty: number): string {
  if (qty % 1 === 0) {
    return qty.toFixed(0);
  }
  return qty
    .toFixed(6)
    .replace(/0+$/, '')
    .replace(/\.$/, '');
}

export default function HoldingDetailScreen({route, navigation}: Props) {
  const {symbol} = route.params;

  // 심볼에 맞는 상세 데이터 (목 데이터)
  const holdings = mockExchangeHoldingDetails.filter(
    h => h.symbol === symbol,
  );

  const renderItem = ({item}: {item: ExchangeHoldingDetail}) => (
    <ExchangeHoldingCard holding={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{symbol}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 섹션 타이틀 */}
      <Text style={styles.sectionTitle}>거래소별 보유 현황</Text>

      {/* 거래소별 카드 */}
      <FlatList
        data={holdings}
        renderItem={renderItem}
        keyExtractor={item => `${item.exchange}-${item.symbol}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>보유 정보가 없습니다</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ExchangeHoldingCard({holding}: {holding: ExchangeHoldingDetail}) {
  const currencyTagColors =
    holding.currencyUnit === CurrencyUnit.KRW
      ? {bg: '#1A3A4A', text: '#BFD6E9'}
      : {bg: '#3A4A1A', text: '#D6E9BF'};

  return (
    <View style={styles.card}>
      {/* 거래소 이름 + 화폐 태그 */}
      <View style={styles.cardHeaderRow}>
        <Text style={styles.exchangeName}>
          {ExchangeDisplayName[holding.exchange]}
        </Text>
        <View style={[styles.currencyTag, {backgroundColor: currencyTagColors.bg}]}>
          <Text style={[styles.currencyTagText, {color: currencyTagColors.text}]}>
            {holding.currencyUnit}
          </Text>
        </View>
      </View>

      {/* 수량 & 평단가 */}
      <View style={styles.infoRow}>
        <InfoColumn label="수량" value={formatQuantity(holding.quantity)} />
        <InfoColumn
          label="평균 단가"
          value={
            holding.avgBuyPrice != null
              ? formatPrice(holding.avgBuyPrice, holding.currencyUnit)
              : '-'
          }
        />
      </View>

      {/* 현재가 & 평가금액 */}
      <View style={styles.infoRow}>
        <InfoColumn
          label="현재가"
          value={formatPrice(holding.currentPrice, holding.currencyUnit)}
          valueColor="#FFFFFF"
        />
        <InfoColumn
          label="평가 금액 (KRW)"
          value={`₩${formatNumber(holding.valueKrw)}`}
          valueColor="#FFFFFF"
        />
      </View>

      {/* 구분선 */}
      <View style={styles.cardDivider} />

      {/* 손익 */}
      <View style={styles.profitRow}>
        <Text style={styles.profitLabel}>손익</Text>
        <ProfitText holding={holding} />
      </View>
    </View>
  );
}

function InfoColumn({
  label,
  value,
  valueColor = '#BBDFFF',
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.infoCol}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, {color: valueColor}]}>{value}</Text>
    </View>
  );
}

function ProfitText({holding}: {holding: ExchangeHoldingDetail}) {
  if (holding.profitLoss == null || holding.profitLossPercent == null) {
    return <Text style={styles.noProfitText}>평단 정보 없음</Text>;
  }

  const isPositive = holding.profitLoss >= 0;
  const color = isPositive ? PositiveColor : NegativeColor;
  const sign = isPositive ? '+' : '';

  return (
    <Text style={[styles.profitValue, {color}]}>
      {sign}₩{formatNumber(holding.profitLoss)} (
      {holding.profitLossPercent.toFixed(2)}%)
    </Text>
  );
}
