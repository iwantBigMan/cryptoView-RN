import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DonutChart from '../../components/DonutChart';
import {
  ExchangeType,
  ExchangeDisplayName,
  ExchangeColor,
  AggregatedHolding,
} from '../../domain/Coin';
import {
  mockAggregatedHoldings,
  mockExchangeBreakdown,
  mockTotalValue,
  mockTotalChange,
  mockTotalChangeRate,
} from '../../data/mockCoins';
import {PositiveGreen, NegativeRed} from '../../theme/colors';
import {styles} from './styles';

interface Props {
  onNavigateToHoldings?: () => void;
}

function formatKRW(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}₩${Math.abs(value).toLocaleString('ko-KR', {maximumFractionDigits: 0})}`;
}

export default function AssetsOverviewScreen({onNavigateToHoldings}: Props) {
  const topHoldings = mockAggregatedHoldings.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Total Balance Card */}
        <TotalBalanceCard
          totalValue={mockTotalValue}
          totalChange={mockTotalChange}
          totalChangeRate={mockTotalChangeRate}
        />

        {/* Exchange Breakdown Card */}
        <ExchangeBreakdownCard />

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
function ExchangeBreakdownCard() {
  const visibleExchanges = mockExchangeBreakdown.filter(e => e.totalValue > 0);

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
