export type Investor = {
  id: string
  name: string
  location: string
  logo: string
  description: string
  investmentFocus?: string[]
}

// Mock data for startups
export const mockInvestors: Investor[] = [
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