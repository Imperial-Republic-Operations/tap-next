import { prisma } from '@/lib/prisma';

// Senate Settings operations
export async function getSenateSettings() {
    return prisma.senateSettings.findUnique({
        where: { id: 1 },
        include: {
            supremeRulerPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            },
            presidentPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            },
            vicePresidentPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            }
        }
    });
}

export async function updateSenateSettings(data: {
    supremeRulerPositionId?: bigint;
    presidentPositionId?: bigint;
    vicePresidentPositionId?: bigint;
}) {
    return prisma.senateSettings.update({
        where: { id: 1 },
        data,
        include: {
            supremeRulerPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            },
            presidentPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            },
            vicePresidentPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            }
        }
    });
}

// High Council Settings operations
export async function getHighCouncilSettings() {
    return prisma.highCouncilSettings.findUnique({
        where: { id: 1 },
        include: {
            chairmanPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            },
            viceChairmanPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            },
            highCouncilorPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            },
            honoraryHighCouncilorPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    },
                    members: {
                        select: {
                            character: {
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
                            }
                        }
                    }
                }
            }
        }
    });
}

export async function updateHighCouncilSettings(data: {
    chairmanPositionId?: bigint;
    viceChairmanPositionId?: bigint;
    highCouncilorPositionId?: bigint;
    honoraryHighCouncilorPositionId?: bigint;
}) {
    return prisma.highCouncilSettings.update({
        where: { id: 1 },
        data,
        include: {
            chairmanPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            },
            viceChairmanPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            },
            highCouncilorPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            },
            honoraryHighCouncilorPosition: {
                include: {
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true
                        }
                    }
                }
            }
        }
    });
}

// Teams Settings operations
export async function getTeamsSettings() {
    return prisma.teamsSettings.findUnique({
        where: { id: 1 },
        include: {
            characterTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                    admin: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    },
                    members: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            },
            moderationTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                    admin: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    },
                    members: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            },
            forceTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                    admin: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    },
                    members: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            },
            operationsTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                    admin: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    },
                    members: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            },
            publicationTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                    admin: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    },
                    members: {
                        select: {
                            id: true,
                            name: true,
                            username: true
                        }
                    }
                }
            }
        }
    });
}

export async function updateTeamsSettings(data: {
    characterTeamId?: bigint;
    moderationTeamId?: bigint;
    forceTeamId?: bigint;
    operationsTeamId?: bigint;
    publicationTeamId?: bigint;
}) {
    return prisma.teamsSettings.update({
        where: { id: 1 },
        data,
        include: {
            characterTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true
                }
            },
            moderationTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true
                }
            },
            forceTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true
                }
            },
            operationsTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true
                }
            },
            publicationTeam: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true
                }
            }
        }
    });
}