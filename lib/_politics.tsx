import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';

// Senator operations
export async function getAllSenators() {
    return prisma.senator.findMany({
        include: {
            planet: {
                select: {
                    id: true,
                    name: true
                }
            },
            committee: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        },
        orderBy: [
            { seatType: 'desc' },
            { name: 'asc' }
        ]
    });
}

export async function getSenatorById(id: bigint) {
    return prisma.senator.findUnique({
        where: { id },
        include: {
            planet: {
                select: {
                    id: true,
                    name: true
                }
            },
            committee: {
                select: {
                    id: true,
                    name: true,
                    color: true,
                    temporary: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            },
            chairCommittee: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            },
            viceChairCommittee: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            }
        }
    });
}

export async function getSenatorByUserId(userId: string) {
    return prisma.senator.findUnique({
        where: { userId },
        include: {
            planet: {
                select: {
                    id: true,
                    name: true
                }
            },
            committee: {
                select: {
                    id: true,
                    name: true,
                    color: true
                }
            },
            chairCommittee: {
                select: {
                    id: true,
                    name: true
                }
            },
            viceChairCommittee: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
}

export async function createSenator(data: {
    name: string;
    seatType: 'NONE' | 'ELECTED' | 'APPOINTED';
    planetId: bigint;
    userId?: string;
    committeeId?: bigint;
}) {
    return prisma.senator.create({
        data: {
            name: data.name,
            seatType: data.seatType,
            planetId: data.planetId,
            userId: data.userId,
            committeeId: data.committeeId
        },
        include: {
            planet: {
                select: {
                    id: true,
                    name: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        }
    });
}

export async function updateSenator(id: bigint, data: {
    name?: string;
    seatType?: 'NONE' | 'ELECTED' | 'APPOINTED';
    planetId?: bigint;
    userId?: string;
    committeeId?: bigint;
}) {
    return prisma.senator.update({
        where: { id },
        data,
        include: {
            planet: {
                select: {
                    id: true,
                    name: true
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        }
    });
}

export async function deleteSenator(id: bigint) {
    return prisma.senator.delete({
        where: { id }
    });
}

// Senate Committee operations
export async function getAllSenateCommittees() {
    return prisma.senateCommittee.findMany({
        include: {
            chair: {
                select: {
                    id: true,
                    name: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            },
            viceChair: {
                select: {
                    id: true,
                    name: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            },
            senators: {
                select: {
                    id: true,
                    name: true,
                    seatType: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            },
            _count: {
                select: {
                    senators: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
}

export async function getSenateCommitteeById(id: bigint) {
    return prisma.senateCommittee.findUnique({
        where: { id },
        include: {
            chair: {
                select: {
                    id: true,
                    name: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    }
                }
            },
            viceChair: {
                select: {
                    id: true,
                    name: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    }
                }
            },
            senators: {
                select: {
                    id: true,
                    name: true,
                    seatType: true,
                    planet: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            }
        }
    });
}

export async function createSenateCommittee(data: {
    name: string;
    color?: string;
    temporary?: boolean;
    chairId?: bigint;
    viceChairId?: bigint;
}) {
    return prisma.senateCommittee.create({
        data: {
            name: data.name,
            color: data.color,
            temporary: data.temporary ?? false,
            chairId: data.chairId,
            viceChairId: data.viceChairId
        },
        include: {
            chair: {
                select: {
                    id: true,
                    name: true
                }
            },
            viceChair: {
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: {
                    senators: true
                }
            }
        }
    });
}

export async function updateSenateCommittee(id: bigint, data: {
    name?: string;
    color?: string;
    temporary?: boolean;
    chairId?: bigint;
    viceChairId?: bigint;
}) {
    return prisma.senateCommittee.update({
        where: { id },
        data,
        include: {
            chair: {
                select: {
                    id: true,
                    name: true
                }
            },
            viceChair: {
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: {
                    senators: true
                }
            }
        }
    });
}

export async function deleteSenateCommittee(id: bigint) {
    return prisma.senateCommittee.delete({
        where: { id }
    });
}


// Access control helpers
export async function userHasSenateAccess(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
            id: true,
            role: true,
            senator: {
                select: { id: true }
            },
            characters: {
                select: {
                    memberships: {
                        select: {
                            position: {
                                select: {
                                    id: true,
                                    senateSupremeRulerSetting: true,
                                    senatePresidentSetting: true,
                                    senateVicePresidentSetting: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) return false;

    // Admins always have access
    if (user.role === 'SYSTEM_ADMIN' || user.role === 'ADMIN') return true;

    // Users with a senator have access
    if (user.senator) return true;

    // Users with characters holding senate positions have access
    const hasSenatePosition = user.characters.some(character => 
        character.memberships.some(membership => 
            membership.position && (
                membership.position.senateSupremeRulerSetting ||
                membership.position.senatePresidentSetting ||
                membership.position.senateVicePresidentSetting
            )
        )
    );

    return hasSenatePosition;
}

export async function userHasHighCouncilAccess(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
            id: true,
            role: true,
            characters: {
                select: {
                    memberships: {
                        select: {
                            position: {
                                select: {
                                    id: true,
                                    hcChairmanSetting: true,
                                    hcViceChairmanSetting: true,
                                    hcCouncilorSetting: true,
                                    hcHonoraryCouncilorSetting: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) return false;

    // Admins always have access
    if (user.role === 'SYSTEM_ADMIN' || user.role === 'ADMIN') return true;

    // Users with characters holding high council positions have access
    const hasHighCouncilPosition = user.characters.some(character => 
        character.memberships.some(membership => 
            membership.position && (
                membership.position.hcChairmanSetting ||
                membership.position.hcViceChairmanSetting ||
                membership.position.hcCouncilorSetting ||
                membership.position.hcHonoraryCouncilorSetting
            )
        )
    );

    return hasHighCouncilPosition;
}

// Public data for politics hub
export async function getPoliticsHubData() {
    const [senators, committees] = await Promise.all([
        getAllSenators(),
        getAllSenateCommittees()
    ]);

    return {
        senators,
        committees
    };
}