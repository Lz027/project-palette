import type { BoardTemplateConfig, BoardTemplate } from '@/types';

export const BOARD_TEMPLATES: BoardTemplateConfig[] = [
  {
    id: 'canvas',
    name: 'Canvas',
    description: 'A blank slate for your creativity. Start fresh with complete freedom.',
    icon: 'Layout',
    defaultColumns: ['Ideas', 'Working On', 'Complete'],
    features: ['Unlimited columns', 'Full customization', 'No constraints'],
  },
  {
    id: 'sprint',
    name: 'Sprint',
    description: 'Perfect for agile teams running sprints. Track backlog to done.',
    icon: 'Zap',
    defaultColumns: ['Backlog', 'Sprint Ready', 'In Progress', 'Review', 'Done'],
    features: ['Sprint tracking', 'Story points', 'Velocity metrics'],
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    description: 'Creative project management with multiple parallel workstreams.',
    icon: 'Grid3X3',
    defaultColumns: ['Inspiration', 'Drafts', 'In Review', 'Approved', 'Published'],
    features: ['Visual cards', 'Multiple views', 'Tag organization'],
  },
  {
    id: 'compass',
    name: 'Compass',
    description: 'Goal tracking and milestone management. Navigate your objectives.',
    icon: 'Compass',
    defaultColumns: ['Goals', 'Milestones', 'In Progress', 'Achieved'],
    features: ['OKR tracking', 'Progress bars', 'Target dates'],
  },
  {
    id: 'rhythm',
    name: 'Rhythm',
    description: 'Daily and weekly planning. Find your productive rhythm.',
    icon: 'Calendar',
    defaultColumns: ['Today', 'This Week', 'Next Week', 'Someday'],
    features: ['Daily planning', 'Recurring tasks', 'Time blocks'],
  },
  {
    id: 'spark',
    name: 'Spark',
    description: 'Brainstorming and ideation board. Capture every spark of inspiration.',
    icon: 'Lightbulb',
    defaultColumns: ['Raw Ideas', 'Exploring', 'Promising', 'Action Items'],
    features: ['Quick capture', 'Voting', 'Idea clustering'],
  },
];

export const BOARD_COLORS = [
  { id: 'coral', name: 'Coral', class: 'bg-board-coral' },
  { id: 'lavender', name: 'Lavender', class: 'bg-board-lavender' },
  { id: 'mint', name: 'Mint', class: 'bg-board-mint' },
  { id: 'sky', name: 'Sky', class: 'bg-board-sky' },
  { id: 'peach', name: 'Peach', class: 'bg-board-peach' },
  { id: 'rose', name: 'Rose', class: 'bg-board-rose' },
] as const;

export function getTemplateIcon(template: BoardTemplate): string {
  return BOARD_TEMPLATES.find(t => t.id === template)?.icon || 'Layout';
}
