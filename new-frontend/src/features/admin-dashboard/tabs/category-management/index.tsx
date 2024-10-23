import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchCategories } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

const CategoryManagement = () => {
    const [globalFilter, setGlobalFilter] = React.useState('');

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            value={globalFilter}
                            onChange={e => setGlobalFilter(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                <div className="rounded-md border">

                </div>
            </CardContent>
        </Card>
    );
};

export default CategoryManagement;