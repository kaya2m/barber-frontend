'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { 
  CalendarIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';
import { RecentActivity } from '@/types/auth';

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment_created':
        return <CalendarIcon className="w-5 h-5 text-blue-500" />;
      case 'appointment_confirmed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'appointment_cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'payment_completed':
        return <CreditCardIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <CalendarIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'appointment_created':
        return 'info';
      case 'appointment_confirmed':
        return 'success';
      case 'appointment_cancelled':
        return 'error';
      case 'payment_completed':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Aktiviteler</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Henüz aktivite bulunmuyor.
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500">{activity.userName}</p>
                    <Badge variant={getActivityColor(activity.type)} className="text-xs">
                      {formatDateTime(activity.timestamp)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}