import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, CheckCircle, User, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { CandidateEvaluation, Question } from "@/types/assessment";
import { IdentityVerificationModal } from "@/components/IdentityVerificationModal";

const mockEvaluation: CandidateEvaluation = {
  candidateId: "c1",
  candidateName: "John Smith",
  candidateEmail: "john.smith@example.com",
  profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  testImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  scheduleId: "s1",
  scheduleName: "Q1 2024 Assessment - Batch A",
  assessmentName: "Advanced Programming Test",
  submittedAt: "2024-03-15T10:30:00",
  testDuration: "2 hours 15 minutes",
  rubric: `**Scoring Rubric:**
- **Excellent (90-100%)**: Complete solution with optimal approach, clean code, edge cases handled
- **Good (75-89%)**: Working solution with minor issues, most edge cases covered
- **Satisfactory (60-74%)**: Basic solution works but has significant gaps
- **Needs Improvement (<60%)**: Incomplete or incorrect solution`,
  questions: [
    {
      id: "q1",
      questionText: "Implement a function to reverse a linked list. Explain your approach and analyze the time complexity.",
      questionType: "essay",
      maxScore: 25,
      candidateAnswer: "To reverse a linked list, I would use an iterative approach with three pointers: prev, current, and next. The algorithm works by traversing the list and reversing the links between nodes.\n\nCode:\n```python\ndef reverse_linked_list(head):\n    prev = None\n    current = head\n    while current:\n        next = current.next\n        current.next = prev\n        prev = current\n        current = next\n    return prev\n```\n\nTime Complexity: O(n) where n is the number of nodes\nSpace Complexity: O(1) as we only use constant extra space",
    },
    {
      id: "q2",
      questionText: "Describe the differences between SQL and NoSQL databases. When would you choose one over the other?",
      questionType: "essay",
      maxScore: 20,
      candidateAnswer: "SQL databases use structured schemas with tables and relationships, while NoSQL databases are more flexible and can handle unstructured data. SQL is better for complex queries and transactions, while NoSQL is better for scalability and handling large volumes of varied data types.",
    },
    {
      id: "q3",
      questionText: "What is the purpose of the virtual DOM in React?",
      questionType: "short_answer",
      maxScore: 15,
      candidateAnswer: "The virtual DOM is a lightweight copy of the actual DOM. React uses it to track changes and update only the parts of the real DOM that changed, making updates more efficient.",
    },
    {
      id: "q4",
      questionText: "Write a function to find the kth largest element in an unsorted array.",
      questionType: "coding",
      maxScore: 30,
      candidateAnswer: "```python\nimport heapq\n\ndef find_kth_largest(nums, k):\n    return heapq.nlargest(k, nums)[-1]\n\n# Alternative approach using quickselect\ndef find_kth_largest_quickselect(nums, k):\n    k = len(nums) - k\n    \n    def quickselect(l, r):\n        pivot = nums[r]\n        p = l\n        for i in range(l, r):\n            if nums[i] <= pivot:\n                nums[p], nums[i] = nums[i], nums[p]\n                p += 1\n        nums[p], nums[r] = nums[r], nums[p]\n        \n        if p < k:\n            return quickselect(p + 1, r)\n        elif p > k:\n            return quickselect(l, p - 1)\n        else:\n            return nums[p]\n    \n    return quickselect(0, len(nums) - 1)\n```",
    },
    {
      id: "q5",
      questionText: "Explain the CAP theorem in distributed systems.",
      questionType: "essay",
      maxScore: 10,
      candidateAnswer: "The CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance.",
    },
  ],
};

const MarkerEvaluation = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const [evaluation, setEvaluation] = useState(mockEvaluation);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [showImageModal, setShowImageModal] = useState(false);

  const handleScoreChange = (questionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [questionId]: comment }));
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const totalMaxScore = evaluation.questions.reduce((sum, q) => sum + q.maxScore, 0);

  const handleSave = () => {
    toast.success("Evaluation saved successfully");
  };

  const handleSubmit = () => {
    const totalScore = calculateTotalScore();
    toast.success(`Evaluation submitted. Total Score: ${totalScore}/${totalMaxScore}`);
    navigate("/marker");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/marker")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Evaluate Candidate</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Evaluation
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={evaluation.profileImageUrl}
                      alt={evaluation.candidateName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-xl">{evaluation.candidateName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{evaluation.candidateEmail}</p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(evaluation.submittedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {evaluation.testDuration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageModal(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Verify Identity
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Schedule:</span>
                    <p className="font-medium">{evaluation.scheduleName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assessment:</span>
                    <p className="font-medium">{evaluation.assessmentName}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h4 className="font-semibold mb-2">Current Score Progress</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold">
                      {calculateTotalScore()} / {totalMaxScore}
                    </div>
                    <Badge variant={calculateTotalScore() >= totalMaxScore * 0.75 ? "default" : "secondary"}>
                      {Math.round((calculateTotalScore() / totalMaxScore) * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
                <TabsTrigger value="rubric">Scoring Rubric</TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions" className="space-y-4 mt-4">
                {evaluation.questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Question {index + 1}</Badge>
                            <Badge>{question.questionType.replace("_", " ")}</Badge>
                          </div>
                          <CardTitle className="text-base">{question.questionText}</CardTitle>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Max: {question.maxScore} pts
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Candidate's Answer</Label>
                        <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
                          {question.candidateAnswer}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor={`score-${question.id}`}>
                            Score (0-{question.maxScore})
                          </Label>
                          <Input
                            id={`score-${question.id}`}
                            type="number"
                            min="0"
                            max={question.maxScore}
                            value={scores[question.id] || ""}
                            onChange={(e) => handleScoreChange(question.id, Number(e.target.value))}
                            placeholder="Enter score"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`comment-${question.id}`}>
                            Feedback/Comments
                          </Label>
                          <Textarea
                            id={`comment-${question.id}`}
                            value={comments[question.id] || ""}
                            onChange={(e) => handleCommentChange(question.id, e.target.value)}
                            placeholder="Provide feedback for the candidate..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="rubric">
                <Card>
                  <CardHeader>
                    <CardTitle>Scoring Rubric</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap">{evaluation.rubric}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Evaluation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Questions Scored</h4>
                  <div className="text-2xl font-bold">
                    {Object.keys(scores).length} / {evaluation.questions.length}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Total Score</h4>
                  <div className="text-3xl font-bold text-primary">
                    {calculateTotalScore()} / {totalMaxScore}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round((calculateTotalScore() / totalMaxScore) * 100)}%
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Score Breakdown</h4>
                  {evaluation.questions.map((question, index) => (
                    <div key={question.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Q{index + 1}</span>
                      <span className="font-medium">
                        {scores[question.id] || 0} / {question.maxScore}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showImageModal && (
        <IdentityVerificationModal
          profileImageUrl={evaluation.profileImageUrl}
          testImageUrl={evaluation.testImageUrl}
          candidateName={evaluation.candidateName}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};

export default MarkerEvaluation;
