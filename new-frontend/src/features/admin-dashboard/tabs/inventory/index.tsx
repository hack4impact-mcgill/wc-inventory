import React, { useState } from 'react'; 
import './Inventory.css'; 




const Inventory = () => {
    const [items, setItems] = useState([
        { id: 1, category: 'Adult Accessories', item: 'Hat', current: 5156, refills: 382, regular: 96, irregular: 478, total: 1514 },
        { id: 2, category: 'Adult Accessories', item: 'Scarf', current: 1152, refills: 22, regular: 367, irregular: 87, total: 454 },
        { id: 3, category: 'Male Coats', item: 'XXS', current: 7, refills: 10, regular: 3, irregular: 0, total: 3 }
    ]);


    const exportToCsv = () => { 
        const headers = "Items,Current Inventory,Refills,Regular Winter,Irregular,Total\n";
        const rows = items.map(item =>
        `${item.category} - ${item.item},${item.current},${item.refills},${item.regular},${item.irregular},${item.total}`
        ).join("\n");

        // Combine headers and rows into a single CSV string
        const csvContent = `data:text/csv;charset=utf-8,${headers + rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventory.csv");
        document.body.appendChild(link); // Required for browsers like Firefox
        link.click(); // This will trigger the download of the "inventory.csv" file.
        document.body.removeChild(link);

    }

    const handleDonate = async (boxId, userId) => { 
        // Assuming you'll add the correct API calls here.
        console.log("Donate functionality to be implemented.");
    }

    
    
    return (
        <div className="container">
             <h1 className="header">Inventory as of ___ /___ /___</h1>
            <div className="actions">
                <button className="button" onClick={exportToCsv}>Export to CSV</button>
                <button className="button donate" onClick={() => handleDonate(someBoxId, someUserId)}>Donate</button>
            </div>
            <table className="inventory-table"> 
                <thead> 
                     <tr> 
                        <th rowSpan={2}>Items</th>
                        <th rowSpan={2}>Current Inventory</th>
                        <th rowSpan={2}>Refills</th>
                        <th colSpan={3}>Distributions</th>
                </tr>
                <tr>
                    <th>Regular Winter </th>
                    <th>Irregular </th>
                    <th>Total </th>
                </tr>
            </thead>
            <tbody> 
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{`${item.category} - ${item.item}`}</td>
                            <td>{item.current}</td>
                            <td>{item.refills}</td>
                            <td>{item.regular}</td>
                            <td>{item.irregular}</td>
                            <td>{item.total}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;

