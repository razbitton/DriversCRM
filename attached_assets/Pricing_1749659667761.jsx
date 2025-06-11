import React, { useState, useEffect } from 'react';
import { PriceRoute } from '@/entities/PriceRoute';
import TopActionsBar from '../Components/common/TopActionsBar';
import PricingFilter from '../Components/pricing/PricingFilter';
import PricingRow from '../Components/pricing/PricingRow';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pricing() {
    const [routes, setRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        setIsLoading(true);
        try {
            const data = await PriceRoute.list();
            setRoutes(data);
            setFilteredRoutes(data);
        } catch (error) {
            console.error("Error loading price routes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (searchTerm) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (!lowerSearchTerm) {
            setFilteredRoutes(routes);
            return;
        }
        const filtered = routes.filter(route => 
            route.origin.toLowerCase().includes(lowerSearchTerm) ||
            route.destination.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredRoutes(filtered);
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <style>{`
                .pricing-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .pricing-layout {
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-start;
                }
                .pricing-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .pricing-list-header {
                    display: grid;
                    grid-template-columns: 2.5fr 1fr 1fr 1fr 1fr;
                    color: #6b7280;
                    font-weight: 500;
                    font-size: 0.875rem;
                    padding: 0 1.5rem;
                    gap: 1rem;
                }
                .pricing-list-header span {
                    text-align: center;
                }
                .pricing-list-header span:first-child {
                    text-align: right;
                }
                .pricing-list-header span:last-child {
                    text-align: right;
                }
                .loading-placeholder {
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                    font-size: 1.1rem;
                }
            `}</style>
            
            <TopActionsBar />
            
            <div className="pricing-page-header">
                <h2 className="text-2xl font-medium text-gray-800">תעריפי נסיעות</h2>
                <Button className="flex items-center gap-2">
                    <Plus size={18} />
                    הוספת תעריף
                </Button>
            </div>
            
            <div className="pricing-layout">
                <PricingFilter routes={routes} onFilterChange={handleFilterChange} />
                
                <main className="pricing-content">
                    {isLoading ? (
                        <div className="loading-placeholder">טוען תעריפים...</div>
                    ) : (
                        <>
                            <div className="pricing-list-header">
                                <span>מסלול</span>
                                <span>הלוך</span>
                                <span>חזור</span>
                                <span>הלוך ושוב</span>
                                <span>פעולות</span>
                            </div>
                            {filteredRoutes.map(route => (
                                <PricingRow key={route.id} route={route} />
                            ))}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
} 