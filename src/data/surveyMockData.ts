import type { Survey, SurveyItem } from '@/types/survey';

export const availableSurveyItems: SurveyItem[] = [
  { id: 'item-1', title: 'How would you rate your overall experience?', type: 'rating' },
  { id: 'item-2', title: 'What did you like most about the course?', type: 'text' },
  { id: 'item-3', title: 'How likely are you to recommend this to others?', type: 'rating' },
  { id: 'item-4', title: 'Which topics were most helpful?', type: 'multiple-choice' },
  { id: 'item-5', title: 'Select all areas that need improvement', type: 'checkbox' },
  { id: 'item-6', title: 'Rate the instructor\'s teaching style', type: 'rating' },
  { id: 'item-7', title: 'Any additional comments or suggestions?', type: 'text' },
  { id: 'item-8', title: 'How would you rate the course materials?', type: 'rating' },
  { id: 'item-9', title: 'Which learning format do you prefer?', type: 'multiple-choice' },
  { id: 'item-10', title: 'Rate the difficulty level of the course', type: 'rating' },
];

export const mockSurveys: Survey[] = [
  {
    id: 'survey-1',
    name: 'Course Feedback Survey',
    instructions: 'Please take a few minutes to provide your feedback on the course. Your responses will help us improve future offerings.',
    items: [
      { id: 'item-1', title: 'How would you rate your overall experience?', type: 'rating' },
      { id: 'item-2', title: 'What did you like most about the course?', type: 'text' },
      { id: 'item-3', title: 'How likely are you to recommend this to others?', type: 'rating' },
    ],
    status: 'published',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-10T15:30:00Z',
  },
  {
    id: 'survey-2',
    name: 'Instructor Evaluation',
    instructions: 'Please evaluate your instructor based on the following criteria. All responses are anonymous.',
    items: [
      { id: 'item-6', title: 'Rate the instructor\'s teaching style', type: 'rating' },
      { id: 'item-7', title: 'Any additional comments or suggestions?', type: 'text' },
    ],
    status: 'draft',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z',
  },
  {
    id: 'survey-3',
    name: 'Learning Experience Assessment',
    instructions: 'Help us understand your learning experience better by completing this survey.',
    items: [
      { id: 'item-8', title: 'How would you rate the course materials?', type: 'rating' },
      { id: 'item-9', title: 'Which learning format do you prefer?', type: 'multiple-choice' },
      { id: 'item-10', title: 'Rate the difficulty level of the course', type: 'rating' },
    ],
    status: 'published',
    createdAt: '2024-02-28T08:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z',
  },
];
