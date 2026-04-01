import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DonutChart from '../../components/DonutChart';
import {
  ExchangeType,
  ExchangeDisplayName,
  ExchangeColor,
} from '../../domain/model/Exchange';
import type {AggregatedHolding, ExchangeData} from '../../domain/model/Holding';
import {usePortfolioContext} from '../../context/PortfolioContext';
import {PositiveGreen, NegativeRed, AccentBlue} from '../../theme/colors';
import {styles} from './styles';

interface Props {
  onNavigateToHoldings?: () => void;
}

function formatKRW(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}₩${Math.abs(value).toLocaleString('ko-KR', {maximumFractionDigits: 0})}`;
}

export default function AssetsOverviewScreen({onNavigateToHoldings}: Props) {
  const {state, refresh} = usePortfolioContext();
  const topHoldings = state.aggregated.slice(0, 5);

  if (state.isLoading && state.aggregated.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={AccentBlue} />
          <Text style={{color: 'rgba(255,255,255,0.6)', marginTop: 12}}>
            자산 데이터 로딩 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {state.error && (
          <View style={{backgroundColor: '#3B1111', borderRadius: 8, padding: 12, marginBottom: 4}}>
            <Text style={{color: '#F87171', fontSize: 13}}>{state.error}</Text>
          </View>
        )}

        {/* Total Balance Card */}
        <TotalBalanceCard
          totalValue={state.totalValue}
          totalChange={state.totalChange}
          totalChangeRate={state.totalChangeRate}
        />

        {/* Exchange Breakdown Card */}
        <ExchangeBreakdownCard exchangeBreakdown={state.exchangeBreakdown} />

        {/* Top 5 Holdings Card */}
        <TopHoldingsCard
          holdings={topHoldings}
          onViewAllClick={onNavigateToHoldings}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── TotalBalanceCard ──
function TotalBalanceCard({
  totalValue,
  totalChange,
  totalChangeRate,
}: {
  totalValue: number;
  totalChange: number;
  totalChangeRate: number;
}) {
  const isPositive = totalChange >= 0;
  const changeColor = isPositive ? PositiveGreen : NegativeRed;

  return (
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>자산</Text>
      <Text style={styles.totalValue}>
        ₩{totalValue.toLocaleString('ko-KR', {maximumFractionDigits: 0})}
      </Text>
      <Text style={[styles.totalChangeText, {color: changeColor}]}>
        {formatKRW(totalChange)} ({totalChangeRate.toFixed(2)}%)
      </Text>
    </View>
  );
}

// ── ExchangeBreakdownCard ──
function ExchangeBreakdownCard({exchangeBreakdown}: {exchangeBreakdown: ExchangeData[]}) {
  const visibleExchanges = exchangeBreakdown.filter(e => e.totalValue > 0);

  const segments = visibleExchanges.map(ex => ({
    color: ExchangeColor[ex.exchange],
    value: ex.totalValue,
  }));

  return (
    <View style={styles.breakdownCard}>
      <Text style={styles.sectionTitle}>Exchange Breakdown</Text>

      {/* 도넛 차트 */}
      <DonutChart segments={segments} />

      {/* 거래소별 색 점 + 이름 + 금액 */}
      <View style={styles.exchangeAmounts}>
        {visibleExchanges.map(ex => (
          <View key={ex.exchange} style={styles.exchangeAmountItem}>
            <View
              style={[
                styles.legendDot,
                {backgroundColor: ExchangeColor[ex.exchange]},
              ]}
            />
            <Text style={styles.exchangeAmountLabel}>
              {ExchangeDisplayName[ex.exchange]}
            </Text>
            <Text style={styles.exchangeAmountValue}>
              ₩
              {ex.totalValue.toLocaleString('ko-KR', {
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── TopHoldingsCard ──
function TopHoldingsCard({
  holdings,
  onViewAllClick,
}: {
  holdings: AggregatedHolding[];
  onViewAllClick?: () => void;
}) {
  return (
    <View style={styles.holdingsCard}>
      <View style={styles.holdingsHeader}>
        <Text style={styles.sectionTitle}>Top 5 Holdings</Text>
        <TouchableOpacity onPress={onViewAllClick} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.holdingsList}>
        {holdings.map(holding => (
          <AggregatedHoldingItem
            key={holding.normalizedSymbol}
            holding={holding}
          />
        ))}
      </View>
    </View>
  );
}

// ── AggregatedHoldingItem ──
function AggregatedHoldingItem({holding}: {holding: AggregatedHolding}) {
  const isPositive = holding.totalChange >= 0;
  const changeColor = isPositive ? PositiveGreen : NegativeRed;

  return (
    <View style={styles.holdingItem}>
      <View style={styles.holdingLeft}>
        <View style={styles.symbolIcon}>
          <Text style={styles.symbolIconText}>
            {holding.normalizedSymbol.slice(0, 2)}
          </Text>
        </View>

        <View style={styles.holdingInfo}>
          <View style={styles.holdingNameRow}>
            <Text style={styles.holdingName}>
              {holding.normalizedSymbol}
            </Text>
            {holding.holdings.length > 1 && (
              <View style={styles.exchangeCountBadge}>
                <Text style={styles.exchangeCountText}>
                  {holding.holdings.length}개 거래소
                </Text>
              </View>
            )}
          </View>
          <View style={styles.exchangeDots}>
            {holding.exchanges.slice(0, 3).map(ex => (
              <View
                key={ex}
                style={[
                  styles.exchangeDot,
                  {backgroundColor: ExchangeColor[ex]},
                ]}
              />
            ))}
            {holding.exchanges.length > 3 && (
              <Text style={styles.moreExchanges}>
                +{holding.exchanges.length - 3}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.holdingRight}>
        <Text style={styles.holdingValue}>
          ₩
          {holding.totalValue.toLocaleString('ko-KR', {
            maximumFractionDigits: 0,
          })}
        </Text>
        <Text style={[styles.holdingChange, {color: changeColor}]}>
          {formatKRW(holding.totalChange)} ({holding.totalChangePercent.toFixed(2)}
          %)
        </Text>
      </View>
    </View>
  );
}
