export interface Room {
  id: string;
  createdAt: number;
  status: 'rating' | 'revealed' | 'chosen';
  activities: Activity[];
  topCount: number;
  thresholds: {
    minEach: number;
    minSum: number;
    maxGap: number;
  };
  lastActive: number;
}

export interface Activity {
  id: string;
  label: string;
}

export interface Rating {
  id?: string;
  userId: string;
  roomId: string;
  activityId: string;
  value: number;
  createdAt: number;
}

export interface Participant {
  id: string;
  roomId: string;
  displayName: string;
  joinedAt: number;
  isOnline: boolean;
  lastSeen: number;
}

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: '1', label: 'Home cooking' },
  { id: '2', label: 'Cinema' },
  { id: '3', label: 'Jardin botanique' },
  { id: '4', label: 'Planetarium' },
  { id: '5', label: 'Dancing' },
  { id: '6', label: 'Running' },
  { id: '7', label: 'Easy hike / Walk in forest' },
  { id: '8', label: 'Intermediate hike' },
  { id: '9', label: 'Cycling' },
  { id: '10', label: 'Swimming' },
  { id: '11', label: 'Apples (Apple picking / market)' },
  { id: '12', label: 'Museum / Art gallery' },
  { id: '13', label: 'Read in a library' },
  { id: '14', label: 'Just sit somewhere & do nothing / Read / Picnic' },
  { id: '15', label: 'Meditation' },
  { id: '16', label: 'Yoga at Innocere (Yoga class / studio)' }
];

export const DEFAULT_THRESHOLDS = {
  topCount: 3,
  minEach: 5,
  minSum: 12,
  maxGap: 3,
};
