// Next-gen Form Management Types

export type FormType = "test" | "survey" | "quiz" | "practice";
export type NavigationStyle = "forward-only" | "free" | "section-locked";
export type ScoringType = "scaled" | "raw" | "weighted" | "none";
export type DifficultyLevel = "easy" | "medium" | "hard" | "mixed";
export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
export type ExposureStatus = "new" | "active" | "flagged" | "retired";

export interface FormMetadata {
  id: string;
  title: string;
  subject: string;
  grade?: string;
  type: FormType;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
}

export interface FormPreferences {
  duration: number; // in minutes
  navigationStyle: NavigationStyle;
  scoringType: ScoringType;
  passingScore?: number;
  proctoring: {
    enabled: boolean;
    webcam: boolean;
    screenShare: boolean;
    lockdownBrowser: boolean;
  };
  anonymity: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  allowReview: boolean;
}

export interface BlueprintRule {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  bloomLevel?: BloomLevel;
  count: number;
  mandatory?: boolean;
}

export interface FormExposure {
  totalCandidates: number;
  completionRate: number;
  avgScore: number;
  reliability: number;
  lastUsed: string;
  usageCount: number;
}

export interface FormVersion {
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string;
  isActive: boolean;
}

export interface FormTemplate {
  id: string;
  metadata: FormMetadata;
  preferences: FormPreferences;
  blueprint: BlueprintRule[];
  exposure: FormExposure;
  versions: FormVersion[];
  status: ExposureStatus;
}

// Mock Data
export const mockFormTemplates: FormTemplate[] = [
  {
    id: "form-1",
    metadata: {
      id: "form-1",
      title: "Grade 10 Math Aptitude Test",
      subject: "Mathematics",
      grade: "Grade 10",
      type: "test",
      tags: ["Algebra", "Geometry", "Statistics", "Aptitude"],
      description: "Comprehensive math aptitude assessment covering core topics for Grade 10 students.",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-03-10T14:30:00Z",
      createdBy: "Dr. Sarah Johnson",
      version: 3,
    },
    preferences: {
      duration: 60,
      navigationStyle: "forward-only",
      scoringType: "scaled",
      passingScore: 65,
      proctoring: {
        enabled: true,
        webcam: true,
        screenShare: false,
        lockdownBrowser: true,
      },
      anonymity: false,
      shuffleQuestions: true,
      shuffleOptions: true,
      showResults: true,
      allowReview: false,
    },
    blueprint: [
      { id: "bp-1", topic: "Algebra", difficulty: "medium", bloomLevel: "apply", count: 10, mandatory: true },
      { id: "bp-2", topic: "Geometry", difficulty: "hard", bloomLevel: "analyze", count: 5, mandatory: true },
      { id: "bp-3", topic: "Statistics", difficulty: "easy", bloomLevel: "understand", count: 5, mandatory: false },
    ],
    exposure: {
      totalCandidates: 1240,
      completionRate: 94.5,
      avgScore: 68,
      reliability: 0.82,
      lastUsed: "2024-03-10",
      usageCount: 15,
    },
    versions: [
      { version: 3, createdAt: "2024-03-10", createdBy: "Dr. Sarah Johnson", changes: "Added 3 new geometry questions", isActive: true },
      { version: 2, createdAt: "2024-02-05", createdBy: "Dr. Sarah Johnson", changes: "Updated scoring weights", isActive: false },
      { version: 1, createdAt: "2024-01-15", createdBy: "Dr. Sarah Johnson", changes: "Initial version", isActive: false },
    ],
    status: "active",
  },
  {
    id: "form-2",
    metadata: {
      id: "form-2",
      title: "Employee Satisfaction Survey",
      subject: "HR",
      type: "survey",
      tags: ["Engagement", "Culture", "Workplace", "Feedback"],
      description: "Annual employee satisfaction and engagement survey to measure workplace culture.",
      createdAt: "2024-02-01T09:00:00Z",
      updatedAt: "2024-02-28T16:45:00Z",
      createdBy: "HR Analytics Team",
      version: 2,
    },
    preferences: {
      duration: 15,
      navigationStyle: "free",
      scoringType: "none",
      proctoring: {
        enabled: false,
        webcam: false,
        screenShare: false,
        lockdownBrowser: false,
      },
      anonymity: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      showResults: false,
      allowReview: true,
    },
    blueprint: [
      { id: "bp-4", topic: "Job Satisfaction", difficulty: "easy", count: 4 },
      { id: "bp-5", topic: "Work Environment", difficulty: "easy", count: 3 },
      { id: "bp-6", topic: "Leadership", difficulty: "easy", count: 3 },
      { id: "bp-7", topic: "Open Feedback", difficulty: "medium", count: 2 },
    ],
    exposure: {
      totalCandidates: 856,
      completionRate: 78.2,
      avgScore: 78,
      reliability: 0.91,
      lastUsed: "2024-02-28",
      usageCount: 4,
    },
    versions: [
      { version: 2, createdAt: "2024-02-28", createdBy: "HR Analytics", changes: "Added open-ended questions", isActive: true },
      { version: 1, createdAt: "2024-02-01", createdBy: "HR Analytics", changes: "Initial survey design", isActive: false },
    ],
    status: "active",
  },
  {
    id: "form-3",
    metadata: {
      id: "form-3",
      title: "Science Knowledge Assessment",
      subject: "Science",
      grade: "Grade 8",
      type: "test",
      tags: ["Physics", "Chemistry", "Biology", "General Science"],
      description: "Comprehensive science assessment covering physics, chemistry, and biology fundamentals.",
      createdAt: "2024-01-20T11:00:00Z",
      updatedAt: "2024-03-05T10:15:00Z",
      createdBy: "Science Dept",
      version: 4,
    },
    preferences: {
      duration: 45,
      navigationStyle: "section-locked",
      scoringType: "weighted",
      passingScore: 60,
      proctoring: {
        enabled: true,
        webcam: true,
        screenShare: true,
        lockdownBrowser: true,
      },
      anonymity: false,
      shuffleQuestions: true,
      shuffleOptions: true,
      showResults: true,
      allowReview: true,
    },
    blueprint: [
      { id: "bp-8", topic: "Physics", difficulty: "medium", bloomLevel: "apply", count: 8, mandatory: true },
      { id: "bp-9", topic: "Chemistry", difficulty: "medium", bloomLevel: "understand", count: 8 },
      { id: "bp-10", topic: "Biology", difficulty: "easy", bloomLevel: "remember", count: 9 },
    ],
    exposure: {
      totalCandidates: 2150,
      completionRate: 91.3,
      avgScore: 72,
      reliability: 0.85,
      lastUsed: "2024-03-05",
      usageCount: 28,
    },
    versions: [
      { version: 4, createdAt: "2024-03-05", createdBy: "Science Dept", changes: "Updated physics section", isActive: true },
      { version: 3, createdAt: "2024-02-15", createdBy: "Science Dept", changes: "Added biology diagrams", isActive: false },
    ],
    status: "active",
  },
  {
    id: "form-4",
    metadata: {
      id: "form-4",
      title: "English Proficiency Test",
      subject: "English",
      grade: "Grade 12",
      type: "test",
      tags: ["Reading", "Writing", "Grammar", "Vocabulary"],
      description: "Advanced English proficiency assessment for Grade 12 students.",
      createdAt: "2024-02-10T08:30:00Z",
      updatedAt: "2024-02-25T12:00:00Z",
      createdBy: "Language Dept",
      version: 2,
    },
    preferences: {
      duration: 90,
      navigationStyle: "free",
      scoringType: "scaled",
      passingScore: 70,
      proctoring: {
        enabled: true,
        webcam: true,
        screenShare: false,
        lockdownBrowser: false,
      },
      anonymity: false,
      shuffleQuestions: false,
      shuffleOptions: true,
      showResults: true,
      allowReview: true,
    },
    blueprint: [
      { id: "bp-11", topic: "Reading Comprehension", difficulty: "hard", bloomLevel: "analyze", count: 10, mandatory: true },
      { id: "bp-12", topic: "Grammar", difficulty: "medium", bloomLevel: "apply", count: 15 },
      { id: "bp-13", topic: "Vocabulary", difficulty: "medium", bloomLevel: "remember", count: 10 },
      { id: "bp-14", topic: "Writing", difficulty: "hard", bloomLevel: "create", count: 2, mandatory: true },
    ],
    exposure: {
      totalCandidates: 680,
      completionRate: 88.7,
      avgScore: 65,
      reliability: 0.79,
      lastUsed: "2024-02-25",
      usageCount: 8,
    },
    versions: [
      { version: 2, createdAt: "2024-02-25", createdBy: "Language Dept", changes: "Revised writing prompts", isActive: true },
      { version: 1, createdAt: "2024-02-10", createdBy: "Language Dept", changes: "Initial version", isActive: false },
    ],
    status: "active",
  },
  {
    id: "form-5",
    metadata: {
      id: "form-5",
      title: "Product Feedback Survey",
      subject: "Product",
      type: "survey",
      tags: ["UX", "Features", "Satisfaction", "NPS"],
      description: "Customer feedback survey for product improvements.",
      createdAt: "2024-03-01T14:00:00Z",
      updatedAt: "2024-03-08T09:30:00Z",
      createdBy: "Product Team",
      version: 1,
    },
    preferences: {
      duration: 10,
      navigationStyle: "free",
      scoringType: "none",
      proctoring: {
        enabled: false,
        webcam: false,
        screenShare: false,
        lockdownBrowser: false,
      },
      anonymity: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      showResults: false,
      allowReview: true,
    },
    blueprint: [
      { id: "bp-15", topic: "User Experience", difficulty: "easy", count: 5 },
      { id: "bp-16", topic: "Feature Requests", difficulty: "easy", count: 3 },
      { id: "bp-17", topic: "NPS Score", difficulty: "easy", count: 1 },
    ],
    exposure: {
      totalCandidates: 245,
      completionRate: 82.4,
      avgScore: 0,
      reliability: 0,
      lastUsed: "2024-03-08",
      usageCount: 2,
    },
    versions: [
      { version: 1, createdAt: "2024-03-01", createdBy: "Product Team", changes: "Initial survey", isActive: true },
    ],
    status: "new",
  },
  {
    id: "form-6",
    metadata: {
      id: "form-6",
      title: "Physics Fundamentals Quiz",
      subject: "Physics",
      grade: "Grade 11",
      type: "quiz",
      tags: ["Mechanics", "Thermodynamics", "Quick Assessment"],
      description: "Quick quiz to assess fundamental physics concepts.",
      createdAt: "2024-02-20T15:00:00Z",
      updatedAt: "2024-02-20T15:00:00Z",
      createdBy: "Physics Dept",
      version: 1,
    },
    preferences: {
      duration: 20,
      navigationStyle: "forward-only",
      scoringType: "raw",
      passingScore: 50,
      proctoring: {
        enabled: false,
        webcam: false,
        screenShare: false,
        lockdownBrowser: false,
      },
      anonymity: false,
      shuffleQuestions: true,
      shuffleOptions: true,
      showResults: true,
      allowReview: true,
    },
    blueprint: [
      { id: "bp-18", topic: "Mechanics", difficulty: "easy", bloomLevel: "understand", count: 5 },
      { id: "bp-19", topic: "Thermodynamics", difficulty: "medium", bloomLevel: "apply", count: 5 },
    ],
    exposure: {
      totalCandidates: 0,
      completionRate: 0,
      avgScore: 0,
      reliability: 0,
      lastUsed: "",
      usageCount: 0,
    },
    versions: [
      { version: 1, createdAt: "2024-02-20", createdBy: "Physics Dept", changes: "Initial quiz", isActive: true },
    ],
    status: "new",
  },
];

export const subjects = ["Mathematics", "Science", "English", "Physics", "Chemistry", "Biology", "HR", "Product", "History", "Geography"];
export const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
export const allTags = ["Algebra", "Geometry", "Statistics", "Physics", "Chemistry", "Biology", "Reading", "Writing", "Grammar", "Vocabulary", "Engagement", "Culture", "UX", "Features", "Mechanics", "Thermodynamics"];
