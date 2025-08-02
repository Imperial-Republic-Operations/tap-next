import {
    Alignment,
    CharacterStatus, DomainRank,
    Era,
    ForceLevel,
    Gender, HonoraryTitle,
    OrganizationType,
    Permission,
    PrismaClient, RankTier,
    RealMonth
} from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    console.log('📋 Seeding Security Clearances...');
    //region Clearances
    //region Kappa
    const kappa2 = await prisma.securityClearance.upsert({
        where: {name: 'Kappa-2'},
        update: {},
        create: {name: 'Kappa-2', tier: 1},
    });

    const kappa1 = await prisma.securityClearance.upsert({
        where: {name: 'Kappa-1'},
        update: {},
        create: {name: 'Kappa-1', tier: 2},
    });
    //endregion

    //region Iota
    const iota2 = await prisma.securityClearance.upsert({
        where: {name: 'Iota-2'},
        update: {},
        create: {name: 'Iota-2', tier: 3},
    });

    const iota1 = await prisma.securityClearance.upsert({
        where: {name: 'Iota-1'},
        update: {},
        create: {name: 'Iota-1', tier: 4},
    });
    //endregion

    //region Theta
    const theta3 = await prisma.securityClearance.upsert({
        where: {name: 'Theta-3'},
        update: {},
        create: {name: 'Theta-3', tier: 5},
    });

    const theta2 = await prisma.securityClearance.upsert({
        where: {name: 'Theta-2'},
        update: {},
        create: {name: 'Theta-2', tier: 6},
    });

    const theta1 = await prisma.securityClearance.upsert({
        where: {name: 'Theta-1'},
        update: {},
        create: {name: 'Theta-1', tier: 7},
    });
    //endregion

    //region Zeta
    const zeta5 = await prisma.securityClearance.upsert({
        where: {name: 'Zeta-5'},
        update: {},
        create: {name: 'Zeta-5', tier: 8},
    });

    const zeta4 = await prisma.securityClearance.upsert({
        where: {name: 'Zeta-4'},
        update: {},
        create: {name: 'Zeta-4', tier: 9},
    });

    const zeta3 = await prisma.securityClearance.upsert({
        where: {name: 'Zeta-3'},
        update: {},
        create: {name: 'Zeta-3', tier: 10},
    });

    const zeta2 = await prisma.securityClearance.upsert({
        where: {name: 'Zeta-2'},
        update: {},
        create: {name: 'Zeta-2', tier: 11},
    });

    const zeta1 = await prisma.securityClearance.upsert({
        where: {name: 'Zeta-1'},
        update: {},
        create: {name: 'Zeta-1', tier: 12},
    });
    //endregion

    //region Epsilon
    const epsilon5 = await prisma.securityClearance.upsert({
        where: {name: 'Epsilon-5'},
        update: {},
        create: {name: 'Epsilon-5', tier: 13},
    });

    const epsilon4 = await prisma.securityClearance.upsert({
        where: {name: 'Epsilon-4'},
        update: {},
        create: {name: 'Epsilon-4', tier: 14},
    });

    const epsilon3 = await prisma.securityClearance.upsert({
        where: {name: 'Epsilon-3'},
        update: {},
        create: {name: 'Epsilon-3', tier: 15},
    });

    const epsilon2 = await prisma.securityClearance.upsert({
        where: {name: 'Epsilon-2'},
        update: {},
        create: {name: 'Epsilon-2', tier: 16},
    });

    const epsilon1 = await prisma.securityClearance.upsert({
        where: {name: 'Epsilon-1'},
        update: {},
        create: {name: 'Epsilon-1', tier: 17},
    });
    //endregion

    //region Delta
    const deltaGreen = await prisma.securityClearance.upsert({
        where: {name: 'Delta Green'},
        update: {},
        create: {name: 'Delta Green', tier: 18},
    });

    const deltaOrange = await prisma.securityClearance.upsert({
        where: {name: 'Delta Orange'},
        update: {},
        create: {name: 'Delta Orange', tier: 19},
    });

    const deltaRed = await prisma.securityClearance.upsert({
        where: {name: 'Delta Red'},
        update: {},
        create: {name: 'Delta Red', tier: 20},
    });

    const deltaBlack = await prisma.securityClearance.upsert({
        where: {name: 'Delta Black'},
        update: {},
        create: {name: 'Delta Black', tier: 21},
    });
    //endregion

    //region Beta
    const betaCopper = await prisma.securityClearance.upsert({
        where: {name: 'Beta Copper'},
        update: {},
        create: {name: 'Beta Copper', tier: 22},
    });

    const betaBronze = await prisma.securityClearance.upsert({
        where: {name: 'Beta Bronze'},
        update: {},
        create: {name: 'Beta Bronze', tier: 23},
    });

    const betaSilver = await prisma.securityClearance.upsert({
        where: {name: 'Beta Silver'},
        update: {},
        create: {name: 'Beta Silver', tier: 24},
    });

    const betaCrimson = await prisma.securityClearance.upsert({
        where: {name: 'Beta Crimson'},
        update: {},
        create: {name: 'Beta Crimson', tier: 25},
    });
    //endregion

    //region Alpha
    const alphaViolet = await prisma.securityClearance.upsert({
        where: {name: 'Alpha Violet'},
        update: {},
        create: {name: 'Alpha Violet', tier: 26},
    });
    const alphaBlue = await prisma.securityClearance.upsert({
        where: {name: 'Alpha Blue'},
        update: {},
        create: {name: 'Alpha Blue', tier: 27},
    });
    const alphaGold = await prisma.securityClearance.upsert({
        where: {name: 'Alpha Gold'},
        update: {},
        create: {name: 'Alpha Gold', tier: 28},
    });
    const alphaPrime = await prisma.securityClearance.upsert({
        where: {name: 'Alpha Prime'},
        update: {},
        create: {name: 'Alpha Prime', tier: 29},
    });
    //endregion
    //endregion

    console.log('📅 Seeding Current Year...');
    const currentYear = await prisma.year.upsert({
        where: {id: 1},
        update: {},
        create: {
            gameYear: 38,
            era: Era.IRY,
            current: true,
        },
    });

    console.log('📅 Seeding Months...');
    const months = await Promise.all([
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.JANUARY,
            },
            update: {},
            create: {
                realMonth: RealMonth.JANUARY,
                gameMonth: 'Clowa',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.FEBRUARY,
            },
            update: {},
            create: {
                realMonth: RealMonth.FEBRUARY,
                gameMonth: 'Anak',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.MARCH,
            },
            update: {},
            create: {
                realMonth: RealMonth.MARCH,
                gameMonth: 'Pûrga',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.APRIL,
            },
            update: {},
            create: {
                realMonth: RealMonth.APRIL,
                gameMonth: 'Luke',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.MAY,
            },
            update: {},
            create: {
                realMonth: RealMonth.MAY,
                gameMonth: 'Nüré',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.JUNE,
            },
            update: {},
            create: {
                realMonth: RealMonth.JUNE,
                gameMonth: 'Galak',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.JULY,
            },
            update: {},
            create: {
                realMonth: RealMonth.JULY,
                gameMonth: 'Voñin',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.AUGUST,
            },
            update: {},
            create: {
                realMonth: RealMonth.AUGUST,
                gameMonth: 'Collà',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.SEPTEMBER,
            },
            update: {},
            create: {
                realMonth: RealMonth.SEPTEMBER,
                gameMonth: 'Kinjá',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.OCTOBER,
            },
            update: {},
            create: {
                realMonth: RealMonth.OCTOBER,
                gameMonth: 'Üffpor',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.NOVEMBER,
            },
            update: {},
            create: {
                realMonth: RealMonth.NOVEMBER,
                gameMonth: 'Hmnor',
            },
        }),
        prisma.month.upsert({
            where: {
                realMonth: RealMonth.DECEMBER,
            },
            update: {},
            create: {
                realMonth: RealMonth.DECEMBER,
                gameMonth: 'Galpea',
            },
        }),
    ]);

    console.log('🌌 Seeding Galaxy Map...');
    //region Galaxy Map
    //region Oversectors
    const capitalDistrict = await prisma.oversector.upsert({
        where: {name: 'Capital District'},
        update: {},
        create: {name: 'Capital District'},
    });

    const coruscantOversector = await prisma.oversector.upsert({
        where: {name: 'Coruscant'},
        update: {},
        create: {name: 'Coruscant'},
    });

    const kuatOversector = await prisma.oversector.upsert({
        where: {name: 'Kuat'},
        update: {},
        create: {name: 'Kuat'},
    });

    const corelliaOversector = await prisma.oversector.upsert({
        where: {name: 'Corellia'},
        update: {},
        create: {name: 'Corellia'},
    });

    const brightJewelOversector = await prisma.oversector.upsert({
        where: {name: 'Bright Jewel'},
        update: {},
        create: {name: 'Bright Jewel'},
    });

    const hapesOversector = await prisma.oversector.upsert({
        where: {name: 'Hapes'},
        update: {},
        create: {name: 'Hapes'},
    });

    const outerRimOversector = await prisma.oversector.upsert({
        where: {name: 'Outer Rim'},
        update: {},
        create: {name: 'Outer Rim'},
    });

    const deepSpaceOverSector = await prisma.oversector.upsert({
        where: {name: 'Deep Space'},
        update: {},
        create: {name: 'Deep Space'},
    });
    //endregion

    //region Sectors
    const coruscantSector = await prisma.sector.upsert({
        where: {name: 'Coruscant Sector'},
        update: {},
        create: {
            name: 'Coruscant Sector',
            oversectorId: capitalDistrict.id,
        },
    });

    const dolomarSector = await prisma.sector.upsert({
        where: {name: 'Dolomar Sector'},
        update: {},
        create: {
            name: 'Dolomar Sector',
            oversectorId: coruscantOversector.id,
        },
    });

    const kuatSector = await prisma.sector.upsert({
        where: {name: 'Kuat Sector'},
        update: {},
        create: {
            name: 'Kuat Sector',
            oversectorId: kuatOversector.id,
        },
    });

    const corellianSector = await prisma.sector.upsert({
        where: {name: 'Corellian Sector'},
        update: {},
        create: {
            name: 'Corellian Sector',
            oversectorId: corelliaOversector.id,
        },
    });

    const brightJewelSector = await prisma.sector.upsert({
        where: {name: 'Bright Jewel Sector'},
        update: {},
        create: {
            name: 'Bright Jewel Sector',
            oversectorId: brightJewelOversector.id,
        },
    });

    const hapesCluster = await prisma.sector.upsert({
        where: {name: 'Hapes Cluster'},
        update: {},
        create: {
            name: 'Hapes Cluster',
            oversectorId: hapesOversector.id,
        },
    });

    const arkanisSector = await prisma.sector.upsert({
        where: {name: 'Arkanis Sector'},
        update: {},
        create: {
            name: 'Arkanis Sector',
            oversectorId: outerRimOversector.id,
        },
    });

    const sullustSector = await prisma.sector.upsert({
        where: {name: 'Sullust Sector'},
        update: {},
        create: {
            name: 'Sullust Sector',
            oversectorId: outerRimOversector.id,
        },
    });

    const deepSpaceSector = await prisma.sector.upsert({
        where: {name: 'Deep Space'},
        update: {},
        create: {
            name: 'Deep Space',
            oversectorId: deepSpaceOverSector.id,
        }
    });
    //endregion

    //region Systems
    const coruscantSystem = await prisma.system.upsert({
        where: {name: 'Coruscant System'},
        update: {},
        create: {
            name: 'Coruscant System',
            sectorId: coruscantSector.id,
        },
    });

    const dolomarSystem = await prisma.system.upsert({
        where: {name: 'Dolomar System'},
        update: {},
        create: {
            name: 'Dolomar System',
            sectorId: dolomarSector.id,
        },
    });

    const kuatSystem = await prisma.system.upsert({
        where: {name: 'Kuat System'},
        update: {},
        create: {
            name: 'Kuat System',
            sectorId: kuatSector.id,
        },
    });

    const corellianSystem = await prisma.system.upsert({
        where: {name: 'Corellian System'},
        update: {},
        create: {
            name: 'Corellian System',
            sectorId: corellianSector.id,
        },
    });

    const brightJewelSystem = await prisma.system.upsert({
        where: {name: 'Bright Jewel System'},
        update: {},
        create: {
            name: 'Bright Jewel System',
            sectorId: brightJewelSector.id,
        },
    });

    const hapesSystem = await prisma.system.upsert({
        where: {name: 'Hapes System'},
        update: {},
        create: {
            name: 'Hapes System',
            sectorId: hapesCluster.id,
        },
    });

    const mairesSystem = await prisma.system.upsert({
        where: {name: 'Maires System'},
        update: {},
        create: {
            name: 'Maires System',
            sectorId: hapesCluster.id,
        },
    });

    const tatooSystem = await prisma.system.upsert({
        where: {name: 'Tatoo System'},
        update: {},
        create: {
            name: 'Tatoo System',
            sectorId: arkanisSector.id,
        },
    });

    const sullustSystem = await prisma.system.upsert({
        where: {name: 'Sullust System'},
        update: {},
        create: {
            name: 'Sullust System',
            sectorId: sullustSector.id,
        },
    });

    const deepSpaceSystem = await prisma.system.upsert({
        where: {name: 'Deep Space'},
        update: {},
        create: {
            name: 'Deep Space',
            sectorId: deepSpaceSector.id,
        },
    });
    //endregion

    //region Planets
    const coruscant = await prisma.planet.upsert({
        where: {name: 'Coruscant'},
        update: {},
        create: {
            name: 'Coruscant',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: coruscantSystem.id,
        },
    });

    const dolomar = await prisma.planet.upsert({
        where: {name: 'Dolomar'},
        update: {},
        create: {
            name: 'Dolomar',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: dolomarSystem.id,
        },
    });

    const kuat = await prisma.planet.upsert({
        where: {name: 'Kuat'},
        update: {},
        create: {
            name: 'Kuat',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: kuatSystem.id,
        },
    });

    const corellia = await prisma.planet.upsert({
        where: {name: 'Corellia'},
        update: {},
        create: {
            name: 'Corellia',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: corellianSystem.id,
        },
    });

    const ordMantell = await prisma.planet.upsert({
        where: {name: 'Ord Mantell'},
        update: {},
        create: {
            name: 'Ord Mantell',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: brightJewelSystem.id,
        },
    });

    const hapes = await prisma.planet.upsert({
        where: {name: 'Hapes'},
        update: {},
        create: {
            name: 'Hapes',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: hapesSystem.id,
        },
    });

    const maires = await prisma.planet.upsert({
        where: {name: 'Maires'},
        update: {},
        create: {
            name: 'Maires',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: mairesSystem.id,
        },
    });

    const tatooine = await prisma.planet.upsert({
        where: {name: 'Tatooine'},
        update: {},
        create: {
            name: 'Tatooine',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: tatooSystem.id,
        },
    });

    const sullust = await prisma.planet.upsert({
        where: {name: 'Sullust'},
        update: {},
        create: {
            name: 'Sullust',
            forceProbabilityModifier: 1.2,
            habitable: true,
            systemId: sullustSystem.id,
        },
    });

    const deepSpace = await prisma.planet.upsert({
        where: {name: 'Deep Space'},
        update: {},
        create: {
            name: 'Deep Space',
            forceProbabilityModifier: 1.0,
            habitable: true,
            systemId: deepSpaceSystem.id,
        },
    });
    //endregion
    //endregion

    console.log('👥 Seeding Species...');
    //region Species
    const human = await prisma.species.upsert({
        where: {name: 'Human'},
        update: {},
        create: {
            name: 'Human',
            forceProbabilityModifier: 1.0,
        },
    });

    const twilek = await prisma.species.upsert({
        where: {name: "Twi'lek"},
        update: {},
        create: {
            name: "Twi'lek",
            forceProbabilityModifier: 1.1,
        },
    });

    const chagrian = await prisma.species.upsert({
        where: {name: "Chagrian"},
        update: {},
        create: {
            name: "Chagrian",
            forceProbabilityModifier: 0.25,
        },
    });

    const rodian = await prisma.species.upsert({
        where: {name: "Rodian"},
        update: {},
        create: {
            name: "Rodian",
            forceProbabilityModifier: 0.8,
        },
    });

    const wookie = await prisma.species.upsert({
        where: {name: "Wookie"},
        update: {},
        create: {
            name: "Wookie",
            forceProbabilityModifier: 0.7,
        },
    });

    const cathar = await prisma.species.upsert({
        where: {name: "Cathar"},
        update: {},
        create: {
            name: "Cathar",
            forceProbabilityModifier: 1.25,
        },
    });

    const kaminoan = await prisma.species.upsert({
        where: {name: 'Kaminoan'},
        update: {},
        create: {
            name: 'Kaminoan',
            forceProbabilityModifier: 1.3,
        },
    });

    const zabrak = await prisma.species.upsert({
        where: {name: 'Zabrak'},
        update: {},
        create: {
            name: 'Zabrak',
            forceProbabilityModifier: 1.4,
        },
    });
    //endregion

    console.log('🏛️ Seeding Organizations...');
    //region Organizations
    //region Factions
    let imperialRepublic = await prisma.organization.findFirst({
        where: {
            name: 'Imperial Republic',
            parentId: null,
        },
    });
    if (!imperialRepublic) {
        imperialRepublic = await prisma.organization.create({
            data: {
                name: 'Imperial Republic',
                abbreviation: 'IR',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let hapesConsortium = await prisma.organization.findFirst({
        where: {
            name: 'Hapes Consortium',
            parentId: null,
        },
    });
    if (!hapesConsortium) {
        hapesConsortium = await prisma.organization.create({
            data: {
                name: 'Hapes Consortium',
                abbreviation: 'Hapes',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let mandalore = await prisma.organization.findFirst({
        where: {
            name: 'Mandalore',
            parentId: null,
        },
    });
    if (!mandalore) {
        mandalore = await prisma.organization.create({
            data: {
                name: 'Mandalore',
                abbreviation: 'Mando',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let chissAscendancy = await prisma.organization.findFirst({
        where: {
            name: 'Chiss Ascendancy',
            parentId: null,
        },
    });
    if (!chissAscendancy) {
        chissAscendancy = await prisma.organization.create({
            data: {
                name: 'Chiss Ascendancy',
                abbreviation: 'CA',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let tionHegemony = await prisma.organization.findFirst({
        where: {
            name: 'Tion Hegemony',
            parentId: null,
        },
    });
    if (!tionHegemony) {
        tionHegemony = await prisma.organization.create({
            data: {
                name: 'Tion Hegemony',
                abbreviation: 'Tion',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let demaricCriminalConsortium = await prisma.organization.findFirst({
        where: {
            name: 'Des`Maric Criminal Consortium',
            parentId: null,
        },
    });
    if (!demaricCriminalConsortium) {
        demaricCriminalConsortium = await prisma.organization.create({
            data: {
                name: 'Des`Maric Criminal Consortium',
                abbreviation: 'DCC',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let sithEmpire = await prisma.organization.findFirst({
        where: {
            name: 'Sith Empire',
            parentId: null,
        },
    });
    if (!sithEmpire) {
        sithEmpire = await prisma.organization.create({
            data: {
                name: 'Sith Empire',
                abbreviation: 'Sith',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let tradeFederation = await prisma.organization.findFirst({
        where: {
            name: 'Trade Federation',
            parentId: null,
        },
    });
    if (!tradeFederation) {
        tradeFederation = await prisma.organization.create({
            data: {
                name: 'Trade Federation',
                abbreviation: 'TF',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let blackSun = await prisma.organization.findFirst({
        where: {
            name: 'Black Sun',
            parentId: null,
        },
    });
    if (!blackSun) {
        blackSun = await prisma.organization.create({
            data: {
                name: 'Black Sun',
                abbreviation: 'BS',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let corporateSectorAuthority = await prisma.organization.findFirst({
        where: {
            name: 'Corporate Sector Authority',
            parentId: null,
        },
    });
    if (!corporateSectorAuthority) {
        corporateSectorAuthority = await prisma.organization.create({
            data: {
                name: 'Corporate Sector Authority',
                abbreviation: 'CSA',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let falleenFederation = await prisma.organization.findFirst({
        where: {
            name: 'Falleen Federation',
            parentId: null,
        },
    });
    if (!falleenFederation) {
        falleenFederation = await prisma.organization.create({
            data: {
                name: 'Falleen Federation',
                abbreviation: 'FF',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let huttCartel = await prisma.organization.findFirst({
        where: {
            name: 'Hutt Cartel',
            parentId: null,
        },
    });
    if (!huttCartel) {
        huttCartel = await prisma.organization.create({
            data: {
                name: 'Hutt Cartel',
                abbreviation: 'Cartel',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let praxeum = await prisma.organization.findFirst({
        where: {
            name: 'Praxeum',
            parentId: null,
        },
    });
    if (!praxeum) {
        praxeum = await prisma.organization.create({
            data: {
                name: 'Praxeum',
                abbreviation: 'Prax',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let imperialConfederacy = await prisma.organization.findFirst({
        where: {
            name: 'Imperial Confederacy',
            parentId: null,
        },
    });
    if (!imperialConfederacy) {
        imperialConfederacy = await prisma.organization.create({
            data: {
                name: 'Imperial Confederacy',
                abbreviation: 'IC',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let crimsonDawn = await prisma.organization.findFirst({
        where: {
            name: 'Crimson Dawn',
            parentId: null,
        },
    });
    if (!crimsonDawn) {
        crimsonDawn = await prisma.organization.create({
            data: {
                name: 'Crimson Dawn',
                abbreviation: 'CD',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }

    let firstOrder = await prisma.organization.findFirst({
        where: {
            name: 'First Order',
            parentId: null,
        },
    });
    if (!firstOrder) {
        firstOrder = await prisma.organization.create({
            data: {
                name: 'First Order',
                abbreviation: '1O',
                type: OrganizationType.FACTION,
                parentId: null as any,
            },
        });
    }
    //endregion

    //region Branches
    const irMoS = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Ministry of State',
                parentId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Ministry of State',
            abbreviation: 'MoS',
            type: OrganizationType.BRANCH,
            parentId: imperialRepublic!.id,
        },
    });

    const irMoD = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Ministry of Defense',
                parentId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Ministry of Defense',
            abbreviation: 'MoD',
            type: OrganizationType.BRANCH,
            parentId: imperialRepublic!.id,
        },
    });

    const irCOMPNOR = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "Commission for the Preservation of His Majesty's New Order",
                parentId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: "Commission for the Preservation of His Majesty's New Order",
            abbreviation: 'COMPNOR',
            type: OrganizationType.BRANCH,
            parentId: imperialRepublic!.id,
        },
    });

    const irThrone = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Throne',
                parentId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Throne',
            abbreviation: 'T',
            type: OrganizationType.BRANCH,
            parentId: imperialRepublic!.id,
        },
    });
    //endregion

    //region Departments
    const irRGov = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Regional Governance',
                parentId: irMoS.id,
            },
        },
        update: {},
        create: {
            name: 'Regional Governance',
            abbreviation: 'RGov',
            type: OrganizationType.DEPARTMENT,
            parentId: irMoS.id,
        },
    });

    const irIntelligence = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Imperial Republic Intelligence Service',
                parentId: irMoS.id,
            },
        },
        update: {},
        create: {
            name: 'Imperial Republic Intelligence Service',
            abbreviation: 'IRIS',
            type: OrganizationType.DEPARTMENT,
            parentId: irMoS.id,
        },
    });

    const irDefOps = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Operations Bureau',
                parentId: irMoD.id
            }
        },
        update: {},
        create: {
            name: 'Operations Bureau',
            abbreviation: 'Ops',
            type: OrganizationType.DEPARTMENT,
            parentId: irMoD.id,
        },
    });

    const irDefIA = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Internal Affairs Bureau',
                parentId: irMoD.id
            }
        },
        update: {},
        create: {
            name: 'Internal Affairs Bureau',
            abbreviation: 'IA',
            type: OrganizationType.DEPARTMENT,
            parentId: irMoD.id,
        },
    });

    const irSecurity = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Imperial Republic Security Bureau',
                parentId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'Imperial Republic Security Bureau',
            abbreviation: 'IRSB',
            type: OrganizationType.DEPARTMENT,
            parentId: irCOMPNOR.id,
        },
    });

    const irJustice = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Ministry of Justice',
                parentId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'Ministry of Justice',
            abbreviation: 'MoJ',
            type: OrganizationType.DEPARTMENT,
            parentId: irCOMPNOR.id,
        },
    });

    const irFinance = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Ministry of Finance',
                parentId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'Ministry of Finance',
            abbreviation: 'MoF',
            type: OrganizationType.DEPARTMENT,
            parentId: irCOMPNOR.id,
        },
    });

    const irHMRG = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'His Majesty\'s Royal Guard',
                parentId: irThrone.id,
            },
        },
        update: {},
        create: {
            name: 'His Majesty\'s Royal Guard',
            abbreviation: 'HMRG',
            type: OrganizationType.DEPARTMENT,
            parentId: irThrone.id,
        },
    });

    const irHMPS = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'His Majesty\'s Personal Staff',
                parentId: irThrone.id,
            },
        },
        update: {},
        create: {
            name: 'His Majesty\'s Personal Staff',
            abbreviation: 'HMPS',
            type: OrganizationType.DEPARTMENT,
            parentId: irThrone.id,
        },
    });

    const irIG = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Inspector General\'s Office',
                parentId: irThrone.id,
            },
        },
        update: {},
        create: {
            name: 'Inspector General\'s Office',
            abbreviation: 'IRIG',
            type: OrganizationType.DEPARTMENT,
            parentId: irThrone.id,
        },
    });

    const irPraetorian = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Praetorian Order',
                parentId: irThrone.id,
            },
        },
        update: {},
        create: {
            name: 'Praetorian Order',
            abbreviation: 'PO',
            type: OrganizationType.DEPARTMENT,
            parentId: irThrone.id,
        },
    });

    const irHighCouncil = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'High Council',
                parentId: irThrone.id,
            },
        },
        update: {},
        create: {
            name: 'High Council',
            abbreviation: 'HC',
            type: OrganizationType.DEPARTMENT,
            parentId: irThrone.id,
        },
    });
    //endregion

    //region Divisions
    const irCoruscantOversector = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Coruscant Oversector',
                parentId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Coruscant Oversector',
            abbreviation: 'COS',
            type: OrganizationType.DIVISION,
            parentId: irRGov.id,
        },
    });

    const irBrightJewelOversector = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Bright Jewel Oversector',
                parentId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Bright Jewel Oversector',
            abbreviation: 'BJOS',
            type: OrganizationType.DIVISION,
            parentId: irRGov.id,
        },
    });

    const irOuterRimOversector = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Outer Rim Oversector',
                parentId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Outer Rim Oversector',
            abbreviation: 'OROS',
            type: OrganizationType.DIVISION,
            parentId: irRGov.id,
        },
    });

    const irIntelOps = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Directorate of Operations',
                parentId: irIntelligence.id,
            },
        },
        update: {},
        create: {
            name: 'Directorate of Operations',
            abbreviation: 'DOO',
            type: OrganizationType.DIVISION,
            parentId: irIntelligence.id,
        },
    });

    const irIntelAnalysis = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Directorate of Analysis',
                parentId: irIntelligence.id,
            },
        },
        update: {},
        create: {
            name: 'Directorate of Analysis',
            abbreviation: 'DOA',
            type: OrganizationType.DIVISION,
            parentId: irIntelligence.id,
        },
    });

    const irIntelCounterIntel = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Directorate of Counterintelligence',
                parentId: irIntelligence.id,
            },
        },
        update: {},
        create: {
            name: 'Directorate of Counterintelligence',
            abbreviation: 'DCI',
            type: OrganizationType.DIVISION,
            parentId: irIntelligence.id,
        },
    });

    const irIntelSupport = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Directorate of Support Services',
                parentId: irIntelligence.id,
            },
        },
        update: {},
        create: {
            name: 'Directorate of Support Services',
            abbreviation: 'DOSS',
            type: OrganizationType.DIVISION,
            parentId: irIntelligence.id,
        },
    });

    const irNavy = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Navy',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Navy',
            abbreviation: 'IRN',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irArmy = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Army',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Army',
            abbreviation: 'IRA',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irMarines = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Marines',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Marines',
            abbreviation: 'IRMC',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irDefSpecialForces = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Defense Special Forces',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Defense Special Forces',
            abbreviation: 'DSF',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irDefIntel = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Military Intelligence',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Military Intelligence',
            abbreviation: 'MI',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irCombatOps = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Combat Operations',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Combat Operations',
            abbreviation: 'COps',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irDefRD = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Research & Development',
                parentId: irDefOps.id,
            },
        },
        update: {},
        create: {
            name: 'Research & Development',
            abbreviation: 'R&D',
            type: OrganizationType.DIVISION,
            parentId: irDefOps.id,
        },
    });

    const irMCIS = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Military Criminal Investigative Service',
                parentId: irDefIA.id,
            },
        },
        update: {},
        create: {
            name: 'Military Criminal Investigative Service',
            abbreviation: 'MCIS',
            type: OrganizationType.DIVISION,
            parentId: irDefIA.id,
        },
    });

    const irMP = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Military Police',
                parentId: irDefIA.id,
            },
        },
        update: {},
        create: {
            name: 'Military Police',
            abbreviation: 'MP',
            type: OrganizationType.DIVISION,
            parentId: irDefIA.id,
        },
    });

    const irRG1D = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "1st Division",
                parentId: irHMRG.id,
            },
        },
        update: {},
        create: {
            name: "1st Division",
            abbreviation: '1D',
            type: OrganizationType.DIVISION,
            parentId: irHMRG.id,
        },
    });

    const irRG2D = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "2nd Division",
                parentId: irHMRG.id,
            },
        },
        update: {},
        create: {
            name: "2nd Division",
            abbreviation: '2D',
            type: OrganizationType.DIVISION,
            parentId: irHMRG.id,
        },
    });

    const irRG3D = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "3rd Division",
                parentId: irHMRG.id,
            },
        },
        update: {},
        create: {
            name: "3rd Division",
            abbreviation: '3D',
            type: OrganizationType.DIVISION,
            parentId: irHMRG.id,
        },
    });

    const irRG4D = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "4th Division",
                parentId: irHMRG.id,
            },
        },
        update: {},
        create: {
            name: "4th Division",
            abbreviation: '4D',
            type: OrganizationType.DIVISION,
            parentId: irHMRG.id,
        },
    });

    const irRG5D = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "5th Division",
                parentId: irHMRG.id,
            },
        },
        update: {},
        create: {
            name: "5th Division",
            abbreviation: '5D',
            type: OrganizationType.DIVISION,
            parentId: irHMRG.id,
        },
    });
    //endregion

    //region Bureaus
    const irDolomarSector = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Dolomar Sector',
                parentId: irCoruscantOversector.id,
            },
        },
        update: {},
        create: {
            name: 'Dolomar Sector',
            abbreviation: 'DS',
            type: OrganizationType.BUREAU,
            parentId: irCoruscantOversector.id,
        },
    });

    const irBormeaSector = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Bormea Sector',
                parentId: irCoruscantOversector.id,
            },
        },
        update: {},
        create: {
            name: 'Bormea Sector',
            abbreviation: 'BS',
            type: OrganizationType.BUREAU,
            parentId: irCoruscantOversector.id,
        },
    });

    const irAzureSector = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Azure Sector',
                parentId: irCoruscantOversector.id,
            },
        },
        update: {},
        create: {
            name: 'Azure Sector',
            abbreviation: 'AS',
            type: OrganizationType.BUREAU,
            parentId: irCoruscantOversector.id,
        },
    });

    const irIntelOpsIOB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Intelligence Operations Bureau',
                parentId: irIntelOps.id,
            },
        },
        update: {},
        create: {
            name: 'Intelligence Operations Bureau',
            abbreviation: 'DOO-IOB',
            type: OrganizationType.BUREAU,
            parentId: irIntelOps.id,
        },
    });

    const irIntelOpsSSB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Security Services Bureau',
                parentId: irIntelOps.id,
            },
        },
        update: {},
        create: {
            name: 'Security Services Bureau',
            abbreviation: 'DOO-SSB',
            type: OrganizationType.BUREAU,
            parentId: irIntelOps.id,
        },
    });

    const irIntelOpsDSB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Diplomatic Services Bureau',
                parentId: irIntelOps.id,
            },
        },
        update: {},
        create: {
            name: 'Diplomatic Services Bureau',
            abbreviation: 'DOO-DSB',
            type: OrganizationType.BUREAU,
            parentId: irIntelOps.id,
        },
    });

    const irIntelOpsIRB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Intergovernmental Relations Bureau',
                parentId: irIntelOps.id,
            },
        },
        update: {},
        create: {
            name: 'Intergovernmental Relations Bureau',
            abbreviation: 'DOO-IRB',
            type: OrganizationType.BUREAU,
            parentId: irIntelOps.id,
        },
    });

    const irIntelAnalysisAB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Analysis Bureau',
                parentId: irIntelAnalysis.id,
            },
        },
        update: {},
        create: {
            name: 'Analysis Bureau',
            abbreviation: 'DOA-AB',
            type: OrganizationType.BUREAU,
            parentId: irIntelAnalysis.id,
        },
    });

    const irIntelAnalysisIB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Information Bureau',
                parentId: irIntelAnalysis.id,
            },
        },
        update: {},
        create: {
            name: 'Information Bureau',
            abbreviation: 'DOA-IB',
            type: OrganizationType.BUREAU,
            parentId: irIntelAnalysis.id,
        },
    });

    const irIntelCounterIntelIOB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Internal Organization Bureau',
                parentId: irIntelCounterIntel.id,
            },
        },
        update: {},
        create: {
            name: 'Internal Organization Bureau',
            abbreviation: 'DCI-IOB',
            type: OrganizationType.BUREAU,
            parentId: irIntelCounterIntel.id,
        },
    });

    const irIntelCounterIntelCIB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Counterintelligence Bureau',
                parentId: irIntelCounterIntel.id,
            },
        },
        update: {},
        create: {
            name: 'Counterintelligence Bureau',
            abbreviation: 'DCI-CIB',
            type: OrganizationType.BUREAU,
            parentId: irIntelCounterIntel.id,
        },
    });

    const irIntelSupportSSB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Support Services Bureau',
                parentId: irIntelCounterIntel.id,
            },
        },
        update: {},
        create: {
            name: 'Support Services Bureau',
            abbreviation: 'DOSS-SSB',
            type: OrganizationType.BUREAU,
            parentId: irIntelCounterIntel.id,
        },
    });

    const irIntelSupportISB = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Intelligence Staffing Bureau',
                parentId: irIntelCounterIntel.id,
            },
        },
        update: {},
        create: {
            name: 'Intelligence Staffing Bureau',
            abbreviation: 'DOSS-ISB',
            type: OrganizationType.BUREAU,
            parentId: irIntelCounterIntel.id,
        },
    });

    const irFirecamTF = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Firecam Task Force',
                parentId: irNavy.id,
            },
        },
        update: {},
        create: {
            name: 'Firecam Task Force',
            abbreviation: 'FTF',
            type: OrganizationType.BUREAU,
            parentId: irNavy.id,
        },
    });

    const irSpineSentinelTF = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Spine Sentinel Task Force',
                parentId: irNavy.id,
            },
        },
        update: {},
        create: {
            name: 'Spine Sentinel Task Force',
            abbreviation: 'SSTF',
            type: OrganizationType.BUREAU,
            parentId: irNavy.id,
        },
    });

    const irRG1L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "1st Legion",
                parentId: irRG1D.id,
            },
        },
        update: {},
        create: {
            name: "1st Legion",
            abbreviation: '1L',
            type: OrganizationType.BUREAU,
            parentId: irRG1D.id,
        },
    });

    const irRG2L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "2nd Legion",
                parentId: irRG1D.id,
            },
        },
        update: {},
        create: {
            name: "2nd Legion",
            abbreviation: '2L',
            type: OrganizationType.BUREAU,
            parentId: irRG1D.id,
        },
    });

    const irRG3L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "3rd Legion",
                parentId: irRG2D.id,
            },
        },
        update: {},
        create: {
            name: "3rd Legion",
            abbreviation: '3L',
            type: OrganizationType.BUREAU,
            parentId: irRG2D.id,
        },
    });

    const irRG4L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "4th Legion",
                parentId: irRG2D.id,
            },
        },
        update: {},
        create: {
            name: "4th Legion",
            abbreviation: '4L',
            type: OrganizationType.BUREAU,
            parentId: irRG2D.id,
        },
    });

    const irRG5L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "5th Legion",
                parentId: irRG3D.id,
            },
        },
        update: {},
        create: {
            name: "5th Legion",
            abbreviation: '5L',
            type: OrganizationType.BUREAU,
            parentId: irRG3D.id,
        },
    });

    const irRG6L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "6th Legion",
                parentId: irRG3D.id,
            },
        },
        update: {},
        create: {
            name: "6th Legion",
            abbreviation: '6L',
            type: OrganizationType.BUREAU,
            parentId: irRG3D.id,
        },
    });

    const irRG7L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "7th Legion",
                parentId: irRG4D.id,
            },
        },
        update: {},
        create: {
            name: "7th Legion",
            abbreviation: '7L',
            type: OrganizationType.BUREAU,
            parentId: irRG4D.id,
        },
    });

    const irRG8L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "8th Legion",
                parentId: irRG4D.id,
            },
        },
        update: {},
        create: {
            name: "8th Legion",
            abbreviation: '8L',
            type: OrganizationType.BUREAU,
            parentId: irRG4D.id,
        },
    });

    const irRG9L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "9th Legion",
                parentId: irRG5D.id,
            },
        },
        update: {},
        create: {
            name: "9th Legion",
            abbreviation: '9L',
            type: OrganizationType.BUREAU,
            parentId: irRG5D.id,
        },
    });

    const irRG10L = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: "10th Legion",
                parentId: irRG5D.id,
            },
        },
        update: {},
        create: {
            name: "10th Legion",
            abbreviation: '10L',
            type: OrganizationType.BUREAU,
            parentId: irRG5D.id,
        },
    });
    //endregion

    //region Sections
    //endregion

    //region Units
    const irin = await prisma.organization.upsert({
        where: {
            name_parentId: {
                name: 'Imperial Republic Information Network',
                parentId: irHMPS.id,
            },
        },
        update: {},
        create: {
            name: 'Imperial Republic Information Network',
            abbreviation: 'IRIN',
            type: OrganizationType.UNIT,
            parentId: irHMPS.id,
        },
    });
    //endregion
    //endregion

    console.log('👤 Seeding Positions...');
    //region Positions
    //region Factions
    //region Leaders
    const irEmperor = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Emperor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Emperor',
            exclusive: true,
            stipend: 0,
            organizationId: imperialRepublic!.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });

    const hapesQueen = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Queen of Hapes',
                organizationId: hapesConsortium!.id,
            },
        },
        update: {},
        create: {
            name: 'Queen of Hapes',
            exclusive: true,
            stipend: 0,
            organizationId: hapesConsortium!.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });
    //endregion

    //region 2ICs
    const irExecutor = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Executor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Executor',
            exclusive: true,
            stipend: 0,
            organizationId: imperialRepublic!.id,
            permissions: {
                create: [
                    {value: Permission.SECOND_IN_COMMAND},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_POSITIONS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_RANKS},
                    {value: Permission.MANAGE_REPORTS},
                    {value: Permission.MANAGE_SECURITY},
                    {value: Permission.OVERRIDE_SECURITY},
                ],
            },
        },
    });
    //endregion

    //region Leadership
    const irEmpress = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Empress',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Empress',
            exclusive: true,
            stipend: 0,
            organizationId: imperialRepublic!.id,
            permissions: {
                create: [
                    {value: Permission.LEADERSHIP},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_REPORTS},
                ],
            },
        },
    });

    const irChancellor = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Supreme Chancellor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Supreme Chancellor',
            exclusive: true,
            stipend: 0,
            organizationId: imperialRepublic!.id,
            permissions: {
                create: [
                    {value: Permission.LEADERSHIP},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_REPORTS},
                ],
            },
        },
    });
    //endregion

    //region Others
    const hapesPrince = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Prince of Hapes',
                organizationId: hapesConsortium!.id,
            },
        },
        update: {},
        create: {
            name: 'Prince of Hapes',
            exclusive: false,
            stipend: 0,
            organizationId: hapesConsortium!.id,
        },
    });

    const irAgentSupremeRuler = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Agent of the Supreme Ruler',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Agent of the Supreme Ruler',
            exclusive: false,
            stipend: 0,
            organizationId: imperialRepublic!.id,
        },
    });
    //endregion
    //endregion

    //region Branches
    //region Leaders
    const irMinisterState = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Grand Minister of State',
                organizationId: irMoS.id,
            },
        },
        update: {},
        create: {
            name: 'Grand Minister of State',
            exclusive: true,
            stipend: 0,
            organizationId: irMoS.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });

    const irMinisterDefense = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Minister of Defense',
                organizationId: irMoD.id,
            },
        },
        update: {},
        create: {
            name: 'Minister of Defense',
            exclusive: true,
            stipend: 0,
            organizationId: irMoD.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });

    const irGrandMinisterCOMPNOR = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Grand Minister of COMPNOR',
                organizationId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'Grand Minister of COMPNOR',
            exclusive: true,
            stipend: 0,
            organizationId: irCOMPNOR.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });

    const irHMCoS = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'His Majesty\'s Chief of Staff',
                organizationId: irThrone.id,
            },
        },
        update: {},
        create: {
            name: 'His Majesty\'s Chief of Staff',
            exclusive: true,
            stipend: 0,
            organizationId: irThrone.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });
    //endregion

    //region 2ICs
    const irViceChancellor = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Vice Chancellor',
                organizationId: irMoS.id,
            },
        },
        update: {},
        create: {
            name: 'Vice Chancellor',
            exclusive: true,
            stipend: 0,
            organizationId: irMoS.id,
            permissions: {
                create: [
                    {value: Permission.SECOND_IN_COMMAND},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_POSITIONS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_RANKS},
                    {value: Permission.MANAGE_REPORTS},
                    {value: Permission.MANAGE_SECURITY},
                    {value: Permission.OVERRIDE_SECURITY},
                ],
            },
        },
    });

    const irDeputyMinisterDefOps = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Minister of Defense',
                organizationId: irMoD.id,
            },
        },
        update: {},
        create: {
            name: 'Minister of Defense',
            exclusive: true,
            stipend: 0,
            organizationId: irMoD.id,
            permissions: {
                create: [
                    {value: Permission.SECOND_IN_COMMAND},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_POSITIONS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_RANKS},
                    {value: Permission.MANAGE_REPORTS},
                    {value: Permission.MANAGE_SECURITY},
                    {value: Permission.OVERRIDE_SECURITY},
                ],
            },
        },
    });

    const irDeputyMinisterDefIA = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Minister of Defense',
                organizationId: irMoD.id,
            },
        },
        update: {},
        create: {
            name: 'Minister of Defense',
            exclusive: true,
            stipend: 0,
            organizationId: irMoD.id,
            permissions: {
                create: [
                    {value: Permission.SECOND_IN_COMMAND},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_POSITIONS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_RANKS},
                    {value: Permission.MANAGE_REPORTS},
                    {value: Permission.MANAGE_SECURITY},
                    {value: Permission.OVERRIDE_SECURITY},
                ],
            },
        },
    });

    const irHighMinisterCOMPNOR = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'High Minister of COMPNOR',
                organizationId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'High Minister of COMPNOR',
            exclusive: true,
            stipend: 0,
            organizationId: irCOMPNOR.id,
            permissions: {
                create: [
                    {value: Permission.SECOND_IN_COMMAND},
                    {value: Permission.MANAGE_MEMBERS},
                    {value: Permission.MANAGE_POSITIONS},
                    {value: Permission.MANAGE_ASSETS},
                    {value: Permission.MANAGE_RANKS},
                    {value: Permission.MANAGE_REPORTS},
                    {value: Permission.MANAGE_SECURITY},
                    {value: Permission.OVERRIDE_SECURITY},
                ],
            },
        },
    });
    //endregion

    //region Leadership
    //endregion

    //region Others
    //endregion
    //endregion

    //region Departments
    //region Leaders
    const irMinisterRGov = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Minister of Regional Governance',
                organizationId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Minister of Regional Governance',
            exclusive: true,
            stipend: 0,
            organizationId: irRGov.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });

    const irMinisterJustice = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Minister of Justice',
                organizationId: irJustice.id,
            },
        },
        update: {},
        create: {
            name: 'Minister of Justice',
            exclusive: true,
            stipend: 0,
            organizationId: irJustice.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });

    const irLordProtector = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Lord Protector',
                organizationId: irPraetorian.id,
            }
        },
        update: {},
        create: {
            name: 'Lord Protector',
            exclusive: true,
            stipend: 0,
            organizationId: irPraetorian.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });
    //endregion

    //region 2ICS
    //endregion

    //region Leadership
    //endregion

    //region Others
    const irPraetorState = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Praetor of State',
                organizationId: irPraetorian.id,
            }
        },
        update: {},
        create: {
            name: 'Praetor of State',
            exclusive: true,
            stipend: 0,
            organizationId: irPraetorian.id,
        },
    });
    //endregion
    //endregion

    //region Divisions
    //region Leaders
    //endregion

    //region 2ICs
    //endregion

    //region Leadership
    //endregion

    //region Others
    //endregion
    //endregion

    //region Bureaus
    //region Leaders
    //endregion

    //region 2ICs
    //endregion

    //region Leadership
    //endregion

    //region Others
    //endregion
    //endregion

    //region Sections
    //region Leaders
    //endregion

    //region 2ICs
    //endregion

    //region Leadership
    //endregion

    //region Others
    //endregion
    //endregion

    //region Units
    //region Leaders
    const directorIRIN = await prisma.position.upsert({
        where: {
            name_organizationId: {
                name: 'Director',
                organizationId: irin.id,
            },
        },
        update: {},
        create: {
            name: 'Director',
            exclusive: true,
            stipend: 0,
            organizationId: irin.id,
            permissions: {
                create: [
                    {value: Permission.LEADER},
                ],
            },
        },
    });
    //endregion

    //region 2ICs
    //endregion

    //region Leadership
    //endregion

    //region Others
    //endregion
    //endregion
    //endregion

    console.log('🏆 Seeding Ranks...');
    //region Ranks
    //region Royal Throne Tier
    const irSupremeRuler = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Supreme Ruler',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Supreme Ruler',
            abbreviation: 'Ruler',
            tier: RankTier.ROYAL_THRONE,
            level: 4,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });

    const irExecutorRank = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Executor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Executor',
            abbreviation: 'Executor',
            tier: RankTier.ROYAL_THRONE,
            level: 3,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });

    const irEmpressRank = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Empress',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Empress',
            abbreviation: 'Empress',
            tier: RankTier.ROYAL_THRONE,
            level: 2,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });

    const irSupremeChancellor = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Supreme Chancellor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Supreme Chancellor',
            abbreviation: 'Supreme Chancellor',
            tier: RankTier.ROYAL_THRONE,
            level: 1,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });
    //endregion

    //region High Command Tier
    //region 7
    const irPraetor = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Praetor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Praetor',
            abbreviation: 'Praetor',
            tier: RankTier.HIGH_COMMAND,
            level: 7,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });
    //endregion

    //region 6
    const irHighCouncilor = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'High Councilor',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'High Councilor',
            abbreviation: 'Councilor',
            tier: RankTier.HIGH_COMMAND,
            level: 6,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });

    const irGrandMinister = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Grand Minister',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Grand Minister',
            abbreviation: 'G.Min',
            tier: RankTier.HIGH_COMMAND,
            level: 6,
            salary: 0,
            organizationId: imperialRepublic!.id,
        },
    });

    const irChiefOfStaff = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Chief of Staff',
                organizationId: imperialRepublic!.id,
            },
        },
        update: {},
        create: {
            name: 'Chief of Staff',
            abbreviation: 'CoS',
            tier: RankTier.HIGH_COMMAND,
            level: 6,
            salary: 0,
            organizationId: imperialRepublic.id,
        },
    });
    //endregion

    //region 5
    const irViceChancellorRank = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Vice Chancellor',
                organizationId: irMoS.id,
            },
        },
        update: {},
        create: {
            name: 'Vice Chancellor',
            abbreviation: 'V.Chancellor',
            tier: RankTier.HIGH_COMMAND,
            level: 5,
            salary: 0,
            organizationId: irMoS.id,
        },
    });
    //endregion

    //region 4
    const irLordMoff = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Lord Moff',
                organizationId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Lord Moff',
            abbreviation: 'L.Moff',
            tier: RankTier.HIGH_COMMAND,
            level: 4,
            salary: 0,
            organizationId: irRGov.id,
        },
    });

    const irLordAdmiral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Lord Admiral',
                organizationId: irNavy.id,
            },
        },
        update: {},
        create: {
            name: 'Lord Admiral',
            abbreviation: 'L.Adm',
            tier: RankTier.HIGH_COMMAND,
            level: 4,
            salary: 0,
            organizationId: irNavy.id,
        },
    });

    const irLordGeneral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Lord General',
                organizationId: irArmy.id,
            },
        },
        update: {},
        create: {
            name: 'Lord General',
            abbreviation: 'L.Gen',
            tier: RankTier.HIGH_COMMAND,
            level: 4,
            salary: 0,
            organizationId: irArmy.id,
        },
    });

    const irLordMarshal = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Lord Marshal',
                organizationId: irMarines.id,
            },
        },
        update: {},
        create: {
            name: 'Lord Marshal',
            abbreviation: 'L.Mshl',
            tier: RankTier.HIGH_COMMAND,
            level: 4,
            salary: 0,
            organizationId: irMarines.id,
        },
    });
    //endregion

    //region 3
    const irGrandMoff = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Grand Moff',
                organizationId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Grand Moff',
            abbreviation: 'G.Moff',
            tier: RankTier.HIGH_COMMAND,
            level: 3,
            salary: 0,
            organizationId: irRGov.id,
        },
    });

    const irGrandAdmiral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Grand Admiral',
                organizationId: irNavy.id,
            },
        },
        update: {},
        create: {
            name: 'Grand Admiral',
            abbreviation: 'G.Adm',
            tier: RankTier.HIGH_COMMAND,
            level: 3,
            salary: 0,
            organizationId: irNavy.id,
        },
    });

    const irGrandGeneral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Grand General',
                organizationId: irArmy.id,
            },
        },
        update: {},
        create: {
            name: 'Grand General',
            abbreviation: 'G.Gen',
            tier: RankTier.HIGH_COMMAND,
            level: 3,
            salary: 0,
            organizationId: irArmy.id,
        },
    });

    const irGrandMarshal = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Grand Marshal',
                organizationId: irMarines.id,
            },
        },
        update: {},
        create: {
            name: 'Grand Marshal',
            abbreviation: 'G.Mshl',
            tier: RankTier.HIGH_COMMAND,
            level: 3,
            salary: 0,
            organizationId: irMarines.id,
        },
    });
    //endregion

    //region 2
    const irHighMoff = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'High Moff',
                organizationId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'High Moff',
            abbreviation: 'H.Moff',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irRGov.id,
        },
    });

    const irHighAdmiral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'High Admiral',
                organizationId: irNavy.id,
            },
        },
        update: {},
        create: {
            name: 'High Admiral',
            abbreviation: 'H.Adm',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irNavy.id,
        },
    });

    const irHighGeneral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'High General',
                organizationId: irArmy.id,
            },
        },
        update: {},
        create: {
            name: 'High General',
            abbreviation: 'H.Gen',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irArmy.id,
        },
    });

    const irHighMarshal = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'High Marshal',
                organizationId: irMarines.id,
            },
        },
        update: {},
        create: {
            name: 'High Marshal',
            abbreviation: 'H.Mshl',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irMarines.id,
        },
    });

    const irHighMinister = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'High Minister',
                organizationId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'High Minister',
            abbreviation: 'H.Min',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irCOMPNOR.id,
        },
    });

    const irDeputyChiefOfStaff = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Deputy Chief of Staff',
                organizationId: irHMPS.id,
            },
        },
        update: {},
        create: {
            name: 'Deputy Chief of Staff',
            abbreviation: 'D.CoS',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irHMPS.id,
        },
    });

    const irCommandant = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Commandant',
                organizationId: irHMRG.id,
            },
        },
        update: {},
        create: {
            name: 'Commandant',
            abbreviation: 'Comdt',
            tier: RankTier.HIGH_COMMAND,
            level: 2,
            salary: 0,
            organizationId: irHMRG.id,
        },
    });
    //endregion

    //region 1
    const irStateMinister = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Minister',
                organizationId: irMoS.id,
            },
        },
        update: {},
        create: {
            name: 'Minister',
            abbreviation: 'Min',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irMoS.id,
        },
    });

    const irMoff = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Moff',
                organizationId: irRGov.id,
            },
        },
        update: {},
        create: {
            name: 'Moff',
            abbreviation: 'Moff',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irRGov.id,
        },
    });

    const irDirector = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Director',
                organizationId: irIntelligence.id,
            },
        },
        update: {},
        create: {
            name: 'Director',
            abbreviation: 'Dir',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irIntelligence.id,
        },
    });

    const irFleetAdmiral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Fleet Admiral',
                organizationId: irNavy.id,
            },
        },
        update: {},
        create: {
            name: 'Fleet Admiral',
            abbreviation: 'F.Adm',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irNavy.id,
        },
    });

    const irSurfaceMarshal = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Surface Marshal',
                organizationId: irArmy.id,
            },
        },
        update: {},
        create: {
            name: 'Surface Marshal',
            abbreviation: 'S.Mshl',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irArmy.id,
        },
    });

    const irMarshal = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Marshal',
                organizationId: irMarines.id,
            },
        },
        update: {},
        create: {
            name: 'Marshal',
            abbreviation: 'Mshl',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irMarines.id,
        },
    });

    const irCOMPNORMinister = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Minister',
                organizationId: irCOMPNOR.id,
            },
        },
        update: {},
        create: {
            name: 'Minister',
            abbreviation: 'Min',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irCOMPNOR.id,
        },
    });

    const irDirectorGeneral = await prisma.rank.upsert({
        where: {
            name_organizationId: {
                name: 'Director-General',
                organizationId: irSecurity.id,
            },
        },
        update: {},
        create: {
            name: 'Director-General',
            abbreviation: 'D.Gen',
            tier: RankTier.HIGH_COMMAND,
            level: 1,
            salary: 0,
            organizationId: irSecurity.id,
        },
    });
    //endregion
    //endregion

    //region Command Tier
    //region 6
    //endregion

    //region 5
    //endregion

    //region 4
    //endregion

    //region 3
    //endregion

    //region 2
    //endregion

    //region 1
    //endregion
    //endregion

    //region Officer Tier
    //region 6
    //endregion

    //region 5
    //endregion

    //region 4
    //endregion

    //region 3
    //endregion

    //region 2
    //endregion

    //region 1
    //endregion
    //endregion

    //region Enlisted Tier
    //region7
    //endregion

    //region 6
    //endregion

    //region 5
    //endregion

    //region 4
    //endregion

    //region 3
    //endregion

    //region 2
    //endregion

    //region 1
    //endregion
    //endregion
    //endregion

    console.log('⚔️ Seeding Force Orders...');
    //region Force Orders
    const shadowJediOrder = await prisma.forceOrder.upsert({
        where: {
            name: 'Shadow Jedi Order',
        },
        update: {},
        create: {
            name: 'Shadow Jedi Order',
            alignment: Alignment.NEUTRAL,
        },
    });

    const jediOrder = await prisma.forceOrder.upsert({
        where: {
            name: 'Jedi Order',
        },
        update: {},
        create: {
            name: 'Jedi Order',
            alignment: Alignment.LIGHT,
        },
    });

    const orderOfTheSith = await prisma.forceOrder.upsert({
        where: {
            name: 'Order of the Sith',
        },
        update: {},
        create: {
            name: 'Order of the Sith',
            alignment: Alignment.DARK,
        },
    });
    //endregion

    console.log('🎖️ Seeding Force Titles...');
    //region Force Titles
    //region Shadow Jedi Order
    const sjoInitiate = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.INITIATE,
                orderId: shadowJediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.INITIATE,
            title: 'Shadow Jedi Initiate',
            orderId: shadowJediOrder.id,
        },
    });

    const sjoStudent = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.STUDENT,
                orderId: shadowJediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.STUDENT,
            title: 'Shadow Jedi Padawan',
            orderId: shadowJediOrder.id,
        },
    });

    const sjoKnight = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.KNIGHT,
                orderId: shadowJediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.KNIGHT,
            title: 'Shadow Jedi Knight',
            orderId: shadowJediOrder.id,
        },
    });

    const sjoMaster = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.MASTER,
                orderId: shadowJediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.MASTER,
            title: 'Shadow Jedi Master',
            orderId: shadowJediOrder.id,
        },
    });

    const sjoGrandmaster = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.GRANDMASTER,
                orderId: shadowJediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.GRANDMASTER,
            title: 'Shadow Jedi Grandmaster',
            orderId: shadowJediOrder.id,
        },
    });
    //endregion

    //region Jedi Order
    const joInitiate = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.INITIATE,
                orderId: jediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.INITIATE,
            title: 'Jedi Initiate',
            orderId: jediOrder.id,
        },
    });

    const joStudent = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.STUDENT,
                orderId: jediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.STUDENT,
            title: 'Jedi Padawan',
            orderId: jediOrder.id,
        },
    });

    const joKnight = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.KNIGHT,
                orderId: jediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.KNIGHT,
            title: 'Jedi Knight',
            orderId: jediOrder.id,
        },
    });

    const joMaster = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.MASTER,
                orderId: jediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.MASTER,
            title: 'Jedi Master',
            orderId: jediOrder.id,
        },
    });

    const joGrandmaster = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.GRANDMASTER,
                orderId: jediOrder.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.GRANDMASTER,
            title: 'Jedi Grandmaster',
            orderId: jediOrder.id,
        },
    });
    //endregion

    //region Order of the Sith
    const sithInitiate = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.INITIATE,
                orderId: orderOfTheSith.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.INITIATE,
            title: 'Acolyte',
            orderId: orderOfTheSith.id,
        },
    });

    const sithStudent = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.STUDENT,
                orderId: orderOfTheSith.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.STUDENT,
            title: 'Apprentice',
            orderId: orderOfTheSith.id,
        },
    });

    const sithKnight = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.KNIGHT,
                orderId: orderOfTheSith.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.KNIGHT,
            title: 'Sith Lord',
            orderId: orderOfTheSith.id,
        },
    });

    const sithMaster = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.MASTER,
                orderId: orderOfTheSith.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.MASTER,
            title: 'Darth',
            orderId: orderOfTheSith.id,
        },
    });

    const sithGrandmaster = await prisma.forceTitle.upsert({
        where: {
            level_orderId: {
                level: ForceLevel.GRANDMASTER,
                orderId: orderOfTheSith.id,
            },
        },
        update: {},
        create: {
            level: ForceLevel.GRANDMASTER,
            title: 'Dark Lord',
            orderId: orderOfTheSith.id,
        },
    });
    //endregion
    //endregion

    console.log('⚡ Seeding Force Abilities...');
    //region Force Abilities
    //endregion

    console.log('👨‍💼Seeding Characters...');
    //region Characters
    const jamesStratus = await prisma.character.upsert({
        where: {
            name: 'James T. Stratus'
        },
        update: {},
        create: {
            name: 'James T. Stratus',
            gender: Gender.MALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/jstratus.jpg',
            speciesId: human.id,
            homeworldId: kuat.id,
            clearanceId: alphaPrime.id,
            forceProfile: {
                create: {
                    alignment: Alignment.NEUTRAL,
                    level: ForceLevel.GRANDMASTER,
                    aware: true,
                    orderId: shadowJediOrder.id,
                },
            },
        },
    });

    const tavriaTreyson = await prisma.character.upsert({
        where: {
            name: 'Tavria Treyson'
        },
        update: {},
        create: {
            name: 'Tavria Treyson',
            gender: Gender.FEMALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/tavria.jpg',
            speciesId: human.id,
            homeworldId: maires.id,
            clearanceId: alphaGold.id,
            peerage: {
                create: {
                    peerageRank: DomainRank.DUCHY,
                    domainId: maires.id,
                },
            },
        },
    });

    const danaStratus = await prisma.character.upsert({
        where: {
            name: 'Dana Lance Stratus'
        },
        update: {},
        create: {
            name: 'Dana Lance Stratus',
            gender: Gender.FEMALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/dana.png',
            speciesId: human.id,
            homeworldId: deepSpace.id,
            clearanceId: alphaGold.id,
        },
    });

    const deneCognatus = await prisma.character.upsert({
        where: {
            name: 'Dene Vye Cognatus'
        },
        update: {},
        create: {
            name: 'Dene Vye Cognatus',
            gender: Gender.MALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/dene.png',
            speciesId: human.id,
            homeworldId: kuat.id,
            clearanceId: alphaGold.id,
        },
    });

    const phoenixChume = await prisma.character.upsert({
        where: {
            name: 'Phoenix Chume'
        },
        update: {},
        create: {
            name: 'Phoenix Chume',
            gender: Gender.FEMALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/phoenix.png',
            speciesId: human.id,
            homeworldId: hapes.id,
            peerage: {
                create: {
                    peerageRank: DomainRank.KINGDOM,
                    domainId: hapes.id,
                },
            },
        },
    });

    const lanKlone = await prisma.character.upsert({
        where: {
            name: 'Lan Klone'
        },
        update: {},
        create: {
            name: 'Lan Klone',
            gender: Gender.MALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/lan.png',
            speciesId: human.id,
            homeworldId: tatooine.id,
            clearanceId: alphaBlue.id,
            peerage: {
                create: {
                    peerageRank: DomainRank.MARQUESSATE,
                    domainId: sullust.id,
                },
            },
        },
    });

    const terrisaKlone = await prisma.character.upsert({
        where: {
            name: 'Terrisa Klone'
        },
        update: {},
        create: {
            name: 'Terrisa Klone',
            gender: Gender.FEMALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/terrisa.png',
            speciesId: human.id,
            homeworldId: corellia.id,
            clearanceId: alphaBlue.id,
            peerage: {
                create: {
                    honoraryTitle: HonoraryTitle.LADY,
                },
            },
        },
    });

    const alexanderMarcov = await prisma.character.upsert({
        where: {
            name: 'Alexander Marcov'
        },
        update: {},
        create: {
            name: 'Alexander Marcov',
            gender: Gender.MALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/alex.png',
            speciesId: human.id,
            homeworldId: corellia.id,
        },
    });

    const saikaAlberoz = await prisma.character.upsert({
        where: {
            name: 'Saika Alberoz'
        },
        update: {},
        create: {
            name: 'Saika Alberoz',
            gender: Gender.FEMALE,
            status: CharacterStatus.ACTIVE,
            currentSequence: 0,
            avatarLink: 'https://images.eotir.com/avatars/saika.png',
            speciesId: human.id,
            homeworldId: coruscant.id,
            clearanceId: betaCrimson.id,
            forceProfile: {
                create: {
                    alignment: Alignment.NEUTRAL,
                    level: ForceLevel.KNIGHT,
                    aware: true,
                    orderId: shadowJediOrder.id,
                },
            },
        },
    });
    //endregion

    console.log('➕ Seeding Character memberships...');
    const memberships = await Promise.all([
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: jamesStratus.id,
                    organizationId: imperialRepublic!.id,
                },
            },
            update: {},
            create: {
                characterId: jamesStratus.id,
                organizationId: imperialRepublic!.id,
                primaryMembership: true,
                rankId: irSupremeRuler.id,
                positionId: irEmperor.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: tavriaTreyson.id,
                    organizationId: imperialRepublic!.id,
                },
            },
            update: {},
            create: {
                characterId: tavriaTreyson.id,
                organizationId: imperialRepublic!.id,
                primaryMembership: true,
                rankId: irExecutorRank.id,
                positionId: irExecutor.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: tavriaTreyson.id,
                    organizationId: irCOMPNOR.id,
                },
            },
            update: {},
            create: {
                characterId: tavriaTreyson.id,
                organizationId: irCOMPNOR.id,
                primaryMembership: false,
                rankId: irExecutorRank.id,
                positionId: irGrandMinisterCOMPNOR.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: danaStratus.id,
                    organizationId: imperialRepublic!.id,
                },
            },
            update: {},
            create: {
                characterId: danaStratus.id,
                organizationId: imperialRepublic!.id,
                primaryMembership: true,
                rankId: irEmpressRank.id,
                positionId: irEmpress.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: deneCognatus.id,
                    organizationId: imperialRepublic!.id,
                },
            },
            update: {},
            create: {
                characterId: deneCognatus.id,
                organizationId: imperialRepublic!.id,
                primaryMembership: true,
                rankId: irSupremeChancellor.id,
                positionId: irChancellor.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: deneCognatus.id,
                    organizationId: irMoS.id,
                },
            },
            update: {},
            create: {
                characterId: deneCognatus.id,
                organizationId: irMoS.id,
                primaryMembership: false,
                rankId: irSupremeChancellor.id,
                positionId: irMinisterState.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: phoenixChume.id,
                    organizationId: hapesConsortium!.id,
                },
            },
            update: {},
            create: {
                characterId: phoenixChume.id,
                organizationId: hapesConsortium!.id,
                primaryMembership: true,
                positionId: hapesQueen.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: lanKlone.id,
                    organizationId: irPraetorian.id,
                },
            },
            update: {},
            create: {
                characterId: lanKlone.id,
                organizationId: irPraetorian.id,
                primaryMembership: true,
                rankId: irPraetor.id,
                positionId: irPraetorState.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: lanKlone.id,
                    organizationId: irRGov.id,
                },
            },
            update: {},
            create: {
                characterId: lanKlone.id,
                organizationId: irRGov.id,
                primaryMembership: false,
                rankId: irLordMoff.id,
                positionId: irMinisterRGov.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: terrisaKlone.id,
                    organizationId: imperialRepublic!.id,
                },
            },
            update: {},
            create: {
                characterId: terrisaKlone.id,
                organizationId: imperialRepublic!.id,
                primaryMembership: false,
                rankId: irChiefOfStaff.id,
                positionId: irAgentSupremeRuler.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: terrisaKlone.id,
                    organizationId: irThrone.id,
                },
            },
            update: {},
            create: {
                characterId: terrisaKlone.id,
                organizationId: irThrone.id,
                primaryMembership: false,
                rankId: irChiefOfStaff.id,
                positionId: irHMCoS.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: terrisaKlone.id,
                    organizationId: irHMPS.id,
                },
            },
            update: {},
            create: {
                characterId: terrisaKlone.id,
                organizationId: irHMPS.id,
                primaryMembership: true,
                rankId: irChiefOfStaff.id,
                positionId: irHMCoS.id,
            },
        }),
        prisma.member.upsert({
            where: {
                characterId_organizationId: {
                    characterId: alexanderMarcov.id,
                    organizationId: irJustice.id,
                },
            },
            update: {},
            create: {
                characterId: alexanderMarcov.id,
                organizationId: irJustice.id,
                primaryMembership: true,
                rankId: irCOMPNORMinister.id,
                positionId: irMinisterJustice.id,
            },
        }),
    ]);

    console.log('🛠️ Seeding Item Models...');
    //region Item Models
    //endregion

    console.log('🚀 Seeding Ship Models...');
    //region Ship Models
    //endregion

    console.log('🚗 Seeding Vehicle Models...');
    //region Vehicle Models
    //endregion

    console.log('👥 Seeding Staff Teams...');
    const teams = await Promise.all([
        prisma.team.upsert({
            where: {name: 'Publishing, Authoring and Review Team'},
            update: {},
            create: {
                name: 'Publishing, Authoring and Review Team',
                abbreviation: 'PART',
                currentSequence: 0,
            },
        }),
        prisma.team.upsert({
            where: {name: 'Character Administration Team'},
            update: {},
            create: {
                name: 'Character Administration Team',
                abbreviation: 'CAT',
                currentSequence: 0,
            },
        }),
        prisma.team.upsert({
            where: {name: 'Scenario Moderation, Approvals, & Regulations Team'},
            update: {},
            create: {
                name: 'Scenario Moderation, Approvals, & Regulations Team',
                abbreviation: 'SMART',
                currentSequence: 0,
            },
        }),
        prisma.team.upsert({
            where: {name: 'Force Administration & Training Enforcement'},
            update: {},
            create: {
                name: 'Force Administration & Training Enforcement',
                abbreviation: 'FATE',
                currentSequence: 0,
            },
        }),
        prisma.team.upsert({
            where: {name: 'Technology Operations Control'},
            update: {},
            create: {
                name: 'Technology Operations Control',
                abbreviation: 'TOC',
                currentSequence: 0,
            },
        }),
    ]);

    console.log('📄 Seeding Organization Document Types...');
    const documentTypes = await Promise.all([
        prisma.documentType.upsert({
            where: {name: 'Supreme Command'},
            update: {},
            create: {
                name: 'Supreme Command',
                abbreviation: 'COM',
                sequenced: true,
                useOrganization: true,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Executive Order'},
            update: {},
            create: {
                name: 'Executive Order',
                abbreviation: 'EXO',
                sequenced: true,
                useOrganization: false,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Law'},
            update: {},
            create: {
                name: 'Law',
                abbreviation: 'LAW',
                sequenced: true,
                useOrganization: false,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Defense'},
            update: {},
            create: {
                name: 'Defense',
                abbreviation: 'DEF',
                sequenced: false,
                useOrganization: true,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Intelligence'},
            update: {},
            create: {
                name: 'Intelligence',
                abbreviation: 'INT',
                sequenced: false,
                useOrganization: true,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Security'},
            update: {},
            create: {
                name: 'Security',
                abbreviation: 'SEC',
                sequenced: false,
                useOrganization: true,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Government'},
            update: {},
            create: {
                name: 'Government',
                abbreviation: 'GOV',
                sequenced: true,
                useOrganization: true,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Financial'},
            update: {},
            create: {
                name: 'Financial',
                abbreviation: 'FIN',
                sequenced: true,
                useOrganization: true,
            },
        }),
        prisma.documentType.upsert({
            where: {name: 'Business'},
            update: {},
            create: {
                name: 'Business',
                abbreviation: 'BUS',
                sequenced: true,
                useOrganization: true,
            },
        }),
    ]);

    console.log('🏅 Seeding Awards and Award Tiers...');
    //region Awards
    //region Base Awards
    //endregion

    //region Award Tiers
    //endregion
    //endregion
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });