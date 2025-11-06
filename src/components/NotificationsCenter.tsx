import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, ShoppingCart, Star, MessageSquare, Trash2 } from 'lucide-react';
import { useBusiness, Notification } from '@/contexts/BusinessContext';
import { toast } from 'sonner';

const NotificationsCenter = () => {
  const { business, markNotificationAsRead, getUnreadNotifications } = useBusiness();

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No business data found</p>
      </div>
    );
  }

  const unreadCount = getUnreadNotifications().length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50 border-blue-200';
      case 'review':
        return 'bg-yellow-50 border-yellow-200';
      case 'message':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <Badge className="bg-red-500">{unreadCount} Unread</Badge>
        )}
      </div>

      {business.notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {business.notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border ${getNotificationColor(notification.type)} ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await markNotificationAsRead(notification.id);
                          } catch (error) {
                            console.error('Error marking notification as read:', error);
                          }
                        }}
                      >
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {business.notifications.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-900">
              💡 You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}. Stay on top of your orders and customer feedback!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsCenter;

