import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// Calendar API
export const calendarApi = {
    // Years
    getYears: (page: number = 0, era?: string) => 
        apiClient.get('/calendar/years', { params: { page, era } }),
    
    getCurrentYear: () => 
        apiClient.get('/calendar/years', { params: { current: 'true' } }),
    
    createYear: (data: { gameYear: number; era: string; current?: boolean }) => 
        apiClient.post('/calendar/years', data),
    
    makeYearCurrent: (id: bigint) => 
        apiClient.put('/calendar/years', { id: id.toString() }),

    // Months
    getMonths: () => 
        apiClient.get('/calendar/months'),
    
    getMonth: (month: string) => 
        apiClient.get('/calendar/months', { params: { month } }),
    
    updateMonth: (realMonth: string, gameMonth: string) => 
        apiClient.put('/calendar/months', { realMonth, gameMonth }),
};

// Characters API
export const charactersApi = {
    getCharacters: (userId: string, tab: 'personal' | 'npc' = 'personal', page: number = 0) => 
        apiClient.get('/characters', { params: { userId, tab, page } }),
    
    getCharacter: (id: bigint) => 
        apiClient.get(`/characters/${id.toString()}`),
    
    getCharacterClearance: (id: bigint) => 
        apiClient.get(`/characters/${id.toString()}`, { params: { clearanceOnly: 'true' } }),
    
    getPendingCharacters: (page: number = 0) => 
        apiClient.get('/characters/pending', { params: { page } }),
    
    approveCharacter: (id: bigint) => 
        apiClient.put(`/characters/${id.toString()}/approval`, { action: 'approve' }),
    
    rejectCharacter: (id: bigint) => 
        apiClient.put(`/characters/${id.toString()}/approval`, { action: 'reject' }),
    
    claimNPC: (id: bigint) => 
        apiClient.put(`/characters/${id.toString()}/claim`),
};

// Documents API
export const documentsApi = {
    getGameDocuments: (page: number = 0) => 
        apiClient.get('/documents/game', { params: { page } }),
    
    getOrganizationDocuments: (charId: bigint, orgId?: bigint, page: number = 0) => 
        apiClient.get('/documents/organization', { 
            params: { 
                charId: charId.toString(), 
                orgId: orgId?.toString(), 
                page 
            } 
        }),
    
    getPersonalDocuments: (charId: bigint, page: number = 0) => 
        apiClient.get('/documents/personal', { params: { charId: charId.toString(), page } }),
    
    getDocument: (type: 'game' | 'organization' | 'personal', id: bigint) => 
        apiClient.get(`/documents/${type}/${id.toString()}`),
};

// Inventory API
export const inventoryApi = {
    getInventory: (ownerId: bigint, type: 'CHARACTER' | 'ORGANIZATION') => 
        apiClient.get('/inventory', { params: { ownerId: ownerId.toString(), type } }),
};

// Notifications API
export const notificationsApi = {
    getUnseenNotifications: (userId: string) => 
        apiClient.get('/notifications', { params: { userId, type: 'unseen' } }),
    
    getUnreadNotificationCount: (userId: string) => 
        apiClient.get('/notifications', { params: { userId, type: 'unread-count' } }),
    
    getUndeletedNotifications: (userId: string, page: number = 0) => 
        apiClient.get('/notifications', { params: { userId, type: 'undeleted', page } }),
    
    getUsersNotifications: (userId: string, page: number = 0) => 
        apiClient.get('/notifications', { params: { userId, type: 'user', page } }),
    
    getAllNotifications: (page: number = 0) => 
        apiClient.get('/notifications', { params: { type: 'all', page } }),
    
    createNotification: (userId: string, message: string, link?: string) => 
        apiClient.post('/notifications', { userId, message, link }),
    
    markAllUserNotificationsAsRead: (userId: string) => 
        apiClient.put('/notifications', { userId, action: 'mark-all-read' }),
    
    markNotificationAsSeen: (id: bigint) => 
        apiClient.put(`/notifications/${id.toString()}`, { action: 'mark-seen' }),
    
    markNotificationAsRead: (id: bigint) => 
        apiClient.put(`/notifications/${id.toString()}`, { action: 'mark-read' }),
    
    deleteNotification: (id: bigint) => 
        apiClient.put(`/notifications/${id.toString()}`, { action: 'delete' }),
};

// Organizations API
export const organizationsApi = {
    getFactions: (page: number = 0) => 
        apiClient.get('/organizations/factions', { params: { page } }),
    
    getOrganization: (id: bigint) => 
        apiClient.get(`/organizations/${id.toString()}`),
    
    getOrganizationWithTotalMembers: (id: bigint) => 
        apiClient.get(`/organizations/${id.toString()}`, { params: { type: 'with-total-members' } }),
    
    getOrganizationParents: (id: bigint) => 
        apiClient.get(`/organizations/${id.toString()}`, { params: { type: 'parents' } }),
    
    getUniqueCharacterCount: (id: bigint) => 
        apiClient.get(`/organizations/${id.toString()}`, { params: { type: 'unique-count' } }),
    
    getOrganizationMemberBreakdown: (id: bigint) => 
        apiClient.get(`/organizations/${id.toString()}`, { params: { type: 'member-breakdown' } }),
    
    getOrganizationMembers: (
        id: bigint, 
        page: number = 0, 
        filters?: {
            search?: string;
            filterType?: 'all' | 'leadership' | 'high command' | 'officers' | 'enlisted' | 'civilian';
            sortBy?: 'name' | 'rank' | 'position' | 'joined';
        }
    ) => apiClient.get(`/organizations/${id.toString()}/members`, { 
        params: { page, ...filters } 
    }),
    
    getCharacterOrganizationAccess: (charId: bigint) => 
        apiClient.get('/organizations/access', { params: { charId: charId.toString(), type: 'character-access' } }),
    
    getSubOrganizations: (parentOrgId: bigint) => 
        apiClient.get('/organizations/access', { params: { parentOrgId: parentOrgId.toString(), type: 'sub-organizations' } }),
    
    getUniqueCharacterCountByOrgId: (orgId: bigint) => 
        apiClient.get('/organizations/access', { params: { parentOrgId: orgId.toString(), type: 'unique-character-count' } }),
    
    getSisterOrganizations: (parentOrgId: bigint, orgId: bigint) => 
        apiClient.get('/organizations/access', { params: { parentOrgId: parentOrgId.toString(), orgId: orgId.toString(), type: 'sister-organizations' } }),
    
    // Security Clearances
    getSecurityClearances: () => 
        apiClient.get('/organizations/security-clearances'),
    
    createSecurityClearance: (data: { name: string; tier: number }) => 
        apiClient.post('/organizations/security-clearances', data),
    
    updateSecurityClearanceTier: (id: bigint, tier: number) => 
        apiClient.patch(`/organizations/security-clearances/${id.toString()}`, { tier }),
    
    getCharactersWithClearances: () => 
        apiClient.get('/organizations/characters-with-clearances'),
};

// Users API
export const usersApi = {
    getAllUsers: (page: number = 0, search: string = '', role: string = '') => 
        apiClient.get('/users', { params: { page, search, role } }),
    
    getUser: (id: string) => 
        apiClient.get(`/users/${id}`),
    
    getUserProfile: (id: string) => 
        apiClient.get(`/users/${id}/profile`),
    
    getUserSettings: (id: string) => 
        apiClient.get(`/users/${id}/settings`),
    
    updateUserSettings: (id: string, settings: {
        language?: string;
        dateFormat?: 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD';
        timeFormat?: 'TWELVE' | 'TWENTY_FOUR';
        emailNotifications?: boolean;
        defaultCharacterId?: string | null;
    }) => 
        apiClient.put(`/users/${id}/settings`, settings),
    
    updateUserRole: (userId: string, role: string) => 
        apiClient.put('/users', { userId, role }),
    
    getAllUserCharacters: (id: string) => 
        apiClient.get(`/users/${id}/characters`),
};

// Species API
export const speciesApi = {
    getSpecies: () => 
        apiClient.get('/species'),
};

// Planets API
export const planetsApi = {
    getPlanets: () => 
        apiClient.get('/planets'),
};

// Dashboard API  
export const dashboardApi = {
    getStats: (characterId?: bigint, userId?: string) => 
        apiClient.get('/dashboard/stats', { 
            params: { 
                characterId: characterId?.toString(), 
                userId 
            } 
        }),
    
    getPublicStats: () => 
        apiClient.get('/public/stats'),
};

// Map API
export const mapApi = {
    // Get complete galaxy map data
    getGalaxyData: () => 
        apiClient.get('/map/galaxy'),
    
    // Oversectors
    getOversectors: () => 
        apiClient.get('/map/oversectors'),
    
    getOversector: (id: bigint) => 
        apiClient.get(`/map/oversectors/${id}`),
    
    createOversector: (data: { name: string; x?: number; y?: number; width?: number; height?: number; color?: string }) => 
        apiClient.post('/map/oversectors', data),
    
    updateOversector: (id: bigint, data: { name?: string; x?: number; y?: number; width?: number; height?: number; color?: string }) => 
        apiClient.put(`/map/oversectors/${id}`, data),
    
    // Sectors
    getSectorsForOversector: (oversectorId: bigint) => 
        apiClient.get('/map/sectors', { params: { oversectorId: oversectorId.toString() } }),
    
    getSector: (id: bigint) => 
        apiClient.get(`/map/sectors/${id}`),
    
    createSector: (data: { name: string; oversectorId: bigint; x?: number; y?: number; width?: number; height?: number; color?: string }) => 
        apiClient.post('/map/sectors', { ...data, oversectorId: data.oversectorId.toString() }),
    
    updateSector: (id: bigint, data: { name?: string; x?: number; y?: number; width?: number; height?: number; color?: string }) => 
        apiClient.put(`/map/sectors/${id}`, data),
    
    // Systems
    getSystemsForSector: (sectorId: bigint) => 
        apiClient.get('/map/systems', { params: { sectorId: sectorId.toString() } }),
    
    getSystem: (id: bigint) => 
        apiClient.get(`/map/systems/${id}`),
    
    createSystem: (data: { name: string; sectorId: bigint; x?: number; y?: number; width?: number; height?: number; color?: string }) => 
        apiClient.post('/map/systems', { ...data, sectorId: data.sectorId.toString() }),
    
    updateSystem: (id: bigint, data: { name?: string; x?: number; y?: number; width?: number; height?: number; color?: string }) => 
        apiClient.put(`/map/systems/${id}`, data),
    
    // Planets
    getPlanetsForSystem: (systemId: bigint) => 
        apiClient.get('/map/planets', { params: { systemId: systemId.toString() } }),
    
    createPlanet: (data: { name: string; systemId: bigint; x?: number; y?: number; radius?: number; color?: string; habitable?: boolean; forceProbabilityModifier?: number }) => 
        apiClient.post('/map/planets', { ...data, systemId: data.systemId.toString() }),
    
    updatePlanet: (id: bigint, data: { name?: string; x?: number; y?: number; radius?: number; color?: string; habitable?: boolean; forceProbabilityModifier?: number }) => 
        apiClient.put(`/map/planets/${id}`, data),
};

export default apiClient;