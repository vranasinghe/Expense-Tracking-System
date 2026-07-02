import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { Colors } from '../../constants/colors';
import { FontSize, Spacing, Radius } from '../../constants/theme';
import { formatDate } from '../../utils/dateHelpers';

interface NotificationsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const NOTIF_ICONS = {
  budget_alert: 'warning-outline',
  daily_reminder: 'notifications-outline',
  weekly_summary: 'bar-chart-outline',
};

const NOTIF_COLORS = {
  budget_alert: Colors.expense,
  daily_reminder: Colors.accentStart,
  weekly_summary: '#6366F1',
};

export default function NotificationsScreen({ visible, onClose }: NotificationsScreenProps) {
  const insets = useSafeAreaInsets();
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markNotificationRead);
  const clearAll = useAppStore((s) => s.clearAllNotifications);

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { paddingTop: insets.top || 16 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.textPrimaryLight} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.markAll}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Unread count */}
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <View style={styles.unreadDot} />
            <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {sorted.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </View>
          ) : (
            sorted.map((n) => (
              <TouchableOpacity
                key={n.id}
                style={[styles.notifCard, !n.isRead && styles.notifCardUnread]}
                onPress={() => markRead(n.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.notifIconBg, { backgroundColor: `${NOTIF_COLORS[n.type]}18` }]}>
                  <Ionicons
                    name={NOTIF_ICONS[n.type] as any}
                    size={20}
                    color={NOTIF_COLORS[n.type]}
                  />
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifTitleRow}>
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    {!n.isRead && <View style={styles.unreadDotSmall} />}
                  </View>
                  <Text style={styles.notifMessage}>{n.message}</Text>
                  <Text style={styles.notifDate}>{formatDate(n.createdAt)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  closeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.lightCard, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  title: { flex: 1, fontFamily: 'Poppins_700Bold', fontSize: FontSize.xl, color: Colors.textPrimaryLight },
  markAll: { fontFamily: 'Poppins_500Medium', fontSize: FontSize.sm, color: Colors.accentStart },
  unreadBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.base, paddingBottom: Spacing.md },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentStart },
  unreadText: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.base,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.lightCard,
    borderRadius: Radius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentStart,
  },
  notifIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.xs },
  notifTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.base, color: Colors.textPrimaryLight, flex: 1 },
  unreadDotSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentStart },
  notifMessage: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.xs },
  notifDate: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.xs, color: Colors.textMuted },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: Spacing.md },
  emptyTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: FontSize.lg, color: Colors.textPrimaryLight },
  emptySubtext: { fontFamily: 'Poppins_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
});
