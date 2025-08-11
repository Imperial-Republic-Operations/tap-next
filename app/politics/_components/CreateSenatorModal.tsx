'use client';

import { useState, useEffect } from 'react';
import { useFormatting } from "@/hooks/useFormatting";
import { politicsApi, planetsApi } from '@/lib/apiClient';

interface Planet {
    id: bigint;
    name: string;
}

interface CreateSenatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId?: string;
}

export default function CreateSenatorModal({ isOpen, onClose, onSuccess, userId }: CreateSenatorModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        planetId: ''
    });
    
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { t } = useFormatting();

    useEffect(() => {
        if (isOpen) {
            loadPlanets();
        }
    }, [isOpen]);

    const loadPlanets = async () => {
        try {
            const planetsRes = await planetsApi.getPlanets();
            setPlanets(planetsRes.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load planets');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.planetId) {
            setError('Name and planet are required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await politicsApi.createSenator({
                name: formData.name.trim(),
                seatType: 'NONE',
                planetId: formData.planetId,
                userId: userId
            });

            onSuccess();
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create senator');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            planetId: ''
        });
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t.politics.createSenator}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            disabled={loading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t.politics.senatorName} *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Enter senator name"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t.politics.planet} *
                            </label>
                            <select
                                value={formData.planetId}
                                onChange={(e) => setFormData(prev => ({ ...prev, planetId: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                disabled={loading}
                                required
                            >
                                <option value="">Select a planet</option>
                                {planets.map((planet) => (
                                    <option key={planet.id.toString()} value={planet.id.toString()}>
                                        {planet.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
                                disabled={loading}
                            >
                                {t.common.cancel}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 rounded-md transition-colors"
                            >
                                {loading ? t.common.loading : t.politics.createSenator}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}