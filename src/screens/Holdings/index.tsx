import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AggregatedHolding,
  ExchangeType,
  ExchangeColor,
} from '../../domain/Coin';
import {mockAggregatedHoldings} from '../../data/mockCoins';
import {PositiveGreen, NegativeRed} from '../../theme/colors';
import {styles} from './styles';

type SortType = 'VALUE' | 'PROFIT' | 'SYMBOL';

interface Props {
  onHoldingClick?: (symbol: string) => void;
}

export default function HoldingsScreen({onHoldingClick}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('VALUE');

  const filteredHoldings = useMemo(() => {
    let result = [...mockAggregatedHoldings];

    // 검색 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        h =>
          h.normalizedSymbol.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q),
      );
    }

    // 정렬
    switch (sortType) {
      case 'VALUE':
        result.sort((a, b) => b.totalValue - a.totalValue);
        break;
      case 'PROFIT':
        result.sort((a, b) => b.totalChangePercent - a.totalChangePercent);
        break;
      case 'SYMBOL':
        result.sort((a, b) =>
          a.normalizedSymbol.localeCompare(b.normalizedSymbol),
        );
        break;
    }

    return result;
  }, [searchQuery, sortType]);

  const renderItem = ({item}: {item: AggregatedHolding}) => (
    <AggregatedHoldingCard
      holding={item}
      onClick={() => onHoldingClick?.(item.normalizedSymbol)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Holdings</Text>
        <Text style={styles.refreshIcon}>↻</Text>
      </View>

      {/* 검색바 */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search coins..."
        placeholderTextColor="#808080"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {/* 정렬 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortRow}
        contentContainerStyle={styles.sortContent}>
        {(['VALUE', 'PROFIT', 'SYMBOL'] as SortType[]).map(st => (
          <TouchableOpacity
            key={st}
            style={[
              styles.sortChip,
              sortType === st && styles.sortChipSelected,
            ]}
            onPress={() => setSortType(st)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.sortChipText,
                sortType === st && styles.sortChipTextSelected,
              ]}>
              {st === 'VALUE' ? 'Value' : st === 'PROFIT' ? 'Profit' : 'Symbol'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 보유 코인 목록 */}
      {filteredHoldings.length === 0 ? (
        <View style={styles.emptyView}>
          <Text style={styles.emptyTitle}>No holdings found</Text>
          <Text style={styles.emptySubtitle}>
            Connect your exchange to see holdings
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHoldings}
          renderItem={renderItem}
          keyExtractor={item => item.normalizedSymbol}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

function AggregatedHoldingCard({
  holding,
  onClick,
}: {
  holding: AggregatedHolding;
  onClick: () => void;
}) {
  const isPositive = holding.totalChange >= 0;
  const changeColor = isPositive ? PositiveGreen : NegativeRed;
  const sign = isPositive ? '+' : '';

  return (
    <TouchableOpacity
      style={styles.holdingCard}
      onPress={onClick}
      activeOpacity={0.7}>
      <View style={styles.holdingLeft}>
        {/* 코인 아이콘 */}
        <View style={styles.coinIcon}>
          <Text style={styles.coinIconText}>
            {holding.normalizedSymbol.slice(0, 3)}
          </Text>
        </View>

        <View style={styles.coinInfo}>
          <View style={styles.coinNameRow}>
            <Text style={styles.coinSymbol}>{holding.normalizedSymbol}</Text>
            {holding.holdings.length > 1 && (
              <View style={styles.exchangeCountBadge}>
                <Text style={styles.exchangeCountText}>
                  {holding.holdings.length}개 거래소
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.coinBalance}>
            {holding.totalBalance < 1
              ? holding.totalBalance.toFixed(4)
              : holding.totalBalance.toFixed(2)}{' '}
            {holding.normalizedSymbol}
          </Text>
          {/* 거래소 색상 점 */}
          <View style={styles.exchangeDots}>
            {holding.exchanges.slice(0, 4).map((ex: ExchangeType) => (
              <View
                key={ex}
                style={[styles.dot, {backgroundColor: ExchangeColor[ex]}]}
              />
            ))}
            {holding.exchanges.length > 4 && (
              <Text style={styles.moreText}>
                +{holding.exchanges.length - 4}
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
          {sign}₩
          {Math.abs(holding.totalChange).toLocaleString('ko-KR', {
            maximumFractionDigits: 0,
          })}{' '}
          ({holding.totalChangePercent.toFixed(2)}%)
        </Text>
      </View>
    </TouchableOpacity>
  );
}
