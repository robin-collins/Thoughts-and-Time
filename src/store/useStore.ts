import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, startOfDay, subDays, addDays } from 'date-fns';
import { Item, Todo, Event, Routine, Note } from '../types';
import { parseInput } from '../utils/parser';

interface AppState {
  // Data
  items: Item[];

  // Actions
  addItem: (input: string) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  toggleTodoComplete: (id: string) => void;

  // Computed - get items grouped by date
  getItemsByDate: () => Map<string, Item[]>;
  getScheduledItemsByDate: () => Map<string, Item[]>;
  getAllDatesWithItems: () => string[];
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (input: string) => {
        const parsed = parseInput(input);
        const now = new Date();
        const createdDate = format(now, 'yyyy-MM-dd');

        const baseItem = {
          id: generateId(),
          userId: 'user-1',
          content: parsed.content,
          tags: parsed.tags,
          createdAt: now,
          createdDate,
          updatedAt: now,
          completedAt: null,
          cancelledAt: null,
        };

        let newItem: Item;

        switch (parsed.type) {
          case 'todo':
            newItem = {
              ...baseItem,
              type: 'todo',
              scheduledTime: parsed.scheduledTime,
              deadline: parsed.deadline,
              hasTime: parsed.hasTime,
              parentId: null,
              parentType: null,
              depthLevel: 0,
              subtasks: [],
              embeddedItems: [],
              completionLinkId: null,
            } as Todo;
            break;

          case 'event':
            newItem = {
              ...baseItem,
              type: 'event',
              startTime: parsed.scheduledTime || now,
              endTime: parsed.scheduledTime || now,
              hasTime: parsed.hasTime,
              isAllDay: !parsed.hasTime,
              splitStartId: null,
              splitEndId: null,
              embeddedItems: [],
              parentId: null,
              parentType: null,
              depthLevel: 0,
            } as Event;
            break;

          case 'routine':
            newItem = {
              ...baseItem,
              type: 'routine',
              recurrencePattern: parsed.recurrencePattern || { frequency: 'daily', interval: 1 },
              scheduledTime: parsed.scheduledTime ? format(parsed.scheduledTime, 'HH:mm') : null,
              hasTime: parsed.hasTime,
              streak: 0,
              lastCompleted: null,
              embeddedItems: [],
              parentId: null,
              parentType: null,
              depthLevel: 0,
            } as Routine;
            break;

          case 'note':
          default:
            newItem = {
              ...baseItem,
              type: 'note',
              linkPreviews: [],
              subItems: [],
              parentId: null,
              parentType: null,
              depthLevel: 0,
              orderIndex: 0,
            } as Note;
            break;
        }

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      updateItem: (id: string, updates: Partial<Item>) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
          ),
        }));
      },

      deleteItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleTodoComplete: (id: string) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id && item.type === 'todo') {
              const todo = item as Todo;
              return {
                ...todo,
                completedAt: todo.completedAt ? null : new Date(),
                updatedAt: new Date(),
              };
            }
            return item;
          }),
        }));
      },

      getItemsByDate: () => {
        const itemsByDate = new Map<string, Item[]>();
        const items = get().items;

        items.forEach((item) => {
          const date = item.createdDate;
          if (!itemsByDate.has(date)) {
            itemsByDate.set(date, []);
          }
          itemsByDate.get(date)!.push(item);
        });

        return itemsByDate;
      },

      getScheduledItemsByDate: () => {
        const itemsByDate = new Map<string, Item[]>();
        const items = get().items;

        items.forEach((item) => {
          let dateKey: string | null = null;

          if (item.type === 'todo') {
            const todo = item as Todo;
            if (todo.scheduledTime) {
              dateKey = format(new Date(todo.scheduledTime), 'yyyy-MM-dd');
            }
          } else if (item.type === 'event') {
            const event = item as Event;
            dateKey = format(new Date(event.startTime), 'yyyy-MM-dd');
          }

          if (dateKey) {
            if (!itemsByDate.has(dateKey)) {
              itemsByDate.set(dateKey, []);
            }
            itemsByDate.get(dateKey)!.push(item);
          }
        });

        return itemsByDate;
      },

      getAllDatesWithItems: () => {
        const dates = new Set<string>();
        const items = get().items;

        // Get all created dates
        items.forEach((item) => {
          dates.add(item.createdDate);
        });

        // Get all scheduled dates
        items.forEach((item) => {
          if (item.type === 'todo') {
            const todo = item as Todo;
            if (todo.scheduledTime) {
              dates.add(format(new Date(todo.scheduledTime), 'yyyy-MM-dd'));
            }
          } else if (item.type === 'event') {
            const event = item as Event;
            dates.add(format(new Date(event.startTime), 'yyyy-MM-dd'));
          }
        });

        return Array.from(dates).sort();
      },
    }),
    {
      name: 'thoughts-time-storage',
    }
  )
);
