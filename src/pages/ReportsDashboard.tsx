import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Users, BarChart3, ClipboardList, TrendingUp, CheckCircle, XCircle, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, Legend, Cell } from "recharts";
import { mockProjects } from "@/data/projectMockData";

// Sample Data
const assessmentOverviewData = {
  assessment: "Math Aptitude Test",
  participants: 120,
  averageScore: 68,
  passRate: 72,
  avgTime: 45,
  scoreDistribution: [
    { range: "0-20", count: 5, fill: "hsl(var(--destructive))" },
    { range: "21-40", count: 12, fill: "hsl(var(--warning))" },
    { range: "41-60", count: 25, fill: "hsl(var(--muted-foreground))" },
    { range: "61-80", count: 48, fill: "hsl(var(--primary))" },
    { range: "81-100", count: 30, fill: "hsl(var(--success))" },
  ],
};

const coachingReportData = {
  // Participant & Assessment Info
  assessmentType: "Test",
  participantId: "SamuelEdbrooke13525",
  participantGroup: "Travis Perkins plc",
  participantDetails: "",
  participantAuthor: "d.mallinson@onwards.co.uk",
  assessmentName: "Trade Supplier V1.0 Paper 334.181",
  assessmentId: "04361370050430137",
  assessmentLastModified: "Sep 25 2024 11:18:30",
  assessmentDescription: "Thank you for taking this knowledge test.",
  
  // Right column
  timeTaken: "00:18:59",
  status: "Finished",
  totalScore: 26,
  maxScore: 36,
  percentageScore: 87,
  questionsPresented: 21,
  questionsAnswered: 20,
  assessmentOutcomeLabel: "Distinction",
  
  // Feedback
  assessmentOutcomeFeedback: "Your results will be available from your training provider / employer within 10 working days of completing the end point assessment process.",
  
  // Timestamps
  dateOfMakingReport: "Nov 17 2025 21:36:21",
  dateStarted: "Nov 14 2025 10:52:40",
  dateFinished: "Nov 14 2025 11:10:30",
  whetherMonitored: "No",
  nameOfMonitor: "",
  assessmentTimeLimit: 60,
  
  // Questions
  questions: [
    {
      id: 1,
      questionWording: "What is the correct procedure for handling customer complaints?",
      topic: "Trade Supplier 603377952.1 Customer Service Excellence",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Accept the offer., 1 Pretend you don't understand., 2 Call the police., 3 Tell your manager.",
      outcomeChosen: "3 Tell your manager.",
      answerGiven: "Tell your manager",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 2,
      questionWording: "How should you store hazardous materials in the warehouse?",
      topic: "Trade Supplier 603377952.1 Health and Safety Compliance",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Anywhere convenient., 1 In designated storage areas., 2 Near exits., 3 On the shop floor.",
      outcomeChosen: "1 In designated storage areas.",
      answerGiven: "In designated storage areas.",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 3,
      questionWording: "What is the maximum weight an individual should lift without assistance?",
      topic: "Trade Supplier 603377952.1 Manual Handling",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 50kg., 1 25kg., 2 10kg., 3 No limit.",
      outcomeChosen: "0 50kg.",
      answerGiven: "50kg.",
      actualScore: 0,
      maximumScore: 1,
      feedbackShown: "The recommended maximum weight is 25kg. Review manual handling guidelines.",
      correct: false,
    },
    {
      id: 4,
      questionWording: "Which document is required for all trade transactions?",
      topic: "Trade Supplier 603377952.1 Documentation",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Personal ID., 1 Invoice., 2 Business card., 3 None required.",
      outcomeChosen: "1 Invoice.",
      answerGiven: "Invoice.",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 5,
      questionWording: "What is the first step when dealing with a product return?",
      topic: "Trade Supplier 603377952.1 Returns Process",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Refuse the return., 1 Check the receipt., 2 Call the manager., 3 Accept without checking.",
      outcomeChosen: "1 Check the receipt.",
      answerGiven: "Check the receipt.",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 6,
      questionWording: "How should damaged goods be reported?",
      topic: "Trade Supplier 603377952.1 Stock Management",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Ignore them., 1 Report to supervisor immediately., 2 Sell at discount., 3 Dispose quietly.",
      outcomeChosen: "1 Report to supervisor immediately.",
      answerGiven: "Report to supervisor immediately.",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 7,
      questionWording: "Which is an appropriate question to ask a customer to best meet and exceed their needs?",
      topic: "Trade Supplier 603377952.1 Identify specialist customer needs",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 How long do you usually take to complete a job?, 1 What do you want?, 2 Youre ok grabbing what you want from the warehouse., 3 What is the job that you're doing?",
      outcomeChosen: "3 What is the job that you're doing?",
      answerGiven: "What is the job that you're doing?",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 8,
      questionWording: "What is a barrier to active listening?",
      topic: "Trade Supplier 603377952.2 Recognise how to be an effective listener",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Verbal nods., 1 Maintaining eye contact., 2 Asking probing questions., 3 Excessive talking.",
      outcomeChosen: "1 Maintaining eye contact.",
      answerGiven: "Maintaining eye contact.",
      actualScore: 0,
      maximumScore: 1,
      feedbackShown: "Maintaining eye contact is actually a sign of active listening, not a barrier. The correct answer is excessive talking.",
      correct: false,
    },
    {
      id: 9,
      questionWording: "What PPE is required when handling cement products?",
      topic: "Trade Supplier 603377952.1 Safety Equipment",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 No PPE required., 1 Gloves and mask., 2 Just gloves., 3 Safety glasses only.",
      outcomeChosen: "1 Gloves and mask.",
      answerGiven: "Gloves and mask.",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
    {
      id: 10,
      questionWording: "What is the correct procedure for end-of-day cash handling?",
      topic: "Trade Supplier 603377952.1 Cash Management",
      questionType: "Multiple Choice",
      possibleOutcomes: "0 Leave in till., 1 Count and secure in safe., 2 Take home., 3 Give to colleague.",
      outcomeChosen: "1 Count and secure in safe.",
      answerGiven: "Count and secure in safe.",
      actualScore: 1,
      maximumScore: 1,
      feedbackShown: "",
      correct: true,
    },
  ],
};

const itemAnalysisData = [
  { item: "Item 1", difficulty: 0.75, discrimination: 0.42, correct: 90, total: 120 },
  { item: "Item 2", difficulty: 0.40, discrimination: 0.55, correct: 48, total: 120 },
  { item: "Item 3", difficulty: 0.85, discrimination: 0.30, correct: 102, total: 120 },
  { item: "Item 4", difficulty: 0.60, discrimination: 0.48, correct: 72, total: 120 },
  { item: "Item 5", difficulty: 0.55, discrimination: 0.52, correct: 66, total: 120 },
  { item: "Item 6", difficulty: 0.70, discrimination: 0.38, correct: 84, total: 120 },
];

const participantData = [
  { name: "Anita Sharma", score: 72, status: "Pass", time: 42 },
  { name: "Rahul Mehta", score: 65, status: "Pass", time: 48 },
  { name: "Priya Nair", score: 80, status: "Pass", time: 38 },
  { name: "Arjun Singh", score: 55, status: "Fail", time: 52 },
  { name: "Kavya Rao", score: 90, status: "Pass", time: 35 },
];

const performanceTrend = [
  { assessment: "Test 1", avgScore: 62 },
  { assessment: "Test 2", avgScore: 68 },
  { assessment: "Test 3", avgScore: 71 },
  { assessment: "Test 4", avgScore: 68 },
  { assessment: "Test 5", avgScore: 75 },
];

const ReportsDashboard = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedQuestionId, setSelectedQuestionId] = useState(1);
  
  const product = mockProjects.find(p => p.id === productId);
  const productName = product?.name || "Product";
  
  const selectedQuestion = coachingReportData.questions.find(q => q.id === selectedQuestionId);
  const isPassed = coachingReportData.percentageScore >= 60;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground">{productName}</p>
            <h1 className="text-2xl font-semibold text-foreground">Assessment Reports</h1>
            <p className="text-sm text-muted-foreground">Analytics and insights for your assessments</p>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Coaching</span>
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Item Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Participants</span>
            </TabsTrigger>
          </TabsList>

          {/* Assessment Overview Report */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Participants</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{assessmentOverviewData.participants}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                  <Target className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{assessmentOverviewData.averageScore}%</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{assessmentOverviewData.passRate}%</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Time</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{assessmentOverviewData.avgTime} min</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>{assessmentOverviewData.assessment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assessmentOverviewData.scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="range" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {assessmentOverviewData.scoreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coaching Report */}
          <TabsContent value="coaching" className="space-y-6">
            {/* Header with Title */}
            <Card>
              <CardHeader className="text-center border-b border-border pb-4">
                <CardTitle className="text-2xl font-bold">Coaching Report</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Main Info Table */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment type</span>
                      <span className="text-foreground">{coachingReportData.assessmentType}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Participant ID</span>
                      <span className="text-foreground">{coachingReportData.participantId}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Participant group</span>
                      <span className="text-foreground">{coachingReportData.participantGroup}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Participant details</span>
                      <span className="text-foreground">{coachingReportData.participantDetails || "-"}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment author</span>
                      <span className="text-foreground">{coachingReportData.participantAuthor}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment name</span>
                      <span className="text-foreground">{coachingReportData.assessmentName}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment ID</span>
                      <span className="text-foreground">{coachingReportData.assessmentId}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment last modified</span>
                      <span className="text-foreground">{coachingReportData.assessmentLastModified}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment description</span>
                      <span className="text-foreground">{coachingReportData.assessmentDescription}</span>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Time taken</span>
                      <span className="text-foreground">{coachingReportData.timeTaken}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Status</span>
                      <span className="text-foreground">{coachingReportData.status}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Total score</span>
                      <span className="text-foreground font-semibold">{coachingReportData.totalScore}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Maximum score</span>
                      <span className="text-foreground">{coachingReportData.maxScore}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Percentage score</span>
                      <span className="text-foreground font-semibold">{coachingReportData.percentageScore}%</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Questions presented</span>
                      <span className="text-foreground">{coachingReportData.questionsPresented}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Questions answered</span>
                      <span className="text-foreground">{coachingReportData.questionsAnswered}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment outcome label</span>
                      <Badge variant={isPassed ? "default" : "destructive"} className="w-fit">
                        {coachingReportData.assessmentOutcomeLabel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Assessment Outcome Feedback */}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                    <span className="font-medium text-muted-foreground">Assessment outcome feedback</span>
                    <span className="text-foreground">{coachingReportData.assessmentOutcomeFeedback}</span>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="mt-6 pt-4 border-t border-border grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Date/time of making report</span>
                      <span className="text-foreground">{coachingReportData.dateOfMakingReport}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Date/time started</span>
                      <span className="text-foreground">{coachingReportData.dateStarted}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Date/time finished</span>
                      <span className="text-foreground">{coachingReportData.dateFinished}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Whether monitored</span>
                      <span className="text-foreground">{coachingReportData.whetherMonitored}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Name of the monitor</span>
                      <span className="text-foreground">{coachingReportData.nameOfMonitor || "-"}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Assessment time limit</span>
                      <span className="text-foreground">{coachingReportData.assessmentTimeLimit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle>Questions</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Question Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {coachingReportData.questions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`
                        relative px-4 py-2 min-w-[50px] text-center rounded-sm text-sm font-medium transition-colors
                        ${selectedQuestionId === q.id 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-muted/80 text-foreground"
                        }
                      `}
                    >
                      {q.id}
                      <span className="absolute -top-1 -right-1">
                        {q.correct ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Question Details */}
                {selectedQuestion && (
                  <div className="border border-border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Question wording</span>
                      <span className="text-foreground">{selectedQuestion.questionWording}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Topic</span>
                      <span className="text-foreground">{selectedQuestion.topic}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Question type</span>
                      <span className="text-foreground">{selectedQuestion.questionType}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Possible outcomes</span>
                      <span className="text-foreground">{selectedQuestion.possibleOutcomes}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Outcome(s) chosen</span>
                      <span className="text-foreground">{selectedQuestion.outcomeChosen}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Answer given</span>
                      <span className="text-foreground">{selectedQuestion.answerGiven}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Actual score</span>
                      <span className="text-foreground">{selectedQuestion.actualScore}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Maximum score</span>
                      <span className="text-foreground">{selectedQuestion.maximumScore}</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-2 text-sm">
                      <span className="font-medium text-muted-foreground">Feedback shown</span>
                      <span className="text-foreground">{selectedQuestion.feedbackShown || "-"}</span>
                    </div>
                  </div>
                )}

                {/* Page indicator */}
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  {selectedQuestionId}/{coachingReportData.questions.length}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Item Analysis Report */}
          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Statistics</CardTitle>
                <CardDescription>Difficulty and discrimination analysis for each item</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Difficulty Index</TableHead>
                      <TableHead className="text-center">Discrimination</TableHead>
                      <TableHead className="text-center">Correct Responses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemAnalysisData.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.difficulty > 0.7 ? "secondary" : item.difficulty < 0.5 ? "destructive" : "default"}>
                            {item.difficulty.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={item.discrimination > 0.4 ? "default" : "secondary"}>
                            {item.discrimination.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.correct}/{item.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={itemAnalysisData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="item" className="text-muted-foreground" />
                        <YAxis domain={[0, 1]} className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }} 
                        />
                        <Bar dataKey="difficulty" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Discrimination vs Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" dataKey="difficulty" name="Difficulty" domain={[0, 1]} className="text-muted-foreground" />
                        <YAxis type="number" dataKey="discrimination" name="Discrimination" domain={[0, 1]} className="text-muted-foreground" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }} 
                        />
                        <Scatter data={itemAnalysisData} fill="hsl(var(--accent))" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Participant Report */}
          <TabsContent value="participants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Participant Performance</CardTitle>
                <CardDescription>Individual scores and assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Time Taken</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participantData.map((participant) => (
                      <TableRow key={participant.name}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-semibold">{participant.score}%</span>
                            <Progress value={participant.score} className="w-20 h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={participant.status === "Pass" ? "default" : "destructive"}>
                            {participant.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {participant.time} mins
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Average score across multiple assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="assessment" className="text-muted-foreground" />
                      <YAxis domain={[0, 100]} className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="avgScore" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        name="Average Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ReportsDashboard;
