export interface Project {
  id: string;
  code: string;
  name: string;
  image?: string;
  itemCount: number;
  testCount: number;
  scheduleCount: number;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    code: "TestingPayload2",
    name: "TestingPayload2",
    itemCount: 0,
    testCount: 0,
    scheduleCount: 0,
  },
  {
    id: "2",
    code: "TestingPayload1",
    name: "TestingPayload1",
    itemCount: 0,
    testCount: 0,
    scheduleCount: 0,
  },
  {
    id: "3",
    code: "TestingPayload",
    name: "TestingPayload",
    itemCount: 0,
    testCount: 0,
    scheduleCount: 0,
  },
  {
    id: "4",
    code: "SM0001",
    name: "STOCK MARKET",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
    itemCount: 10,
    testCount: 1,
    scheduleCount: 2,
  },
  {
    id: "5",
    code: "FPBI",
    name: "Financial Planning, Banking & Insurance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
    itemCount: 25,
    testCount: 3,
    scheduleCount: 5,
  },
  {
    id: "6",
    code: "ISFM",
    name: "Investment Strategies for Markets",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    itemCount: 15,
    testCount: 2,
    scheduleCount: 3,
  },
];
