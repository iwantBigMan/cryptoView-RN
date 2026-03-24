import {StyleSheet} from 'react-native';
import {
  BackgroundPrimary,
  CardBackground,
  AccentBlue,
  TextSecondary,
  DividerColor,
  PositiveColor,
  ErrorColor,
} from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: TextSecondary,
    marginBottom: 8,
  },
  savedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  savedExchangeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  savedStatus: {
    fontSize: 12,
    color: PositiveColor,
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 20,
    color: ErrorColor,
  },
  divider: {
    height: 1,
    backgroundColor: DividerColor,
    marginVertical: 16,
  },
  card: {
    backgroundColor: CardBackground,
    borderRadius: 8,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  requiredBadge: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 230, 204, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  requiredText: {
    fontSize: 12,
    color: '#FFE6CC',
  },
  inputGroup: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: TextSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: CardBackground,
    borderWidth: 1,
    borderColor: DividerColor,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  secretInputRow: {
    position: 'relative',
  },
  secretInput: {
    paddingRight: 50,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  visibilityIcon: {
    fontSize: 18,
    color: TextSecondary,
  },
  dropdownSection: {
    gap: 8,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownButton: {
    backgroundColor: CardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectedExchangesText: {
    fontSize: 14,
    color: TextSecondary,
    flexShrink: 1,
  },
  dropdown: {
    backgroundColor: CardBackground,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6E7B86',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: AccentBlue,
    borderColor: AccentBlue,
  },
  checkmark: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: AccentBlue,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#1A1D2E',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 12,
    color: TextSecondary,
    lineHeight: 18,
  },
});
