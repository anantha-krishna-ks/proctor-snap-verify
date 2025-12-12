export interface SurveyItem {
  id: string;
  title: string;
  type: 'rating' | 'text' | 'multiple-choice' | 'checkbox';
}

export interface Survey {
  id: string;
  name: string;
  instructions: string;
  items: SurveyItem[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}
