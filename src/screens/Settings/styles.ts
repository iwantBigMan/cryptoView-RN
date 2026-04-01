import {StyleSheet} from 'react-native';
import {
  BackgroundPrimary,
  CardBackground,
  TextSecondary,
  TextTertiary,
  ErrorColor,
  DividerColor,
  AccentBlue,
} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundPrimary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    padding: 16,
  },
  sectionCard: {
    backgroundColor: CardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  keyIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: DividerColor,
    marginVertical: 2,
  },
  exchangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  exchangeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  exchangeName: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  linkedBadge: {
    fontSize: 13,
    color: TextSecondary,
  },
  addExchangeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AccentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addIconText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  addTextCol: {
    flex: 1,
  },
  addTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addSub: {
    fontSize: 12,
    color: TextTertiary,
    marginTop: 2,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
  exitIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  logoutTextCol: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ErrorColor,
  },
  logoutSub: {
    fontSize: 12,
    color: TextTertiary,
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: TextSecondary,
  },
  appVersion: {
    fontSize: 13,
    color: TextTertiary,
    marginTop: 4,
  },
});
