import { Investor } from "@/types/investor";

export default function InvestorCard({ investor }: { investor: Investor }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <img
            src={investor.logo || "/placeholder.svg"}
            alt={`${investor.name} logo`}
            className="h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{investor.name}</h3>
          <p className="text-xs text-gray-500">{investor.location}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-600 line-clamp-2">{investor.description}</p>
      {investor.investmentFocus && (
        <div className="mt-2 flex flex-wrap gap-1">
          {investor.investmentFocus.map((focus) => (
            <span
              key={focus}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {focus}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}