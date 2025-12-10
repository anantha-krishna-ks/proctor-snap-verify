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
  candidate: "Anita Sharma",
  assessment: "Math Aptitude Test",
  totalScore: 72,
  maxScore: 100,
  passed: true,
  sections: [
    { name: "Algebra", score: 18, maxScore: 20, percentage: 90 },
    { name: "Geometry", score: 12, maxScore: 20, percentage: 60 },
    { name: "Statistics", score: 22, maxScore: 30, percentage: 73 },
    { name: "Arithmetic", score: 20, maxScore: 30, percentage: 67 },
  ],
  feedback: "Strong in Algebra, needs improvement in Statistics and Arithmetic.",
  questionFeedback: [
    { question: "Q1: Solve 2x + 5 = 15", correct: true, comment: "Excellent work!" },
    { question: "Q2: Find area of triangle", correct: false, comment: "Review area formulas" },
    { question: "Q3: Calculate mean of dataset", correct: true, comment: "Good understanding" },
    { question: "Q4: Simplify 3x² + 2x - x²", correct: true, comment: "Correct simplification" },
    { question: "Q5: Percentage increase from 50 to 75", correct: false, comment: "Practice percentage calculations" },
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
  
  const product = mockProjects.find(p => p.id === productId);
  const productName = product?.name || "Product";

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
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{coachingReportData.candidate}</CardTitle>
                  <CardDescription>{coachingReportData.assessment}</CardDescription>
                </div>
                <Badge variant={coachingReportData.passed ? "default" : "destructive"} className="text-sm px-3 py-1">
                  {coachingReportData.passed ? "PASS" : "FAIL"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-primary">
                    {coachingReportData.totalScore}/{coachingReportData.maxScore}
                  </div>
                  <div className="flex-1">
                    <Progress value={(coachingReportData.totalScore / coachingReportData.maxScore) * 100} className="h-3" />
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg mb-6">
                  <p className="text-muted-foreground italic">"{coachingReportData.feedback}"</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Section Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coachingReportData.sections.map((section) => (
                    <div key={section.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{section.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {section.score}/{section.maxScore} ({section.percentage}%)
                        </span>
                      </div>
                      <Progress 
                        value={section.percentage} 
                        className={`h-2 ${section.percentage >= 80 ? "[&>div]:bg-success" : section.percentage >= 60 ? "[&>div]:bg-primary" : "[&>div]:bg-warning"}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question-wise Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead className="text-center">Result</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coachingReportData.questionFeedback.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.question}</TableCell>
                        <TableCell className="text-center">
                          {item.correct ? (
                            <CheckCircle className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
