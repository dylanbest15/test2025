export type Startup = {
  id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  logo_url: string;
  overview: string;
  year_founded: number;
  updated_at: string | null;
  created_at: string;
}

export const statesAndProvinces = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
]

// TODO: remove this
// Mock data for startups
export type mockStartup = {
  id: number;
  name: string;
  location: string;
  fundPool: number;
  fundGoal: number;
}

export const mockStartups: mockStartup[] = [
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

export type mockInvestor = {
  id: string
  name: string
  location: string
  logo: string
  description: string
  investmentFocus?: string[]
}

// Mock data for investors
export const mockInvestors: mockInvestor[] = [
  {
    id: "inv1",
    name: "Sequoia Capital",
    location: "Menlo Park, CA",
    logo: "/abstract-geometric-shapes.png",
    description: "Sequoia Capital is an American venture capital firm.",
    investmentFocus: ["SaaS", "AI", "Fintech"],
  },
  {
    id: "inv2",
    name: "Andreessen Horowitz",
    location: "Menlo Park, CA",
    logo: "/abstract-geometric-AH.png",
    description: "Andreessen Horowitz (a16z) is a venture capital firm that backs bold entrepreneurs.",
    investmentFocus: ["Crypto", "Fintech", "Healthcare"],
  },
  {
    id: "inv3",
    name: "Y Combinator",
    location: "Mountain View, CA",
    logo: "/yc-logo-abstract.png",
    description: "Y Combinator is an American seed accelerator.",
    investmentFocus: ["Early Stage", "B2B", "Consumer"],
  },
]