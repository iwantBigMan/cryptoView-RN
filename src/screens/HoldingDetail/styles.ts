import {StyleSheet} from 'react-native';
import {
  BackgroundPrimary,
  CardBackground,
  TextSecondary,
  TextTertiary,
} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 38,
  },
  sectionTitle: {
    fontSize: 14,
    color: TextSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: CardBackground,
    borderRadius: 12,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exchangeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  currencyTag: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  currencyTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: TextSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#22303C',
    marginVertical: 12,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitLabel: {
    fontSize: 12,
    color: TextSecondary,
  },
  profitValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  noProfitText: {
    fontSize: 12,
    color: TextTertiary,
  },
  emptyView: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: TextSecondary,
  },
});
