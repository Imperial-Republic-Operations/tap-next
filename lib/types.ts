// Complete type definitions based on Prisma schema - without Prisma dependencies for client-side usage

// User Settings Types
export interface UserSettings {
    id: bigint;
    language: string;
    dateFormat: 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD';
    timeFormat: 'TWELVE' | 'TWENTY_FOUR';
    emailNotifications: boolean;
    userId: string;
    defaultCharacterId?: bigint | null;
    defaultCharacter?: {
        id: bigint;
        name: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
}

// Character Types
export interface CharacterProfile {
    id: bigint;
    name: string;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
    currentSequence: number;
    avatarLink?: string | null;
    approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
    nexusId?: bigint | null;
    age?: number | null;
    appearance?: string | null;
    habits?: string | null;
    strengths?: string | null;
    weaknesses?: string | null;
    hobbies?: string | null;
    talents?: string | null;
    background?: string | null;
    speciesId: bigint;
    homeworldId: bigint;
    clearanceId?: bigint | null;
    userId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    interactions: CharacterInteraction[];
    previousPositions: CharacterPreviousPosition[];
    educationHistory: CharacterEducation[];
    honors: CharacterHonor[];
    goals: CharacterGoal[];
    memberships: CharacterMembership[];
}

export interface CharacterDetails {
    id: bigint;
    name: string;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
    currentSequence: number;
    avatarLink?: string | null;
    approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
    nexusId?: bigint | null;
    age?: number | null;
    appearance?: string | null;
    habits?: string | null;
    strengths?: string | null;
    weaknesses?: string | null;
    hobbies?: string | null;
    talents?: string | null;
    background?: string | null;
    speciesId: bigint;
    homeworldId: bigint;
    clearanceId?: bigint | null;
    userId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    species: {
        id: bigint;
        name: string;
        forceProbabilityModifier: number;
        createdAt: Date;
        updatedAt: Date;
    };
    homeworld: {
        id: bigint;
        name: string;
        forceProbabilityModifier: number;
        habitable: boolean;
        systemId: bigint;
        createdAt: Date;
        updatedAt: Date;
    };
    clearance?: {
        id: bigint;
        name: string;
        tier: number;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    interactions: CharacterInteraction[];
    previousPositions: CharacterPreviousPosition[];
    educationHistory: CharacterEducation[];
    honors: CharacterHonor[];
    goals: CharacterGoal[];
    awards: CharacterAward[];
    peerage?: {
        id: bigint;
        peerageRank?: 'KINGDOM' | 'KINGDOM_HEIR' | 'PRINCIPALITY' | 'DUCHY' | 'MARQUESSATE' | 'EARLDOM' | 'VISCOUNTCY' | 'BARONY' | null;
        honoraryTitle?: 'DOWAGER_EMPRESS' | 'QUEEN_DOWAGER' | 'PRINCE' | 'PRINCESS' | 'LORD' | 'LADY' | 'KNIGHT' | 'DAME' | null;
        domainId?: bigint | null;
        domain?: {
            id: bigint;
            name: string;
            forceProbabilityModifier: number;
            habitable: boolean;
            systemId: bigint;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    forceProfile?: CharacterForceProfile | null;
    memberships: CharacterMembership[];
}

export interface CharacterForceProfile {
    id: bigint;
    alignment?: 'LIGHT' | 'DARK' | 'NEUTRAL' | null;
    level: 'POTENTIAL' | 'INITIATE' | 'STUDENT' | 'KNIGHT' | 'MASTER' | 'GRANDMASTER';
    aware: boolean;
    masterId?: bigint | null;
    orderId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
    master?: {
        id: bigint;
        name: string;
    } | null;
    order?: {
        id: bigint;
        name: string;
        alignment: 'LIGHT' | 'DARK' | 'NEUTRAL';
        createdAt: Date;
        updatedAt: Date;
        titles: ForceTitle[];
    } | null;
}

export interface ForceTitle {
    id: bigint;
    level: 'POTENTIAL' | 'INITIATE' | 'STUDENT' | 'KNIGHT' | 'MASTER' | 'GRANDMASTER';
    title: string;
    orderId: bigint;
    createdAt: Date;
    updatedAt: Date;
}

export interface CharacterMembership {
    id: bigint;
    primaryMembership: boolean;
    characterId: bigint;
    organizationId: bigint;
    rankId?: bigint | null;
    positionId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
    organization: {
        id: bigint;
        name: string;
        abbreviation: string;
        type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
        parentId?: bigint | null;
        createdAt: Date;
        updatedAt: Date;
    };
    rank?: {
        id: bigint;
        name: string;
        abbreviation: string;
        tier: 'ROYAL_THRONE' | 'HIGH_COMMAND' | 'COMMAND' | 'OFFICER' | 'ENLISTED';
        level: number;
        salary: number;
        organizationId: bigint;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    position?: {
        id: bigint;
        name: string;
        exclusive: boolean;
        stipend: number;
        organizationId: bigint;
        createdAt: Date;
        updatedAt: Date;
        permissions: PositionPermission[];
    } | null;
}

export interface PositionPermission {
    id: bigint;
    value: 'LEADER' | 'SECOND_IN_COMMAND' | 'LEADERSHIP' | 'MANAGE_MEMBERS' | 'MANAGE_POSITIONS' | 'MANAGE_ASSETS' | 'MANAGE_RANKS' | 'MANAGE_REPORTS' | 'OVERRIDE_SECURITY' | 'MANAGE_SECURITY' | 'MONITOR_ACTIVITY' | 'CREATE_REPORTS';
    positionId: bigint;
}

export interface CharacterInteraction {
    interaction: string;
    characterId: bigint;
}

export interface CharacterPreviousPosition {
    position: string;
    characterId: bigint;
}

export interface CharacterEducation {
    education: string;
    characterId: bigint;
}

export interface CharacterHonor {
    honor: string;
    characterId: bigint;
}

export interface CharacterGoal {
    goal: string;
    characterId: bigint;
}

export interface CharacterAward {
    id: bigint;
    dateAwarded: Date;
    status: 'NOMINATED' | 'APPROVED' | 'DENIED' | 'AWARDED';
    characterId: bigint;
    awardId: bigint;
}

// Security Clearance Types
export interface SecurityClearance {
    id: bigint;
    name: string;
    tier: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SecurityClearanceWithCharacters {
    id: bigint;
    name: string;
    tier: number;
    createdAt: Date;
    updatedAt: Date;
    characters: {
        id: bigint;
        name: string;
    }[];
}

export interface CharacterWithClearance {
    id: bigint;
    name: string;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
    currentSequence: number;
    avatarLink?: string | null;
    approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
    nexusId?: bigint | null;
    age?: number | null;
    appearance?: string | null;
    habits?: string | null;
    strengths?: string | null;
    weaknesses?: string | null;
    hobbies?: string | null;
    talents?: string | null;
    background?: string | null;
    speciesId: bigint;
    homeworldId: bigint;
    clearanceId?: bigint | null;
    userId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    clearance?: SecurityClearance | null;
}

// Organization Types
export interface OrganizationMember {
    id: bigint;
    primaryMembership: boolean;
    characterId: bigint;
    organizationId: bigint;
    rankId?: bigint | null;
    positionId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
    character: {
        id: bigint;
        name: string;
        gender: 'MALE' | 'FEMALE';
        status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
        currentSequence: number;
        avatarLink?: string | null;
        approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
        nexusId?: bigint | null;
        age?: number | null;
        appearance?: string | null;
        habits?: string | null;
        strengths?: string | null;
        weaknesses?: string | null;
        hobbies?: string | null;
        talents?: string | null;
        background?: string | null;
        speciesId: bigint;
        homeworldId: bigint;
        clearanceId?: bigint | null;
        userId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    position?: {
        id: bigint;
        name: string;
        exclusive: boolean;
        stipend: number;
        organizationId: bigint;
        createdAt: Date;
        updatedAt: Date;
        permissions: PositionPermission[];
    } | null;
    rank?: {
        id: bigint;
        name: string;
        abbreviation: string;
        tier: 'ROYAL_THRONE' | 'HIGH_COMMAND' | 'COMMAND' | 'OFFICER' | 'ENLISTED';
        level: number;
        salary: number;
        organizationId: bigint;
        createdAt: Date;
        updatedAt: Date;
    } | null;
}

export interface OrganizationDetails {
    id: bigint;
    name: string;
    abbreviation: string;
    type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
    parentId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
    members: OrganizationMember[];
}

export interface OrganizationDetailsWithChildren extends OrganizationDetails {
    parent?: {
        id: bigint;
        name: string;
        abbreviation: string;
        type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
        parentId?: bigint | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    children: Array<{
        id: bigint;
        name: string;
        abbreviation: string;
        type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
        parentId?: bigint | null;
        createdAt: Date;
        updatedAt: Date;
        members: OrganizationMember[];
    }>;
}

export interface OrganizationWithTotalMembers extends OrganizationDetailsWithChildren {
    totalUniqueMembers?: number;
    totalMembers: number;
}

// Document Types
export interface DocumentForList {
    id: bigint;
    sequenceNumber: string;
    title: string;
    content: string;
    status: 'FOR_REVIEW' | 'COMPLETE' | 'REVOKED' | 'NEW' | 'IN_PROCESS' | 'PERMANENT';
    createdAt: Date;
    updatedAt: Date;
}

// export type DocumentForView = DocumentForList | GameDocumentWithTeamAndAuthor | OrganizationDocumentFullDetails | PersonalDocumentWithAuthor;
export type DocumentForView = GameDocumentWithTeamAndAuthor | OrganizationDocumentFullDetails | PersonalDocumentWithAuthor;

export interface GameDocumentWithTeamAndAuthor extends DocumentForList {
    teamId: bigint;
    authorId: string;
    team: {
        id: bigint;
        name: string;
        abbreviation: string;
        currentSequence: number;
        adminId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    author: {
        id: string;
        name?: string | null;
        username: string;
        email: string;
        emailVerified?: Date | null;
        nexusId: bigint;
        image?: string | null;
        role: 'SYSTEM_ADMIN' | 'ADMIN' | 'ASSISTANT_ADMIN' | 'GAME_MODERATOR' | 'STAFF' | 'PLAYER' | 'BANNED';
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface OrganizationDocumentWithOrganizationTypeAndAuthor extends DocumentForList {
    authorId: bigint;
    organizationId: bigint;
    typeId: bigint;
    listClearanceId?: bigint | null;
    viewClearanceId?: bigint | null;
    viewType: 'DEFAULT' | 'SECURITY_CLEARANCE' | 'ASSIGNEES_ONLY';
    organization: {
        id: bigint;
        name: string;
        abbreviation: string;
        type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
        parentId?: bigint | null;
        createdAt: Date;
        updatedAt: Date;
    };
    type: {
        id: bigint;
        name: string;
        abbreviation: string;
        sequenced: boolean;
        useOrganization: boolean;
    };
    author: {
        id: bigint;
        name: string;
        gender: 'MALE' | 'FEMALE';
        status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
        currentSequence: number;
        avatarLink?: string | null;
        approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
        nexusId?: bigint | null;
        age?: number | null;
        appearance?: string | null;
        habits?: string | null;
        strengths?: string | null;
        weaknesses?: string | null;
        hobbies?: string | null;
        talents?: string | null;
        background?: string | null;
        speciesId: bigint;
        homeworldId: bigint;
        clearanceId?: bigint | null;
        userId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface OrganizationDocumentFullDetails extends DocumentForList {
    authorId: bigint;
    organizationId: bigint;
    typeId: bigint;
    listClearanceId?: bigint | null;
    viewClearanceId?: bigint | null;
    viewType: 'DEFAULT' | 'SECURITY_CLEARANCE' | 'ASSIGNEES_ONLY';
    author: {
        id: bigint;
        name: string;
        gender: 'MALE' | 'FEMALE';
        status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
        currentSequence: number;
        avatarLink?: string | null;
        approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
        nexusId?: bigint | null;
        age?: number | null;
        appearance?: string | null;
        habits?: string | null;
        strengths?: string | null;
        weaknesses?: string | null;
        hobbies?: string | null;
        talents?: string | null;
        background?: string | null;
        speciesId: bigint;
        homeworldId: bigint;
        clearanceId?: bigint | null;
        userId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    organization: {
        id: bigint;
        name: string;
        abbreviation: string;
        type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
        parentId?: bigint | null;
        createdAt: Date;
        updatedAt: Date;
    };
    type: {
        id: bigint;
        name: string;
        abbreviation: string;
        sequenced: boolean;
        useOrganization: boolean;
    };
    listClearance?: {
        id: bigint;
        name: string;
        tier: number;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    viewClearance?: {
        id: bigint;
        name: string;
        tier: number;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    signers?: Array<{
        id: bigint;
        name: string;
        gender: 'MALE' | 'FEMALE';
        status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
        currentSequence: number;
        avatarLink?: string | null;
        approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
        nexusId?: bigint | null;
        age?: number | null;
        appearance?: string | null;
        habits?: string | null;
        strengths?: string | null;
        weaknesses?: string | null;
        hobbies?: string | null;
        talents?: string | null;
        background?: string | null;
        speciesId: bigint;
        homeworldId: bigint;
        clearanceId?: bigint | null;
        userId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    assignees?: Array<{
        id: bigint;
        name: string;
        gender: 'MALE' | 'FEMALE';
        status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
        currentSequence: number;
        avatarLink?: string | null;
        approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
        nexusId?: bigint | null;
        age?: number | null;
        appearance?: string | null;
        habits?: string | null;
        strengths?: string | null;
        weaknesses?: string | null;
        hobbies?: string | null;
        talents?: string | null;
        background?: string | null;
        speciesId: bigint;
        homeworldId: bigint;
        clearanceId?: bigint | null;
        userId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

export interface PersonalDocumentWithAuthor extends DocumentForList {
    authorId: bigint;
    author: {
        id: bigint;
        name: string;
        gender: 'MALE' | 'FEMALE';
        status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
        currentSequence: number;
        avatarLink?: string | null;
        approvalStatus?: 'DRAFT' | 'PENDING' | 'DENIED' | 'APPROVED' | null;
        nexusId?: bigint | null;
        age?: number | null;
        appearance?: string | null;
        habits?: string | null;
        strengths?: string | null;
        weaknesses?: string | null;
        hobbies?: string | null;
        talents?: string | null;
        background?: string | null;
        speciesId: bigint;
        homeworldId: bigint;
        clearanceId?: bigint | null;
        userId?: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
}

// Inventory Types
export interface InventoryContents {
    id: bigint;
    type: 'CHARACTER' | 'ORGANIZATION';
    characterId?: bigint | null;
    organizationId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
    items: Item[];
    ships: Ship[];
    vehicles: Vehicle[];
}

export interface Item {
    id: bigint;
    quantity: number;
    inventoryId: bigint;
    modelId: bigint;
    createdAt: Date;
    updatedAt: Date;
    model: ItemModel;
}

export interface Ship {
    id: bigint;
    name: string;
    crewCapacity: number;
    cargoCapacity: number;
    passengerCapacity: number;
    inventoryId: bigint;
    modelId: bigint;
    createdAt: Date;
    updatedAt: Date;
    model: ShipModel;
}

export interface Vehicle {
    id: bigint;
    name: string;
    crewCapacity: number;
    cargoCapacity: number;
    inventoryId: bigint;
    modelId: bigint;
    createdAt: Date;
    updatedAt: Date;
    model: VehicleModel;
}

export interface ItemModel {
    id: bigint;
    name: string;
    description: string;
    type: 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'MATERIAL' | 'TOOL' | 'KEY_ITEM' | 'OTHER';
    weight: number;
    stackable: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShipModel {
    id: bigint;
    name: string;
    manufacturer: string;
    crewCapacity: number;
    cargoCapacity: number;
    passengerCapacity: number;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface VehicleModel {
    id: bigint;
    name: string;
    manufacturer: string;
    crewCapacity: number;
    cargoCapacity: number;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Additional supporting types that might be needed
export interface SuborganizationData {
    id: bigint;
    name: string;
    abbreviation: string;
    type: 'FACTION' | 'BRANCH' | 'DEPARTMENT' | 'DIVISION' | 'BUREAU' | 'SECTION' | 'UNIT';
    parentId?: bigint | null;
    createdAt: Date;
    updatedAt: Date;
    members: OrganizationMember[];
}

export interface MemberBreakdown {
    totalUniqueCharacters: number;
    totalMemberships: number;
    organizationIds: bigint[];
}

// User Types
export interface Team {
    id: bigint;
    name: string;
    abbreviation: string;
    currentSequence: number;
    adminId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithTeamAndTeams {
    id: string;
    name?: string | null;
    username: string;
    email: string;
    emailVerified?: Date | null;
    nexusId: bigint;
    image?: string | null;
    role: 'SYSTEM_ADMIN' | 'ADMIN' | 'ASSISTANT_ADMIN' | 'GAME_MODERATOR' | 'STAFF' | 'PLAYER' | 'BANNED';
    createdAt: Date;
    updatedAt: Date;
    team?: Team | null;
    teams: Team[];
}