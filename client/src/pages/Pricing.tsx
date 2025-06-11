import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import TopActionsBar from '@/components/common/TopActionsBar';
import PricingFilter from '@/components/pricing/PricingFilter';
import PricingRow from '@/components/pricing/PricingRow';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Pricing } from "@shared/schema";

export default function Pricing() {
    const [routes, setRoutes] = useState<Pricing[]>([]);
    const [filteredRoutes, setFilteredRoutes] = useState<Pricing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch pricing data
    const { data: fetchedRoutes = [], refetch } = useQuery<Pricing[]>({
        queryKey: ["/api/pricing"],
    });

    useEffect(() => {
        loadRoutes();
    }, [fetchedRoutes]);

    const loadRoutes = async () => {
        setIsLoading(true);
        try {
            setRoutes(fetchedRoutes);
            setFilteredRoutes(fetchedRoutes);
        } catch (error) {
            console.error("Error loading price routes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (searchTerm: string) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (!lowerSearchTerm) {
            setFilteredRoutes(routes);
            return;
        }
        const filtered = routes.filter(route => 
            route.origin?.toLowerCase().includes(lowerSearchTerm) ||
            route.destination?.toLowerCase().includes(lowerSearchTerm) ||
            route.route_name?.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredRoutes(filtered);
    };

    const handleEditPricing = (pricingItem: Pricing) => {
        console.log("Editing pricing:", pricingItem.id);
        // Handle edit logic
    };

    const handleViewPricing = (pricingItem: Pricing) => {
        console.log("Viewing pricing:", pricingItem.id);
        // Handle view logic
    };

    const handleDeletePricing = async (pricingItem: Pricing) => {
        if (window.confirm(`האם אתה בטוח שברצונך למחוק את המחיר עבור ${pricingItem.route_name}?`)) {
            try {
                const response = await fetch(`/api/pricing/${pricingItem.id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    refetch();
                }
            } catch (error) {
                console.error("Error deleting pricing:", error);
            }
        }
    };

    const handleAddNewPricing = () => {
        console.log("Adding new pricing");
        // Handle add logic
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
                .btn-primary-yellow {
                    background-color: #fceec4;
                    border: 1px solid #f0dca4;
                    color: #343a40;
                    font-weight: 500;
                    padding: 0.6rem 1.2rem;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-primary-yellow:hover {
                    background-color: #fff3cd;
                }
            `}</style>
            
            <TopActionsBar />
            
            <div className="pricing-page-header">
                <h2 className="text-2xl font-medium text-gray-800">תעריפי נסיעות</h2>
                <button className="btn-primary-yellow" onClick={handleAddNewPricing}>
                    <Plus size={18} />
                    הוספת תעריף
                </button>
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
                            {filteredRoutes.length === 0 ? (
                                <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
                                    <div className="text-4xl mb-4">💰</div>
                                    <p className="text-gray-500 text-lg">אין תעריפים במערכת</p>
                                    <p className="text-gray-400 text-sm mt-2">תעריפים חדשים יוצגו כאן</p>
                                </div>
                            ) : (
                                filteredRoutes.map(route => (
                                    <PricingRow 
                                        key={route.id} 
                                        route={route}
                                        onEdit={handleEditPricing}
                                        onView={handleViewPricing}
                                        onDelete={handleDeletePricing}
                                    />
                                ))
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}