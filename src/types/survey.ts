export interface SurveyItem {
  id: string;
  title: string;
  type: 'rating' | 'text' | 'multiple-choice' | 'checkbox';
}

export interface Survey {
  id: string;
  name: string;
  repositoryId: string;
  instructions: string;
  items: SurveyItem[];
  status: 'draft' | 'published' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
}
