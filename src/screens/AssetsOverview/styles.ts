import {StyleSheet} from 'react-native';
import {
  BackgroundSecondary,
  SurfaceDark,
  TotalBalanceCardBg,
  ItemCardBg,
  AccentBlue,
} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundSecondary,
  },
  content: {
    padding: 16,
    gap: 16,
  },

  // Total Balance
  totalCard: {
    backgroundColor: TotalBalanceCardBg,
    borderRadius: 16,
    padding: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  totalChangeText: {
    fontSize: 16,
    marginTop: 8,
  },

  // Exchange Breakdown
  breakdownCard: {
    backgroundColor: SurfaceDark,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exchangeAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  exchangeAmountItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  exchangeAmountLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  exchangeAmountValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Top Holdings
  holdingsCard: {
    backgroundColor: SurfaceDark,
    borderRadius: 16,
    padding: 20,
  },
  holdingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: AccentBlue,
  },
  holdingsList: {
    gap: 12,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ItemCardBg,
    borderRadius: 12,
    padding: 16,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TotalBalanceCardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbolIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  holdingInfo: {
    flex: 1,
  },
  holdingNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  holdingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exchangeCountBadge: {
    marginLeft: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  exchangeCountText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  exchangeDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  exchangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreExchanges: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  holdingChange: {
    fontSize: 12,
    marginTop: 2,
  },
});
