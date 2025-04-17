export type Startup = {
  id: number;
  name: string;
  location: string;
  fundPool: number;
  fundGoal: number;
}

// Mock data for startups
export const mockStartups: Startup[] = [
  { id: 1, name: "TechNova", location: "San Francisco, CA", fundPool: 2500000, fundGoal: 4000000 },
  { id: 2, name: "GreenEnergy Solutions", location: "Austin, TX", fundPool: 1750000, fundGoal: 3000000 },
  { id: 3, name: "HealthAI", location: "Boston, MA", fundPool: 3200000, fundGoal: 5000000 },
  { id: 4, name: "FinTech Innovations", location: "New York, NY", fundPool: 5000000, fundGoal: 7500000 },
  { id: 5, name: "EcoFriendly Products", location: "Portland, OR", fundPool: 850000, fundGoal: 1500000 },
  { id: 6, name: "Smart Home Systems", location: "Seattle, WA", fundPool: 1200000, fundGoal: 2000000 },
  { id: 7, name: "Blockchain Ventures", location: "Miami, FL", fundPool: 4500000, fundGoal: 6000000 },
  { id: 8, name: "AI Research Lab", location: "Cambridge, MA", fundPool: 6700000, fundGoal: 10000000 },
  { id: 9, name: "Cloud Computing Solutions", location: "Denver, CO", fundPool: 2800000, fundGoal: 4500000 },
  { id: 10, name: "Sustainable Fashion", location: "Los Angeles, CA", fundPool: 1100000, fundGoal: 2200000 },
  { id: 11, name: "Quantum Computing", location: "Chicago, IL", fundPool: 8500000, fundGoal: 15000000 },
  { id: 12, name: "Robotics Automation", location: "Detroit, MI", fundPool: 3700000, fundGoal: 6000000 },
  { id: 13, name: "Space Technologies", location: "Houston, TX", fundPool: 12000000, fundGoal: 20000000 },
  { id: 14, name: "Biotech Research", location: "San Diego, CA", fundPool: 7300000, fundGoal: 12000000 },
  { id: 15, name: "Renewable Energy", location: "Denver, CO", fundPool: 4200000, fundGoal: 7000000 },
  { id: 16, name: "Cybersecurity Solutions", location: "Washington, DC", fundPool: 3100000, fundGoal: 5000000 },
  { id: 17, name: "Virtual Reality", location: "Los Angeles, CA", fundPool: 2900000, fundGoal: 5500000 },
  { id: 18, name: "Autonomous Vehicles", location: "Pittsburgh, PA", fundPool: 9800000, fundGoal: 15000000 },
  { id: 19, name: "Drone Delivery", location: "Seattle, WA", fundPool: 1800000, fundGoal: 3000000 },
  { id: 20, name: "EdTech Platforms", location: "Austin, TX", fundPool: 2200000, fundGoal: 3500000 },
  { id: 21, name: "AgTech Solutions", location: "Des Moines, IA", fundPool: 1500000, fundGoal: 2500000 },
  { id: 22, name: "Medical Devices", location: "Minneapolis, MN", fundPool: 4800000, fundGoal: 8000000 },
  { id: 23, name: "Clean Water Tech", location: "Portland, OR", fundPool: 2600000, fundGoal: 4000000 },
  { id: 24, name: "3D Printing Innovations", location: "Phoenix, AZ", fundPool: 1900000, fundGoal: 3200000 },
  { id: 25, name: "Smart City Solutions", location: "Columbus, OH", fundPool: 5500000, fundGoal: 9000000 },
  { id: 26, name: "Wearable Tech", location: "San Francisco, CA", fundPool: 3300000, fundGoal: 5500000 },
  { id: 27, name: "Digital Health", location: "Boston, MA", fundPool: 4100000, fundGoal: 6500000 },
  { id: 28, name: "Sustainable Agriculture", location: "Madison, WI", fundPool: 2300000, fundGoal: 4000000 },
  { id: 29, name: "Microchip Design", location: "Austin, TX", fundPool: 7800000, fundGoal: 12000000 },
  { id: 30, name: "Solar Energy", location: "Albuquerque, NM", fundPool: 3900000, fundGoal: 6500000 },
]