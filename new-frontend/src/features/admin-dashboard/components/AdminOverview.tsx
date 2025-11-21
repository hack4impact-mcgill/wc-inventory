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

      {/*
        Box Management Section

        Each section follows the same pattern:
        1. A header div that can be clicked to toggle visibility
        2. Conditional rendering with &&: content only shows when expanded
        3. Dynamic arrow icon changes based on state
      */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        {/* Header - onClick calls toggleSection with the specific section key */}
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('boxManagement')}
        >
          <h2 className="text-lg font-semibold">Box Management Issues</h2>
          {/* Dynamic arrow: ▼ when expanded, ► when collapsed */}
          <span>{expandedSections.boxManagement ? '▼' : '►'}</span>
        </div>

        {/*
          Conditional Content - Uses logical AND (&&) for conditional rendering
          Content only renders when expandedSections.boxManagement is true
        */}
        {expandedSections.boxManagement && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold">No way to add a box tag</span></li>
              <li><span className="font-semibold">No way to edit box contents</span> after a box is created</li>
              <li><span className="font-semibold">No way to donate individual items</span> from a box (currently forced to donate whole boxes)</li>
              <li><span className="font-semibold">No destination tracking</span> when donating boxes</li>
            </ul>
          </div>
        )}
      </div>

      {/* Inventory Tab Section - Following the same pattern as above */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('inventoryTab')}
        >
          <h2 className="text-lg font-semibold">Inventory Tab Issues</h2>
          <span>{expandedSections.inventoryTab ? '▼' : '►'}</span>
        </div>

        {expandedSections.inventoryTab && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Purpose is unclear</span> - what is the purpose of changing the date?
                {/* Nested list - notice how we use different list styles for visual hierarchy */}
                <ul className="list-circle pl-6 mt-1">
                  <li>Changing date only affects "refills" and "distributions" columns</li>
                  <li>Nothing else updates</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Date restrictions needed</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Should not allow future dates</li>
                  <li>Should not allow dates before system adoption</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Box Lookup Section */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('boxLookup')}
        >
          <h2 className="text-lg font-semibold">Box Lookup/Inventory Management Issues</h2>
          <span>{expandedSections.boxLookup ? '▼' : '►'}</span>
        </div>

        {expandedSections.boxLookup && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold">Inconsistent naming</span> across the interface</li>
              <li>
                <span className="font-semibold">Non-functional buttons</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>"Log" button does nothing</li>
                  <li>"Print label" does nothing</li>
                  <li>"Find Items" button needs rework (both color scheme and functionality)</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Location change issues</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Should not allow moving a box to its current location</li>
                  <li>Current UI will confuse staff</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Donation Section */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('donation')}
        >
          <h2 className="text-lg font-semibold">Donation Functionality</h2>
          <span>{expandedSections.donation ? '▼' : '►'}</span>
        </div>

        {expandedSections.donation && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Donation tab needs implementation</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>View past donations with dates</li>
                  <li>Show donation details and contents</li>
                  <li>Items should be donated, not boxes</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Staff Management Section */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('staffManagement')}
        >
          <h2 className="text-lg font-semibold">Staff Management Issues</h2>
          <span>{expandedSections.staffManagement ? '▼' : '►'}</span>
        </div>

        {expandedSections.staffManagement && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Incomplete management features</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Cannot edit staff profiles</li>
                  <li>Cannot delete staff accounts</li>
                  <li>Cannot see account modification dates</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">"Create User" feature bugs</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Can create users with no name</li>
                  <li>No validation for email requirement</li>
                  <li>Poor onboarding experience</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Non-functional columns</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>"Last action" column not working</li>
                  <li>"When" column not integrated with activity log</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Search functionality issues</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Too specific (spaces break search)</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Password management</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Should allow admin viewing of passwords if possible</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Category Management Section */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('categoryManagement')}
        >
          <h2 className="text-lg font-semibold">Category Management Issues</h2>
          <span>{expandedSections.categoryManagement ? '▼' : '►'}</span>
        </div>

        {expandedSections.categoryManagement && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">Visual problems with nesting</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Hard to understand visually</li>
                  <li>Inconsistent nesting numbers</li>
                  <li>Should use location management visual style</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">"Add category" bug</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>System crashes when "add icon" is clicked</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Activity Log Section */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('activityLog')}
        >
          <h2 className="text-lg font-semibold">Activity Log Issues</h2>
          <span>{expandedSections.activityLog ? '▼' : '►'}</span>
        </div>

        {expandedSections.activityLog && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">User page problems</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Incorrectly treats all users as volunteers, even admins</li>
                  <li>Activity status changes don't apply</li>
                  <li>"Permissions" not functional</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Box interaction issues</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Clicking a box leads to inventory management, not box contents</li>
                  <li>Users must manually search for the box</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Refresh issues</span>:
                <ul className="list-circle pl-6 mt-1">
                  <li>Doesn't refresh automatically</li>
                  <li>Can cause confusion</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Admin Overview Section */}
      <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center bg-gray-100 p-4 cursor-pointer"
          onClick={() => toggleSection('adminOverview')}
        >
          <h2 className="text-lg font-semibold">Admin Overview</h2>
          <span>{expandedSections.adminOverview ? '▼' : '►'}</span>
        </div>

        {expandedSections.adminOverview && (
          <div className="p-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-semibold">Not implemented</span></li>
              <li>Should this be a tutorial/educational page? or a visually pleasing representation of the admin dashboard (like buttons to the tabs)?</li>
            </ul>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

/**
 * Export the component so it can be imported elsewhere
 * This makes our component available to other files that import it
 */
export default AdminOverview;