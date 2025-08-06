'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { CharacterDetails } from "@/lib/types";
import {
    Activity,
    Award,
    BarChart3,
    FileText,
    Package,
    Settings,
    Shield,
    Star,
    TrendingUp,
    User,
    Users,
    Zap
} from "lucide-react";
import { roles, userHasAccess } from "@/lib/roles";

interface DashboardStats {
    totalCharacters: number;
    totalOrganizations: number;
    totalDocuments: number;
    totalAwards: number;
    pendingCharacters: number;
    pendingDocuments: number;
    flaggedDocuments: number;
    characterCredits: number;
    characterYearsOfService: number;
    characterCompletedMissions: number;
}

interface HomeClientProps {
    session: Session | null | undefined;
    status: 'authenticated' | 'unauthenticated';
    activeCharacter: CharacterDetails | undefined;
    dashboardStats: DashboardStats;
    statsLoading: boolean;
}

export default function HomeClient({session, status, activeCharacter, dashboardStats, statsLoading}: HomeClientProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(!!session?.user);
    
    useEffect(() => {
        console.log('Status', status);
        console.log('Session', session);
        // Check if we just logged out (no session but we're not in loading state)
        if (!session?.user || status === 'unauthenticated') {
            setIsAuthenticated(false);
            // Force router refresh to ensure clean state
            router.refresh();
        } else {
            setIsAuthenticated(!!session?.user);
        }
    }, [session, status, router]);
    
    const primaryMembership = activeCharacter?.memberships.find(
        (member) => member.primaryMembership
    );

    const LandingPage = () => (
        // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <div className="min-h-screen">
            <div className="relative">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <div className="text-center">
                        <div className="flex justify-center items-center mb-8">
                            {/*<div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl">*/}
                            <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-2xl">
                                <Star className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Terminal Access
                            <span className="block bg-gradient-to-r from-blue-400 via-primary-400 to-pink-400 bg-clip-text text-transparent">
                                Project
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Immerse yourself in a galaxy-spanning simulation. Create characters, join organizations,
                            complete missions, and forge your destiny among the stars.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="/api/auth/signin" className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                <span className="relative z-10">Access via Nexus</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            </a>

                            <button className="px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Core Systems</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Comprehensive tools for character development, organizational management, and galactic simulation
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        {
                            icon: User,
                            title: 'Characters',
                            desc: 'Create detailed personas with species, backgrounds, Force abilities, and career progression',
                            highlight: 'Rich Profiles'
                        },
                        {
                            icon: Users,
                            title: 'Organizations',
                            desc: 'Join factions, military branches, and specialized units with ranks and positions',
                            highlight: 'Hierarchical Structure'
                        },
                        {
                            icon: FileText,
                            title: 'Documents',
                            desc: 'Generate official reports, personal logs, and classified communications',
                            highlight: 'Security Clearances'
                        },
                        {
                            icon: Award,
                            title: 'Awards System',
                            desc: 'Earn recognition through nominations, approvals, and ceremony protocols',
                            highlight: 'Merit Tracking'
                        },
                        {
                            icon: Package,
                            title: 'Inventory',
                            desc: 'Manage personal assets, ships, vehicles, and organizational resources',
                            highlight: 'Asset Management'
                        },
                        {
                            icon: Zap,
                            title: 'Force Training',
                            desc: 'Develop Force abilities through masters, orders, and structured progression',
                            highlight: 'Power Development'
                        },
                        {
                            icon: BarChart3,
                            title: 'Analytics',
                            desc: 'Track character development, organizational metrics, and system-wide statistics',
                            highlight: 'Performance Insights'
                        },
                        {
                            icon: Shield,
                            title: 'Administration',
                            desc: 'Role-based permissions, approval workflows, and comprehensive moderation tools',
                            highlight: 'Secure Operations'
                        }
                    ].map((feature, index) => (
                        <div key={index} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <feature.icon className="w-12 h-12 text-blue-400 group-hover:text-primary-400 transition-colors duration-300" />
                                    <span className="text-xs font-medium text-primary-400 bg-primary-400/20 px-2 py-1 rounded-full">
                                        {feature.highlight}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: statsLoading ? '...' : dashboardStats.totalCharacters.toLocaleString(), label: 'Active Characters', icon: User },
                            { number: statsLoading ? '...' : dashboardStats.totalOrganizations.toString(), label: 'Organizations', icon: Users },
                            { number: statsLoading ? '...' : dashboardStats.totalDocuments.toLocaleString(), label: 'Documents Filed', icon: FileText },
                            { number: statsLoading ? '...' : dashboardStats.totalAwards.toLocaleString(), label: 'Awards Granted', icon: Award }
                        ].map((stat, index) => (
                            <div key={index} className="group">
                                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:text-purple-400 transition-colors duration-300" />
                                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const Dashboard = () => (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Merit Score', value: 'N/a', icon: Star, color: 'text-yellow-600' },
                            { label: 'Active Missions', value: '0', icon: Activity, color: 'text-blue-600' },
                            { label: 'Credits', value: statsLoading ? '...' : dashboardStats.characterCredits.toLocaleString(), icon: TrendingUp, color: 'text-green-600' }
                        ].map((stat, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{stat.value}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-primary-600 px-6 py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-15 bg-white/20 rounded-full flex items-center justify-center">
                                        {activeCharacter?.avatarLink ? (
                                            <img src={activeCharacter.avatarLink} alt={activeCharacter.name} className="w-16 h-16 rounded-full" />
                                        ) : (
                                            <User className="w-16 h-16 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{activeCharacter?.name || 'No Active Character'}</h2>
                                        {primaryMembership && (
                                            <div className="text-primary-100">
                                                {primaryMembership.rank?.name} • {primaryMembership.organization.name}
                                            </div>
                                        )}
                                        {activeCharacter && (
                                            <div className="text-primary-200 text-sm">
                                                {activeCharacter.species.name} from {activeCharacter.homeworld.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-auto">
                                        <span className="px-3 py-1 bg-green-500/20 text-green-100 rounded-full text-sm font-medium">
                                            {activeCharacter?.status || 'No Character'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{statsLoading ? '...' : dashboardStats.characterYearsOfService}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Years Service</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{statsLoading ? '...' : dashboardStats.characterCompletedMissions}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed Missions</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeCharacter?.awards.length || 0}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Awards Earned</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { icon: FileText, label: 'Submit Log', color: 'from-blue-500 to-blue-600', href: '/documents/new', action: 'Create new personal or organizational document' },
                                    { icon: Package, label: 'Manage Inventory', color: 'from-orange-500 to-orange-600', href: '/inventory', action: 'View ships, items, and assets' },
                                    { icon: Users, label: 'Organization Hub', color: 'from-indigo-500 to-indigo-600', href: '/organizations', action: 'Access unit information' },
                                    { icon: Settings, label: 'Character Profile', color: 'from-gray-500 to-gray-600', href: '/characters', action: 'Update personal details' }
                                ].map((action, index) => (
                                    <a key={index} href={action.href} className="group text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-transparent hover:shadow-lg transition-all duration-200 block">
                                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                                            <action.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white mb-1">{action.label}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{action.action}</div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                                <a href="/activity" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm font-medium">View All</a>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { type: 'document', title: 'Mission Report: Outer Rim Survey', time: '2 hours ago', status: 'completed' },
                                    { type: 'award', title: 'Recommended Lt. Martinez for Distinguished Service', time: '6 hours ago', status: 'pending' },
                                    { type: 'training', title: 'Advanced Tactics Training Session', time: '1 day ago', status: 'completed' },
                                    { type: 'transfer', title: 'Received supplies from Imperial Logistics', time: '2 days ago', status: 'completed' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            activity.type === 'document' ? 'bg-blue-100 dark:bg-blue-900' :
                                                activity.type === 'award' ? 'bg-purple-100 dark:bg-purple-900' :
                                                    activity.type === 'training' ? 'bg-green-100 dark:bg-green-900' :
                                                        'bg-orange-100 dark:bg-orange-900'
                                        }`}>
                                            {activity.type === 'document' && <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                            {activity.type === 'award' && <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                                            {activity.type === 'training' && <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                            {activity.type === 'transfer' && <Package className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                        }`}>
                                            {activity.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {userHasAccess(roles[2], session?.user) && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
                                <div className="flex items-center mb-4">
                                    <Shield className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">Administrative Dashboard</h3>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <a href="/admin/characters/pending" className="bg-white dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statsLoading ? '...' : dashboardStats.pendingCharacters}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending Character Approvals</div>
                                    </a>
                                    <a href="/admin/documents/pending" className="bg-white dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{statsLoading ? '...' : dashboardStats.pendingDocuments}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending Documents</div>
                                    </a>
                                    <a href="/admin/moderation" className="bg-white dark:bg-gray-800 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{statsLoading ? '...' : dashboardStats.flaggedDocuments}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Flagged Documents</div>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Organization Status */}
                        {primaryMembership && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{primaryMembership.organization?.name}</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Current Rank</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{primaryMembership.rank?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Position</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{primaryMembership.position?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Security Clearance</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{activeCharacter?.clearance?.name || 'None'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Next Review</span>
                                        <span className="font-medium text-gray-900 dark:text-white">March 15</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <a href={`/organizations/${primaryMembership.organization?.id || ''}`} className="w-full text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 font-medium block">
                                        View Organization Details
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Upcoming Events */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                            <div className="space-y-3">
                                {[
                                    { title: 'Fleet Tactical Review', date: 'Tomorrow 14:00', type: 'meeting' },
                                    { title: 'Annual Performance Evaluation', date: 'March 12', type: 'review' },
                                    { title: 'Advanced Combat Training', date: 'March 18', type: 'training' }
                                ].map((event, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${
                                            event.type === 'meeting' ? 'bg-blue-500' :
                                                event.type === 'review' ? 'bg-purple-500' : 'bg-green-500'
                                        }`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Force Profile (if applicable) */}
                        {activeCharacter?.forceProfile && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Force Profile</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Level</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Knight</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Alignment</span>
                                        <span className="font-medium text-primary-600 dark:text-primary-400">Light</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Master</span>
                                        <span className="font-medium text-gray-900 dark:text-white">Master Yoda</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Training Progress</div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '68%'}}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">68% to Master</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {isAuthenticated ? <Dashboard /> : <LandingPage />}
        </div>
    );
}