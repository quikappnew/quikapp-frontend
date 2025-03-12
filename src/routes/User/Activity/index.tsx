import {
  BuildingOffice2Icon,
  IdentificationIcon,
  TruckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { FC, Fragment } from 'react';

const activityTypes = {
  IDScan: 'text-blue-700 bg-blue-50 ring-blue-600/20',
  Flight: 'text-purple-700 bg-purple-50 ring-purple-600/20',
  Hospital: 'text-red-700 bg-red-50 ring-red-600/20',
  Transport: 'text-green-700 bg-green-50 ring-green-600/20',
};

const generateRandomStats = () => {
  return [
    {
      name: 'Monthly Scans',
      value: `${15 + Math.floor(Math.random() * 20)}`, // Random between 15-34
      change: `+${1 + Math.floor(Math.random() * 5)}`, // Random between +1 to +5
      changeType: 'positive',
    },
    {
      name: 'Security Score',
      value: `${90 + Math.floor(Math.random() * 8)}%`, // Random between 90-97%
      change: `+${(Math.random() * 3).toFixed(1)}%`, // Random between +0.0 to +3.0%
      changeType: 'positive',
    },
    {
      name: 'Points Earned',
      value: `${5 + Math.floor(Math.random() * 10)}`, // Random between 5-14
      change: `+${Math.floor(Math.random() * 15)}`, // Random between +0 to +14
      changeType: 'positive',
    },
    {
      name: 'Average Visit Time',
      value: `${14 + Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 9)}h`, // Random between 14.0-18.9h
      change: `+${(Math.random() * 0.9).toFixed(1)}h`, // Random between +0.0 to +0.9h
      changeType: 'positive',
    },
  ];
};

const activities = [
  {
    date: 'Today',
    dateTime: '2024-03-22',
    events: [
      {
        id: 1,
        type: 'IDScan',
        location: 'Port Moresby International Airport',
        time: '14:30',
        details: 'Identity verification for airport access',
        points: 3,
        icon: IdentificationIcon,
      },
      {
        id: 2,
        type: 'Hospital',
        location: 'Port Moresby General Hospital',
        time: '11:20',
        details: 'Medical clearance check',
        points: 4,
        icon: BuildingOffice2Icon,
      },
    ],
  },
  {
    date: 'Yesterday',
    dateTime: '2024-03-21',
    events: [
      {
        id: 3,
        type: 'Transport',
        location: 'Lae City Terminal',
        time: '15:45',
        details: 'Regional transport verification',
        points: 3,
        icon: TruckIcon,
      },
      {
        id: 4,
        type: 'IDScan',
        location: 'Kokopo Government Office',
        time: '10:30',
        details: 'Local administration verification',
        points: 2,
        icon: IdentificationIcon,
      },
    ],
  },
  {
    date: 'Last Week',
    dateTime: '2024-03-15',
    events: [
      {
        id: 5,
        type: 'Flight',
        location: 'Mount Hagen Airport',
        time: '09:15',
        details: 'Domestic flight security clearance',
        points: 4,
        icon: UserIcon,
      },
      {
        id: 6,
        type: 'Hospital',
        location: 'Angau Memorial Hospital, Lae',
        time: '13:40',
        details: 'Healthcare facility access verification',
        points: 3,
        icon: BuildingOffice2Icon,
      },
      {
        id: 7,
        type: 'Transport',
        location: 'Madang Port Authority',
        time: '16:20',
        details: 'Maritime transport security check',
        points: 3,
        icon: TruckIcon,
      },
      {
        id: 8,
        type: 'IDScan',
        location: 'Goroka Municipal Office',
        time: '11:00',
        details: 'Regional administrative verification',
        points: 2,
        icon: IdentificationIcon,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const UserActivity: FC = () => {
  const stats = generateRandomStats();

  return (
    <div className="space-y-16">
      {/* Stats */}
      <div className="border-b border-b-gray-900/10">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
          {stats.map((stat, statIdx) => (
            <div
              key={stat.name}
              className={classNames(
                statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10'
              )}
            >
              <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
              <dd
                className={classNames(
                  stat.changeType === 'negative' ? 'text-rose-600' : 'text-green-600',
                  'text-xs font-medium'
                )}
              >
                {stat.change}
              </dd>
              <dd className="w-full text-3xl font-medium text-gray-900">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Activity Feed */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-6 overflow-hidden border-t border-gray-100">
          {activities.map(day => (
            <Fragment key={day.dateTime}>
              <h3 className="bg-gray-50 py-2 px-4 text-sm font-semibold text-gray-900">
                <time dateTime={day.dateTime}>{day.date}</time>
              </h3>
              <div className="divide-y divide-gray-100">
                {day.events.map(event => (
                  <div key={event.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <event.icon className="h-6 w-6 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={classNames(
                              activityTypes[event.type],
                              'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                            )}
                          >
                            {event.type}
                          </span>
                          <span className="text-sm text-gray-900">{event.location}</span>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{event.details}</p>
                        {event.points && (
                          <p className="mt-1 text-sm font-medium text-green-600">
                            Points earned: {event.points}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActivity;
