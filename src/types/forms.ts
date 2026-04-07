export interface Repository {
  id: string;
  name: string;
  formCount: number;
  createdAt: string;
}

export interface FormConfiguration {
  id: string;
  name: string;
  repositoryId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  // Exam Rules
  examRules: {
    duration: number; // in minutes
    language: string;
    allowBackNavigation: boolean;
    enableSectionTimers: boolean;
    allowPauseResume: boolean;
    showItemFeedback: boolean;
  };
  // Exam Instructions
  examInstructions: string;
  // Security
  security: {
    startPaused: boolean;
    preventCopyPaste: boolean;
    disableRightClick: boolean;
    fullScreenMode: boolean;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  };
}

// Branching target for navigation
export type BranchingTarget = 
  | { type: 'next' }  // Continue to next question
  | { type: 'section'; sectionId: string }  // Go to specific section
  | { type: 'item'; itemId: string }  // Go to specific item
  | { type: 'end' };  // End the form

// MCQ option with optional branching
export interface ItemOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  branchTo?: BranchingTarget;
}

export interface FormItem {
  id: string;
  title: string;
  type: 'mcq' | 'essay' | 'fill-blank' | 'true-false';
  marks: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  options?: ItemOption[];  // For MCQ items
  hasBranching?: boolean;  // Flag to indicate branching is enabled
}

export interface FormSection {
  id: string;
  name: string;
  items: FormItem[];
}

export interface FormBlueprint {
  id: string;
  name: string;
  description: string;
  rules: {
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    type?: FormItem['type'];
    count: number;
  }[];
}

export interface Form {
  id: string;
  name: string;
  code: string;
  repositoryId: string;
  configurationId: string;
  configurationName: string;
  model: string;
  items: FormItem[];
  totalMarks: number;
  totalQuestions: number;
  status: 'draft' | 'published' | 'archived' | 'completed' | 'in-progress';
  scheduled: number;
  sections: number;
  createdBy: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export const defaultConfiguration: FormConfiguration = {
  id: 'default',
  name: 'Default Configuration',
  repositoryId: 'repo-1',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
  examRules: {
    duration: 60,
    language: 'English',
    allowBackNavigation: true,
    enableSectionTimers: false,
    allowPauseResume: false,
    showItemFeedback: false,
  },
  examInstructions: '<p>Please read all questions carefully before answering.</p><p>You can navigate between questions using the navigation panel.</p>',
  security: {
    startPaused: false,
    preventCopyPaste: true,
    disableRightClick: true,
    fullScreenMode: false,
    shuffleQuestions: false,
    shuffleOptions: false,
  },
};
