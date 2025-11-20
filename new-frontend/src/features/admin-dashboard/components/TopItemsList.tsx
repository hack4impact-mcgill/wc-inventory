import { Card, CardContent } from "@/components/ui/card";

export default function TopItemsList({ items, loading }: { items: any[]; loading?: boolean }) {
  return (
    <Card>
      <CardContent>
        <h3 className="font-semibold mb-2">Top Donated Items</h3>
        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {items.map((it: any, i: number) => (
              <li key={i} className="flex justify-between">
                <span>{it.category_id /* or look up category name */}</span>
                <span className="font-medium">{it.total ?? it.donated_count ?? 0}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}