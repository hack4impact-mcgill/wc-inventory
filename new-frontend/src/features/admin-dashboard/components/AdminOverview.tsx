import { useState, useMemo } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { startOfMonth, endOfMonth, startOfYear, startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { useAdminOverview } from "../hooks/useAdminOverview";
import MetricCard from "../components/MetricCard";
import TopItemsList from "../components/TopItemsList";
import TopUsersList from "../components/TopUsersList";
import { Card, CardContent } from "@/components/ui/card";


/**
 * Defines the timeframes that the user can request analytics from
 */
const PERIODS = [
  { id: "daily", label: "Daily", getRange: () => ({start: startOfDay(new Date()), end: endOfDay(new Date())})},
  { id: "weekly", label: "Weekly", getRange: () => ({start: startOfWeek(new Date()), end: endOfWeek(new Date())})},
  { id: "monthly", label: "Monthly", getRange: () => ({start: startOfMonth(new Date()), end: endOfMonth(new Date())})},
  { id: "yearly", label: "Yearly", getRange: () => ({start: startOfYear(new Date()), end: endOfMonth(new Date())})},
]

/**
 * TypeScript Interface: Defines the shape of our state object
 *
 * This interface acts as a contract that ensures our state object
 * will always have these specific properties, each with a boolean value.
 * Using an interface makes our code more predictable and helps catch errors.
 */
interface ExpandedSectionsState {
  boxManagement: boolean;
  inventoryTab: boolean;
  boxLookup: boolean;
  donation: boolean;
  staffManagement: boolean;
  categoryManagement: boolean;
  activityLog: boolean;
  adminOverview: boolean;
}

/**
 * AdminOverview Component
 *
 * This is a React Functional Component (React.FC) that displays testing notes
 * in collapsible sections. Using React.FC tells TypeScript this is a React component.
 */
const AdminOverview: React.FC = () => {
  /**
   * useState Hook with TypeScript Generic
   *
   * The useState hook is used to manage component state.
   * We're using TypeScript's generic syntax <ExpandedSectionsState> to tell
   * TypeScript that our state must match the interface we defined above.
   *
   * This gives us two things:
   * 1. expandedSections: The current state (matching our interface)
   * 2. setExpandedSections: A function to update the state
   */
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsState>({
    boxManagement: true,        // Initially expanded
    inventoryTab: true,         // Initially expanded
    boxLookup: true,            // Initially expanded
    donation: true,             // Initially expanded
    staffManagement: true,      // Initially expanded
    categoryManagement: true,   // Initially expanded
    activityLog: true,          // Initially expanded
    adminOverview: true         // Initially expanded
  });

  /**
   * Toggle Function with TypeScript Parameter and Return Types
   *
   * This function toggles a section between expanded and collapsed.
   *
   * TypeScript additions:
   * 1. section: keyof ExpandedSectionsState - The parameter must be one of the
   *    keys from our interface (ensures we only toggle valid sections)
   * 2. : void - The function doesn't return anything
   */
  const toggleSection = (section: keyof ExpandedSectionsState): void => {
    // Using the spread operator to create a new state object (immutability principle)
    // Then we toggle the boolean value of the specific section
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const [periodId, setPeriodId] = useState(PERIODS[0].id);
  const period = useMemo(() => {
    const p = PERIODS.find(x => x.id === periodId)!;
    const range = p.getRange();
    return { id: p.id, ...range };
  }, [periodId]);

  const { donatedBoxes, donatedItems, stockTotals, topItems, topUsers } = useAdminOverview(period);

  /**
   * Component Return (JSX/TSX)
   *
   * This returns the JSX (or TSX in TypeScript) that defines what the component renders.
   * TypeScript verifies that our JSX is valid and that we're using state correctly.
   */
  return (
    <div className="admin-overview">
      {/* Component Header */}
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-6">
        This is everything that needs to get done,
        based on exploratory testing done at the very end of Winter 2025.
      </p>

      <div className="mx-auto max-w-7xl p-6 bg-gray-50 min-h-screen">
        <Card className="p-6">
          {/* Main Grid: 2 Columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col space-y-6">
              <Select value={periodId} onValueChange={setPeriodId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERIODS.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* Left Column, First Row */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Donated</h2>
                <div className="flex gap-3">
                  <Card className="flex-1 p-6 text-center text-2xl">
                      <CardContent className="p-4">
                        <MetricCard value={donatedBoxes.data ?? "nothing!!"} loading={donatedBoxes.isLoading} />
                        <p className="text-base">boxes</p>
                      </CardContent>
                  </Card>
                  <Card className="flex-1 p-6 text-center text-2xl">
                      <CardContent className="p-4">
                        <MetricCard value={donatedItems.data ?? "nothing!!"} loading={donatedItems.isLoading} />
                        <p className="text-base">items</p>
                      </CardContent>
                  </Card>
                </div>
              </div>
              {/* Left Column, Second Row */}
              <div>
                <h2 className="text-xl font-semibold mb-2">In Stock</h2>
                <div className="flex gap-3">
                  <Card className="flex-1 p-6 text-center text-2xl">
                    <CardContent className="p-4">
                      <MetricCard value={stockTotals.data?.totalBoxes ?? "nothing!!"} loading={stockTotals.isLoading} />
                      <p className="text-base">boxes</p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1 p-6 text-center text-2xl">
                    <CardContent className="p-4">
                      <MetricCard value={stockTotals.data?.totalItems ?? "nothing!!"} loading={stockTotals.isLoading} />
                      <p className="text-base">items</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <Card className="flex-1">
                  <TopItemsList items={topItems.data ?? []} loading={topItems.isLoading} />
              </Card>
              <Card className="flex-1">
                  <TopUsersList users={topUsers.data ?? []} loading={topUsers.isLoading} />
              </Card>
            </div>
          </div>
        </Card>
      </div>
      </div>
  );
};

/**
 * Export the component so it can be imported elsewhere
 * This makes our component available to other files that import it
 */
export default AdminOverview;