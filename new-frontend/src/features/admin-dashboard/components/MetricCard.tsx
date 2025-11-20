import { Card, CardContent } from "@/components/ui/card";

export default function MetricCard({ title, value, loading }: { title: string; value: React.ReactNode; loading?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold mt-2">{loading ? "..." : value}</div>
      </CardContent>
    </Card>
  );
}