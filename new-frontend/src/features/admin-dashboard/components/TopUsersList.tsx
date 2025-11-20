import { Card, CardContent } from "@/components/ui/card";

export default function TopUsersList({ users, loading }: { users: any[]; loading?: boolean }) {
  return (
    <Card>
      <CardContent>
        <h3 className="font-semibold mb-2">Most Active Users</h3>
        {loading ? <div>Loading...</div> : (
          <ul className="space-y-2">
            {users.map((u: any, i: number) => (
              <li key={i} className="flex justify-between">
                <span>{u.created_by /* could map to user name */}</span>
                <span className="font-medium">{u.donated_count ?? 0}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}