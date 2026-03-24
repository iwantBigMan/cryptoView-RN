import {StyleSheet} from 'react-native';
import {
  BackgroundSecondary,
  SurfaceDark,
  AccentBlue,
  ChipSelectedBg,
  ChipUnselectedBg,
  TextSecondary,
} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundSecondary,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  refreshIcon: {
    fontSize: 22,
    color: TextSecondary,
  },
  searchInput: {
    backgroundColor: SurfaceDark,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortRow: {
    marginTop: 12,
    marginBottom: 16,
    flexGrow: 0,
  },
  sortContent: {
    gap: 8,
  },
  sortChip: {
    backgroundColor: ChipUnselectedBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortChipSelected: {
    backgroundColor: ChipSelectedBg,
  },
  sortChipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  sortChipTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    gap: 12,
    paddingBottom: 16,
  },
  holdingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SurfaceDark,
    borderRadius: 16,
    padding: 16,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AccentBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coinInfo: {
    flex: 1,
  },
  coinNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: '700',
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
  coinBalance: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  exchangeDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  holdingChange: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },
});
